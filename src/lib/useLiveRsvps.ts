import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useIsFocused } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useAuth } from './auth';
import { concernsRuns, createCoalescer, type RsvpEvent } from './liveRsvps';
import { supabase } from './supabase';

/** After an event, wait this long before refetching, so a burst of events is one refetch. */
const COALESCE_MS = 300;

/** true while the app is in the foreground (native) or the browser tab is visible (web: React Native
 *  Web maps AppState to the page's `visibilitychange` event). */
function useAppActive() {
  const [active, setActive] = useState(AppState.currentState !== 'background');
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => setActive(state !== 'background'));
    return () => sub?.remove();
  }, []);
  return active;
}

/** Keeps a screen's RSVP data fresh: when anyone says yes or no to one of `runIds`, the queries under
 *  `queryKey` are refetched. Opens ONE Realtime channel for the whole screen (call this once per screen,
 *  never per card). The channel exists only while the screen is focused and the app/tab is visible;
 *  when it comes back the channel is re-created and the data is refetched to catch up on what was missed.
 *  Home uses it now; Run detail (T-18) can call it with its own key. */
export function useLiveRsvps(queryKey: QueryKey, runIds: readonly string[]) {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;
  const focused = useIsFocused();
  const appActive = useAppActive();
  const live = !!userId && focused && appActive;

  // The effect below must not restart every time the list of runs changes, so it reads the latest
  // values through refs instead of closing over them.
  const runIdsRef = useRef(runIds);
  const queryKeyRef = useRef(queryKey);
  useEffect(() => {
    runIdsRef.current = runIds;
    queryKeyRef.current = queryKey;
  });

  useEffect(() => {
    if (!live) return;

    const refresh = createCoalescer(() => {
      // My own save is in flight or queued (see useRsvp): the card already shows my answer, and
      // useRsvp refetches once the last save is done. A refetch now could bring back the older
      // answer. Dropping this is safe because that final refetch also picks up everyone else's changes.
      if (queryClient.isMutating({ mutationKey: ['rsvp'] }) > 0) return;
      void queryClient.invalidateQueries({ queryKey: queryKeyRef.current });
    }, COALESCE_MS);

    const channel = supabase
      .channel('rsvps-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvps' }, (payload) => {
        if (concernsRuns(payload as RsvpEvent, runIdsRef.current)) refresh.trigger();
      })
      .subscribe((status) => {
        // SUBSCRIBED fires on the first connect and again after every reconnect. Anything that changed
        // before we were listening (or while the tab slept) never produced an event for us, so refetch.
        if (status === 'SUBSCRIBED') refresh.trigger();
      });

    // Cleanup: runs when the screen loses focus, the tab hides, the user changes, or the screen unmounts.
    return () => {
      refresh.cancel();
      void supabase.removeChannel(channel);
    };
  }, [live, userId, queryClient]);
}

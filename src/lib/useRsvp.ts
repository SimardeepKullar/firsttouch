import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useAuth } from './auth';
import { applyRsvp, type RsvpPerson } from './homeRuns';
import { rsvpErrorMessage } from './rsvpError';
import { supabase } from './supabase';
import type { HomeData } from './useHome';
import { useMe } from './useMe';

type Snapshot = [QueryKey, HomeData | undefined][];

/** Says yes or no to one run: `rsvp.mutate(true)` is "I'm in", `rsvp.mutate(false)` is "I'm out".
 *  The card updates at once; the save happens behind it; if the database refuses, the card goes back
 *  and `rsvp.errorMessage` says why. */
export function useRsvp(runId: string) {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const me = useMe();
  const userId = session?.user.id;
  const mutationKey = ['rsvp', runId];

  const mutation = useMutation({
    mutationKey,
    // Saves for one run run one at a time, in tap order. Two fast taps are two saves, queued: the
    // second only starts once the first has finished, so the database always ends on the last tap.
    scope: { id: `rsvp-${runId}` },

    // `going` is the answer the player asked for ("true" = I'm in). It is decided at tap time from
    // what the card showed, never re-read later, so a queued save can't flip the wrong way.
    mutationFn: async (going: boolean) => {
      if (!userId) throw new Error('Not signed in.');
      // Saying no is an update with going = false, not a delete: the row (and its history) stays.
      const { error } = await supabase
        .from('rsvps')
        .upsert({ run_id: runId, player_id: userId, going }, { onConflict: 'run_id,player_id' });
      if (error) throw error;
    },

    // Runs the moment you tap, before the network. Whatever it returns is handed to onError.
    onMutate: async (going) => {
      const who: RsvpPerson = { id: userId ?? '', name: me.data?.name ?? 'You' };
      // Stop any refetch already under way: it would land later and overwrite the instant change.
      await queryClient.cancelQueries({ queryKey: ['home', userId] });
      // Remember how the cache looked so onError can put it back.
      const previous: Snapshot = queryClient.getQueriesData<HomeData>({ queryKey: ['home', userId] });
      // The instant update.
      queryClient.setQueriesData<HomeData>({ queryKey: ['home', userId] }, (data) =>
        data ? applyRsvp(data, runId, going, who) : data,
      );
      return { previous };
    },

    // The save failed: put the cache back as it was before this tap.
    onError: (_error, _going, context) => {
      for (const [key, data] of context?.previous ?? []) queryClient.setQueryData(key, data);
    },

    // Success or failure, make the cache match the database. Only the last queued save does it:
    // refetching while a later save is still waiting would flash the older answer back.
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey }) === 1) {
        return queryClient.invalidateQueries({ queryKey: ['home', userId] });
      }
    },
  });

  return {
    /** Tap handler argument is the new answer. */
    setGoing: (going: boolean) => mutation.mutate(going),
    /** Short sentence for the player, or null. Cleared by the next tap. */
    errorMessage: mutation.isError ? rsvpErrorMessage(mutation.error) : null,
  };
}

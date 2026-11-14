import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './auth';
import { supabase } from './supabase';
import type { ThemeMode } from './themeMode';

export type MySettings = { theme: ThemeMode | null };

/** Your saved settings. `theme` is null until you have ever picked one (there is no row yet). */
export function useMySettings() {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['settings', userId],
    enabled: !!userId,
    queryFn: async (): Promise<MySettings> => {
      if (!userId) throw new Error('Not signed in.');
      const { data, error } = await supabase
        .from('player_settings')
        .select('theme')
        .eq('player_id', userId)
        .maybeSingle();
      if (error) throw error;
      return { theme: data?.theme ?? null };
    },
  });
}

/** Saves the Appearance choice to your row (creating it the first time). */
export function useSaveTheme() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const userId = session?.user.id;

  return useMutation({
    mutationFn: async (theme: ThemeMode) => {
      if (!userId) throw new Error('Not signed in.');
      const { error } = await supabase
        .from('player_settings')
        .upsert({ player_id: userId, theme }, { onConflict: 'player_id' });
      if (error) throw error;
    },
    onSuccess: (_data, theme) => {
      queryClient.setQueryData<MySettings>(['settings', userId], { theme });
    },
  });
}

/** Your pass for the current season: `{ paid }`, or `null` when there is no current season.
 *  No season_passes row counts as not paid, like on Home. */
export function useMyPass() {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['my-pass', userId],
    enabled: !!userId,
    queryFn: async (): Promise<{ paid: boolean } | null> => {
      if (!userId) throw new Error('Not signed in.');
      const season = await supabase.from('seasons').select('id').eq('is_current', true).maybeSingle();
      if (season.error) throw season.error;
      if (!season.data) return null;

      const pass = await supabase
        .from('season_passes')
        .select('paid')
        .eq('season_id', season.data.id)
        .eq('player_id', userId)
        .maybeSingle();
      if (pass.error) throw pass.error;
      return { paid: pass.data?.paid ?? false };
    },
  });
}

/** Changes your display name through the update_my_name database function. */
export function useUpdateName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.rpc('update_my_name', { new_name: name });
      if (error) throw error;
    },
    // The name shows on Home, in rosters and in lists. Rather than hunt for each cached copy,
    // mark everything as out of date: whatever is on screen refetches, the rest on next use.
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

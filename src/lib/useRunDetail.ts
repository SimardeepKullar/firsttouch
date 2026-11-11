import { useQuery } from '@tanstack/react-query';
import { useAuth } from './auth';
import type { SeasonType } from './runDetail';
import { supabase } from './supabase';

export type RosterPlayer = {
  playerId: string;
  name: string;
  position: 'attack' | 'defend';
  morningOf: boolean;
};

export type RunDetailData = {
  id: string;
  runDate: string; // "2027-02-14", a Toronto date
  startTime: string; // "06:30:00"
  location: string;
  /** When RSVPs close (an ISO timestamp), from the run_lock_at computed field. */
  lockAt: string;
  seasonType: SeasonType;
  /** Everyone going (Plays on), oldest yes first. */
  roster: RosterPlayer[];
};

/** One run and who is coming, cached under ['run', userId, runId]. `null` data = no such run. */
export function useRunDetail(runId: string) {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ['run', userId, runId],
    enabled: !!userId && !!runId,
    queryFn: async (): Promise<RunDetailData | null> => {
      const [runRes, rosterRes] = await Promise.all([
        supabase
          .from('runs')
          .select('id, run_date, start_time, location, run_lock_at, seasons(type)')
          .eq('id', runId)
          .maybeSingle(),
        supabase
          .from('run_roster')
          .select('player_id, full_name, position, flag_morning_of')
          .eq('run_id', runId)
          .order('responded_at')
          .order('player_id'),
      ]);

      // 22P02 = "that isn't a valid UUID" (a made-up id in the URL). Same answer as "no such run".
      if (runRes.error) {
        if (runRes.error.code === '22P02') return null;
        throw runRes.error;
      }
      if (rosterRes.error) throw rosterRes.error;

      const run = runRes.data;
      if (!run) return null;
      if (!run.run_lock_at || !run.seasons) throw new Error('Run is missing its lock time or season.');

      return {
        id: run.id,
        runDate: run.run_date,
        startTime: run.start_time,
        location: run.location,
        lockAt: run.run_lock_at,
        seasonType: run.seasons.type,
        // View columns are all "maybe null" in the types, so skip any incomplete row.
        roster: rosterRes.data.flatMap((r) =>
          r.player_id && r.full_name && r.position
            ? [{ playerId: r.player_id, name: r.full_name, position: r.position, morningOf: r.flag_morning_of === true }]
            : [],
        ),
      };
    },
  });
}

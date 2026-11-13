import { useQuery } from '@tanstack/react-query';
import { useAuth } from './auth';
import { countTeams, findMyTeam, type RunStatus, type SeasonType, type TeamColor } from './runDetail';
import { supabase } from './supabase';

export type RosterPlayer = {
  playerId: string;
  name: string;
  position: 'attack' | 'defend';
  morningOf: boolean;
  /** 1–5, filled in only for an admin (null for players, and for a row we just added ourselves). */
  stars: number | null;
  /** True when the season pass is unpaid. Admin only: null for players, and unknown until the refetch. */
  flagUnpaid: boolean | null;
};

export type RunDetailData = {
  id: string;
  runDate: string; // "2027-02-14", a Toronto date
  startTime: string; // "06:30:00"
  location: string;
  /** When RSVPs close (an ISO timestamp), from the run_lock_at computed field. */
  lockAt: string;
  seasonType: SeasonType;
  status: RunStatus;
  /** When the teams were published (an ISO timestamp), or null before that. */
  publishedAt: string | null;
  /** How many teams the run has once published (3 indoors, 2 outdoors), else 0. */
  teamCount: number;
  /** Your team once the run is published (colour + everyone's position on it), else null. */
  myTeam: { team: TeamColor; positions: ('attack' | 'defend')[] } | null;
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
      const [runRes, rosterRes, teamRes] = await Promise.all([
        supabase
          .from('runs')
          .select('id, run_date, start_time, location, run_lock_at, status, published_at, seasons(type)')
          .eq('id', runId)
          .maybeSingle(),
        supabase
          .from('run_roster')
          .select('player_id, full_name, position, flag_morning_of, stars, flag_unpaid')
          .eq('run_id', runId)
          .order('responded_at')
          .order('player_id'),
        // Players can read these rows only for published runs (RLS), so before that this is just empty.
        supabase.from('team_assignments').select('player_id, team').eq('run_id', runId),
      ]);

      // 22P02 = "that isn't a valid UUID" (a made-up id in the URL). Same answer as "no such run".
      if (runRes.error) {
        if (runRes.error.code === '22P02') return null;
        throw runRes.error;
      }
      if (rosterRes.error) throw rosterRes.error;
      if (teamRes.error) throw teamRes.error;

      const run = runRes.data;
      if (!run) return null;
      if (!run.run_lock_at || !run.seasons) throw new Error('Run is missing its lock time or season.');

      // View columns are all "maybe null" in the types, so skip any incomplete row.
      const roster = rosterRes.data.flatMap((r) =>
        r.player_id && r.full_name && r.position
          ? [
              {
                playerId: r.player_id,
                name: r.full_name,
                position: r.position,
                morningOf: r.flag_morning_of === true,
                stars: r.stars,
                flagUnpaid: r.flag_unpaid,
              },
            ]
          : [],
      );

      return {
        id: run.id,
        runDate: run.run_date,
        startTime: run.start_time,
        location: run.location,
        lockAt: run.run_lock_at,
        seasonType: run.seasons.type,
        status: run.status,
        publishedAt: run.published_at,
        teamCount: run.status === 'published' ? countTeams(teamRes.data) : 0,
        // Only a published run has teams the player should see (admins can read earlier drafts too).
        myTeam: run.status === 'published' ? findMyTeam(userId, teamRes.data, roster) : null,
        roster,
      };

    },
  });
}

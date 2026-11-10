import { useQuery } from '@tanstack/react-query';
import { useAuth } from './auth';
import { holidayNamesByDate, rosterByRun, type HomeRun } from './homeRuns';
import { supabase } from './supabase';
import { MAX_STACK_AVATARS } from './display';
import { torontoDate } from './torontoTime';

export type HomeData = {
  seasonName: string | null;
  /** No season_passes row counts as not paid. */
  paid: boolean;
  /** Every upcoming run of the current season (the screen decides how many to show). */
  runs: HomeRun[];
};

/** Everything the player Home needs, fetched in one go and cached under one key. */
export function useHome(today = torontoDate(new Date())) {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    // The user id keeps accounts apart; today's date makes it refetch after midnight (Toronto).
    queryKey: ['home', userId, today],
    enabled: !!userId,
    queryFn: async (): Promise<HomeData> => {
      if (!userId) throw new Error('Not signed in.');

      const season = await supabase.from('seasons').select('id, name').eq('is_current', true).maybeSingle();
      if (season.error) throw season.error;
      if (!season.data) return { seasonName: null, paid: false, runs: [] };

      // run_lock_at is a Postgres function that takes a runs row. PostgREST lets you select it
      // like a column ("computed field"), so the database does the "1 hour before" sum.
      const [runsRes, passRes] = await Promise.all([
        supabase
          .from('runs')
          .select('id, run_date, start_time, location, run_lock_at')
          .eq('season_id', season.data.id)
          .gte('run_date', today)
          .neq('status', 'cancelled')
          .order('run_date'),
        supabase
          .from('season_passes')
          .select('paid')
          .eq('season_id', season.data.id)
          .eq('player_id', userId)
          .maybeSingle(),
      ]);
      if (runsRes.error) throw runsRes.error;
      if (passRes.error) throw passRes.error;

      const runRows = runsRes.data;
      const dates = runRows.map((r) => r.run_date);
      const ids = runRows.map((r) => r.id);

      // No foreign key between runs and holidays, so fetch the matching holidays separately
      // and join them by date in JavaScript.
      const [holidaysRes, rosterRes] = await Promise.all([
        supabase.from('holidays').select('holiday_date, name').eq('active', true).in('holiday_date', dates),
        // run_roster = yes RSVPs from players with Plays on, with names (players can't read profiles).
        supabase
          .from('run_roster')
          .select('run_id, player_id, full_name, responded_at')
          .in('run_id', ids)
          .order('responded_at')
          .order('player_id'),
      ]);
      if (holidaysRes.error) throw holidaysRes.error;
      if (rosterRes.error) throw rosterRes.error;

      const holidays = holidayNamesByDate(holidaysRes.data);
      const roster = rosterByRun(
        rosterRes.data.flatMap((r) =>
          r.run_id && r.player_id && r.full_name ? [{ run_id: r.run_id, player_id: r.player_id, full_name: r.full_name }] : [],
        ),
      );

      const runs = runRows.map((r): HomeRun => {
        const going = roster.get(r.id) ?? [];
        if (!r.run_lock_at) throw new Error('Run is missing its lock time.');
        return {
          id: r.id,
          runDate: r.run_date,
          startTime: r.start_time,
          location: r.location,
          lockAt: r.run_lock_at,
          holiday: holidays.get(r.run_date) ?? null,
          goingNames: going.slice(0, MAX_STACK_AVATARS).map((g) => g.full_name),
          goingCount: going.length,
          iAmGoing: going.some((g) => g.player_id === userId),
        };
      });

      return { seasonName: season.data.name, paid: passRes.data?.paid === true, runs };
    },
  });
}

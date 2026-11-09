import { useQuery } from '@tanstack/react-query';
import { useAuth } from './auth';
import type { Database } from './database.types';
import { supabase } from './supabase';

export type Me = {
  id: string;
  name: string;
  position: Database['public']['Enums']['position'];
  plays: boolean;
  isAdmin: boolean;
};

/** The signed-in player's profile. One query, shared by every screen that needs "who am I". */
export function useMe() {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    // Including the user id in the key means one account can never be served another's cached data.
    queryKey: ['me', userId],
    enabled: !!userId,
    queryFn: async (): Promise<Me> => {
      const [profile, admin] = await Promise.all([
        supabase
          .from('player_directory')
          .select('id, full_name, position, plays')
          .eq('is_me', true)
          .single(),
        supabase.rpc('is_admin'),
      ]);
      if (profile.error) throw profile.error;
      if (admin.error) throw admin.error;

      const p = profile.data;
      if (!p.id || p.full_name === null || p.position === null || p.plays === null) {
        throw new Error('Profile is incomplete.');
      }
      return {
        id: p.id,
        name: p.full_name,
        position: p.position,
        plays: p.plays,
        isAdmin: admin.data === true,
      };
    },
  });
}

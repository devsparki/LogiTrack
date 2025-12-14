import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Challenge, DriverChallenge } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export function useChallenges() {
  return useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('end_date', { ascending: false });
      
      if (error) throw error;
      return data as Challenge[];
    },
  });
}

export function useActiveChallenges() {
  return useQuery({
    queryKey: ['challenges', 'active'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .gte('end_date', today)
        .order('end_date');
      
      if (error) throw error;
      return data as Challenge[];
    },
  });
}

export function useDriverChallenges(driverId: string) {
  return useQuery({
    queryKey: ['driver-challenges', driverId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('driver_challenges')
        .select(`
          *,
          challenge:challenges(*)
        `)
        .eq('driver_id', driverId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DriverChallenge[];
    },
    enabled: !!driverId,
  });
}

export function useDriverPoints(driverId: string) {
  return useQuery({
    queryKey: ['driver-points', driverId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('driver_points')
        .select('*')
        .eq('driver_id', driverId)
        .order('earned_at', { ascending: false });
      
      if (error) throw error;
      
      const totalPoints = data.reduce((acc, p) => acc + p.points, 0);
      
      return {
        points: data,
        totalPoints,
      };
    },
    enabled: !!driverId,
  });
}

export function useDriverLeaderboard() {
  return useQuery({
    queryKey: ['driver-leaderboard'],
    queryFn: async () => {
      const { data: drivers, error: driversError } = await supabase
        .from('drivers')
        .select('id, full_name, avatar_url, rating');
      
      if (driversError) throw driversError;
      
      const { data: points, error: pointsError } = await supabase
        .from('driver_points')
        .select('driver_id, points');
      
      if (pointsError) throw pointsError;
      
      // Calculate total points per driver
      const pointsByDriver = new Map<string, number>();
      for (const p of points) {
        const current = pointsByDriver.get(p.driver_id) || 0;
        pointsByDriver.set(p.driver_id, current + p.points);
      }
      
      // Combine and sort
      const leaderboard = drivers.map(d => ({
        ...d,
        totalPoints: pointsByDriver.get(d.id) || 0,
      })).sort((a, b) => b.totalPoints - a.totalPoints);
      
      return leaderboard;
    },
  });
}

export function useCreateChallenge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (challenge: Partial<Challenge>) => {
      const { data, error } = await supabase
        .from('challenges')
        .insert([challenge as any])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast({ title: 'Desafio criado!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao criar desafio', description: error.message, variant: 'destructive' });
    },
  });
}

export function useAwardPoints() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ driverId, points, reason, category }: { 
      driverId: string; 
      points: number; 
      reason: string; 
      category?: string;
    }) => {
      const { error } = await supabase
        .from('driver_points')
        .insert({
          driver_id: driverId,
          points,
          reason,
          category,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-points'] });
      queryClient.invalidateQueries({ queryKey: ['driver-leaderboard'] });
      toast({ title: 'Pontos atribuídos!' });
    },
  });
}

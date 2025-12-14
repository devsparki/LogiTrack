import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TelemetryData } from '@/types/database';
import { useEffect } from 'react';

export function useVehicleTelemetry(vehicleId: string) {
  const queryClient = useQueryClient();

  // Real-time subscription for telemetry
  useEffect(() => {
    if (!vehicleId) return;

    const channel = supabase
      .channel(`telemetry-${vehicleId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'telemetry_data',
          filter: `vehicle_id=eq.${vehicleId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['telemetry', vehicleId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [vehicleId, queryClient]);

  return useQuery({
    queryKey: ['telemetry', vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('telemetry_data')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('recorded_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as TelemetryData[];
    },
    enabled: !!vehicleId,
  });
}

export function useLatestTelemetry() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('all-telemetry')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'telemetry_data',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['telemetry', 'latest'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['telemetry', 'latest'],
    queryFn: async () => {
      // Get latest telemetry for each vehicle
      const { data, error } = await supabase
        .from('telemetry_data')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      
      // Group by vehicle and get latest
      const latestByVehicle = new Map<string, TelemetryData>();
      for (const t of data as TelemetryData[]) {
        if (!latestByVehicle.has(t.vehicle_id)) {
          latestByVehicle.set(t.vehicle_id, t);
        }
      }
      
      return Array.from(latestByVehicle.values());
    },
  });
}

export function useTelemetryHistory(vehicleId: string, hours: number = 24) {
  return useQuery({
    queryKey: ['telemetry', vehicleId, 'history', hours],
    queryFn: async () => {
      const since = new Date();
      since.setHours(since.getHours() - hours);
      
      const { data, error } = await supabase
        .from('telemetry_data')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .gte('recorded_at', since.toISOString())
        .order('recorded_at');
      
      if (error) throw error;
      return data as TelemetryData[];
    },
    enabled: !!vehicleId,
  });
}

export function useSpeedViolations() {
  return useQuery({
    queryKey: ['speed-violations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('speed_violations')
        .select(`
          *,
          vehicle:vehicles(plate, model),
          driver:drivers(full_name)
        `)
        .order('occurred_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });
}

export function useDrivingEvents() {
  return useQuery({
    queryKey: ['driving-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('driving_events')
        .select(`
          *,
          vehicle:vehicles(plate, model),
          driver:drivers(full_name)
        `)
        .order('occurred_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });
}

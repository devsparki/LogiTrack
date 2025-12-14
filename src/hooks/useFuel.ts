import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { FuelRecord } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export function useFuelRecords() {
  return useQuery({
    queryKey: ['fuel-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fuel_records')
        .select(`
          *,
          vehicle:vehicles(plate, model),
          driver:drivers(full_name)
        `)
        .order('recorded_at', { ascending: false });
      
      if (error) throw error;
      return data as FuelRecord[];
    },
  });
}

export function useVehicleFuelRecords(vehicleId: string) {
  return useQuery({
    queryKey: ['fuel-records', 'vehicle', vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fuel_records')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('recorded_at', { ascending: false });
      
      if (error) throw error;
      return data as FuelRecord[];
    },
    enabled: !!vehicleId,
  });
}

export function useFuelAnalysis() {
  return useQuery({
    queryKey: ['fuel-analysis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fuel_analysis')
        .select(`
          *,
          vehicle:vehicles(plate, model)
        `)
        .order('period_end', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateFuelRecord() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (record: Partial<FuelRecord>) => {
      const { data, error } = await supabase
        .from('fuel_records')
        .insert([record as any])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-records'] });
      toast({ title: 'Abastecimento registrado!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao registrar abastecimento', description: error.message, variant: 'destructive' });
    },
  });
}

export function useFuelConsumptionStats() {
  return useQuery({
    queryKey: ['fuel-stats'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data, error } = await supabase
        .from('fuel_records')
        .select('quantity, total_cost, vehicle_id')
        .gte('recorded_at', thirtyDaysAgo.toISOString());
      
      if (error) throw error;
      
      const totalFuel = data.reduce((acc, r) => acc + Number(r.quantity), 0);
      const totalCost = data.reduce((acc, r) => acc + Number(r.total_cost), 0);
      
      return {
        totalFuel,
        totalCost,
        avgCostPerLiter: totalFuel > 0 ? totalCost / totalFuel : 0,
        recordCount: data.length,
      };
    },
  });
}

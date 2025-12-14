import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MaintenanceRecord } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export function useMaintenanceRecords() {
  return useQuery({
    queryKey: ['maintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_records')
        .select(`
          *,
          vehicle:vehicles(plate, model, brand)
        `)
        .order('scheduled_date', { ascending: false });
      
      if (error) throw error;
      return data as MaintenanceRecord[];
    },
  });
}

export function usePendingMaintenance() {
  return useQuery({
    queryKey: ['maintenance', 'pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_records')
        .select(`
          *,
          vehicle:vehicles(plate, model, brand)
        `)
        .eq('status', 'pending')
        .order('scheduled_date');
      
      if (error) throw error;
      return data as MaintenanceRecord[];
    },
  });
}

export function useVehicleMaintenance(vehicleId: string) {
  return useQuery({
    queryKey: ['maintenance', 'vehicle', vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_records')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('scheduled_date', { ascending: false });
      
      if (error) throw error;
      return data as MaintenanceRecord[];
    },
    enabled: !!vehicleId,
  });
}

export function useCreateMaintenance() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (record: Partial<MaintenanceRecord>) => {
      const { data, error } = await supabase
        .from('maintenance_records')
        .insert([record as any])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast({ title: 'Manutenção agendada com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao agendar manutenção', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateMaintenance() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...record }: Partial<MaintenanceRecord> & { id: string }) => {
      const { data, error } = await supabase
        .from('maintenance_records')
        .update(record)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast({ title: 'Manutenção atualizada!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao atualizar manutenção', description: error.message, variant: 'destructive' });
    },
  });
}

export function useCompleteMaintenance() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, cost, notes }: { id: string; cost?: number; notes?: string }) => {
      const { error } = await supabase
        .from('maintenance_records')
        .update({ 
          status: 'completed',
          completed_date: new Date().toISOString().split('T')[0],
          cost,
          notes,
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toast({ title: 'Manutenção concluída!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao concluir manutenção', description: error.message, variant: 'destructive' });
    },
  });
}

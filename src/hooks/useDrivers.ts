import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Driver } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export function useDrivers() {
  return useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('full_name');
      
      if (error) throw error;
      return data as Driver[];
    },
  });
}

export function useDriver(id: string) {
  return useQuery({
    queryKey: ['drivers', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Driver | null;
    },
    enabled: !!id,
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (driver: Partial<Driver>) => {
      const { data, error } = await supabase
        .from('drivers')
        .insert([driver as any])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast({ title: 'Motorista criado com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao criar motorista', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateDriver() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...driver }: Partial<Driver> & { id: string }) => {
      const { data, error } = await supabase
        .from('drivers')
        .update(driver)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast({ title: 'Motorista atualizado com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao atualizar motorista', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteDriver() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast({ title: 'Motorista excluído com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao excluir motorista', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDriverPerformance(driverId: string) {
  return useQuery({
    queryKey: ['driver-performance', driverId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('driver_performance')
        .select('*')
        .eq('driver_id', driverId)
        .order('period_end', { ascending: false })
        .limit(12);
      
      if (error) throw error;
      return data;
    },
    enabled: !!driverId,
  });
}

export function useDriverRanking() {
  return useQuery({
    queryKey: ['driver-ranking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select(`
          *,
          driver_points(points)
        `)
        .order('rating', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });
}

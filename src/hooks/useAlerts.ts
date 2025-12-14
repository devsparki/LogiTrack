import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Alert } from '@/types/database';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export function useAlerts() {
  const queryClient = useQueryClient();

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('alerts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['alerts'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select(`
          *,
          vehicle:vehicles(plate, model),
          driver:drivers(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as Alert[];
    },
  });
}

export function useUnreadAlerts() {
  return useQuery({
    queryKey: ['alerts', 'unread'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Alert[];
    },
  });
}

export function useCriticalAlerts() {
  return useQuery({
    queryKey: ['alerts', 'critical'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select(`
          *,
          vehicle:vehicles(plate, model),
          driver:drivers(full_name)
        `)
        .eq('level', 'critical')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Alert[];
    },
  });
}

export function useMarkAlertAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const { error } = await supabase
        .from('alerts')
        .update({ 
          is_resolved: true, 
          resolved_by: userId,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast({ title: 'Alerta resolvido!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao resolver alerta', description: error.message, variant: 'destructive' });
    },
  });
}

export function useCreateAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (alert: Partial<Alert>) => {
      const { data, error } = await supabase
        .from('alerts')
        .insert([alert as any])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

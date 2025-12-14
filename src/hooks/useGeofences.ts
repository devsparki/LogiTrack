import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Geofence } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export function useGeofences() {
  return useQuery({
    queryKey: ['geofences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('geofences')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Geofence[];
    },
  });
}

export function useActiveGeofences() {
  return useQuery({
    queryKey: ['geofences', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('geofences')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as Geofence[];
    },
  });
}

export function useGeofence(id: string) {
  return useQuery({
    queryKey: ['geofences', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('geofences')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Geofence | null;
    },
    enabled: !!id,
  });
}

export function useCreateGeofence() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (geofence: Partial<Geofence>) => {
      const { data, error } = await supabase
        .from('geofences')
        .insert([geofence as any])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geofences'] });
      toast({ title: 'Cerca virtual criada!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao criar cerca virtual', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateGeofence() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...geofence }: Partial<Geofence> & { id: string }) => {
      const { data, error } = await supabase
        .from('geofences')
        .update(geofence)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geofences'] });
      toast({ title: 'Cerca virtual atualizada!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao atualizar cerca virtual', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteGeofence() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('geofences')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geofences'] });
      toast({ title: 'Cerca virtual excluída!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao excluir cerca virtual', description: error.message, variant: 'destructive' });
    },
  });
}

export function useGeofenceEvents(geofenceId?: string) {
  return useQuery({
    queryKey: ['geofence-events', geofenceId],
    queryFn: async () => {
      let query = supabase
        .from('geofence_events')
        .select(`
          *,
          geofence:geofences(name),
          vehicle:vehicles(plate, model)
        `)
        .order('occurred_at', { ascending: false })
        .limit(100);
      
      if (geofenceId) {
        query = query.eq('geofence_id', geofenceId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
}

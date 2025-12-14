import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Route } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export function useRoutes() {
  return useQuery({
    queryKey: ['routes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routes')
        .select(`
          *,
          vehicle:vehicles(*),
          driver:drivers(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Route[];
    },
  });
}

export function useActiveRoutes() {
  return useQuery({
    queryKey: ['routes', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routes')
        .select(`
          *,
          vehicle:vehicles(*),
          driver:drivers(*)
        `)
        .in('status', ['planned', 'in_progress'])
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data as Route[];
    },
  });
}

export function useRoute(id: string) {
  return useQuery({
    queryKey: ['routes', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('routes')
        .select(`
          *,
          vehicle:vehicles(*),
          driver:drivers(*),
          route_stops(*)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Route | null;
    },
    enabled: !!id,
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (route: Partial<Route>) => {
      const { data, error } = await supabase
        .from('routes')
        .insert([route as any])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast({ title: 'Rota criada com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao criar rota', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateRoute() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...route }: Partial<Route> & { id: string }) => {
      const { data, error } = await supabase
        .from('routes')
        .update(route)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast({ title: 'Rota atualizada com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao atualizar rota', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteRoute() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('routes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast({ title: 'Rota excluída com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao excluir rota', description: error.message, variant: 'destructive' });
    },
  });
}

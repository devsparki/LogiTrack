import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Cargo } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export function useCargos() {
  return useQuery({
    queryKey: ['cargos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cargos')
        .select(`
          *,
          route:routes(
            name,
            origin_name,
            destination_name,
            vehicle:vehicles(plate),
            driver:drivers(full_name)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Cargo[];
    },
  });
}

export function useActiveCargos() {
  return useQuery({
    queryKey: ['cargos', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cargos')
        .select(`
          *,
          route:routes(
            name,
            origin_name,
            destination_name,
            vehicle:vehicles(plate),
            driver:drivers(full_name)
          )
        `)
        .in('status', ['pending', 'loaded', 'in_transit'])
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data as Cargo[];
    },
  });
}

export function useCargo(id: string) {
  return useQuery({
    queryKey: ['cargos', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cargos')
        .select(`
          *,
          route:routes(
            *,
            vehicle:vehicles(*),
            driver:drivers(*)
          ),
          cargo_conditions(*)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Cargo | null;
    },
    enabled: !!id,
  });
}

export function useCreateCargo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cargo: Partial<Cargo>) => {
      const { data, error } = await supabase
        .from('cargos')
        .insert([cargo as any])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargos'] });
      toast({ title: 'Carga registrada com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao registrar carga', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateCargo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...cargo }: Partial<Cargo> & { id: string }) => {
      const { data, error } = await supabase
        .from('cargos')
        .update(cargo)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargos'] });
      toast({ title: 'Carga atualizada!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao atualizar carga', description: error.message, variant: 'destructive' });
    },
  });
}

export function useCargoConditions(cargoId: string) {
  return useQuery({
    queryKey: ['cargo-conditions', cargoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cargo_conditions')
        .select('*')
        .eq('cargo_id', cargoId)
        .order('recorded_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
    enabled: !!cargoId,
  });
}

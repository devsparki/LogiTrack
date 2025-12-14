import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { DashboardKPIs } from '@/types/database';

export function useDashboardKPIs() {
  return useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: async (): Promise<DashboardKPIs> => {
      // Get vehicle counts
      const { data: vehicles } = await supabase
        .from('vehicles')
        .select('status');
      
      const totalVehicles = vehicles?.length || 0;
      const activeVehicles = vehicles?.filter(v => v.status === 'active' || v.status === 'in_transit').length || 0;
      
      // Get driver counts
      const { data: drivers } = await supabase
        .from('drivers')
        .select('status');
      
      const totalDrivers = drivers?.length || 0;
      const activeDrivers = drivers?.filter(d => d.status === 'driving' || d.status === 'available').length || 0;
      
      // Get route counts
      const { data: routes } = await supabase
        .from('routes')
        .select('status')
        .in('status', ['planned', 'in_progress', 'delayed']);
      
      const activeRoutes = routes?.filter(r => r.status === 'in_progress' || r.status === 'planned').length || 0;
      const delayedRoutes = routes?.filter(r => r.status === 'delayed').length || 0;
      
      // Get alert counts for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: alerts } = await supabase
        .from('alerts')
        .select('level')
        .gte('created_at', today.toISOString());
      
      const totalAlerts = alerts?.length || 0;
      const criticalAlerts = alerts?.filter(a => a.level === 'critical').length || 0;
      
      // Get driving events for incidents today
      const { data: incidents } = await supabase
        .from('driving_events')
        .select('id')
        .gte('occurred_at', today.toISOString());
      
      const incidentsToday = incidents?.length || 0;
      
      // Calculate fuel consumption average (mock for now as we need real data)
      const avgFuelConsumption = 3.4;
      
      // Calculate on-time rate from completed routes
      const { data: completedRoutes } = await supabase
        .from('routes')
        .select('planned_end, actual_end')
        .eq('status', 'completed')
        .not('actual_end', 'is', null)
        .limit(100);
      
      let onTimeRate = 95;
      if (completedRoutes && completedRoutes.length > 0) {
        const onTime = completedRoutes.filter(r => {
          if (!r.planned_end || !r.actual_end) return true;
          return new Date(r.actual_end) <= new Date(r.planned_end);
        }).length;
        onTimeRate = Math.round((onTime / completedRoutes.length) * 100);
      }
      
      // Total km today (mock - would need telemetry aggregation)
      const totalKmToday = 12400;
      
      return {
        totalVehicles,
        activeVehicles,
        totalDrivers,
        activeDrivers,
        activeRoutes,
        delayedRoutes,
        avgFuelConsumption,
        totalAlerts,
        criticalAlerts,
        totalKmToday,
        onTimeRate,
        incidentsToday,
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const [
        { data: alerts },
        { data: routes },
        { data: maintenance },
      ] = await Promise.all([
        supabase
          .from('alerts')
          .select('id, title, level, created_at, vehicle:vehicles(plate)')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('routes')
          .select('id, name, status, updated_at, driver:drivers(full_name)')
          .order('updated_at', { ascending: false })
          .limit(5),
        supabase
          .from('maintenance_records')
          .select('id, title, status, created_at, vehicle:vehicles(plate)')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);
      
      const activities = [
        ...(alerts || []).map(a => ({
          type: 'alert' as const,
          id: a.id,
          title: a.title,
          subtitle: (a.vehicle as any)?.plate || '',
          status: a.level,
          timestamp: a.created_at,
        })),
        ...(routes || []).map(r => ({
          type: 'route' as const,
          id: r.id,
          title: r.name || 'Rota sem nome',
          subtitle: (r.driver as any)?.full_name || '',
          status: r.status,
          timestamp: r.updated_at,
        })),
        ...(maintenance || []).map(m => ({
          type: 'maintenance' as const,
          id: m.id,
          title: m.title,
          subtitle: (m.vehicle as any)?.plate || '',
          status: m.status,
          timestamp: m.created_at,
        })),
      ];
      
      return activities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ).slice(0, 10);
    },
  });
}

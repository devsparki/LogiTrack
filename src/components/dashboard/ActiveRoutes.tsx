import { Route, Clock, Package, ArrowRight, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ActiveRoute {
  id: string;
  origin: string;
  destination: string;
  vehicle: string;
  driver: string;
  progress: number;
  eta: string;
  distance: string;
  cargo: string;
  status: "on-time" | "delayed" | "ahead";
}

const routes: ActiveRoute[] = [
  {
    id: "1",
    origin: "São Paulo, SP",
    destination: "Rio de Janeiro, RJ",
    vehicle: "ABC-1234",
    driver: "Carlos Santos",
    progress: 65,
    eta: "14:30",
    distance: "150 km restantes",
    cargo: "Eletrônicos",
    status: "on-time",
  },
  {
    id: "2",
    origin: "Curitiba, PR",
    destination: "São Paulo, SP",
    vehicle: "GHI-9012",
    driver: "Fernando Costa",
    progress: 35,
    eta: "18:45",
    distance: "280 km restantes",
    cargo: "Alimentos",
    status: "ahead",
  },
  {
    id: "3",
    origin: "Santos, SP",
    destination: "Campinas, SP",
    vehicle: "DEF-5678",
    driver: "Roberto Lima",
    progress: 10,
    eta: "16:00",
    distance: "95 km restantes",
    cargo: "Containers",
    status: "delayed",
  },
];

const ActiveRoutes = () => {
  const getStatusLabel = (status: ActiveRoute["status"]) => {
    const config = {
      "on-time": { label: "No horário", class: "text-success" },
      delayed: { label: "Atrasado", class: "text-destructive" },
      ahead: { label: "Adiantado", class: "text-primary" },
    };
    return config[status];
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Route className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Rotas Ativas</h3>
            <p className="text-sm text-muted-foreground">{routes.length} entregas em andamento</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {routes.map((route) => {
          const statusConfig = getStatusLabel(route.status);
          return (
            <div key={route.id} className="p-4 hover:bg-secondary/30 transition-colors">
              {/* Route path */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium text-foreground">{route.origin}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-sm font-medium text-foreground">{route.destination}</span>
                </div>
                <span className={cn("text-sm font-medium", statusConfig.class)}>
                  {statusConfig.label}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">{route.distance}</span>
                  <span className="text-xs font-medium text-foreground">{route.progress}%</span>
                </div>
                <Progress value={route.progress} className="h-2" />
              </div>

              {/* Details */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>ETA: {route.eta}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  <span>{route.cargo}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-foreground">{route.vehicle}</span>
                  <span>• {route.driver}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveRoutes;

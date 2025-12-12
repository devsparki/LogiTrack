import { User, Star, Clock, TrendingUp, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Driver {
  id: string;
  name: string;
  photo?: string;
  status: "driving" | "resting" | "available" | "offline";
  vehicle?: string;
  rating: number;
  tripsToday: number;
  hoursWorked: number;
}

const drivers: Driver[] = [
  {
    id: "1",
    name: "Carlos Santos",
    status: "driving",
    vehicle: "ABC-1234",
    rating: 4.8,
    tripsToday: 3,
    hoursWorked: 6.5,
  },
  {
    id: "2",
    name: "Roberto Lima",
    status: "resting",
    vehicle: "DEF-5678",
    rating: 4.6,
    tripsToday: 2,
    hoursWorked: 4,
  },
  {
    id: "3",
    name: "Fernando Costa",
    status: "driving",
    vehicle: "GHI-9012",
    rating: 4.9,
    tripsToday: 4,
    hoursWorked: 7,
  },
  {
    id: "4",
    name: "Marcelo Souza",
    status: "available",
    rating: 4.5,
    tripsToday: 0,
    hoursWorked: 0,
  },
  {
    id: "5",
    name: "Pedro Oliveira",
    status: "offline",
    rating: 4.7,
    tripsToday: 0,
    hoursWorked: 0,
  },
];

const DriversPanel = () => {
  const getStatusConfig = (status: Driver["status"]) => {
    const configs = {
      driving: { label: "Dirigindo", class: "status-badge status-online" },
      resting: { label: "Descansando", class: "status-badge status-warning" },
      available: { label: "Disponível", class: "status-badge bg-primary/20 text-primary" },
      offline: { label: "Offline", class: "status-badge status-offline" },
    };
    return configs[status];
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Motoristas</h3>
            <p className="text-sm text-muted-foreground">
              {drivers.filter(d => d.status === "driving").length} ativos agora
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Gerenciar
        </Button>
      </div>

      <div className="divide-y divide-border">
        {drivers.map((driver) => {
          const statusConfig = getStatusConfig(driver.status);
          return (
            <div key={driver.id} className="p-4 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-foreground">
                    {driver.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground truncate">{driver.name}</h4>
                    <span className={statusConfig.class}>{statusConfig.label}</span>
                  </div>
                  {driver.vehicle && (
                    <p className="text-xs text-muted-foreground">Veículo: {driver.vehicle}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-warning">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{driver.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{driver.tripsToday} viagens</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{driver.hoursWorked}h</span>
                  </div>
                </div>

                {/* Action */}
                <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriversPanel;

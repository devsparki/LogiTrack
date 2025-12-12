import { Truck, MapPin, Gauge, Fuel, MoreVertical, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  driver: string;
  status: "online" | "offline" | "maintenance";
  speed: number;
  fuel: number;
  location: string;
  lastUpdate: string;
}

const vehicles: Vehicle[] = [
  {
    id: "1",
    plate: "ABC-1234",
    model: "Volvo FH 540",
    driver: "Carlos Santos",
    status: "online",
    speed: 78,
    fuel: 65,
    location: "Rod. Presidente Dutra, km 220",
    lastUpdate: "Agora",
  },
  {
    id: "2",
    plate: "DEF-5678",
    model: "Scania R450",
    driver: "Roberto Lima",
    status: "online",
    speed: 0,
    fuel: 42,
    location: "Terminal de Cargas - Guarulhos",
    lastUpdate: "2 min atrás",
  },
  {
    id: "3",
    plate: "GHI-9012",
    model: "Mercedes Actros",
    driver: "Fernando Costa",
    status: "online",
    speed: 92,
    fuel: 88,
    location: "BR-116, Curitiba - PR",
    lastUpdate: "Agora",
  },
  {
    id: "4",
    plate: "JKL-3456",
    model: "DAF XF",
    driver: "Marcelo Souza",
    status: "maintenance",
    speed: 0,
    fuel: 30,
    location: "Oficina Central - SP",
    lastUpdate: "1h atrás",
  },
  {
    id: "5",
    plate: "MNO-7890",
    model: "Iveco Stralis",
    driver: "Pedro Oliveira",
    status: "offline",
    speed: 0,
    fuel: 15,
    location: "Último: Porto de Santos",
    lastUpdate: "3h atrás",
  },
];

const VehicleList = () => {
  const getStatusBadge = (status: Vehicle["status"]) => {
    const styles = {
      online: "status-badge status-online",
      offline: "status-badge status-offline",
      maintenance: "status-badge status-warning",
    };
    const labels = {
      online: "Online",
      offline: "Offline",
      maintenance: "Manutenção",
    };
    return <span className={styles[status]}>{labels[status]}</span>;
  };

  const getFuelColor = (fuel: number) => {
    if (fuel > 50) return "bg-success";
    if (fuel > 25) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Veículos da Frota</h3>
          <p className="text-sm text-muted-foreground">{vehicles.length} veículos cadastrados</p>
        </div>
        <Button variant="outline" size="sm">
          Ver todos
        </Button>
      </div>

      <div className="divide-y divide-border">
        {vehicles.map((vehicle) => (
          <div 
            key={vehicle.id} 
            className="p-4 hover:bg-secondary/50 transition-colors group"
          >
            <div className="flex items-start gap-4">
              {/* Vehicle icon */}
              <div className={cn(
                "p-3 rounded-xl",
                vehicle.status === "online" ? "bg-primary/10" : "bg-secondary"
              )}>
                <Truck className={cn(
                  "w-5 h-5",
                  vehicle.status === "online" ? "text-primary" : "text-muted-foreground"
                )} />
              </div>

              {/* Vehicle info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-semibold text-foreground">{vehicle.plate}</h4>
                  {getStatusBadge(vehicle.status)}
                </div>
                <p className="text-sm text-muted-foreground">{vehicle.model}</p>
                <p className="text-sm text-muted-foreground">Motorista: {vehicle.driver}</p>

                {/* Telemetry */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground truncate max-w-[200px]">
                      {vehicle.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Gauge className="w-4 h-4 text-muted-foreground" />
                    <span className={cn(
                      vehicle.speed > 0 ? "text-success" : "text-muted-foreground"
                    )}>
                      {vehicle.speed} km/h
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Fuel className="w-4 h-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all", getFuelColor(vehicle.fuel))}
                          style={{ width: `${vehicle.fuel}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground">{vehicle.fuel}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-primary">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              {/* Last update */}
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {vehicle.lastUpdate}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleList;

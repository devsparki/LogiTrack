import { MapPin, Maximize2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VehiclePosition {
  id: string;
  plate: string;
  lat: number;
  lng: number;
  status: "moving" | "stopped" | "idle";
  speed: number;
}

const mockVehicles: VehiclePosition[] = [
  { id: "1", plate: "ABC-1234", lat: -23.55, lng: -46.63, status: "moving", speed: 65 },
  { id: "2", plate: "DEF-5678", lat: -23.52, lng: -46.68, status: "stopped", speed: 0 },
  { id: "3", plate: "GHI-9012", lat: -23.58, lng: -46.60, status: "moving", speed: 45 },
  { id: "4", plate: "JKL-3456", lat: -23.54, lng: -46.72, status: "idle", speed: 0 },
  { id: "5", plate: "MNO-7890", lat: -23.56, lng: -46.65, status: "moving", speed: 72 },
];

const VehicleMap = () => {
  const statusColors = {
    moving: "bg-success",
    stopped: "bg-destructive",
    idle: "bg-warning",
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden h-[400px] relative">
      {/* Map header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
          <span className="text-sm font-medium text-foreground">
            {mockVehicles.length} veículos ativos
          </span>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="secondary" className="bg-background/90 backdrop-blur-sm">
            <Layers className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary" className="bg-background/90 backdrop-blur-sm">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Map placeholder with grid */}
      <div className="w-full h-full bg-secondary/50 relative overflow-hidden">
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Simulated road lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M 50 200 Q 200 100 400 180 T 700 150" 
            stroke="hsl(var(--primary) / 0.3)" 
            strokeWidth="3" 
            fill="none"
            strokeDasharray="10 5"
          />
          <path 
            d="M 100 350 Q 300 300 500 320 T 800 280" 
            stroke="hsl(var(--primary) / 0.3)" 
            strokeWidth="3" 
            fill="none"
            strokeDasharray="10 5"
          />
        </svg>

        {/* Vehicle markers */}
        {mockVehicles.map((vehicle, index) => (
          <div
            key={vehicle.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{
              left: `${15 + index * 18}%`,
              top: `${25 + (index % 3) * 25}%`,
            }}
          >
            {/* Pulse ring for moving vehicles */}
            {vehicle.status === "moving" && (
              <div className="absolute inset-0 w-10 h-10 -m-2 rounded-full bg-success/20 animate-ping" />
            )}
            
            {/* Marker */}
            <div className={`relative w-6 h-6 rounded-full ${statusColors[vehicle.status]} flex items-center justify-center shadow-lg border-2 border-background`}>
              <MapPin className="w-3 h-3 text-white" />
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                <p className="text-sm font-semibold text-foreground">{vehicle.plate}</p>
                <p className="text-xs text-muted-foreground">
                  {vehicle.status === "moving" ? `${vehicle.speed} km/h` : vehicle.status === "stopped" ? "Parado" : "Ocioso"}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Map attribution placeholder */}
        <div className="absolute bottom-4 left-4 text-xs text-muted-foreground/50">
          Mapa de rastreamento em tempo real
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm px-4 py-3 rounded-lg border border-border">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Em movimento</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-muted-foreground">Ocioso</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Parado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleMap;

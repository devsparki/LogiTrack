import { AlertTriangle, AlertCircle, Info, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  vehicle?: string;
  time: string;
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "Excesso de velocidade",
    message: "Veículo acima de 100 km/h em zona urbana",
    vehicle: "ABC-1234",
    time: "2 min atrás",
  },
  {
    id: "2",
    type: "warning",
    title: "Combustível baixo",
    message: "Nível de combustível abaixo de 15%",
    vehicle: "MNO-7890",
    time: "15 min atrás",
  },
  {
    id: "3",
    type: "warning",
    title: "Manutenção programada",
    message: "Revisão preventiva em 500 km",
    vehicle: "GHI-9012",
    time: "1h atrás",
  },
  {
    id: "4",
    type: "info",
    title: "Entrega concluída",
    message: "Carga entregue no destino com sucesso",
    vehicle: "DEF-5678",
    time: "2h atrás",
  },
];

const AlertsPanel = () => {
  const getAlertConfig = (type: Alert["type"]) => {
    const configs = {
      critical: {
        icon: AlertCircle,
        bgClass: "bg-destructive/10 border-destructive/30",
        iconClass: "text-destructive",
      },
      warning: {
        icon: AlertTriangle,
        bgClass: "bg-warning/10 border-warning/30",
        iconClass: "text-warning",
      },
      info: {
        icon: Info,
        bgClass: "bg-primary/10 border-primary/30",
        iconClass: "text-primary",
      },
    };
    return configs[type];
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden h-full">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-destructive/10">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Alertas Recentes</h3>
            <p className="text-sm text-muted-foreground">
              {alerts.filter(a => a.type === "critical").length} críticos
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Ver todos
        </Button>
      </div>

      <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
        {alerts.map((alert) => {
          const config = getAlertConfig(alert.type);
          const Icon = config.icon;
          return (
            <div
              key={alert.id}
              className={cn(
                "p-3 rounded-lg border transition-all hover:scale-[1.02]",
                config.bgClass
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", config.iconClass)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-medium text-foreground">{alert.title}</h4>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="w-6 h-6 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {alert.vehicle && (
                      <span className="text-xs font-medium text-foreground bg-secondary px-2 py-0.5 rounded">
                        {alert.vehicle}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsPanel;

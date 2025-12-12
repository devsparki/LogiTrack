import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { time: "00:00", speed: 45, fuel: 100 },
  { time: "02:00", speed: 62, fuel: 92 },
  { time: "04:00", speed: 78, fuel: 85 },
  { time: "06:00", speed: 55, fuel: 78 },
  { time: "08:00", speed: 88, fuel: 70 },
  { time: "10:00", speed: 72, fuel: 62 },
  { time: "12:00", speed: 65, fuel: 55 },
  { time: "14:00", speed: 82, fuel: 48 },
  { time: "16:00", speed: 70, fuel: 95 },
  { time: "18:00", speed: 58, fuel: 88 },
  { time: "20:00", speed: 45, fuel: 82 },
  { time: "22:00", speed: 30, fuel: 78 },
];

const TelemetryChart = () => {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Telemetria 24h</h3>
            <p className="text-sm text-muted-foreground">Velocidade média e consumo</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Velocidade (km/h)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Combustível (%)</span>
          </div>
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142 76% 36%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(142 76% 36%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(222 47% 16%)" 
              vertical={false}
            />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222 47% 8%)",
                border: "1px solid hsl(222 47% 16%)",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
              labelStyle={{ color: "hsl(210 40% 98%)" }}
              itemStyle={{ color: "hsl(215 20% 55%)" }}
            />
            <Area
              type="monotone"
              dataKey="speed"
              stroke="hsl(199 89% 48%)"
              strokeWidth={2}
              fill="url(#speedGradient)"
              name="Velocidade"
            />
            <Area
              type="monotone"
              dataKey="fuel"
              stroke="hsl(142 76% 36%)"
              strokeWidth={2}
              fill="url(#fuelGradient)"
              name="Combustível"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TelemetryChart;

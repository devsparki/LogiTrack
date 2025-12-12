import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Fuel, TrendingDown } from "lucide-react";

const data = [
  { vehicle: "ABC-1234", consumption: 3.2, efficiency: "good" },
  { vehicle: "DEF-5678", consumption: 4.1, efficiency: "average" },
  { vehicle: "GHI-9012", consumption: 2.8, efficiency: "excellent" },
  { vehicle: "JKL-3456", consumption: 5.2, efficiency: "poor" },
  { vehicle: "MNO-7890", consumption: 3.5, efficiency: "good" },
];

const FuelConsumption = () => {
  const getBarColor = (efficiency: string) => {
    const colors = {
      excellent: "hsl(142 76% 36%)",
      good: "hsl(199 89% 48%)",
      average: "hsl(38 92% 50%)",
      poor: "hsl(0 72% 51%)",
    };
    return colors[efficiency as keyof typeof colors] || colors.average;
  };

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning/10">
            <Fuel className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Consumo de Combustível</h3>
            <p className="text-sm text-muted-foreground">Litros por 100km</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-success text-sm">
          <TrendingDown className="w-4 h-4" />
          <span>-8% vs último mês</span>
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(222 47% 16%)" 
              horizontal={false}
            />
            <XAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
              domain={[0, 6]}
            />
            <YAxis 
              type="category"
              dataKey="vehicle"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
              width={70}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222 47% 8%)",
                border: "1px solid hsl(222 47% 16%)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(210 40% 98%)" }}
              formatter={(value: number) => [`${value} L/100km`, "Consumo"]}
            />
            <Bar dataKey="consumption" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.efficiency)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-success" />
          <span className="text-muted-foreground">Excelente (&lt;3.0)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Bom (3.0-3.5)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-muted-foreground">Médio (3.5-4.5)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-muted-foreground">Alto (&gt;4.5)</span>
        </div>
      </div>
    </div>
  );
};

export default FuelConsumption;

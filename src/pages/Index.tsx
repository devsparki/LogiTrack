import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";
import VehicleMap from "@/components/dashboard/VehicleMap";
import VehicleList from "@/components/dashboard/VehicleList";
import ActiveRoutes from "@/components/dashboard/ActiveRoutes";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import TelemetryChart from "@/components/dashboard/TelemetryChart";
import DriversPanel from "@/components/dashboard/DriversPanel";
import FuelConsumption from "@/components/dashboard/FuelConsumption";
import { Truck, Route, Users, Fuel, AlertTriangle, TrendingUp } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="ml-64">
        <Header 
          title="Dashboard" 
          subtitle="Visão geral da sua frota em tempo real"
        />

        <div className="p-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <StatCard
              title="Total de Veículos"
              value={48}
              subtitle="32 ativos agora"
              icon={Truck}
              variant="primary"
              trend={{ value: 4, isPositive: true }}
            />
            <StatCard
              title="Rotas Ativas"
              value={12}
              subtitle="3 com atraso"
              icon={Route}
              variant="success"
            />
            <StatCard
              title="Motoristas"
              value={56}
              subtitle="28 em viagem"
              icon={Users}
              variant="default"
            />
            <StatCard
              title="Consumo Médio"
              value="3.4 L"
              subtitle="por 100km"
              icon={Fuel}
              variant="warning"
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Alertas Hoje"
              value={7}
              subtitle="2 críticos"
              icon={AlertTriangle}
              variant="destructive"
            />
            <StatCard
              title="Km Rodados"
              value="12.4K"
              subtitle="Hoje"
              icon={TrendingUp}
              variant="primary"
              trend={{ value: 12, isPositive: true }}
            />
          </div>

          {/* Map and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VehicleMap />
            </div>
            <div>
              <AlertsPanel />
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TelemetryChart />
            <FuelConsumption />
          </div>

          {/* Active Routes */}
          <ActiveRoutes />

          {/* Vehicles and Drivers */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <VehicleList />
            <DriversPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

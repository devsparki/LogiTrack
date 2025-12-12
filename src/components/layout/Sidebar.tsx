import { 
  LayoutDashboard, 
  Truck, 
  MapPin, 
  Route, 
  Users, 
  Fuel, 
  AlertTriangle, 
  Settings, 
  BarChart3,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "vehicles", label: "Veículos", icon: Truck },
  { id: "tracking", label: "Rastreamento", icon: MapPin },
  { id: "routes", label: "Rotas", icon: Route },
  { id: "drivers", label: "Motoristas", icon: Users },
  { id: "fuel", label: "Combustível", icon: Fuel },
  { id: "reports", label: "Relatórios", icon: BarChart3 },
  { id: "alerts", label: "Alertas", icon: AlertTriangle },
];

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
            <Truck className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">LogiTrack</h1>
            <p className="text-xs text-muted-foreground">Fleet Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "nav-link w-full text-left",
              activeSection === item.id && "active"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-sidebar-border space-y-1">
        <button
          onClick={() => onSectionChange("notifications")}
          className="nav-link w-full text-left"
        >
          <Bell className="w-5 h-5" />
          <span className="font-medium">Notificações</span>
          <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
            3
          </span>
        </button>
        <button
          onClick={() => onSectionChange("settings")}
          className="nav-link w-full text-left"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Configurações</span>
        </button>
      </div>

      {/* User */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-sm font-semibold text-foreground">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">João da Silva</p>
            <p className="text-xs text-muted-foreground truncate">Gerente de Frota</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

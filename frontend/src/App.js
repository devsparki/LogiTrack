import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { io } from 'socket.io-client';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { 
  Truck, 
  Activity, 
  AlertTriangle, 
  Fuel, 
  Users, 
  MapPin,
  Clock,
  TrendingUp,
  Settings,
  Bell
} from 'lucide-react';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Custom vehicle icons
const createVehicleIcon = (status, vehicleType) => {
  const colors = {
    active: '#22c55e',
    idle: '#f59e0b', 
    maintenance: '#ef4444'
  };
  
  return L.divIcon({
    html: `<div style="background-color: ${colors[status]}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center;">
      <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
        <path d="M20 8h-3l-1.5-1.5h-7L7 8H4c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h1c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h1c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2z"/>
      </svg>
    </div>`,
    className: 'custom-div-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [fleetStats, setFleetStats] = useState(null);
  const [socket, setSocket] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);

    // Listen for real-time fleet updates
    newSocket.on('fleet_update', (data) => {
      setVehicles(data.vehicles);
      if (data.alerts && data.alerts.length > 0) {
        setAlerts(prev => [...data.alerts, ...prev].slice(0, 50));
      }
    });

    // Load initial data
    loadInitialData();

    return () => {
      newSocket.close();
    };
  }, []);

  const loadInitialData = async () => {
    try {
      const [vehiclesRes, alertsRes, statsRes] = await Promise.all([
        axios.get(`${API}/vehicles`),
        axios.get(`${API}/alerts`),
        axios.get(`${API}/fleet/stats`)
      ]);

      setVehicles(vehiclesRes.data);
      setAlerts(alertsRes.data);
      setFleetStats(statsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setLoading(false);
    }
  };

  const getAlertSeverityColor = (severity) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800 border-blue-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      critical: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[severity] || colors.medium;
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando LogiTrack...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">LogiTrack</h1>
                <p className="text-sm text-slate-500">Gestão de Frotas em Tempo Real</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-slate-600">Sistema Online</span>
              </div>
              <button className="relative p-2 text-slate-400 hover:text-slate-600">
                <Bell className="w-5 h-5" />
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {alerts.filter(a => !a.resolved).length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <nav className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => setActiveTab('fleet')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'fleet' 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-5 h-5" />
                <span>Mapa da Frota</span>
              </button>
              
              <button
                onClick={() => setActiveTab('alerts')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'alerts' 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
                <span>Alertas</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">Dashboard Executivo</h2>
              
              {/* Stats Cards */}
              {fleetStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Total de Veículos</p>
                        <p className="text-2xl font-bold text-slate-900">{fleetStats.total_vehicles}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Truck className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Veículos Ativos</p>
                        <p className="text-2xl font-bold text-green-600">{fleetStats.active_vehicles}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Activity className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Combustível Médio</p>
                        <p className="text-2xl font-bold text-orange-600">{fleetStats.avg_fuel_level?.toFixed(1)}%</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Fuel className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Alertas Hoje</p>
                        <p className="text-2xl font-bold text-red-600">{fleetStats.alerts_count}</p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Alerts */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-slate-900">Alertas Recentes</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {alerts.slice(0, 5).map((alert) => (
                      <div key={alert.id} className={`p-3 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="font-medium">{alert.message}</span>
                          </div>
                          <span className="text-sm">{formatTime(alert.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                    {alerts.length === 0 && (
                      <p className="text-slate-500 text-center py-4">Nenhum alerta recente</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fleet' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Mapa da Frota</h2>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Ativo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Parado</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Manutenção</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div style={{ height: '600px' }}>
                  <MapContainer
                    center={[-23.5505, -46.6333]}
                    zoom={11}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {vehicles.map((vehicle) => (
                      <Marker
                        key={vehicle.id}
                        position={[vehicle.lat, vehicle.lng]}
                        icon={createVehicleIcon(vehicle.status, 'truck')}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold text-slate-900">{vehicle.name}</h3>
                            <p className="text-sm text-slate-600">Motorista: {vehicle.driver_name}</p>
                            <div className="mt-2 space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Status:</span>
                                <span className={`font-medium ${
                                  vehicle.status === 'active' ? 'text-green-600' :
                                  vehicle.status === 'idle' ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {vehicle.status === 'active' ? 'Ativo' : 
                                   vehicle.status === 'idle' ? 'Parado' : 'Manutenção'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Velocidade:</span>
                                <span>{vehicle.speed?.toFixed(1)} km/h</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Combustível:</span>
                                <span className={vehicle.fuel_level < 20 ? 'text-red-600 font-medium' : ''}>
                                  {vehicle.fuel_level?.toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Atualizado:</span>
                                <span>{formatTime(vehicle.last_updated)}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedVehicle(vehicle)}
                              className="mt-3 w-full bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                            >
                              Ver Detalhes
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">Central de Alertas</h2>
              
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6">
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div key={alert.id} className={`p-4 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 mt-0.5" />
                            <div>
                              <p className="font-medium">{alert.message}</p>
                              <p className="text-sm mt-1">Tipo: {alert.type} | Severidade: {alert.severity}</p>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <p>{formatTime(alert.timestamp)}</p>
                            <p className="text-xs mt-1">
                              {new Date(alert.timestamp).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {alerts.length === 0 && (
                      <div className="text-center py-12">
                        <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">Nenhum alerta encontrado</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
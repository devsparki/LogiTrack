// Database types for LogiTrack
export type AppRole = 'admin' | 'manager' | 'driver' | 'viewer';
export type VehicleStatus = 'active' | 'maintenance' | 'inactive' | 'in_transit';
export type DriverStatus = 'available' | 'driving' | 'resting' | 'offline' | 'on_break';
export type AlertLevel = 'critical' | 'warning' | 'info';
export type RouteStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'delayed';
export type MaintenanceType = 'preventive' | 'corrective' | 'scheduled' | 'emergency';
export type MaintenanceStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type CargoStatus = 'pending' | 'loaded' | 'in_transit' | 'delivered' | 'cancelled';
export type FuelType = 'gasoline' | 'diesel' | 'ethanol' | 'electric' | 'hybrid';
export type DocumentType = 'license' | 'insurance' | 'ipva' | 'inspection' | 'other';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
  fuel_type: FuelType;
  status: VehicleStatus;
  total_mileage: number;
  partial_mileage: number;
  tank_capacity: number;
  current_fuel_level: number;
  avg_consumption: number | null;
  last_maintenance_date: string | null;
  next_maintenance_date: string | null;
  next_maintenance_mileage: number | null;
  insurance_expiry: string | null;
  license_expiry: string | null;
  ipva_expiry: string | null;
  vin: string | null;
  color: string | null;
  max_load_capacity: number | null;
  is_electric: boolean;
  battery_capacity: number | null;
  current_battery_level: number | null;
  co2_emission_rate: number | null;
  image_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string | null;
  phone: string;
  avatar_url: string | null;
  license_number: string;
  license_category: string;
  license_expiry: string;
  status: DriverStatus;
  rating: number;
  total_trips: number;
  total_distance: number;
  total_hours_worked: number;
  hire_date: string | null;
  birth_date: string | null;
  address: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Route {
  id: string;
  name: string | null;
  vehicle_id: string | null;
  driver_id: string | null;
  status: RouteStatus;
  origin_name: string;
  origin_lat: number;
  origin_lng: number;
  destination_name: string;
  destination_lat: number;
  destination_lng: number;
  waypoints: any;
  planned_distance: number | null;
  actual_distance: number | null;
  planned_duration: number | null;
  actual_duration: number | null;
  planned_start: string | null;
  actual_start: string | null;
  planned_end: string | null;
  actual_end: string | null;
  eta: string | null;
  priority: number;
  is_optimized: boolean;
  fuel_consumed: number | null;
  co2_emitted: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  vehicle?: Vehicle;
  driver?: Driver;
}

export interface Alert {
  id: string;
  alert_type: string;
  level: AlertLevel;
  title: string;
  message: string;
  vehicle_id: string | null;
  driver_id: string | null;
  route_id: string | null;
  is_read: boolean;
  is_resolved: boolean;
  resolved_by: string | null;
  resolved_at: string | null;
  metadata: any;
  created_at: string;
  vehicle?: Vehicle;
  driver?: Driver;
}

export interface MaintenanceRecord {
  id: string;
  vehicle_id: string;
  maintenance_type: MaintenanceType;
  status: MaintenanceStatus;
  title: string;
  description: string | null;
  scheduled_date: string | null;
  completed_date: string | null;
  mileage_at_service: number | null;
  next_service_mileage: number | null;
  next_service_date: string | null;
  cost: number | null;
  service_provider: string | null;
  parts_replaced: any;
  notes: string | null;
  created_at: string;
  updated_at: string;
  vehicle?: Vehicle;
}

export interface FuelRecord {
  id: string;
  vehicle_id: string;
  driver_id: string | null;
  fuel_type: FuelType;
  quantity: number;
  unit_price: number;
  total_cost: number;
  odometer: number | null;
  fuel_station: string | null;
  fuel_card_number: string | null;
  is_full_tank: boolean;
  latitude: number | null;
  longitude: number | null;
  receipt_url: string | null;
  notes: string | null;
  recorded_at: string;
  vehicle?: Vehicle;
  driver?: Driver;
}

export interface Cargo {
  id: string;
  route_id: string | null;
  cargo_type: string;
  description: string | null;
  weight: number | null;
  volume: number | null;
  quantity: number;
  value: number | null;
  is_fragile: boolean;
  is_hazardous: boolean;
  requires_temperature: boolean;
  min_temperature: number | null;
  max_temperature: number | null;
  status: CargoStatus;
  sender_name: string | null;
  sender_address: string | null;
  receiver_name: string | null;
  receiver_address: string | null;
  pickup_date: string | null;
  delivery_date: string | null;
  actual_delivery_date: string | null;
  priority: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  route?: Route;
}

export interface Geofence {
  id: string;
  name: string;
  description: string | null;
  geofence_type: string;
  coordinates: any;
  radius: number | null;
  is_active: boolean;
  alert_on_enter: boolean;
  alert_on_exit: boolean;
  speed_limit: number | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface TelemetryData {
  id: string;
  vehicle_id: string;
  latitude: number;
  longitude: number;
  speed: number | null;
  heading: number | null;
  altitude: number | null;
  fuel_level: number | null;
  battery_level: number | null;
  engine_status: boolean | null;
  odometer: number | null;
  engine_rpm: number | null;
  engine_temp: number | null;
  cargo_temp: number | null;
  cargo_humidity: number | null;
  recorded_at: string;
}

export interface DriverPerformance {
  id: string;
  driver_id: string;
  period_start: string;
  period_end: string;
  trips_completed: number;
  on_time_deliveries: number;
  late_deliveries: number;
  fuel_efficiency_score: number | null;
  safety_score: number | null;
  customer_rating: number | null;
  incidents_count: number;
  hard_brakes: number;
  rapid_accelerations: number;
  speeding_violations: number;
  points_earned: number;
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string | null;
  challenge_type: string;
  target_value: number | null;
  points_reward: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface DriverChallenge {
  id: string;
  driver_id: string;
  challenge_id: string;
  current_value: number;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  challenge?: Challenge;
  driver?: Driver;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  read_at: string | null;
  link: string | null;
  metadata: any;
  created_at: string;
}

export interface ChargingStation {
  id: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  station_type: string | null;
  power_output: number | null;
  connector_types: any;
  is_available: boolean;
  price_per_kwh: number | null;
  notes: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string | null;
  channel: string | null;
  content: string;
  is_read: boolean;
  read_at: string | null;
  attachments: any;
  created_at: string;
}

// Dashboard KPIs
export interface DashboardKPIs {
  totalVehicles: number;
  activeVehicles: number;
  totalDrivers: number;
  activeDrivers: number;
  activeRoutes: number;
  delayedRoutes: number;
  avgFuelConsumption: number;
  totalAlerts: number;
  criticalAlerts: number;
  totalKmToday: number;
  onTimeRate: number;
  incidentsToday: number;
}

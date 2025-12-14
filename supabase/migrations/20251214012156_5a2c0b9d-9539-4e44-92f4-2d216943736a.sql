
-- =====================================================
-- LOGITRACK - COMPLETE DATABASE SCHEMA
-- =====================================================

-- ENUMS
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'driver', 'viewer');
CREATE TYPE public.vehicle_status AS ENUM ('active', 'maintenance', 'inactive', 'in_transit');
CREATE TYPE public.driver_status AS ENUM ('available', 'driving', 'resting', 'offline', 'on_break');
CREATE TYPE public.alert_level AS ENUM ('critical', 'warning', 'info');
CREATE TYPE public.route_status AS ENUM ('planned', 'in_progress', 'completed', 'cancelled', 'delayed');
CREATE TYPE public.maintenance_type AS ENUM ('preventive', 'corrective', 'scheduled', 'emergency');
CREATE TYPE public.maintenance_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.cargo_status AS ENUM ('pending', 'loaded', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE public.fuel_type AS ENUM ('gasoline', 'diesel', 'ethanol', 'electric', 'hybrid');
CREATE TYPE public.document_type AS ENUM ('license', 'insurance', 'ipva', 'inspection', 'other');

-- =====================================================
-- 1. USER MANAGEMENT & AUTHENTICATION
-- =====================================================

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Activity logs for audit
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 2. VEHICLE MANAGEMENT
-- =====================================================

CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate TEXT NOT NULL UNIQUE,
  model TEXT NOT NULL,
  brand TEXT NOT NULL,
  year INTEGER NOT NULL,
  fuel_type fuel_type NOT NULL DEFAULT 'diesel',
  status vehicle_status NOT NULL DEFAULT 'active',
  total_mileage DECIMAL(12,2) DEFAULT 0,
  partial_mileage DECIMAL(12,2) DEFAULT 0,
  tank_capacity DECIMAL(8,2) DEFAULT 100,
  current_fuel_level DECIMAL(5,2) DEFAULT 100,
  avg_consumption DECIMAL(6,2),
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  next_maintenance_mileage DECIMAL(12,2),
  insurance_expiry DATE,
  license_expiry DATE,
  ipva_expiry DATE,
  vin TEXT,
  color TEXT,
  max_load_capacity DECIMAL(10,2),
  is_electric BOOLEAN DEFAULT FALSE,
  battery_capacity DECIMAL(8,2),
  current_battery_level DECIMAL(5,2),
  co2_emission_rate DECIMAL(6,3),
  image_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vehicle documents
CREATE TABLE public.vehicle_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  document_number TEXT,
  issue_date DATE,
  expiry_date DATE,
  file_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 3. DRIVER MANAGEMENT
-- =====================================================

CREATE TABLE public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  avatar_url TEXT,
  license_number TEXT NOT NULL UNIQUE,
  license_category TEXT NOT NULL,
  license_expiry DATE NOT NULL,
  status driver_status NOT NULL DEFAULT 'available',
  rating DECIMAL(3,2) DEFAULT 5.00,
  total_trips INTEGER DEFAULT 0,
  total_distance DECIMAL(12,2) DEFAULT 0,
  total_hours_worked DECIMAL(10,2) DEFAULT 0,
  hire_date DATE,
  birth_date DATE,
  address TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Driver training records
CREATE TABLE public.driver_trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  training_name TEXT NOT NULL,
  training_type TEXT,
  completion_date DATE NOT NULL,
  expiry_date DATE,
  certificate_url TEXT,
  score DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Driver performance metrics
CREATE TABLE public.driver_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  trips_completed INTEGER DEFAULT 0,
  on_time_deliveries INTEGER DEFAULT 0,
  late_deliveries INTEGER DEFAULT 0,
  fuel_efficiency_score DECIMAL(5,2),
  safety_score DECIMAL(5,2),
  customer_rating DECIMAL(3,2),
  incidents_count INTEGER DEFAULT 0,
  hard_brakes INTEGER DEFAULT 0,
  rapid_accelerations INTEGER DEFAULT 0,
  speeding_violations INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 4. GEOFENCING
-- =====================================================

CREATE TABLE public.geofences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  geofence_type TEXT NOT NULL DEFAULT 'polygon',
  coordinates JSONB NOT NULL,
  radius DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  alert_on_enter BOOLEAN DEFAULT TRUE,
  alert_on_exit BOOLEAN DEFAULT TRUE,
  speed_limit DECIMAL(5,2),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Geofence events
CREATE TABLE public.geofence_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  geofence_id UUID NOT NULL REFERENCES public.geofences(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  notes TEXT
);

-- =====================================================
-- 5. ROUTES & ROUTING
-- =====================================================

CREATE TABLE public.routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  status route_status NOT NULL DEFAULT 'planned',
  origin_name TEXT NOT NULL,
  origin_lat DECIMAL(10,8) NOT NULL,
  origin_lng DECIMAL(11,8) NOT NULL,
  destination_name TEXT NOT NULL,
  destination_lat DECIMAL(10,8) NOT NULL,
  destination_lng DECIMAL(11,8) NOT NULL,
  waypoints JSONB,
  planned_distance DECIMAL(10,2),
  actual_distance DECIMAL(10,2),
  planned_duration INTEGER,
  actual_duration INTEGER,
  planned_start TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  planned_end TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  eta TIMESTAMPTZ,
  priority INTEGER DEFAULT 1,
  is_optimized BOOLEAN DEFAULT FALSE,
  fuel_consumed DECIMAL(8,2),
  co2_emitted DECIMAL(8,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Route stops/checkpoints
CREATE TABLE public.route_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
  stop_order INTEGER NOT NULL,
  name TEXT NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  planned_arrival TIMESTAMPTZ,
  actual_arrival TIMESTAMPTZ,
  planned_departure TIMESTAMPTZ,
  actual_departure TIMESTAMPTZ,
  stop_duration INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 6. TELEMETRY & TRACKING
-- =====================================================

CREATE TABLE public.telemetry_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  speed DECIMAL(6,2),
  heading DECIMAL(5,2),
  altitude DECIMAL(8,2),
  fuel_level DECIMAL(5,2),
  battery_level DECIMAL(5,2),
  engine_status BOOLEAN,
  odometer DECIMAL(12,2),
  engine_rpm INTEGER,
  engine_temp DECIMAL(5,2),
  cargo_temp DECIMAL(5,2),
  cargo_humidity DECIMAL(5,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Speed violations
CREATE TABLE public.speed_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  speed_limit DECIMAL(6,2) NOT NULL,
  recorded_speed DECIMAL(6,2) NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  duration_seconds INTEGER,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Driving behavior events
CREATE TABLE public.driving_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  severity TEXT DEFAULT 'medium',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  speed DECIMAL(6,2),
  g_force DECIMAL(5,2),
  details JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 7. ALERTS SYSTEM
-- =====================================================

CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL,
  level alert_level NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  route_id UUID REFERENCES public.routes(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Alert rules configuration
CREATE TABLE public.alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  rule_type TEXT NOT NULL,
  conditions JSONB NOT NULL,
  level alert_level NOT NULL DEFAULT 'warning',
  is_active BOOLEAN DEFAULT TRUE,
  notify_email BOOLEAN DEFAULT TRUE,
  notify_sms BOOLEAN DEFAULT FALSE,
  notify_push BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 8. MAINTENANCE MANAGEMENT
-- =====================================================

CREATE TABLE public.maintenance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  maintenance_type maintenance_type NOT NULL,
  status maintenance_status NOT NULL DEFAULT 'pending',
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date DATE,
  completed_date DATE,
  mileage_at_service DECIMAL(12,2),
  next_service_mileage DECIMAL(12,2),
  next_service_date DATE,
  cost DECIMAL(12,2),
  service_provider TEXT,
  parts_replaced JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Maintenance items/checklist
CREATE TABLE public.maintenance_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  interval_km DECIMAL(10,2),
  interval_days INTEGER,
  is_critical BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 9. FUEL MANAGEMENT
-- =====================================================

CREATE TABLE public.fuel_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  fuel_type fuel_type NOT NULL,
  quantity DECIMAL(8,2) NOT NULL,
  unit_price DECIMAL(8,4) NOT NULL,
  total_cost DECIMAL(12,2) NOT NULL,
  odometer DECIMAL(12,2),
  fuel_station TEXT,
  fuel_card_number TEXT,
  is_full_tank BOOLEAN DEFAULT TRUE,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  receipt_url TEXT,
  notes TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fuel consumption analysis
CREATE TABLE public.fuel_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_fuel DECIMAL(10,2),
  total_distance DECIMAL(12,2),
  avg_consumption DECIMAL(6,2),
  efficiency_score DECIMAL(5,2),
  total_cost DECIMAL(12,2),
  anomaly_detected BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 10. CARGO MANAGEMENT
-- =====================================================

CREATE TABLE public.cargos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES public.routes(id) ON DELETE SET NULL,
  cargo_type TEXT NOT NULL,
  description TEXT,
  weight DECIMAL(10,2),
  volume DECIMAL(10,2),
  quantity INTEGER DEFAULT 1,
  value DECIMAL(14,2),
  is_fragile BOOLEAN DEFAULT FALSE,
  is_hazardous BOOLEAN DEFAULT FALSE,
  requires_temperature BOOLEAN DEFAULT FALSE,
  min_temperature DECIMAL(5,2),
  max_temperature DECIMAL(5,2),
  status cargo_status NOT NULL DEFAULT 'pending',
  sender_name TEXT,
  sender_address TEXT,
  receiver_name TEXT,
  receiver_address TEXT,
  pickup_date TIMESTAMPTZ,
  delivery_date TIMESTAMPTZ,
  actual_delivery_date TIMESTAMPTZ,
  priority INTEGER DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cargo conditions log
CREATE TABLE public.cargo_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cargo_id UUID NOT NULL REFERENCES public.cargos(id) ON DELETE CASCADE,
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  vibration_level DECIMAL(5,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 11. GAMIFICATION & RANKINGS
-- =====================================================

CREATE TABLE public.driver_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  category TEXT,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT NOT NULL,
  target_value DECIMAL(10,2),
  points_reward INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.driver_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  current_value DECIMAL(10,2) DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 12. REPORTS & ANALYTICS
-- =====================================================

CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  parameters JSONB,
  file_url TEXT,
  generated_by UUID REFERENCES auth.users(id),
  is_scheduled BOOLEAN DEFAULT FALSE,
  schedule_cron TEXT,
  last_generated TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 13. NOTIFICATIONS
-- =====================================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  link TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 14. CHARGING STATIONS (EV)
-- =====================================================

CREATE TABLE public.charging_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  station_type TEXT,
  power_output DECIMAL(8,2),
  connector_types JSONB,
  is_available BOOLEAN DEFAULT TRUE,
  price_per_kwh DECIMAL(8,4),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Charging records
CREATE TABLE public.charging_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  station_id UUID REFERENCES public.charging_stations(id) ON DELETE SET NULL,
  energy_consumed DECIMAL(8,2) NOT NULL,
  duration_minutes INTEGER,
  cost DECIMAL(10,2),
  start_battery_level DECIMAL(5,2),
  end_battery_level DECIMAL(5,2),
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ
);

-- =====================================================
-- 15. CHAT/COMMUNICATION
-- =====================================================

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  channel TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  attachments JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geofences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geofence_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speed_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driving_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cargos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cargo_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charging_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charging_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SECURITY DEFINER FUNCTIONS
-- =====================================================

-- Function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is admin or manager
CREATE OR REPLACE FUNCTION public.is_admin_or_manager(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'manager')
  )
$$;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin_or_manager(auth.uid()));

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Activity logs policies
CREATE POLICY "Admins can view logs" ON public.activity_logs FOR SELECT USING (public.is_admin_or_manager(auth.uid()));
CREATE POLICY "Authenticated can insert logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Vehicles policies
CREATE POLICY "Authenticated can view vehicles" ON public.vehicles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage vehicles" ON public.vehicles FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- Vehicle documents policies
CREATE POLICY "Authenticated can view docs" ON public.vehicle_documents FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage docs" ON public.vehicle_documents FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- Drivers policies
CREATE POLICY "Authenticated can view drivers" ON public.drivers FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage drivers" ON public.drivers FOR ALL USING (public.is_admin_or_manager(auth.uid()));
CREATE POLICY "Drivers can update own record" ON public.drivers FOR UPDATE USING (auth.uid() = user_id);

-- Driver trainings policies
CREATE POLICY "Authenticated can view trainings" ON public.driver_trainings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage trainings" ON public.driver_trainings FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- Driver performance policies
CREATE POLICY "Authenticated can view performance" ON public.driver_performance FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage performance" ON public.driver_performance FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- Geofences policies
CREATE POLICY "Authenticated can view geofences" ON public.geofences FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage geofences" ON public.geofences FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- Geofence events policies
CREATE POLICY "Authenticated can view geofence events" ON public.geofence_events FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "System can insert geofence events" ON public.geofence_events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Routes policies
CREATE POLICY "Authenticated can view routes" ON public.routes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage routes" ON public.routes FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- Route stops policies
CREATE POLICY "Authenticated can view stops" ON public.route_stops FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage stops" ON public.route_stops FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- Telemetry policies
CREATE POLICY "Authenticated can view telemetry" ON public.telemetry_data FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "System can insert telemetry" ON public.telemetry_data FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Speed violations policies
CREATE POLICY "Authenticated can view violations" ON public.speed_violations FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "System can insert violations" ON public.speed_violations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Driving events policies
CREATE POLICY "Authenticated can view events" ON public.driving_events FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "System can insert events" ON public.driving_events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Alerts policies
CREATE POLICY "Authenticated can view alerts" ON public.alerts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage alerts" ON public.alerts FOR ALL USING (public.is_admin_or_manager(auth.uid()));
CREATE POLICY "System can insert alerts" ON public.alerts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Alert rules policies
CREATE POLICY "Authenticated can view rules" ON public.alert_rules FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage rules" ON public.alert_rules FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- Maintenance policies
CREATE POLICY "Authenticated can view maintenance" ON public.maintenance_records FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage maintenance" ON public.maintenance_records FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- Maintenance items policies
CREATE POLICY "Authenticated can view items" ON public.maintenance_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage items" ON public.maintenance_items FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- Fuel records policies
CREATE POLICY "Authenticated can view fuel" ON public.fuel_records FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage fuel" ON public.fuel_records FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- Fuel analysis policies
CREATE POLICY "Authenticated can view analysis" ON public.fuel_analysis FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage analysis" ON public.fuel_analysis FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- Cargos policies
CREATE POLICY "Authenticated can view cargos" ON public.cargos FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage cargos" ON public.cargos FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- Cargo conditions policies
CREATE POLICY "Authenticated can view conditions" ON public.cargo_conditions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "System can insert conditions" ON public.cargo_conditions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Driver points policies
CREATE POLICY "Authenticated can view points" ON public.driver_points FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage points" ON public.driver_points FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- Challenges policies
CREATE POLICY "Authenticated can view challenges" ON public.challenges FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage challenges" ON public.challenges FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- Driver challenges policies
CREATE POLICY "Authenticated can view driver challenges" ON public.driver_challenges FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage driver challenges" ON public.driver_challenges FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- Reports policies
CREATE POLICY "Authenticated can view reports" ON public.reports FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage reports" ON public.reports FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Charging stations policies
CREATE POLICY "Authenticated can view stations" ON public.charging_stations FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage stations" ON public.charging_stations FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- Charging records policies
CREATE POLICY "Authenticated can view charging" ON public.charging_records FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage charging" ON public.charging_records FOR ALL USING (public.is_admin_or_manager(auth.uid()));

-- Messages policies
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own sent messages" ON public.messages FOR UPDATE USING (auth.uid() = receiver_id);

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON public.drivers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_geofences_updated_at BEFORE UPDATE ON public.geofences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON public.routes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_alert_rules_updated_at BEFORE UPDATE ON public.alert_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_maintenance_records_updated_at BEFORE UPDATE ON public.maintenance_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cargos_updated_at BEFORE UPDATE ON public.cargos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.telemetry_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

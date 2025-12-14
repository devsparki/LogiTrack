export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      alert_rules: {
        Row: {
          conditions: Json
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          level: Database["public"]["Enums"]["alert_level"]
          name: string
          notify_email: boolean | null
          notify_push: boolean | null
          notify_sms: boolean | null
          rule_type: string
          updated_at: string
        }
        Insert: {
          conditions: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          level?: Database["public"]["Enums"]["alert_level"]
          name: string
          notify_email?: boolean | null
          notify_push?: boolean | null
          notify_sms?: boolean | null
          rule_type: string
          updated_at?: string
        }
        Update: {
          conditions?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          level?: Database["public"]["Enums"]["alert_level"]
          name?: string
          notify_email?: boolean | null
          notify_push?: boolean | null
          notify_sms?: boolean | null
          rule_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      alerts: {
        Row: {
          alert_type: string
          created_at: string
          driver_id: string | null
          id: string
          is_read: boolean | null
          is_resolved: boolean | null
          level: Database["public"]["Enums"]["alert_level"]
          message: string
          metadata: Json | null
          resolved_at: string | null
          resolved_by: string | null
          route_id: string | null
          title: string
          vehicle_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          driver_id?: string | null
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          level?: Database["public"]["Enums"]["alert_level"]
          message: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          route_id?: string | null
          title: string
          vehicle_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          driver_id?: string | null
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          level?: Database["public"]["Enums"]["alert_level"]
          message?: string
          metadata?: Json | null
          resolved_at?: string | null
          resolved_by?: string | null
          route_id?: string | null
          title?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      cargo_conditions: {
        Row: {
          cargo_id: string
          humidity: number | null
          id: string
          recorded_at: string
          temperature: number | null
          vibration_level: number | null
        }
        Insert: {
          cargo_id: string
          humidity?: number | null
          id?: string
          recorded_at?: string
          temperature?: number | null
          vibration_level?: number | null
        }
        Update: {
          cargo_id?: string
          humidity?: number | null
          id?: string
          recorded_at?: string
          temperature?: number | null
          vibration_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cargo_conditions_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
        ]
      }
      cargos: {
        Row: {
          actual_delivery_date: string | null
          cargo_type: string
          created_at: string
          delivery_date: string | null
          description: string | null
          id: string
          is_fragile: boolean | null
          is_hazardous: boolean | null
          max_temperature: number | null
          min_temperature: number | null
          notes: string | null
          pickup_date: string | null
          priority: number | null
          quantity: number | null
          receiver_address: string | null
          receiver_name: string | null
          requires_temperature: boolean | null
          route_id: string | null
          sender_address: string | null
          sender_name: string | null
          status: Database["public"]["Enums"]["cargo_status"]
          updated_at: string
          value: number | null
          volume: number | null
          weight: number | null
        }
        Insert: {
          actual_delivery_date?: string | null
          cargo_type: string
          created_at?: string
          delivery_date?: string | null
          description?: string | null
          id?: string
          is_fragile?: boolean | null
          is_hazardous?: boolean | null
          max_temperature?: number | null
          min_temperature?: number | null
          notes?: string | null
          pickup_date?: string | null
          priority?: number | null
          quantity?: number | null
          receiver_address?: string | null
          receiver_name?: string | null
          requires_temperature?: boolean | null
          route_id?: string | null
          sender_address?: string | null
          sender_name?: string | null
          status?: Database["public"]["Enums"]["cargo_status"]
          updated_at?: string
          value?: number | null
          volume?: number | null
          weight?: number | null
        }
        Update: {
          actual_delivery_date?: string | null
          cargo_type?: string
          created_at?: string
          delivery_date?: string | null
          description?: string | null
          id?: string
          is_fragile?: boolean | null
          is_hazardous?: boolean | null
          max_temperature?: number | null
          min_temperature?: number | null
          notes?: string | null
          pickup_date?: string | null
          priority?: number | null
          quantity?: number | null
          receiver_address?: string | null
          receiver_name?: string | null
          requires_temperature?: boolean | null
          route_id?: string | null
          sender_address?: string | null
          sender_name?: string | null
          status?: Database["public"]["Enums"]["cargo_status"]
          updated_at?: string
          value?: number | null
          volume?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cargos_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          challenge_type: string
          created_at: string
          description: string | null
          end_date: string
          id: string
          is_active: boolean | null
          points_reward: number
          start_date: string
          target_value: number | null
          title: string
        }
        Insert: {
          challenge_type: string
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          points_reward: number
          start_date: string
          target_value?: number | null
          title: string
        }
        Update: {
          challenge_type?: string
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          points_reward?: number
          start_date?: string
          target_value?: number | null
          title?: string
        }
        Relationships: []
      }
      charging_records: {
        Row: {
          cost: number | null
          duration_minutes: number | null
          end_battery_level: number | null
          ended_at: string | null
          energy_consumed: number
          id: string
          start_battery_level: number | null
          started_at: string
          station_id: string | null
          vehicle_id: string
        }
        Insert: {
          cost?: number | null
          duration_minutes?: number | null
          end_battery_level?: number | null
          ended_at?: string | null
          energy_consumed: number
          id?: string
          start_battery_level?: number | null
          started_at: string
          station_id?: string | null
          vehicle_id: string
        }
        Update: {
          cost?: number | null
          duration_minutes?: number | null
          end_battery_level?: number | null
          ended_at?: string | null
          energy_consumed?: number
          id?: string
          start_battery_level?: number | null
          started_at?: string
          station_id?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "charging_records_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "charging_stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charging_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      charging_stations: {
        Row: {
          address: string | null
          connector_types: Json | null
          created_at: string
          id: string
          is_available: boolean | null
          latitude: number
          longitude: number
          name: string
          notes: string | null
          power_output: number | null
          price_per_kwh: number | null
          station_type: string | null
        }
        Insert: {
          address?: string | null
          connector_types?: Json | null
          created_at?: string
          id?: string
          is_available?: boolean | null
          latitude: number
          longitude: number
          name: string
          notes?: string | null
          power_output?: number | null
          price_per_kwh?: number | null
          station_type?: string | null
        }
        Update: {
          address?: string | null
          connector_types?: Json | null
          created_at?: string
          id?: string
          is_available?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          notes?: string | null
          power_output?: number | null
          price_per_kwh?: number | null
          station_type?: string | null
        }
        Relationships: []
      }
      driver_challenges: {
        Row: {
          challenge_id: string
          completed_at: string | null
          created_at: string
          current_value: number | null
          driver_id: string
          id: string
          is_completed: boolean | null
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          created_at?: string
          current_value?: number | null
          driver_id: string
          id?: string
          is_completed?: boolean | null
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          created_at?: string
          current_value?: number | null
          driver_id?: string
          id?: string
          is_completed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_challenges_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_performance: {
        Row: {
          created_at: string
          customer_rating: number | null
          driver_id: string
          fuel_efficiency_score: number | null
          hard_brakes: number | null
          id: string
          incidents_count: number | null
          late_deliveries: number | null
          on_time_deliveries: number | null
          period_end: string
          period_start: string
          points_earned: number | null
          rapid_accelerations: number | null
          safety_score: number | null
          speeding_violations: number | null
          trips_completed: number | null
        }
        Insert: {
          created_at?: string
          customer_rating?: number | null
          driver_id: string
          fuel_efficiency_score?: number | null
          hard_brakes?: number | null
          id?: string
          incidents_count?: number | null
          late_deliveries?: number | null
          on_time_deliveries?: number | null
          period_end: string
          period_start: string
          points_earned?: number | null
          rapid_accelerations?: number | null
          safety_score?: number | null
          speeding_violations?: number | null
          trips_completed?: number | null
        }
        Update: {
          created_at?: string
          customer_rating?: number | null
          driver_id?: string
          fuel_efficiency_score?: number | null
          hard_brakes?: number | null
          id?: string
          incidents_count?: number | null
          late_deliveries?: number | null
          on_time_deliveries?: number | null
          period_end?: string
          period_start?: string
          points_earned?: number | null
          rapid_accelerations?: number | null
          safety_score?: number | null
          speeding_violations?: number | null
          trips_completed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_performance_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_points: {
        Row: {
          category: string | null
          driver_id: string
          earned_at: string
          id: string
          points: number
          reason: string
        }
        Insert: {
          category?: string | null
          driver_id: string
          earned_at?: string
          id?: string
          points: number
          reason: string
        }
        Update: {
          category?: string | null
          driver_id?: string
          earned_at?: string
          id?: string
          points?: number
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_points_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_trainings: {
        Row: {
          certificate_url: string | null
          completion_date: string
          created_at: string
          driver_id: string
          expiry_date: string | null
          id: string
          notes: string | null
          score: number | null
          training_name: string
          training_type: string | null
        }
        Insert: {
          certificate_url?: string | null
          completion_date: string
          created_at?: string
          driver_id: string
          expiry_date?: string | null
          id?: string
          notes?: string | null
          score?: number | null
          training_name: string
          training_type?: string | null
        }
        Update: {
          certificate_url?: string | null
          completion_date?: string
          created_at?: string
          driver_id?: string
          expiry_date?: string | null
          id?: string
          notes?: string | null
          score?: number | null
          training_name?: string
          training_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_trainings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          address: string | null
          avatar_url: string | null
          birth_date: string | null
          created_at: string
          email: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          full_name: string
          hire_date: string | null
          id: string
          license_category: string
          license_expiry: string
          license_number: string
          notes: string | null
          phone: string
          rating: number | null
          status: Database["public"]["Enums"]["driver_status"]
          total_distance: number | null
          total_hours_worked: number | null
          total_trips: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name: string
          hire_date?: string | null
          id?: string
          license_category: string
          license_expiry: string
          license_number: string
          notes?: string | null
          phone: string
          rating?: number | null
          status?: Database["public"]["Enums"]["driver_status"]
          total_distance?: number | null
          total_hours_worked?: number | null
          total_trips?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name?: string
          hire_date?: string | null
          id?: string
          license_category?: string
          license_expiry?: string
          license_number?: string
          notes?: string | null
          phone?: string
          rating?: number | null
          status?: Database["public"]["Enums"]["driver_status"]
          total_distance?: number | null
          total_hours_worked?: number | null
          total_trips?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      driving_events: {
        Row: {
          details: Json | null
          driver_id: string | null
          event_type: string
          g_force: number | null
          id: string
          latitude: number | null
          longitude: number | null
          occurred_at: string
          severity: string | null
          speed: number | null
          vehicle_id: string
        }
        Insert: {
          details?: Json | null
          driver_id?: string | null
          event_type: string
          g_force?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          occurred_at?: string
          severity?: string | null
          speed?: number | null
          vehicle_id: string
        }
        Update: {
          details?: Json | null
          driver_id?: string | null
          event_type?: string
          g_force?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          occurred_at?: string
          severity?: string | null
          speed?: number | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "driving_events_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driving_events_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_analysis: {
        Row: {
          anomaly_detected: boolean | null
          avg_consumption: number | null
          created_at: string
          efficiency_score: number | null
          id: string
          notes: string | null
          period_end: string
          period_start: string
          total_cost: number | null
          total_distance: number | null
          total_fuel: number | null
          vehicle_id: string
        }
        Insert: {
          anomaly_detected?: boolean | null
          avg_consumption?: number | null
          created_at?: string
          efficiency_score?: number | null
          id?: string
          notes?: string | null
          period_end: string
          period_start: string
          total_cost?: number | null
          total_distance?: number | null
          total_fuel?: number | null
          vehicle_id: string
        }
        Update: {
          anomaly_detected?: boolean | null
          avg_consumption?: number | null
          created_at?: string
          efficiency_score?: number | null
          id?: string
          notes?: string | null
          period_end?: string
          period_start?: string
          total_cost?: number | null
          total_distance?: number | null
          total_fuel?: number | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fuel_analysis_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_records: {
        Row: {
          driver_id: string | null
          fuel_card_number: string | null
          fuel_station: string | null
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id: string
          is_full_tank: boolean | null
          latitude: number | null
          longitude: number | null
          notes: string | null
          odometer: number | null
          quantity: number
          receipt_url: string | null
          recorded_at: string
          total_cost: number
          unit_price: number
          vehicle_id: string
        }
        Insert: {
          driver_id?: string | null
          fuel_card_number?: string | null
          fuel_station?: string | null
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id?: string
          is_full_tank?: boolean | null
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          odometer?: number | null
          quantity: number
          receipt_url?: string | null
          recorded_at?: string
          total_cost: number
          unit_price: number
          vehicle_id: string
        }
        Update: {
          driver_id?: string | null
          fuel_card_number?: string | null
          fuel_station?: string | null
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          id?: string
          is_full_tank?: boolean | null
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          odometer?: number | null
          quantity?: number
          receipt_url?: string | null
          recorded_at?: string
          total_cost?: number
          unit_price?: number
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fuel_records_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      geofence_events: {
        Row: {
          event_type: string
          geofence_id: string
          id: string
          latitude: number | null
          longitude: number | null
          notes: string | null
          occurred_at: string
          vehicle_id: string
        }
        Insert: {
          event_type: string
          geofence_id: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          occurred_at?: string
          vehicle_id: string
        }
        Update: {
          event_type?: string
          geofence_id?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          occurred_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "geofence_events_geofence_id_fkey"
            columns: ["geofence_id"]
            isOneToOne: false
            referencedRelation: "geofences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "geofence_events_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      geofences: {
        Row: {
          alert_on_enter: boolean | null
          alert_on_exit: boolean | null
          coordinates: Json
          created_at: string
          created_by: string | null
          description: string | null
          geofence_type: string
          id: string
          is_active: boolean | null
          name: string
          radius: number | null
          speed_limit: number | null
          updated_at: string
        }
        Insert: {
          alert_on_enter?: boolean | null
          alert_on_exit?: boolean | null
          coordinates: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          geofence_type?: string
          id?: string
          is_active?: boolean | null
          name: string
          radius?: number | null
          speed_limit?: number | null
          updated_at?: string
        }
        Update: {
          alert_on_enter?: boolean | null
          alert_on_exit?: boolean | null
          coordinates?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          geofence_type?: string
          id?: string
          is_active?: boolean | null
          name?: string
          radius?: number | null
          speed_limit?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      maintenance_items: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          interval_days: number | null
          interval_km: number | null
          is_critical: boolean | null
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          interval_days?: number | null
          interval_km?: number | null
          is_critical?: boolean | null
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          interval_days?: number | null
          interval_km?: number | null
          is_critical?: boolean | null
          name?: string
        }
        Relationships: []
      }
      maintenance_records: {
        Row: {
          completed_date: string | null
          cost: number | null
          created_at: string
          description: string | null
          id: string
          maintenance_type: Database["public"]["Enums"]["maintenance_type"]
          mileage_at_service: number | null
          next_service_date: string | null
          next_service_mileage: number | null
          notes: string | null
          parts_replaced: Json | null
          scheduled_date: string | null
          service_provider: string | null
          status: Database["public"]["Enums"]["maintenance_status"]
          title: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          maintenance_type: Database["public"]["Enums"]["maintenance_type"]
          mileage_at_service?: number | null
          next_service_date?: string | null
          next_service_mileage?: number | null
          notes?: string | null
          parts_replaced?: Json | null
          scheduled_date?: string | null
          service_provider?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"]
          title: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          maintenance_type?: Database["public"]["Enums"]["maintenance_type"]
          mileage_at_service?: number | null
          next_service_date?: string | null
          next_service_mileage?: number | null
          notes?: string | null
          parts_replaced?: Json | null
          scheduled_date?: string | null
          service_provider?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"]
          title?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: Json | null
          channel: string | null
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          read_at: string | null
          receiver_id: string | null
          sender_id: string
        }
        Insert: {
          attachments?: Json | null
          channel?: string | null
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          receiver_id?: string | null
          sender_id: string
        }
        Update: {
          attachments?: Json | null
          channel?: string | null
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          receiver_id?: string | null
          sender_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          link: string | null
          message: string
          metadata: Json | null
          notification_type: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          message: string
          metadata?: Json | null
          notification_type: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string
          metadata?: Json | null
          notification_type?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          description: string | null
          file_url: string | null
          generated_by: string | null
          id: string
          is_scheduled: boolean | null
          last_generated: string | null
          parameters: Json | null
          report_type: string
          schedule_cron: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_url?: string | null
          generated_by?: string | null
          id?: string
          is_scheduled?: boolean | null
          last_generated?: string | null
          parameters?: Json | null
          report_type: string
          schedule_cron?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_url?: string | null
          generated_by?: string | null
          id?: string
          is_scheduled?: boolean | null
          last_generated?: string | null
          parameters?: Json | null
          report_type?: string
          schedule_cron?: string | null
          title?: string
        }
        Relationships: []
      }
      route_stops: {
        Row: {
          actual_arrival: string | null
          actual_departure: string | null
          created_at: string
          id: string
          latitude: number
          longitude: number
          name: string
          notes: string | null
          planned_arrival: string | null
          planned_departure: string | null
          route_id: string
          stop_duration: number | null
          stop_order: number
        }
        Insert: {
          actual_arrival?: string | null
          actual_departure?: string | null
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          name: string
          notes?: string | null
          planned_arrival?: string | null
          planned_departure?: string | null
          route_id: string
          stop_duration?: number | null
          stop_order: number
        }
        Update: {
          actual_arrival?: string | null
          actual_departure?: string | null
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          notes?: string | null
          planned_arrival?: string | null
          planned_departure?: string | null
          route_id?: string
          stop_duration?: number | null
          stop_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "route_stops_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          actual_distance: number | null
          actual_duration: number | null
          actual_end: string | null
          actual_start: string | null
          co2_emitted: number | null
          created_at: string
          destination_lat: number
          destination_lng: number
          destination_name: string
          driver_id: string | null
          eta: string | null
          fuel_consumed: number | null
          id: string
          is_optimized: boolean | null
          name: string | null
          notes: string | null
          origin_lat: number
          origin_lng: number
          origin_name: string
          planned_distance: number | null
          planned_duration: number | null
          planned_end: string | null
          planned_start: string | null
          priority: number | null
          status: Database["public"]["Enums"]["route_status"]
          updated_at: string
          vehicle_id: string | null
          waypoints: Json | null
        }
        Insert: {
          actual_distance?: number | null
          actual_duration?: number | null
          actual_end?: string | null
          actual_start?: string | null
          co2_emitted?: number | null
          created_at?: string
          destination_lat: number
          destination_lng: number
          destination_name: string
          driver_id?: string | null
          eta?: string | null
          fuel_consumed?: number | null
          id?: string
          is_optimized?: boolean | null
          name?: string | null
          notes?: string | null
          origin_lat: number
          origin_lng: number
          origin_name: string
          planned_distance?: number | null
          planned_duration?: number | null
          planned_end?: string | null
          planned_start?: string | null
          priority?: number | null
          status?: Database["public"]["Enums"]["route_status"]
          updated_at?: string
          vehicle_id?: string | null
          waypoints?: Json | null
        }
        Update: {
          actual_distance?: number | null
          actual_duration?: number | null
          actual_end?: string | null
          actual_start?: string | null
          co2_emitted?: number | null
          created_at?: string
          destination_lat?: number
          destination_lng?: number
          destination_name?: string
          driver_id?: string | null
          eta?: string | null
          fuel_consumed?: number | null
          id?: string
          is_optimized?: boolean | null
          name?: string | null
          notes?: string | null
          origin_lat?: number
          origin_lng?: number
          origin_name?: string
          planned_distance?: number | null
          planned_duration?: number | null
          planned_end?: string | null
          planned_start?: string | null
          priority?: number | null
          status?: Database["public"]["Enums"]["route_status"]
          updated_at?: string
          vehicle_id?: string | null
          waypoints?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "routes_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routes_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      speed_violations: {
        Row: {
          driver_id: string | null
          duration_seconds: number | null
          id: string
          latitude: number | null
          longitude: number | null
          occurred_at: string
          recorded_speed: number
          speed_limit: number
          vehicle_id: string
        }
        Insert: {
          driver_id?: string | null
          duration_seconds?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          occurred_at?: string
          recorded_speed: number
          speed_limit: number
          vehicle_id: string
        }
        Update: {
          driver_id?: string | null
          duration_seconds?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          occurred_at?: string
          recorded_speed?: number
          speed_limit?: number
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "speed_violations_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "speed_violations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      telemetry_data: {
        Row: {
          altitude: number | null
          battery_level: number | null
          cargo_humidity: number | null
          cargo_temp: number | null
          engine_rpm: number | null
          engine_status: boolean | null
          engine_temp: number | null
          fuel_level: number | null
          heading: number | null
          id: string
          latitude: number
          longitude: number
          odometer: number | null
          recorded_at: string
          speed: number | null
          vehicle_id: string
        }
        Insert: {
          altitude?: number | null
          battery_level?: number | null
          cargo_humidity?: number | null
          cargo_temp?: number | null
          engine_rpm?: number | null
          engine_status?: boolean | null
          engine_temp?: number | null
          fuel_level?: number | null
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          odometer?: number | null
          recorded_at?: string
          speed?: number | null
          vehicle_id: string
        }
        Update: {
          altitude?: number | null
          battery_level?: number | null
          cargo_humidity?: number | null
          cargo_temp?: number | null
          engine_rpm?: number | null
          engine_status?: boolean | null
          engine_temp?: number | null
          fuel_level?: number | null
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          odometer?: number | null
          recorded_at?: string
          speed?: number | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "telemetry_data_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_documents: {
        Row: {
          created_at: string
          document_number: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          expiry_date: string | null
          file_url: string | null
          id: string
          issue_date: string | null
          notes: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          document_number?: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          issue_date?: string | null
          notes?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string
          document_number?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          issue_date?: string | null
          notes?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_documents_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          avg_consumption: number | null
          battery_capacity: number | null
          brand: string
          co2_emission_rate: number | null
          color: string | null
          created_at: string
          current_battery_level: number | null
          current_fuel_level: number | null
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id: string
          image_url: string | null
          insurance_expiry: string | null
          ipva_expiry: string | null
          is_electric: boolean | null
          last_maintenance_date: string | null
          license_expiry: string | null
          max_load_capacity: number | null
          model: string
          next_maintenance_date: string | null
          next_maintenance_mileage: number | null
          notes: string | null
          partial_mileage: number | null
          plate: string
          status: Database["public"]["Enums"]["vehicle_status"]
          tank_capacity: number | null
          total_mileage: number | null
          updated_at: string
          vin: string | null
          year: number
        }
        Insert: {
          avg_consumption?: number | null
          battery_capacity?: number | null
          brand: string
          co2_emission_rate?: number | null
          color?: string | null
          created_at?: string
          current_battery_level?: number | null
          current_fuel_level?: number | null
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          id?: string
          image_url?: string | null
          insurance_expiry?: string | null
          ipva_expiry?: string | null
          is_electric?: boolean | null
          last_maintenance_date?: string | null
          license_expiry?: string | null
          max_load_capacity?: number | null
          model: string
          next_maintenance_date?: string | null
          next_maintenance_mileage?: number | null
          notes?: string | null
          partial_mileage?: number | null
          plate: string
          status?: Database["public"]["Enums"]["vehicle_status"]
          tank_capacity?: number | null
          total_mileage?: number | null
          updated_at?: string
          vin?: string | null
          year: number
        }
        Update: {
          avg_consumption?: number | null
          battery_capacity?: number | null
          brand?: string
          co2_emission_rate?: number | null
          color?: string | null
          created_at?: string
          current_battery_level?: number | null
          current_fuel_level?: number | null
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          id?: string
          image_url?: string | null
          insurance_expiry?: string | null
          ipva_expiry?: string | null
          is_electric?: boolean | null
          last_maintenance_date?: string | null
          license_expiry?: string | null
          max_load_capacity?: number | null
          model?: string
          next_maintenance_date?: string | null
          next_maintenance_mileage?: number | null
          notes?: string | null
          partial_mileage?: number | null
          plate?: string
          status?: Database["public"]["Enums"]["vehicle_status"]
          tank_capacity?: number | null
          total_mileage?: number | null
          updated_at?: string
          vin?: string | null
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_manager: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      alert_level: "critical" | "warning" | "info"
      app_role: "admin" | "manager" | "driver" | "viewer"
      cargo_status:
        | "pending"
        | "loaded"
        | "in_transit"
        | "delivered"
        | "cancelled"
      document_type: "license" | "insurance" | "ipva" | "inspection" | "other"
      driver_status:
        | "available"
        | "driving"
        | "resting"
        | "offline"
        | "on_break"
      fuel_type: "gasoline" | "diesel" | "ethanol" | "electric" | "hybrid"
      maintenance_status: "pending" | "in_progress" | "completed" | "cancelled"
      maintenance_type: "preventive" | "corrective" | "scheduled" | "emergency"
      route_status:
        | "planned"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "delayed"
      vehicle_status: "active" | "maintenance" | "inactive" | "in_transit"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_level: ["critical", "warning", "info"],
      app_role: ["admin", "manager", "driver", "viewer"],
      cargo_status: [
        "pending",
        "loaded",
        "in_transit",
        "delivered",
        "cancelled",
      ],
      document_type: ["license", "insurance", "ipva", "inspection", "other"],
      driver_status: ["available", "driving", "resting", "offline", "on_break"],
      fuel_type: ["gasoline", "diesel", "ethanol", "electric", "hybrid"],
      maintenance_status: ["pending", "in_progress", "completed", "cancelled"],
      maintenance_type: ["preventive", "corrective", "scheduled", "emergency"],
      route_status: [
        "planned",
        "in_progress",
        "completed",
        "cancelled",
        "delayed",
      ],
      vehicle_status: ["active", "maintenance", "inactive", "in_transit"],
    },
  },
} as const

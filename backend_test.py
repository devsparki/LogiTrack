import requests
import sys
import time
import json
from datetime import datetime

class LogiTrackAPITester:
    def __init__(self, base_url="https://fleet-monitor-30.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "name": name,
            "success": success,
            "details": details
        })

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Message: {data.get('message', 'No message')}"
            self.log_test("API Root Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("API Root Endpoint", False, str(e))
            return False

    def test_get_vehicles(self):
        """Test GET /vehicles endpoint"""
        try:
            response = requests.get(f"{self.base_url}/vehicles", timeout=10)
            success = response.status_code == 200
            
            if success:
                vehicles = response.json()
                vehicle_count = len(vehicles)
                details = f"Status: {response.status_code}, Vehicles: {vehicle_count}"
                
                # Verify we have the expected 7 vehicles
                if vehicle_count == 7:
                    details += " (Expected 7 vehicles ✓)"
                    # Check vehicle structure
                    if vehicles:
                        vehicle = vehicles[0]
                        required_fields = ['id', 'name', 'driver_name', 'lat', 'lng', 'speed', 'fuel_level', 'status']
                        missing_fields = [field for field in required_fields if field not in vehicle]
                        if missing_fields:
                            success = False
                            details += f", Missing fields: {missing_fields}"
                        else:
                            details += ", Vehicle structure ✓"
                else:
                    details += f" (Expected 7, got {vehicle_count})"
            else:
                details = f"Status: {response.status_code}"
                
            self.log_test("GET /vehicles", success, details)
            return success, response.json() if success else []
        except Exception as e:
            self.log_test("GET /vehicles", False, str(e))
            return False, []

    def test_fleet_stats(self):
        """Test GET /fleet/stats endpoint"""
        try:
            response = requests.get(f"{self.base_url}/fleet/stats", timeout=10)
            success = response.status_code == 200
            
            if success:
                stats = response.json()
                required_fields = ['total_vehicles', 'active_vehicles', 'avg_fuel_level', 'alerts_count']
                missing_fields = [field for field in required_fields if field not in stats]
                
                if missing_fields:
                    success = False
                    details = f"Status: {response.status_code}, Missing fields: {missing_fields}"
                else:
                    details = f"Status: {response.status_code}, Total: {stats['total_vehicles']}, Active: {stats['active_vehicles']}, Avg Fuel: {stats['avg_fuel_level']:.1f}%, Alerts: {stats['alerts_count']}"
            else:
                details = f"Status: {response.status_code}"
                
            self.log_test("GET /fleet/stats", success, details)
            return success, response.json() if success else {}
        except Exception as e:
            self.log_test("GET /fleet/stats", False, str(e))
            return False, {}

    def test_get_alerts(self):
        """Test GET /alerts endpoint"""
        try:
            response = requests.get(f"{self.base_url}/alerts", timeout=10)
            success = response.status_code == 200
            
            if success:
                alerts = response.json()
                alert_count = len(alerts)
                details = f"Status: {response.status_code}, Alerts: {alert_count}"
                
                if alerts:
                    alert = alerts[0]
                    required_fields = ['id', 'vehicle_id', 'type', 'message', 'severity', 'timestamp']
                    missing_fields = [field for field in required_fields if field not in alert]
                    if missing_fields:
                        success = False
                        details += f", Missing fields: {missing_fields}"
                    else:
                        details += ", Alert structure ✓"
            else:
                details = f"Status: {response.status_code}"
                
            self.log_test("GET /alerts", success, details)
            return success, response.json() if success else []
        except Exception as e:
            self.log_test("GET /alerts", False, str(e))
            return False, []

    def test_create_vehicle(self):
        """Test POST /vehicles endpoint"""
        try:
            test_vehicle = {
                "name": "Test Vehicle",
                "driver_name": "Test Driver",
                "lat": -23.5505,
                "lng": -46.6333
            }
            
            response = requests.post(f"{self.base_url}/vehicles", json=test_vehicle, timeout=10)
            success = response.status_code == 200
            
            if success:
                vehicle = response.json()
                details = f"Status: {response.status_code}, Created vehicle: {vehicle.get('name', 'Unknown')}"
                # Verify the created vehicle has required fields
                required_fields = ['id', 'name', 'driver_name', 'lat', 'lng', 'speed', 'fuel_level', 'status']
                missing_fields = [field for field in required_fields if field not in vehicle]
                if missing_fields:
                    success = False
                    details += f", Missing fields: {missing_fields}"
            else:
                details = f"Status: {response.status_code}"
                
            self.log_test("POST /vehicles", success, details)
            return success
        except Exception as e:
            self.log_test("POST /vehicles", False, str(e))
            return False

    def test_create_route(self):
        """Test POST /routes endpoint"""
        try:
            test_route = {
                "name": "Test Route SP",
                "waypoints": [
                    {"lat": -23.5505, "lng": -46.6333},
                    {"lat": -23.5629, "lng": -46.6544},
                    {"lat": -23.5489, "lng": -46.6388}
                ]
            }
            
            response = requests.post(f"{self.base_url}/routes", json=test_route, timeout=10)
            success = response.status_code == 200
            
            if success:
                route = response.json()
                details = f"Status: {response.status_code}, Created route: {route.get('name', 'Unknown')}, Distance: {route.get('total_distance', 0):.2f}km"
                # Verify the created route has required fields
                required_fields = ['id', 'name', 'waypoints', 'total_distance', 'estimated_time']
                missing_fields = [field for field in required_fields if field not in route]
                if missing_fields:
                    success = False
                    details += f", Missing fields: {missing_fields}"
            else:
                details = f"Status: {response.status_code}"
                
            self.log_test("POST /routes", success, details)
            return success
        except Exception as e:
            self.log_test("POST /routes", False, str(e))
            return False

    def test_get_routes(self):
        """Test GET /routes endpoint"""
        try:
            response = requests.get(f"{self.base_url}/routes", timeout=10)
            success = response.status_code == 200
            
            if success:
                routes = response.json()
                route_count = len(routes)
                details = f"Status: {response.status_code}, Routes: {route_count}"
            else:
                details = f"Status: {response.status_code}"
                
            self.log_test("GET /routes", success, details)
            return success
        except Exception as e:
            self.log_test("GET /routes", False, str(e))
            return False

    def test_vehicle_simulation(self):
        """Test if vehicle simulation is working by checking for data changes"""
        try:
            print("\n🔄 Testing vehicle simulation (checking for real-time updates)...")
            
            # Get initial vehicle data
            success1, vehicles1 = self.test_get_vehicles()
            if not success1 or not vehicles1:
                self.log_test("Vehicle Simulation", False, "Could not get initial vehicle data")
                return False
            
            print("⏳ Waiting 35 seconds for simulation update...")
            time.sleep(35)  # Wait for simulation cycle (30s + buffer)
            
            # Get updated vehicle data
            response = requests.get(f"{self.base_url}/vehicles", timeout=10)
            if response.status_code != 200:
                self.log_test("Vehicle Simulation", False, "Could not get updated vehicle data")
                return False
                
            vehicles2 = response.json()
            
            # Check if any vehicle data changed
            changes_detected = False
            for v1, v2 in zip(vehicles1, vehicles2):
                if (v1.get('lat') != v2.get('lat') or 
                    v1.get('lng') != v2.get('lng') or 
                    v1.get('speed') != v2.get('speed') or 
                    v1.get('fuel_level') != v2.get('fuel_level')):
                    changes_detected = True
                    break
            
            details = "Real-time simulation working ✓" if changes_detected else "No changes detected in 35 seconds"
            self.log_test("Vehicle Simulation", changes_detected, details)
            return changes_detected
            
        except Exception as e:
            self.log_test("Vehicle Simulation", False, str(e))
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting LogiTrack API Tests")
        print("=" * 50)
        
        # Basic API tests
        self.test_api_root()
        self.test_get_vehicles()
        self.test_fleet_stats()
        self.test_get_alerts()
        self.test_create_vehicle()
        self.test_create_route()
        self.test_get_routes()
        
        # Real-time simulation test
        self.test_vehicle_simulation()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed. Check details above.")
            failed_tests = [test for test in self.test_results if not test['success']]
            print("\nFailed tests:")
            for test in failed_tests:
                print(f"  - {test['name']}: {test['details']}")
            return 1

def main():
    tester = LogiTrackAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())
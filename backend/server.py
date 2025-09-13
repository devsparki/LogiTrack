from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import uuid
from datetime import datetime, timezone
import asyncio
import random
import math
import socketio
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Socket.IO setup
sio = socketio.AsyncServer(cors_allowed_origins="*", logger=True)

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Global variables for fleet simulation
active_vehicles = {}
simulation_running = False

# Models
class Vehicle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    driver_name: str
    lat: float
    lng: float
    speed: float  # km/h
    fuel_level: float  # percentage
    status: str  # "active", "idle", "maintenance"
    route_id: Optional[str] = None
    last_updated: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    odometer: float = 0.0  # km
    engine_hours: float = 0.0

class VehicleCreate(BaseModel):
    name: str
    driver_name: str
    lat: float
    lng: float

class Route(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    waypoints: List[Dict[str, float]]  # [{"lat": x, "lng": y}, ...]
    total_distance: float  # km
    estimated_time: float  # minutes
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class RouteCreate(BaseModel):
    name: str
    waypoints: List[Dict[str, float]]

class Alert(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    vehicle_id: str
    type: str  # "speed", "fuel", "route_deviation", "maintenance"
    message: str
    severity: str  # "low", "medium", "high", "critical"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    resolved: bool = False

class FleetStats(BaseModel):
    total_vehicles: int
    active_vehicles: int
    idle_vehicles: int
    maintenance_vehicles: int
    avg_fuel_level: float
    total_distance_today: float
    alerts_count: int

# Simulation functions
def generate_initial_vehicles():
    """Generate initial fleet of vehicles around São Paulo area"""
    vehicles = [
        {"name": "Truck SP-001", "driver_name": "João Silva", "lat": -23.5505, "lng": -46.6333},
        {"name": "Van SP-002", "driver_name": "Maria Santos", "lat": -23.5629, "lng": -46.6544},
        {"name": "Truck SP-003", "driver_name": "Carlos Oliveira", "lat": -23.5489, "lng": -46.6388},
        {"name": "Van SP-004", "driver_name": "Ana Costa", "lat": -23.5558, "lng": -46.6396},
        {"name": "Truck SP-005", "driver_name": "Pedro Lima", "lat": -23.5475, "lng": -46.6361},
        {"name": "Van SP-006", "driver_name": "Lucas Pereira", "lat": -23.5597, "lng": -46.6581},
        {"name": "Truck SP-007", "driver_name": "Fernanda Rocha", "lat": -23.5534, "lng": -46.6418}
    ]
    
    return [Vehicle(
        **vehicle_data,
        speed=random.uniform(20, 80),
        fuel_level=random.uniform(30, 100),
        status=random.choice(["active", "idle"]),
        odometer=random.uniform(50000, 200000),
        engine_hours=random.uniform(2000, 8000)
    ) for vehicle_data in vehicles]

async def simulate_vehicle_movement():
    """Simulate real-time vehicle movement"""
    global active_vehicles, simulation_running
    
    if not active_vehicles:
        vehicles = generate_initial_vehicles()
        for vehicle in vehicles:
            active_vehicles[vehicle.id] = vehicle
            # Store in database
            await db.vehicles.replace_one(
                {"id": vehicle.id}, 
                vehicle.dict(), 
                upsert=True
            )
    
    simulation_running = True
    
    while simulation_running:
        alerts_to_send = []
        
        for vehicle_id, vehicle in active_vehicles.items():
            if vehicle.status == "active":
                # Simulate movement
                lat_change = random.uniform(-0.001, 0.001)
                lng_change = random.uniform(-0.001, 0.001)
                
                vehicle.lat += lat_change
                vehicle.lng += lng_change
                
                # More dynamic speed changes with higher speeds
                speed_change = random.uniform(-10, 15)
                vehicle.speed = max(0, min(120, vehicle.speed + speed_change))  # Max 120 km/h
                
                vehicle.fuel_level = max(0, vehicle.fuel_level - random.uniform(0.1, 0.8))
                vehicle.odometer += vehicle.speed * (30 / 3600)  # 30 seconds of movement
                vehicle.engine_hours += 30 / 3600  # 30 seconds in hours
                vehicle.last_updated = datetime.now(timezone.utc)
                
                # Generate alerts with more conditions
                if vehicle.speed > 80:
                    alert = Alert(
                        vehicle_id=vehicle_id,
                        type="speed",
                        message=f"{vehicle.name} excedendo velocidade: {vehicle.speed:.1f} km/h",
                        severity="high" if vehicle.speed < 100 else "critical"
                    )
                    alerts_to_send.append(alert)
                
                if vehicle.fuel_level < 20:  
                    alert = Alert(
                        vehicle_id=vehicle_id,
                        type="fuel",
                        message=f"{vehicle.name} com combustível baixo: {vehicle.fuel_level:.1f}%",
                        severity="medium" if vehicle.fuel_level > 10 else "critical"
                    )
                    alerts_to_send.append(alert)
                    
                if vehicle.fuel_level < 5:  # Emergency fuel alert
                    alert = Alert(
                        vehicle_id=vehicle_id,
                        type="fuel",
                        message=f"EMERGÊNCIA: {vehicle.name} quase sem combustível: {vehicle.fuel_level:.1f}%",
                        severity="critical"
                    )
                    alerts_to_send.append(alert)
                
                # Update database
                await db.vehicles.replace_one(
                    {"id": vehicle_id}, 
                    vehicle.dict(), 
                    upsert=True
                )
        
        # Store alerts in database
        if alerts_to_send:
            alert_dicts = [alert.dict() for alert in alerts_to_send]
            await db.alerts.insert_many(alert_dicts)
            print(f"🚨 Generated {len(alerts_to_send)} new alerts")
        
        # Emit real-time updates via WebSocket
        fleet_data = {
            "vehicles": [v.dict() for v in active_vehicles.values()],
            "alerts": [alert.dict() for alert in alerts_to_send],
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        print(f"📡 Emitting fleet update to {len(active_vehicles)} vehicles at {datetime.now()}")
        await sio.emit("fleet_update", fleet_data)
        
        await asyncio.sleep(30)  # Update every 30 seconds

# WebSocket events
@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")
    # Send current fleet status to newly connected client
    if active_vehicles:
        fleet_data = {
            "vehicles": [v.dict() for v in active_vehicles.values()],
            "alerts": [],
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await sio.emit("fleet_update", fleet_data, room=sid)

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

# API Routes
@api_router.get("/")
async def root():
    return {"message": "LogiTrack API - Fleet Management System"}

@api_router.get("/fleet/stats", response_model=FleetStats)
async def get_fleet_stats():
    total_vehicles = len(active_vehicles)
    active_count = sum(1 for v in active_vehicles.values() if v.status == "active")
    idle_count = sum(1 for v in active_vehicles.values() if v.status == "idle")
    maintenance_count = sum(1 for v in active_vehicles.values() if v.status == "maintenance")
    
    avg_fuel = sum(v.fuel_level for v in active_vehicles.values()) / max(total_vehicles, 1)
    total_distance = sum(v.odometer for v in active_vehicles.values())
    
    # Count recent alerts
    alerts_count = await db.alerts.count_documents({
        "timestamp": {"$gte": datetime.now(timezone.utc).replace(hour=0, minute=0, second=0)}
    })
    
    return FleetStats(
        total_vehicles=total_vehicles,
        active_vehicles=active_count,
        idle_vehicles=idle_count,
        maintenance_vehicles=maintenance_count,
        avg_fuel_level=avg_fuel,
        total_distance_today=total_distance,
        alerts_count=alerts_count
    )

@api_router.get("/vehicles", response_model=List[Vehicle])
async def get_vehicles():
    if not active_vehicles:
        # Load from database
        vehicles_data = await db.vehicles.find().to_list(1000)
        for vehicle_data in vehicles_data:
            vehicle = Vehicle(**vehicle_data)
            active_vehicles[vehicle.id] = vehicle
    
    return list(active_vehicles.values())

@api_router.post("/vehicles", response_model=Vehicle)
async def create_vehicle(vehicle_data: VehicleCreate):
    vehicle = Vehicle(
        **vehicle_data.dict(),
        speed=0,
        fuel_level=100,
        status="idle"
    )
    active_vehicles[vehicle.id] = vehicle
    await db.vehicles.insert_one(vehicle.dict())
    return vehicle

@api_router.get("/alerts", response_model=List[Alert])
async def get_alerts(limit: int = 50):
    alerts_data = await db.alerts.find().sort("timestamp", -1).limit(limit).to_list(limit)
    return [Alert(**alert) for alert in alerts_data]

@api_router.post("/routes", response_model=Route)
async def create_route(route_data: RouteCreate):
    # Calculate total distance (simplified)
    total_distance = 0
    waypoints = route_data.waypoints
    for i in range(len(waypoints) - 1):
        lat1, lng1 = waypoints[i]["lat"], waypoints[i]["lng"]
        lat2, lng2 = waypoints[i + 1]["lat"], waypoints[i + 1]["lng"]
        # Haversine formula (simplified)
        distance = math.sqrt((lat2 - lat1)**2 + (lng2 - lng1)**2) * 111  # rough km conversion
        total_distance += distance
    
    route = Route(
        **route_data.dict(),
        total_distance=total_distance,
        estimated_time=total_distance * 2  # 2 minutes per km (rough estimate)
    )
    
    await db.routes.insert_one(route.dict())
    return route

@api_router.get("/routes", response_model=List[Route])
async def get_routes():
    routes_data = await db.routes.find().to_list(1000)
    return [Route(**route) for route in routes_data]

# Start simulation on startup
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(simulate_vehicle_movement())

# Include the router in the main app
app.include_router(api_router)

# Mount Socket.IO
socket_app = socketio.ASGIApp(sio, app)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    global simulation_running
    simulation_running = False
    client.close()

# Export socket app for uvicorn
app = socket_app
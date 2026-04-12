import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';

// Fix for default marker icons not showing up in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Node Icons
const createColorIcon = (color) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const normalIcon = createColorIcon('blue');
const alertIcon = createColorIcon('red');
const policeIcon = createColorIcon('gold');
const hospitalIcon = createColorIcon('green');
const userIcon = createColorIcon('violet'); // For real-time GPS
const droneIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/9036/9036353.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    className: 'animate-pulse'
});

// Snap Map style avatar icon
const createAvatarIcon = (url, isAlert) => new L.divIcon({
    html: `<div style="background-image: url('${url}'); background-size: cover; width: 40px; height: 40px; border-radius: 50%; border: 3px solid ${isAlert ? '#f43f5e' : '#6366f1'}; box-shadow: 0 4px 10px rgba(0,0,0,0.3);position:relative;">
            ${isAlert ? '<div style="position:absolute; inset:-4px; border: 2px solid #f43f5e; border-radius: 50%; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>' : ''}
           </div>`,
    className: 'custom-avatar-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

// --- Feature: Heatmap Layer ---
function HeatmapLayer({ alertPoints }) {
    const map = useMap();

    useEffect(() => {
        if (!alertPoints || alertPoints.length === 0) return;
        const heatLayer = L.heatLayer(alertPoints, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            gradient: { 0.4: 'yellow', 0.6: 'orange', 1.0: 'red' }
        }).addTo(map);

        return () => { map.removeLayer(heatLayer); };
    }, [map, alertPoints]);

    return null;
}

// Component to dynamically update map center
function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

// High-Risk Geospatial Intelligence Database
const DANGER_ZONES = [
    { id: 'z1', name: 'Sundarbans Tiger Reserve', pos: [21.9497, 89.1833], radius: 15000, risk: 'Critical', desc: 'Active tiger habitat & complex mangroves' },
    { id: 'z2', name: 'Parvati Valley (Bermuda Triangle)', pos: [32.0100, 77.3150], radius: 5000, risk: 'High', desc: 'Frequent hiker disappearances & rugged terrain' },
    { id: 'z3', name: 'Gadchiroli Red Zone', pos: [20.1700, 80.0000], radius: 20000, risk: 'Critical', desc: 'High risk of insurgency activity' },
    { id: 'z4', name: 'Jim Corbett Core Sector', pos: [29.5333, 78.7733], radius: 8000, risk: 'High', desc: 'Wild elephant & tiger transit corridor' }
];

export default function MapComponent({ selectedIncident, heatmapData = [], enableSmartRouting = true, activeUsers = [], droneDispatched = false }) {
    const defaultCenter = [27.0410, 88.2663];
    const defaultZoom = 13;

    // Real-Time GPS State
    const [realTimePos, setRealTimePos] = useState(null);
    const [testZone, setTestZone] = useState(null);
    const [dronePos, setDronePos] = useState(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setRealTimePos([lat, lng]);
                
                // Spawn a dynamic "Research Test Zone" 1.5km away from the user for demo purposes
                setTestZone({
                    name: "AI-Flagged Risk Perimeter",
                    pos: [lat + 0.008, lng + 0.008],
                    radius: 1000,
                    risk: 'Warning',
                    desc: 'Simulated dangerous forest blockage detected by Neural Engine'
                });
            }, (error) => {
                console.warn("Geolocation blocked or failed:", error.message);
            }, {
                enableHighAccuracy: true
            });
        }
    }, []);

    let currentCenter = realTimePos || defaultCenter;
    let currentZoom = realTimePos ? 15 : defaultZoom;
    let activeMarker = null;

    // Simulated Smart Routing & Geospatial Data
    const geospatialNodes = [
        { id: 'p1', pos: [27.0450, 88.2610], type: 'Police Station', name: 'Sadar Police Station', dist: '1.2 km' },
        { id: 'h1', pos: [27.0390, 88.2700], type: 'Hospital', name: 'Eden Hospital', dist: '0.8 km' },
    ];
    
    // Default mock escape route leading to hospital
    let smartEscapeRoute = null;

    if (selectedIncident) {
        if (selectedIncident.lat && selectedIncident.lng) {
            currentCenter = [selectedIncident.lat, selectedIncident.lng];
            currentZoom = 15;
            activeMarker = {
                position: currentCenter,
                title: selectedIncident.user || "Unknown User",
                description: selectedIncident.type,
                isAlert: false
            };
        } else if (selectedIncident.location) {
            if (selectedIncident.location.includes('Tiger Hill')) {
                currentCenter = [26.9744, 88.2711];
            } else if (selectedIncident.location.includes('Spiti Valley')) {
                currentCenter = [32.2396, 78.0349];
            } else if (selectedIncident.location.includes('Kaziranga')) {
                currentCenter = [26.5775, 93.1711];
            } else {
                currentCenter = [defaultCenter[0] + 0.01, defaultCenter[1] + 0.01];
            }
            currentZoom = 15;
            activeMarker = {
                position: currentCenter,
                title: selectedIncident.user,
                description: selectedIncident.title,
                isAlert: selectedIncident.type === 'panic' || selectedIncident.type === 'efir'
            };
        }
        
        // Feature: Smart Escape Routing dynamically created from user position to nearest haven
        if (enableSmartRouting && activeMarker) {
            smartEscapeRoute = [
                activeMarker.position,
                [activeMarker.position[0] - 0.002, activeMarker.position[1] + 0.001], 
                [activeMarker.position[0] - 0.004, activeMarker.position[1] + 0.003], 
                geospatialNodes[1].pos // Ends at Hospital safe haven
            ];
        }
    }

    // Drone dispatch flight simulation
    useEffect(() => {
        if (droneDispatched && activeMarker) {
            let start = geospatialNodes[0].pos; // Police station
            let end = activeMarker.position;    // Incident location
            let step = 0;
            const steps = 60; // Frames

            const interval = setInterval(() => {
                step++;
                if (step <= steps) {
                    setDronePos([
                        start[0] + ((end[0] - start[0]) * (step / steps)),
                        start[1] + ((end[1] - start[1]) * (step / steps))
                    ]);
                } else {
                    clearInterval(interval);
                }
            }, 100);

            return () => clearInterval(interval);
        } else {
            setDronePos(null);
        }
    }, [droneDispatched, activeMarker]);

    return (
        <MapContainer
            center={currentCenter}
            zoom={currentZoom}
            style={{ height: '100%', width: '100%', borderRadius: '1rem', zIndex: 1 }}
        >
            <ChangeView center={currentCenter} zoom={currentZoom} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            
            <HeatmapLayer alertPoints={heatmapData} />

            {/* Smart Escape Route Polyline */}
            {smartEscapeRoute && (
                <Polyline 
                    positions={smartEscapeRoute} 
                    pathOptions={{ color: '#10b981', weight: 5, dashArray: '10, 10', lineJoin: 'round' }} 
                />
            )}

            {/* AI Intercept Drone Telemetry */}
            {droneDispatched && dronePos && activeMarker && (
                <>
                    <Polyline 
                        positions={[geospatialNodes[0].pos, dronePos]} 
                        pathOptions={{ color: '#6366f1', weight: 3, dashArray: '4, 8' }} 
                    />
                    <Marker position={dronePos} icon={droneIcon}>
                        <Popup>
                            <div className="text-center font-sans">
                                <strong className="text-indigo-600 block uppercase text-[10px] tracking-widest font-black">AI Drone Fleet</strong>
                                <span className="text-xs text-slate-500">Autonomous Intercept Active</span>
                            </div>
                        </Popup>
                    </Marker>
                    <Circle center={dronePos} radius={350} pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.1, weight: 1, dashArray: '4' }} />
                </>
            )}

            {/* Geospatial Intelligence Layer Nodes */}
            {enableSmartRouting && geospatialNodes.map(node => (
                <Marker key={node.id} position={node.pos} icon={node.type === 'Police Station' ? policeIcon : hospitalIcon}>
                    <Popup>
                        <div className="font-sans">
                            <strong className="text-slate-800">{node.type}</strong><br/>
                            <span className="text-sm font-semibold">{node.name}</span><br/>
                            <span className="text-xs text-slate-500">{node.dist} away</span>
                            <button className="mt-2 w-full py-1 bg-emerald-50 text-emerald-600 font-bold text-xs rounded hover:bg-emerald-100 transition-colors">
                                Navigate to Safety
                            </button>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Snap Map: Active Users Overly */}
            {activeUsers.map(user => (
                <Marker 
                    key={user.id} 
                    position={[user.lat, user.lng]} 
                    icon={createAvatarIcon(user.profilePic || "https://i.pravatar.cc/150?u="+user.id, false)}
                >
                    <Popup>
                        <div className="font-sans text-center">
                            <div className="flex justify-center mb-2">
                                <img src={user.profilePic || "https://i.pravatar.cc/150?u="+user.id} alt="profile" className="w-12 h-12 rounded-full border-2 border-indigo-500" />
                            </div>
                            <strong className="text-slate-900 block">{user.name}</strong>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.status || "Active Patrol"}</span>
                            <br/>
                            <span className="text-xs text-slate-400 mt-1 block">Live GPS: {user.lat.toFixed(4)}, {user.lng.toFixed(4)}</span>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Rendering High-Risk Hot Zones */}
            {[...DANGER_ZONES, ...(testZone ? [testZone] : [])].map(zone => (
                <Circle 
                    key={zone.name}
                    center={zone.pos}
                    radius={zone.radius}
                    pathOptions={{ 
                        color: zone.risk === 'Critical' ? '#f43f5e' : '#f59e0b', 
                        fillColor: zone.risk === 'Critical' ? '#f43f5e' : '#f59e0b', 
                        fillOpacity: 0.15,
                        dashArray: '5, 10'
                    }}
                >
                    <Popup>
                        <div className="p-2">
                            <h4 className={`font-bold mb-1 ${zone.risk === 'Critical' ? 'text-rose-600' : 'text-amber-600'}`}>HOT ZONE: {zone.name}</h4>
                            <p className="text-xs text-slate-600 leading-tight">{zone.desc}</p>
                            <div className="mt-2 text-[10px] uppercase font-black tracking-widest bg-slate-100 p-1 text-center rounded">
                                Risk Level: {zone.risk}
                            </div>
                        </div>
                    </Popup>
                </Circle>
            ))}

            {activeMarker ? (
                <Marker
                    position={activeMarker.position}
                    icon={activeMarker.isAlert ? alertIcon : normalIcon}
                >
                    <Popup>
                        <div className="font-sans">
                            <strong className={activeMarker.isAlert ? 'text-rose-600' : 'text-slate-800'}>
                                {activeMarker.title}
                            </strong>
                            <br />
                            <span className="text-sm text-slate-500">{activeMarker.description}</span>
                            {activeMarker.isAlert && (
                                <div className="mt-2 bg-rose-50 text-rose-600 px-2 py-1 text-xs font-bold rounded">
                                    CRITICAL HIGH-RISK ZONE
                                </div>
                            )}
                        </div>
                    </Popup>
                </Marker>
            ) : realTimePos ? (
                <>
                    <Marker
                        position={realTimePos}
                        icon={userIcon}
                    >
                        <Popup>
                            <div className="font-sans">
                                <strong className="text-violet-600 border-b border-violet-100 pb-1 mb-1 flex items-center">
                                    <span className="flex h-2 w-2 relative mr-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                                    </span>
                                    Your Real-Time Location
                                </strong>
                                <span className="text-xs text-slate-600 mt-1">Live GPS tracking active</span>
                                <span className="text-[9px] text-slate-400 font-mono mt-1">
                                    {realTimePos[0].toFixed(5)}, {realTimePos[1].toFixed(5)}
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                    <GeofenceLogic userPos={realTimePos} zones={[...DANGER_ZONES, ...(testZone ? [testZone] : [])]} />
                </>
            ) : null}
        </MapContainer>
    );
}

// Logic to check Geofence entry/exit
function GeofenceLogic({ userPos, zones = [] }) {
    const [activeZone, setActiveZone] = useState(null);
    
    useEffect(() => {
        if (!userPos || zones.length === 0) return;
        
        let currentlyIn = null;

        zones.forEach(zone => {
            const distance = L.latLng(userPos).distanceTo(L.latLng(zone.pos));
            if (distance <= zone.radius) {
                currentlyIn = zone;
            }
        });

        if (currentlyIn && activeZone?.name !== currentlyIn.name) {
            import('sonner').then(({ toast }) => {
                const message = `CRITICAL ENTRY: You have entered ${currentlyIn.name}. ${currentlyIn.desc}. AI Shadow Monitoring engaged.`;
                if (currentlyIn.risk === 'Critical') toast.error(message);
                else toast.warning(message);
            });
            setActiveZone(currentlyIn);
        } else if (!currentlyIn && activeZone) {
            import('sonner').then(({ toast }) => toast.success(`SAFE EXIT: You have left ${activeZone.name}. Resume standard protocol.`));
            setActiveZone(null);
        }
    }, [userPos, zones, activeZone]);

    return null;
}


import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons not showing up in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom icons for different alert types
const normalIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const alertIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to dynamically update map center
function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function MapComponent({ selectedIncident }) {
    // Default coordinates (e.g., center of India/Darjeeling if no selection)
    const defaultCenter = [27.0410, 88.2663];
    const defaultZoom = 12;

    // Extract coordinates from selected incident if available
    // Assuming 'location' string might be used to derive coords later, or mock it based on selection
    let currentCenter = defaultCenter;
    let currentZoom = defaultZoom;
    let activeMarker = null;

    if (selectedIncident) {
        // Basic mock coordinates based on location text
        if (selectedIncident.location.includes('Tiger Hill')) {
            currentCenter = [26.9744, 88.2711];
        } else if (selectedIncident.location.includes('Spiti Valley')) {
            currentCenter = [32.2396, 78.0349];
        } else if (selectedIncident.location.includes('Kaziranga')) {
            currentCenter = [26.5775, 93.1711];
        } else {
            // Fallback offset
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

    return (
        <MapContainer
            center={currentCenter}
            zoom={currentZoom}
            style={{ height: '100%', width: '100%', borderRadius: '1rem', zIndex: 1 }}
        >
            <ChangeView center={currentCenter} zoom={currentZoom} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {activeMarker && (
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
                        </div>
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
}

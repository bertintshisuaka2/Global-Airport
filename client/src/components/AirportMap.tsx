import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Airport {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  municipality: string | null;
  iata_code: string | null;
  icao_code: string | null;
}

interface AirportMapProps {
  airports: Airport[];
  center?: [number, number];
  zoom?: number;
  onAirportClick?: (airport: Airport) => void;
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

export default function AirportMap({
  airports,
  center = [20, 0],
  zoom = 2,
  onAirportClick,
}: AirportMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%", minHeight: "400px" }}
      className="rounded-lg border border-border"
    >
      <MapUpdater center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {airports.map((airport) => (
        <Marker
          key={airport.id}
          position={[airport.latitude, airport.longitude]}
          eventHandlers={{
            click: () => {
              if (onAirportClick) {
                onAirportClick(airport);
              }
            },
          }}
        >
          <Popup>
            <div className="text-sm">
              <h3 className="font-semibold">{airport.name}</h3>
              {airport.municipality && (
                <p className="text-muted-foreground">{airport.municipality}</p>
              )}
              {airport.iata_code && (
                <p className="text-xs">
                  <span className="font-medium">IATA:</span> {airport.iata_code}
                </p>
              )}
              {airport.icao_code && (
                <p className="text-xs">
                  <span className="font-medium">ICAO:</span> {airport.icao_code}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}


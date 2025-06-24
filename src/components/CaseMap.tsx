import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { useState } from "react";
import caseData from "../data/case.json";
import "leaflet/dist/leaflet.css";
import "../styles/casemap.css";

type Case = {
  caseId: string;
  borrowerName: string;
  address: string;
  lenderName: string;
  latitude: number;
  longitude: number;
  county: string;
};

const ZOOM_THRESHOLD = 8;

function ZoomWatcher({ onZoomChange }: { onZoomChange: (z: number) => void }) {
  useMapEvents({
    zoomend: (e) => onZoomChange(e.target.getZoom()),
  });
  return null;
}

export default function CaseMap() {
  const center: [number, number] = [54.5, -3];
  const [zoom, setZoom] = useState(6);

  const groupedByCounty = caseData.reduce<Record<string, Case[]>>((acc, curr) => {
    const county = curr.county || "Unknown";
    if (!acc[county]) acc[county] = [];
    acc[county].push(curr);
    return acc;
  }, {});

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <ZoomWatcher onZoomChange={setZoom} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {zoom < ZOOM_THRESHOLD
          ? Object.entries(groupedByCounty).map(([county, cases]) => {
              const count = cases.length;
              const avgLat =
                cases.reduce((sum, c) => sum + c.latitude, 0) / count;
              const avgLng =
                cases.reduce((sum, c) => sum + c.longitude, 0) / count;

              const icon = L.divIcon({
                className: "county-cluster-icon",
                html: `<div class="cluster-marker">${count}</div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20],
              });

              return (
                <Marker key={county} position={[avgLat, avgLng]} icon={icon}>
                  <Popup>
                    <strong>{county}</strong>
                    <br />
                    {count} case{count > 1 ? "s" : ""}
                  </Popup>
                </Marker>
              );
            })
          : caseData.map((c) => (
              <CircleMarker
                key={c.caseId}
                center={[c.latitude, c.longitude]}
                radius={8}
                pathOptions={{
                  color: "#4CAF50",
                  fillColor: "#4CAF50",
                  fillOpacity: 0.7,
                }}
              >
                <Popup>
                  <strong>{c.borrowerName}</strong>
                  <br />
                  {c.address}
                  <br />
                  <em>{c.lenderName}</em>
                </Popup>
              </CircleMarker>
            ))}
      </MapContainer>
    </div>
  );
}

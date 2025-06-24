import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  Popup,
  useMapEvents,
  GeoJSON,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
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
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [highlightedFeature, setHighlightedFeature] = useState<any | null>(null);

  // Mapping for case.json counties to GeoJSON names
  const countyMap: Record<string, string> = {
    "Greater London": "Greater London",
    "South Yorkshire": "South Yorkshire",
    "West Yorkshire": "West Yorkshire",
    "East Riding of Yorkshire": "East Riding of Yorkshire",
    "Nottinghamshire": "Nottinghamshire",
    "Derbyshire": "Derbyshire",
    "Berkshire": "Berkshire",
    "Leicestershire": "Leicestershire",
    "Cambridgeshire": "Cambridgeshire",
    "Oxfordshire": "Oxfordshire",
    "Gloucestershire": "Gloucestershire",
    "North Yorkshire": "North Yorkshire",
    "Somerset": "Somerset",
    "Merseyside": "Merseyside",
    "Isle of Anglesey": "Isle of Anglesey",
    "West Midlands": "West Midlands",
    // Extend this as needed
  };

  useEffect(() => {
    fetch("/data/uk-counties.geojson")
      .then((res) => res.json())
      .then((data) => setGeoJsonData(data));
  }, []);

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

          // url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          // attribution="© OpenStreetMap & CartoDB"

          // url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
          // attribution="Tiles © Esri"
        />

        {/* Show hovered outline */}
        {highlightedFeature && (
          <GeoJSON
            key={highlightedFeature.properties.county}
            data={highlightedFeature}
            style={{
              color: "#FF5733",
              weight: 3,
              fillOpacity: 0.1,
            }}
          />
        )}

        {zoom < ZOOM_THRESHOLD
          ? Object.entries(groupedByCounty).map(([county, cases]) => {
              const count = cases.length;
              const avgLat = cases.reduce((sum, c) => sum + c.latitude, 0) / count;
              const avgLng = cases.reduce((sum, c) => sum + c.longitude, 0) / count;

              const icon = L.divIcon({
                className: "county-cluster-icon",
                html: `<div class="cluster-marker">${count}</div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20],
              });

              return (
                <Marker
                  key={county}
                  position={[avgLat, avgLng]}
                  icon={icon}
                  eventHandlers={{
                    mouseover: () => {
                      if (!geoJsonData) return;
                        const mapped = countyMap[county] || county;

                        const match = geoJsonData.features.find(
                          (f: any) =>
                            (f.properties?.county || "").toLowerCase() === (mapped || "").toLowerCase()
                        );

                        setHighlightedFeature(match || null);
                      },
                    mouseout: () => setHighlightedFeature(null),
                  }}
                >
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
                  color: "#4da6ff",
                  fillColor: "#4da6ff",
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

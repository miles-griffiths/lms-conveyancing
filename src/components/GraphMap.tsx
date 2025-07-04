import React, { useEffect, useRef } from "react";
import Ogma from "@linkurious/ogma";
import * as leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/graphmap.css";
import remortgageCases from "../data/remortgage-cases.json";

Ogma.libraries["leaflet"] = leaflet;

type CaseNode = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  county: string;
};

const ZOOM_THRESHOLD = 9;

const GraphMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ogmaRef = useRef<Ogma | null>(null);
  const countyLayerRef = useRef<leaflet.GeoJSON | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ogma = new Ogma({ container: containerRef.current });
    ogmaRef.current = ogma;

    const caseNodes: CaseNode[] = Object.entries(remortgageCases)
      .map(([id, entry]: any) => {
        const addr = entry?.property?.address;
        const borrower = entry?.borrowers?.[0];
        const lat = addr?.lat;
        const lng = addr?.lng;
        const county = addr?.county;

        if (lat && lng && county) {
          return {
            id,
            label: borrower?.surname ?? id,
            latitude: lat,
            longitude: lng,
            county,
          };
        }
        return null;
      })
      .filter(Boolean) as CaseNode[];

    const createCountyClusters = () => {
      const groups = caseNodes.reduce<Record<string, CaseNode[]>>((acc, node) => {
        acc[node.county] = acc[node.county] || [];
        acc[node.county].push(node);
        return acc;
      }, {});

      return Object.entries(groups).map(([county, cases]) => {
        const lat = cases.reduce((sum, n) => sum + n.latitude, 0) / cases.length;
        const lng = cases.reduce((sum, n) => sum + n.longitude, 0) / cases.length;
        return {
          id: `county-${county}`,
          label: `${cases.length} case${cases.length > 1 ? "s" : ""}`,
          data: { latitude: lat, longitude: lng },
          attributes: {
            radius: Math.min(5 + cases.length * 0.8, 50),
            color: "#ffa500",
          },
        };
      });
    };

    const loadClusters = async () => {
      const clusterNodes = createCountyClusters();
      await ogma.clearGraph();
      await ogma.addNodes(clusterNodes);
      console.log("🧩 Loaded clusters");
    };

    const loadIndividualNodes = async () => {
      const rawNodes = caseNodes.map((n) => ({
        id: n.id,
        label: n.label,
        data: {
          latitude: n.latitude,
          longitude: n.longitude,
        },
        attributes: {
          radius: 5,
          color: "#4da6ff",
        },
      }));

      await ogma.clearGraph();
      await ogma.addNodes(rawNodes);
      console.log("🔍 Loaded individuals");
    };

    const loadCountyShapes = async () => {
      const res = await fetch("/data/uk-counties.geojson");
      const geoJson = await res.json();

      const map = ogmaRef.current?.geo.getMap();
      if (!map) return;

      const defaultStyle = {
        color: "#ffa500",
        weight: 1,
        fillOpacity: 0.1,
      };

      const hoverStyle = {
        color: "red",
        weight: 2,
        fillOpacity: 0.15,
      };

      const countyLayer = leaflet.geoJSON(geoJson, {
        style: defaultStyle,
        onEachFeature: (feature, layer) => {
          const pathLayer = layer as leaflet.Path;

          pathLayer.on("mouseover", () => {
            pathLayer.setStyle(hoverStyle);
            pathLayer.bringToFront();
          });

          pathLayer.on("mouseout", () => {
            pathLayer.setStyle(defaultStyle);
          });
        },
      });

      countyLayer.addTo(map);
      countyLayerRef.current = countyLayer;

      console.log("🗺️ Added county shapes with hover effect");
    };

    const setup = async () => {
      await ogma.geo.enable();
      await loadCountyShapes();
      await loadClusters();

      const map = ogma.geo.getMap();
      if (!map) return;

      map.setView([54.5, -3], 6);

      let currentMode: "cluster" | "individual" = "cluster";

      map.on("zoomend", async () => {
        const z = map.getZoom();
        if (z >= ZOOM_THRESHOLD && currentMode !== "individual") {
          await loadIndividualNodes();
          currentMode = "individual";
        } else if (z < ZOOM_THRESHOLD && currentMode !== "cluster") {
          await loadClusters();
          currentMode = "cluster";
        }
      });
    };

    setup();

    return () => {
      ogma.destroy();
    };
  }, []);

  return <div id="geo-map-container" ref={containerRef} />;
};

export default GraphMap;

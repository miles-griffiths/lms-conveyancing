import React, { useEffect, useRef } from "react";
import Ogma from "@linkurious/ogma";
import L from "leaflet";
import Supercluster from "supercluster";
import "../styles/geomappage.css";
import remortgageCases from "../data/remortgage-cases.json";

type CaseNode = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  county: string;
};

type GeoJsonPoint = {
  type: "Feature";
  properties: {
    id: string;
    label: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
};

const GeoCaseMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ogmaRef = useRef<Ogma | null>(null);
  const clusterIndexRef = useRef<Supercluster | null>(null);
  const updateRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    Ogma.libraries["leaflet"] = L;
    const ogma = new Ogma({
      container: containerRef.current,
      renderer: "webgl",
    });
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
      .filter((n): n is CaseNode => n !== null);

    const geoJsonPoints: GeoJsonPoint[] = caseNodes.map((n) => ({
      type: "Feature",
      properties: { id: n.id, label: n.label },
      geometry: {
        type: "Point",
        coordinates: [n.longitude, n.latitude],
      },
    }));

    const clusterIndex = new Supercluster({
      radius: 60,
      maxZoom: 18,
    }).load(geoJsonPoints);
    clusterIndexRef.current = clusterIndex;

    const update = () => {
      const ogma = ogmaRef.current;
      const map = ogma?.geo.getMap();
      const clusterIndex = clusterIndexRef.current;
      if (!ogma || !map || !clusterIndex) return;

      const bounds = map.getBounds();
      const zoom = map.getZoom();

      const bbox: [number, number, number, number] = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ];

      const clusters = clusterIndex.getClusters(bbox, zoom);

      const nodes = clusters.map((c: any) => {
        const [lng, lat] = c.geometry.coordinates;
        const isCluster = !!c.properties.cluster;
        return {
          id: isCluster ? `cluster-${c.id}` : c.properties.id,
          data: {
            latitude: lat,
            longitude: lng,
          },
          attributes: {
            radius: isCluster ? 15 : 5,
            color: isCluster ? "#ffa500" : "#4da6ff",
            text: {
              content: isCluster ? `${c.properties.point_count_abbreviated}` : "",
              position: "center" as const,
              size: 14,
              color: "#000",
            },
          },
        };
      });

      ogma.setGraph({ nodes, edges: [] });
      console.log("📍 Updated graph with", nodes.length, "nodes at zoom", zoom);
    };

    updateRef.current = update;

    const setup = async () => {
      await ogma.geo.enable();

      const map = ogma.geo.getMap();
      if (!map) return;

      map.setView([54.5, -3], 6); // Center on UK

      ogma.styles.setHoveredNodeAttributes({
        text: { backgroundColor: "#000" },
      });

      ogma.events.on("viewChanged", update);
      update(); // Initial load
    };

    setup();

    return () => {
      const ogma = ogmaRef.current;
      const update = updateRef.current;

      if (ogma && update) {
        ogma.events.off(update); // ✅ Your version only accepts the listener
        ogma.destroy();
      }
    };
  }, []);

  return <div id="geo-map-container" ref={containerRef} />;
};

export default GeoCaseMap;

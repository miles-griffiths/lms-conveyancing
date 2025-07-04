import React, { useEffect, useRef } from "react";
import Ogma from "@linkurious/ogma";
import "../styles/geomappage.css";
import remortgageCases from "../data/remortgage-cases.json";

type CaseNode = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  county: string;
};

const ZOOM_THRESHOLD = 9;

const GeoCaseMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ogmaRef = useRef<Ogma | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ogma = new Ogma({ container: containerRef.current });
    ogmaRef.current = ogma;

    // ✅ Compatible text rule for Ogma v5.3.0 (no offsetY)
    ogma.styles.addRule({
      nodeAttributes: {
        text: {
          color: "#000000",
          size: 14,
          content: (node) => node.getData("label"),
        },
      },
    });

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

      const result = [];

      for (const [county, cases] of Object.entries(groups)) {
        const lat = cases.reduce((sum, n) => sum + n.latitude, 0) / cases.length;
        const lng = cases.reduce((sum, n) => sum + n.longitude, 0) / cases.length;
        const caseCount = cases.length;

        result.push({
          id: `county-${county}`,
          data: {
            latitude: lat,
            longitude: lng,
            label: `${caseCount}`, // ✅ store label in data
          },
          attributes: {
            radius: Math.min(30 + caseCount, 60),
            color: "#ffa500",
          },
        });
      }

      return result;
    };

    const loadClusters = async () => {
      const ogma = ogmaRef.current;
      if (!ogma) return;

      const clusterNodes = createCountyClusters();
      await ogma.clearGraph();
      await ogma.addNodes(clusterNodes);
      console.log("🧩 Loaded clusters (WebGL)");
    };

    const loadIndividualNodes = async () => {
      const ogma = ogmaRef.current;
      if (!ogma) return;

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
      console.log("🔍 Loaded individual nodes");
    };

    const setup = async () => {
      const ogma = ogmaRef.current;
      if (!ogma) return;

      await ogma.geo.enable();

      const map = ogma.geo.getMap();
      if (!map) return;

      map.setView([54.5, -3], 6);

      let currentMode: "cluster" | "individual" = "cluster";

      setTimeout(() => {
        loadClusters();
      }, 100);

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
      ogmaRef.current?.destroy();
    };
  }, []);

  return <div id="geo-map-container" ref={containerRef} />;
};

export default GeoCaseMap;

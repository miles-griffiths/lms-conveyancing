import { useEffect, useRef } from "react";
import * as Leaflet from "leaflet";
import Ogma from "@linkurious/ogma";
import "leaflet/dist/leaflet.css";
import rawData from "../data/remortgage-cases.json";

// Register Leaflet with Ogma for Geo Mode
Ogma.libraries["leaflet"] = Leaflet;

export default function OgmaCasesMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ogma = new Ogma({ container: containerRef.current! });

    console.log("GeoMode:", typeof (ogma as any).setGeoMode);

    if (typeof (ogma as any).setGeoMode === "function") {
      (ogma as any).setGeoMode(true);
    } else {
      console.warn("Geo Mode is not available");
      return;
    }

    const nodes = Object.values(rawData)
      .map((entry: any) => {
        const addr = entry.property?.address;
        const lat = addr?.lat;
        const lng = addr?.lng;

        if (!lat || !lng) return null;

        return {
          id: entry.case?.case_id,
          label: entry.borrowers?.map((b: any) => `${b.forename} ${b.surname}`).join(", "),
          latitude: lat,
          longitude: lng,
          attributes: {
            lender: entry.lender?.name,
            county: addr?.county,
            address: [addr?.propety_number, addr?.address_line_1, addr?.town, addr?.postcode].filter(Boolean).join(", ")
          },
        };
      })
      .filter(Boolean);

    (ogma as any).addNodes(nodes);
    ogma.view.locateGraph({ padding: 50 });

    (ogma.tools.tooltip as any).node.setText((node: any) => {
      const label = node.getLabel();
      const lender = node.getAttribute("lender") || "";
      const address = node.getAttribute("address") || "";
      return `${label}\n${address}\n${lender}`;
    });
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height: "100%", width: "100%" }}
    ></div>
  );
}

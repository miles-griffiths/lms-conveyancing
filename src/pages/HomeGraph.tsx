import React, { useEffect, useRef } from "react";
import Ogma from "@linkurious/ogma";
import Header from "../components/Header";

const HomeGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ogma = new Ogma({ container: containerRef.current });

    // Section-level nodes
    const sections = [
      {
        id: "home",
        label: "Home",
        color: "#4CAF50",
        radius: 40,
        icon: "\uf015", // fa-home
      },
      {
        id: "conveyancing",
        label: "Conveyancing",
        color: "#8e24aa",
        radius: 35,
        icon: "\uf24e", // fa-balance-scale
      },
      {
        id: "quick-links",
        label: "Quick Links",
        color: "#1976d2",
        radius: 35,
        icon: "\uf0c1", // fa-link
      },
    ];

    const conveyancingTiles = [
      { id: "purchase", label: "Purchase", icon: "\uf290" },
      { id: "remortgage", label: "Remortgage", icon: "\uf155" },
      { id: "sale", label: "Sale", icon: "\uf0d6" },
      { id: "lettings", label: "Lettings", icon: "\uf015" },
    ];

    const quickLinkTiles = [
      { id: "dashboard", label: "Main Dashboard", icon: "\uf201" },
      { id: "case7454", label: "Case 7454", icon: "\uf1b2" },
      { id: "case6541a", label: "Case 6541-A", icon: "\uf1b2" },
      { id: "case6541b", label: "Case 6541-B", icon: "\uf1b2" },
    ];

    const nodes = [
      ...sections.map((n) => ({
        id: n.id,
        color: n.color,
        radius: n.radius,
        text: { content: n.label, scale: 1 },
        icon: {
          content: n.icon,
          scale: 2,
          font: "FontAwesome",
          color: "#000",
        },
      })),
      ...conveyancingTiles.map((n) => ({
        id: n.id,
        color: "#ba68c8",
        radius: 28,
        text: { content: n.label, scale: 0.9 },
        icon: {
          content: n.icon,
          font: "FontAwesome",
          scale: 1.5,
          color: "#000",
        },
      })),
      ...quickLinkTiles.map((n) => ({
        id: n.id,
        color: "#64b5f6",
        radius: 28,
        text: { content: n.label, scale: 0.9 },
        icon: {
          content: n.icon,
          font: "FontAwesome",
          scale: 1.5,
          color: "#000",
        },
      })),
    ];

    const edges = [
      { source: "home", target: "conveyancing" },
      { source: "home", target: "quick-links" },
      ...conveyancingTiles.map((n) => ({ source: "conveyancing", target: n.id })),
      ...quickLinkTiles.map((n) => ({ source: "quick-links", target: n.id })),
    ];

    ogma.addGraph({ nodes, edges });

    // Use default hierarchical layout (no params)
    ogma.layouts.hierarchical().then(() => ogma.view.locateGraph());

    return () => ogma.destroy();
  }, []);

  return (
    <div className="home-container">
        <Header />
        <div
        ref={containerRef}
        style={{
            flexGrow: 1,
            height: "calc(100vh - 80px)", // adjust if header height is different
        }}
        />
    </div>
    );
};

export default HomeGraph;

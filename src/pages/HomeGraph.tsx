import React, { useEffect, useRef } from "react";
import Ogma from "@linkurious/ogma";
import Header from "../components/Header";
import menuData from "../data/menu.json";

const HomeGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const conveyancingRevealed = useRef(false);
  const quickLinksRevealed = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create a new instance of Ogma
    const ogma = new Ogma({ container: containerRef.current });

    const topLevelSectionIds = menuData.edges
      .filter(edge => edge.source === "home")
      .map(edge => edge.target);

    const sectionTileMap: Record<string, string[]> = {};
      topLevelSectionIds.forEach(sectionId => {
        const tileIds = menuData.edges
          .filter(edge => edge.source === sectionId)
          .map(edge => edge.target);

        sectionTileMap[sectionId] = tileIds;
      });

    const conveyancingIds = sectionTileMap["conveyancing"];
    const quickLinkIds = sectionTileMap["quick-links"];
    const hiddenNodeIds = [...conveyancingIds, ...quickLinkIds];

    // Function to apply styles once ogma.rules is available
    const applyStyles = () => {
      if (!ogma.rules) {
        requestAnimationFrame(applyStyles);
        return;
      }

      // Add Font-Awesome icons
      ogma.styles.addNodeRule({
        icon: {
          font: 'Font Awesome 5 Free',
          scale: 0.5,
          color: '#000',
          content: ogma.rules.map({
            field: 'type',
            values: {
              Root: '\uf015',                // Home icon
              SectionConveyancing: '\uf0c1', // Link icon
              SectionQuickLinks: '\uf1b2'    // Cube icon
            },
            fallback: '\uf128'               // Info icon for unspecified types
          })
        }
      });

      ogma.styles.addNodeRule({
        radius: ogma.rules.map({
          field: 'type',
          values: {
            Root: 5,
            SectionConveyancing: 4,
            SectionQuickLinks: 4
          },
          fallback: 3
        })
      });

      ogma.styles.addNodeRule({
        color: ogma.rules.map({
          field: 'type',
          values: {
            Root: '#4CAF50',                // Green for Root nodes
            SectionConveyancing: '#1976d2', // Blue for Section nodes
            SectionQuickLinks: '#1976d2'    // Blue for Section nodes
          },
          fallback: '#64b5f6'               // Default color for other types
        })
      });

      ogma.styles.addNodeRule({
        color: ogma.rules.map({
          field: 'id',
          values: {
            purchase: '#8cbae8',
            remortgage: '#8cbae8',
            sale: '#8cbae8',
            lettings: '#8cbae8',
            dashboard: '#8cbae8',
            case7454: '#8cbae8',
            case6541a: '#8cbae8',
            case6541b: '#8cbae8'
          },
          fallback: ogma.rules.map({
            field: 'type',
            values: {
              Root: '#4CAF50',
              SectionConveyancing: '#1976d2',
              SectionQuickLinks: '#1976d2'
            },
            fallback: '#64b5f6'
          })
        })
      });

      ogma.styles.addEdgeRule({
        width: 0.5
      });

      ogma.styles.addNodeRule({
        text: {
          content: node => node.getData('label'),
          font: 'Arial',
          size: 14,
          color: '#000',
          backgroundColor: '#fff',
          position: 'bottom',
          minVisibleSize: 0
        }
      });
    };

    // Start applying styles
    applyStyles();

    // Display the Graph
    const baseNodes = menuData.nodes
      .filter(n => !hiddenNodeIds.includes(n.id))
      .map(n => ({
        id: n.id,
        data: {
          type: n.data.type,
          label: n.data.label
        },
        attributes: {
          radius: n.data.type === 'Root' ? 20 : n.data.type === 'Section' ? 15 : 10
        }
      }));

    const baseEdges = menuData.edges.filter(
      (e) =>
        !hiddenNodeIds.includes(e.source.toString()) &&
        !hiddenNodeIds.includes(e.target.toString())
    );

    // Conveyancing Nodes
    const conveyancingNodes = menuData.nodes
      .filter((n) => conveyancingIds.includes(n.id))
      .map((n) => ({
        id: n.id,
        data: {
          id: n.id,
          type: n.data.type,
          label: n.data.label
        }
      }));

    const conveyancingEdges = menuData.edges.filter(
      (e) =>
        conveyancingIds.includes(e.source.toString()) ||
        conveyancingIds.includes(e.target.toString())
    );

    // Quick Link Nodes
    const quickLinkNodes = menuData.nodes
      .filter((n) => quickLinkIds.includes(n.id))
      .map((n) => ({
        id: n.id,
        data: {
          id: n.id,
          type: n.data.type,
          label: n.data.label
        }
      }));

    const quickLinkEdges = menuData.edges.filter(
      (e) =>
        quickLinkIds.includes(e.source.toString()) ||
        quickLinkIds.includes(e.target.toString())
    );

    ogma.addGraph({ nodes: baseNodes, edges: baseEdges });
    ogma.layouts.force({
      gravity: 0.05,
      charge: 5
    });

    ogma.events.onClick(async ({ target }) => {
      if (!target || !target.isNode) return;
      const nodeId = target.getId();

      if (nodeId === "conveyancing") {
        if (!conveyancingRevealed.current) {
          ogma.addGraph({ nodes: conveyancingNodes, edges: conveyancingEdges });
          conveyancingRevealed.current = true;
        } else {
          ogma.removeNodes(conveyancingIds);
          conveyancingRevealed.current = false;
        }
      }

      if (nodeId === "quick-links") {
        if (!quickLinksRevealed.current) {
          ogma.addGraph({ nodes: quickLinkNodes, edges: quickLinkEdges });
          quickLinksRevealed.current = true;
        } else {
          ogma.removeNodes(quickLinkIds);
          quickLinksRevealed.current = false;
        }
      }

      await ogma.layouts.force({
        gravity: 0.05,
        charge: 5
      });
    });

    return () => ogma.destroy();
  }, []);

  return (
    <div className="home-container">
      <Header pageTitle="GRAPH" />
      <div
        ref={containerRef}
        style={{ flexGrow: 1, height: "calc(100vh - 80px)" }}
      />
    </div>
  );
};

export default HomeGraph;

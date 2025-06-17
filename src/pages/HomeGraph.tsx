import React, { useEffect, useRef } from "react";
import Ogma from "@linkurious/ogma";
import Header from "../components/Header";
import graphData from "../data/data.json";

const HomeGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const conveyancingRevealed = useRef(false);
  const quickLinksRevealed = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create a new instance of Ogma
    const ogma = new Ogma({ container: containerRef.current });

    const conveyancingIds = ["purchase", "remortgage", "sale", "lettings"];
    const quickLinkIds = ["dashboard", "case7454", "case6541a", "case6541b"];
    const hiddenNodeIds = [...conveyancingIds, ...quickLinkIds];
    
    // Add Styling, Rules and Mapping
    document.fonts.ready.then(() => {
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

      // Note: I've had to keep the above original colour mapping, as the first
      //       fackback below does't work!! If the above is removed the Home and
      //       Section nodes display with a grey colour.
      ogma.styles.addNodeRule({
        color: ogma.rules.map({
          field: 'id',
          values: {
            purchase: '#8cbae8',                 // Light Blue 
            remortgage: '#8cbae8',
            sale: '#8cbae8',
            lettings: '#8cbae8',
            dashboard: '#8cbae8',                 // Light Blue 
            case7454: '#8cbae8',
            case6541a: '#8cbae8',
            case6541b: '#8cbae8'
          },
          fallback: ogma.rules.map({
            field: 'type',
            values: {
              Root: '#4CAF50',                   // Green for Home node
              SectionConveyancing: '#1976d2',    // Blue for Section node
              SectionQuickLinks: '#1976d2'
            },
            fallback: '#64b5f6'
          })
        })
      });

      // Add Egde width
      ogma.styles.addEdgeRule({
        width: .5
      });

      // Add Font-Awsome icons
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

      // Add Label display-details
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
    });

    // Display the Graph
    const baseNodes = graphData.nodes
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

    const baseEdges = graphData.edges.filter(
      (e) =>
        !hiddenNodeIds.includes(e.source.toString()) &&
        !hiddenNodeIds.includes(e.target.toString())
    );

    // Conveyancy Nodes
    const conveyancingNodes = graphData.nodes
      .filter((n) => conveyancingIds.includes(n.id))
      .map((n) => ({
        id: n.id,
        data: {
          id: n.id,
          type: n.data.type,
          label: n.data.label
        }
      }));

    const conveyancingEdges = graphData.edges.filter(
      (e) =>
        conveyancingIds.includes(e.source.toString()) ||
        conveyancingIds.includes(e.target.toString())
    );

    // Quick Link Nodes
    const quickLinkNodes = graphData.nodes
      .filter((n) => quickLinkIds.includes(n.id))
      .map((n) => ({
        id: n.id,
        data: {
          id: n.id,
          type: n.data.type,
          label: n.data.label
        }
      }));
      
    const quickLinkEdges = graphData.edges.filter(
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
      <Header />
      <div
        ref={containerRef}
        style={{ flexGrow: 1, height: "calc(100vh - 80px)" }}
      />
    </div>
  );
};

export default HomeGraph;

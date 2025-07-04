import React, { useEffect, useRef } from "react";
import Ogma from "@linkurious/ogma";
import Header from "../components/Header";
import menuData from "../data/menu.json";

const HomeGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const conveyancingRevealed = useRef(false);
  const quickLinksRevealed = useRef(false);
  const advancedNetworkRevealed = useRef(false);
  const dataManagementRevealed = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const ogma = new Ogma({ container: containerRef.current });
        
    console.log("Ogma instance:", ogma);
    console.log("Ogma.Geo:", (Ogma as any).Geo); // Static access, for plugin presence
    console.log("Geo API available:", ogma.geo !== undefined);



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

    const conveyancingIds = sectionTileMap["conveyancing"] || [];
    const quickLinkIds = sectionTileMap["quick-links"] || [];
    const advancedNetworkIds = sectionTileMap["advanced-network-analysis"] || [];
    const dataManagementIds = sectionTileMap["data-management"] || [];

    const hiddenNodeIds = [
      ...conveyancingIds,
      ...quickLinkIds,
      ...advancedNetworkIds,
      ...dataManagementIds
    ];

    const applyStyles = () => {
      if (!ogma.rules) {
        requestAnimationFrame(applyStyles);
        return;
      }

      ogma.styles.addNodeRule({
        icon: {
          font: 'Font Awesome 5 Free',
          scale: 0.5,
          color: '#000',
          content: ogma.rules.map({
            field: 'type',
            values: {
              Root: '\uf015',
              SectionConveyancing: '\uf0c1',
              SectionQuickLinks: '\uf1b2',
              SectionAdvancedNetworkAnalysis: '\uf085',
              SectionIdentityAndFraudDetection: '\uf3c1',
              SectionDataManagement: '\uf1c0'
            },
            fallback: '\uf128'
          })
        }
      });

      ogma.styles.addNodeRule({
        radius: ogma.rules.map({
          field: 'type',
          values: {
            Root: 5,
            SectionConveyancing: 4,
            SectionQuickLinks: 4,
            SectionAdvancedNetworkAnalysis: 4,
            SectionDataManagement: 4
          },
          fallback: 3
        })
      });

      ogma.styles.addNodeRule({
        color: ogma.rules.map({
          field: 'type',
          values: {
            Root: '#4CAF50',
            SectionConveyancing: '#1976d2',
            SectionQuickLinks: '#1976d2',
            SectionAdvancedNetworkAnalysis: '#9c27b0',
            SectionDataManagement: '#ff9800'
          },
          fallback: '#64b5f6'
        })
      });

      ogma.styles.addEdgeRule({ width: 0.5 });

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

    applyStyles();

    const baseNodes = menuData.nodes
      .filter(n => !hiddenNodeIds.includes(n.id))
      .map(n => ({
        id: n.id,
        data: { type: n.data.type, label: n.data.label },
        attributes: {
          radius: n.data.type === 'Root' ? 20 : n.data.type === 'Section' ? 15 : 10
        }
      }));

    const baseEdges = menuData.edges.filter(
      e => !hiddenNodeIds.includes(e.source) && !hiddenNodeIds.includes(e.target)
    );

    const buildNodeData = (ids: string[]) =>
      menuData.nodes
        .filter(n => ids.includes(n.id))
        .map(n => ({ id: n.id, data: { id: n.id, type: n.data.type, label: n.data.label } }));

    const buildEdgeData = (ids: string[]) =>
      menuData.edges.filter(e => ids.includes(e.source) || ids.includes(e.target));

    const conveyancingNodes = buildNodeData(conveyancingIds);
    const conveyancingEdges = buildEdgeData(conveyancingIds);

    const quickLinkNodes = buildNodeData(quickLinkIds);
    const quickLinkEdges = buildEdgeData(quickLinkIds);

    const advancedNetworkNodes = buildNodeData(advancedNetworkIds);
    const advancedNetworkEdges = buildEdgeData(advancedNetworkIds);

    const dataManagementNodes = buildNodeData(dataManagementIds);
    const dataManagementEdges = buildEdgeData(dataManagementIds);

    ogma.addGraph({ nodes: baseNodes, edges: baseEdges });
    ogma.layouts.force({ gravity: 0.05, charge: 5 });

    ogma.events.onClick(async ({ target }) => {
      if (!target || !target.isNode) return;
      const nodeId = target.getId();

      const toggleNodes = async (
        key: string,
        nodeSet: ReturnType<typeof buildNodeData>,
        edgeSet: ReturnType<typeof buildEdgeData>,
        revealedRef: React.MutableRefObject<boolean>
      ) => {
        if (!revealedRef.current) {
          ogma.addGraph({ nodes: nodeSet, edges: edgeSet });
          revealedRef.current = true;
        } else {
          ogma.removeNodes(sectionTileMap[key] || []);
          revealedRef.current = false;
        }
        await ogma.layouts.force({ gravity: 0.05, charge: 5 });
      };

      switch (nodeId) {
        case "conveyancing":
          await toggleNodes("conveyancing", conveyancingNodes, conveyancingEdges, conveyancingRevealed);
          break;
        case "quick-links":
          await toggleNodes("quick-links", quickLinkNodes, quickLinkEdges, quickLinksRevealed);
          break;
        case "advanced-network-analysis":
          await toggleNodes("advanced-network-analysis", advancedNetworkNodes, advancedNetworkEdges, advancedNetworkRevealed);
          break;
        case "data-management":
          await toggleNodes("data-management", dataManagementNodes, dataManagementEdges, dataManagementRevealed);
          break;
      }
    });

    return () => ogma.destroy();
  }, []);

  return (
    <div className="home-container">
      <Header pageTitle="GRAPH" />
      <div ref={containerRef} style={{ flexGrow: 1, height: "calc(100vh - 80px)" }} />
    </div>
  );
};

export default HomeGraph;

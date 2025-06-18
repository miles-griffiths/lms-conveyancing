import React from "react";
import Header from "../components/Header";
import menuData from "../data/menu.json";
import "../styles/homepage.css";

type Node = {
  id: string;
  data: {
    type: string;
    label: string;
    icon?: string; // Optional icon field
  };
};

type Edge = {
  id: string;
  source: string;
  target: string;
};

const HomePage: React.FC = () => {
  const sections: Node[] = menuData.nodes.filter(
    (node) =>
      node.id !== "home" &&
      menuData.edges.some((edge) => edge.source === "home" && edge.target === node.id)
  );

  const getTilesForSection = (sectionId: string): Node[] => {
    const tileIds = menuData.edges
      .filter((edge) => edge.source === sectionId)
      .map((edge) => edge.target);

    return menuData.nodes.filter((node) => tileIds.includes(node.id));
  };

  return (
    <div className="home-container">
      <Header />

      {sections.map((section) => {
        const tiles = getTilesForSection(section.id);

        return (
          <section className="section-block" key={section.id}>
            <div className="section-header">{section.data.label}</div>
            <div className="tile-grid">
              {tiles.map((tile) => (
                <div className="tile" key={tile.id}>
                  {tile.data.icon ? (
                    <i className={`tile-icon ${tile.data.icon}`} aria-hidden="true" />
                  ) : (
                    <div className="tile-icon fallback-icon">
                      {tile.data.label.charAt(0)}
                    </div>
                  )}
                  <p>{tile.data.label}</p>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default HomePage;

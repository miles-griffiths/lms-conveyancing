import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import menuData from "../data/menu.json";
import "../styles/homepage.css";

type Node = {
  id: string;
  data: {
    type: string;
    label: string;
    icon?: string;
    navigateTo?: string;
  };
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();

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
      <Header pageTitle="HOME" />
      {sections.map((section) => {
        const tiles = getTilesForSection(section.id);
        return (
          <section className="section-block" key={section.id}>
            <div className="section-header">{section.data.label}</div>
            <div className="tile-grid">
              {tiles.map((tile) => (
                <div
                  className="tile"
                  key={tile.id}
                  onClick={() => {
                    const destination = tile.data.navigateTo?.trim();
                    if (!destination) return;
                      const localUser = JSON.parse(localStorage.getItem("user") || "{}");

                      navigate(`/${destination.toLowerCase()}`, {
                        state: {
                          title: tile.data.label,
                          name: localUser.name,
                          photo: localUser.photo,
                        },
                      });
                   }}
                    style={{
                     cursor: tile.data.navigateTo ? "pointer" : "default",
                    }}>
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

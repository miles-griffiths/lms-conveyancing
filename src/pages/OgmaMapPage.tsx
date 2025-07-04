import Header from "../components/Header";
// import OgmaCasesMap from "../components/OgmaCasesMap";
import GraphMap from "../components/GraphMap"

export default function OgmaMapPage() {
  return (
    <div className="home-container">
      <Header pageTitle="MAP (Ogma)" />
      
      <div style={{ marginTop: '1.5rem' }}>
        <GraphMap />
      </div>
    </div>
  );
}

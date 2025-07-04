import Header from "../components/Header";
// import OgmaCasesMap from "../components/OgmaCasesMap";
import GeoCaseMap from "../components/GeoCaseMap"

export default function GeoMapPage() {
  return (
    <div className="home-container">
      <Header pageTitle="MAP (Ogma)" />
      
      <div style={{ marginTop: '1.5rem' }}>
        <GeoCaseMap />
      </div>
    </div>
  );
}

import Header from "../components/Header";
import CaseMap from '../components/CaseMap';

export default function MapPage() {
  return (
    <div className="home-container">
        <Header pageTitle="MAP" />
        
        <div style={{ marginTop: '1.5rem' }}>
        <CaseMap />
      </div>
    </div>
  );
}

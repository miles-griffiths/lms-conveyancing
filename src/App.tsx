import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import HomeGraph from "./pages/HomeGraph";
import CasesPage from "./pages/CasesPage";
import MapPage from "./pages/MapPage";
import GeoMapPage from "./pages/GeoMapPage";
import GraphPage from "./pages/GraphPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/graph" element={<HomeGraph />} />
      <Route path="/cases" element={<CasesPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/geomap" element={<GeoMapPage/>} />
      <Route path="/graphpage" element={<GraphPage/>} />
    </Routes>
  );
}

export default App;

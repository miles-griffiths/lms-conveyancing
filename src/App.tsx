import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import HomeGraph from "./pages/HomeGraph";
import CasesPage from "./pages/CasesPage";
import MapPage from "./pages/MapPage";
import OgmaMapPage from "./pages/OgmaMapPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/graph" element={<HomeGraph />} />
      <Route path="/cases" element={<CasesPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/ogmamap" element={<OgmaMapPage/>} />
    </Routes>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import HomeGraph from "./pages/HomeGraph";
import CasesPage from "./pages/CasesPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/graph" element={<HomeGraph />} />
      <Route path="/cases" element={<CasesPage />} />
    </Routes>
  );
}

export default App;

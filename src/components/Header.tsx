import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/lms-logo.svg";

type LocationState = {
  name?: string;
  photo?: string;
};

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState || {};
  const { name, photo } = state;

  const dropdownRef = useRef<HTMLSpanElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (dropdownRef.current) {
      setDropdownWidth(dropdownRef.current.offsetWidth);
    }
  }, [name]);

  const handleLogout = () => {
    navigate("/", { replace: true });
  };

  const togglePage = () => {
    if (location.pathname === "/graph") {
      navigate("/home", { state });
    } else {
      navigate("/graph", { state });
    }
  };

  return (
    <header className="home-header">
      <div className="flex items-center justify-between px-6 py-4 w-full">
        {/* Left: Logo and Title */}
        <div className="flex items-center gap-4">
          <img src={logo} alt="LMS Logo" className="home-logo" />
          <h1 className="home-title">HOME PAGE</h1>
        </div>

        {/* Right: Toggle Icon, Welcome Dropdown, User Photo */}
        {name && photo && (
          <div className="flex items-center gap-6">
  {/* Toggle + Greeting as a unit */}
  <div className="flex items-center gap-2">
    {/* Toggle Icon */}
    <span
      onClick={togglePage}
      title="Toggle Home/Graph"
      style={{
        cursor: "pointer",
        fontSize: "1.2rem",
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      <i className={`fas ${location.pathname === "/graph" ? "fa-house" : "fa-chart-line"}`} />
      &nbsp;&nbsp;&nbsp;&nbsp;
    </span>

    <span
      ref={dropdownRef}
      className="text-sm text-gray-700 cursor-pointer select-none flex items-center"
      onClick={() => setDropdownOpen(!dropdownOpen)}
    >
      Welcome, {name}
      <span className="text-xs ml-1">▾&nbsp;&nbsp;</span>
    </span>

    {/* Dropdown */}
    {dropdownOpen && (
      <div
        className="absolute right-0 top-full mt-2 bg-white border rounded shadow z-10"
        style={{ width: dropdownWidth }}
      >
        <div
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
        >
          Log out
        </div>
      </div>
    )}
  </div>

  {/* Avatar */}
  <img
    src={photo}
    alt={`Headshot of ${name}`}
    className="rounded-full object-cover"
    style={{ height: "32px", width: "32px" }}
  />
</div>


        )}
      </div>
    </header>
  );
};

export default Header;

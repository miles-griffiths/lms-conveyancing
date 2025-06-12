import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/lms-logo.svg";

type LocationState = {
  name?: string;
  photo?: string;
};

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLSpanElement>(null);
  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(undefined);

  const state = location.state as LocationState || {};
  const { name, photo } = state;

  useEffect(() => {
    if (dropdownRef.current) {
      setDropdownWidth(dropdownRef.current.offsetWidth);
    }
  }, [name]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="home-header">
      <div className="flex items-center justify-between px-6 py-4 w-full">
        <div className="flex items-center gap-4">
          <img src={logo} alt="LMS Logo" className="home-logo" />
          <h1 className="home-title">HOME PAGE</h1>
        </div>
        {name && photo && (
          <div className="flex items-center gap-6 relative">
            <span
              ref={dropdownRef}
              className="text-sm text-gray-700 cursor-pointer select-none flex items-center gap-1"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Welcome, {name}&nbsp;<span className="text-xs">▾&nbsp;</span>
            </span>
            {dropdownOpen && (
              <div
                className="absolute right-12 top-full mt-2 bg-white border rounded shadow z-10"
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
            <img
              src={photo}
              alt={`Headshot of ${name}`}
              className="object-cover"
              style={{ height: "32px", width: "32px" }}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

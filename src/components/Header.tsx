import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/lms-logo.svg";

interface HeaderProps {
  pageTitle: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const name = localUser.name;
  const photo = localUser.photo;

  const dropdownRef = useRef<HTMLSpanElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (dropdownRef.current) {
      setDropdownWidth(dropdownRef.current.offsetWidth);
    }
  }, [name]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const togglePage = () => {
    const currentPath = location.pathname;

    if (currentPath === "/graph" || currentPath === "/cases") {
      navigate("/home");
    } else {
      navigate("/graph");
    }
  };

  return (
    <header className="home-header">
      <div className="flex items-center justify-between px-6 py-4 w-full">
        <div className="flex items-center gap-4">
          <img src={logo} alt="LMS Logo" className="home-logo" />
          <h1 className="home-title">{pageTitle}</h1>
        </div>

        {name && photo && (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span
                onClick={togglePage}
                title="Toggle between Home and Graph Page"
                style={{
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <i className={`fas ${location.pathname === "/graph" || location.pathname === "/cases" ? "fa-home" : "fa-chart-line"}`} />
                &nbsp;&nbsp;&nbsp;&nbsp;
              </span>

              <div className="relative">
                <span
                  ref={dropdownRef}
                  className="text-sm text-gray-700 cursor-pointer select-none flex items-center"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Welcome, {name}
                  <span className="text-xs ml-1">▾&nbsp;&nbsp;</span>
                </span>

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
            </div>

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

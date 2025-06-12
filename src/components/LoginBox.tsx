import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import milesPhoto from "../assets/miles.png";
import calumPhoto from "../assets/calum.png";
import lmsLogo from "../assets/lms-logo.svg";

// Define user structure
type User = {
  password: string;
  name: string;
  photo: string;
};

// Valid user list
const validUsers: Record<string, User> = {
  "miles.griffiths@lms.com": {
    password: "Pass@123!",
    name: "Miles",
    photo: milesPhoto,
  },
  "calum.chalmers@lms.com": {
    password: "Pass@123!",
    name: "Calum",
    photo: calumPhoto,
  },
};

const LoginBox: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const usernameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleLogin = () => {
    const normalisedUsername = username.toLowerCase();
    const user = validUsers[normalisedUsername];

    if (user && user.password === password) {
      navigate("/home", {
        state: {
          name: user.name,
          photo: user.photo,
        },
      });
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <img
          src={lmsLogo}
          alt="LMS Logo"
          className="login-logo"
        />

        <input
          ref={usernameRef}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
};

export default LoginBox;

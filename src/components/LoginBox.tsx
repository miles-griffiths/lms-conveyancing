import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import logo from "../assets/lms-logo.svg";

const validUsers: Record<string, string> = {
  "Miles Griffiths": "Pass@123!",
  "Calum Chalmers": "Pass@123!",
};

export default function LoginBox() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validUsers[username] === password) {
      navigate("/home");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-box">
      <img src={logo} alt="LMS Logo" className="login-logo" />
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="error">{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

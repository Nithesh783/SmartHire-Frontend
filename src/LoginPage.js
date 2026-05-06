import { useState } from "react";
import axios from "axios";

function LoginPage({ role, setEmail, setIsLoggedIn, setRole, setAuthMode }) {
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        email: emailInput,
        password,
      });

      const token = res.data.token;

      // Decode JWT payload (simple way)
      const payload = JSON.parse(atob(token.split(".")[1]));

      const userRole = payload.role; // must match backend

      // 🚫 BLOCK WRONG ROLE LOGIN
      if (userRole !== role) {
        setError(`You are registered as ${userRole}, not ${role}`);
        return;
      }

      // ✅ STORE DATA
      localStorage.setItem("token", token);
      localStorage.setItem("email", emailInput);

      setEmail(emailInput);
      setIsLoggedIn(true);

    } catch (err) {
      setError("Invalid email or password");
      console.error(err);
    }
  };

  return (
    <div style={container}>
      <div style={card}>
  <img
    src="/logo.png"
    alt="logo"
    style={{ width: "60px", margin: "0 auto" }}
  />
  <h3>{role} Login</h3>

        <input
          style={input}
          placeholder="Email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />

        <input
          style={input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button style={button} onClick={handleLogin}>
          Login
        </button>

        <button style={secondary} onClick={() => setRole("")}>
          Change Role
        </button>

        <button
          style={secondary}
          onClick={() => {
            setRole("");
            setAuthMode("");
          }}
        >
          Home
        </button>
      </div>
    </div>
  );
}

// styles
const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#eef2f7",
};

const card = {
  background: "#fff",
  padding: "40px",
  borderRadius: "16px",
  width: "400px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
};

const input = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ccc",
};

const button = {
  padding: "12px",
  borderRadius: "10px",
  background: "#4f46e5",
  color: "white",
  border: "none",
};

const secondary = {
  ...button,
  background: "#9ca3af",
};

export default LoginPage;
import { useState } from "react";
import axios from "axios";

function LoginPage({
  role,
  setEmail,
  setIsLoggedIn,
  setRole,
  setAuthMode,
}) {
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!emailInput || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          email: emailInput,
          password,
        }
      );

      if (!res.data.success) {
        setError(res.data.message);
        setLoading(false);
        return;
      }

      const token = res.data.token;
      const userRole = res.data.role;

      // 🚫 Prevent wrong role login
      if (userRole !== role) {
        setError(`You are registered as ${userRole}, not ${role}`);
        setLoading(false);
        return;
      }

      // ✅ Store login data
      localStorage.setItem("token", token);
      localStorage.setItem("email", emailInput);
      localStorage.setItem("role", userRole);

      setEmail(emailInput);
      setIsLoggedIn(true);

    } catch (err) {
      setError("Invalid email or password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={card}>

        <div style={{ textAlign: "center" }}>
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: "70px", marginBottom: "10px" }}
          />

          <h2 style={{ marginBottom: "5px" }}>
            {role} Login
          </h2>

          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            Welcome back to SmartHire AI
          </p>
        </div>

        <input
          style={input}
          type="email"
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

        {error && (
          <p style={{ color: "#dc2626", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <button
          style={button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          style={secondary}
          onClick={() => setAuthMode("REGISTER")}
        >
          New User? Register
        </button>

        <button
          style={secondary}
          onClick={() => setRole("")}
        >
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

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#eef2f7",
};

const card = {
  background: "#ffffff",
  padding: "40px",
  borderRadius: "18px",
  width: "400px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const input = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  outline: "none",
};

const button = {
  padding: "14px",
  borderRadius: "10px",
  background: "#4f46e5",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "15px",
};

const secondary = {
  ...button,
  background: "#9ca3af",
};

export default LoginPage;
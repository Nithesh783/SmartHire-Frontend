import { useState } from "react";
import axios from "axios";

function RegisterPage({ role, setAuthMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    // ✅ validations
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email");
      return;
    }

    if (password.length < 5) {
      setError("Password must be at least 5 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        {
          name,
          email,
          password,
          role,
        }
      );

      if (!res.data.success) {
        setError(res.data.message);
        setLoading(false);
        return;
      }

      setSuccess("Registered successfully! Please login.");

      setTimeout(() => {
        setAuthMode("LOGIN");
      }, 1500);

    } catch (err) {
      setError("Registration failed");
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
            {role} Register
          </h2>

          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            Create your SmartHire AI account
          </p>
        </div>

        <input
          style={input}
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        {success && (
          <p style={{ color: "#16a34a", fontSize: "14px" }}>
            {success}
          </p>
        )}

        <button
          style={button}
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <button
          style={secondary}
          onClick={() => setAuthMode("LOGIN")}
        >
          Already have account? Login
        </button>

        <button
          style={secondary}
          onClick={() => setAuthMode("")}
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

export default RegisterPage;
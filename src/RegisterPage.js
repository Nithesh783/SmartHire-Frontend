import { useState } from "react";
import axios from "axios";

function RegisterPage({ role, setAuthMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    setError("");
    setSuccess("");

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
      const res = await axios.post("http://localhost:8080/auth/register", {
        name,
        email,
        password,
        role,
      });

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      setSuccess("Registered successfully! Please login.");

      setTimeout(() => {
        setAuthMode("LOGIN");
      }, 1500);

    } catch (err) {
      setError("Registration failed");
      console.error(err);
    }
  };

  return (
    <div style={container}>
      <div style={card}>

        <img
          src={process.env.PUBLIC_URL + "/logo.png"}
          alt="logo"
          style={{ width: "60px", margin: "0 auto" }}
        />

        <h3 style={{ textAlign: "center" }}>{role} Register</h3>

        <input
          style={input}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={input}
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

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button style={button} onClick={handleRegister}>
          Register
        </button>

        <button style={secondary} onClick={() => setAuthMode("LOGIN")}>
          Already have account? Login
        </button>

        <button style={secondary} onClick={() => setAuthMode("")}>
          Home
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;

// ✅ styles (valid JS now)

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
  gap: "14px",
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
  cursor: "pointer",
};

const secondary = {
  ...button,
  background: "#9ca3af",
};
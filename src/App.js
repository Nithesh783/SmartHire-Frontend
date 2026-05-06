import { useEffect, useState } from "react";

import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

import CandidateDashboard from "./CandidateDashboard";
import RecruiterDashboard from "./RecruiterDashboard";

function App() {

  const [authMode, setAuthMode] = useState("");
  const [role, setRole] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  const [recruiterPage, setRecruiterPage] = useState("HOME");

  // ✅ restore login after refresh
  useEffect(() => {

    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedEmail = localStorage.getItem("email");

    if (token && savedRole) {
      setIsLoggedIn(true);
      setRole(savedRole);
      setEmail(savedEmail);
    }

  }, []);

  // =========================
  // styles
  // =========================

  const container = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef2f7",
    padding: "20px",
    fontFamily: "Inter, sans-serif",
  };

  const card = {
    width: "420px",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  };

  const button = {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "#4f46e5",
    color: "white",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  };

  const secondaryButton = {
    ...button,
    background: "#9ca3af",
  };

  // =========================
  // HOME PAGE
  // =========================

  if (!authMode && !isLoggedIn) {

    return (
      <div style={container}>
        <div style={card}>

          <div>

            <img
              src="/logo.png"
              alt="logo"
              style={{
                width: "80px",
                marginBottom: "15px",
              }}
            />

            <h1
              style={{
                marginBottom: "10px",
                color: "#111827",
              }}
            >
              SmartHire AI
            </h1>

            <p
              style={{
                color: "#6b7280",
                fontSize: "15px",
              }}
            >
              AI-powered recruitment and resume screening platform
            </p>

          </div>

          <button
            style={button}
            onClick={() => setAuthMode("LOGIN")}
          >
            Login
          </button>

          <button
            style={button}
            onClick={() => setAuthMode("REGISTER")}
          >
            Register
          </button>

        </div>
      </div>
    );
  }

  // =========================
  // ROLE SELECTION
  // =========================

  if (!role && !isLoggedIn) {

    return (
      <div style={container}>
        <div style={card}>

          <div>

            <img
              src="/logo.png"
              alt="logo"
              style={{
                width: "70px",
                marginBottom: "10px",
              }}
            />

            <h2>Select Your Role</h2>

            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              Choose how you want to continue
            </p>

          </div>

          <button
            style={button}
            onClick={() => setRole("CANDIDATE")}
          >
            Candidate
          </button>

          <button
            style={button}
            onClick={() => setRole("RECRUITER")}
          >
            Recruiter
          </button>

          <button
            style={secondaryButton}
            onClick={() => setAuthMode("")}
          >
            Back
          </button>

        </div>
      </div>
    );
  }

  // =========================
  // REGISTER
  // =========================

  if (authMode === "REGISTER" && !isLoggedIn) {

    return (
      <RegisterPage
        role={role}
        setAuthMode={setAuthMode}
      />
    );
  }

  // =========================
  // LOGIN
  // =========================

  if (!isLoggedIn) {

    return (
      <LoginPage
        role={role}
        setEmail={setEmail}
        setIsLoggedIn={setIsLoggedIn}
        setRole={setRole}
        setAuthMode={setAuthMode}
      />
    );
  }

  // =========================
  // CANDIDATE DASHBOARD
  // =========================

  if (role === "CANDIDATE") {

    return (
      <CandidateDashboard
        email={email}
        setIsLoggedIn={setIsLoggedIn}
        setRole={setRole}
      />
    );
  }

  // =========================
  // RECRUITER DASHBOARD
  // =========================

  return (
    <RecruiterDashboard
      setIsLoggedIn={setIsLoggedIn}
      setRole={setRole}
      recruiterPage={recruiterPage}
      setRecruiterPage={setRecruiterPage}
    />
  );
}

export default App;
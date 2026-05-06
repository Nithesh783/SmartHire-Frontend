import { useState } from "react";
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

  const container = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef2f7",
    fontFamily: "Inter, sans-serif",
  };

  const card = {
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    width: "420px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    textAlign: "center",
  };

  const button = {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#4f46e5",
    color: "white",
    cursor: "pointer",
  };

  if (!authMode) {
    return (
      <div style={container}>
       <div style={card}>
  <img
    src="/logo.png"
    alt="logo"
    style={{ width: "70px", margin: "0 auto" }}
  />
  <h2>SmartHire AI</h2>
          <button style={button} onClick={() => setAuthMode("LOGIN")}>Login</button>
          <button style={button} onClick={() => setAuthMode("REGISTER")}>Register</button>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div style={container}>
        <div style={card}>
          <h3>Select Role</h3>
          <button style={button} onClick={() => setRole("CANDIDATE")}>Candidate</button>
          <button style={button} onClick={() => setRole("RECRUITER")}>Recruiter</button>
          <button style={{ ...button, background: "#9ca3af" }} onClick={() => setAuthMode("")}>Back</button>
        </div>
      </div>
    );
  }

  if (authMode === "REGISTER") {
    return <RegisterPage role={role} setAuthMode={setAuthMode} setRole={setRole} />;
  }

  if (!isLoggedIn) {
    return <LoginPage role={role} setEmail={setEmail} setIsLoggedIn={setIsLoggedIn} setRole={setRole} setAuthMode={setAuthMode} />;
  }

  if (role === "CANDIDATE") {
    return <CandidateDashboard email={email} setIsLoggedIn={setIsLoggedIn} setRole={setRole} />;
  }

  return (
    <RecruiterDashboard
      email={email}
      setIsLoggedIn={setIsLoggedIn}
      setRole={setRole}
      recruiterPage={recruiterPage}
      setRecruiterPage={setRecruiterPage}
    />
  );
}

export default App;
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

  useEffect(() => {
    const handleLogout = () => {
      setIsLoggedIn(false);
      setRole("");
      setEmail("");
      setAuthMode("LOGIN");
    };

    window.addEventListener("smarthire:logout", handleLogout);
    return () => window.removeEventListener("smarthire:logout", handleLogout);
  }, []);

  // =========================
  // styles
  // =========================

  // =========================
  // HOME PAGE
  // =========================

  if (!authMode && !isLoggedIn) {

    return (
      <div className="sh-page"><div className="sh-shell sh-home-grid">
        <section><div className="sh-brand"><img src="/logo.png" alt="SmartHire" /> SmartHire AI</div><div className="sh-eyebrow sh-section">Recruitment workspace</div><h1 className="sh-title">Build better teams with less friction.</h1><p className="sh-subtitle">Manage resumes, opportunities, candidate matching, and applications in one focused workspace.</p><div className="sh-actions"><button className="sh-btn primary" onClick={() => setAuthMode("LOGIN")}>Sign in to workspace</button><button className="sh-btn secondary" onClick={() => setAuthMode("REGISTER")}>Create an account</button></div></section>
        <section className="sh-card"><div className="sh-features"><div className="sh-feature"><strong>Resume hub</strong><span>Upload and review extracted candidate skills.</span></div><div className="sh-feature"><strong>Job workspace</strong><span>Create and organize recruiter opportunities.</span></div><div className="sh-feature"><strong>Skill matching</strong><span>Compare candidates with clear deterministic scores.</span></div><div className="sh-feature"><strong>Application tracking</strong><span>Follow candidate application status in one place.</span></div></div></section>
      </div></div>
    );
  }

  // =========================
  // ROLE SELECTION
  // =========================

  if (!role && !isLoggedIn) {

    return (
      <div className="sh-page"><div className="sh-shell narrow sh-card"><div className="sh-brand center"><img src="/logo.png" alt="SmartHire" /> SmartHire AI</div><h2 className="sh-heading">Choose your workspace</h2><p className="sh-subtitle">Select a role to continue.</p><div className="sh-actions"><button className="sh-btn primary" onClick={() => setRole("CANDIDATE")}>I’m a Candidate</button><button className="sh-btn primary" onClick={() => setRole("RECRUITER")}>I’m a Recruiter</button><button className="sh-btn secondary" onClick={() => setAuthMode("")}>Back home</button></div></div></div>
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

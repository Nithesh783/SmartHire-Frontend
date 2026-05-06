import MatchCandidatePage from "./MatchCandidatePage";
import RankCandidatesPage from "./RankCandidatesPage";
import PostJobPage from "./PostJobPage";

function RecruiterDashboard({
  setIsLoggedIn,
  setRole,
  recruiterPage,
  setRecruiterPage,
}) {

  if (recruiterPage === "POST") {
    return (
      <PostJobPage setRecruiterPage={setRecruiterPage} />
    );
  }

  if (recruiterPage === "MATCH") {
    return (
      <MatchCandidatePage setRecruiterPage={setRecruiterPage} />
    );
  }

  if (recruiterPage === "RANK") {
    return (
      <RankCandidatesPage setRecruiterPage={setRecruiterPage} />
    );
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    setIsLoggedIn(false);
    setRole("");
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
            SmartHire AI
          </h2>

          <p style={subtitle}>
            Recruiter Dashboard
          </p>
        </div>

        <div style={buttonContainer}>

          <button
            style={button}
            onClick={() => setRecruiterPage("POST")}
          >
            Post Job
          </button>

          <button
            style={button}
            onClick={() => setRecruiterPage("MATCH")}
          >
            Match Candidate
          </button>

          <button
            style={button}
            onClick={() => setRecruiterPage("RANK")}
          >
            Rank Candidates
          </button>

        </div>

        <button
          style={logoutButton}
          onClick={logout}
        >
          Logout
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
  padding: "20px",
};

const card = {
  width: "420px",
  background: "#ffffff",
  borderRadius: "20px",
  padding: "40px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const subtitle = {
  color: "#6b7280",
  fontSize: "14px",
};

const buttonContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const button = {
  padding: "15px",
  borderRadius: "12px",
  border: "none",
  background: "#4f46e5",
  color: "white",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "0.2s",
};

const logoutButton = {
  ...button,
  background: "#ef4444",
};

export default RecruiterDashboard;
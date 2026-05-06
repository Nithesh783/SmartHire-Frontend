import MatchCandidatePage from "./MatchCandidatePage";
import RankCandidatesPage from "./RankCandidatesPage";
import PostJobPage from "./PostJobPage";

function RecruiterDashboard({ setIsLoggedIn, setRole, recruiterPage, setRecruiterPage }) {

  if (recruiterPage === "POST") return <PostJobPage setRecruiterPage={setRecruiterPage} />;
  if (recruiterPage === "MATCH") return <MatchCandidatePage setRecruiterPage={setRecruiterPage} />;
  if (recruiterPage === "RANK") return <RankCandidatesPage setRecruiterPage={setRecruiterPage} />;

  return (
    <div style={container}>
      <div style={card}>
  <div style={{ textAlign: "center" }}>
    <img src="/logo.png" alt="logo" style={{ width: "60px" }} />
    <h2>SmartHire AI</h2>
    <p style={{ fontSize: "14px", color: "#6b7280" }}>Recruiter Dashboard</p>
  </div>

        <button style={button} onClick={() => setRecruiterPage("POST")}>
          Post Job
        </button>

        <button style={button} onClick={() => setRecruiterPage("MATCH")}>
          Match Candidate
        </button>

        <button style={button} onClick={() => setRecruiterPage("RANK")}>
          Rank Candidates
        </button>

        <button style={logout} onClick={() => {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setRole("");
        }}>
          Logout
        </button>
      </div>
    </div>
  );
}

const container = { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#eef2f7" };
const card = { background: "#fff", padding: "40px", borderRadius: "16px", width: "400px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" };
const button = { padding: "12px", background: "#4f46e5", color: "white", borderRadius: "10px", border: "none" };
const logout = { ...button, background: "#ef4444" };

export default RecruiterDashboard;
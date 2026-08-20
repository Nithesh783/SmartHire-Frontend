import RankCandidatesPage from "./RankCandidatesPage";
import PostJobPage from "./PostJobPage";
import ManageJobsPage from "./ManageJobsPage";

function RecruiterDashboard({ setIsLoggedIn, setRole, recruiterPage, setRecruiterPage }) {
  if (recruiterPage === "POST") return <PostJobPage setRecruiterPage={setRecruiterPage} />;
  if (recruiterPage === "MANAGE") return <ManageJobsPage setRecruiterPage={setRecruiterPage} />;
  if (recruiterPage === "RANK") return <RankCandidatesPage setRecruiterPage={setRecruiterPage} />;

  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("email"); localStorage.removeItem("role"); setIsLoggedIn(false); setRole(""); };
  return <div className="sh-page sh-dashboard"><div className="sh-shell sh-dashboard-card sh-card">
    <div className="sh-topbar"><div><div className="sh-brand"><img src="/logo.png" alt="SmartHire" /> SmartHire AI</div><div className="sh-eyebrow sh-section">Recruiter workspace</div><h1 className="sh-heading">Find the right people, faster.</h1><p className="sh-subtitle">Create opportunities and evaluate candidates from one place.</p></div><button className="sh-btn danger" onClick={logout}>Log out</button></div>
    <div className="sh-grid recruiter-actions"><button className="sh-action" onClick={() => setRecruiterPage("POST")}><div className="sh-icon">＋</div><h3>Post a job</h3><p>Create and publish a new opportunity.</p></button><button className="sh-action" onClick={() => setRecruiterPage("MANAGE")}><div className="sh-icon">▤</div><h3>Manage jobs</h3><p>Review and remove your active opportunities.</p></button><button className="sh-action" onClick={() => setRecruiterPage("RANK")}><div className="sh-icon">★</div><h3>Rank candidates</h3><p>Compare candidates using skill-based scores.</p></button></div>
  </div></div>;
}

export default RecruiterDashboard;

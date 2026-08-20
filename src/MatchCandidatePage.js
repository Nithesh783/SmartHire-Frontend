import { useState } from "react";
import api from "./api";

function MatchCandidatePage({ setRecruiterPage }) {

  const [jobId, setJobId] = useState("");
  const [email, setEmail] = useState("");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {

    setResult("");

    if (!jobId || !email) {
      setResult("Please enter Job ID and Candidate Email");
      return;
    }

    try {

      setLoading(true);

      const res = await api.get(`/recruiter/rank-candidate?jobId=${jobId}&candidateEmail=${email}`);

      setResult(`${res.data.candidateName} — ${res.data.score.toFixed(2)}%\nMatched: ${res.data.matchedSkills.join(", ") || "None"}\nMissing: ${res.data.missingSkills.join(", ") || "None"}`);

    } catch (err) {

      console.error(err);
      setResult("Unable to fetch candidate match");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="sh-page">
      <div className="sh-shell narrow sh-card sh-form">

        <div className="sh-center">

          <img
            src="/logo.png"
            alt="logo"
            className="sh-page-logo"
          />

          <div className="sh-eyebrow">Candidate insights</div><h2 className="sh-heading">Match a candidate</h2>

          <p className="sh-subtitle">Review how a candidate’s skills align with your role.</p>

        </div>

        <div className="sh-field"><label htmlFor="match-job">Job ID</label><input id="match-job"
          placeholder="Job ID"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
        /></div>

        <div className="sh-field"><label htmlFor="match-email">Candidate email</label><input id="match-email"
          placeholder="Candidate Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /></div>

        <button
          className="sh-btn primary"
          onClick={handle}
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Match"}
        </button>

        {result && (
          <div className="sh-alert success">
            {result}
          </div>
        )}

        <button
          className="sh-btn secondary"
          onClick={() => setRecruiterPage("HOME")}
        >
          Back
        </button>

      </div>
    </div>
  );
}
export default MatchCandidatePage;

import { useEffect, useState } from "react";
import api from "./api";

function RankCandidatesPage({ setRecruiterPage }) {
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingRanking, setLoadingRanking] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [openingResume, setOpeningResume] = useState(false);

  useEffect(() => {
    api.get("/recruiter/jobs")
      .then((response) => {
        setJobs(response.data);
        if (response.data.length > 0) setJobId(String(response.data[0].id));
      })
      .catch((error) => setMessage(error.response?.data?.message || "Unable to load your jobs"))
      .finally(() => setLoadingJobs(false));
  }, []);

  const handleRank = async () => {
    if (!jobId) {
      setMessage("Select a job before ranking candidates.");
      setResults([]);
      return;
    }
    setMessage("");
    setResults([]);
    setLoadingRanking(true);
    try {
      const response = await api.get(`/recruiter/rank-all-candidates?jobId=${encodeURIComponent(jobId)}`);
      const ranking = response.data || [];
      setResults(ranking);
      if (ranking.length === 0) setMessage("No candidates are available for ranking yet.");
      else if (ranking.every((candidate) => candidate.score === 0)) {
        setMessage("Candidates found, but no matching skills were detected.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to rank candidates");
    } finally {
      setLoadingRanking(false);
    }
  };

  const viewResume = async (candidate) => {
    setOpeningResume(true);
    try {
      const response = await api.get(`/recruiter/candidate/${encodeURIComponent(candidate.candidateEmail)}/resume?jobId=${encodeURIComponent(jobId)}`, { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      window.open(url, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to open this candidate's resume");
    } finally {
      setOpeningResume(false);
    }
  };

  return (
    <div className="sh-page">
      <div className="sh-shell wide sh-card sh-form">
        <div className="sh-center">
          <img src="/logo.png" alt="logo" className="sh-page-logo" />
          <div className="sh-eyebrow">Candidate insights</div><h2 className="sh-heading">Rank candidates</h2>
          <p className="sh-subtitle">Compare candidates for any job you own. Deleted jobs are permanently removed from this list.</p>
        </div>

        {loadingJobs ? <p>Loading your jobs...</p> : (
          <div className="sh-field"><label htmlFor="rank-job">Select job</label><select id="rank-job" value={jobId} onChange={(event) => setJobId(event.target.value)}>
            {jobs.length === 0 ? <option value="">No jobs available</option> : (
              jobs.map((job) => <option key={job.id} value={job.id}>{job.title} - #{job.id}</option>)
            )}
          </select></div>
        )}

        <button className="sh-btn primary" onClick={handleRank} disabled={loadingJobs || loadingRanking || jobs.length === 0}>
          {loadingRanking ? "Ranking..." : "Rank Candidates"}
        </button>

        {message && <div className={`sh-alert ${message.includes("matching") ? "success" : ""}`}>{message}</div>}

        {results.length > 0 && (
          <div className="sh-results">
            <table className="sh-table">
              <thead><tr><th>Candidate</th><th>Score</th><th>Matched Skills</th><th>Missing Skills</th><th>Actions</th></tr></thead>
              <tbody>
                {results.map((candidate) => (
                  <tr key={candidate.candidateEmail}>
                    <td>{candidate.candidateName}</td>
                    <td>{candidate.score.toFixed(2)}%</td>
                    <td>{candidate.matchedSkills.length ? candidate.matchedSkills.join(", ") : "None"}</td>
                    <td>{candidate.missingSkills.length ? candidate.missingSkills.join(", ") : "None"}</td>
                    <td><div className="sh-table-actions"><button className="sh-btn secondary" onClick={() => setSelectedCandidate(candidate)}>View details</button><button className="sh-btn primary" disabled={openingResume} onClick={() => viewResume(candidate)}>{openingResume ? "Opening..." : "View resume"}</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button className="sh-btn secondary" onClick={() => setRecruiterPage("HOME")}>Back</button>
      </div>
      {selectedCandidate && <div className="sh-modal-backdrop" role="presentation" onClick={() => setSelectedCandidate(null)}><section className="sh-modal sh-card" role="dialog" aria-modal="true" aria-labelledby="candidate-detail-title" onClick={(event) => event.stopPropagation()}><div className="sh-modal-header"><div><div className="sh-eyebrow">Candidate details</div><h2 id="candidate-detail-title" className="sh-section-title">{selectedCandidate.candidateName}</h2></div><button className="sh-icon-btn" aria-label="Close candidate details" onClick={() => setSelectedCandidate(null)}>x</button></div><div className="sh-detail-grid"><div><span>Email</span><strong>{selectedCandidate.candidateEmail}</strong></div><div><span>Match score</span><strong>{selectedCandidate.score.toFixed(2)}%</strong></div></div><div className="sh-detail-copy"><span>Matched skills</span><p>{selectedCandidate.matchedSkills.length ? selectedCandidate.matchedSkills.join(", ") : "None"}</p><span>Missing skills</span><p>{selectedCandidate.missingSkills.length ? selectedCandidate.missingSkills.join(", ") : "None"}</p></div><button className="sh-btn primary" disabled={openingResume} onClick={() => viewResume(selectedCandidate)}>{openingResume ? "Opening resume..." : "View uploaded resume"}</button></section></div>}
    </div>
  );
}

export default RankCandidatesPage;

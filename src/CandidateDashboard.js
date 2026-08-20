import { useEffect, useMemo, useState } from "react";
import api from "./api";

function CandidateDashboard({ setIsLoggedIn, setRole }) {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [activeView, setActiveView] = useState("JOBS");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [workingJobId, setWorkingJobId] = useState(null);
  const [workingApplicationId, setWorkingApplicationId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([api.get("/candidate/jobs"), api.get("/applications/mine")])
      .then(([jobsResponse, applicationsResponse]) => {
        setJobs(jobsResponse.data);
        setApplications(applicationsResponse.data);
      })
      .catch((error) => setMessage(error.response?.data?.message || "Unable to load candidate data"))
      .finally(() => setLoading(false));
  }, []);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return jobs;
    return jobs.filter((job) => `${job.title} ${job.requiredSkills} ${job.description}`.toLowerCase().includes(query));
  }, [jobs, search]);

  const apply = async (jobId) => {
    const file = selectedFiles[jobId];
    if (!file) {
      setMessage("Choose a PDF resume before applying");
      return;
    }
    setWorkingJobId(jobId);
    setMessage("");
    try {
      const form = new FormData();
      form.append("file", file);
      const uploadResponse = await api.post("/candidate/upload-resume", form);
      if (!uploadResponse.data.status) throw new Error(uploadResponse.data.message || "Resume upload failed");
      const applicationResponse = await api.post(`/applications/jobs/${jobId}`);
      setApplications((items) => [...items.filter((item) => item.jobId !== jobId), applicationResponse.data]);
      setSelectedFiles((files) => ({ ...files, [jobId]: null }));
      setMessage("Resume uploaded and application submitted successfully");
      setActiveView("APPLICATIONS");
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Unable to submit application");
    } finally {
      setWorkingJobId(null);
    }
  };

  const withdraw = async (applicationId) => {
    setWorkingApplicationId(applicationId);
    setMessage("");
    try {
      const response = await api.delete(`/candidate/cancel-application/${applicationId}`);
      setApplications((items) => items.map((item) => item.id === applicationId ? response.data : item));
      setMessage("Application withdrawn. You can reapply from Apply jobs.");
    } catch (error) {
      const status = error.response?.status;
      setMessage(error.response?.data?.message || (status === 401
        ? "Your session has expired. Please sign in again."
        : status === 403
          ? "Only candidates can withdraw applications."
          : status ? `Unable to withdraw application (HTTP ${status})` : "Unable to reach the server. Check your connection and try again."));
    } finally {
      setWorkingApplicationId(null);
    }
  };

  const deleteWithdrawn = async (applicationId) => {
    setWorkingApplicationId(applicationId);
    try {
      await api.delete(`/candidate/applications/${applicationId}`);
      setApplications((items) => items.filter((item) => item.id !== applicationId));
      setSelectedApplication(null);
      setMessage("Withdrawn application deleted");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to delete withdrawn application");
    } finally {
      setWorkingApplicationId(null);
    }
  };

  const viewResume = async () => {
    try {
      const response = await api.get("/candidate/resume", { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      window.open(url, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to open your uploaded resume");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole("");
  };

  return (
    <div className="sh-page sh-dashboard">
      <div className="sh-shell sh-dashboard-card sh-card">
        <div className="sh-topbar"><div><div className="sh-brand"><img src="/logo.png" alt="SmartHire" /> SmartHire AI</div><div className="sh-eyebrow sh-section">Candidate workspace</div><h1 className="sh-heading">Find your next opportunity.</h1><p className="sh-subtitle">Search roles, read the details, upload the right resume, and track your applications.</p></div><button className="sh-btn danger" onClick={logout}>Log out</button></div>
        <div className="sh-tabs" role="tablist" aria-label="Candidate sections"><button className={`sh-tab ${activeView === "JOBS" ? "active" : ""}`} onClick={() => setActiveView("JOBS")}>Apply jobs <span>{jobs.length}</span></button><button className={`sh-tab ${activeView === "APPLICATIONS" ? "active" : ""}`} onClick={() => setActiveView("APPLICATIONS")}>My applications <span>{applications.length}</span></button></div>
        {message && <div className={`sh-alert sh-section ${message.toLowerCase().includes("success") || message.toLowerCase().includes("withdrawn") ? "success" : ""}`}>{message}</div>}
        {loading ? <p className="sh-subtitle sh-section">Loading your workspace...</p> : activeView === "JOBS" ? <section className="sh-panel sh-section"><div className="sh-section-header"><div><h2 className="sh-section-title">Apply jobs</h2><p className="sh-subtitle">Search by job title, skills, or description.</p></div><div className="sh-field sh-search-field"><label htmlFor="job-search">Search jobs</label><input id="job-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Java, React, designer..." /></div></div><div className="sh-job-list sh-section">{filteredJobs.length === 0 ? <p className="sh-subtitle">No matching jobs found.</p> : filteredJobs.map((job) => { const application = applications.find((item) => item.jobId === job.id && item.status !== "WITHDRAWN"); const closed = job.status !== "OPEN" || job.active === false; return <article className="sh-feature sh-job-card" key={job.id}><div className="sh-job-heading"><strong>{job.title}</strong><span className="sh-chip">{job.experienceLevel}</span></div><p>{job.description}</p><p className="sh-job-skills"><strong>Skills:</strong> {job.requiredSkills || "Not specified"}</p>{job.applicationDeadline && <p className="sh-subtitle">Apply before: {new Date(job.applicationDeadline).toLocaleString()}</p>}{application ? <div className="sh-application-note">Already applied: {application.status}</div> : closed ? <div className="sh-application-note">Applications closed</div> : <div className="sh-apply-box"><label htmlFor={`resume-${job.id}`}>Resume PDF</label><input id={`resume-${job.id}`} type="file" accept="application/pdf" onChange={(event) => setSelectedFiles((files) => ({ ...files, [job.id]: event.target.files[0] }))} /><button className="sh-btn primary" disabled={workingJobId === job.id} onClick={() => apply(job.id)}>{workingJobId === job.id ? "Uploading and applying..." : "Upload resume and apply"}</button></div>}</article>; })}</div></section> : <section className="sh-panel sh-section"><div className="sh-section-header"><div><h2 className="sh-section-title">My applications</h2><p className="sh-subtitle">Review each role, open your application details, or manage withdrawn applications.</p></div><span className="sh-chip">{applications.length} total</span></div><div className="sh-applications sh-section">{applications.length === 0 ? <p className="sh-subtitle">No applications yet.</p> : applications.map((application) => <article className={`sh-feature sh-application-card ${application.status === "WITHDRAWN" ? "withdrawn" : ""}`} key={application.id}><div className="sh-job-heading"><strong>{application.jobTitle}</strong><span className={`sh-chip ${application.status === "WITHDRAWN" ? "missing" : ""}`}>{application.status}</span></div><span className="sh-subtitle">Applied: {application.appliedAt ? new Date(application.appliedAt).toLocaleString() : "Unknown"}</span><div className="sh-card-actions"><button className="sh-btn secondary" onClick={() => setSelectedApplication(application)}>View application</button>{(application.status === "APPLIED" || application.status === "SHORTLISTED") && <button className="sh-btn danger-outline" disabled={workingApplicationId === application.id} onClick={() => withdraw(application.id)}>{workingApplicationId === application.id ? "Withdrawing..." : "Withdraw"}</button>}{application.status === "WITHDRAWN" && <button className="sh-btn danger-outline" disabled={workingApplicationId === application.id} onClick={() => deleteWithdrawn(application.id)}>{workingApplicationId === application.id ? "Deleting..." : "Delete withdrawn"}</button>}</div></article>)}</div></section>}
      </div>
      {selectedApplication && <div className="sh-modal-backdrop" role="presentation" onClick={() => setSelectedApplication(null)}><section className="sh-modal sh-card" role="dialog" aria-modal="true" aria-labelledby="application-detail-title" onClick={(event) => event.stopPropagation()}><div className="sh-modal-header"><div><div className="sh-eyebrow">Application details</div><h2 id="application-detail-title" className="sh-section-title">{selectedApplication.jobTitle}</h2></div><button className="sh-icon-btn" aria-label="Close application details" onClick={() => setSelectedApplication(null)}>x</button></div><div className="sh-detail-grid"><div><span>Application status</span><strong>{selectedApplication.status}</strong></div><div><span>Applied on</span><strong>{selectedApplication.appliedAt ? new Date(selectedApplication.appliedAt).toLocaleString() : "Unknown"}</strong></div><div><span>Experience</span><strong>{selectedApplication.experienceLevel || "Not specified"}</strong></div><div><span>Deadline</span><strong>{selectedApplication.applicationDeadline ? new Date(selectedApplication.applicationDeadline).toLocaleString() : "Not specified"}</strong></div></div><div className="sh-detail-copy"><span>Role description</span><p>{selectedApplication.jobDescription || "No description provided."}</p><span>Required skills</span><p>{selectedApplication.requiredSkills || "Not specified"}</p></div><div className="sh-modal-actions"><button className="sh-btn primary" onClick={viewResume}>View uploaded resume</button>{selectedApplication.status === "WITHDRAWN" && <button className="sh-btn danger-outline" onClick={() => deleteWithdrawn(selectedApplication.id)}>Delete withdrawn application</button>}</div></section></div>}
    </div>
  );
}

export default CandidateDashboard;
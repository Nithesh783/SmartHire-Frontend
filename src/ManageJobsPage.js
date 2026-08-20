import { useEffect, useState } from "react";
import api from "./api";

const emptyForm = { title: "", description: "", requiredSkills: "", experienceLevel: "", applicationDeadline: "" };

function ManageJobsPage({ setRecruiterPage }) {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [reopenDeadline, setReopenDeadline] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/recruiter/jobs");
      setJobs(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to load your jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadJobs(); }, []);

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const openEditor = (job) => {
    setEditingJob(job);
    setForm({
      title: job.title || "",
      description: job.description || "",
      requiredSkills: job.requiredSkills || "",
      experienceLevel: job.experienceLevel || "",
      applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().slice(0, 16) : "",
    });
    setMessage("");
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    setWorkingId(editingJob.id);
    try {
      await api.put(`/recruiter/jobs/${editingJob.id}`, { ...form, applicationDeadline: form.applicationDeadline || null });
      setMessage("Job details updated successfully");
      setEditingJob(null);
      await loadJobs();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update this job");
    } finally {
      setWorkingId(null);
    }
  };

  const closeJob = async (job) => {
    if (!window.confirm("Close this job? Existing applications will be preserved.")) return;
    setWorkingId(job.id);
    try {
      await api.put(`/recruiter/jobs/${job.id}/close`);
      setMessage("Job closed. You can reopen it with a new deadline.");
      await loadJobs();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to close this job");
    } finally {
      setWorkingId(null);
    }
  };

  const reopenJob = async (job) => {
    if (!reopenDeadline) {
      setMessage("Choose a new future deadline before reopening the job");
      return;
    }
    if (!window.confirm(`Reopen ${job.title} until ${new Date(reopenDeadline).toLocaleString()}?`)) return;
    setWorkingId(job.id);
    try {
      await api.put(`/recruiter/jobs/${job.id}/reopen?deadline=${encodeURIComponent(reopenDeadline)}`);
      setMessage("Job reopened and active again");
      setReopenDeadline("");
      await loadJobs();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to reopen this job");
    } finally {
      setWorkingId(null);
    }
  };

  const deleteJob = async (job) => {
    if (!window.confirm("Delete this job permanently? Its applications and ranking data will also be removed.")) return;
    setWorkingId(job.id);
    try {
      await api.delete(`/recruiter/jobs/${job.id}`);
      setJobs((items) => items.filter((item) => item.id !== job.id));
      setMessage("Job deleted permanently");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to delete this job");
    } finally {
      setWorkingId(null);
    }
  };

  return <div className="sh-page sh-dashboard"><div className="sh-shell wide sh-card">
    <div className="sh-topbar"><div><div className="sh-brand"><img src="/logo.png" alt="SmartHire" /> SmartHire AI</div><div className="sh-eyebrow sh-section">Recruiter workspace</div><h1 className="sh-heading">Manage your jobs</h1><p className="sh-subtitle">Edit details, pause opportunities, reopen them with a new deadline, or remove them permanently.</p></div><button className="sh-btn secondary" onClick={() => setRecruiterPage("HOME")}>Back to dashboard</button></div>
    {message && <div className={`sh-alert ${message.toLowerCase().includes("success") || message.toLowerCase().includes("active") || message.toLowerCase().includes("deleted") ? "success" : ""}`}>{message}</div>}
    {loading ? <p className="sh-subtitle sh-section">Loading your jobs...</p> : jobs.length === 0 ? <section className="sh-empty-state sh-section"><div className="sh-icon">o</div><h2 className="sh-section-title">No jobs posted yet</h2><p className="sh-subtitle">Create your first opportunity to begin receiving applications.</p><button className="sh-btn primary" onClick={() => setRecruiterPage("POST")}>Post a job</button></section> : <div className="sh-manage-grid sh-section">{jobs.map((job) => { const status = job.status || "OPEN"; const active = status === "OPEN" && job.active !== false; return <article className={`sh-panel sh-managed-job status-${status.toLowerCase()}`} key={job.id}><div className="sh-job-meta">Job #{job.id}<span className="sh-status-badge">{active ? "ACTIVE" : status}</span></div><h2 className="sh-section-title">{job.title}</h2><p className="sh-job-description">{job.description}</p><div className="sh-job-details"><div><span>Required skills</span><p>{job.requiredSkills || "Not specified"}</p></div><div><span>Experience</span><p>{job.experienceLevel || "Not specified"}</p></div><div><span>Application deadline</span><p>{job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleString() : "Not specified"}</p></div></div><div className="sh-manage-actions"><button className="sh-btn secondary" onClick={() => openEditor(job)}>Edit details</button>{active ? <button className="sh-btn secondary" disabled={workingId === job.id} onClick={() => closeJob(job)}>Close job</button> : <><div className="sh-field"><label htmlFor={`reopen-${job.id}`}>New deadline</label><input id={`reopen-${job.id}`} type="datetime-local" min={new Date().toISOString().slice(0, 16)} value={reopenDeadline} onChange={(event) => setReopenDeadline(event.target.value)} /></div><button className="sh-btn primary" disabled={workingId === job.id} onClick={() => reopenJob(job)}>{workingId === job.id ? "Reopening..." : "Confirm and reopen"}</button></>}<button className="sh-btn danger-outline" disabled={workingId === job.id} onClick={() => deleteJob(job)}>Delete job</button></div></article>; })}</div>}
  </div>{editingJob && <div className="sh-modal-backdrop" role="presentation" onClick={() => setEditingJob(null)}><form className="sh-modal sh-card sh-form" onSubmit={saveEdit} onClick={(event) => event.stopPropagation()}><div className="sh-modal-header"><div><div className="sh-eyebrow">Edit opportunity</div><h2 className="sh-section-title">Confirm job details</h2></div><button type="button" className="sh-icon-btn" aria-label="Close editor" onClick={() => setEditingJob(null)}>x</button></div><div className="sh-field"><label htmlFor="edit-title">Job title</label><input id="edit-title" name="title" value={form.title} onChange={updateField} required /></div><div className="sh-field"><label htmlFor="edit-description">Description</label><textarea id="edit-description" name="description" value={form.description} onChange={updateField} required /></div><div className="sh-field"><label htmlFor="edit-skills">Required skills</label><input id="edit-skills" name="requiredSkills" value={form.requiredSkills} onChange={updateField} required /></div><div className="sh-field"><label htmlFor="edit-experience">Experience level</label><input id="edit-experience" name="experienceLevel" value={form.experienceLevel} onChange={updateField} required /></div><div className="sh-field"><label htmlFor="edit-deadline">Application deadline</label><input id="edit-deadline" name="applicationDeadline" type="datetime-local" min={new Date().toISOString().slice(0, 16)} value={form.applicationDeadline} onChange={updateField} required /></div><button className="sh-btn primary" disabled={workingId === editingJob.id}>{workingId === editingJob.id ? "Saving..." : "Save confirmed details"}</button></form></div>}</div>;
}

export default ManageJobsPage;
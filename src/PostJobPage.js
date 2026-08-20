import { useState } from "react";
import api from "./api";

function PostJobPage({ setRecruiterPage }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [deadline, setDeadline] = useState("");
  const [confirmedDeadline, setConfirmedDeadline] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {

    setMessage("");

    if (!title || !description || !skills || !experience || !confirmedDeadline) {
      setMessage("Please fill all fields, including the application deadline");
      return;
    }

    try {

      setLoading(true);

      const res = await api.post(
        `/recruiter/post-job`,
        {
          title,
          description,
          requiredSkills: skills,
          experienceLevel: experience,
          applicationDeadline: confirmedDeadline,
        },
        {}
      );

      setMessage(res.data);

      // optional reset
      setTitle("");
      setDescription("");
      setSkills("");
      setExperience("");
      setDeadline("");
      setConfirmedDeadline("");

    } catch (err) {

      console.error(err);
      setMessage(err.response?.data?.message || "Job posting failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="sh-page">
      <div className="sh-shell medium sh-card sh-form">

        <div className="sh-center">

          <img
            src="/logo.png"
            alt="logo"
            className="sh-page-logo"
          />

          <div className="sh-eyebrow">Recruiter workspace</div><h2 className="sh-heading">Create a new opportunity</h2>

          <p className="sh-subtitle">Share the details candidates need to take the next step.</p>

        </div>

        <div className="sh-field"><label htmlFor="job-title">Job title</label><input id="job-title"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        /></div>

        <div className="sh-field"><label htmlFor="job-description">Description</label><textarea id="job-description"
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        /></div>

        <div className="sh-field"><label htmlFor="job-skills">Required skills</label><input id="job-skills"
          placeholder="Required Skills (Java, Spring, SQL)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        /></div>

        <div className="sh-field"><label htmlFor="job-experience">Experience level</label><input id="job-experience"
          placeholder="Experience Level (Fresher / 1+ Years)"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        /></div>

        <div className="sh-field"><label htmlFor="job-deadline">Application deadline</label><input id="job-deadline"
          type="datetime-local"
          min={new Date().toISOString().slice(0, 16)}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        /><button className="sh-btn secondary sh-confirm-date" type="button" disabled={!deadline} onClick={() => { setConfirmedDeadline(deadline); setMessage("Deadline confirmed"); }}>OK</button>{confirmedDeadline && <span className="sh-confirmed-date">Confirmed: {new Date(confirmedDeadline).toLocaleString()}</span>}</div>

        {message && (
          <div className={`sh-alert ${String(message).toLowerCase().includes("success") ? "success" : ""}`}>
            {message}
          </div>
        )}

        <button
          className="sh-btn primary"
          onClick={handlePost}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Job"}
        </button>

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
export default PostJobPage;

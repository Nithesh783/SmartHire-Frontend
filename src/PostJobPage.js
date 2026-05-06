import { useState } from "react";
import axios from "axios";

function PostJobPage({ setRecruiterPage }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {

    setMessage("");

    if (!title || !description || !skills || !experience) {
      setMessage("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/recruiter/post-job?email=${localStorage.getItem("email")}`,
        {
          title,
          description,
          requiredSkills: skills,
          experienceLevel: experience,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage(res.data);

      // optional reset
      setTitle("");
      setDescription("");
      setSkills("");
      setExperience("");

    } catch (err) {

      console.error(err);
      setMessage("Job posting failed");

    } finally {

      setLoading(false);

    }
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
            Post Job
          </h2>

          <p style={subtitle}>
            Create and publish a new job opening
          </p>

        </div>

        <input
          style={input}
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          style={textarea}
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          style={input}
          placeholder="Required Skills (Java, Spring, SQL)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <input
          style={input}
          placeholder="Experience Level (Fresher / 1+ Years)"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />

        {message && (
          <div style={messageBox}>
            {message}
          </div>
        )}

        <button
          style={button}
          onClick={handlePost}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Job"}
        </button>

        <button
          style={secondary}
          onClick={() => setRecruiterPage("HOME")}
        >
          Back
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
  width: "500px",
  background: "#ffffff",
  borderRadius: "20px",
  padding: "40px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const subtitle = {
  color: "#6b7280",
  fontSize: "14px",
};

const input = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  outline: "none",
};

const textarea = {
  ...input,
  minHeight: "120px",
  resize: "none",
};

const button = {
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  background: "#4f46e5",
  color: "white",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
};

const secondary = {
  ...button,
  background: "#9ca3af",
};

const messageBox = {
  padding: "12px",
  borderRadius: "10px",
  background: "#f3f4f6",
  color: "#374151",
  fontSize: "14px",
};

export default PostJobPage;
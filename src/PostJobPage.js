import { useState } from "react";
import axios from "axios";

function PostJobPage({ setRecruiterPage }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [message, setMessage] = useState("");

  const handlePost = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/recruiter/post-job?email=${localStorage.getItem("email")}`,
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
    } catch {
      setMessage("Job posting failed");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h3>Post Job</h3>

        <input style={input} placeholder="Job Title" onChange={(e) => setTitle(e.target.value)} />
        <input style={input} placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
        <input style={input} placeholder="Required Skills" onChange={(e) => setSkills(e.target.value)} />
        <input style={input} placeholder="Experience Level" onChange={(e) => setExperience(e.target.value)} />

        <button style={button} onClick={handlePost}>Post Job</button>

        {message && <div style={box}>{message}</div>}

        <button style={secondary} onClick={() => setRecruiterPage("HOME")}>
          Back
        </button>
      </div>
    </div>
  );
}

const container = { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#eef2f7" };
const card = { background: "#fff", padding: "40px", borderRadius: "16px", width: "450px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" };
const input = { padding: "12px", borderRadius: "10px", border: "1px solid #ccc" };
const button = { padding: "12px", background: "#4f46e5", color: "white", borderRadius: "10px", border: "none" };
const secondary = { ...button, background: "#9ca3af" };
const box = { padding: "10px", background: "#f1f5f9", borderRadius: "10px" };

export default PostJobPage;
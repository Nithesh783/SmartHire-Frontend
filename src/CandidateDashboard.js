import { useState } from "react";
import axios from "axios";

function CandidateDashboard({ email, setIsLoggedIn, setRole }) {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState("");

  const upload = async () => {
    const form = new FormData();
    form.append("file", file);

    const res = await axios.post(
      `http://localhost:8080/candidate/upload-resume?email=${email}`,
      form,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    setSkills(res.data.skills);
  };

  return (
    <div style={container}>
      <div style={card}>
  <div style={{ textAlign: "center" }}>
    <img src="/logo.png" alt="logo" style={{ width: "60px" }} />
    <h2>SmartHire AI</h2>
    <p style={{ fontSize: "14px", color: "#6b7280" }}>Candidate Dashboard</p>
  </div>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        <button style={button} onClick={upload}>Upload Resume</button>

        {skills && <div style={box}>{skills}</div>}

        <button style={logout} onClick={() => {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setRole("");
        }}>Logout</button>
      </div>
    </div>
  );
}

const container = { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#eef2f7" };
const card = { background: "#fff", padding: "40px", borderRadius: "16px", width: "500px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" };
const button = { padding: "12px", background: "#4f46e5", color: "white", borderRadius: "10px", border: "none" };
const logout = { ...button, background: "#ef4444" };
const box = { padding: "10px", background: "#f1f5f9", borderRadius: "10px" };

export default CandidateDashboard;
import { useState } from "react";
import axios from "axios";

function MatchCandidatePage({ setRecruiterPage }) {
  const [jobId, setJobId] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState("");

  const handle = async () => {
    const res = await axios.get(
      `http://localhost:8080/recruiter/rank-candidate?jobId=${jobId}&candidateEmail=${email}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setResult(res.data);
  };

  return (
    <div style={container}>
      <div style={card}>
       <div style={{ textAlign: "center" }}>
  <img src="/logo.png" alt="logo" style={{ width: "50px" }} />
  <h3>Match Candidate</h3>
</div>

        <input style={input} placeholder="Job ID" onChange={(e) => setJobId(e.target.value)} />
        <input style={input} placeholder="Candidate Email" onChange={(e) => setEmail(e.target.value)} />

        <button style={button} onClick={handle}>Check</button>

        {result && <div style={box}>{result}</div>}

        <button style={secondary} onClick={() => setRecruiterPage("HOME")}>Back</button>
      </div>
    </div>
  );
}

const container = { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#eef2f7" };
const card = { background: "#fff", padding: "40px", borderRadius: "16px", width: "400px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" };
const input = { padding: "12px", borderRadius: "10px", border: "1px solid #ccc" };
const button = { padding: "12px", background: "#4f46e5", color: "white", borderRadius: "10px", border: "none" };
const secondary = { ...button, background: "#9ca3af" };
const box = { padding: "10px", background: "#f1f5f9", borderRadius: "10px" };

export default MatchCandidatePage;
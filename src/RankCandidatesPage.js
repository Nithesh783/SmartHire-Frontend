import { useState } from "react";
import axios from "axios";

function RankCandidatesPage({ setRecruiterPage }) {

  const [jobId, setJobId] = useState("");
  const [result, setResult] = useState("");

  const [loading, setLoading] = useState(false);

  const handle = async () => {

    setResult("");

    if (!jobId) {
      setResult("Please enter Job ID");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/recruiter/rank-all-candidates?jobId=${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setResult(res.data);

    } catch (err) {

      console.error(err);
      setResult("Unable to rank candidates");

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
            Rank Candidates
          </h2>

          <p style={subtitle}>
            Rank all candidates based on job skills
          </p>

        </div>

        <input
          style={input}
          placeholder="Job ID"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
        />

        <button
          style={button}
          onClick={handle}
          disabled={loading}
        >
          {loading ? "Ranking..." : "Rank Candidates"}
        </button>

        {result && (
          <div style={resultBox}>
            {result}
          </div>
        )}

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
  width: "450px",
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

const resultBox = {
  padding: "16px",
  borderRadius: "12px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  lineHeight: "1.6",
  color: "#374151",
  whiteSpace: "pre-wrap",
};

export default RankCandidatesPage;
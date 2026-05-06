import { useState } from "react";
import axios from "axios";

function CandidateDashboard({ email, setIsLoggedIn, setRole }) {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const upload = async () => {
    setMessage("");

    if (!file) {
      setMessage("Please select a resume file");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();
      form.append("file", file);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/candidate/upload-resume?email=${email}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSkills(res.data.skills);
      setMessage("Resume uploaded successfully");

    } catch (err) {
      console.error(err);
      setMessage("Resume upload failed");
    } finally {
      setLoading(false);
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
    <div style={container}>
      <div style={card}>

        <div style={{ textAlign: "center" }}>
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: "70px", marginBottom: "10px" }}
          />

          <h2 style={{ marginBottom: "5px" }}>
            SmartHire AI
          </h2>

          <p style={subtitle}>
            Candidate Dashboard
          </p>
        </div>

        <div style={section}>
          <label style={label}>
            Upload Resume
          </label>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={fileInput}
          />
        </div>

        <button
          style={button}
          onClick={upload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </button>

        {message && (
          <div style={messageBox}>
            {message}
          </div>
        )}

        {skills && (
          <div style={skillsBox}>
            <h4 style={{ marginBottom: "10px" }}>
              Extracted Skills
            </h4>

            <p style={{ lineHeight: "1.6" }}>
              {skills}
            </p>
          </div>
        )}

        <button
          style={logoutButton}
          onClick={logout}
        >
          Logout
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

const section = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const label = {
  fontWeight: "600",
  color: "#374151",
};

const fileInput = {
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  background: "#f9fafb",
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

const logoutButton = {
  ...button,
  background: "#ef4444",
};

const messageBox = {
  padding: "12px",
  borderRadius: "10px",
  background: "#f3f4f6",
  color: "#374151",
  fontSize: "14px",
};

const skillsBox = {
  padding: "18px",
  borderRadius: "12px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

export default CandidateDashboard;
import { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [resume, setResume] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [skills, setSkills] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email: email,
        password: password,
      });

      localStorage.setItem("token", response.data.token);

      alert(response.data.message);

      setIsLoggedIn(true);

    } catch (error) {
      alert("Login failed");
      console.error(error);
    }
  };

  const handleResumeUpload = async () => {
    if (!resume) {
      alert("Please select a resume");
      return;
    }

    const formData = new FormData();
    formData.append("file", resume);

    try {
      const response = await axios.post(
        `http://localhost:8080/candidate/upload-resume?email=${email}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadMessage(
        response.data.message + " | File: " + response.data.fileName
      );

      setSkills(response.data.skills);

    } catch (error) {
      alert("Resume upload failed");
      console.error(error);
    }
  };

  if (isLoggedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>Welcome Candidate</h1>
        <h2>Login Successful</h2>
        <p>Your SmartHire dashboard is ready.</p>

        <div style={{ marginTop: "30px" }}>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResume(e.target.files[0])}
          />

          <br /><br />

          <button onClick={handleResumeUpload} style={{ padding: "10px 20px" }}>
            Upload Resume
          </button>

          <p style={{ marginTop: "20px" }}>{uploadMessage}</p>

          {skills && (
            <div style={{ marginTop: "20px" }}>
              <h3>Extracted Skills:</h3>
              <p>{skills}</p>
            </div>
          )}
        </div>

        <br />

        <button
          onClick={() => {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
          }}
          style={{ padding: "10px 20px", marginTop: "20px" }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>SmartHire AI</h1>
      <h2>Candidate Login</h2>

      <div style={{ marginTop: "30px" }}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "10px", width: "250px", marginBottom: "15px" }}
        />

        <br />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "10px", width: "250px", marginBottom: "20px" }}
        />

        <br />

        <button onClick={handleLogin} style={{ padding: "10px 20px" }}>
          Login
        </button>
      </div>
    </div>
  );
}

export default App;
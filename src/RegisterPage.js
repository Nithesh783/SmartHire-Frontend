import { useState } from "react";
import api from "./api";

function RegisterPage({ role, setAuthMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    // ✅ validations
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email");
      return;
    }

    if (password.length < 5) {
      setError("Password must be at least 5 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        `/auth/register`,
        {
          name,
          email,
          password,
          role,
        }
      );

      if (!res.data.success) {
        setError(res.data.message);
        setLoading(false);
        return;
      }

      setSuccess("Registered successfully! Please login.");

      setTimeout(() => {
        setAuthMode("LOGIN");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sh-page">
      <div className="sh-shell narrow sh-card sh-form">

        <div className="sh-center">
          <div className="sh-brand center"><img
            src="/logo.png"
            alt="logo"
            className="sh-page-logo"
          /> SmartHire AI</div>

          <h2 className="sh-heading">Create your account</h2>

          <p className="sh-subtitle">Join as a {role.toLowerCase()}.</p>
        </div>

        <div className="sh-field"><label htmlFor="register-name">Full name</label><input id="register-name"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /></div>

        <div className="sh-field"><label htmlFor="register-email">Email address</label><input id="register-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /></div>

        <div className="sh-field"><label htmlFor="register-password">Password</label><input id="register-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /></div>

        {error && (
          <p className="sh-alert">
            {error}
          </p>
        )}

        {success && (
          <p className="sh-alert success">
            {success}
          </p>
        )}

        <button
          className="sh-btn primary"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <button
          className="sh-btn secondary"
          onClick={() => setAuthMode("LOGIN")}
        >
          Already have account? Login
        </button>

        <button
          className="sh-btn secondary"
          onClick={() => setAuthMode("")}
        >
          Home
        </button>

      </div>
    </div>
  );
}
export default RegisterPage;

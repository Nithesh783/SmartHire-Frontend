import { useState } from "react";
import api from "./api";

function LoginPage({
  role,
  setEmail,
  setIsLoggedIn,
  setRole,
  setAuthMode,
}) {
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!emailInput || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        `/auth/login`,
        {
          email: emailInput,
          password,
        }
      );

      if (!res.data.success) {
        setError(res.data.message);
        setLoading(false);
        return;
      }

      const token = res.data.token;
      const userRole = res.data.role;

      // 🚫 Prevent wrong role login
      if (userRole !== role) {
        setError(`You are registered as ${userRole}, not ${role}`);
        setLoading(false);
        return;
      }

      // ✅ Store login data
      localStorage.setItem("token", token);
      localStorage.setItem("email", emailInput);
      localStorage.setItem("role", userRole);

      setEmail(emailInput);
      setIsLoggedIn(true);

    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
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

          <h2 className="sh-heading">Welcome back</h2>

          <p className="sh-subtitle">Sign in as a {role.toLowerCase()} to continue.</p>
        </div>

        <div className="sh-field"><label htmlFor="login-email">Email address</label><input id="login-email"
          type="email"
          placeholder="Email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        /></div>

        <div className="sh-field"><label htmlFor="login-password">Password</label><input id="login-password"
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

        <button
          className="sh-btn primary"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          className="sh-btn secondary"
          onClick={() => setAuthMode("REGISTER")}
        >
          New User? Register
        </button>

        <button
          className="sh-btn secondary"
          onClick={() => setRole("")}
        >
          Change Role
        </button>

        <button
          className="sh-btn secondary"
          onClick={() => {
            setRole("");
            setAuthMode("");
          }}
        >
          Home
        </button>

      </div>
    </div>
  );
}
export default LoginPage;

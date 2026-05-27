import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Redirect if already logged in

  const signupUser = async (e) => {
    e.preventDefault();
    setError("");

    // Basic client-side validation
    if (!username || !password) {
      setError("Username and Password are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    console.log("Signup request payload:", {
      username: username.trim(),
      email: email.trim(),
      password,
    });
    try {
      const res = await API.post("register/", {
        username: username.trim(),
        email: email.trim(),
        password: password,
      });
      console.log("Signup response:", res);
      // Save tokens and user info
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("username", res.data.username);
      // Navigate to dashboard after successful signup
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      // Axios errors may have response data
      const message = err.response?.data?.message || err.message || "Signup failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 40%), #0b0f19",
        padding: "20px",
      }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "45px 35px",
          textAlign: "center",
        }}
      >
        {/* Logo/Brand */}
        <div style={{ marginBottom: "25px" }}>
          <span
            style={{
              background: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "32px",
              fontWeight: 800,
              fontFamily: "var(--font-heading)",
              letterSpacing: "-1px",
            }}
          >

          </span>
          <span
            style={{
              color: "#2563EB",
              fontSize: "32px",
              fontWeight: 800,
              fontFamily: "var(--font-heading)",
            }}
          >
            SkillNest
          </span>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "5px" }}>
            Create your account to start preparing
          </p>
        </div>

        <h2
          style={{
            fontSize: "24px",
            marginBottom: "20px",
            fontWeight: 700,
            fontFamily: "var(--font-heading)",
            textAlign: "left",
            color: "var(--text-primary)",
          }}
        >
          Sign Up
        </h2>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid var(--danger)",
              color: "#fca5a5",
              padding: "12px",
              borderRadius: "10px",
              fontSize: "14px",
              marginBottom: "20px",
              textAlign: "left",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={signupUser} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ textAlign: "left" }}>
            <label
              style={{
                display: "block",
                color: "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Username
            </label>
            <input
              type="text"
              placeholder="e.g. johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="premium-input"
              required
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <label
              style={{
                display: "block",
                color: "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Email Address (Optional)
            </label>
            <input
              type="email"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="premium-input"
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <label
              style={{
                display: "block",
                color: "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="premium-input"
              required
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <label
              style={{
                display: "block",
                color: "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="premium-input"
              required
            />
          </div>

          <button
            type="submit"
            className="premium-btn premium-btn-accent"
            disabled={loading}
            style={{ width: "100%", marginTop: "15px", height: "50px" }}
          >
            {loading ? "Registering..." : "Get Started Now"}
          </button>

          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "10px" }}>
            Already have an account?{" "}
            <Link
              to="/"
              style={{
                color: "var(--primary)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
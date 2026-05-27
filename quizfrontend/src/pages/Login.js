import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);
  const loginUser = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("login/", {
        username: username.trim(),
        password: password,
      });

      const token = res.data.access || res.data.token;

      if (!token) {
        throw new Error("Token not returned from backend");
      }

      // Store token under both keys for compatibility
      localStorage.setItem("token", token);
      localStorage.setItem("access", token);
      // Store username for dashboard display
      localStorage.setItem("username", res.data.username);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Invalid username or password. Please try again."
      );
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
        {/* Brand/Platform Logo */}
        <div style={{ marginBottom: "30px" }}>
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
            SkillNest
          </span>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "5px" }}>
            The Ultimate Interview Preparation Platform
          </p>
        </div>

        <h2
          style={{
            fontSize: "24px",
            marginBottom: "25px",
            fontWeight: 700,
            fontFamily: "var(--font-heading)",
            textAlign: "left",
            color: "var(--text-primary)",
          }}
        >
          Sign In
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

        <form onSubmit={loginUser} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ textAlign: "left" }}>
            <label
              style={{
                display: "block",
                color: "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "8px",
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
                marginBottom: "8px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="premium-input"
              required
            />
          </div>

          <button
            type="submit"
            className="premium-btn premium-btn-primary"
            disabled={loading}
            style={{ width: "100%", marginTop: "10px", height: "50px" }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "15px" }}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: "var(--primary)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
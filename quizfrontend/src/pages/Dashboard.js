import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [stats, setStats] = useState({
    total_attempts: 0,
    average_accuracy: 0,
    highest_score: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("username");
    setUsername(user || "Student");

    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch categories
      const catRes = await API.get("categories/");
      setCategories(catRes.data);

      // 2. Fetch quizzes (filtered by category if selected)
      const quizUrl = selectedCategory
        ? `quizzes/?category=${selectedCategory}`
        : "quizzes/";
      const quizRes = await API.get(quizUrl);
      setQuizzes(quizRes.data);

      // 3. Fetch user attempts history
      const attemptsRes = await API.get("attempts/");
      setAttempts(attemptsRes.data);

      // 4. Fetch user performance statistics
      const statsRes = await API.get("user-stats/");
      setStats(statsRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };
  const getAccuracyColor = (acc) => {
    if (acc >= 75) return "var(--success)";
    if (acc >= 50) return "var(--accent)";
    return "var(--danger)";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.05) 0%, transparent 50%), #070a13",
        color: "var(--text-primary)",
      }}
    >
      {/* 1. Header/Navbar */}
      <header
        style={{
          borderBottom: "1px solid var(--glass-border)",
          padding: "16px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(7, 10, 19, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, var(--secondary) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "26px",
              fontWeight: 900,
              fontFamily: "var(--font-heading)",
              letterSpacing: "-0.8px",
            }}
          >

          </span>
          <span
            style={{
              fontSize: "26px",
              fontWeight: 900,
              fontFamily: "var(--font-heading)",
              color: "white",
              letterSpacing: "-0.8px",
            }}
          >
            SkillNest
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: 800,
                fontSize: "14px",
                color: "white",
                boxShadow: "0 4px 15px rgba(79, 70, 229, 0.4)",
              }}
            >
              {username?.[0]?.toUpperCase() || ''}
            </div>
            <span style={{ fontWeight: 600, fontSize: "14px", display: "inline-block" }}>
              {username}
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: "8px 14px",
              fontSize: "13px",
              fontWeight: 700,
              borderRadius: "10px",
              background: "rgba(244, 63, 94, 0.1)",
              color: "#fda4af",
              border: "1px solid rgba(244, 63, 94, 0.2)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(244, 63, 94, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(244, 63, 94, 0.1)";
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* 2. Main Content Container */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px 20px" }}>

        {/* User stats overview */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div className="glass-card animate-fade-in" style={{ padding: "20px 25px", display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ fontSize: "30px", background: "rgba(79, 70, 229, 0.08)", padding: "12px", borderRadius: "16px", color: "var(--primary)", border: "1px solid rgba(79, 70, 229, 0.15)" }}>📝</div>
            <div>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Attempts Completed</p>
              <h3 style={{ fontSize: "28px", fontWeight: 800, marginTop: "2px" }}>{stats.total_attempts}</h3>
            </div>
          </div>

          <div className="glass-card animate-fade-in" style={{ padding: "20px 25px", display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ fontSize: "30px", background: "rgba(16, 185, 129, 0.08)", padding: "12px", borderRadius: "16px", color: "var(--success)", border: "1px solid rgba(16, 185, 129, 0.15)" }}>🎯</div>
            <div>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Average Accuracy</p>
              <h3 style={{ fontSize: "28px", fontWeight: 800, marginTop: "2px", color: getAccuracyColor(stats.average_accuracy) }}>
                {stats.average_accuracy}%
              </h3>
            </div>
          </div>

          <div className="glass-card animate-fade-in" style={{ padding: "20px 25px", display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ fontSize: "30px", background: "rgba(255, 107, 0, 0.08)", padding: "12px", borderRadius: "16px", color: "var(--accent)", border: "1px solid rgba(255, 107, 0, 0.15)" }}>🏆</div>
            <div>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Highest Score Record</p>
              <h3 style={{ fontSize: "28px", fontWeight: 800, marginTop: "2px" }}>{stats.highest_score} Correct</h3>
            </div>
          </div>
        </section>

        {/* 3. Filtering Tabs */}
        <section style={{ marginBottom: "35px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "18px", fontFamily: "var(--font-heading)" }}>
            Select Topic Category
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <button
              onClick={() => setSelectedCategory(null)}
              className="premium-btn"
              style={{
                padding: "8px 18px",
                fontSize: "13px",
                fontWeight: 700,
                borderRadius: "30px",
                background: selectedCategory === null ? "var(--primary)" : "rgba(23, 30, 48, 0.5)",
                color: "white",
                border: selectedCategory === null ? "none" : "1.5px solid var(--glass-border)",
                boxShadow: selectedCategory === null ? "0 4px 15px var(--primary-glow)" : "none",
              }}
            >
              All Categories
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="premium-btn"
                style={{
                  padding: "8px 18px",
                  fontSize: "13px",
                  fontWeight: 700,
                  borderRadius: "30px",
                  background: selectedCategory === cat.id ? "var(--primary)" : "rgba(23, 30, 48, 0.5)",
                  color: "white",
                  border: selectedCategory === cat.id ? "none" : "1.5px solid var(--glass-border)",
                  boxShadow: selectedCategory === cat.id ? "0 4px 15px var(--primary-glow)" : "none",
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* 4. Quizzes Grid */}
        <section style={{ marginBottom: "50px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px", fontFamily: "var(--font-heading)" }}>
            Available Practice Modules
          </h2>

          {loading ? (
            /* Premium Shimmer Loading Skeleton */
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: "20px",
              }}
            >
              {[1, 2, 3].map((n) => (
                <div key={n} className="glass-card shimmer" style={{ height: "230px", borderRadius: "24px" }} />
              ))}
            </div>
          ) : quizzes.length === 0 ? (
            <div className="glass-card" style={{ padding: "40px", textAlign: "center" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
                No practice modules are configured in this category yet.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: "20px",
              }}
            >
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="glass-card glass-card-hover animate-fade-in"
                  style={{
                    padding: "24px 28px",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <span className="badge-category">{quiz.category_name}</span>
                    <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 700 }}>
                      ⏱️ {quiz.time_limit / 60} Min
                    </span>
                  </div>

                  <h3 style={{ fontSize: "19px", color: "white", marginBottom: "10px", fontWeight: 700, fontFamily: "var(--font-heading)" }}>
                    {quiz.title}
                  </h3>

                  <p style={{ color: "var(--text-secondary)", fontSize: "14px", minHeight: "55px", marginBottom: "20px", lineHeight: "1.5" }}>
                    {quiz.description}
                  </p>

                  <div
                    style={{
                      borderTop: "1px solid var(--glass-border)",
                      paddingTop: "18px",
                      marginTop: "auto",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>
                      Questions: <strong style={{ color: "white" }}>{quiz.questions_count}</strong>
                    </span>

                    <button
                      onClick={() => navigate(`/quiz/${quiz.id}`)}
                      className="premium-btn premium-btn-primary"
                      style={{ padding: "10px 18px", fontSize: "13px", borderRadius: "12px" }}
                    >
                      Start Prep
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. User Attempts History Logs */}
        <section>
          <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px", fontFamily: "var(--font-heading)" }}>
            Your Preparation Performance Logs
          </h2>

          <div className="glass-card animate-fade-in" style={{ padding: "15px 20px", overflowX: "auto" }}>
            {attempts.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "20px 0", fontSize: "14px" }}>
                You haven't attempted any quizzes yet. Start preparing by choosing a module above!
              </p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "650px" }}>
                <thead>
                  <tr style={{ borderBottom: "1.5px solid var(--glass-border)" }}>
                    <th style={{ textAlign: "left", padding: "12px 15px", color: "var(--text-secondary)", fontSize: "13px", fontWeight: 700, textTransform: "uppercase" }}>Module Name</th>
                    <th style={{ textAlign: "left", padding: "12px 15px", color: "var(--text-secondary)", fontSize: "13px", fontWeight: 700, textTransform: "uppercase" }}>Category</th>
                    <th style={{ textAlign: "left", padding: "12px 15px", color: "var(--text-secondary)", fontSize: "13px", fontWeight: 700, textTransform: "uppercase" }}>Score</th>
                    <th style={{ textAlign: "left", padding: "12px 15px", color: "var(--text-secondary)", fontSize: "13px", fontWeight: 700, textTransform: "uppercase" }}>Accuracy</th>
                    <th style={{ textAlign: "left", padding: "12px 15px", color: "var(--text-secondary)", fontSize: "13px", fontWeight: 700, textTransform: "uppercase" }}>Attempted On</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => {
                    const accuracy = Math.round((attempt.score / attempt.total_questions) * 100);
                    return (
                      <tr
                        key={attempt.id}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.03)",
                        }}
                      >
                        <td style={{ padding: "15px", fontWeight: 700, color: "white" }}>{attempt.quiz_title}</td>
                        <td style={{ padding: "15px" }}>
                          <span className="badge-category" style={{ padding: "4px 10px", fontSize: "11px" }}>{attempt.category_name}</span>
                        </td>
                        <td style={{ padding: "15px", fontWeight: 700 }}>
                          {attempt.score} / {attempt.total_questions}
                        </td>
                        <td style={{ padding: "15px" }}>
                          <span
                            style={{
                              padding: "4px 10px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: 800,
                              background: accuracy >= 75 ? "rgba(16, 185, 129, 0.1)" : accuracy >= 50 ? "rgba(255, 107, 0, 0.1)" : "rgba(244, 63, 94, 0.1)",
                              color: accuracy >= 75 ? "var(--success)" : accuracy >= 50 ? "var(--accent)" : "var(--danger)",
                            }}
                          >
                            {accuracy}%
                          </span>
                        </td>
                        <td style={{ padding: "15px", color: "var(--text-secondary)", fontSize: "13px" }}>
                          {new Date(attempt.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;
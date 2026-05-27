import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quizInfo, setQuizInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // Stores { question_id: option_id }
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const timerRef = useRef(null);
  useEffect(() => {
    if (!id) return;

    fetchQuizAndQuestions();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0 && quizInfo && !loading) {
      handleAutoSubmit();
      return;
    }

    if (quizInfo && !loading) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, quizInfo, loading]);

  const fetchQuizAndQuestions = async () => {
    setLoading(true);

    try {
      const quizRes = await API.get(`quizzes/${id}/`);
      const currentQuiz = quizRes.data;

      if (!currentQuiz) {
        setError("Quiz not found.");
        return;
      }

      setQuizInfo(currentQuiz);
      setTimeLeft(currentQuiz.time_limit);

      const questionsRes = await API.get(`quizzes/${id}/questions/`);
      setQuestions(questionsRes.data);

      setCurrentIdx(0);

    } catch (err) {
      console.error("Error fetching quiz questions:", err);
      setError("Failed to load questions. Please check authorization.");
    } finally {
      setLoading(false);
    }
  };
  const handleSelectOption = (questionId, optionId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleAutoSubmit = () => {
    submitQuizAnswers();
  };

  const submitQuizAnswers = async () => {
    if (submitting) return;

    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const res = await API.post(`quizzes/${id}/submit/`, {
        answers: userAnswers,
      });

      sessionStorage.setItem("quiz_result", JSON.stringify(res.data));
      sessionStorage.setItem("quiz_title", quizInfo.title);

      navigate("/result");
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Failed to submit quiz. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#070a13",
          color: "white",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid rgba(255,255,255,0.1)",
            borderTop: "4px solid var(--primary)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ marginTop: "20px", color: "var(--text-secondary)", fontSize: "14px", fontWeight: 600 }}>
          Assembling preparation portal...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#070a13",
          color: "white",
          padding: "20px",
        }}
      >
        <div className="glass-card animate-fade-in" style={{ padding: "35px", maxWidth: "440px", width: "100%", textAlign: "center" }}>
          <h2 style={{ fontSize: "22px", fontFamily: "var(--font-heading)" }}>⚠️ Assessment Offline</h2>
          <p style={{ color: "var(--text-secondary)", margin: "16px 0", fontSize: "14px" }}>
            {error || "No questions configured for this learning model."}
          </p>
          <button onClick={() => navigate("/dashboard")} className="premium-btn premium-btn-primary" style={{ width: "100%" }}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;
  const isSelected = (optId) => userAnswers[currentQuestion.id] === optId;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${rs.toString().padStart(2, "0")}`;
  };

  const isTimerCritical = timeLeft <= 30;
  const isTimerUrgent = timeLeft <= 10;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 10% 20%, rgba(79, 70, 229, 0.04) 0%, transparent 40%), #070a13",
        color: "var(--text-primary)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 1. Header with Title and Timer */}
      <header
        style={{
          borderBottom: "1px solid var(--glass-border)",
          padding: "16px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(7, 10, 19, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
            {quizInfo.title}
          </h2>
          <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            Practice Mode • Real-time Evaluation
          </p>
        </div>

        {/* Live Timer Widget */}
        <div
          className={isTimerUrgent ? "animate-pulse-critical" : ""}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: isTimerUrgent
              ? "rgba(244, 63, 94, 0.15)"
              : isTimerCritical
                ? "rgba(255, 107, 0, 0.12)"
                : "rgba(79, 70, 229, 0.08)",
            border: `1.5px solid ${isTimerUrgent
              ? "var(--danger)"
              : isTimerCritical
                ? "var(--accent)"
                : "var(--glass-border)"
              }`,
            padding: "8px 16px",
            borderRadius: "12px",
            transition: "all 0.3s ease",
          }}
        >
          <span style={{ fontSize: "14px" }}>⏱️</span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "16px",
              fontWeight: 800,
              color: isTimerUrgent
                ? "var(--danger)"
                : isTimerCritical
                  ? "var(--accent)"
                  : "white",
            }}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      </header>

      {/* 2. Main Practice Panel */}
      <div
        className="quiz-container"
        style={{
          flex: 1,
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          padding: "24px 20px",
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: "24px",
        }}
      >

        {/* Left Side: MCQ Card & Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Question Card */}
          <div className="glass-card animate-fade-in" style={{ padding: "30px 35px", flex: 1 }}>
            <span
              style={{
                color: "var(--primary)",
                fontSize: "13px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Question {currentIdx + 1} of {totalQuestions}
            </span>

            <h3
              style={{
                fontSize: "19px",
                fontWeight: 700,
                marginTop: "12px",
                marginBottom: "25px",
                color: "white",
                lineHeight: "1.5",
              }}
            >
              {currentQuestion.text}
            </h3>

            {/* Options List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {currentQuestion.options.map((option, opIdx) => {
                const letter = String.fromCharCode(65 + opIdx); // A, B, C, D
                const selected = isSelected(option.id);

                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                    style={{
                      padding: "14px 18px",
                      borderRadius: "14px",
                      background: selected ? "rgba(79, 70, 229, 0.12)" : "rgba(23, 30, 48, 0.3)",
                      border: `1.5px solid ${selected ? "var(--primary)" : "var(--glass-border)"}`,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: selected ? "0 0 15px rgba(79, 70, 229, 0.15)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = "var(--glass-border-hover)";
                        e.currentTarget.style.background = "rgba(23, 30, 48, 0.5)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = "var(--glass-border)";
                        e.currentTarget.style.background = "rgba(23, 30, 48, 0.3)";
                      }
                    }}
                  >
                    {/* Option letter bubble */}
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        background: selected ? "var(--primary)" : "rgba(255, 255, 255, 0.03)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "13px",
                        fontWeight: 800,
                        color: "white",
                        border: `1.5px solid ${selected ? "var(--primary)" : "var(--glass-border)"}`,
                      }}
                    >
                      {letter}
                    </div>

                    <span style={{ fontSize: "14px", color: selected ? "white" : "var(--text-primary)" }}>
                      {option.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "15px" }}>
            <button
              onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
              disabled={currentIdx === 0}
              className="premium-btn"
              style={{
                background: "rgba(23, 30, 48, 0.4)",
                color: currentIdx === 0 ? "var(--text-muted)" : "white",
                border: "1.5px solid var(--glass-border)",
                cursor: currentIdx === 0 ? "not-allowed" : "pointer",
                padding: "12px 24px",
                fontSize: "14px",
                flex: 1,
              }}
            >
              Previous
            </button>

            {currentIdx + 1 === totalQuestions ? (
              <button
                onClick={submitQuizAnswers}
                disabled={submitting}
                className="premium-btn premium-btn-accent"
                style={{ padding: "12px 30px", fontSize: "14px", fontWeight: 800, flex: 1.5 }}
              >
                {submitting ? "Submitting..." : "Finish & Submit"}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIdx((p) => p + 1)}
                className="premium-btn premium-btn-primary"
                style={{ padding: "12px 30px", fontSize: "14px", flex: 1.5 }}
              >
                Next Question
              </button>
            )}
          </div>

        </div>

        {/* Right Side: Navigation Panel / Number Grid */}
        <div className="glass-card animate-fade-in" style={{ padding: "20px", height: "fit-content" }}>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 800,
              marginBottom: "12px",
              fontFamily: "var(--font-heading)",
              borderBottom: "1.5px solid var(--glass-border)",
              paddingBottom: "8px",
            }}
          >
            Questions Tracker
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            {questions.map((q, idx) => {
              const attempted = userAnswers[q.id] !== undefined;
              const active = idx === currentIdx;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  style={{
                    height: "36px",
                    borderRadius: "8px",
                    border: active ? "2px solid var(--primary)" : "1.5px solid var(--glass-border)",
                    background: attempted
                      ? "rgba(79, 70, 229, 0.35)"
                      : active
                        ? "rgba(23, 30, 48, 0.8)"
                        : "rgba(255,255,255,0.01)",
                    color: "white",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontSize: "13px",
                    boxShadow: active ? "0 0 10px rgba(79, 70, 229, 0.3)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: "rgba(79, 70, 229, 0.35)", border: "1px solid var(--glass-border)" }} />
              <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Attempted</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: "rgba(255,255,255,0.01)", border: "1px solid var(--glass-border)" }} />
              <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Unattempted</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "3px", border: "2.5px solid var(--primary)", background: "transparent" }} />
              <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Active Item</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Quiz;
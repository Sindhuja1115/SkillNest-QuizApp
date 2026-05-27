import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Result() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [quizTitle, setQuizTitle] = useState("");

  useEffect(() => {
    const savedResult = sessionStorage.getItem("quiz_result");
    const savedTitle = sessionStorage.getItem("quiz_title");

    if (!savedResult) {
      navigate("/dashboard");
      return;
    }

    setResult(JSON.parse(savedResult));
    setQuizTitle(savedTitle || "Practice Assessment");
  }, [navigate]);

  if (!result) return null;

  const { score, total_questions, percentage, breakdown } = result;

  const getPerformanceMessage = (pct) => {
    if (pct >= 85) return { text: "Outstanding Work! 🏆", sub: "You've mastered this topic. You're ready to ace your interview!", color: "var(--success)" };
    if (pct >= 70) return { text: "Great Job! 🚀", sub: "Very strong performance. Review the incorrect answers to reach perfection.", color: "var(--primary)" };
    if (pct >= 50) return { text: "Good Effort! 👍", sub: "You have a solid foundation but need to revise some concepts.", color: "var(--accent)" };
    return { text: "Keep Practicing! 📝", sub: "Don't worry, failure is the first step to success. Review the explanations below and try again.", color: "var(--danger)" };
  };

  const perf = getPerformanceMessage(percentage);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.05) 0%, transparent 60%), #070a13",
        color: "var(--text-primary)",
        padding: "30px 20px",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* 1. Header Score Summary Banner */}
        <section
          className="glass-card animate-fade-in"
          style={{
            padding: "35px 25px",
            textAlign: "center",
            marginBottom: "30px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle glowing highlight */}
          <div
            style={{
              position: "absolute",
              top: "-50px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "250px",
              height: "100px",
              background: `radial-gradient(ellipse, ${perf.color}33 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <h1 style={{ fontSize: "24px", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
            Assessment Summary
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "4px" }}>
            Practice Module: <strong style={{ color: "white" }}>{quizTitle}</strong>
          </p>

          {/* Large Circular Gauge */}
          <div style={{ margin: "25px 0" }}>
            <div
              style={{
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                background: `conic-gradient(${perf.color} ${percentage * 3.6}deg, rgba(255,255,255,0.04) 0deg)`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto",
                boxShadow: `0 0 25px ${perf.color}15`,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "124px",
                  height: "124px",
                  borderRadius: "50%",
                  background: "#0c111e",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "34px", fontWeight: 900, color: "white", fontFamily: "var(--font-heading)", letterSpacing: "-1px" }}>
                  {Math.round(percentage)}%
                </span>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "1px" }}>
                  Accuracy
                </span>
              </div>
            </div>
          </div>

          <h2 style={{ fontSize: "22px", color: perf.color, fontWeight: 800, fontFamily: "var(--font-heading)" }}>
            {perf.text}
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "480px", margin: "8px auto 25px auto", fontSize: "14px", lineHeight: "1.5" }}>
            {perf.sub}
          </p>

          {/* Metrics summary cards */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "15px",
              flexWrap: "wrap",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.01)",
                border: "1.5px solid var(--glass-border)",
                borderRadius: "14px",
                padding: "12px 24px",
                textAlign: "center",
                flex: 1,
                minWidth: "140px",
              }}
            >
              <p style={{ color: "var(--text-secondary)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Correct answers</p>
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "white", marginTop: "4px" }}>
                {score} / {total_questions}
              </h3>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.01)",
                border: "1.5px solid var(--glass-border)",
                borderRadius: "14px",
                padding: "12px 24px",
                textAlign: "center",
                flex: 1,
                minWidth: "140px",
              }}
            >
              <p style={{ color: "var(--text-secondary)", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Incorrect items</p>
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "white", marginTop: "4px" }}>
                {total_questions - score} items
              </h3>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="premium-btn premium-btn-primary"
            style={{ padding: "12px 30px", fontSize: "14px", width: "100%", maxWidth: "340px" }}
          >
            Back to Practice Dashboard
          </button>
        </section>

        {/* 2. Detailed analytical breakdown */}
        <section>
          <h2
            style={{
              fontSize: "19px",
              fontWeight: 800,
              marginBottom: "20px",
              fontFamily: "var(--font-heading)",
              textAlign: "left",
            }}
          >
            Practice Module Detailed Review
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {breakdown.map((item, idx) => {
              const answered = item.selected_option_id !== null;
              
              return (
                <div
                  key={item.question_id}
                  className="glass-card animate-fade-in"
                  style={{
                    padding: "24px 28px",
                    textAlign: "left",
                    borderLeft: `6px solid ${
                      !answered
                        ? "var(--text-muted)"
                        : item.is_correct
                        ? "var(--success)"
                        : "var(--danger)"
                    }`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 800 }}>
                      QUESTION {idx + 1}
                    </span>

                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 800,
                        background: !answered
                          ? "rgba(255,255,255,0.05)"
                          : item.is_correct
                          ? "rgba(16, 185, 129, 0.1)"
                          : "rgba(244, 63, 94, 0.1)",
                        color: !answered
                          ? "var(--text-secondary)"
                          : item.is_correct
                          ? "var(--success)"
                          : "var(--danger)",
                      }}
                    >
                      {!answered ? "⚠️ Skipped" : item.is_correct ? "✅ Correct" : "❌ Incorrect"}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "16px", color: "white", marginBottom: "20px", fontWeight: 700, lineHeight: "1.5" }}>
                    {item.question_text}
                  </h3>

                  {/* Options display with color feedback */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {item.options.map((option, opIdx) => {
                      const letter = String.fromCharCode(65 + opIdx);
                      const isUserSelected = item.selected_option_id === option.id;
                      const isCorrectAnswer = option.id === item.correct_option_id;

                      let opBackground = "rgba(23, 30, 48, 0.2)";
                      let opBorder = "1.5px solid var(--glass-border)";
                      let opText = "var(--text-primary)";

                      if (isCorrectAnswer) {
                        opBackground = "rgba(16, 185, 129, 0.08)";
                        opBorder = "1.5px solid var(--success)";
                        opText = "white";
                      } else if (isUserSelected && !item.is_correct) {
                        opBackground = "rgba(244, 63, 94, 0.08)";
                        opBorder = "1.5px solid var(--danger)";
                        opText = "white";
                      }

                      return (
                        <div
                          key={option.id}
                          style={{
                            padding: "12px 16px",
                            borderRadius: "12px",
                            background: opBackground,
                            border: opBorder,
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "6px",
                              background: isCorrectAnswer
                                ? "var(--success)"
                                : isUserSelected
                                ? "var(--danger)"
                                : "rgba(255, 255, 255, 0.03)",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontSize: "11px",
                              fontWeight: 800,
                              color: "white",
                            }}
                          >
                            {letter}
                          </div>

                          <span style={{ fontSize: "14px", color: opText, flex: 1 }}>{option.text}</span>

                          {isCorrectAnswer && (
                            <span style={{ color: "var(--success)", fontWeight: 800, fontSize: "12px" }}>
                              ✓ Correct Option
                            </span>
                          )}
                          {isUserSelected && !item.is_correct && (
                            <span style={{ color: "var(--danger)", fontWeight: 800, fontSize: "12px" }}>
                              ✗ Your Choice
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Explanation */}
                  <div style={{ marginTop: '12px', padding: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <strong>Explanation:</strong> {item.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}

export default Result;

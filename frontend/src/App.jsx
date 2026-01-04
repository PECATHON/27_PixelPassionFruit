import React, { useState, useEffect } from "react";
import axios from "axios";

// ✅ UPDATED TO YOUR RAILWAY BACKEND
const API_BASE = "https://pixelpassionfruit.onrender.com";

/* ----------------------------------------------
   MAIN APP
---------------------------------------------- */
function App() {
  const [screen, setScreen] = useState("home");
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [playerName, setPlayerName] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);

  const openNameModal = () => setShowNameModal(true);

  const startQuiz = async () => {
    try {
      setLoading(true);
      setScreen("quiz");

      const res = await axios.get(`${API_BASE}/api/quiz?limit=10`);
      setQuestions(res.data || []);
    } catch (err) {
      alert("Cannot load questions. Is backend running?");
      setScreen("home");
    } finally {
      setLoading(false);
    }
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();

    if (!playerName.trim()) {
      alert("Enter name before starting!");
      return;
    }

    setShowNameModal(false);
    await startQuiz();
  };

  const handleQuizComplete = async (summary) => {
    setResult(summary);
    setScreen("result");

    try {
      await axios.post(`${API_BASE}/api/score/add`, {
        username: playerName,
        score: summary.score,
        total: summary.total,
        timeTaken: summary.timeTaken
      });
    } catch (err) {
      console.log("Error saving score:", err.message);
    }
  };

  const goHome = () => {
    setQuestions([]);
    setResult(null);
    setScreen("home");
  };

  return (
    <div className="app-root">
      <Navbar onHome={goHome} onLeaderboard={() => setScreen("leaderboard")} />

      <main className="app-main">
        {screen === "home" && <HomeScreen onStartClick={openNameModal} />}

        {screen === "quiz" && (
          <QuizScreen
            questions={questions}
            loading={loading}
            onComplete={handleQuizComplete}
            onBack={goHome}
          />
        )}

        {screen === "result" && result && (
          <ResultScreen
            result={result}
            onRetry={openNameModal}
            onHome={goHome}
            onLeaderboard={() => setScreen("leaderboard")}
          />
        )}

        {screen === "review" && result && (
          <ReviewScreen
            details={result.details}
            onHome={goHome}
            onLeaderboard={() => setScreen("leaderboard")}
          />
        )}

        {screen === "leaderboard" && (
          <LeaderboardScreen onBack={goHome} />
        )}
      </main>

      {showNameModal && (
        <NameModal
          playerName={playerName}
          setPlayerName={setPlayerName}
          onSubmit={handleNameSubmit}
          onClose={() => setShowNameModal(false)}
        />
      )}
    </div>
  );
}

/* ----------------------------------------------
   NAVBAR
---------------------------------------------- */
function Navbar({ onHome, onLeaderboard }) {
  return (
    <header className="navbar">
      <div className="navbar-left" onClick={onHome}>
        <span className="navbar-logo">🕌</span>
        <div>
          <h1 className="navbar-title">Arabian Nights Quiz</h1>
          <p className="navbar-subtitle">Legends, lamps & 1001 questions</p>
        </div>
      </div>

      <div className="navbar-right">
        <button className="btn ghost" onClick={onLeaderboard}>
          Leaderboard
        </button>
      </div>
    </header>
  );
}

/* ----------------------------------------------
   HOME SCREEN
---------------------------------------------- */
function HomeScreen({ onStartClick }) {
  return (
    <section className="screen fade-in">
      <div className="hero-card">
        <h2 className="hero-title">Step into the tales of 1001 nights</h2>
        <p className="hero-text">
          Explore mysteries of Aladdin, Ali Baba, Sinbad and ancient Arabian lore.
        </p>

        <div className="hero-meta">
          <span>🎴 Randomized questions</span>
          <span>⏳ Timer challenge</span>
          <span>🏆 Leaderboard</span>
        </div>

        <button className="btn primary hero-btn" onClick={onStartClick}>
          Begin the Night&apos;s Trial
        </button>
      </div>
    </section>
  );
}

/* ----------------------------------------------
   NAME MODAL
---------------------------------------------- */
function NameModal({ playerName, setPlayerName, onSubmit, onClose }) {
  return (
    <div className="name-modal-backdrop">
      <div className="name-modal">
        <h3>Before we begin…</h3>
        <p>Enter a name for the leaderboard:</p>

        <form onSubmit={onSubmit}>
          <input
            className="name-modal-input"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="e.g. Desert Wanderer"
          />

          <div className="name-modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Start Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ----------------------------------------------
   QUIZ SCREEN
---------------------------------------------- */
function QuizScreen({ questions, loading, onComplete, onBack }) {
  const [current, setCurrent] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [score, setScore] = useState(0);

  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);

  const [details, setDetails] = useState([]);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (selectedIndex !== null) return;
    if (timeLeft === 0) {
      handleOptionClick(-1);
      return;
    }

    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, selectedIndex]);

  if (loading) {
    return (
      <section className="screen center">
        <div className="loader-orb" />
        <p>Summoning the djinn…</p>
      </section>
    );
  }

  if (questions.length === 0)
    return (
      <section className="screen center">
        <p>No questions found.</p>
        <button className="btn ghost" onClick={onBack}>Back</button>
      </section>
    );

  const q = questions[current];

  const handleOptionClick = (idx) => {
    if (selectedIndex !== null) return;

    setSelectedIndex(idx);
    let correct = idx === q.correctIndex;

    setFeedback(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);

    setDetails((d) => [
      ...d,
      {
        question: q.question,
        chosenIndex: idx,
        correctIndex: q.correctIndex,
        options: q.options,
        explanation: q.explanation,
        theme: q.theme,
      },
    ]);

    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent((c) => c + 1);
        setSelectedIndex(null);
        setFeedback(null);
        setTimeLeft(15);
      } else {
        const timeTaken = Math.round((Date.now() - startTime) / 1000);

        onComplete({
          score,
          total: questions.length,
          timeTaken,
          details: [...details, {
            question: q.question,
            chosenIndex: idx,
            correctIndex: q.correctIndex,
            options: q.options,
            explanation: q.explanation,
            theme: q.theme,
          }],
        });
      }
    }, 900);
  };

  return (
    <section className="screen fade-in">
      <div className="quiz-header">
        <button className="btn ghost small" onClick={onBack}>⬅ Leave</button>

        <div className="timer">⏳ {timeLeft}s</div>

        <div className="quiz-score-pill">Score: {score}</div>
      </div>

      <div className="quiz-card">
        <h2 className="quiz-question">{q.question}</h2>

        <p className="quiz-meta">
          <span className="pill pill-theme">{q.theme}</span>
        </p>

        <div className="quiz-options">
          {q.options.map((opt, idx) => {
            let cls = "quiz-option";

            if (selectedIndex !== null) {
              if (idx === q.correctIndex) cls += " correct";
              else if (idx === selectedIndex) cls += " wrong";
            }

            return (
              <button
                key={idx}
                className={cls}
                onClick={() => handleOptionClick(idx)}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {feedback === "correct" && (
          <p className="correct-msg">Correct! 🎉</p>
        )}
        {feedback === "wrong" && (
          <p className="wrong-msg">Wrong ❌</p>
        )}
      </div>
    </section>
  );
}

/* ----------------------------------------------
   RESULT SCREEN
---------------------------------------------- */
function ResultScreen({ result, onRetry, onHome, onLeaderboard }) {
  const { score, total, timeTaken } = result;

  const percent = Math.round((score / total) * 100);

  let badge = "Apprentice Nomad";
  if (percent === 100) badge = "Master of Lamps";
  else if (percent >= 80) badge = "Golden Djinn";
  else if (percent >= 50) badge = "Desert Explorer";

  return (
    <section className="screen fade-in">
      <div className="result-card">
        <h2>You scored {score}/{total}</h2>
        <p>{percent}% correct</p>
        <p>Time taken: {timeTaken}s</p>

        <p className="badge-pill">{badge}</p>

        <div className="result-actions">
          <button className="btn primary" onClick={onRetry}>Play Again</button>
          <button className="btn ghost" onClick={onLeaderboard}>Leaderboard</button>
          <button className="btn ghost" onClick={onHome}>Home</button>
        </div>

        <button
          className="btn small"
          onClick={() => onLeaderboard("review")}
        >
          Review Answers
        </button>
      </div>
    </section>
  );
}

/* ----------------------------------------------
   REVIEW SCREEN
---------------------------------------------- */
function ReviewScreen({ details, onHome, onLeaderboard }) {
  return (
    <section className="screen fade-in">
      <h2>Review Answers</h2>

      {details.map((item, idx) => (
        <div className="review-card" key={idx}>
          <h3>{item.question}</h3>

          <p>
            Your Answer:{" "}
            {item.chosenIndex === item.correctIndex
              ? "âœ… Correct"
              : "âŒ Wrong"}
          </p>

          <p>Correct Answer: {item.options[item.correctIndex]}</p>

          {item.explanation && (
            <p className="explanation">{item.explanation}</p>
          )}
        </div>
      ))}

      <button className="btn ghost" onClick={onHome}>Back Home</button>
      <button className="btn ghost" onClick={onLeaderboard}>Leaderboard</button>
    </section>
  );
}

/* ----------------------------------------------
   LEADERBOARD SCREEN
---------------------------------------------- */
function LeaderboardScreen({ onBack }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/score/top`);
      setRows(res.data || []);
    } catch (err) {
      alert("Could not load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="screen fade-in">
      <div className="leaderboard-card">
        <div className="leaderboard-header">
          <h2>Hall of Legends</h2>
          <button className="btn ghost small" onClick={onBack}>⬅ Back</button>
        </div>

        {loading && <p>Loading...</p>}

        {!loading && rows.length === 0 && <p>No scores yet.</p>}

        {!loading && rows.length > 0 && (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Score</th>
                <th>Time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{row.username}</td>
                  <td>{row.score}/{row.total}</td>
                  <td>{row.timeTaken}s</td>
                  <td>{new Date(row.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button className="btn ghost small" onClick={load}>
          Refresh
        </button>
      </div>
    </section>
  );
}

export default App;

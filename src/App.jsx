
import React, { useState } from "react";
import questions from "./data/questions";

const TOTAL_QUESTIONS = 10;
const POINTS_PER_CORRECT = 10;

const App = () => {
  const quiz = questions.slice(0, TOTAL_QUESTIONS);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem("quiz_scores");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      <p>{e.message}</p>
      return [];
    }
  });

  const current = quiz[index];

  function chooseOption(i) {
    if (selected !== null) return;
    setSelected(i);
    if (i === current.answerIndex) {
      setScore((s) => s + POINTS_PER_CORRECT);
    }
  }

  function next() {
    setSelected(null);
    if (index + 1 >= quiz.length) {
      setCompleted(true);
      // record score to history/localStorage
      const entry = {
        score,
        correct: score / POINTS_PER_CORRECT,
        total: quiz.length,
        date: new Date().toISOString(),
      };
      const nextHist = [entry, ...history].slice(0,50);
      setHistory(nextHist);
      try {
        localStorage.setItem("quiz_scores", JSON.stringify(nextHist));
      } catch (e) {
        <p>{e.message}</p>
      }
      return;
    }
    setIndex((n) => n + 1);
    // console.log(index + 1);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setCompleted(false);
  }

  function resetAnalytics() {
    setHistory([]);
    try {
      localStorage.removeItem("quiz_scores");
    } catch (e) {
      // ignore storage access issues
    }
  }

  // analytics
  const gamesPlayed = history.length;
  const averageScore = gamesPlayed
    ? Math.round(history.reduce((s, e) => s + e.score, 0) / gamesPlayed)
    : 0;
  const bestScore = gamesPlayed ? Math.max(...history.map((h) => h.score)) : 0;
  const lastScore = gamesPlayed ? history[0].score : null;

  return (
    <div className="min-h-screen bg-[#5c715e] flex items-center justify-center p-6">
      <div className="w-full max-w-200 bg-[#b6cdbd] backdrop-blur rounded-xl shadow-xl p-6 text-black">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-extrabold">Quiz Game</h1>
          <div className="text-right">
            <div className="text-sm opacity-80">Question</div>
            <div className="font-bold text-xl">
              {index + 1}/{quiz.length}
            </div>
          </div>
        </header>
        <div className="flex gap-6">
          <div className="flex-1">
            {!completed ? (
              <section className="flex flex-col gap-32" >
            <div className="mb-6">
              <div className="text-xl font-semibold mb-2">
                {current.question}
              </div>
              <div className="flex gap-3 flex-wrap">
                {current.options.map((opt, i) => {
                  const base =
                    "px-4 py-2 rounded-lg border w-full sm:w-auto text-left";
                  let cls = "bg-white/80 border-white/15";
                  if (selected !== null) {
                    if (i === current.answerIndex)
                      cls = "bg-green-700 border-green-700";
                    else if (i === selected)
                      cls = "bg-red-700 border-red-700 line-through";
                    else cls = "bg-white/80 border-white/80";
                  }
                  return (
                    <button
                      key={i}
                      className={`${base} ${cls}`}
                      onClick={() => chooseOption(i)}
                      disabled={selected !== null}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-80">Score</div>
                <div className="font-bold text-2xl">{score}</div>
              </div>
              <div>
                {selected === null ? (
                  <div className="text-sm opacity-80">Select an answer</div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <div
                      className={`px-3 py-1 rounded-full ${selected === current.answerIndex ? "bg-green-700" : "bg-red-700"}`}
                    >
                      {selected === current.answerIndex
                        ? "Correct"
                        : "Incorrect"}
                    </div>
                    <button
                      onClick={next}
                      className="ml-2 bg-black/100 text-white px-4 py-2 rounded-lg hover:bg-white/20"
                    >
                      {index + 1 >= quiz.length ? "Finish" : "Next"}
                    </button>
                  </div>
                )}
              </div>
            </div>
              </section>
            ) : (
            <section className="text-center py-12 ">
            <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-lg">Your final score is: {score} </p>
            <p className="mb-6">
              You answered {score / POINTS_PER_CORRECT} correct out of{" "}
              {quiz.length}.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={restart}
                className="bg-white/80 px-6 py-3 rounded-lg hover:bg-white/20"
              >
                Play Again
              </button>
            </div>
              </section>
            )}
          </div>
          <aside className="w-64 bg-white/60 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Analytics</h3>
            <div className="text-5 mb-3">  
              <div>Games: {gamesPlayed}</div>
              <div>Average: {averageScore}</div>
              <div>Best: {bestScore}</div>
              {lastScore !== null && <div>Last: {lastScore}</div>}
            </div>
            <button
              onClick={resetAnalytics}
              className="w-full mb-3 bg-black text-white px-3 py-2 rounded-lg hover:bg-black/80 text-sm font-medium"
            >
              Reset Analytics
            </button>
            <h4 className="font-semibold mb-2 text-5">Previous Scores</h4>
            <div className="max-h-64 overflow-auto text-5">
              {history.length === 0 ? (
                <div className="opacity-70">No previous Games</div>
              ) : (
                history.map((h, i) => (
                  <div key={i} className="mb-2 p-2 bg-white/80 rounded">
                    <div className="flex justify-between">
                      <div className="font-medium">{h.score}</div>
                      <div className="opacity-70">{h.correct}/{h.total}</div>
                    </div>
                    <div className="text-xs opacity-60">
                      {new Date(h.date).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
        <footer className="mt-6 text-lg opacity-80 text-center">
          <p>Answer all questions to complete the quiz.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;

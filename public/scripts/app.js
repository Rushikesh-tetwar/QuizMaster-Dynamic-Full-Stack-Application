const firstPgBtn = document.querySelector(".first_pg_btn");
const loginBody = document.querySelector(".login_body");
const firstPg = document.querySelector(".first_pg");
const thirdPgBody = document.querySelector(".third_pg_body");
const quizContainer = document.querySelector(".quiz-container");
const loginForm = document.getElementById("login-form");
const startBtn = document.querySelector(".start-btn");
const questionContainer = document.getElementById("question-container");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const scoreContainer = document.getElementById("score-container");
const finalScoreBtn = document.querySelector(".final_score_btn");
const finalHistoryBtn = document.querySelector(".final_score_btn_history");
const timerEl = document.getElementById("timer");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let user = {};
let selectedAnswer = null;
let timerInterval;

// Utility
function toggle(el, show = true) {
  el.classList[show ? "remove" : "add"]("hidden");
}

// Navigation
firstPgBtn.addEventListener("click", () => {
  toggle(firstPg, false);
  toggle(loginBody, true);
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  user.name = document.getElementById("name").value.trim();
  toggle(loginBody, false);
  toggle(thirdPgBody, true);
});

startBtn.addEventListener("click", () => {
  toggle(thirdPgBody, false);
  toggle(quizContainer, true);
  fetchQuestions();
});

// Quiz Logic
async function fetchQuestions() {
  try {
    const res = await fetch("/api/questions");
    const data = await res.json();
    questions = data.questions;
    startGame();
  } catch (err) {
    console.error("Error loading questions:", err);
  }
}

function startGame() {
  currentQuestionIndex = 0;
  score = 0;
  toggle(nextButton, false);
  showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(q) {
  questionContainer.innerText = q.questionObj;
  answerButtons.innerHTML = "";
  q.answers.forEach((ans) => {
    const btn = document.createElement("button");
    btn.innerText = ans.text;
    btn.classList.add("btn");
    btn.onclick = () => selectAnswer(ans.isCorrect, btn);
    answerButtons.appendChild(btn);
  });
  toggle(timerEl, true);
  startTimer(20); // 20s per question
}

function selectAnswer(isCorrect, btn) {
  [...answerButtons.children].forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");
  selectedAnswer = isCorrect;
  toggle(nextButton, true);
}

nextButton.addEventListener("click", () => {
  clearInterval(timerInterval);
  if (selectedAnswer) score++;
  selectedAnswer = null;
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion(questions[currentQuestionIndex]);
  } else {
    showScore();
  }
});

function showScore() {
  toggle(questionContainer, false);
  toggle(answerButtons, false);
  toggle(nextButton, false);
  toggle(scoreContainer, true);
  toggle(finalScoreBtn, true);
  toggle(finalHistoryBtn, true);
  toggle(timerEl, false);

  scoreContainer.innerText = `${
    score <= 2 ? "Try harder" : "Well done"
  } ${user.name.toUpperCase()}!\nYour score: ${score}`;

  const history = JSON.parse(localStorage.getItem("quizHistory")) || [];
  history.push({ name: user.name, score });
  localStorage.setItem("quizHistory", JSON.stringify(history));
}

finalScoreBtn.addEventListener("click", () => (location.href = "index.html"));
finalHistoryBtn.addEventListener(
  "click",
  () => (location.href = "history.html")
);

// Timer
function startTimer(seconds) {
  // timerEl.classList.add("timer");
  // quizContainer.prepend(timerEl);

  let time = seconds;
  timerEl.innerText = `Time left: ${time}s`;

  timerInterval = setInterval(() => {
    time--;
    timerEl.innerText = `Time left: ${time}s`;
    if (time <= 0) {
      clearInterval(timerInterval);
      nextButton.click();
    }
  }, 1000);
  // toggle(timerEl, true);
}

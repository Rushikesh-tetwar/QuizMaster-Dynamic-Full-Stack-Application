const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const { getQuestions } = require("./services/questionsService");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Questions API
app.get("/api/questions", (req, res) => {
  try {
    const questions = getQuestions();
    res.json({ questions });
  } catch (err) {
    console.error("Error loading questions:", err);
    res.status(500).json({ error: "Failed to load questions" });
  }
});

// Score API (future-ready)
app.post("/api/score", (req, res) => {
  const { username, score } = req.body;
  if (!username || score == null) {
    return res.status(400).json({ error: "Username and score required" });
  }
  res.json({ message: "Score submitted successfully", username, score });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// {
//   "name": "quiz-project",
//   "version": "1.0.0",
//   "description": "Professional quiz app with API-driven architecture",
//   "main": "server.js",
//   "scripts": {
//     "start": "node server.js",
//     "dev": "nodemon server.js"
//   },
//   "author": "Rushikesh",
//   "license": "ISC",
//   "dependencies": {
//     "express": "^4.21.2",
//     "cors": "^2.8.5",
//     "morgan": "^1.10.0"
//   },
//   "devDependencies": {
//     "nodemon": "^3.1.0"
//   }
// }

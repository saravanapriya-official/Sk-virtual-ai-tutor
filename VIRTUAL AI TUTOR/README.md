# SK Virtual AI Tutor

A smart AI tutor web application built with **Flask** that answers questions from a predefined database. Perfect for learning AI concepts interactively.

---

## Features

- Answers questions from **5 units**:
  1. Introduction to AI
  2. Problem Solving
  3. Game Playing and CSP
  4. Logical Reasoning
  5. Probabilistic Reasoning
- Simple natural language matching (stopwords removed for better matching).
- Friendly fallback if the question is unknown:  
  `"Sorry, I don't know the answer to that question yet."`
- Easy to extend by adding questions to `questions.json`.
- Lightweight Flask backend with an HTML/JS frontend.

---

## Installation

1. **Clone the repository**:
```bash
git clone <your-repo-url>

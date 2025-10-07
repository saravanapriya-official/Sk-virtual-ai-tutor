import json
from flask import Flask, render_template, request, jsonify
from fuzzywuzzy import process  # make sure to install fuzzywuzzy

app = Flask(__name__)

# Load questions
def load_questions():
    with open("questions.json", encoding="utf-8") as f:
        data = json.load(f)
    
    qbank = {}
    for unit in data.values():
        for q in unit.get("questions", []):
            q_text = q.get("question", "")
            q_answer = q.get("answer", "")
            if q_text and q_answer:
                qbank[q_text] = q_answer
    return qbank

qbank = load_questions()
all_questions = list(qbank.keys())

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/chat', methods=['POST'])
def chat():
    user_question = request.get_json().get("question", "")
    
    # Use fuzzy matching to find the best matching question
    match, score = process.extractOne(user_question, all_questions)
    
    if score > 60:  # threshold for matching, adjust if needed
        answer = qbank[match]
    else:
        answer = "Sorry, I don't know the answer to that question yet."

    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(debug=True)

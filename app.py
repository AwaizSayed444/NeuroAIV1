import os
import json
import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from sentence_transformers import SentenceTransformer
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Layer
import tensorflow.keras.backend as K
from sklearn.preprocessing import LabelEncoder

# ------------------- Custom Attention Layer -------------------
class AttentionLayer(Layer):
    def __init__(self, **kwargs):
        super(AttentionLayer, self).__init__(**kwargs)

    def build(self, input_shape):
        self.W = self.add_weight(name="att_weight", shape=(input_shape[-1], 1),
                                 initializer="normal", trainable=True)
        self.b = self.add_weight(name="att_bias", shape=(1,), initializer="zeros", trainable=True)
        super(AttentionLayer, self).build(input_shape)

    def call(self, x):
        e = K.tanh(K.dot(x, self.W) + self.b)
        a = K.softmax(e, axis=1)
        return K.sum(x * a, axis=1)

# ------------------- Initialize Flask App -------------------
app = Flask(__name__)
CORS(app)

# ------------------- Load Resources -------------------
print("📦 Loading model and assets...")

model = load_model(r"E:\AI ML Models\mood_classifier_model.keras", custom_objects={"AttentionLayer": AttentionLayer})
sbert = SentenceTransformer("paraphrase-MiniLM-L12-v2")

with open(r"E:\AI ML Models\mood_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)

with open(r"E:\AI ML Models\cleaned_questions.json", "r", encoding="utf-8") as f:
    raw_data = json.load(f)

with open(r"E:\AI ML Models\mood_keywords_grouped_enhanced.json", "r", encoding="utf-8") as f:
    mood_keywords = json.load(f)

print("✅ All assets loaded!")

# ------------------- Process Question Data -------------------
question_data = {}
for entry in raw_data:
    category = entry.get("category", "").strip().lower()
    if category:
        all_qs = []
        for doc in entry.get("questions", []):
            all_qs.extend([q.strip() for q in doc.get("questions", []) if isinstance(q, str) and len(q.strip()) > 10])
        if all_qs:
            question_data[category] = all_qs

# ------------------- Mood Detection Functions -------------------
def detect_mood_keywords(text):
    text = text.lower()
    for mood, keywords in mood_keywords.items():
        if any(k in text for k in keywords):
            return mood
    return None

def predict_mood(text):
    mood = detect_mood_keywords(text)
    if mood:
        return mood, 1.0

    emb = sbert.encode([text])
    emb = np.reshape(emb, (1, 1, 384))  # match model input shape

    try:
        pred = model.predict(emb, verbose=0)
        idx = np.argmax(pred)
        conf = float(np.max(pred))
        mood = label_encoder.inverse_transform([idx])[0]
        return mood, conf
    except Exception as e:
        print("⚠️ Prediction error:", e)
        return "unknown", 0.0

# ------------------- Utility to Fetch Questions -------------------
def fetch_questions(mood, count=3):
    if not mood:
        return []
    key = mood.strip().lower()
    questions = question_data.get(key, [])
    return list(np.random.choice(questions, size=min(count, len(questions)), replace=False)) if questions else []

# ------------------- API Routes -------------------

@app.route("/predict", methods=["POST"])
def predict_route():
    data = request.get_json()
    user_input = data.get("message", "").strip()

    if not user_input:
        return jsonify({"error": "Message cannot be empty"}), 400

    mood, confidence = predict_mood(user_input)
    questions = fetch_questions(mood)

    if not questions:
        return jsonify({
            "reply": f"I'm here for you. Let's talk more about feeling {mood.lower()}.",
            "finished": True
        }), 200

    return jsonify({
        "reply": f"It seems you're feeling {mood.lower()}. Let's explore further:\n1. {questions[0]}",
        "questions": questions,
        "finished": False
    }), 200

@app.route("/next", methods=["POST"])
def next_question():
    data = request.get_json()
    answer = data.get("answer", "").strip()
    questions = data.get("questions", [])

    if not answer:
        return jsonify({"error": "Answer is required"}), 400

    if answer.lower() in ["exit", "quit", "stop", "end"]:
        return jsonify({
            "reply": "Assessment complete. Thank you for sharing!",
            "finished": True
        })

    if not questions or len(questions) <= 1:
        return jsonify({
            "reply": "You've answered all the available questions. Type 'exit' to end or feel free to share more.",
            "finished": False
        })

    remaining_questions = questions[1:]
    return jsonify({
        "reply": remaining_questions[0],
        "questions": remaining_questions,
        "finished": False
    }), 200

# ------------------- Run the Server -------------------
if __name__ == '__main__':
    app.run(debug=True, port=8000)

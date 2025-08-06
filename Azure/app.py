from flask import Flask, jsonify, render_template
from dotenv import load_dotenv
import os
import requests

load_dotenv()
app = Flask(__name__, static_folder="static", template_folder="templates")

AZURE_SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY")
AZURE_SPEECH_REGION = os.getenv("AZURE_SPEECH_REGION")

@app.route("/")
def index():
    return render_template("index.html")  

@app.route("/menu")
def menu():
    return render_template("menu.html")

@app.route('/contact')
def contact():
    return render_template('contact.html') 


@app.route("/get-speech-token")
def get_speech_token():
    if not AZURE_SPEECH_KEY or not AZURE_SPEECH_REGION:
        return jsonify({"error": "Missing Azure credentials"}), 400

    url = f"https://{AZURE_SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issuetoken"
    headers = { "Ocp-Apim-Subscription-Key": AZURE_SPEECH_KEY }

    response = requests.post(url, headers=headers)

    if response.status_code == 200:
        return jsonify({ "token": response.text, "region": AZURE_SPEECH_REGION })
    else:
        return jsonify({ "error": "Failed to get token", "details": response.text }), 500

if __name__ == "__main__":
    app.run(debug=True)

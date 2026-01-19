from flask import Flask, render_template
from flask_socketio import SocketIO
import random
import time
from datetime import datetime
import threading

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
history_data = []

@app.route("/history")
def history():
    # Pass the history list to the new template
    return render_template("history.html", history=history_data)

@app.route("/")
def home():
    return render_template("index.html")

def emit_fake_data():
    while True:
        bpm = random.randint(40,130)
        # bpm normal/abnormal test: (random.randint(55,110))
        # bpm critical or not test: (random.randint(40,130))
        critical = bpm < 50 or bpm > 120

        data = {
            "bpm": bpm,
            "rr_ms": random.randint(600, 1000),
            "chest_amplitude": random.randint(5, 25),
            "heart_status": "ACTIVE",
            "timestamp": datetime.now().strftime("%Y-%m-%d %I:%M:%S %p"),
            "critical": critical
        }

        # store in history
        history_data.append(data)
        if len(history_data) > 10:
            history_data.pop(0)

        socketio.emit('vital_data', data)
        time.sleep(1)


# Start a background thread
threading.Thread(target=emit_fake_data, daemon=True).start()

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True, allow_unsafe_werkzeug=True)

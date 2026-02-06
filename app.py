from flask import Flask, render_template
from flask_socketio import SocketIO
import paho.mqtt.client as mqtt
import json
from datetime import datetime

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

history_data = []

# ========= MQTT CONFIG =========
MQTT_BROKER = "broker.emqx.io"
MQTT_PORT = 1883
MQTT_TOPIC = "health/data/demo"

# ========= ROUTES =========
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/history")
def history():
    return render_template("history.html", history=history_data)

# ========= MQTT CALLBACKS =========
def on_connect(client, userdata, flags, rc):
    print("✅ MQTT Connected with result code", rc)
    client.subscribe(MQTT_TOPIC)

def on_message(client, userdata, msg):
    try:
        payload = msg.payload.decode()
        data = json.loads(payload)

        bpm = int(data.get("heart", 0))
        resp = int(data.get("resp", 0))

        critical = bpm < 60 or bpm > 100 or resp < 12 or resp > 20

        packet = {
            "bpm": bpm,
            "respiratory_rate": resp,
            "timestamp": datetime.now().strftime("%Y-%m-%d %I:%M:%S %p"),
            "critical": critical
        }

        # حفظ آخر 10 قراءات
        history_data.append(packet)
        if len(history_data) > 10:
            history_data.pop(0)

        # إرسال للواجهة
        socketio.emit("vital_data", packet)

        print("📡 Data forwarded to dashboard:", packet)

    except Exception as e:
        print("❌ Error processing MQTT message:", e)

# ========= MQTT CLIENT =========
mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.connect(MQTT_BROKER, MQTT_PORT)
mqtt_client.loop_start()

# ========= RUN =========
if name == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True, allow_unsafe_werkzeug=True)

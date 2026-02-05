  //MQTT CONNECT 
const client = mqtt.connect('wss://broker.emqx.io:8884/mqtt');


const heartEl = document.getElementById('heart-rate');
const breathEl = document.getElementById('breathing-rate');
const statusEl = document.getElementById('status');

let alertShown = false;

//  MQTT EVENTS
client.on('connect', () => {
  console.log('✅ Connected to MQTT');
  client.subscribe('health/data/demo');
});

client.on('message', (topic, message) => {
  const data = JSON.parse(message.toString());
  console.log('📡 Data:', data);

  //  HEART 
  const ecg = data.ecg_raw;
  heartEl.textContent = ${ecg} BPM;

  // RESPIRATION
  const respiration = data.respiration_rate;
  breathEl.textContent = ${respiration} breaths/min;

 
  if (
    ecg < 60  ecg > 100 
    respiration < 12 || respiration > 20
  ) {
    statusEl.textContent = 'CRITICAL';
    statusEl.style.color = 'red';

    if (!alertShown) {
      alertShown = true;
      document.getElementById("critical-popup").classList.add("show");
    }
  } else {
    statusEl.textContent = 'NORMAL';
    statusEl.style.color = 'green';
    alertShown = false;
  }
});


function closePopup() {
  document.getElementById("critical-popup").classList.remove("show");
  alertShown = false;
}

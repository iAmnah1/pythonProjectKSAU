// الاتصال بـ Flask SocketIO
const socket = io();

let alertShown = false;

const heartEl = document.getElementById('heart-rate');
const breathEl = document.getElementById('breathing-rate');
const statusEl = document.getElementById('status');

// استقبال البيانات من Flask
socket.on('vital_data', (data) => {
  console.log('📡 Data received:', data);

  const bpm = data.bpm;
  const respiration = data.respiratory_rate;

  heartEl.textContent = bpm + ' BPM';
  breathEl.textContent = respiration + ' breaths/min';

  if (
    bpm < 60  bpm > 100 
    respiration < 12 || respiration > 20
  ) {
    statusEl.textContent = 'CRITICAL';
    statusEl.style.color = 'red';

    if (!alertShown) {
      alertShown = true;
      document.getElementById('critical-popup').classList.add('show');
    }
  } else {
    statusEl.textContent = 'NORMAL';
    statusEl.style.color = 'green';
    alertShown = false;
  }
});

// زر إغلاق التنبيه
function closePopup() {
  document.getElementById('critical-popup').classList.remove('show');
  alertShown = false;
}

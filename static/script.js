  const socket = io();

  // Elements
  const heartEl = document.getElementById('heart-rate');
  const breathEl = document.getElementById('breathing-rate');
  const statusEl = document.getElementById('status');

  // Listen to real-time data from Flask SocketIO
  socket.on('vital_data', (data) => {
  const { bpm, rr_ms, chest_amplitude, heart_status } = data;

  // Update values
  heartEl.textContent = `${bpm} BPM`;
  const breathingRate = Math.round((chest_amplitude / 10) || 0); // Example calc
  breathEl.textContent = `${breathingRate} breaths/min`;

  // Status
  if (bpm < 60 || bpm > 100 || breathingRate < 12 || breathingRate > 20) {
    statusEl.textContent = 'Abnormal';
    statusEl.className = 'abnormal';
  } else {
    statusEl.textContent = 'Normal';
    statusEl.className = 'normal';
  }

  // Critical status popup a message
  if (data.critical && !alertShown) {
    alertShown = true;
    alert(
      "⚠️ CRITICAL CONDITION ⚠️\n\n" +
      "Patient requires immediate medical attention."
    );
}

});

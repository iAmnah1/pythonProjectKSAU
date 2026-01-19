document.getElementById("status").style.color =
    data.bpm < 60 || data.bpm > 100 || data.breathing_rate < 12 || data.breathing_rate > 20
    ? 'red' : 'green';

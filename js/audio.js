// Шипение только в моменте настройки радио. Фоновый шум убран.
(function () {
  const KEY = 'penrose77-sound';
  let ac = null;
  let staticGain = null;
  let started = false;
  let enabled = true;
  try {
    enabled = localStorage.getItem(KEY) !== 'off';
  } catch (e) { /* ignore */ }

  function ensure() {
    if (ac) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try { ac = new AC(); } catch (e) { return false; }

    const seconds = 3;
    const buffer = ac.createBuffer(1, ac.sampleRate * seconds, ac.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.05 * white) / 1.05;
      data[i] = last * 2.6;
    }

    const src = ac.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1700;
    bp.Q.value = 0.8;

    staticGain = ac.createGain();
    staticGain.gain.value = 0;

    src.connect(bp).connect(staticGain).connect(ac.destination);
    src.start();
    return true;
  }

  function ramp(value) {
    if (!staticGain) return;
    const now = ac.currentTime;
    staticGain.gain.cancelScheduledValues(now);
    staticGain.gain.setTargetAtTime(value, now, 0.15);
  }

  function unlock() {
    if (!ensure()) return;
    if (ac.state === 'suspended') ac.resume();
  }

  window.radioAudio = {
    start() {
      if (!enabled) return;
      if (!ensure()) return;
      if (ac.state === 'suspended') ac.resume();
      ramp(0.05);
    },
    stop() {
      ramp(0);
    },
    setTuned(tuned) {
      if (!enabled) return;
      ramp(tuned ? 0.01 : 0.05);
    }
  };

  // ── ветер на улице (платформа, трасса, лес, тайга) ──
  let windGain = null;

  function ensureWind() {
    if (windGain) return true;
    if (!ensure()) return false;
    const seconds = 4;
    const buffer = ac.createBuffer(1, ac.sampleRate * seconds, ac.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.4;
    }
    const src = ac.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const lp = ac.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 420;
    lp.Q.value = 0.4;

    windGain = ac.createGain();
    windGain.gain.value = 0;

    const lfo = ac.createOscillator();
    const lfoGain = ac.createGain();
    lfo.frequency.value = 0.18;
    lfoGain.gain.value = 160;
    lfo.connect(lfoGain).connect(lp.frequency);
    lfo.start();

    src.connect(lp).connect(windGain).connect(ac.destination);
    src.start();
    return true;
  }

  function windRamp(value) {
    if (!windGain) return;
    const now = ac.currentTime;
    windGain.gain.cancelScheduledValues(now);
    windGain.gain.setTargetAtTime(value, now, 0.4);
  }

  window.ambientWind = function (on) {
    if (!enabled) return;
    if (on) {
      if (!ensureWind()) return;
      if (ac.state === 'suspended') ac.resume();
      windRamp(0.045);
    } else {
      windRamp(0);
    }
  };

  function syncButton() {
    const btn = document.getElementById('sound-btn');
    if (!btn) return;
    btn.classList.toggle('off', !enabled);
    btn.title = enabled ? 'Звук включён' : 'Звук выключен';
  }

  const btn = document.getElementById('sound-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      enabled = !enabled;
      try { localStorage.setItem(KEY, enabled ? 'on' : 'off'); } catch (e) { /* ignore */ }
      if (!enabled) {
        if (staticGain) ramp(0);
        if (windGain) windRamp(0);
      } else {
        unlock();
      }
      syncButton();
    });
  }

  syncButton();

  ['pointerdown', 'keydown'].forEach(type => {
    window.addEventListener(type, unlock, { passive: true });
  });
})();

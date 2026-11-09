(function () {
  const PHRASES = [
    'LUCHI', 'PROMISE', 'СОНЯ', '25.06',
    '「ユジロ、逃げて」', '「君の声が聞こえる」',
    '«Я уделяю всё своё внимание тому, как ты таешь в моих объятиях»',
    '«Слезы твои мой фетиш»'
  ];
  const MAX_TEXTS = 90;
  const WALK_SPEED = 0.06; // прогресс вагона в секунду

  let spawnTimer = null;
  let spawnInterval = 420;
  let textCount = 0;
  let running = false;

  let walking = false;
  let progress = 0;
  let lap = 0;
  let finished = false;
  let rafId = null;
  let lastTs = 0;

  function tick(ts) {
    rafId = requestAnimationFrame(tick);
    if (!running) { lastTs = 0; return; }
    if (!lastTs) lastTs = ts;
    const dt = Math.min((ts - lastTs) / 1000, 0.1);
    lastTs = ts;

    if (!walking || finished) return;

    progress = Math.min(1, progress + WALK_SPEED * dt);
    applyZoom();
    if (progress >= 1) completeLap();
  }

  function applyZoom() {
    const scene = document.getElementById('scene-dream');
    if (scene) scene.style.setProperty('--zoom', (1 + progress * 0.9).toFixed(3));

    const model = document.getElementById('dream-luchi');
    if (model) {
      const s = 0.55 + progress * 0.55;
      model.style.transform = `translate(-50%, -50%) scale(${s.toFixed(3)})`;
    }
    const img = document.getElementById('dream-model');
    if (img) {
      img.style.filter = `brightness(${(0.16 + progress * 0.62).toFixed(2)}) drop-shadow(0 0 26px rgba(168, 216, 32, 0.35))`;
    }
  }

  function completeLap() {
    const all = state.anchors.length >= 3;
    if (all) { finish(); return; }

    flash();
    progress = 0;
    lap = Math.min(1, lap + 1);
    applyZoom();
    updateAnchors();
    setHint('Ты снова в начале вагона. Держи S — иди вперёд.');
  }

  function flash() {
    const f = document.getElementById('dream-flash');
    if (!f) return;
    f.classList.add('on');
    setTimeout(() => f.classList.remove('on'), 700);
  }

  function setHint(text) {
    const hint = document.querySelector('.walk-hint');
    if (hint) hint.textContent = text;
  }

  function finish() {
    finished = true;
    walking = false;
    running = false;
    document.body.classList.remove('dream-walking');
    clearInterval(spawnTimer);
    document.getElementById('dream-layer').innerHTML = '';
    setHint('Ты рядом.');
    document.getElementById('hug-scene').hidden = false;
  }

  // ── надписи заполняют экран ──────────────────
  function spawnOne() {
    if (!running) return;
    const layer = document.getElementById('dream-layer');
    const count = Math.random() < 0.4 ? 2 : 1;

    for (let n = 0; n < count; n++) {
      const el = document.createElement('span');
      el.className = 'dream-text';
      el.textContent = PHRASES[Math.floor(Math.random() * PHRASES.length)];
      el.style.top = Math.random() * 94 + '%';
      el.style.left = Math.random() * 88 + '%';
      layer.appendChild(el);
      textCount++;
    }

    if (textCount >= MAX_TEXTS) {
      running = false;
      clearInterval(spawnTimer);
      showEnding('consumed');
      return;
    }
    if (Math.random() < 0.05) {
      const first = layer.firstChild;
      if (first) { first.remove(); textCount--; }
    }
  }

  function restartTimer() {
    if (spawnTimer) clearInterval(spawnTimer);
    spawnTimer = setInterval(spawnOne, spawnInterval);
  }

  // ── якори: первый вагон — один, второй — два ──
  function anchorEls() {
    return Array.from(document.querySelectorAll('#scene-dream .anchor'));
  }

  function updateAnchors() {
    anchorEls().forEach(el => {
      const id = el.dataset.id;
      const collected = state.anchors.includes(id);
      let show = !collected;
      if (id !== 'cat' && lap < 1) show = false;
      el.style.display = show ? '' : 'none';
    });
  }

  function pickAnchor(id, el) {
    if (state.anchors.includes(id)) return;
    state.anchors.push(id);
    saveState();
    el.classList.add('picked');

    const texts = document.querySelectorAll('.dream-text');
    texts.forEach((t, i) => { if (i % 3 === 0) { t.remove(); textCount--; } });

    if (id === 'cat') {
      if (state.inventory.length >= INVENTORY_SIZE && state.inventory.some(i => i.id === 'battery')) {
        removeItem('battery');
        addNote('Батарейка больше не нужна — ты оставляешь её на сиденье.');
      }
      addItem('catLight');
    }

    updateAnchors();

    if (state.anchors.length >= 3) {
      setHint('Все якоря собраны. Дойди до конца вагона.');
    }
  }

  sceneModules['scene-dream'] = {
    onEnter() {
      state.anchors = [];
      saveState();
      document.getElementById('dream-layer').innerHTML = '';
      document.getElementById('hug-scene').hidden = true;
      document.getElementById('dream-luchi').classList.remove('frozen');
      anchorEls().forEach(a => a.classList.remove('picked'));

      textCount = 0;
      spawnInterval = 420;
      running = true;
      walking = false;
      progress = 0;
      lap = 0;
      finished = false;
      lastTs = 0;
      document.body.classList.remove('dream-walking');

      applyZoom();
      updateAnchors();
      setHint('Держи S — иди вперёд. Собирай якори по вагонам.');

      anchorEls().forEach(a => {
        a.onclick = () => pickAnchor(a.dataset.id, a);
      });
      document.getElementById('wake-btn').onclick = () => showScene('scene-map');
      document.getElementById('walk-btn').classList.remove('holding');

      restartTimer();
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    },

    onExit() {
      running = false;
      walking = false;
      document.body.classList.remove('dream-walking');
      clearInterval(spawnTimer);
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    }
  };

  // ── управление ходьбой ───────────────────────
  function startWalk() {
    if (!running || finished) return;
    const modal = document.getElementById('modal');
    if (modal && modal.hidden === false) return;
    walking = true;
    document.body.classList.add('dream-walking');
    document.getElementById('walk-btn').classList.add('holding');
  }

  function stopWalk() {
    walking = false;
    document.body.classList.remove('dream-walking');
    document.getElementById('walk-btn').classList.remove('holding');
  }

  (function bindWalk() {
    const btn = document.getElementById('walk-btn');
    if (!btn) return;

    btn.addEventListener('pointerdown', e => { e.preventDefault(); startWalk(); });
    btn.addEventListener('pointerup', stopWalk);
    btn.addEventListener('pointerleave', stopWalk);
    btn.addEventListener('pointercancel', stopWalk);
    btn.addEventListener('contextmenu', e => e.preventDefault());
    window.addEventListener('pointerup', stopWalk);

    document.addEventListener('keydown', e => {
      if (e.code !== 'KeyS') return;
      if (state.scene !== 'scene-dream') return;
      if (isTyping(e)) return;
      e.preventDefault();
      startWalk();
    });
    document.addEventListener('keyup', e => {
      if (e.code === 'KeyS') stopWalk();
    });
  })();
})();

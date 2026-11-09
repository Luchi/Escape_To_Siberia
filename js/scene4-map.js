(function () {
  const ORDER = { platform: 0, road: 1, forest: 2, taiga: 3 };

  sceneModules['scene-map'] = {
    onEnter() {
      refreshPoints();
      hideChoice();
      hideTaigaScene();
      document.querySelectorAll('.map-point').forEach(p => {
        p.onclick = () => handlePoint(p.dataset.point);
      });
    },

    // фонарик работает прямо в лесу, без подсказок; повторный W гасит следы
    onUse(item) {
      if (!forestOpen) return false;
      if (item.id === 'catLight') {
        forestPaws = !forestPaws;
        renderForest();
        return true;
      }
      return false;
    }
  };

  function refreshPoints() {
    const step = state.flags.mapStep || 0;
    document.querySelectorAll('.map-point').forEach(p => {
      const need = ORDER[p.dataset.point];
      const isForestReturn = p.dataset.point === 'forest' && step >= 3;
      const locked = need === undefined || (need !== step && !isForestReturn);
      p.classList.toggle('locked', locked);
      p.classList.toggle('current', need === step);
    });
  }

  function handlePoint(point) {
    const step = state.flags.mapStep || 0;
    if (point === 'platform') {
      if (step === 0) platformScene();
      return;
    }
    if (point === 'road') {
      if (step === 1) roadScene();
      return;
    }
    if (point === 'forest') {
      if (step === 2 || step >= 3) forestScene();
      return;
    }
    if (point === 'taiga') {
      if (step >= 3) openTaigaScene();
    }
  }

  function advance(step) {
    state.flags.mapStep = step;
    saveState();
    showScene('scene-map');
  }

  // ── выбор поверх фона ────────────────────────
  function showChoice(bg, text, options) {
    const layer = document.getElementById('choice');
    const box = document.getElementById('choice-buttons');
    const urls = Array.isArray(bg) ? bg : [bg];
    layer.style.backgroundImage = urls.map(u => `url('${u}')`).join(', ');
    document.getElementById('choice-text').textContent = text;
    box.innerHTML = '';
    options.forEach(o => {
      const b = document.createElement('button');
      b.textContent = o.label;
      b.onclick = () => { hideChoice(); o.cb(); };
      box.appendChild(b);
    });
    layer.hidden = false;
    if (window.ambientWind) {
      const outdoor = /forest|platform|road|taiga/.test(urls.join(' '));
      window.ambientWind(outdoor);
    }
  }

  function hideChoice() {
    const layer = document.getElementById('choice');
    if (layer) layer.hidden = true;
    const paws = document.getElementById('forest-paws');
    if (paws) paws.hidden = true;
    forestOpen = false;
    if (window.ambientWind) window.ambientWind(false);
  }

  // ── платформа ────────────────────────────────
  function platformScene() {
    showChoice(
      ['assets/img/bg-platform.png', 'assets/img/bg-station.png'],
      'Платформа «Повестка-Экспресс».\nБлин, указатели совсем размыло — ничего не понятно. Куда же идти?',
      [
        { label: 'НАЛЕВО', cb: () => showEnding('army') },
        { label: 'НАПРАВО', cb: () => advance(1) }
      ]
    );
  }

  // ── трасса ───────────────────────────────────
  function roadScene() {
    showChoice(
      'assets/img/bg-road.png',
      'Трасса. Ты сидишь в старой машине, водитель поглядывает в зеркало.\n\nВодитель: «А ты куда вообще такой?»',
      [
        { label: 'Я в армию', cb: () => showEnding('army') },
        { label: 'Я к подруге в Сибирь', cb: () => advance(2) }
      ]
    );
  }

  // ── лес ──────────────────────────────────────
  let forestStage = 0;
  let forestOpen = false;
  let forestPaws = false;

  function forestScene() {
    forestStage = 0;
    forestPaws = false;
    forestOpen = true;
    renderForest();
  }

  function renderForest() {
    forestOpen = true;
    const text = `ЛЕС — ${forestStage + 1}/3\nТри тропы. Куда идёшь?`;
    const labels = ['ЛЕВАЯ ТРОПА', 'СРЕДНЯЯ ТРОПА', 'ПРАВАЯ ТРОПА'];
    const correct = [0, 1, 2][forestStage];

    showChoice(
      'assets/img/bg-forest.png',
      text,
      [0, 1, 2].map(i => ({
        label: labels[i],
        cb: () => forestPick(i)
      }))
    );

    const paws = document.getElementById('forest-paws');
    if (paws) {
      paws.hidden = !forestPaws;
      paws.className = 'p-' + ['left', 'middle', 'right'][correct];
    }
  }

  function forestPick(i) {
    const correct = [0, 1, 2][forestStage];
    if (i !== correct) {
      hideChoice();
      showEnding('taiga');
      return;
    }
    forestStage += 1;
    if (forestStage >= 3) {
      hideChoice();
      state.flags.mapStep = 3;
      saveState();
      openTaigaScene();
      return;
    }
    renderForest();
  }

  // ── тайга: только фон и радио ────────────────
  function openTaigaScene() {
    const layer = document.getElementById('taiga-scene');
    if (layer) layer.hidden = false;
    if (window.ambientWind) window.ambientWind(true);
    const radio = document.getElementById('taiga-radio');
    if (radio) radio.onclick = openTaigaRadio;
    const forestBtn = document.getElementById('taiga-forest');
    if (forestBtn) {
      forestBtn.onclick = () => {
        hideTaigaScene();
        forestScene();
      };
    }
  }

  function hideTaigaScene() {
    const layer = document.getElementById('taiga-scene');
    if (layer) layer.hidden = true;
    if (window.ambientWind) window.ambientWind(false);
  }

  function openTaigaRadio() {
    openModal(`
      <img class="radio-scene" src="assets/img/radio_for.png" alt="" onerror="this.remove()">
      <h3>РАДИО</h3>
      <p>Что ты хотел бы ей сейчас сказать?</p>
      <div class="choice-buttons">
        <button id="taiga-come">ПОДОЙТИ</button>
        <button id="taiga-back">ВЕРНУТЬСЯ</button>
      </div>
    `);

    document.getElementById('taiga-come').onclick = () => {
      closeModal();
      taigaTune();
    };
    document.getElementById('taiga-back').onclick = () => closeModal();
  }

  function taigaTune() {
    const TARGET = 14300; // 143.00
    let freq = 10000;
    let lock = 0;
    let done = false;
    let repeat = null;
    let timer = null;

    openModal(`
      <img class="radio-scene" src="assets/img/radio_for.png" alt="" onerror="this.remove()">
      <h3>РАДИО</h3>
      <div class="radio-row">
        <button id="freq-aa" title="Намного ниже">◀◀</button>
        <button id="freq-a" title="Ниже на 0.01">A −</button>
        <span id="freq-val">100.00</span>
        <button id="freq-d" title="Выше на 0.01">D +</button>
        <button id="freq-dd" title="Намного выше">▶▶</button>
      </div>
      <div class="meter"><div id="interf-fill" class="meter-fill"></div></div>
      <p id="radio-status">Помехи. Ничего.</p>
    `, () => {
      if (timer) clearInterval(timer);
      stopRepeat();
      document.removeEventListener('keydown', onKey);
      delete document.getElementById('modal').dataset.mode;
      if (window.radioAudio) window.radioAudio.stop();
    });
    document.getElementById('modal').dataset.mode = 'radio';

    if (window.radioAudio) window.radioAudio.start();

    const valEl = document.getElementById('freq-val');
    const fillEl = document.getElementById('interf-fill');
    const statusEl = document.getElementById('radio-status');

    function paint() {
      valEl.textContent = (freq / 100).toFixed(2);
      fillEl.style.width = '0%';
    }

    function step(delta) {
      if (done) return;
      freq = Math.max(0, Math.min(25000, freq + delta));
      lock = 0;
      paint();
      statusEl.textContent = freq === TARGET ? 'Это её число.' : 'Помехи. Ничего.';
      fillEl.style.width = freq === TARGET ? '100%' : '0%';
      if (window.radioAudio) window.radioAudio.setTuned(freq === TARGET);
    }

    function stopRepeat() {
      if (repeat) { clearInterval(repeat); repeat = null; }
    }

    function onKey(e) {
      if (e.code !== 'KeyA' && e.code !== 'KeyD' && e.code !== 'ArrowLeft' && e.code !== 'ArrowRight') return;
      e.preventDefault();
      const down = e.code === 'KeyA' || e.code === 'ArrowLeft';
      step(down ? -1 : 1);
    }
    document.addEventListener('keydown', onKey);

    function startRepeat(sign) {
      step(sign * 100);
      stopRepeat();
      repeat = setInterval(() => step(sign * 100), 60);
    }

    const btnAA = document.getElementById('freq-aa');
    const btnA = document.getElementById('freq-a');
    const btnD = document.getElementById('freq-d');
    const btnDD = document.getElementById('freq-dd');

    btnA.addEventListener('click', () => step(-1));
    btnD.addEventListener('click', () => step(1));
    btnAA.addEventListener('pointerdown', e => { e.preventDefault(); startRepeat(-1); });
    btnDD.addEventListener('pointerdown', e => { e.preventDefault(); startRepeat(1); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => {
      btnAA.addEventListener(ev, stopRepeat);
      btnDD.addEventListener(ev, stopRepeat);
    });
    window.addEventListener('pointerup', stopRepeat);

    timer = setInterval(() => {
      if (done) return;
      if (freq === TARGET) {
        lock = Math.min(100, lock + 6);
        fillEl.style.width = `${lock}%`;
        if (lock >= 100) {
          done = true;
          clearInterval(timer);
          clearInterval(repeat);
          document.getElementById('modal-content').innerHTML = `
            <img class="radio-scene" src="assets/img/radio_for.png" alt="" onerror="this.remove()">
            <h3>СИГНАЛ</h3>
            <pre style="font-size:30px; color:var(--luchi); text-align:center;">143. I love you.</pre>
            <p style="text-align:center; opacity:.7;">Скажи это в рацию.</p>
            <button id="taiga-say">СКАЗАТЬ</button>
          `;
          document.getElementById('taiga-say').onclick = () => {
            closeModal();
            hideTaigaScene();
            const light = document.getElementById('end-light-wrap');
            const gif = document.getElementById('end-light');
            if (light) light.hidden = false;
            if (gif) gif.src = 'assets/img/end_light.gif';
            // гифка проигрывается ровно один раз — и сразу финал
            setTimeout(() => {
              if (light) light.hidden = true;
              showEnding('canon');
            }, 1200);
          };
        }
      }
    }, 100);
  }
})();

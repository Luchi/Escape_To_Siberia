(function () {
  const bootLines = [
    'PENROSE-77 // СИБИРСКИЙ РЕЛЕЙНЫЙ УЗЕЛ',
    'СИГНАЛ НЕСТАБИЛЕН.',
    'ОБНАРУЖЕН ОБЪЕКТ: «БЕГЛЕЦ».',
    'ОПЕРАТОР: LUCHI.',
    'ВВЕДИ ПОЗЫВНОЙ ОБЪЕКТА.'
  ];

  function typeLines(el, lines, i = 0, cb) {
    if (i >= lines.length) { if (cb) cb(); return; }
    el.textContent += lines[i] + '\n';
    setTimeout(() => typeLines(el, lines, i + 1, cb), 350);
  }

  let bootToken = 0;

  function fontsReady() {
    const ready = (document.fonts && document.fonts.ready)
      ? document.fonts.ready
      : Promise.resolve();
    // не ждём вечно, если шрифт не загрузился
    const timeout = new Promise(resolve => setTimeout(resolve, 1500));
    const fonts = Promise.race([ready, timeout]);
    const assets = window.assetsReady || Promise.resolve();
    return Promise.all([fonts, assets]);
  }

  sceneModules['scene-boot'] = {
    onEnter() {
      const token = ++bootToken;
      const text = document.getElementById('boot-text');
      text.textContent = '';
      document.getElementById('boot-input-wrap').hidden = true;
      document.getElementById('boot-easter').classList.add('hidden');

      // ждём загрузки пиксельного шрифта, чтобы текст не «прыгал»
      fontsReady().then(() => {
        if (token !== bootToken || state.scene !== 'scene-boot') return;
        text.textContent = '';
        typeLines(text, bootLines, 0, () => {
          if (token !== bootToken) return;
          document.getElementById('boot-input-wrap').hidden = false;
        });
      });
    }
  };

  document.getElementById('callsign').addEventListener('input', e => {
    const v = e.target.value.trim();
    if (v.toUpperCase() === 'PROMISE') {
      document.getElementById('boot-easter').classList.remove('hidden');
      state.secretFound = true;
      saveState();
    }
    document.getElementById('start-btn').hidden = !v;
  });

  document.getElementById('start-btn').addEventListener('click', () => {
    state.objectName = document.getElementById('callsign').value.trim();
    saveState();
    showScene('scene-commissariat');
  });
})();
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
    const timeout = new Promise(resolve => setTimeout(resolve, 15000));

    if (!document.fonts || !document.fonts.load) {
      return Promise.race([timeout, (window.assetsReady || Promise.resolve()).then(() => {})]);
    }

    // явно просим все шрифты, которые используются в игре
    const faces = [
      '400 20px "Handjet"',
      '700 20px "Handjet"',
      '400 20px "Press Start 2P"',
      '400 20px "DotGothic16"',
      '400 20px "Noto Sans JP"',
      '500 20px "Noto Sans JP"'
    ];

    const loads = faces.map(f =>
      document.fonts.load(f).catch(() => {})
    );

    const all = Promise.all(loads).then(() => document.fonts.ready);
    const assets = window.assetsReady || Promise.resolve();

    return Promise.race([
      Promise.all([all, assets]).then(() => {}),
      timeout
    ]);
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
        // прячем загрузочный экран только когда начинаем печатать
        if (window.hideLoader) window.hideLoader();
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
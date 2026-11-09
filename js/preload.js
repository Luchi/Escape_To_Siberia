// Загрузка: всё для сцен 0–1 — до старта.
// Остальное грузится фоном по порядку: сцена 2 → сон → карта → платформа →
// трасса → лес → тайга → концовки → финал.
(function () {
  const CRITICAL = [
    'icon_load.png','hud.png','Vlad-AV.png',
    'bg-commissariat.png','bg-commissariat-wthoutPhoto.png',
    'wall1.png','wall2.png','wall3.png','wall4.png','wall5.png',
    'Q.png','W.png','E.png','icon_R.png','Note.png',
    'mirror-eye.png','Photo.png','radio.png',
    'calendar-november.png','calendar-february.png',
    'icon-battery.png','icon-coat.png','hat.png','shawarma.png','icon-dino.png'
  ];

  const REST_GROUPS = [
    // сцена 2
    ['bg-station.png'],
    // сон
    ['bg-train.png','luchi_model.png','eye_dream.png','manga.png','paws_t.png','icon-catlight.png'],
    // карта
    ['bg-map.png'],
    // платформа
    ['bg-platform.png'],
    // трасса
    ['bg-road.png'],
    // лес
    ['bg-forest.png'],
    // тайга
    ['bg-taiga.png','radio_for.png'],
    // концовки
    ['ending-taiga.png','Ending_Arm.png','defeat.png','Secret_End.png',
     'Luchi_End.png','End_Scene1.png','end_light.gif'],
    // финал и мелочи
    ['bg-final.png','favicon.png','icon_sait.png']
  ];

  const fill = document.getElementById('loader-fill');
  const loader = document.getElementById('loader');

  let finished = false;

  function doneUI() {
    if (finished) return;
    finished = true;
    if (fill) fill.style.width = '100%';
    setTimeout(() => {
      if (loader) loader.classList.add('done');
      setTimeout(() => { if (loader) loader.hidden = true; }, 500);
    }, 120);
  }

  function loadList(names, onProgress, priority) {
    return new Promise(resolve => {
      let left = names.length;
      let loaded = 0;
      if (!left) return resolve();

      names.forEach(name => {
        const img = new Image();
        if (priority && 'fetchPriority' in img) img.fetchPriority = 'high';
        let settled = false;
        const complete = () => {
          if (settled) return;
          settled = true;
          loaded++;
          if (onProgress) onProgress(loaded / names.length);
          left--;
          if (left <= 0) resolve();
        };
        img.onload = () => {
          if (img.decode) img.decode().then(complete, complete);
          else complete();
        };
        img.onerror = complete;
        img.src = 'assets/img/' + name + (name === 'radio.png' ? '?v=2' : '');
      });
    });
  }

  async function loadRest() {
    for (const group of REST_GROUPS) {
      await Promise.race([
        loadList(group, null, false),
        new Promise(resolve => setTimeout(resolve, 15000))
      ]);
    }
  }

  window.assetsReady = new Promise(resolve => {
    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      doneUI();
      resolve();
      // всё остальное — уже во время сцен 0–1
      setTimeout(loadRest, 200);
    };

    loadList(CRITICAL, ratio => {
      if (fill) fill.style.width = Math.round(ratio * 100) + '%';
    }, true).then(finish);

    setTimeout(finish, 20000);
  });
})();

// Загрузка: критичный минимум — до старта, остальное — фоном.
// Экран загрузки держится, пока сцена 0 не начнёт печатать текст.
(function () {
  // минимум для запуска и первой сцены
  const CRITICAL = [
    'icon_load.png','hud.png',
    'bg-commissariat.png',
    'wall1.png','wall2.png','wall3.png','wall4.png','wall5.png',
    'Q.png','W.png','E.png','icon_R.png','Note.png'
  ];

  // предметы и картинки сцены 1 — грузятся сразу после старта
  const SCENE1 = [
    'Vlad-AV.png','bg-commissariat-wthoutPhoto.png','mirror-eye.png','Photo.png','radio.png',
    'calendar-november.png','calendar-february.png',
    'icon-battery.png','icon-coat.png','hat.png','shawarma.png','icon-dino.png'
  ];

  const REST_GROUPS = [
    SCENE1,
    ['bg-station.png'],                                                   // сцена 2
    ['bg-train.png','luchi_model.png','eye_dream.png','manga.png',
     'paws_t.png','icon-catlight.png'],                                   // сон
    ['bg-map.png'],                                                       // карта
    ['bg-platform.png'],                                                  // платформа
    ['bg-road.png'],                                                      // трасса
    ['bg-forest.png'],                                                    // лес
    ['bg-taiga.png','radio_for.png'],                                     // тайга
    ['ending-taiga.png','Ending_Arm.png','defeat.png','Secret_End.png',
     'Luchi_End.png','End_Scene1.png','end_light.gif'],                   // концовки
    ['bg-final.png','favicon.png','icon_sait.png']                        // финал
  ];

  const fill = document.getElementById('loader-fill');
  const loader = document.getElementById('loader');

  let hidden = false;

  window.hideLoader = function () {
    if (hidden) return;
    hidden = true;
    if (fill) fill.style.width = '100%';
    if (loader) {
      loader.classList.add('done');
      setTimeout(() => { loader.hidden = true; }, 600);
    }
  };

  function loadList(names, onProgress, decode) {
    return new Promise(resolve => {
      let left = names.length;
      let loaded = 0;
      if (!left) return resolve();

      names.forEach(name => {
        const img = new Image();
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
          if (decode && img.decode) img.decode().then(complete, complete);
          else complete();
        };
        img.onerror = complete;
        img.src = 'assets/img/' + name + (name === 'radio.png' ? '?v=2' : name === 'calendar-november.png' ? '?v=7' : '');
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
      if (fill) fill.style.width = '100%';
      resolve();
      setTimeout(loadRest, 300);
    };

    loadList(CRITICAL, ratio => {
      if (fill) fill.style.width = Math.round(ratio * 100) + '%';
    }, true).then(finish);

    // страховка: не держим экран вечно, только если что-то совсем застряло
    setTimeout(finish, 30000);
  });
})();

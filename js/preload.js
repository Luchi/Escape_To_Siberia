// Быстрая загрузка: сначала только критичные картинки,
// остальное догружается в фоне, не задерживая старт.
(function () {
  const CRITICAL = [
    'icon_load.png','hud.png','Vlad-AV.png',
    'wall1.png','wall2.png','wall3.png','wall4.png','wall5.png',
    'Q.png','W.png','E.png','icon_R.png','Note.png'
  ];

  const REST = [
    'bg-commissariat.png','bg-commissariat-wthoutPhoto.png',
    'bg-station.png','bg-train.png','bg-map.png','bg-platform.png','bg-road.png',
    'bg-forest.png','bg-taiga.png','bg-final.png',
    'mirror-eye.png','Photo.png','radio.png','radio_for.png',
    'calendar-november.png','calendar-february.png',
    'icon-battery.png','icon-coat.png','hat.png','shawarma.png','icon-dino.png',
    'icon-catlight.png','luchi_model.png','eye_dream.png','manga.png','paws_t.png',
    'ending-taiga.png','Ending_Arm.png','defeat.png','Secret_End.png','Luchi_End.png',
    'End_Scene1.png','end_light.gif','favicon.png','icon_sait.png'
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

  window.assetsReady = new Promise(resolve => {
    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      doneUI();
      resolve();
      // остальное — уже после старта, не блокирует игру
      setTimeout(() => loadList(REST, null, false), 300);
    };

    loadList(CRITICAL, ratio => {
      if (fill) fill.style.width = Math.round(ratio * 100) + '%';
    }, true).then(finish);

    setTimeout(finish, 2500);
  });
})();

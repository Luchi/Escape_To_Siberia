// Предзагрузка всех используемых картинок + экран загрузки
(function () {
  const FILES = [
    // фоны
    'bg-commissariat.png','bg-commissariat-wthoutPhoto.png','bg-station.png','bg-train.png',
    'bg-map.png','bg-platform.png','bg-road.png','bg-forest.png','bg-taiga.png','bg-final.png',
    // HUD и интерфейс
    'hud.png','Note.png','Q.png','W.png','E.png','icon_R.png','Vlad-AV.png','favicon.png',
    // сцена 1
    'mirror-eye.png','Photo.png','radio.png','radio_for.png','calendar-november.png',
    'calendar-february.png','wall1.png','wall2.png','wall3.png','wall4.png','wall5.png',
    // предметы
    'icon-battery.png','icon-coat.png','hat.png','shawarma.png','icon-dino.png','icon-catlight.png',
    // сон
    'luchi_model.png','eye_dream.png','manga.png','paws_t.png',
    // концовки
    'ending-taiga.png','Ending_Arm.png','defeat.png','Secret_End.png','Luchi_End.png','End_Scene1.png',
    'end_light.gif',
    // загрузка
    'icon_load.png','icon_sait.png'
  ];

  const fill = document.getElementById('loader-fill');
  const loader = document.getElementById('loader');

  let loaded = 0;
  let finished = false;

  function update() {
    if (fill) fill.style.width = Math.round((loaded / FILES.length) * 100) + '%';
  }

  function done() {
    if (finished) return;
    finished = true;
    if (fill) fill.style.width = '100%';
    setTimeout(() => {
      if (loader) loader.classList.add('done');
      setTimeout(() => { if (loader) loader.hidden = true; }, 600);
    }, 200);
  }

  window.assetsReady = new Promise(resolve => {
    let left = FILES.length;

    FILES.forEach(name => {
      const img = new Image();
      let settled = false;

      const complete = () => {
        if (settled) return;
        settled = true;
        loaded++;
        update();
        left--;
        if (left <= 0) { done(); resolve(); }
      };

      img.onload = () => {
        // декодируем сразу, чтобы при смене сцены не было пустого кадра
        if (img.decode) img.decode().then(complete, complete);
        else complete();
      };
      img.onerror = complete;
      img.src = 'assets/img/' + name + (name === 'radio.png' ? '?v=2' : '');
    });

    setTimeout(() => { done(); resolve(); }, 20000);
  });
})();

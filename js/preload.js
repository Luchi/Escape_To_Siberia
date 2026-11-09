// Предзагрузка всех картинок + экран загрузки
(function () {
  const FILES = [
    'bg-commissariat-wthoutPhoto.png','bg-commissariat.png','bg-final.png','bg-forest.png',
    'bg-map.png','bg-platform.png','bg-road.png','bg-station.png','bg-taiga.png','bg-train.png',
    'calendar-february.png','calendar-november.png','defeat.png','Defeat_Arm.png','E.png',
    'ending-taiga.png','Ending_Arm.png','end_light.gif','end_light_last.png','eye_dream.png',
    'eye_dream_t.png','February.png','hat.png','hud.png','icon-battery.png','icon-catlight.png',
    'icon-coat.png','icon-dino.png','icon-draw.png','icon-R.png','icon_load.png','icon_R.png',
    'icon_sait.png','Luchi_End.png','luchi_model.png','Luchi_Portret.png','manga.png',
    'mirror-eye.png','Note.png','November.png','paws.png','paws_t.png','Photo.png','Q.png',
    'radio.png','radio_for.png','ring.png','Secret_End.png','shawarma.png','Vlad-AV.png',
    'W.png','wall-1.png','wall-2.png','wall-3.png','wall-4.png','wall1.png','wall2.png',
    'wall3.png','wall4.png','wall5.png'
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
    }, 250);
  }

  window.assetsReady = new Promise(resolve => {
    let left = FILES.length;

    FILES.forEach(name => {
      const img = new Image();
      const finish = () => {
        loaded++;
        update();
        left--;
        if (left <= 0) { done(); resolve(); }
      };
      img.onload = finish;
      img.onerror = finish;
      img.src = 'assets/img/' + name;
    });

    setTimeout(() => { done(); resolve(); }, 12000);
  });
})();

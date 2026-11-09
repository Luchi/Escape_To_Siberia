// Масштаб: Ctrl + колесо / Ctrl + «+»/«−».
// Увеличивает всё равномерно (включая фоны), уменьшает только до 100%.
// При увеличении появляются ползунки для перемещения по экрану.
(function () {
  console.log('PENROSE build 17');
  const MIN = 1;
  const MAX = 2.5;
  const STEP = 0.1;

  const root = document.getElementById('game-root');
  const controls = document.getElementById('pan-controls');
  const sx = document.getElementById('pan-x');
  const sy = document.getElementById('pan-y');

  let zoom = 1;
  let panX = 0; // -1..1
  let panY = 0;

  function maxPan() {
    return {
      x: (zoom - 1) * window.innerWidth / 2,
      y: (zoom - 1) * window.innerHeight / 2
    };
  }

  function apply() {
    if (!root) return;
    const m = maxPan();
    const tx = panX * m.x;
    const ty = panY * m.y;
    root.style.transform = zoom === 1 ? '' : `translate(${tx}px, ${ty}px) scale(${zoom.toFixed(3)})`;
    if (controls) controls.hidden = zoom <= 1.001;
    if (sx) sx.value = String(Math.round(panX * 100));
    if (sy) sy.value = String(Math.round(panY * 100));
  }

  function change(delta) {
    const next = Math.max(MIN, Math.min(MAX, Math.round((zoom + delta) * 10) / 10));
    if (next === zoom) return;
    zoom = next;
    if (zoom === 1) { panX = 0; panY = 0; }
    // не даём панораме выйти за новые границы
    panX = Math.max(-1, Math.min(1, panX));
    panY = Math.max(-1, Math.min(1, panY));
    apply();
  }

  if (sx) sx.addEventListener('input', () => { panX = Number(sx.value) / 100; apply(); });
  if (sy) sy.addEventListener('input', () => { panY = Number(sy.value) / 100; apply(); });
  window.addEventListener('resize', apply);

  window.addEventListener('wheel', e => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    change(e.deltaY < 0 ? STEP : -STEP);
  }, { passive: false });

  window.addEventListener('keydown', e => {
    if (!e.ctrlKey) return;
    if (e.code === 'Minus' || e.code === 'NumpadSubtract' || e.key === '-' || e.key === '_') {
      e.preventDefault();
      change(-STEP);
    } else if (e.code === 'Equal' || e.code === 'NumpadAdd' || e.key === '+' || e.key === '=') {
      e.preventDefault();
      change(STEP);
    } else if (e.key === '0') {
      e.preventDefault();
      zoom = 1;
      panX = 0;
      panY = 0;
      apply();
    }
  }, true);

  apply();
})();

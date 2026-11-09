// Масштаб страницы: Ctrl + колесо / Ctrl + «+»/«−».
// Увеличивает всё равномерно (включая фоны), уменьшает только до 100%.
(function () {
  const MIN = 1;
  const MAX = 2.5;
  const STEP = 0.1;
  let zoom = 1;

  function apply() {
    document.body.style.transformOrigin = '50% 50%';
    document.body.style.transform = zoom === 1 ? '' : `scale(${zoom.toFixed(3)})`;
  }

  function change(delta) {
    const next = Math.max(MIN, Math.min(MAX, Math.round((zoom + delta) * 10) / 10));
    if (next === zoom) return;
    zoom = next;
    apply();
  }

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
      apply();
    }
  }, true);
})();

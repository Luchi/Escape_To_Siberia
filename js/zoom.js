// Масштаб страницы: приближение (Ctrl + колесо вверх) работает как обычно,
// отдаление (Ctrl + колесо вниз, Ctrl + «−») блокируем.
(function () {
  window.addEventListener('wheel', e => {
    if (!e.ctrlKey) return;
    if (e.deltaY > 0) e.preventDefault();
  }, { passive: false });

  window.addEventListener('keydown', e => {
    if (!e.ctrlKey) return;
    if (e.code === 'Minus' || e.code === 'NumpadSubtract' || e.key === '-' || e.key === '_') {
      e.preventDefault();
    }
  }, true);
})();

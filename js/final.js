(function () {
  document.getElementById('secret-word').addEventListener('click', () => {
    openModal(`<pre>Ты справился, умничка. Теперь ты дома, так что давай играть днями!</pre>`);
    state.secretFound = true;
    saveState();
  });

  // Секретная концовка: клик по глазу три раза + код PROMISE
  let eyeClicks = 0;
  let eyeTimer = null;

  document.addEventListener('click', e => {
    if (!e.target.classList || !e.target.classList.contains('dream-eye')) return;

    eyeClicks += 1;
    clearTimeout(eyeTimer);
    eyeTimer = setTimeout(() => { eyeClicks = 0; }, 2000);
    if (eyeClicks < 3) return;

    eyeClicks = 0;
    const code = prompt('ВВЕДИ КОД:');
    if (code && code.trim().toUpperCase() === 'PROMISE') {
      state.secretFound = true;
      saveState();
      showEnding('sync');
    }
  });

  // R в финале — милая реакция вместо «побега»
  sceneModules['scene-final'] = {
    onR() {
      openModal(`<pre>Ты жмёшь R.

Она смеётся:
«Побег удался. Теперь никуда не надо».

Кот Ева-Фунтик соглашается.</pre>`);
    }
  };

  // кнопка «С НАЧАЛА» в финале — без confirm, чтобы работала всегда
  window.restartFromFinal = function () {
    try {
      resetState();
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) { /* ignore */ }
    location.reload();
  };
})();

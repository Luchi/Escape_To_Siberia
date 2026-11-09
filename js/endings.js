function showEnding(id) {
  const endings = {
    canon: {
      title: 'СИБИРЬ. DUO QUEUE',
      body: 'Ты добрался. Лучи рядом. Шаурма готова.',
      onShow: () => { document.getElementById('ending-modal').hidden = true; showScene('scene-final'); }
    },
    penrose: {
      title: '',
      body: 'Помехи. Ты потерял сигнал.',
      actions: [{ label: 'С НАЧАЛА', cb: () => { document.getElementById('ending-modal').hidden = true; restartScene1(); } }]
    },
    army: {
      title: 'АРМИЯ',
      body: 'DEFEAT.\nГрустный Амуму смотрит на тебя.',
      actions: [{ label: 'ПЕРЕИГРАТЬ', cb: () => { document.getElementById('ending-modal').hidden = true; resetToScene('scene-map'); } }]
    },
    taiga: {
      title: 'ТАЙГА НАВСЕГДА',
        body: 'Ты заблудился. Из темноты выходят звери.',
        image: 'assets/img/ending-taiga.png',
        actions: [{ label: 'ПЕРЕИГРАТЬ', cb: () => { document.getElementById('ending-modal').hidden = true; showScene('scene-map'); } }]
      },
      consumed: {
        title: 'ПОГЛОТИЛИ МЫСЛИ О ЛУЧИ',
        body: 'LUCHI. СОНЯ. 25.06. PROMISE.\nТвой силуэт растворяется в буквах.',
        actions: [{ label: 'ПЕРЕИГРАТЬ', cb: () => { document.getElementById('ending-modal').hidden = true; showScene('scene-dream'); } }]
      },
      sync: {
        title: 'СИНХРОНИЗАЦИЯ 25.02',
        body: 'Два сигнала совпали.\n\nОбещание выполнено.\n\nDUO QUEUE: ОФЛАЙН. Но вы рядом.',
        actions: [{ label: 'ВЕРНУТЬСЯ', cb: () => { document.getElementById('ending-modal').hidden = true; } }]
      }
    };

  const e = endings[id];
  if (!e) return;

  // если концовка пришла из сна — остановить его таймеры
  if (state.scene === 'scene-dream' && sceneModules['scene-dream'] && sceneModules['scene-dream'].onExit) {
    sceneModules['scene-dream'].onExit();
  }

  // «Армия» — чёрный экран с DEFEAT
  if (id === 'army') {
    const screen = document.getElementById('army-screen');
    if (screen) screen.hidden = false;
    state.endingsSeen.push(id);
    saveState();
    return;
  }

  // «Тайга» — полноэкранная картинка со зверями
  if (id === 'taiga') {
    const screen = document.getElementById('taiga-screen');
    if (screen) screen.hidden = false;
    state.endingsSeen.push(id);
    saveState();
    return;
  }

  // «Синхронизация» — секретная концовка на фоне Secret_End
  if (id === 'sync') {
    const screen = document.getElementById('sync-screen');
    if (screen) screen.hidden = false;
    state.endingsSeen.push(id);
    saveState();
    return;
  }

  // «Поглотили мысли о Лучи»
  if (id === 'consumed') {
    const screen = document.getElementById('consumed-screen');
    if (screen) screen.hidden = false;
    state.endingsSeen.push(id);
    saveState();
    return;
  }

  if (e.onShow) { e.onShow(); state.endingsSeen.push(id); saveState(); return; }

  const titleEl = document.getElementById('ending-title');
  titleEl.textContent = e.title || '';
  titleEl.style.display = e.title ? '' : 'none';
  const img = e.image
    ? `<img class="scene-image" src="${e.image}" alt="" onerror="this.remove()">`
    : '';
  document.getElementById('ending-content').innerHTML = `${img}<pre>${escapeHtml(e.body)}</pre>`;
  const actions = document.getElementById('ending-actions');
  actions.innerHTML = '';
  // кнопка полного рестарта есть в любой концовке, кроме провала в сцене 1
  if (id !== 'penrose') {
    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'С НАЧАЛА';
    restartBtn.onclick = fullRestart;
    actions.appendChild(restartBtn);
  }
  (e.actions || []).forEach(a => {
    const b = document.createElement('button');
    b.textContent = a.label;
    b.onclick = a.cb;
    actions.appendChild(b);
  });
  document.getElementById('ending-modal').hidden = false;
  state.endingsSeen.push(id);
  saveState();
}

function resetToScene(id) {
  showScene(id);
}

// перезапуск первой сцены с сохранением позывного
function restartScene1() {
  state.inventory = [];
  state.selectedSlot = 0;
  state.notes = [];
  state.anchors = [];
  state.flags.batteryInstalled = false;
  state.flags.batteryFound = false;
  state.flags.calendarStep = 0;
  state.flags.safeOpened = false;
  state.flags.photoTaken = false;
  state.flags.radioTuned = false;
  state.flags.coatOn = false;
  state.flags.hatOn = false;
  saveState();
  showScene('scene-commissariat');
}

// кнопка «ПЕРЕИГРАТЬ» на экране армии
const armyRestart = document.getElementById('army-restart');
if (armyRestart) {
  armyRestart.addEventListener('click', () => {
    document.getElementById('army-screen').hidden = true;
    showScene('scene-map');
  });
}

// кнопки концовки «Тайга»
const taigaRestart = document.getElementById('taiga-restart');
if (taigaRestart) {
  taigaRestart.addEventListener('click', () => {
    document.getElementById('taiga-screen').hidden = true;
    showScene('scene-map');
  });
}
const taigaFull = document.getElementById('taiga-full');
if (taigaFull) {
  taigaFull.addEventListener('click', () => {
    document.getElementById('taiga-screen').hidden = true;
    fullRestart();
  });
}

// кнопки «Синхронизации»
const syncBack = document.getElementById('sync-back');
if (syncBack) {
  syncBack.addEventListener('click', () => {
    document.getElementById('sync-screen').hidden = true;
    if (state.scene === 'scene-dream') showScene('scene-dream');
  });
}
const syncRestart = document.getElementById('sync-restart');
if (syncRestart) {
  syncRestart.addEventListener('click', () => {
    document.getElementById('sync-screen').hidden = true;
    fullRestart();
  });
}

// кнопка «Поглотили мысли»
const consumedRestart = document.getElementById('consumed-restart');
if (consumedRestart) {
  consumedRestart.addEventListener('click', () => {
    document.getElementById('consumed-screen').hidden = true;
    showScene('scene-dream');
  });
}
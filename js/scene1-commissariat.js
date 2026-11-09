(function () {
  const SAFE_CODE = '1906';      // 19.06
  const RADIO_TARGET = 2506;     // 25.06 в сотых
  const FREQ_MIN = 0;            // 0.00
  const FREQ_MAX = 25000;        // 250.00

  // ── радио: картинка и настройка ──────────────
  function radioView() {
    const powered = state.flags.batteryInstalled;
    openModal(`
      <img class="radio-scene" src="assets/img/radio.png?v=2" alt="" onerror="this.remove()">
      <h3>РАДИО</h3>
      <p>На радио выцарапано: «Используй частоту оператора».</p>
      ${powered
        ? '<button id="radio-tune">НАСТРОИТЬ ЧАСТОТУ</button>'
        : '<p style="opacity:.6">Радио молчит.</p>'}
    `, () => {
      delete document.getElementById('modal').dataset.mode;
    });
    document.getElementById('modal').dataset.mode = 'radio';

    const btn = document.getElementById('radio-tune');
    if (btn) {
      btn.onclick = () => {
        closeModal();
        tuneRadio();
      };
    }
  }

  function tuneRadio() {
    if (state.flags.radioTuned) {
      showText('СИГНАЛ НАЙДЕН.\n\nКОД ОТ СЕЙФА: 19.06\n19.06 — первый день нашей встречи. Discord. Я написала первой.');
      return;
    }

    let freq = 10000;       // 100.00
    let interference = 0;
    let lock = 0;
    let done = false;
    let timer = null;
    let repeat = null;

    openModal(`
      <img class="radio-scene" src="assets/img/radio.png?v=2" alt="" onerror="this.remove()">
      <h3>РАДИО</h3>
      <div class="radio-row">
        <button id="freq-aa" title="Намного ниже">◀◀</button>
        <button id="freq-a" title="Ниже на 0.01">A −</button>
        <span id="freq-val">100.00</span>
        <button id="freq-d" title="Выше на 0.01">D +</button>
        <button id="freq-dd" title="Намного выше">▶▶</button>
      </div>
      <div class="meter"><div id="interf-fill" class="meter-fill"></div></div>
      <p id="radio-status">Помехи. Ничего.</p>
      <p class="radio-scratch">На радио выцарапано: «Используй частоту оператора».</p>
    `, () => {
      if (timer) clearInterval(timer);
      stopRepeat();
      document.removeEventListener('keydown', onKey);
      delete document.getElementById('modal').dataset.mode;
      if (window.radioAudio) window.radioAudio.stop();
    });
    document.getElementById('modal').dataset.mode = 'radio';

    if (window.radioAudio) window.radioAudio.start();
    addNote('Используй частоту оператора');

    const valEl = document.getElementById('freq-val');
    const fillEl = document.getElementById('interf-fill');
    const statusEl = document.getElementById('radio-status');

    function paint() {
      valEl.textContent = (freq / 100).toFixed(2);
      fillEl.style.width = `${interference}%`;
      fillEl.classList.toggle('ok', freq === RADIO_TARGET);
    }

    function step(delta) {
      if (done) return;
      freq = Math.max(FREQ_MIN, Math.min(FREQ_MAX, freq + delta));
      interference = 0;
      lock = 0;
      paint();
      statusEl.textContent = freq === RADIO_TARGET
        ? 'Это её день рождения. Держи частоту.'
        : 'Помехи. Ничего.';
      if (window.radioAudio) window.radioAudio.setTuned(freq === RADIO_TARGET);
    }

    function onKey(e) {
      if (e.code !== 'KeyA' && e.code !== 'KeyD' && e.code !== 'ArrowLeft' && e.code !== 'ArrowRight') return;
      e.preventDefault();
      const down = e.code === 'KeyA' || e.code === 'ArrowLeft';
      step(down ? -1 : 1);
    }

    function stopRepeat() {
      if (repeat) { clearInterval(repeat); repeat = null; }
    }

    // крупная ручка: удержание мотает по 1.00
    function startRepeat(sign) {
      step(sign * 100);
      stopRepeat();
      repeat = setInterval(() => step(sign * 100), 60);
    }

    const btnAA = document.getElementById('freq-aa');
    const btnA = document.getElementById('freq-a');
    const btnD = document.getElementById('freq-d');
    const btnDD = document.getElementById('freq-dd');

    btnA.addEventListener('click', () => step(-1));
    btnD.addEventListener('click', () => step(1));

    btnAA.addEventListener('pointerdown', e => { e.preventDefault(); startRepeat(-1); });
    btnDD.addEventListener('pointerdown', e => { e.preventDefault(); startRepeat(1); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => {
      btnAA.addEventListener(ev, stopRepeat);
      btnDD.addEventListener(ev, stopRepeat);
    });
    window.addEventListener('pointerup', stopRepeat);
    document.addEventListener('keyup', e => {
      if (e.code === 'KeyA' || e.code === 'KeyD') stopRepeat();
    });
    document.addEventListener('keydown', onKey);
    paint();

    timer = setInterval(() => {
      if (done) return;

      if (freq === RADIO_TARGET) {
        interference = 0;
        lock = Math.min(100, lock + 6);
        fillEl.style.width = `${lock}%`;
        statusEl.textContent = 'Сигнал ловится...';
        if (lock >= 100) {
          done = true;
          clearInterval(timer);
          setFlag('radioTuned');
          addNote('КОД ОТ СЕЙФА: 19.06');
          if (window.radioAudio) window.radioAudio.setTuned(true);
          document.getElementById('modal-content').innerHTML = `
            <h3>СИГНАЛ НАЙДЕН</h3>
            <pre>КОД ОТ СЕЙФА: 19.06

19.06 — первый день нашей встречи.
Discord. Я написала первой.</pre>`;
        }
      } else {
        lock = 0;
        interference = Math.min(100, interference + 2);
        fillEl.style.width = `${interference}%`;
        if (interference >= 100) {
          done = true;
          clearInterval(timer);
          closeModal();
          triggerFail();
          showEnding('penrose');
        }
      }
    }, 100);
  }

  function openSafe() {
    const html = `
      <h3>СЕЙФ</h3>
      <p>Четыре цифры:</p>
      <div class="safe-row">
        <input id="safe-code" maxlength="4" placeholder="0000">
        <button id="safe-open">ОТКРЫТЬ</button>
      </div>
    `;
    openModal(html);
    const win = document.querySelector('#modal .modal-window');
    if (win) win.style.minWidth = '420px';
    document.getElementById('safe-open').addEventListener('click', () => {
      const v = document.getElementById('safe-code').value;
      if (v === SAFE_CODE) {
        closeModal();
        setFlag('safeOpened');
        showPickupQueue(['coat', 'hat', 'shaurma', 'dino']);
      } else {
        document.getElementById('safe-code').value = '';
        document.getElementById('safe-code').placeholder = 'Не подходит...';
      }
    });
  }

  function triggerFail() {
    state.failCount = (state.failCount || 0) + 1;
    saveState();

    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 400);

    if (state.failCount === 1) {
      document.getElementById('wall-hint').hidden = false;
      addNote('День рождения Лучи — 25.06');
    } else if (state.failCount >= 2) {
      setFlag('scrapFound');
      addNote('Обрывок записки: «25.06»');
      document.getElementById('wall-hint').hidden = false;
    }
  }

  sceneModules['scene-commissariat'] = {
    onEnter() {
      // выбор слота не сбрасываем: игрок мог уже выбрать предмет
      if (!state.selectedSlot && state.inventory.length) state.selectedSlot = 1;
      saveState();
      renderInventory();

      // если фото уже забрано — стена без него
      const room = document.querySelector('#scene-commissariat .room');
      if (room) room.classList.toggle('no-photo', !!state.flags.photoTaken);

      if (state.failCount >= 1) document.getElementById('wall-hint').hidden = false;

      document.querySelectorAll('#scene-commissariat .hotspot').forEach(el => {
        el.onclick = () => handleHotspot(el.dataset.id);
      });
    },

    onUse(item) {
      if (item.id === 'battery') {
        if (state.flags.batteryInstalled) {
          showText('Батарейка уже вставлена.');
          return true;
        }
        if (!state.flags.batteryFound) {
          showText('Сначала найди батарейку — она в календаре.');
          return true;
        }
        const modal = document.getElementById('modal');
        if (!modal || modal.hidden === true || !modal.dataset || modal.dataset.mode !== 'radio') {
          showText('Здесь вставлять некуда.');
          return true;
        }
        setFlag('batteryInstalled');
        removeItem('battery');
        closeModal();
        tuneRadio();
        return true;
      }
      if (item.id === 'coat') {
        if (state.flags.coatOn) {
          showText('Ватник уже надет. Снять его — слишком холодно.');
          return true;
        }
        setFlag('coatOn');
        checkWindowReady();
        showText('Ты надеваешь ватник. Он пахнет чужим домом, но греет.\nСнизу — чуть-чуть розовой краски.');
        renderInventory();
        return true;
      }
      if (item.id === 'hat') {
        if (state.flags.hatOn) {
          showText('Ушанка уже надета. Снять её — слишком холодно.');
          return true;
        }
        setFlag('hatOn');
        checkWindowReady();
        showText('Ты надеваешь ушанку. Мир становится тише.');
        renderInventory();
        return true;
      }
      return false;
    },

    onQ() {
      // рывок через окно
      if (state.flags.windowReady) {
        showText('Рывок! Ты выпрыгиваешь в ночь.', () => showScene('scene-station'));
      } else if (state.flags.coatOn || state.flags.hatOn) {
        showText('Половина подготовки есть. Нужны и ватник, и шапка.');
      } else {
        showText('Сначала подготовься: открой сейф, надень ватник и шапку.');
      }
    },

    onR() {
      if (state.flags.windowReady) {
        showText('Ты уходишь через окно, не оглядываясь.', () => showScene('scene-station'));
      } else {
        showText('Дверь. Сторож следит, не пройти.');
      }
    }
  };

  function checkWindowReady() {
    if (state.flags.coatOn && state.flags.hatOn) setFlag('windowReady');
  }

  function handleHotspot(id) {
    switch (id) {
      case 'notice':
        showText('«Влад «Юзиро». Дата: 14.02. Штамп: HÄHER. Приписка: “Не задерживайся”».\n\nПочерк — её.'
          + (state.flags.scrapFound ? '\n\nПод повесткой — обрывок: «25.06».' : ''));
        addNote('«Не задерживайся»');
        break;

      case 'calendar':
        if (state.flags.calendarStep === 0) {
          state.flags.calendarStep = 1;
          saveState();
          showViewer(
            'assets/img/calendar-november.png',
            '9 ноября обведено котиком. За календарём, между страницами, что-то есть...',
            'Календарь, ноябрь',
            '9 ноября обведено котиком. Между страницами что-то есть...'
          );
        } else if (state.flags.calendarStep === 1) {
          state.flags.calendarStep = 2;
          saveState();
          showViewer(
            'assets/img/calendar-february.png',
            '14 февраля обведено сердечком. Между страницами всё ещё что-то есть.',
            'Календарь, февраль',
            '14 февраля обведено сердечком. Между страницами всё ещё что-то есть.'
          );
        } else if (!state.flags.batteryFound) {
          setFlag('batteryFound');
          showPickup('battery');
        } else {
          showText('Календарь. 9 ноября — котик. 14 февраля — сердечко.' + (state.failCount >= 1 ? ' 25.06 обведено рукой.' : ''));
        }
        break;

      case 'radio':
        radioView();
        break;

      case 'safe':
        if (state.flags.safeOpened) {
          showText('Сейф пуст.');
        } else {
          openSafe();
        }
        break;

      case 'window':
        if (state.flags.windowReady) {
          showText('За окном — луна и снег.\n\nМожно прыгать. Нажми Q.');
        } else if (state.flags.coatOn || state.flags.hatOn) {
          showText('За окном — луна и снег.\n\nНадета только половина. Нужны и ватник, и шапка.');
        } else {
          showText('За окном — луна и снег.\n\nВысоко. Без подготовки не спрыгнуть. Нужен ватник и шапка.');
        }
        break;

      case 'door':
        showText('Сторож следит, не пройти.');
        break;

      case 'mirror':
        setFlag('mirrorSeen');
        showViewer(
          'assets/img/mirror-eye.png',
          'В отражении — окно. За окном — зелёно-жёлтый глаз. Он смотрит прямо на тебя.',
          'Зеркало',
          'В отражении — окно. За окном — зелёно-жёлтый глаз. Он смотрит прямо на тебя.'
        );
        break;

      case 'photo':
        if (state.flags.photoTaken) {
          showViewer(
            'assets/img/Photo.png',
            'Гештальт Соня Luchi. Оператор. Частота не указана. Но ты её знаешь.',
            'Фотография Сони'
          );
        } else {
          showPickup('photo', () => {
            setFlag('photoTaken');
            const room = document.querySelector('#scene-commissariat .room');
            if (room) room.classList.add('no-photo');
          }, 'assets/img/Photo.png');
        }
        break;
    }
  }
})();
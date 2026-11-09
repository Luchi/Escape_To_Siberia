const ITEM_DEFS = {
  battery:  { name: 'Батарейка', short: 'Батарейка', icon: '🔋', iconSrc: 'assets/img/icon-battery.png', desc: 'Холодная.' },
  coat:     { name: 'Ватник', short: 'Ватник', icon: '🧥', iconSrc: 'assets/img/icon-coat.png', desc: 'Советский ватник. Снизу чуть-чуть испачкано розовой краской.' },
  hat:      { name: 'Шапка-ушанка', short: 'Ушанка', icon: '🎩', iconSrc: 'assets/img/hat.png', desc: 'В ней не слышно, как зовут в армию.' },
  shaurma:  { name: 'Шаурма «Тайга»', short: 'Шаурма', icon: '🌯', iconSrc: 'assets/img/shawarma.png', desc: 'Восстанавливает веру в людей.' },
  dino:     { name: 'Дейнозух-брелок', short: 'Брелок', icon: '🦖', iconSrc: 'assets/img/icon-dino.png', desc: '' },
  photo:    { name: 'Фотография Сони', short: 'Фото', icon: '🖼️', iconSrc: 'assets/img/Photo.png', desc: 'Гештальт Соня Luchi. Оператор. Частота не указана. Но ты её знаешь.' },
  catLight: { name: 'Кот-фонарик Ева-Фунтик', short: 'Кот', icon: '🐈', iconSrc: 'assets/img/icon-catlight.png', desc: 'Внутри что-то особенное. Тёплое.\nНа ошейнике выцарапано: «Я тебя люблю».' }
};

const INVENTORY_SIZE = 6;

function hasItem(id) {
  return state.inventory.some(i => i.id === id);
}

function addItem(id) {
  if (!ITEM_DEFS[id]) return false;
  if (hasItem(id)) return false;
  if (state.inventory.length >= INVENTORY_SIZE) {
    showText('Инвентарь полон. Больше не унести.');
    return false;
  }
  state.inventory.push({ id, ...ITEM_DEFS[id] });
  // подобранный предмет не выбирается автоматически
  state.selectedSlot = 0;
  saveState();
  renderInventory();
  return true;
}

function removeItem(id) {
  const idx = state.inventory.findIndex(i => i.id === id);
  if (idx < 0) return;
  state.inventory.splice(idx, 1);
  if (state.selectedSlot > state.inventory.length) state.selectedSlot = 0;
  saveState();
  renderInventory();
}

// ── Отрисовка панели ─────────────────────────
function renderInventory() {
  const inv = document.getElementById('inventory');
  if (!inv) return;
  inv.innerHTML = '';

  for (let i = 0; i < INVENTORY_SIZE; i++) {
    const item = state.inventory[i];
    const slot = document.createElement('div');
    slot.className = 'slot' + (state.selectedSlot === i + 1 ? ' selected' : '') + (isWorn(item) ? ' worn' : '');
    slot.dataset.index = String(i);
    slot.title = item ? `${item.name} — ${item.desc}` : 'Пусто';

    const iconHtml = item
      ? (item.iconSrc
          ? `<img class="ico-img" src="${item.iconSrc}" alt="" onerror="this.remove()"><em class="ico-emoji">${item.icon}</em>`
          : `<em class="ico-emoji">${item.icon}</em>`)
      : '';

    slot.innerHTML =
      `<span class="key">${i + 1}</span>` +
      (item ? `<span class="ico">${iconHtml}</span>` : '');

    // Слот выбирается с клавиатуры (1–6). Мышь не выбирает,
    // но на тач-экранах тап — единственный способ.
    slot.addEventListener('pointerup', e => {
      if (e.pointerType === 'touch' || e.pointerType === 'pen') clickSlot(i);
    });
    slot.addEventListener('contextmenu', e => e.preventDefault());
    slot.addEventListener('mouseenter', () => { if (item) showTip(slot, item); });
    slot.addEventListener('mouseleave', hideTip);

    inv.appendChild(slot);
  }
}

function isWorn(item) {
  if (!item) return false;
  if (item.id === 'coat') return !!state.flags.coatOn;
  if (item.id === 'hat') return !!state.flags.hatOn;
  return false;
}

// Слоты выбираются только цифрами 1–6. Мышь в инвентаре не работает.
function clickSlot(i) {
  state.selectedSlot = state.selectedSlot === i + 1 ? 0 : i + 1;
  saveState();
  renderInventory();
}

// ── Действия с предметами ────────────────────
function useItem(item) {
  if (!item) return;

  // надетые вещи не снимаем — иначе замёрзнет
  if (item.id === 'coat' && state.flags.coatOn) {
    showText('Ватник уже надет. Снимать не надо — замерзнешь.');
    return;
  }
  if (item.id === 'hat' && state.flags.hatOn) {
    showText('Ушанка уже надета. Снимать не надо — замерзнешь.');
    return;
  }

  const mod = sceneModules[state.scene];
  if (mod && typeof mod.onUse === 'function' && mod.onUse(item) === true) return;

  if (item.id === 'shaurma') {
    showText('Ты надкусываешь шаурму «Тайга».\nГорячая. Мир становится чуть добрее.');
    return;
  }
  if (item.id === 'dino') {
    showText('Ты сжимаешь дейнозуха в кулаке.\nСмелости прибавилось — как в детстве.');
    return;
  }
  if (item.id === 'catLight') {
    showText('Кот-фонарик мигает зелёными глазами.\nОн светит, но здесь светить некуда.');
    return;
  }
  showText(`${item.name}: сейчас это не пригодится.`);
}

function examineItem(item) {
  if (!item) return;
  // осмотр снимает выбор со слота
  state.selectedSlot = 0;
  saveState();
  renderInventory();

  const def = ITEM_DEFS[item.id] || {};
  const src = def.iconSrc || item.iconSrc;
  const caption = `${item.name}\n\n${item.desc || ''}`.trim();
  if (src) {
    showViewer(src, '', item.name, caption);
    const img = document.getElementById('viewer-img');
    if (img && item.id !== 'photo') {
      img.style.maxHeight = '42vh';
      img.style.maxWidth = '42vw';
    }
    return;
  }
  showText(`${item.name}\n\n${item.desc}`);
}

function useSelected() {
  ensureSelection();
  const item = state.inventory[state.selectedSlot - 1];
  if (!item) { showText('Слот пуст. Выбери предмет цифрами 1–6.'); return; }
  useItem(item);
  // после использования фокус с предмета снимается
  state.selectedSlot = 0;
  saveState();
  renderInventory();
}

function examineSelected() {
  ensureSelection();
  const item = state.inventory[state.selectedSlot - 1];
  if (!item) { showText('Слот пуст. Выбери предмет цифрами 1–6.'); return; }
  examineItem(item);
  // после осмотра фокус снимается
  state.selectedSlot = 0;
  saveState();
  renderInventory();
}

// ── Подсказка при наведении ──────────────────
let tipEl = null;

function ensureTipEl() {
  if (!tipEl) {
    tipEl = document.createElement('div');
    tipEl.className = 'item-tip';
    tipEl.hidden = true;
    document.body.appendChild(tipEl);
  }
  return tipEl;
}

function showTip(slot, item) {
  const tip = ensureTipEl();
  tip.innerHTML =
    `<b>${item.name}</b>` +
    `<span>${item.desc}</span>` +
    `<i>1–6 — выбрать · W — использовать · E — осмотреть</i>`;
  tip.hidden = false;

  const r = slot.getBoundingClientRect();
  const tw = tip.offsetWidth;
  const th = tip.offsetHeight;
  let left = r.left + r.width / 2 - tw / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
  let top = r.top - th - 10;
  if (top < 8) top = r.bottom + 10;
  tip.style.left = `${left}px`;
  tip.style.top = `${top}px`;
}

function hideTip() {
  if (tipEl) tipEl.hidden = true;
}

// ── Клавиатура и кнопки HUD ──────────────────
function isTyping(e) {
  const t = e.target;
  return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
}

function ensureSelection() {
  // ничего не выбираем автоматически: после использования фокус снят
}

document.addEventListener('keydown', e => {
  if (isTyping(e)) return;

  const hudHidden = document.getElementById('hud') && document.getElementById('hud').hidden;

  // цифры работают в любой раскладке (e.code не зависит от языка)
  const digit = /^Digit([1-6])$/.exec(e.code || '');
  if (digit) {
    if (hudHidden) return;
    clickSlot(Number(digit[1]) - 1);
    return;
  }

  const modal = document.getElementById('modal');
  const modalOpen = modal && modal.hidden === false;
  const radioOpen = modalOpen && modal.dataset && modal.dataset.mode === 'radio';
  if (modalOpen && !radioOpen) return;

  // пока открыто радио, любые действия кроме вставки батарейки игнорируем
  if (radioOpen) {
    const sel = state.inventory[state.selectedSlot - 1];
    if (!(e.code === 'KeyW' && sel && sel.id === 'battery')) return;
  }

  if (hudHidden) return;

  // e.code — чтобы работало и на русской раскладке
  if (e.code === 'KeyW') useSelected();
  if (e.code === 'KeyE') examineSelected();
  if (e.code === 'KeyQ' && sceneModules[state.scene]?.onQ) sceneModules[state.scene].onQ();
  if (e.code === 'KeyR' && sceneModules[state.scene]?.onR) sceneModules[state.scene].onR();
});

document.querySelectorAll('#skills [data-skill]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (document.getElementById('hud').hidden) return;
    const k = btn.dataset.skill;
    const modal = document.getElementById('modal');
    if (modal && modal.hidden === false && modal.dataset.mode === 'radio') {
      const sel = state.inventory[state.selectedSlot - 1];
      if (!(k === 'W' && sel && sel.id === 'battery')) return;
    }
    if (k === 'W') return useSelected();
    if (k === 'E') return examineSelected();
    if (k === 'Q') { const m = sceneModules[state.scene]; if (m && m.onQ) m.onQ(); return; }
    if (k === 'R') { const m = sceneModules[state.scene]; if (m && m.onR) m.onR(); return; }
  });
});

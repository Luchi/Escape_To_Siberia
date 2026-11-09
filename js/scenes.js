const scenes = ['scene-boot','scene-commissariat','scene-station','scene-dream','scene-map','scene-final'];
const sceneModules = {}; // заполняется из scene-модулей

function showScene(id) {
  const prevId = state.scene;
  document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('active');

  if (prevId && prevId !== id && sceneModules[prevId] && sceneModules[prevId].onExit) {
    sceneModules[prevId].onExit();
  }

  state.scene = id;
  saveState();

  // Показать HUD везде, кроме boot
  const hideHud = (id === 'scene-boot' || id === 'scene-final' || id === 'scene-dream');
  document.getElementById('hud').hidden = hideHud;
  const avatarLayer = document.getElementById('avatar-layer');
  if (avatarLayer) avatarLayer.hidden = hideHud;

  if (window.ambientWind && id !== 'scene-map') window.ambientWind(false);

  // вызвать onEnter если есть
  if (sceneModules[id] && sceneModules[id].onEnter) sceneModules[id].onEnter();

  syncHudHeight();
}

// нижние элементы сцен не должны прятаться под HUD
function syncHudHeight() {
  const hud = document.getElementById('hud');
  const root = document.documentElement;
  if (!hud || !root || !root.style) return;
  const rect = hud.getBoundingClientRect ? hud.getBoundingClientRect() : null;
  const h = (rect && rect.height) || 0;
  root.style.setProperty('--hud-h', `${Math.round(h || 90)}px`);
}

function showText(text, cb) {
  openModal(`<pre>${escapeHtml(text)}</pre>`, cb);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

// Модал
function openModal(html, onClose) {
  const m = document.getElementById('modal');
  document.getElementById('modal-content').innerHTML = html;
  m.hidden = false;
  m._onClose = onClose;
}
function closeModal() {
  const m = document.getElementById('modal');
  m.hidden = true;
  if (m._onClose) { const cb = m._onClose; m._onClose = null; cb(); }
}

function showViewer(src, fallback = '', alt = '', caption = '') {
  const v = document.getElementById('viewer');
  const img = document.getElementById('viewer-img');
  const cap = document.getElementById('viewer-caption');
  if (!v || !img) { if (fallback) showText(fallback); return; }
  img.alt = alt;
  img.style.maxHeight = '';
  img.style.maxWidth = '';
  img.onerror = () => {
    v.hidden = true;
    if (fallback) showText(fallback);
  };
  if (cap) cap.textContent = caption;
  img.src = src;
  v.hidden = false;
}

function hideViewer() {
  const v = document.getElementById('viewer');
  if (v) v.hidden = true;
}

// ── карточка найденного предмета ──────────────
let pickupQueue = [];

function showPickup(id, onTaken, image) {
  const def = ITEM_DEFS[id];
  if (!def) { if (onTaken) onTaken(); return; }

  const box = document.getElementById('pickup');
  const img = document.getElementById('pickup-img');
  const name = document.getElementById('pickup-name');
  const desc = document.getElementById('pickup-desc');
  const take = document.getElementById('pickup-take');

  img.style.display = '';
  img.onerror = () => { img.style.display = 'none'; };
  img.src = image || def.iconSrc;
  name.textContent = def.name;
  desc.textContent = def.desc || '';

  take.onclick = () => {
    if (!state.inventory.some(i => i.id === id) && !addItem(id)) return;
    box.hidden = true;
    if (onTaken) onTaken();
  };

  box.hidden = false;
}

function showPickupQueue(ids) {
  pickupQueue = ids.slice();
  nextPickup();
}

function nextPickup() {
  const id = pickupQueue.shift();
  if (!id) return;
  showPickup(id, nextPickup);
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('viewer-close').addEventListener('click', hideViewer);
document.getElementById('viewer').addEventListener('click', e => {
  if (e.target.id === 'viewer') hideViewer();
});
document.addEventListener('keydown', e => {
  if (e.code !== 'Escape') return;
  const v = document.getElementById('viewer');
  if (v && !v.hidden) hideViewer();
});

// Инициализация — запуск
window.addEventListener('load', () => {
  if (state.scene && state.scene !== 'boot' && document.getElementById(state.scene)) {
    showScene(state.scene);
  } else {
    showScene('scene-boot');
  }
  renderInventory();
  renderNotes();
  syncHudHeight();
});

window.addEventListener('resize', syncHudHeight);

// ── Рестарт ─────────────────────────────────
function fullRestart() {
  if (!confirm('Начать с самого начала?\nВесь прогресс, инвентарь и найденные записи будут сброшены.')) return;
  resetState();
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

document.getElementById('restart-btn').addEventListener('click', fullRestart);
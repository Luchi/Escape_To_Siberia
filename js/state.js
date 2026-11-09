const STORAGE_KEY = 'penrose77';

const defaultState = {
  objectName: '',
  scene: 'boot',
  inventory: [],     // [{ id, name, icon }]
  selectedSlot: 0,   // 0 = нет
  flags: {
    calendarChecked: false,
    calendarStep: 0,
    photoTaken: false,
    batteryFound: false,
    batteryInstalled: false,
    radioTuned: false,
    safeOpened: false,
    windowReady: false,
    dossierRead: false,
    photoSeen: false,
    mirrorSeen: false,
    coatOn: false,
    hatOn: false,
    mapStep: 0
  },
  failCount: 0,
  anchors: [],
  notes: [],
  endingsSeen: [],
  secretFound: false
};

let state = loadState() || structuredClone(defaultState);

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function resetState() {
  state = structuredClone(defaultState);
  saveState();
}

function setFlag(key, value = true) {
  state.flags[key] = value;
  saveState();
}
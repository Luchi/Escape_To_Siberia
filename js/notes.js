function addNote(text) {
  if (!text) return;
  if (state.notes.includes(text)) return;
  state.notes.push(text);
  saveState();
  renderNotes();
}

function renderNotes() {
  const list = document.getElementById('notes-list');
  if (!list) return;
  list.innerHTML = state.notes.length
    ? state.notes.map(n => `<li>${escapeHtml(n)}</li>`).join('')
    : '<li><i>Пока пусто.</i></li>';
}

document.getElementById('notes-btn').addEventListener('click', () => {
  document.getElementById('notes-modal').hidden = false;
});
document.getElementById('notes-close').addEventListener('click', () => {
  document.getElementById('notes-modal').hidden = true;
});
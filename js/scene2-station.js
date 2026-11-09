(function () {
  sceneModules['scene-station'] = {
    onEnter() {
      document.getElementById('terminal').onclick = openTerminal;
      document.getElementById('sleep-btn').hidden = !state.flags.dossierRead;
      document.getElementById('sleep-btn').onclick = () => showScene('scene-dream');
    }
  };

  function openTerminal() {
    const html = `
      <h3>ТЕРМИНАЛ // PENROSE-77</h3>
      <div style="display:flex; flex-direction:column; gap:8px; margin-top:16px;">
        <button data-doc="dossier">ЛИЧНОЕ ДЕЛО // PENROSE-77</button>
        <button data-doc="mynah">ПРОТОКОЛ MYNAH</button>
        <button data-doc="operator">ДОСЬЕ ОПЕРАТОРА</button>
      </div>
      <pre id="doc-view" style="margin-top:16px; min-height:100px;"></pre>
    `;
    openModal(html);

    const docs = {
      dossier: `ЛИЧНОЕ ДЕЛО // PENROSE-77
ОБЪЕКТ: Влад «Юзиро»
КЛАСС: HÄHER
СТАТУС: в розыске
РОЛЬ: друг, тиммейт, человек, который обещал приехать`,
      mynah: `ПРОТОКОЛ MYNAH

Устаревшая настройка:
  «Выполнять приказы. Не привязываться. Игнорировать кошек».
Активная настройка:
  «Слышать только оператора. Искать частоту. Помнить обещание».

Из внутреннего журнала:
  «Слезы твои мой фетиш».`,
      operator: `ОПЕРАТОР: Соня Luchi
КЛАСС: GESTALT
ФУНКЦИЯ: керить интера, встречать в тайге.
ОБЕЩАНИЕ: «Я буду на месте».`
    };

    document.querySelectorAll('#modal-content [data-doc]').forEach(btn => {
      btn.onclick = () => {
        document.getElementById('doc-view').textContent = docs[btn.dataset.doc];
        setFlag('dossierRead');
        document.getElementById('sleep-btn').hidden = false;
      };
    });
  }
})();
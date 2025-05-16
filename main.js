let allData = [];

function addRow(obs) {
  const tbody = document.querySelector('#tab tbody');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${obs.NOM_SC}</td>
    <td>${obs.NOM_FR}</td>
    <td>${obs.COMMUNE}</td>
    <td>${obs.CODE_INSEE}</td>
    <td>${obs.DATE_OBS}</td>
  `;
  tbody.appendChild(row);
}

function renderTable(data) {
  const tbody = document.querySelector('#tab tbody');
  tbody.innerHTML = '';
  data.forEach(obs => addRow(obs));
}

function completeTab() {
  allData = [...faune, ...flore];
  renderTable(allData);
}

function searchWithForm(event) {
  event.preventDefault(); // empêche le rechargement

  const inputValue = event.target.q.value.trim().toLowerCase();

  const filtered = allData.filter(obs =>
    obs.NOM_FR.toLowerCase().includes(inputValue)
  );

  renderTable(filtered);
}

function main() {
  completeTab();

  const form = document.getElementById('searchForm');
  if (form) {
    form.addEventListener('submit', searchWithForm);
  }
}

main();

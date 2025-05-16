let allData = [];
let filteredData = [];

// Crée une ligne HTML pour une observation
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

// Affiche toutes les données dans le tableau
function completeTab() {
  allData = [...faune, ...flore];
  renderTable(allData);
}

// Affiche un tableau avec un tableau donné
function renderTable(data) {
  const tbody = document.querySelector('#tab tbody');
  tbody.innerHTML = '';
  data.forEach(obs => addRow(obs));
}

// Crée un menu déroulant de filtres
function createDropdown(values, key, thElement, filterFn = (a, b) => a === b) {
  const existing = document.querySelector(".dropdown");
  if (existing) existing.remove();

  const dropdown = document.createElement("div");
  dropdown.className = "dropdown";

  const rect = thElement.getBoundingClientRect();
  dropdown.style.left = rect.left + "px";
  dropdown.style.top = (rect.bottom + window.scrollY) + "px";

  const allOption = document.createElement("div");
  allOption.textContent = "Tout afficher";
  allOption.className = "dropdown-item";
  allOption.onclick = () => {
    renderTable(allData);
    dropdown.remove();
  };
  dropdown.appendChild(allOption);

  values.forEach(value => {
    const option = document.createElement("div");
    option.textContent = value;
    option.className = "dropdown-item";
    option.onclick = () => {
      const filtered = allData.filter(item => filterFn(item[key], value));
      renderTable(filtered);
      dropdown.remove();
    };
    dropdown.appendChild(option);
  });

  document.body.appendChild(dropdown);
}

function searchWithForm(event) {
  event.preventDefault(); // empêche le rechargement

  const inputValue = event.target.q.value.trim().toLowerCase();

  const filtered = allData.filter(obs =>
    obs.NOM_FR.toLowerCase().includes(inputValue)
  );

  renderTable(filtered);
}

// Active les filtres sur les colonnes du tableau
function enableFiltering() {
  const ths = document.querySelectorAll("#tab thead th");

  // Ajoute les flèches ▼
  ths[2].innerHTML += ' <span class="filter-icon">▼</span>';
  ths[4].innerHTML += ' <span class="filter-icon">▼</span>';

  // Filtre Commune
  ths[2].style.cursor = "pointer";
  ths[2].addEventListener("click", () => {
    const communes = [...new Set(allData.map(d => d.COMMUNE))].sort();
    createDropdown(communes, "COMMUNE", ths[2]);
  });

  // Filtre par année d'observation
  ths[4].style.cursor = "pointer";
  ths[4].addEventListener("click", () => {
    const years = [...new Set(allData.map(d => d.DATE_OBS?.slice(0, 4)))].sort();
    createDropdown(years, "DATE_OBS", ths[4], (fullDate, year) => fullDate.startsWith(year));
  });
}

// Ferme le menu dropdown si clic en dehors
document.addEventListener("click", function (event) {
  const dropdown = document.querySelector(".dropdown");
  if (dropdown) {
    const isClickInsideDropdown = dropdown.contains(event.target);
    const isClickOnHeader = event.target.closest("th");
    if (!isClickInsideDropdown && !isClickOnHeader) {
      dropdown.remove();
    }
  }
});

// Fonction principale
function main() {
  allData = [...faune, ...flore];
  completeTab();
  enableFiltering();

  const form = document.getElementById('searchForm');
  if (form) {
    form.addEventListener('submit', searchWithForm); // 🔧 à implémenter !
  }
}

main();

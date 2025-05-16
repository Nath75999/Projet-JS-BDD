let allData = [];
let filteredData = [];
let activeFilters = {}; //stocke filtres actifs

//cree une ligne HTML pour une observation
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

function applyFilters() {
    filteredData = allData.filter(item => {
        // Teste chaque filtre actif
        return Object.entries(activeFilters).every(([key, filter]) => {
            if (key === "DATE_OBS") {
                return item[key]?.startsWith(filter); // filtre par année
            } else {
                return item[key] === filter;
            }
        });
    });
    renderTable(filteredData);
}

//affiche toutes les donnees dans le tab
function completeTab() {
    allData = [...faune, ...flore];
    renderTable(allData);
}

//affiche un tab avec un tab donné
function renderTable(data) {
    const tbody = document.querySelector('#tab tbody');
    tbody.innerHTML = '';
    data.forEach(obs => addRow(obs));
}

//cree un menu deroulant de filtres
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
        delete activeFilters[key]; //supprime le filtre courant
        applyFilters();
        dropdown.remove();
    };
    dropdown.appendChild(allOption);

    values.forEach(value => {
        const option = document.createElement("div");
        option.textContent = value;
        option.className = "dropdown-item";
        option.onclick = () => {
            activeFilters[key] = value; //ajoute ou remplace le filtre
            applyFilters();
            dropdown.remove();
        };
        dropdown.appendChild(option);
    });

    document.body.appendChild(dropdown);
}

function searchWithForm(event) {
    event.preventDefault(); //empeche le rechargement

    const inputValue = event.target.q.value.trim().toLowerCase();

    const filtered = allData.filter(obs =>
        obs.NOM_FR.toLowerCase().includes(inputValue)
    );

    renderTable(filtered);
}

//active les filtres sur les colonnes du tab
function enableFiltering() {
    const ths = document.querySelectorAll("#tab thead th");

    ths[2].innerHTML += ' <span class="filter-icon">▼</span>';
    ths[4].innerHTML += ' <span class="filter-icon">▼</span>';

    //filtre pour commune
    ths[2].style.cursor = "pointer";
    ths[2].addEventListener("click", () => {
        const communes = [...new Set(allData.map(d => d.COMMUNE))].sort();
        createDropdown(communes, "COMMUNE", ths[2]);
    });

    //filtre par année d'observation
    ths[4].style.cursor = "pointer";
    ths[4].addEventListener("click", () => {
        const years = [...new Set(allData.map(d => d.DATE_OBS?.slice(0, 4)))].sort();
        createDropdown(years, "DATE_OBS", ths[4], (fullDate, year) => fullDate.startsWith(year));
    });
}

//ferme menu si clic en dehors
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

//fonction principale
function main() {
    allData = [...faune, ...flore];
    completeTab();
    enableFiltering();

    const form = document.getElementById('searchForm');
    if (form) {
        form.addEventListener('submit', searchWithForm);
    }
}


//maj de la recherche en preanant en compte les filtres déjà entrés
function searchWithForm(event) {
    event.preventDefault(); //empeche la page de se recharger

    const inputValue = event.target.q.value.trim().toLowerCase();

    //on filtre d'abord avec les filtres actifs
    const filtered = allData.filter(obs => {
        //filtres actifs
        const matchesFilters = Object.entries(activeFilters).every(([key, filter]) => {
            if (key === "DATE_OBS") {
                return obs[key]?.startsWith(filter);
            } else {
                return obs[key] === filter;
            }
        });

        //regarder si les filtres correspondent aussi à la recherche
        return matchesFilters && obs.NOM_FR.toLowerCase().includes(inputValue);
    });

    renderTable(filtered);
}

//fonction pour appliquer les filtres après chaque changement de recherche par exemple
function applyFilters() {
    filteredData = allData.filter(item => {
        return Object.entries(activeFilters).every(([key, filter]) => {
            if (key === "DATE_OBS") {
                return item[key]?.startsWith(filter);
            } else {
                return item[key] === filter;
            }
        });
    });

    renderTable(filteredData);
}

main();
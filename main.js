let allData = [];          
let activeFilters = {};
let searchQuery = "";       //champ de recherche

function addRow(obs){
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

function renderTable(data){
    const tbody = document.querySelector('#tab tbody');
    tbody.innerHTML = '';
    data.forEach(obs => addRow(obs));
}

function applyFilters(){
    const filteredData = allData.filter(obs => {
        // Vérifie chaque filtre actif
        const matchesFilters = Object.entries(activeFilters).every(([key, value]) => { //pour tout les elem du tab
            if (key === "DATE_OBS"){ //si bon filtre
                return obs[key] && obs[key].startsWith(value); //si ca existe et que ca passe dans le filtre
            }
            return obs[key] === value;
        });

        //verif pour recherche texte
        const matchesSearch = obs.NOM_FR.toLowerCase().includes(searchQuery);

        return matchesFilters && matchesSearch;//on applique les deux filtres
    });

    renderTable(filteredData);
}

function loadAllData() {
    allData = [...faune, ...flore];  //fusionne les deux tab en 1
    renderTable(allData);
}

function createDropdown(options, key, thElement) {
    const existing = document.querySelector(".dropdown");
    if (existing) existing.remove();

    const dropdown = document.createElement("div");
    dropdown.className = "dropdown";

    const rect = thElement.getBoundingClientRect(); //pos header
    dropdown.style.left = rect.left + "px";
    dropdown.style.top = (rect.bottom + window.scrollY) + "px";

    const showAllOption = document.createElement("div");
    showAllOption.textContent = "Tout afficher";
    showAllOption.className = "dropdown-item";
    showAllOption.onclick = () => {
        delete activeFilters[key];  //retire filtre
        applyFilters();
        dropdown.remove();
    };
    dropdown.appendChild(showAllOption);

    options.forEach(value => {
        const item = document.createElement("div");
        item.textContent = value;
        item.className = "dropdown-item";
        item.onclick = () => {
            activeFilters[key] = value;  //nouveau filtrage
            applyFilters();
            dropdown.remove();
        };
        dropdown.appendChild(item);
    });

    document.body.appendChild(dropdown);
}

function enableFiltering() {
    const headers = document.querySelectorAll("#tab thead th");

    headers[2].innerHTML += ' <span class="filter-icon">▼</span>'; //pour les communes
    headers[4].innerHTML += ' <span class="filter-icon">▼</span>'; //pour les dates

    headers[2].style.cursor = "pointer";
    headers[2].addEventListener("click", () => {
        const communes = [...new Set(allData.map(d => d.COMMUNE))].sort(); //val triees
        createDropdown(communes, "COMMUNE", headers[2]);
    });

    headers[4].style.cursor = "pointer";
    headers[4].addEventListener("click", () => {
        let allYears = allData.map(d => { //on prend les années
            if (d.DATE_OBS){ //si c'est celle demandée
                return d.DATE_OBS.slice(0, 4); // retourne l'année
            }
            return null; //si pas bon, rien a retourner
        });

        allYears = allYears.filter(year => year !== null); //on retire les dates à NULL (inutiles)

        const uniqueYears = [...new Set(allYears)]; //on enleve les doubles
        uniqueYears.sort(); //tri dans l'ordre croissant

        createDropdown(uniqueYears, "DATE_OBS", headers[4]);
    });
}

function handleSearch(event) {
    event.preventDefault(); //empeche reload page

    const input = event.target.q.value.trim().toLowerCase(); //res recherche
    searchQuery = input; //maj res recherche
    applyFilters();
}

document.addEventListener("click", function (event) {
    const dropdown = document.querySelector(".dropdown");
    if (dropdown) {
        const clickedInside = dropdown.contains(event.target);
        const clickedOnHeader = event.target.closest("th");
        if (!clickedInside && !clickedOnHeader) {
            dropdown.remove(); //ferme le menu si click a coté
        }
    }
});

function main() {
    loadAllData();
    enableFiltering();

    const form = document.getElementById('searchForm');
    if (form) {
        form.addEventListener('submit', handleSearch);
    }
}

main();

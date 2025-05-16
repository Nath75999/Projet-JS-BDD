function completeTab(){
    const tbody = document.querySelector('#tab tbody');

    // Fusionner les deux tableaux
    const allData = [...faune, ...flore];

    // Insérer les données dans le tableau HTML
    allData.forEach(obs => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${obs.NOM_SC}</td>
    <td>${obs.NOM_FR}</td>
    <td>${obs.COMMUNE}</td>
    <td>${obs.CODE_INSEE}</td>
    <td>${obs.DATE_OBS}</td>`;
    tbody.appendChild(row);
    });
}

function main(){
    completeTab();
}

main();
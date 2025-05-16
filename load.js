
function parseCSV(content) {
	const start = Date.now();
    const rows = content.trim().split("\n").map(row => row.split(";"));
    let headers = rows.shift().map(h => h.replace(/[\r\n]/g, '').trim()); // Nettoie les en-têtes

    let res = rows.map(row => {
        let obj = {};
        row.forEach((cell, colIndex) => {
            obj[headers[colIndex]] = cell.trim();
        });
        return obj;
    });
    const end = Date.now();
	console.log(`Temps d'exécution parsing: ${end - start} ms`);
	return res;
}

function send(filename, jsContent){
    const blob = new Blob([jsContent], { type: "application/javascript" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        csvData = parseCSV(e.target.result);
        console.log("Données CSV chargées :", csvData);
        document.getElementById("exportButton").disabled = false;
        document.getElementById("exportSampleButton").disabled = false;
    };
    reader.readAsText(file);
});



document.getElementById("exportButton").addEventListener("click", function() {
    if (csvData.length === 0) return;
    send("data.js", `const data = ${JSON.stringify(csvData, null, 0)};`);
});

document.getElementById("exportSampleButton").addEventListener("click", function() {
    if (csvData.length === 0) return;
    const sampleData = csvData.slice(0, 10);
    send("data.js", `const data = ${JSON.stringify(sampleData, null, 1)};`);
});





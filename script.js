document.addEventListener("DOMContentLoaded", () => {
    const datasets = [
        ["pointTable", "waypoint.json", "Point"],
        ["polygonTable", "polygon.json", "Polygon"],
        ["polylineTable", "polyline.json", "LineString"]
    ];
    for (const [id, url, type] of datasets) {
        const table = document.getElementById(id);
        const body = table && table.tBodies[0];
        if (!body) continue;
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error("HTTP " + response.status);
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data.features)) throw new Error("GeoJSON features missing");
                for (const feature of data.features) {
                    if (!feature || !feature.geometry || feature.geometry.type !== type) continue;
                    const row = body.insertRow();
                    row.insertCell().textContent = (feature.properties && feature.properties.name) || "—";
                    row.insertCell().textContent = JSON.stringify(feature.geometry.coordinates);
                    row.insertCell().textContent = type;
                }
                if (!body.rows.length) {
                    const cell = body.insertRow().insertCell();
                    cell.colSpan = 3;
                    cell.textContent = "Tidak ada data " + type;
                }
            })
            .catch(error => {
                body.textContent = "";
                const cell = body.insertRow().insertCell();
                cell.colSpan = 3;
                cell.textContent = "Gagal memuat " + url + ": " + error.message;
            });
    }
});

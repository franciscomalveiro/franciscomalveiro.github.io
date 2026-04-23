function main() {

    const lat = 45.0705;
    const lng = 7.6868;
    const radius = 1000;
    
    const polygon = L.polygon([
        [45.07, 7.68],
        [45.07, 7.68],
        [45.10, 7.68],
        [45.10, 7.79]
    ]);
    
    const polyCoords = polygon.getLatLngs()[0].map(pt => `${pt.lat} ${pt.lng}`).join(' ');
    const polyString = `"${polyCoords}"`;
    
    
    
    const query = `
    [out:json];
    (
      node[amenity=ice_cream](poly:${polyString});
      node[shop=ice_cream](poly:${polyString});
      node[ice_cream=yes](poly:${polyString});
    );
    out body;
    `;
    const zoomLevel = 13;

    const map = L.map('map-queried').setView([lat, lng], zoomLevel);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OSM contributors'
    }).addTo(map);
    
    const markers = L.markerClusterGroup();
    map.addLayer(markers); 
    
    fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
    })
    .then(response => response.json())
    .then(data => {
        data.elements.forEach(poi => {
            if (poi.lat && poi.lon) {
                const marker = L.marker([poi.lat, poi.lon]).bindPopup(poi.tags.name || 'POI');
                markers.addLayer(marker);
            }
        });
    })
    .catch(error => console.error('Error fetching POIs:', error));
    
    polygon.addTo(map);
    
        
}

main();
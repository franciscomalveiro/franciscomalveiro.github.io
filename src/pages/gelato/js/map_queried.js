function areaOfInterest() {
    return L.polygon([
        [45.07, 7.70],
        [45.07, 7.65],
        [45.10, 7.65],
        [45.10, 7.70]
    ]);
}

/* 
 * out meta to include metadata, e.g., timestamp
 * */
function overpassQuery() {
    
    return `
    [out:json];
    (
      node[amenity=ice_cream](poly:${polyString});
      node[shop=ice_cream](poly:${polyString});
      node[ice_cream=yes](poly:${polyString});
    );
    out meta;
    `;
}


function markerText(coords, tags, timestamp) {
    /*
    let date = new Date().toLocaleDateString('en', { 
      weekday: 'long', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });   
    */
    
    let address = tags?.address;
    let schedule = tags?.opening_hours;

    const latlonDisplay = `${coords.lat} ${coords.lon}`;
    
    const scheduleDisplay = schedule ? schedule.split(';').join('<br>') 
        : '<span style="color: red;">Missing schedule!</span>';
    
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
        }).replace(/\//g, '.');
    
    const timestampDisplay = `Last update: ${formattedDate}`;
    
    return `<div>
    ${tags.name}<br>
    ${latlonDisplay}<br><br>
    ${scheduleDisplay}<br><br>
    ${timestampDisplay}
    </div>`;
}   



function main() {

    const lat = 45.0705;
    const lng = 7.6868;
    const radius = 1000;
    
    const polygon = areaOfInterest();
    
    const polyCoords = polygon.getLatLngs()[0].map(pt => `${pt.lat} ${pt.lng}`).join(' ');
    const polyString = `"${polyCoords}"`;
    
    const query = `
    [out:json];
    (
      node[amenity=ice_cream](poly:${polyString});
      node[shop=ice_cream](poly:${polyString});
      node[ice_cream=yes](poly:${polyString});
    );
    out meta;
    `;
    
    //const query = overpassQuery();
    const zoomLevel = 13;

    const map = L.map('map-queried').setView([lat, lng], zoomLevel);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    const markers = L.markerClusterGroup();
    map.addLayer(markers); 
    
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    // const overpassUrl = 'https://lz4.overpass-api.de/api/interpreter';
    
    fetch(overpassUrl, {
        method: 'POST',
        body: query
    })
    .then(response => response.json())
    .then(data => {
        data.elements.forEach(poi => {
            poiLat = poi.lat;
            poiLon = poi.lon;
            
            tags = poi.tags;
            timestamp = poi.timestamp;

            schedule = tags.opening_hours;
            text = markerText({ lat: poiLat, lon: poiLon }, tags, timestamp);
            
            popup = L.popup().setContent(`${text}`);
            
            if (poiLat && poiLon) {
                // const marker = L.marker([poiLat, poiLon]).bindPopup(tags.name || 'POI');
                const marker = L.marker([poiLat, poiLon]).bindPopup(popup);
                markers.addLayer(marker);
            }
        });
    })
    .catch(error => console.error('Error fetching POIs:', error));
    
    polygon.addTo(map);
    
        
}

main();
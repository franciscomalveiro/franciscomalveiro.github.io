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


function createColouredMarker(lat, lon, timestamp, colourScale) {
  const colour = colourScale(new Date(timestamp).getTime());

    const icon = L.divIcon({
        className: 'custom-marker-icon', // Use a custom class
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        html: `<div style="background: ${colour};"></div>`
    });

  return L.marker([lat, lon], { icon });
}


function handlePoiData(data, markers) {
    
    const timestamps = data.elements
        .map(poi => poi.timestamp)
        .filter(Boolean)
        .map(ts => new Date(ts));
    
    const minTimestamp = new Date(Math.min(...timestamps.map(t => t.getTime())));
    const maxTimestamp = new Date(Math.max(...timestamps.map(t => t.getTime())));
    
    const colourScale = d3.scaleSequential()
        .domain([minTimestamp.getTime(), maxTimestamp.getTime()])
        .interpolator(d3.interpolateRgb('red', 'green'));
        

    data.elements.forEach(poi => {
        const { lat: poiLat, lon: poiLon, tags, timestamp } = poi;
        
        const schedule = tags.opening_hours;
        const text = markerText({ lat: poiLat, lon: poiLon }, tags, timestamp);
        const popup = L.popup().setContent(text);

        if (poiLat && poiLon) {
            // const marker = L.marker([poiLat, poiLon]).bindPopup(popup);
            // const marker = L.circleMarker([poiLat, poiLon], { fillColor: colour });
            
            const marker = createColouredMarker(poiLat, poiLon, timestamp, colourScale);
            marker.bindPopup(popup);
            
            markers.addLayer(marker);
        }
    });

    
    return timestamps;
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
    .then(data => handlePoiData(data, markers))
    .catch(error => console.error('Error fetching POIs:', error));
    
    polygon.addTo(map);
    
        
}

main();
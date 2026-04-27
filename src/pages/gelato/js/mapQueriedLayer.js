import { areaOfInterest } from './aoi.js';
import { loadOverpassData } from './overpassData.js';


/*function overpassQuery(polyString) {
    
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

function getOverpassPolyString(polygon) {
    if (!(polygon instanceof L.Polygon)) {
        throw new Error(`Invalid polygon type: expected L.Polygon, got ${polygon.type}`);
    }

    const latLngs = polygon.getLatLngs()[0][0];    
    const polyCoords = latLngs.map(latlng => `${latlng.lat} ${latlng.lng}`).join(' ');
    
    return `"${polyCoords}"`;
}   


function fetchOverpassData(polyString) {
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const query = overpassQuery(polyString);
    
    return fetch(overpassUrl, {
        method: 'POST',
        body: query
    })
    .catch(error => console.error('Error fetching POIs:', error));
}*/


function processTimesteps(data) {
    return data.elements
        .map(poi => poi.timestamp)
        .filter(Boolean)
        .map(ts => new Date(ts));
}


function getColourScale(vmin, vmax) {
    return d3.scaleSequential()
        .domain([vmin, vmax])
        .interpolator(d3.interpolateRgb('red', 'green'));
}


function getMarkerText(coords, address, schedule, timestamp) {
    /*
    let date = new Date().toLocaleDateString('en', { 
      weekday: 'long', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });   
    */
    
    const latlonDisplay = `${coords.lat} ${coords.lng}`;
    
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


function processPoi(poi, markers, colourScale) {
    //const { lat, lon, tags, timestamp } = poi;
    // const schedule = tags.opening_hours;
    
    const { coords: { lat, lng }, amenity, timestamp, name, address, schedule } = poi;   
    
    const text = getMarkerText({ lat, lng }, address, schedule, timestamp);
    
    const popup = L.popup().setContent(text);

    if (lat && lng) {
        const marker = createColouredMarker(lat, lng, timestamp, colourScale);
        marker.bindPopup(popup);
            
        markers.addLayer(marker);
    }
}


function processOverpassData(data) {
    const markers = L.markerClusterGroup();
    const timestamps = data.map(item => item.timestamp);   
    
    const minTimestamp = new Date(Math.min(...timestamps.map(t => t.getTime())));
    const maxTimestamp = new Date(Math.max(...timestamps.map(t => t.getTime())));
    
    const colourScale = getColourScale(minTimestamp.getTime(), maxTimestamp.getTime());
        

    data.forEach(poi => processPoi(poi, markers, colourScale));
    return markers;
}



export async function createQueriedLayer(data) {
    const lat = 45.0705;
    const lng = 7.6868;
    /*
    const useMockPolygon = false;
    
    const polygon = await areaOfInterest(useMockPolygon);
    const polyString = getOverpassPolyString(polygon);    

    const response = await fetchOverpassData(polyString);
    
    
    
    const data = await response.json();*/
    
    // const data = loadOverpassData();
    
    const layer = L.layerGroup();
    const markers = processOverpassData(data);    
    
    polygon.addTo(layer);
    markers.addTo(layer); 

    return layer;
}

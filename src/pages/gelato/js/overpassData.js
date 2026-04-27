import { areaOfInterest } from './aoi.js';


function overpassQuery(polyString) {
    
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
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response;
    })
    .catch(error => {
        console.error('Error fetching POIs:', error);
        throw error;
    });
}


function _processRow(row) {
    const id = row?.id ?? null;
    
    const lat = row?.lat ?? null;
    const lng = row?.lon ?? null;
    
    const amenity = row?.tags?.amenity ?? null;
    const name = row?.tags?.name ?? null;
    const address = {
      housenum: row?.tags?.["addr:housenumber"] ?? null,
      street: row?.tags?.["addr:street"] ?? null,
      city: row?.tags?.["addr:city"] ?? null,
      postcode: row?.tags?.["addr:postcode"] ?? null
    };   
    
    const timestampStr = row?.timestamp ?? null;
    const timestamp = new Date(timestampStr);
    
    const schedule = row?.tags?.opening_hours ?? null;   

    return { coords: { lat, lng }, amenity, timestamp, name, address, schedule };
}


function filterOverpassData(data) {
    if (!data?.elements) {
        console.error('Invalid data format: missing elements array');
        return [];
    }
    return data.elements.map(row => _processRow(row));
}


function sortOverpassData(data) {
    return data.sort((a, b) => a.timestamp - b.timestamp);
}


export async function loadOverpassData() {
    const useMockPolygon = false;
    
    const polygon = await areaOfInterest(useMockPolygon);
    
    const polyString = getOverpassPolyString(polygon);    

    const response = await fetchOverpassData(polyString);
    const data = await response.json();
        
    const filtered = filterOverpassData(data);
    
/*    for (let i = 0; i < Math.min(20, filtered.length); i++) {
        console.log(filtered[i]);
    }  */
    return sortOverpassData(filtered);
}

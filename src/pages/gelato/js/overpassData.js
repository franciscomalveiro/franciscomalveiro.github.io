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
    
    var address = {
      housenum: row?.tags?.["addr:housenumber"] ?? null,
      street: row?.tags?.["addr:street"] ?? null,
      city: row?.tags?.["addr:city"] ?? null,
      postcode: row?.tags?.["addr:postcode"] ?? null
    };
    
    address = Object.values(address).every(val => val === null) ? null : address;
    
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
  return data.sort((a, b) => {
    const countEmptyA = Object.values(a).filter(v => v === undefined || v === null).length;
    const countEmptyB = Object.values(b).filter(v => v === undefined || v === null).length;

    if (countEmptyA !== countEmptyB) {
      return countEmptyB - countEmptyA; // More empty fields first
    }

    return a.timestamp - b.timestamp; // Older timestamp first
  });
}


export async function loadOverpassData(polygon) {    
    const polyString = getOverpassPolyString(polygon);    

    const response = await fetchOverpassData(polyString);
    const data = await response.json();
        
    const filtered = filterOverpassData(data);
    
/*    for (let i = 0; i < Math.min(20, filtered.length); i++) {
        console.log(filtered[i]);
    }  */
    return sortOverpassData(filtered);
}

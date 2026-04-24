function fixedAoI() {
    return L.polygon([
        [45.07, 7.70],
        [45.07, 7.65],
        [45.10, 7.65],
        [45.10, 7.70]
    ]);
}


function fetchNominatim() {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=Torino,Italy&format=json&polygon_geojson=1`;
    return fetch(nominatimUrl)
        .then(response => response.json())
        .catch(error => console.error('Error fetching Nominatim data:', error));
}   


async function nominatimAoI() {
    const data = await fetchNominatim();
    const geojson = data[0].geojson;
    
    if (['Polygon', 'MultiPolygon'].includes(geojson.type)) {
        const geoJsonLayer = L.geoJSON(geojson);
        const firstLayer = geoJsonLayer.getLayers()[0];
        return firstLayer;
    } else {
        throw new Error('Unsupported geometry type');
    }
}


export function areaOfInterest(fixed = false) {
    return fixed ? fixedAoI() : nominatimAoI();
}

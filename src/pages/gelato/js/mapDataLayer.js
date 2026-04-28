function processRow(row) {
    let lat = row.data.lat;
    let lon = row.data.lon;
    let address = row.data.address_corrected !== null ? row.data.address_corrected : row.data.address_original;
    
    return { lat, lon, address };
}


async function processPoiFile(loadfile) {
    const response = await fetch(loadfile);
    if (!response.ok) {
        throw new Error(`CSV file not found: ${loadfile}`);
    }
    
    const data = [];

    return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      step: (row) => {
        const result = processRow(row);
        data.push(result);
      },
      complete: () => resolve(data),
      error: (error) => reject(error)
    });
    });
}


function createMarker(data, index, colour = '#007cba') {
  const { lat, lng } = data;

  const icon = L.divIcon({
    className: 'custom-marker-icon',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    html: `<div style="background: ${colour};"></div>`
  });

  return L.marker([parseFloat(lat), parseFloat(lng)], { icon });
}   


function processSurveyedData(data) {
    const markers = L.markerClusterGroup();
    
    data.forEach((entry, index) => {
      const marker = createMarker(entry, index + 1, '#ff5722');
      markers.addLayer(marker);
    });
    
    return markers;
}



export async function createDataLayer(data) {
    const layer = L.layerGroup();
    const markers = processSurveyedData(data);
        
    markers.addTo(layer); 

    return layer;
}

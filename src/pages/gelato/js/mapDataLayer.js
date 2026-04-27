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


async function processSurveyedData(poiFile) {
    const markers = L.markerClusterGroup();
    
    
    console.log(data);
    
    return markers;
}



export async function createDataLayer(data) {
    const lat = 45.0705;
    const lng = 7.6868;
        
    const layer = L.layerGroup();
    const markers = processSurveyedData(data);
    
    //markers.addTo(layer); 

    return layer;
}

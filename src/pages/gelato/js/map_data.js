

/* Redirect to OSM using latlon values.
 * 
 * */
function getWebsiteLink(zoomLevel, lat, lon, withMarker=true) {
  

  
  let markerStr = withMarker?`?mlat=${lat}&mlon=${lon}`:``;
  
  return `https://www.openstreetmap.org/${markerStr}#map=${zoomLevel}/${lat}/${lon}`;
}


async function imageExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}


function markerText(visited=true) {
  return visited?``:``;
}


function addMarkers(poiFile) {
  
}



function main() {
  const lat = 45.0612027;
  const lon = 7.6778001;
  const poiFile = "./data/csv/locations.csv";

  const zoom = 13;
  const maxZoom = 19;



  const markers = L.markerClusterGroup();

  Papa.parse(poiFile, {
    download: true,
    header: true,
    step: function (row) {
      let lat = row.data.lat;
      let lon = row.data.lon;
      let address = row.data.address_corrected !== null ? row.data.address_corrected : row.data.address_original;
      
      if (lat && lon) {
        const marker = L.marker([parseFloat(row.data.lat), parseFloat(row.data.lon)]);

        let osmid = row.data.osmid;
        let osmtype = row.data.osmtype;
        
        let figname = `${String(lat).replace('.', '')}_${String(lon).replace('.', '')}`;
        
        const website = getWebsiteLink(maxZoom, lat, lon);
        let displayName = `(OSM)`;
        
        
        // let headerText = `<a href="${website}" target="_blank" class="marker-website">${displayName}</a>`;
        
        let markerText = `
          <div>
            <span class="marker-header">${lat},${lon}</span>
          </div>
          <div>
            <span class=="marker-text">${address}</span>
          </div>
          <div>
            <span class="marker-date">Date</span>
          </div>

          <div class="marker-image-container">
            <img src="fig/jpg/${figname}.jpg" alt="Gelato img" onerror="this.alt='404'; this.style.color='#333';">
          </div>`;
        
        
        marker.bindPopup(markerText);
        markers.addLayer(marker);
      }
    },
    complete: function () {
      map.addLayer(markers);
    }
  });

  const map = L.map('map-data').setView([lat, lon], zoom);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: maxZoom,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.control.scale().addTo(map);
  console.log('finished');
}

main();

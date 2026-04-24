import * as L from 'leaflet';

export async function createDataLayer() {
  const layer = L.layerGroup();
  const poiFile = "./data/csv/locations.csv";

  Papa.parse(poiFile, {
    download: true,
    header: true,
    complete: (results) => {
      results.data.forEach(row => {
        if (row.lat && row.lon) {
          const lat = parseFloat(row.lat);
          const lon = parseFloat(row.lon);
          const address = row.address_corrected || row.address_original;
          const figname = `${String(lat).replace('.', '')}_${String(lon).replace('.', '')}`;
          const website = getWebsiteLink(19, lat, lon);
          const markerText = `
            <div><span class="marker-header">${lat},${lon}</span></div>
            <div><span class="marker-text">${address}</span></div>
            <div><span class="marker-date">Date</span></div>
            <div class="marker-image-container">
              <img src="fig/jpg/${figname}.jpg" alt="404" onerror="this.alt='404'; this.style.color='#333';">
            </div>`;

          L.marker([lat, lon]).bindPopup(markerText).addTo(layer);
        }
      });
    }
  });

  return layer;
}

function getWebsiteLink(zoomLevel, lat, lon, withMarker = true) {
  const markerStr = withMarker ? `?mlat=${lat}&mlon=${lon}` : ``;
  return `https://www.openstreetmap.org/${markerStr}#map=${zoomLevel}/${lat}/${lon}`;
}   
export function setupRadioHandler(map, queriedLayer, dataLayer) {
  // Start with no layer added, or add based on default radio state
  const defaultRadio = document.querySelector('input[name="layer"]:checked');
  if (defaultRadio) {
    if (defaultRadio.value === 'queried') {
      queriedLayer.addTo(map);
    } else {
      dataLayer.addTo(map);
    }
  }

  document.querySelectorAll('input[name="layer"]').forEach(radio => {
    radio.addEventListener('change', () => {
      
      // Remove both layers
      if (map.hasLayer(queriedLayer)) map.removeLayer(queriedLayer);
      if (map.hasLayer(dataLayer)) map.removeLayer(dataLayer);

      // Add the selected one
      if (radio.value === 'queried') {
        queriedLayer.addTo(map);
      } else if (radio.value === 'surveyed') {
        dataLayer.addTo(map);
      }
    });
  });
}

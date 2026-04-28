export function setupRadioHandler(map, queriedLayer, dataLayer, tableContainer) {
  const defaultRadio = document.querySelector('input[name="layer"]:checked');

  if (defaultRadio.value === 'queried') {
    queriedLayer.addTo(map);
    tableContainer.style.display = '';
  } else {
    dataLayer.addTo(map);
    tableContainer.style.display = 'none';
  }

  document.querySelectorAll('input[name="layer"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (map.hasLayer(queriedLayer)) map.removeLayer(queriedLayer);
      if (map.hasLayer(dataLayer)) map.removeLayer(dataLayer);

      if (radio.value === 'queried') {
        queriedLayer.addTo(map);
        tableContainer.style.display = '';
      } else {
        dataLayer.addTo(map);
        tableContainer.style.display = 'none';
      }
    });
  });
}   
function main() {
  const maps = document.querySelectorAll('.map-container');
  const selectedMapId = document.querySelector('input[name="choice"]:checked').value === 'option1' ? 'map-queried' 
    : 'map-data';

  // Hide all, then show selected
  maps.forEach(el => el.style.display = 'none');
  document.getElementById(selectedMapId).style.display = 'block';

  // Initialise map resize
  const map = selectedMapId === 'map-data' ? window.map : window.mapQueried;
  if (map) map.invalidateSize();

  // Add event listeners
  document.querySelectorAll('input[name="choice"]').forEach(radio => {
    radio.addEventListener('change', () => {
      maps.forEach(el => el.style.display = 'none');
      const selectedMapId = radio.value === 'option1' ? 'map-queried' : 'map-data';
      document.getElementById(selectedMapId).style.display = 'block';

      const map = selectedMapId === 'map-data' ? window.map : window.mapQueried;
      if (map) setTimeout(() => map.invalidateSize(), 100);
    });
  });
}

window.addEventListener('DOMContentLoaded', main);

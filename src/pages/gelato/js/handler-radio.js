function main() {

document.querySelectorAll('input[name="choice"]').forEach(radio => {
    radio.addEventListener('change', () => {
        document.querySelectorAll('.map-container').forEach(el => {
            el.style.display = 'none';
        });
        const selectedMapId = radio.value === 'option1' ? 'map-data' : 'map-queried';
        document.getElementById(selectedMapId).style.display = 'block';

        // Force layout update and refresh map
        const map = selectedMapId === 'map-data' ? window.map : window.mapQueried;
        if (map) {
            setTimeout(() => map.invalidateSize(), 100);
        }
    });
});   
}

window.addEventListener('DOMContentLoaded', main);   
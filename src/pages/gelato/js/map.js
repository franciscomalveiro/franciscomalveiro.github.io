
import { createQueriedLayer } from '../js/mapQueriedLayer.js';
import { createDataLayer } from '../js/mapDataLayer.js';

/*
import { setupRadioHandler } from './radioHandler.js';
*/

export async function createMap() {
    const lat = 45.0705;
    const lng = 7.6868;
    const zoomLevel = 13;

    const map = L.map('map').setView([lat, lng], zoomLevel);
    const tileProvider = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    
    L.tileLayer(tileProvider, {
        attribution: attribution
    }).addTo(map);
    
/*    const queriedLayer = await createQueriedLayer();    
    queriedLayer.addTo(map);    */


    const dataLayer = await createDataLayer();
    dataLayer.addTo(map);    

    /*
    setupRadioHandler(map, queriedLayer, dataLayer);
    */
}

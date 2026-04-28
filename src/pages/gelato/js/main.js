import { createMap } from '../js/map.js';
import { createTable } from '../js/table.js';
import { loadLocalData } from '../js/localData.js';
import { loadOverpassData } from '../js/overpassData.js';
import { areaOfInterest } from './aoi.js';

import { setupRadioHandler } from './radioHandler.js';





async function main() {
    const header = {
        coords: 'Coordinates',
        amenity: 'Amenity',
        timestamp: 'LastUpdate',
        name: 'Name',
        address: 'Address',
        schedule: 'Schedule'
    };   
    
    const data = [
        {    coords: { lat: 28, lng: 29 }, amenity: 'cafe', timestamp: new Date('2026-04-27'), name: 'n1', address: 'a', schedule: null },    
        {    coords: { lat: 28, lng: 29 }, amenity: 'cafe', timestamp: new Date('2026-04-27'), name: 'n1', address: 'b', schedule: null },     
        {    coords: { lat: 28, lng: 29 }, amenity: 'cafe', timestamp: new Date('2026-04-27'), name: undefined, address: 'c', schedule: null }      
    ];
    
    const queryOSM = true;
    const useLocal = true;
    
    const useMockPolygon = false;
    const polygon = await areaOfInterest(useMockPolygon);
    
    const loadfile = '../data/csv/locations.csv';
    
    const localData = useLocal ? await loadLocalData(loadfile) : data;
    const osmData = queryOSM ? await loadOverpassData(polygon) : null;
    
      
    const { map, queriedLayer, dataLayer } = await createMap(polygon, localData, osmData);       

    const tableElement = createTable(header, osmData);
    document.querySelector('#table-container table').replaceWith(tableElement);

    setupRadioHandler(map, queriedLayer, dataLayer, document.querySelector('#table-container'));
}


document.addEventListener('DOMContentLoaded', main);   

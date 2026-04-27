import { createMap } from '../js/map.js';
import { createTable } from '../js/table.js';
import { loadCSV } from '../js/localData.js';
import { loadOverpassData } from '../js/overpassData.js';
import { areaOfInterest } from './aoi.js';





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

    
    const overpassData = '';
    const surveyedData = '';
    
    const useMockPolygon = false;
    const polygon = await areaOfInterest(useMockPolygon);
    
    const loadfile = '../data/csv/locations.csv';
    // const localData = loadCSV(loadfile);
    
    const osmData = await loadOverpassData(polygon);
    // const osmData = data;
  
    createMap(polygon, osmData);
    createTable(header, osmData);
}


document.addEventListener('DOMContentLoaded', main);   

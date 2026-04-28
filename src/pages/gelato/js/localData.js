function loadCSV(file) {
  return new Promise((resolve, reject) => {
    const rows = [];

    Papa.parse(file, {
      download: true,
      header: true,
      step: function(row) {
        rows.push(row.data);
      },
      complete: function() {
        console.log('Finished parsing CSV.');
        resolve(rows);
      },
      error: function(error) {
        console.error('Error:', error);
        reject(error);
      }
    });
  });
}


function filterLocalData(data) {
  return data.filter(row => {
    const hasLat = row.lat != null && row.lat !== '';
    const hasLng = row.lng != null && row.lng !== '';
    return hasLat && hasLng;
  });
}



export async function loadLocalData(loadfile) {
  const data = await loadCSV(loadfile);
  const filtered = filterLocalData(data);
  return filtered;
}

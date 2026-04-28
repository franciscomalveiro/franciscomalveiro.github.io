export function createTable(header, tableData) {
  const tableHead = document.querySelector('#tableHead');
  const tableBody = document.querySelector('#tableBody');

  tableHead.innerHTML = '';
  tableBody.innerHTML = '';
  
  if (tableData === null || tableData.length === 0) return;

  // add 'index' to header
  const headerRow = tableHead.insertRow();
  const th = document.createElement('th');
  th.textContent = 'Index';
  headerRow.appendChild(th);

  Object.keys(header).forEach(key => {
    const th = document.createElement('th');
    th.textContent = header[key];
    headerRow.appendChild(th);
  });

  tableData.forEach((rowData, index) => {
    const row = tableBody.insertRow();
    const indexCell = row.insertCell();
    indexCell.textContent = index + 1;

    Object.keys(header).forEach(key => {
      const cell = row.insertCell();
      let value = 'undefined';

      if (key === 'coords' && rowData.coords) {
        value = `${rowData.coords.lat},${rowData.coords.lng}`;
      } else if (key === 'timestamp') {
        value = rowData.timestamp ? rowData.timestamp.toLocaleDateString() : 'undefined';
      } else if (key === 'address' && rowData.address) {
        const addr = rowData.address;
        const parts = [addr.housenum, addr.street, addr.city, addr.postcode].filter(Boolean);
        value = parts.length > 0 ? parts.join(', ') : '';
      } else {
        value = rowData[key];// ?? 'undefined';
      }

      cell.textContent = value;
    });
  });
  return tableBody;
}   

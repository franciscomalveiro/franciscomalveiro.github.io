export function createTable(header, tableData) {
  const table = document.createElement('table');

  const thead = table.createTHead();
  thead.id = 'tableHead';
  const tbody = table.createTBody();
  tbody.id = 'tableBody';

  if (tableData === null || tableData.length === 0) return table;

  // Header row
  const headerRow = thead.insertRow();
  const thIndex = document.createElement('th');
  thIndex.textContent = 'Index';
  headerRow.appendChild(thIndex);

  Object.keys(header).forEach(key => {
    const th = document.createElement('th');
    th.textContent = header[key];
    headerRow.appendChild(th);
  });

  // Data rows
  tableData.forEach((rowData, index) => {
    const row = tbody.insertRow();
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
        value = rowData[key];
      }

      cell.textContent = value;
    });
  });

  return table;
}

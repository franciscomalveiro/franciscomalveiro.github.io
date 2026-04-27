export function loadCSV(file) {
  Papa.parse(file, {
    download: true,
    header: true,
    step: function(row) {
      // console.log("Row:", row.data);
    },
    complete: function(results) {
      console.log("Finished parsing CSV.");
    },
    error: function(error) {
      console.error("Error:", error);
    }
  });
}
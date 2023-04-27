let tableData = [];

function displayExcelData(data) {
  const table = document.getElementById("excel-data");
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");

  // Clear table contents
  thead.innerHTML = "";
  tbody.innerHTML = "";

  // Add table headers
  const headerRow = document.createElement("tr");
  for (const header of data[0]) {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);

  // Add table rows
  for (let i = 1; i < data.length; i++) {
    const rowData = data[i];
    const tr = document.createElement("tr");
    for (const cellData of rowData) {
      const td = document.createElement("td");
      td.textContent = cellData !== undefined ? cellData : "";
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

function searchTableData(keyword) {
  if (!tableData.length) return;

  const filteredData = tableData.filter(row => {
    return row.some(cell => {
      return cell.toString().toLowerCase().includes(keyword.toLowerCase());
    });
  });

  displayExcelData([tableData[0], ...filteredData]);
}

document.getElementById("load-excel-data").addEventListener("click", () => {
  fetch("/data.xlsx")
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      const data = new Uint8Array(buffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

      tableData = json;
      displayExcelData(json);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

document.getElementById("search-button").addEventListener("click", () => {
  const searchInput = document.getElementById("search-input");
  searchTableData(searchInput.value);
});

document.getElementById("download-excel-data").addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = "/data.xlsx";
    link.download = "data.xlsx";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

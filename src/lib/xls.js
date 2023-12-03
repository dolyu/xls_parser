const fs = require('fs');
const ExcelJS = require('exceljs');
const { dialog } = require('electron');
const sampleData = {
  name: "asdf",
  age: 11
};


const saveXls = (data) => {
  // Create a new workbook
  console.log('ㅋㅋ', data);
  //

  // Show save file dialog
  dialog.showSaveDialog({ defaultPath: '1.xlsx' }).then((result) => {
    if (!result.canceled) {
      const filePath = result.filePath;

      // Create a new workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('student');

      // Add data to the worksheet
      worksheet.addRow(Object.keys(data));
      worksheet.addRow(Object.values(data));

      // Save the workbook
      workbook.xlsx.writeFile(filePath, { useStyles: true }).then(() => {
        console.log('Excel file saved successfully.');
      }).catch((error) => {
        console.error('Error saving Excel file:', error);
      });
    }
  });
}

//외부에서 사용할수있게 해줘
module.exports = {
  saveXls
}
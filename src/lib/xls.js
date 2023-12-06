const fs = require('fs');
const ExcelJS = require('exceljs');
const { dialog } = require('electron');
const sampleData = {
  name: "asdf",
  age: 11
};


const dataParser = (data) => {
  const jsonData = {};
  ///asdfasdf^adfasdf^adfdsf^adfadsf를 ^로 나눠서 배열로 만들어줌
  const dataArray = data.split('^');

  return jsonData;
}


const saveXls = (data) => {
  // Create a new workbook
  //data = sampleData;
  // console.log('ㅋㅋ', data);
  //

  // Show save file dialog
  dialog.showSaveDialog({ defaultPath: 'QR.xlsx' }).then((result) => {
    if (!result.canceled) {
      saveData(result.filePath, data);
    }
  });
}

const saveData = (filePath, data) => {
  //console.log('saveData', filePath, data);
  const jsonData = convertToJSON(data);
  // console.log('dexcel', data, jsonData[0]);
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('QR');

  // boxNo,
  //   materialNo,
  //   materialCode,
  //   batch,
  //   qty,
  //   expirationDate,
  //   qrCode,
  //   qrBatch,
  //   qrLineNo,
  //   batch,
  // Add data to the worksheet
  worksheet.addRow(['No', 'Box No', 'Material No', 'Material Code', '배치', 'QTY', '유통기한', '생산일자', 'QR바코드', 'QR배치', 'QR라인번호', '배치']);
  worksheet.columns[1].width = 15;//Box No
  worksheet.columns[2].width = 15;//Material No
  worksheet.columns[3].width = 15;//Material Code
  worksheet.columns[4].width = 15;//배치
  worksheet.columns[5].width = 15;//QTY
  worksheet.columns[6].width = 15;//유통기한

  worksheet.columns[7].width = 15;//생산일자
  worksheet.columns[8].width = 25;//QR바코드
  worksheet.columns[9].width = 15;//QR배치
  worksheet.columns[10].width = 15;//QR라인번호
  worksheet.columns[11].width = 15;//배치
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.numFmt = '@'; // '@'은 텍스트를 나타내는 서식 코드입니다.
    });
  });
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF00' } // 노란색
    };
  });
  for (let i = 0; i < jsonData.length; i++) {
    const element = jsonData[i];

    //for (const e of element) {
    for (let j = 0; j < element.length; j++) {
      const e = element[j];
      let dateParts = e.expirationDate.split('-').map(part => parseInt(part.trim(), 10));
      let expiryDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

      console.log(expiryDate, e.expirationDate);
      const productionDate = new Date(expiryDate);
      productionDate.setFullYear(expiryDate.getFullYear() - 1);

      worksheet.addRow([i + 1, e.boxNo, e.materialNo, e.materialCode, e.batch, e.qty, expiryDate, productionDate, e.qrCode, e.qrBatch, e.qrLineNo, e.batch]);
      const jdx = 2 + (i * 20);
      worksheet.getCell(`B${jdx}`).numFmt = '@';

    }
    worksheet.mergeCells(`A${2 + (i * 20)}:A${21 + (i * 20)}`);
    worksheet.getCell(`A${2 + (i * 20)}`).alignment = { vertical: 'middle', horizontal: 'center' };
  }

  // Save the workbook
  workbook.xlsx.writeFile(filePath, { useStyles: true }).then(() => {
    console.log('Excel file saved successfully.');
  }).catch((error) => {
    console.error('Error saving Excel file:', error);
  });
}
function convertToJSON(datas) {
  const ret = [];
  console.log(datas)
  for (let itemIndex = 0; itemIndex < datas.length; itemIndex++) {
    const key = Object.keys(datas[itemIndex])[0];
    const dataArray = datas[itemIndex][key].split('\n').filter(value => value.trim() !== '');
    // console.log("wefwef", dataArray);
    const [boxNo, materialNo, ...rest] = dataArray;

    const batchArray = [];
    const qrDataArray = [];
    //console.log("reset", rest);
    console.log("rest", rest.length);
    for (let i = 0; i < rest.length; i += 3) {
      if (rest[i].includes("^") || rest[i].includes("|")) {
        continue;
      }
      console.log("rest", rest[i]);
      const batch = rest[i];
      const qty = rest[i + 1];
      const expirationDate = rest[i + 2];
      batchArray.push([batch, qty, expirationDate]);
    }
    console.log("batch", batchArray);
    const QRData = dataArray[dataArray.length - 1];
    const tempArray = QRData.split("|");
    const materialCode = tempArray[0];
    qrDataArray.push(...tempArray[2].split("^"));

    const jsonTable = [];
    const jsonTable2 = [];

    qrDataArray.forEach((value, index) => {
      const qrCode = value.trim();
      const qrBatch = qrCode.slice(3, 12);
      const qrLineNo = qrCode.slice(12, 15);
      const batch = qrBatch.substring(0, 1) + '0' + qrBatch.substring(1);
      const resultArray = batchArray.filter((item) => item[0] === batch);
      console.log("resultArray", batch, resultArray);
      const qty = resultArray[0][1];
      const expirationDate = resultArray[0][2];
      const jsonEntry = {
        boxNo,
        materialNo,
        materialCode,
        batch,
        qty,
        expirationDate,
        qrCode,
        qrBatch,
        qrLineNo,
        batch,
      };
      jsonTable.push(jsonEntry);
    });

    ret.push(jsonTable);
    // console.log(jsonTable);
  }
  return ret;
}

const sd = [
  {
    "1": "12074986\n49656481\nA049N7B622\n4\n2023/11/01\nA049N7I626\n3\n2023/11/01\nA049N7I627\n5\n2023/11/01\nA049N7I628\n8\n2023/11/01\nLB02-00128A|20|jBRA00N381750253308B^jBRA00N381750433308B^jBRA00N381750243308B^jBRA00N381750173308B^jBRA00N381750183308B^jBRA00N381750193308B^jBRA00N381750203308B^jBRA00N381750213308B^jBRA00N381750223308B^jBRA00N381750013308B^jBRA00N381750033308B^jBRA00N381750043308B^jBRA00N381750053308B^jBRA00N381750503308B^jBRA00N381750113308B^jBRA00N381750103308B^jBRA00N381750073308B^jBRA00N381750093308B^jBRA00N381750083308B^jBRA00N381750533308B"
  },
  {
    "2": "12074986\n49656481\nA049N7B622\n4\n2023/11/01\nA049N7I626\n3\n2023/11/01\nA049N7I627\n5\n2023/11/01\nA049N7I628\n8\n2023/11/01\nLB02-00128A|20|jBRA00N381750253308B^jBRA00N381750433308B^jBRA00N381750243308B^jBRA00N381750173308B^jBRA00N381750183308B^jBRA00N381750193308B^jBRA00N381750203308B^jBRA00N381750213308B^jBRA00N381750223308B^jBRA00N381750013308B^jBRA00N381750033308B^jBRA00N381750043308B^jBRA00N381750053308B^jBRA00N381750503308B^jBRA00N381750113308B^jBRA00N381750103308B^jBRA00N381750073308B^jBRA00N381750093308B^jBRA00N381750083308B^jBRA00N381750533308B"
  },
  {
    "3": "12074986\n49656481\nA049N7B622\n4\n2023/11/01\nA049N7I626\n3\n2023/11/01\nA049N7I627\n5\n2023/11/01\nA049N7I628\n8\n2023/11/01\nLB02-00128A|20|jBRA00N381750253308B^jBRA00N381750433308B^jBRA00N381750243308B^jBRA00N381750173308B^jBRA00N381750183308B^jBRA00N381750193308B^jBRA00N381750203308B^jBRA00N381750213308B^jBRA00N381750223308B^jBRA00N381750013308B^jBRA00N381750033308B^jBRA00N381750043308B^jBRA00N381750053308B^jBRA00N381750503308B^jBRA00N381750113308B^jBRA00N381750103308B^jBRA00N381750073308B^jBRA00N381750093308B^jBRA00N381750083308B^jBRA00N381750533308B"
  }
];

const sd2 = [
  {
    "1": "12074986\n49656481\nA049N7I626\n3\n2023/11/01\nA049N7I627\n5\n2023/11/01\nA049N7I628\n8\n2023/11/01\nLB02-00128A|20|jBRA00N381750253308B^jBRA00N381750433308B^jBRA00N381750243308B^jBRA00N381750173308B^jBRA00N381750183308B^jBRA00N381750193308B^jBRA00N381750203308B^jBRA00N381750213308B^jBRA00N381750223308B^jBRA00N381750013308B^jBRA00N381750033308B^jBRA00N381750043308B^jBRA00N381750053308B^jBRA00N381750503308B^jBRA00N381750113308B^jBRA00N381750103308B^jBRA00N381750073308B^jBRA00N381750093308B^jBRA00N381750083308B^jBRA00N381750533308B"
  },
  {
    "2": "12074986\n49656481\nA049N7I626\n3\n2023/11/01\nA049N7I627\n5\n2023/11/01\nA049N7I628\n8\n2023/11/01\nLB02-00128A|20|jBRA00N381750253308B^jBRA00N381750433308B^jBRA00N381750243308B^jBRA00N381750173308B^jBRA00N381750183308B^jBRA00N381750193308B^jBRA00N381750203308B^jBRA00N381750213308B^jBRA00N381750223308B^jBRA00N381750013308B^jBRA00N381750033308B^jBRA00N381750043308B^jBRA00N381750053308B^jBRA00N381750503308B^jBRA00N381750113308B^jBRA00N381750103308B^jBRA00N381750073308B^jBRA00N381750093308B^jBRA00N381750083308B^jBRA00N381750533308B"
  }

];
const sd3 = [
  {
    "1": "12074986\n49656481\nA049N7I627\n5\n2023/11/01\nA049N7I628\n8\n2023/11/01\nLB02-00128A|20|jBRA00N381750253308B^jBRA00N381750433308B^jBRA00N381750243308B^jBRA00N381750173308B^jBRA00N381750183308B^jBRA00N381750193308B^jBRA00N381750203308B^jBRA00N381750213308B^jBRA00N381750223308B^jBRA00N381750013308B^jBRA00N381750033308B^jBRA00N381750043308B^jBRA00N381750053308B^jBRA00N381750503308B^jBRA00N381750113308B^jBRA00N381750103308B^jBRA00N381750073308B^jBRA00N381750093308B^jBRA00N381750083308B^jBRA00N381750533308B"
  }
];
const sd4 = [
  {
    "1": "TPBX20231122030\n12075262\nA095NBH013\n3\n2024 - 11 - 16\nA095NBH014\n17\n2024 - 11 - 16\nLA02- 00536A | 20 | jSZA95NBH0140073Y17VB ^ jSZA95NBH0140083Y17VB ^ jSZA95NBH0140093Y17VB ^ jSZA95NBH0140103Y17VB ^ jSZA95NBH0140113Y17VB ^ jSZA95NBH0140123Y17VB ^ jSZA95NBH0140133Y17VB ^ jSZA95NBH0140143Y17VB ^ jSZA95NBH0140153Y17VB ^ jSZA95NBH0140163Y17VB ^ jSZA95NBH0140173Y17VB ^ jSZA95NBH0140183Y17VB ^ jSZA95NBH0140193Y17VB ^ jSZA95NBH0140203Y17VB ^ jSZA95NBH0140213Y17VB ^ jSZA95NBH0140223Y17VB ^ jSZA95NBH0140233Y17VB ^ jSZA95NBH0130103Y17VB ^ jSZA95NBH0130123Y17VB ^ jSZA95NBH0130133Y17VB"
  },
  {
    "2": "TPBX20231122030\n12075262\nA095NBH013\n3\n2024 - 11 - 16\nA095NBH014\n17\n2024 - 11 - 16\nLA02- 00536A | 20 | jSZA95NBH0140073Y17VB ^ jSZA95NBH0140083Y17VB ^ jSZA95NBH0140093Y17VB ^ jSZA95NBH0140103Y17VB ^ jSZA95NBH0140113Y17VB ^ jSZA95NBH0140123Y17VB ^ jSZA95NBH0140133Y17VB ^ jSZA95NBH0140143Y17VB ^ jSZA95NBH0140153Y17VB ^ jSZA95NBH0140163Y17VB ^ jSZA95NBH0140173Y17VB ^ jSZA95NBH0140183Y17VB ^ jSZA95NBH0140193Y17VB ^ jSZA95NBH0140203Y17VB ^ jSZA95NBH0140213Y17VB ^ jSZA95NBH0140223Y17VB ^ jSZA95NBH0140233Y17VB ^ jSZA95NBH0130103Y17VB ^ jSZA95NBH0130123Y17VB ^ jSZA95NBH0130133Y17VB"
  }
]


saveData('2.xlsx', sd4)
//외부에서 사용할수있게 해줘
module.exports = {
  saveXls
}
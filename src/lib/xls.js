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

  // Add data to the worksheet
  worksheet.addRow(['No', 'MATERIAL', 'SHIPMENT NO', '배치', 'QTY', '유통기한', '생산일자', 'QR바코드', 'QR배치', 'QR라인번호', '배치']);
  worksheet.columns[1].width = 15;//MATERIAL
  worksheet.columns[2].width = 15;//SHIPMENT NO
  worksheet.columns[3].width = 15;//배치
  worksheet.columns[3].width = 15;//QTY
  worksheet.columns[5].width = 15;//유통기한

  worksheet.columns[6].width = 15;//생산일자
  worksheet.columns[7].width = 25;//QR바코드
  worksheet.columns[8].width = 15;//QR배치
  worksheet.columns[9].width = 15;//QR라인번호
  worksheet.columns[10].width = 15;//배치
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.numFmt = '@'; // '@'은 텍스트를 나타내는 서식 코드입니다.
    });
  });

  for (let i = 0; i < jsonData.length; i++) {
    const element = jsonData[i];

    //for (const e of element) {
    for (let j = 0; j < element.length; j++) {
      const e = element[j];
      const expiryDate = new Date(e.유통기한);
      const productionDate = new Date(expiryDate);
      productionDate.setFullYear(expiryDate.getFullYear() - 1);

      worksheet.addRow([i + 1, e.MATERIAL.toString(), e["SHIPMENT NO"], e.Batch, e.QTY, expiryDate, productionDate, e["QR바코드"], e.QR배치, e.QR라인번호, e.배치]);
      const jdx = 2 + (i * 20);
      worksheet.getCell(`B${jdx}`).numFmt = '@';
      // worksheet.getCell(`B${jdx}`).dataValidation = {
      //   type: 'date',
      //   operator: 'lessThan',
      //   showErrorMessage: true,
      //   allowBlank: true,
      //   formulae: [new Date(2016, 0, 1)]

      // };

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
    const [MATERIAL, SHIPMENTNO, ...rest] = dataArray;

    const batchArray = [];
    const qrDataArray = [];
    console.log("reset", rest);

    for (let i = 0; i < rest.length; i += 3) {
      const batch = rest[i];
      const qty = rest[i + 1];
      const expirationDate = rest[i + 2];
      batchArray.push([batch, qty, expirationDate]);
    }

    const QRData = dataArray[dataArray.length - 1];
    const tempArray = QRData.split("|");
    qrDataArray.push(...tempArray[2].split("^"));

    const jsonTable = [];
    console.log(batchArray);

    batchArray.forEach(([batch, qty, expirationDate]) => {

      for (let i = 0; i < +qty; i++) {
        const qrCode = qrDataArray.shift();
        const qrBatch = qrCode.slice(3, 11);
        const qrLineNo = qrCode.slice(11, 14);

        const jsonEntry = {
          "MATERIAL": MATERIAL,
          "SHIPMENT NO": SHIPMENTNO,
          "Batch": batch,
          "QTY": +qty,
          "유통기한": expirationDate,
          "QR바코드": qrCode,
          "QR배치": qrBatch,
          "QR라인번호": qrLineNo,
          "배치": batch,
        };

        jsonTable.push(jsonEntry);
      }
    });

    ret.push(jsonTable);
    console.log(jsonTable);
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
    "1": "12074986\n49656484\nA000N38175\n00020\n2023 / 11 / 20\nLB02-00128A | 20 | jBRA00N381750253308B ^ jBRA00N381750433308B ^ jBRA00N381750243308B ^ jBRA00N381750173308B ^ jBRA00N381750183308B ^ jBRA00N381750193308B ^ jBRA00N381750203308B ^ jBRA00N381750213308B ^ jBRA00N381750223308B ^ jBRA00N381750013308B ^ jBRA00N381750033308B ^ jBRA00N381750043308B ^ jBRA00N381750053308B ^ jBRA00N381750503308B ^ jBRA00N381750113308B ^ jBRA00N381750103308B ^ jBRA00N381750073308B ^ jBRA00N381750093308B ^ jBRA00N381750083308B ^ jBRA00N381750533308B"
  },
  {
    "2": "12074986\n49656484\nA000N38175\n00020\n2023 / 11 / 20\nLB02-00128A | 20 | jBRA00N381750253308B ^ jBRA00N381750433308B ^ jBRA00N381750243308B ^ jBRA00N381750173308B ^ jBRA00N381750183308B ^ jBRA00N381750193308B ^ jBRA00N381750203308B ^ jBRA00N381750213308B ^ jBRA00N381750223308B ^ jBRA00N381750013308B ^ jBRA00N381750033308B ^ jBRA00N381750043308B ^ jBRA00N381750053308B ^ jBRA00N381750503308B ^ jBRA00N381750113308B ^ jBRA00N381750103308B ^ jBRA00N381750073308B ^ jBRA00N381750093308B ^ jBRA00N381750083308B ^ jBRA00N381750533308B"
  }
]

//saveData('2.xlsx', sd3)
//외부에서 사용할수있게 해줘
module.exports = {
  saveXls
}
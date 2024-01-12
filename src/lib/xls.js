const fs = require('fs');
const ExcelJS = require('exceljs');
const { dialog } = require('electron');
const moment = require('moment');
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


const saveXls = async (data) => {
  // Create a new workbook
  //data = sampleData;
  // console.log('ㅋㅋ', data);
  //

  // Show save file dialog
  const rt = await dialog.showSaveDialog({
    defaultPath: 'QR.xlsx', filters: [
      { name: 'Excel Files', extensions: ['xlsx'] }
    ]
  });
  if (!rt.canceled) {
    return await saveData(rt.filePath, data);
  }
  else {
    return { result: "success", message: "cancel", id: -1 };
  }
}

const saveData = async (filePath, data) => {
  try {
    //console.log('saveData', filePath, data);
    const rt = convertToJSON(data);
    if (rt.result !== "success") {
      return rt;
    }
    const jsonData = rt.data;
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
    worksheet.addRow(['No', 'Box No', 'Material No', 'Shipment No', 'Material Code', '배치', 'QTY', 'Unit QTY', '유통기한', '생산일자', 'QR바코드', 'QR배치', 'QR라인번호', '배치']);
    worksheet.columns[1].width = 15;//Box No
    worksheet.columns[2].width = 15;//Material No
    worksheet.columns[3].width = 15;//Shipment No
    worksheet.columns[4].width = 15;//Material Code
    worksheet.columns[5].width = 15;//배치
    worksheet.columns[6].width = 15;//QTY
    worksheet.columns[7].width = 15;//Unit QTY
    worksheet.columns[8].width = 15;//유통기한
    worksheet.columns[9].width = 15;//생산일자
    worksheet.columns[10].width = 25;//QR바코드
    worksheet.columns[11].width = 15;//QR배치
    worksheet.columns[12].width = 15;//QR라인번호
    worksheet.columns[13].width = 15;//배치
    //인트형 a변수 배열 만들어줘


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
      const mergeCell = [];
      for (let j = 0; j < element.length; j++) {
        const e = element[j];
        const stringWithoutSpaces = e.expirationDate.replace(/\s/g, '');
        const expiryDate = new Date(stringWithoutSpaces);
        const productionDate = new Date(expiryDate);
        productionDate.setFullYear(productionDate.getFullYear() - 1);
        productionDate.setDate(productionDate.getDate() + 1);

        const exp = moment(expiryDate).format('YYYYMMDD');
        const prod = moment(productionDate).format('YYYYMMDD');

        // console.log('date', a, b);
        worksheet.addRow([i + 1, e.boxNo, e.materialNo, e.shipmentNo, e.materialCode, e.batch, e.qty, '1', exp, prod, e.qrCode, e.qrBatch, e.qrLineNo, e.batch]);

        const jdx = 2 + (i * 20) + j;
        worksheet.getCell(`B${jdx}`).numFmt = '@';
        const qty = e.qty;
        mergeCell.push({ qty: qty, jdx: jdx });
      }
      // console.log('mergeCell', mergeCell);
      let curqty = mergeCell[0].qty;
      let startjdx = mergeCell[0].jdx;
      let groups = [];

      for (let i = 1; i < mergeCell.length; i++) {
        if (mergeCell[i].qty !== curqty) {
          groups.push({ qty: curqty, startjdx: startjdx, endjdx: mergeCell[i - 1].jdx });
          curqty = mergeCell[i].qty;
          startjdx = mergeCell[i].jdx;
        }
      }
      // 마지막 그룹 추가
      groups.push({ qty: curqty, startjdx: startjdx, endjdx: mergeCell[mergeCell.length - 1].jdx });
      for (const group of groups) {
        worksheet.mergeCells(`G${group.startjdx}:G${group.endjdx}`);
        worksheet.getCell(`G${group.startjdx}`).alignment = { vertical: 'middle', horizontal: 'center' };
      }

      console.log('sadfsadf', groups);
      worksheet.mergeCells(`A${2 + (i * 20)}:A${21 + (i * 20)}`);
      worksheet.getCell(`A${2 + (i * 20)}`).alignment = { vertical: 'middle', horizontal: 'center' };
    }

    // Save the workbook
    await workbook.xlsx.writeFile(filePath, { useStyles: true });
    console.log('Excel file saved successfully.');
    return { result: "success" };
  }
  catch (error) {
    console.error('saveData', error.message);
    return { result: "error", message: error.message, id: -1 };
  }
}
function convertToJSON(datas) {
  const ret = [];
  let currentIdx = -1;
  try {
    for (let itemIndex = 0; itemIndex < datas.length; itemIndex++) {
      currentIdx = itemIndex;
      const key = Object.keys(datas[itemIndex])[0];
      const dataArray = datas[itemIndex][key].split('\n').filter(value => value.trim() !== '');
      // console.log("wefwef", dataArray);
      const l = (dataArray.length - 4) % 3;
      if (l !== 0) {
        return {
          result: "error", message: `QR코드 갯수가 이상해요`
          , id: currentIdx
        };
      }
      const [boxNo, materialNo, shipmentNo, ...rest] = dataArray;

      const batchArray = [];
      const qrDataArray = [];
      //console.log("reset", rest);

      for (let i = 0; i < rest.length; i += 3) {
        if (rest[i].includes("^") || rest[i].includes("|")) {
          continue;
        }
        const batch = rest[i];
        const qty = rest[i + 1];
        const expirationDate = rest[i + 2];
        batchArray.push([batch, qty, expirationDate]);
      }
      const QRData = dataArray[dataArray.length - 1];
      const tempArray = QRData.split("|");
      const materialCode = tempArray[0];
      qrDataArray.push(...tempArray[2].split("^"));
      const jsonTable = [];
      // console.log("result ", rest, qrDataArray.length, batchArray);

      for (let index = 0; index < qrDataArray.length; index++) {
        // qrDataArray.forEach((value, index) => {
        const value = qrDataArray[index];
        const qrCode = value.trim();
        const qrBatch = qrCode.slice(3, 12);
        const qrLineNo = qrCode.slice(12, 15);
        const batch = '0' + qrBatch.substring(1);
        const f = qrBatch.substring(1);
        const resultArray = batchArray.filter((item) => item[0].includes(f));
        // console.log("resultArray", index, resultArray, batch, f, batchArray);
        // console.log("resultArray", index, resultArray, batchArray, batch, qrBatch, qrLineNo, qrCode)
        // console.log("resultArray", qrBatch, batch);
        let qty;
        let expirationDate;
        try {
          qty = resultArray[0][1];
          expirationDate = resultArray[0][2];
        }
        catch (e) {
          qty = 0;
          expirationDate = "0";
          return {
            result: "error", message: `수량, 날짜에 문제가 있어요`, id: currentIdx
          };
        }

        const stringWithoutSpaces = expirationDate.replace(/\s/g, '');
        const b = new Date(stringWithoutSpaces);
        // console.log("b", b, stringWithoutSpaces);
        if (isNaN(b.getTime())) {
          return {
            result: "error", message: `날짜에 문제가 있어요`, id: currentIdx
          };
        }
        if (isNaN(+qty)) {
          return {
            result: "error", message: `수량에 문제가 있어요`, id: currentIdx
          };
        }


        const jsonEntry = {
          boxNo,
          materialNo,
          shipmentNo,
          materialCode,
          batch,
          qty,
          expirationDate,
          qrCode,
          qrBatch: qrBatch.substring(1),
          qrLineNo,
        };
        jsonTable.push(jsonEntry);
      }

      ret.push(jsonTable);
      // console.log(jsonTable);
    }
  }
  catch (e) {
    console.log("error", e);
    return {
      result: "error", message: `QR데이터에 문제가 있어요`, id: currentIdx
    };
  }
  return { result: "success", data: ret };
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
    "1": "TPBX20231122030\n12075262\n49656481\nA095NBH013\n3\n2024/11/16\nA095NBH014\n17\negerger\nLA02- 00536A | 20 | jSZA95NBH0140073Y17VB ^ jSZA95NBH0140083Y17VB ^ jSZA95NBH0140093Y17VB ^ jSZA95NBH0140103Y17VB ^ jSZA95NBH0140113Y17VB ^ jSZA95NBH0140123Y17VB ^ jSZA95NBH0140133Y17VB ^ jSZA95NBH0140143Y17VB ^ jSZA95NBH0140153Y17VB ^ jSZA95NBH0140163Y17VB ^ jSZA95NBH0140173Y17VB ^ jSZA95NBH0140183Y17VB ^ jSZA95NBH0140193Y17VB ^ jSZA95NBH0140203Y17VB ^ jSZA95NBH0140213Y17VB ^ jSZA95NBH0140223Y17VB ^ jSZA95NBH0140233Y17VB ^ jSZA95NBH0130103Y17VB ^ jSZA95NBH0130123Y17VB ^ jSZA95NBH0130133Y17VB"
  },
  {
    "2": "TPBX20231122030\n12075262\n49656481\nA095NBH013\n3\n2024/11/16\nA095NBH014\n17\n2024 - 11 - 16\nLA02- 00536A | 20 | jSZA95NBH0140073Y17VB ^ jSZA95NBH0140083Y17VB ^ jSZA95NBH0140093Y17VB ^ jSZA95NBH0140103Y17VB ^ jSZA95NBH0140113Y17VB ^ jSZA95NBH0140123Y17VB ^ jSZA95NBH0140133Y17VB ^ jSZA95NBH0140143Y17VB ^ jSZA95NBH0140153Y17VB ^ jSZA95NBH0140163Y17VB ^ jSZA95NBH0140173Y17VB ^ jSZA95NBH0140183Y17VB ^ jSZA95NBH0140193Y17VB ^ jSZA95NBH0140203Y17VB ^ jSZA95NBH0140213Y17VB ^ jSZA95NBH0140223Y17VB ^ jSZA95NBH0140233Y17VB ^ jSZA95NBH0130103Y17VB ^ jSZA95NBH0130123Y17VB ^ jSZA95NBH0130133Y17VB"
  }
]

const sd5 = [
  {
    "1": `SB0000891308
yy019982
yy612924
A049NCF229
1
12/14/2024
A049NCL561
2
12/20/2024
yy49NCL562
10
12/20/2024
A049NCL563
1
12/20/2024
A049NCL564
6
12/20/2024
LB02-00135A|20|jCTA49NCF2290133Z15YB^jCTA49NCL5610203Z21YB^jCTA49NCL5610193Z21YB^jCTA49NCL5620063Z21YB^jCTA49NCL5620073Z21YB^jCTA49NCL5620043Z21YB^jCTA49NCL5620053Z21YB^jCTA49NCL5620023Z21YB^jCTA49NCL5620033Z21YB^jCTA49NCL5620013Z21YB^jCTA49NCL5620083Z21YB^jCTA49NCL5620093Z21YB^jCTA49NCL5620103Z21YB^jCTA49NCL5630223Z21YB^jCTA49NCL5640093Z21YB^jCTA49NCL5640063Z21YB^jCTA49NCL5640053Z21YB^jCTA49NCL5640123Z21YB^jCTA49NCL5640153Z21YB^jCTA49NCL5640113Z21YB
`
  }
]
const sd6 = [
  {
    "1": `SB0000837326
12084849
50414780
YY00N69271
20
06/08/2024
LB02-00128A|20|jBRA00N692711083609YB^jBRA00N692710523609YB^jBRA00N692710533609YB^jBRA00N692710553609YB^jBRA00N692710563609YB^jBRA00N692710573609YB^jBRA00N692710583609YB^jBRA00N692710593609YB^jBRA00N692710603609YB^jBRA00N692710613609YB^jBRA00N692710783609YB^jBRA00N692710813609YB^jBRA00N692710803609YB^jBRA00N692710823609YB^jBRA00N692710833609YB^jBRA00N692710843609YB^jBRA00N692710873609YB^jBRA00N692710863609YB^jBRA00N692710493609YB^jBRA00N692710503609YB

`
  }
]

async function test() {
  const rt = await saveData('2.xlsx', sd6)
  console.log(rt);
}
test();
//외부에서 사용할수있게 해줘
module.exports = {
  saveXls
}
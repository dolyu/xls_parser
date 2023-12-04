function generateTableData(data) {
  const dataArray = data.split('\n').filter(Boolean);
  const [MATERIAL, SHIPMENTNO, ...rest] = dataArray;

  const batchArray = [];
  const qrDataArray = [];

  for (let i = 0; i < rest.length; i += 3) {
    const batch = rest[i];
    const qty = rest[i + 1];
    const expirationDate = rest[i + 2];
    batchArray.push([batch, qty, expirationDate]);
  }

  const QRData = dataArray[dataArray.length - 1];
  qrDataArray.push(...QRData.split("^"));

  const jsonTable = [];


  batchArray.forEach(([batch, qty, expirationDate]) => {
    console.log("qwfqwfqw", expirationDate);
    const productionDate = expirationDate.replace(/\/\d+$/, "/11/1");

    for (let i = 0; i < +qty; i++) {
      const qrCode = qrDataArray.shift();
      const qrBatch = qrCode.slice(3, 11);
      const qrLineNo = qrCode.slice(11, 14);

      const jsonEntry = {
        MATERIAL,
        "SHIPMENT NO": SHIPMENTNO,
        배치: batch,
        QTY: +qty,
        "유통기한": expirationDate,
        생산일자: productionDate,
        "QR바코드": qrCode,
        QR배치: qrBatch,
        QR라인번호: qrLineNo,
        배치: batch,
      };

      jsonTable.push(jsonEntry);
    }
  });

  return jsonTable;
}

// 테스트를 위해 호출
const data = `12074986\n49656481\n
    A049N7B622\n
    4\n
    2023/11/01\n
    A049N7I626\n
    3\n
    2023/11/01\n
    A049N7I627\n
    5\n
    2023/11/01\n
    A049N7I628\n
    8\n
    2023/11/01\n
    LB02-00128A|20|jBRA00N381750253308B^jBRA00N381750433308B^jBRA00N381750243308B^jBRA00N381750173308B^jBRA00N381750183308B^jBRA00N381750193308B^jBRA00N381750203308B^jBRA00N381750213308B^jBRA00N381750223308B^jBRA00N381750013308B^jBRA00N381750033308B^jBRA00N381750043308B^jBRA00N381750053308B^jBRA00N381750503308B^jBRA00N381750113308B^jBRA00N381750103308B^jBRA00N381750073308B^jBRA00N381750093308B^jBRA00N381750083308B^jBRA00N381750533308B`;

const resultTable = generateTableData(data);
console.table(resultTable);

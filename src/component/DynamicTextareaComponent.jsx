import React, { useState, useRef, useEffect } from "react";
import "./DynamicTextareaComponent.css";
const sampleData = `12074986
49656481
A049N7B622
4
2023/11/01
A049N7I626
3
2023/11/01
A049N7I627
5
2023/11/01
A049N7I628
8
2023/11/01
LB02-00128A|20|jBRA00N381750253308B^jBRA00N381750433308B^jBRA00N381750243308B^jBRA00N381750173308B^jBRA00N381750183308B^jBRA00N381750193308B^jBRA00N381750203308B^jBRA00N381750213308B^jBRA00N381750223308B^jBRA00N381750013308B^jBRA00N381750033308B^jBRA00N381750043308B^jBRA00N381750053308B^jBRA00N381750503308B^jBRA00N381750113308B^jBRA00N381750103308B^jBRA00N381750073308B^jBRA00N381750093308B^jBRA00N381750083308B^jBRA00N381750533308B`;
const sampleData2 = `12074986
49656484
A000N38175
00020
2023/11/20
LB02-00128A|20|jBRA00N381750253308B^jBRA00N381750433308B^jBRA00N381750243308B^jBRA00N381750173308B^jBRA00N381750183308B^jBRA00N381750193308B^jBRA00N381750203308B^jBRA00N381750213308B^jBRA00N381750223308B^jBRA00N381750013308B^jBRA00N381750033308B^jBRA00N381750043308B^jBRA00N381750053308B^jBRA00N381750503308B^jBRA00N381750113308B^jBRA00N381750103308B^jBRA00N381750073308B^jBRA00N381750093308B^jBRA00N381750083308B^jBRA00N381750533308B
`;
const sampleData3 = `TPBX20231122030
12075262
49656481
A095NBH013
3
2024/11/20
A095NBH014
17
2024/11/20
LA02-00536A|20|jSZA95NBH0140073Y17VB^jSZA95NBH0140083Y17VB^jSZA95NBH0140093Y17VB^jSZA95NBH0140103Y17VB^jSZA95NBH0140113Y17VB^jSZA95NBH0140123Y17VB^jSZA95NBH0140133Y17VB^jSZA95NBH0140143Y17VB^jSZA95NBH0140153Y17VB^jSZA95NBH0140163Y17VB^jSZA95NBH0140173Y17VB^jSZA95NBH0140183Y17VB^jSZA95NBH0140193Y17VB^jSZA95NBH0140203Y17VB^jSZA95NBH0140213Y17VB^jSZA95NBH0140223Y17VB^jSZA95NBH0140233Y17VB^jSZA95NBH0130103Y17VB^jSZA95NBH0130123Y17VB^jSZA95NBH0130133Y17VB
`;
const GridTextareaComponent = () => {
  const [inputs, setInputs] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const textAreaRefs = useRef([]);
  const [result, setResult] = useState([]);
  const [resultStyle, setResultStyle] = useState({});

  const addInput = () => {
    const newIndex = inputs.length + 1;
    const newInput = (
      <div key={newIndex} className="grid-item">
        <label>{newIndex}</label>
        <textarea
          ref={(ref) => (textAreaRefs.current[newIndex - 1] = ref)}
          placeholder={`QR No.${newIndex}`}
          onChange={() => saveToLocalStorage()}
          // onKeyDown={(e) => handleKeyDown(e, newIndex)}
        />
      </div>
    );

    setInputs((prevInputs) => [...prevInputs, newInput]);
  };

  const resetInputs = () => {
    setInputs([]);
    textAreaRefs.current = [];
    // Clear localStorage on reset
    localStorage.removeItem("textareaInputs");

    // getInputsAsJson();
    setInputs([]);
    textAreaRefs.current = [];
  };

  // const handleKeyDown = (event, index) => {
  //   if (event.key === "Enter") {
  //     event.preventDefault();
  //     focusNextTextarea(index);
  //   }
  // };

  // const focusNextTextarea = (currentIndex) => {
  //   const nextIndex = currentIndex;
  //   if (textAreaRefs.current[nextIndex]) {
  //     textAreaRefs.current[nextIndex].focus();
  //   } else {
  //     // If the current textarea is the last one, wrap to the first one
  //     textAreaRefs.current[0].focus();
  //   }
  // };
  const saveToLocalStorage = () => {
    const jsonInputs = textAreaRefs.current.map((textarea, index) => {
      if (textarea == null) return;
      return { [`${index + 1}`]: textarea.value };
    });

    localStorage.setItem("textareaInputs", JSON.stringify(jsonInputs));
  };

  const addSampleData = () => {
    textAreaRefs.current.forEach((textarea, index) => {
      if (textarea) {
        textarea.value = sampleData3;
        saveToLocalStorage(); // Save after adding sample data
      }
    });
  };

  const getInputsAsJson = async () => {
    // console.log(
    //   "textAreaRefs.current",
    //   textAreaRefs.current,
    //   textAreaRefs.current.length
    // );

    console.log("textAreaRefs.current", textAreaRefs.current);
    textAreaRefs.current = textAreaRefs.current.filter((item) => item !== null);

    const jsonInputs = textAreaRefs.current.map((textarea, index) => {
      console.log("textarea", textarea, index);
      if (textarea == null) return;
      return { [`${index + 1}`]: textarea.value };
    });

    console.log(JSON.stringify(jsonInputs, null, 2));
    console.log(jsonInputs);
    const rt = await window.icheonlib.saveXls(jsonInputs);
    console.log("rt", rt);
    if (rt.result == "success") {
      if (rt.message == "cancel") {
        setResult("저장취소");
        setResultStyle({});
      } else {
        setResult("저장성공");
        setResultStyle({ color: "white", backgroundColor: "skyblue" });
      }

      for (let i = 0; i < textAreaRefs.current.length; i++) {
        const textarea = textAreaRefs.current[i];
        if (textarea) {
          textarea.style.border = "";
        }
      }
    } else {
      setResult(`저장실패: (${rt.id + 1}) ${rt.message}`);
      setResultStyle({ color: "white", backgroundColor: "red" });

      if (rt.id >= 0) {
        const textarea = textAreaRefs.current[rt.id];
        // textarea 스타일 변경
        if (textarea) {
          textarea.style.border = "3px solid red";
        }
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // event.ctrlKey는 Ctrl 키가 눌렸는지 확인합니다.
      // event.keyCode는 눌린 키의 키코드를 나타냅니다. 49은 숫자 1의 키코드입니다.
      if (event.ctrlKey && event.keyCode === 49) {
        setShowButton(true);
      }
    };

    const handleKeyUp = (event) => {
      // Ctrl 키가 떼어지면 버튼을 숨깁니다.
      if (!event.ctrlKey) {
        setShowButton(false);
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // 컴포넌트가 언마운트되면 이벤트 리스너 해제
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="grid-textarea-component">
      <div class="button-container">
        <button onClick={addInput}>+</button>
        <button onClick={resetInputs}>Reset</button>
        <button onClick={getInputsAsJson}>Save Excel</button>
        {showButton && <button onClick={addSampleData}>Add Sample Data</button>}
        {result && <div style={resultStyle}>{result}</div>}
      </div>
      <br></br>
      <div className="grid-container">{inputs}</div>
    </div>
  );
};

export default GridTextareaComponent;

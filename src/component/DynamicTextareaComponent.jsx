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
A095NBH013
3
2024-11-16
A095NBH014
17
2024-11-16
LA02-00536A|20|jSZA95NBH0140073Y17VB^jSZA95NBH0140083Y17VB^jSZA95NBH0140093Y17VB^jSZA95NBH0140103Y17VB^jSZA95NBH0140113Y17VB^jSZA95NBH0140123Y17VB^jSZA95NBH0140133Y17VB^jSZA95NBH0140143Y17VB^jSZA95NBH0140153Y17VB^jSZA95NBH0140163Y17VB^jSZA95NBH0140173Y17VB^jSZA95NBH0140183Y17VB^jSZA95NBH0140193Y17VB^jSZA95NBH0140203Y17VB^jSZA95NBH0140213Y17VB^jSZA95NBH0140223Y17VB^jSZA95NBH0140233Y17VB^jSZA95NBH0130103Y17VB^jSZA95NBH0130123Y17VB^jSZA95NBH0130133Y17VB
`;
const GridTextareaComponent = () => {
  const [inputs, setInputs] = useState([]);
  const textAreaRefs = useRef([]);

  useEffect(() => {
    // Retrieve data from localStorage on component mount
    // const savedInputs = JSON.parse(localStorage.getItem("textareaInputs"));
    // if (savedInputs) {
    //   setInputs(savedInputs);
    // }
  }, []);

  const addInput = () => {
    const newIndex = inputs.length + 1;
    const newInput = (
      <div key={newIndex} className="grid-item">
        <label>{newIndex}</label>
        <textarea
          ref={(ref) => (textAreaRefs.current[newIndex - 1] = ref)}
          placeholder={`Textarea No.${newIndex}`}
          onChange={() => saveToLocalStorage()}
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
  };

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

  const getInputsAsJson = () => {
    console.log(textAreaRefs.current);
    const jsonInputs = textAreaRefs.current.map((textarea, index) => {
      if (textarea == null) return;
      return { [`${index + 1}`]: textarea.value };
    });

    console.log(JSON.stringify(jsonInputs, null, 2));
    console.log(jsonInputs);
    window.icheonlib.saveXls(jsonInputs);
  };

  return (
    <div className="grid-textarea-component">
      <button onClick={addInput}>+</button>
      <button onClick={resetInputs}>Reset</button>
      <button onClick={getInputsAsJson}>save excel</button>
      <button onClick={addSampleData}>Add Sample Data</button>

      <div className="grid-container">{inputs}</div>
    </div>
  );
};

export default GridTextareaComponent;

import React, { useState, useEffect } from "react";
import styles from "./Main.module.css";
import DynamicTextareaComponent from "./DynamicTextareaComponent";

// const { dialog } = require("electron");
export default function Main() {
  const [valueInput, setValueInput] = useState("");
  const [version, setVersion] = useState("");
  const [files, setFiles] = useState([]);
  const handleChange = (e) => {
    setValueInput(e.target.value);
    console.log(valueInput);
  };
  const handleSave = () => {
    window.icheonlib.saveXls(valueInput);
  };
  const loadSampleData = () => {
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
    setValueInput(data);
  };

  useEffect(() => {}, []);

  return (
    <div className="app-container">
      <DynamicTextareaComponent />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import styles from "./Main.module.css";
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
    const data =
      "LB02-00128A|20|jBRA00N381750253308B^jBRA00N381750433308B^jBRA00N381750243308B^jBRA00N381750173308B^jBRA00N381750183308B^jBRA00N381750193308B^jBRA00N381750203308B^jBRA00N381750213308B^jBRA00N381750223308B^jBRA00N381750013308B^jBRA00N381750033308B^jBRA00N381750043308B^jBRA00N381750053308B^jBRA00N381750503308B^jBRA00N381750113308B^jBRA00N381750103308B^jBRA00N381750073308B^jBRA00N381750093308B^jBRA00N381750083308B^jBRA00N381750533308B";
    setValueInput(data);
  };

  useEffect(() => {}, []);

  return (
    <>
      <div className="App">
        <header className="App-header">
          <textarea
            className={styles.textarea}
            value={valueInput}
            onChange={handleChange}
          />
          <button className={styles.button} onClick={handleSave}>
            엑셀저장하기
          </button>
          <button className={styles.button} onClick={loadSampleData}>
            샘플데이터넣어줘
          </button>
        </header>
      </div>
    </>
  );
}

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
    window.icheonlib.saveXls({ data: valueInput, filename: "test" });
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
        </header>
      </div>
    </>
  );
}

import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    { value: "highest_alphabet", label: "Highest Alphabet" },
  ];

  const handleSubmit = async () => {
    if (!isValidJson(jsonInput)) {
      setError("Invalid JSON format. Please correct it and try again.");
      setResponse(null);
      return;
    }

    try {
      const parsedJson = JSON.parse(jsonInput);
      console.log("Parsed JSON:", parsedJson);

      const res = await axios.post(
        "https://bajaj-backend-21-bce-9276.vercel.app/bfhl",
        parsedJson,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("API Response:", res.data);

      setResponse(res.data);
      setError("");
    } catch (err) {
      if (err.response) {
        console.error("API Error Response:", err.response.data);
        setError(`API Error: ${err.response.data.message || "Unknown error"}`);
      } else if (err.request) {
        console.error("No Response:", err.request);
        setError("No response received from the API");
      } else {
        console.error("Error", err.message);
        setError(`Error: ${err.message}`);
      }
      setResponse(null);
    }
  };

  const isValidJson = (jsonString) => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const filteredResponse = () => {
    if (!response || !selectedOptions.length) return null;

    let filteredData = "";

    if (selectedOptions.some((option) => option.value === "numbers")) {
      filteredData += `Numbers: ${response.numbers.join(", ")}\n`;
    }
    if (selectedOptions.some((option) => option.value === "alphabets")) {
      filteredData += `Alphabets: ${response.alphabets.join(", ")}\n`;
    }
    if (selectedOptions.some((option) => option.value === "highest_alphabet")) {
      filteredData += `Highest Alphabet: ${response.highest_alphabet}\n`;
    }

    return filteredData;
  };

  return (
    <div className="container">
      <h1>Shaik Vaseem Aman - 21BCE9276</h1>

      <div className="input-container">
        <label htmlFor="jsonInput">API Input</label>
        <textarea
          id="jsonInput"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {response && (
        <div className="dropdown-container">
          <label>Multi Filter</label>
          <Select isMulti options={options} onChange={setSelectedOptions} />
        </div>
      )}

      {response && (
        <div className="filtered-response">
          <h3>Filtered Response</h3>
          <pre>{filteredResponse()}</pre>
        </div>
      )}
    </div>
  );
}

export default App;

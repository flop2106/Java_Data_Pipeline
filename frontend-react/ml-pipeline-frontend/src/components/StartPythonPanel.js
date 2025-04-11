// src/components/StartPythonPanel.js
import React, { useState } from "react";

function StartPythonPanel({ onClose }) {
  const [requirementsPath, setRequirementsPath] = useState(
    ""
  );
  const [consoleOutput, setConsoleOutput] = useState("");

  const handleStart = async () => {
    try {
      const payload = {
        steps: [
          {
            type: "startpython",
            config: {
              requirements: requirementsPath,
            },
          },
        ],
      };
      const response = await fetch("http://localhost:8080/api/startPython", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.text();
        setConsoleOutput(data);
      } else {
        setConsoleOutput("Error starting Python environment.");
      }
    } catch (error) {
      setConsoleOutput("Exception: " + error.message);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        width: "300px",
        backgroundColor: "#f0f0f0",
        padding: "16px",
        boxShadow: "-2px 0px 5px rgba(0,0,0,0.3)",
        overflowY: "auto",
        zIndex: 2000,
      }}
    >
      <h3>Start Python Environment</h3>
      <label>Requirements Path:</label>
      <input
        type="text"
        value={requirementsPath}
        onChange={(e) => setRequirementsPath(e.target.value)}
        style={{ width: "100%", marginBottom: "8px" }}
      />
      <button onClick={handleStart} style={{ marginRight: "8px" }}>
        Start
      </button>
      <button onClick={onClose}>Close</button>
      <pre style={{ marginTop: "16px", backgroundColor: "#eee", padding: "8px" }}>
        {consoleOutput}
      </pre>
    </div>
  );
}

export default StartPythonPanel;

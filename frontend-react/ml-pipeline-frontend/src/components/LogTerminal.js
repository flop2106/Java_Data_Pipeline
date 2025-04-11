// src/components/LogTerminal.js
import React, { useState, useEffect } from "react";

function LogTerminal() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/logs");
        if (response.ok) {
          const data = await response.json(); // data is a list of strings
          setLogs(data);
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    // Fetch logs initially
    fetchLogs();

    // Poll every 2 seconds
    const intervalId = setInterval(fetchLogs, 2000);
    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  return (
    <div style={{ border: "1px solid #000", padding: "8px", marginTop: "16px", height: "200px", overflowY: "auto" }}>
      <h3>Server Logs</h3>
      <pre>{logs.join("\n")}</pre>
    </div>
  );
}

export default LogTerminal;

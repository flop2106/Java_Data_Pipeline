// src/components/PipelineBuilder.js
import React, { useState, useCallback, useEffect } from "react";
import DraggableStep from "./DraggableStep";
import ConfigurationPanel from "./ConfigurationPanel";
import StartPythonPanel from "./StartPythonPanel";
import LogTerminal from "./LogTerminal";

const PipelineBuilder = () => {
  const [steps, setSteps] = useState([]);
  const [selectedStepIndex, setSelectedStepIndex] = useState(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [showStartPythonPanel, setShowStartPythonPanel] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState("");
  const [executionStatus, setExecutionStatus] = useState(null);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [serverLogs, setServerLogs] = useState([]);

  // Poll server logs every 2 seconds
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/logs");
        if (response.ok) {
          const data = await response.json();
          setServerLogs(data);
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
    const intervalId = setInterval(fetchLogs, 2000);
    return () => clearInterval(intervalId);
  }, []);

  // Add a new step with default configuration
  const addStep = (type) => {
    let newStep = { type, config: {} };
    if (type === "CSVDatabase") {
      newStep.config = { csvPath: "" };
    } else if (type === "PythonScript") {
      newStep.type = "PythonScript"; // New type name
      newStep.config = {
        scriptPath: "",
        parameters: {}
      };
    }
    setSteps([...steps, newStep]);
  };

  // Reorder steps via drag-and-drop
  const moveStep = useCallback(
    (fromIndex, toIndex) => {
      const updatedSteps = [...steps];
      const [removed] = updatedSteps.splice(fromIndex, 1);
      updatedSteps.splice(toIndex, 0, removed);
      setSteps(updatedSteps);
    },
    [steps]
  );

  // Update the configuration of a step
  const updateStepConfig = (index, newConfig) => {
    const updated = [...steps];
    updated[index].config = newConfig;
    setSteps(updated);
  };

  // Open configuration panel for a step
  const handleSelectStep = (index) => {
    setSelectedStepIndex(index);
    setShowConfigPanel(true);
  };

  // Delete a step
  const handleDeleteStep = (index) => {
    const updatedSteps = [...steps];
    updatedSteps.splice(index, 1);
    setSteps(updatedSteps);
  };

  // Show JSON modal for viewing the pipeline payload
  const handleViewJson = () => {
    setShowJsonModal(true);
  };
  const closeJsonModal = () => {
    setShowJsonModal(false);
  };

  // Show Start Python panel
  const handleStartPython = () => {
    setShowStartPythonPanel(true);
  };
  const closeStartPythonPanel = () => {
    setShowStartPythonPanel(false);
  };

  // Stop Python environment
  const stopPython = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/stopPython", {
        method: "POST",
      });
      if (response.ok) {
        alert("Python environment stopped successfully!");
      } else {
        alert("Failed to stop Python environment.");
      }
    } catch (error) {
      alert("Error stopping environment: " + error.message);
    }
  };

  // Execute the pipeline by calling the API
  const executePipeline = async () => {
    setShowExecutionModal(true);
    setExecutionStatus(null);
    const payload = { steps };
    const payloadJson = JSON.stringify(payload, null, 2);
    setConsoleOutput("Executing pipeline...\n" + payloadJson + "\n");

    try {
      const response = await fetch("http://localhost:8080/api/executePipeline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setConsoleOutput((prev) => prev + "Pipeline execution failed:\n" + errorText + "\n");
        setExecutionStatus("failure");
        return;
      }

      const data = await response.text();
      setConsoleOutput((prev) => prev + "Server response:\n" + data + "\n");
      setExecutionStatus("success");
    } catch (error) {
      setConsoleOutput((prev) => prev + "Error executing pipeline: " + error.message + "\n");
      setExecutionStatus("failure");
    }
  };

  // Close the execution modal
  const closeExecutionModal = () => {
    setShowExecutionModal(false);
  };

  return (
    <div className="container-fluid">
      {/* Main Pipeline Builder Section */}
      <div className="row">
        <div className="col-md-8">
          <h2>Pipeline Builder</h2>
          <div className="mb-3">
            {/*
            <button className="btn btn-success me-2" onClick={() => addStep("CSVDatabase")}>
              Add CSVDatabase
            </button>
            */}
            <button className="btn btn-success me-2" onClick={() => addStep("PythonScript")}>
              Add PythonScript
            </button>
            <button className="btn btn-info" onClick={handleViewJson}>
              View JSON
            </button>
          </div>
          <div className="mb-3">
            <button className="btn btn-primary me-2" onClick={handleStartPython}>
              Start Python
            </button>
            <button className="btn btn-danger" onClick={stopPython}>
              Stop Python
            </button>
          </div>
          <div
            className="p-3 bg-light border"
            style={{ minHeight: "300px", position: "relative" }}
          >
            {steps.map((step, index) => (
              <div key={index} style={{ position: "relative" }}>
                <DraggableStep
                  step={step}
                  index={index}
                  moveStep={moveStep}
                  onSelect={handleSelectStep}
                  onDelete={handleDeleteStep}
                />
                {index < steps.length - 1 && (
                  <div
                    style={{
                      width: "2px",
                      height: "30px",
                      backgroundColor: "#333",
                      margin: "0 auto",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <button className="btn btn-warning mt-2" onClick={executePipeline}>
            Execute Pipeline
          </button>
        </div>
        {/* Right side: Configuration Panel */}
        <div className="col-md-4">
          {showConfigPanel && selectedStepIndex !== null && (
            <ConfigurationPanel
              step={steps[selectedStepIndex]}
              onUpdateConfig={(newConfig) => updateStepConfig(selectedStepIndex, newConfig)}
              onClose={() => setShowConfigPanel(false)}
            />
          )}
          {showStartPythonPanel && (
            <StartPythonPanel onClose={closeStartPythonPanel} />
          )}
        </div>
      </div>

      {/* Terminal Panel at the Bottom for Server Logs */}
      <div
        className="mt-3 p-3"
        style={{
          borderTop: "2px solid #ccc",
          backgroundColor: "#222",
          color: "#0f0",
          fontFamily: "monospace",
          height: "200px",
          overflowY: "auto",
        }}
      >
        <h3>Server Logs</h3>
        <pre style={{ margin: 0 }}>{serverLogs.join("\n")}</pre>
      </div>

      {/* JSON Modal */}
      {showJsonModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000 }}
          onClick={closeJsonModal}
        >
          <div
            className="bg-white p-3"
            style={{ maxWidth: "600px", maxHeight: "80%", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Pipeline JSON</h3>
            <pre>{JSON.stringify({ steps }, null, 2)}</pre>
            <button className="btn btn-secondary" onClick={closeJsonModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Execution Modal */}
      {showExecutionModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000 }}
          onClick={closeExecutionModal}
        >
          <div
            className="bg-white p-3"
            style={{ maxWidth: "600px", maxHeight: "80%", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Pipeline Execution Console</h3>
            <pre>{consoleOutput}</pre>
            {executionStatus && (
              <div style={{ color: executionStatus === "success" ? "green" : "red" }}>
                {executionStatus === "success" ? "Success!" : "Failure!"}
              </div>
            )}
            <button className="btn btn-secondary mt-2" onClick={closeExecutionModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PipelineBuilder;

// src/components/ConfigurationPanel.js
import React, { useState } from "react";

const ConfigurationPanel = ({ step, onUpdateConfig, onClose }) => {
  // Make a local copy of the config
  const [localConfig, setLocalConfig] = useState({ ...step.config });
  const [newParamName, setNewParamName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalConfig((prev) => ({ ...prev, [name]: value }));
  };

  // Parameters are now stored as an object. Render the keys.
  const handleParamChange = (key, field, newValue) => {
    setLocalConfig((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [key]: { ...prev.parameters[key], [field]: newValue },
      },
    }));
  };

  const handleRemoveParam = (key) => {
    setLocalConfig((prev) => {
      const updated = { ...prev.parameters };
      delete updated[key];
      return { ...prev, parameters: updated };
    });
  };

  const handleAddParam = () => {
    if (newParamName.trim() !== "") {
      setLocalConfig((prev) => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          [newParamName]: { type: "string", value: "" },
        },
      }));
      setNewParamName("");
    }
  };

  const handleSave = () => {
    onUpdateConfig(localConfig);
    onClose();
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
      }}
    >
      <h3>Configure {step.type}</h3>

      {step.type === "CSVDatabase" && (
        <>
          <label>CSV Path:</label>
          <input
            type="text"
            name="csvPath"
            value={localConfig.csvPath || ""}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "8px" }}
          />
        </>
      )}

      {step.type === "PythonScript" && (
        <>
          <label>Python Script Path:</label>
          <input
            type="text"
            name="scriptPath"
            value={localConfig.scriptPath || ""}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "8px" }}
          />



          <h4>Parameters</h4>
          {localConfig.parameters &&
            Object.keys(localConfig.parameters).map((key) => {
              const param = localConfig.parameters[key];
              return (
                <div key={key} style={{ border: "1px solid #ccc", padding: "8px", marginBottom: "8px" }}>
                  <strong>{key}</strong>
                  <label>Type:</label>
                  <select
                    value={param.type}
                    onChange={(e) => handleParamChange(key, "type", e.target.value)}
                    style={{ width: "100%", marginBottom: "4px" }}
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                  </select>
                  <label>Value:</label>
                  <input
                    type="text"
                    value={param.value}
                    onChange={(e) => handleParamChange(key, "value", e.target.value)}
                    style={{ width: "100%", marginBottom: "4px" }}
                  />
                  <button onClick={() => handleRemoveParam(key)}>Remove</button>
                </div>
              );
            })}
          <div>
            <input
              type="text"
              value={newParamName}
              onChange={(e) => setNewParamName(e.target.value)}
              placeholder="New parameter name"
              style={{ width: "100%", marginBottom: "4px" }}
            />
            <button onClick={handleAddParam}>Add Parameter</button>
          </div>
        </>
      )}

      <div style={{ marginTop: "16px" }}>
        <button onClick={handleSave} style={{ marginRight: "8px" }}>
          Save
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfigurationPanel;

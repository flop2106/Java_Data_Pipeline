// src/components/DraggableStep.js
import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemTypes = {
  STEP: "step",
};

const DraggableStep = ({ step, index, moveStep, onSelect, onDelete, onUpdateTitle }) => {
  const ref = useRef(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(step.nodeName || step.type);

  const [, drop] = useDrop({
    accept: ItemTypes.STEP,
    hover(item) {
      if (item.index !== index) {
        moveStep(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.STEP,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  // Handle title click to enable editing
  const handleTitleClick = (e) => {
    e.stopPropagation(); // Prevent triggering onSelect/drag
    if (onUpdateTitle) { // Only if renaming is allowed
      setIsEditingTitle(true);
    }
  };

  // Handle title changes while editing
  const handleTitleChange = (e) => {
    setTempTitle(e.target.value);
  };

  // Finalize title update when input loses focus or Enter is pressed
  const finalizeTitleUpdate = () => {
    if (onUpdateTitle) {
      onUpdateTitle(index, tempTitle);
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      finalizeTitleUpdate();
    }
  };

  // Use the node name if available, otherwise fallback to step type
  const displayName = step.nodeName || step.type;

  return (
    <div
      ref={ref}
      onClick={() => onSelect(index)}
      style={{
        opacity: isDragging ? 0.5 : 1,
        border: "1px solid gray",
        padding: "8px",
        marginBottom: "8px",
        backgroundColor: "#fff",
        cursor: "move",
        position: "relative",
      }}
    >
      {isEditingTitle ? (
        <input
          type="text"
          value={tempTitle}
          onChange={handleTitleChange}
          onBlur={finalizeTitleUpdate}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{ fontSize: "1em" }}
        />
      ) : (
        <strong onClick={handleTitleClick} style={{ cursor: onUpdateTitle ? "text" : "default" }}>
          {displayName}
        </strong>
      )}
      <div style={{ fontSize: "0.8em", marginTop: "4px" }}>
        Config: {JSON.stringify(step.config)}
      </div>
      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(index);
        }}
        style={{
          position: "absolute",
          top: 4,
          right: 4,
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        X
      </button>
    </div>
  );
};

export default DraggableStep;

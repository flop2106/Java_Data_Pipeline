// src/components/DraggableStep.js
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemTypes = {
  STEP: "step",
};

const DraggableStep = ({ step, index, moveStep, onSelect, onDelete }) => {
  const ref = useRef(null);

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

  // Display step.nodeName if available, otherwise fallback to step.type
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
      <strong>{displayName}</strong>
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

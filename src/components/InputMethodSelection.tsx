import React from "react";

export type InputMethod = "text" | "voice";

interface InputMethodSelectionProps {
  onSelect: (method: InputMethod) => void;
}

const InputMethodSelection: React.FC<InputMethodSelectionProps> = ({ onSelect }) => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>How would you like to chat?</h2>
      <div>
        <button
          onClick={() => onSelect("text")}
          style={{ fontSize: "20px", padding: "20px 40px", margin: "10px" }}
        >
          Text Input
        </button>
        <button
          onClick={() => onSelect("voice")}
          style={{ fontSize: "20px", padding: "20px 40px", margin: "10px" }}
        >
          Voice Input
        </button>
      </div>
    </div>
  );
};

export default InputMethodSelection;

import React, { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { toast } from "react-toastify";

interface TextInputFormProps {
  onSubmit: (input: string) => void;
  loading: boolean;
}

const TextInputForm: React.FC<TextInputFormProps> = ({ onSubmit, loading }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    } else {
      toast.error("Please enter some text.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-section">
        <textarea
          rows={4}
          placeholder="Type your query here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="text-input"
          required
        />
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? <TailSpin height="20" width="20" color="#fff" ariaLabel="loading" /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default TextInputForm;

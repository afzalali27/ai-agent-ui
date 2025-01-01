import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import TextInputForm from "./components/TextInputForm";
import VoiceInputForm from "./components/VoiceInputForm";
import TextResponse from "./components/TextResponse";
import { playAudio, stopAudioPlayback } from "./helpers";
import type { InputMethod } from "./components/InputMethodSelection";
import InputMethodSelection from "./components/InputMethodSelection";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const AIChatAgent: React.FC = () => {
  const [inputMethod, setInputMethod] = useState<InputMethod | null>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);

  const handleApiRequest = async (input: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/process-input?text_input=${encodeURIComponent(input)}`);
      if (res.data && res.data.response) {
        handleSuccess(res.data.response);
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }


  const handleSuccess = (response: string) => {
    setResponse(response);
    if (inputMethod === "voice") {
      setPlaying(true)
      playAudio(response, () => setPlaying(false));
    }
  }

  const stopAudio = () => {
    stopAudioPlayback();
    setPlaying(false);
  };

  return (
    <div className="agent-container">
      <h1 className="agent-title">AI Agent</h1>
      {!inputMethod && <InputMethodSelection onSelect={setInputMethod} />}

      {inputMethod === "text" && (
        <TextInputForm onSubmit={handleApiRequest} loading={loading} />
      )}
      {inputMethod === "voice" && (
        <VoiceInputForm onSubmit={handleApiRequest} loading={loading} readyToSpeak={!playing} showTranscription />
      )}

      {response && inputMethod === "text" && <TextResponse response={response} />}

      {playing && (
        <button className="stop-audio-button audio-playing" onClick={stopAudio}>
          Stop
        </button>
      )}

    </div>
  );
};

export default AIChatAgent;

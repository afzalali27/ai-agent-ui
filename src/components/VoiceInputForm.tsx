import { debounce } from "lodash";
import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { toast } from "react-toastify";

interface VoiceInputFormProps {
  onSubmit: (input: string) => void;
  loading: boolean;
  showTranscription?: boolean;
  readyToSpeak?: boolean
}

const VoiceInputForm: React.FC<VoiceInputFormProps> = ({ onSubmit, loading, showTranscription, readyToSpeak = true }) => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);

  const startListening = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Browser does not support speech recognition.");
      return;
    }
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    if (silenceTimer) {
      clearTimeout(silenceTimer);
      setSilenceTimer(null);
    }
  };

  const stopListening = debounce(() => {
    if (silenceTimer) {
      clearTimeout(silenceTimer);
      setSilenceTimer(null);
    }
    SpeechRecognition.stopListening();
    if (transcript.trim()) {
      onSubmit(transcript);
      resetTranscript();
    } else {
      toast.error("No voice input detected. Please try again.");
    }
  }, 500);

  useEffect(() => {
    if (!listening || !transcript.trim()) return;

    if (silenceTimer) {
      clearTimeout(silenceTimer);
    }

    const timer = setTimeout(() => {
      stopListening()
    }, 2000);

    setSilenceTimer(timer);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, listening]);

  return (
    <div>
      <div className="voice-section">
        <div className={`mic-container ${listening ? "listening" : ""}`}>
          {listening && <div className="pulse"></div>}
        </div>
        {readyToSpeak && <>
          {!listening ? <button type="button" onClick={startListening} className="mic-button" disabled={loading}>
            Start Speaking
          </button> :
            <button type="submit" className="mic-button" onClick={stopListening} disabled={loading}>
              Stop Speaking
            </button>}
        </>}
      </div>

      {!!showTranscription && <TranscriptDisplay transcript={transcript} />}
    </div>
  );
};

// MARK: - TranscriptDisplay

interface TranscriptDisplayProps {
  transcript: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript }) => (
  <div className="transcript-section">
    <p>{transcript}</p>
  </div>
);

export default VoiceInputForm;

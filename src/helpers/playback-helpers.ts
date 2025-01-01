let speechInstance: SpeechSynthesisUtterance | null = null;

export const playAudio = (text: string, onEnd: () => void) => {
  if (speechInstance) {
    window.speechSynthesis.cancel();
    speechInstance = null;
  }

  speechInstance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(speechInstance);

  speechInstance.onend = () => {
    speechInstance = null;
    onEnd();
  };
};

export const stopAudioPlayback = () => {
  if (speechInstance) {
    window.speechSynthesis.cancel();
    speechInstance = null;
  }
};

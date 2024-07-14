export const createAudioContext = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  return new AudioContext();
};

export const createAudioScriptProcessor = (audioContext) => {
  const bufferLength = 512;
  const scriptProcessor = audioContext.createScriptProcessor(bufferLength, 0, 2);
  scriptProcessor.bufferLeft = [];
  scriptProcessor.bufferRight = [];

  scriptProcessor.onaudioprocess = (event) => {
    const outputBuffer = event.outputBuffer;
    const leftChannel = outputBuffer.getChannelData(0);
    const rightChannel = outputBuffer.getChannelData(1);

    for (let i = 0; i < bufferLength; i++) {
      leftChannel[i] = scriptProcessor.bufferLeft.length ? scriptProcessor.bufferLeft.shift() : 0;
      rightChannel[i] = scriptProcessor.bufferRight.length ? scriptProcessor.bufferRight.shift() : 0;
    }
  };

  return scriptProcessor;
};

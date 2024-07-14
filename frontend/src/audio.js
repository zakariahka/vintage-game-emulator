export const createAudioContext = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    return new AudioContext();
  };
  
  export const createAudioScriptProcessor = (audioContext) => {
    const scriptProcessor = audioContext.createScriptProcessor(2048, 0, 2);
    scriptProcessor.bufferLeft = [];
    scriptProcessor.bufferRight = [];
    scriptProcessor.onaudioprocess = (e) => {
      const outputBuffer = e.outputBuffer;
      const leftChannel = outputBuffer.getChannelData(0);
      const rightChannel = outputBuffer.getChannelData(1);
  
      for (let i = 0; i < outputBuffer.length; i++) {
        leftChannel[i] = scriptProcessor.bufferLeft.length ? scriptProcessor.bufferLeft.shift() : 0;
        rightChannel[i] = scriptProcessor.bufferRight.length ? scriptProcessor.bufferRight.shift() : 0;
      }
    };
    return scriptProcessor;
  };
  
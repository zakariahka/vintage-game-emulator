import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { NES } from 'jsnes';
import { createAudioContext, createAudioScriptProcessor } from '../audio';

const EmulatorComponent = forwardRef(({ romData }, ref) => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioScriptProcessorRef = useRef(null);
  const nesRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getGameState: () => nesRef.current && nesRef.current.saveState(),
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const nes = new NES({
      onFrame: (frameBuffer) => {
        const imageData = context.getImageData(0, 0, 256, 240);
        for (let i = 0; i < frameBuffer.length; i++) {
          imageData.data[i * 4] = frameBuffer[i] & 0xff;
          imageData.data[i * 4 + 1] = (frameBuffer[i] >> 8) & 0xff;
          imageData.data[i * 4 + 2] = (frameBuffer[i] >> 16) & 0xff;
          imageData.data[i * 4 + 3] = 0xff;
        }
        context.putImageData(imageData, 0, 0);
      },
      onAudioSample: (left, right) => {
        const scriptProcessor = audioScriptProcessorRef.current;
        if (scriptProcessor) {
          scriptProcessor.bufferLeft.push(left);
          scriptProcessor.bufferRight.push(right);
        }
      },
    });

    const audioContext = createAudioContext();
    const scriptProcessor = createAudioScriptProcessor(audioContext);
    scriptProcessor.connect(audioContext.destination);
    audioContextRef.current = audioContext;
    audioScriptProcessorRef.current = scriptProcessor;

    nes.loadROM(romData);
    nesRef.current = nes;

    const runEmulator = () => {
      nes.frame();
      requestAnimationFrame(runEmulator);
    };
    runEmulator();

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [romData]);

  return (
    <canvas ref={canvasRef} width="256" height="240" style={{ width: '100%', height: 'auto' }} />
  );
});

export default EmulatorComponent;

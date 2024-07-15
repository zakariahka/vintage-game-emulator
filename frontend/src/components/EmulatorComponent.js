import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { NES } from 'jsnes';

const EmulatorComponent = forwardRef(({ romData }, ref) => {
  const canvasRef = useRef(null);
  const nesRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getGameState: () => nesRef.current && nesRef.current.saveState(),
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });

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
    });

    nes.loadROM(romData);
    nesRef.current = nes;

    const runEmulator = () => {
      nes.frame();
      requestAnimationFrame(runEmulator);
    };
    runEmulator();

    const handleKeyDown = (event) => {
      const { Controller } = NES;
      switch (event.key) {
        case 'ArrowUp':
          nes.buttonDown(1, Controller.BUTTON_UP);
          break;
        case 'ArrowDown':
          nes.buttonDown(1, Controller.BUTTON_DOWN);
          break;
        case 'ArrowLeft':
          nes.buttonDown(1, Controller.BUTTON_LEFT);
          break;
        case 'ArrowRight':
          nes.buttonDown(1, Controller.BUTTON_RIGHT);
          break;
        case 'z':
          nes.buttonDown(1, Controller.BUTTON_A);
          break;
        case 'x':
          nes.buttonDown(1, Controller.BUTTON_B);
          break;
        case 'Enter':
          nes.buttonDown(1, Controller.BUTTON_START);
          break;
        case 'Shift':
          nes.buttonDown(1, Controller.BUTTON_SELECT);
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      const { Controller } = NES;
      switch (event.key) {
        case 'ArrowUp':
          nes.buttonUp(1, Controller.BUTTON_UP);
          break;
        case 'ArrowDown':
          nes.buttonUp(1, Controller.BUTTON_DOWN);
          break;
        case 'ArrowLeft':
          nes.buttonUp(1, Controller.BUTTON_LEFT);
          break;
        case 'ArrowRight':
          nes.buttonUp(1, Controller.BUTTON_RIGHT);
          break;
        case 'z':
          nes.buttonUp(1, Controller.BUTTON_A);
          break;
        case 'x':
          nes.buttonUp(1, Controller.BUTTON_B);
          break;
        case 'Enter':
          nes.buttonUp(1, Controller.BUTTON_START);
          break;
        case 'Shift':
          nes.buttonUp(1, Controller.BUTTON_SELECT);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [romData]);

  return (
    <canvas ref={canvasRef} width="256" height="240" style={{ width: '100%', height: 'auto' }} />
  );
});

export default EmulatorComponent;

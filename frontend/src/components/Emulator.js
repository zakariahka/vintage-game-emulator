import React, { useState, useRef } from 'react';
import EmulatorComponent from './EmulatorComponent';
import { saveGame, loadGame } from '../services/api';

const Emulator = () => {
  const [romData, setRomData] = useState(null);
  const emulatorRef = useRef(null); // Define emulatorRef

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setRomData(reader.result);
    };
    reader.readAsBinaryString(file);
  };

  const handleSaveGame = async () => {
    try {
      const gameState = emulatorRef.current.getGameState();
      await saveGame(gameState);
      console.log('Game saved');
    } catch (error) {
      console.error('Save game failed', error);
    }
  };

  const handleLoadGame = async () => {
    try {
      const response = await loadGame();
      setRomData(response.data.game_state);
      console.log('Game loaded');
    } catch (error) {
      console.error('Load game failed', error);
    }
  };

  return (
    <div>
      <h1>Emulator</h1>
      <input type="file" accept=".nes" onChange={handleFileChange} />
      {romData && <EmulatorComponent ref={emulatorRef} romData={romData} />}
      <button onClick={handleSaveGame}>Save Game</button>
      <button onClick={handleLoadGame}>Load Game</button>
    </div>
  );
};

export default Emulator;

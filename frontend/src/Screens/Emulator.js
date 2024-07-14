import React, { useState, useRef } from 'react';
import EmulatorComponent from '../components/EmulatorComponent';
import { saveGame, loadGame } from '../services/api';

const Emulator = () => {
  const [romData, setRomData] = useState(null);
  const emulatorRef = useRef(null);

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
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Emulator</h1>
      <input type="file" accept=".nes" onChange={handleFileChange} className="mb-4" />
      {romData && <EmulatorComponent ref={emulatorRef} romData={romData} />}
      <div className="mt-4">
        <button
          onClick={handleSaveGame}
          className="bg-navy hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save Game
        </button>
        <button
          onClick={handleLoadGame}
          className="ml-2 bg-navy hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Load Game
        </button>
      </div>
    </div>
  );
};

export default Emulator;

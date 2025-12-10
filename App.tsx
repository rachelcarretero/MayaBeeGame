import React, { useState, useEffect } from 'react';
import { GRID_SIZE, createInitialGrid, DIRECTION_ROTATION, TRANSLATIONS } from './constants';
import { Direction, GameState, BeeState, Language } from './types';
import GridCell from './components/GridCell';
import Controls from './components/Controls';
import Jar from './components/Jar';
import { generateClassroomMap } from './services/geminiService';

const App: React.FC = () => {
  // Use lazy initialization for state so createInitialGrid (random) runs only once on mount
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialSetup = createInitialGrid();
    return {
      bee: { ...initialSetup.startPos, direction: 'N' },
      grid: initialSetup.grid,
      honeyCollected: 0,
      honeyTotal: initialSetup.totalHoney,
      status: 'playing',
      backgroundUrl: undefined
    };
  });

  const [language, setLanguage] = useState<Language>('es');
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  // Temporary message toaster
  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleGenerateMap = async () => {
    setIsGeneratingMap(true);
    const url = await generateClassroomMap();
    if (url) {
      setGameState(prev => ({ ...prev, backgroundUrl: url }));
    }
    setIsGeneratingMap(false);
  };

  const resetGame = () => {
    // Generates a new random grid
    const setup = createInitialGrid(); 
    setGameState(prev => ({
      bee: { ...setup.startPos, direction: 'N' },
      grid: setup.grid,
      honeyCollected: 0,
      honeyTotal: setup.totalHoney,
      status: 'playing',
      backgroundUrl: prev.backgroundUrl // Keep the map
    }));
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  // --- Core Game Logic ---

  const moveBee = (type: 'FORWARD' | 'BACKWARD') => {
    if (gameState.status === 'won') return;

    setGameState(prev => {
      const { x, y, direction } = prev.bee;
      let newX = x;
      let newY = y;

      // Bee-Bot Logic: Move based on where the bee is facing
      // If moving BACKWARD, we just reverse the delta
      const multiplier = type === 'FORWARD' ? 1 : -1;

      if (direction === 'N') newY = y - (1 * multiplier);
      if (direction === 'S') newY = y + (1 * multiplier);
      if (direction === 'E') newX = x + (1 * multiplier);
      if (direction === 'W') newX = x - (1 * multiplier);

      // 1. Boundary Check
      if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
        showMessage(t.wall);
        return prev; // Don't move
      }

      // 2. Content Check
      const cellContent = prev.grid[newY][newX];
      const newGrid = prev.grid.map(row => [...row]); // Deep copy for immutability
      let newCollected = prev.honeyCollected;
      let newStatus = prev.status;

      // Interaction: Honey
      if (cellContent === 'honey') {
        newGrid[newY][newX] = 'empty'; // Consume honey
        newCollected += 1;
        // Optional sound effect trigger here
      }

      // Interaction: Flower (Goal)
      if (cellContent === 'flower') {
        if (newCollected === prev.honeyTotal) {
          newStatus = 'won';
        } else {
          showMessage(`${t.needHoney} (${newCollected} / ${prev.honeyTotal})`);
        }
      }

      return {
        ...prev,
        bee: { ...prev.bee, x: newX, y: newY },
        grid: newGrid,
        honeyCollected: newCollected,
        status: newStatus
      };
    });
  };

  const rotateBee = (turn: 'LEFT' | 'RIGHT') => {
    if (gameState.status === 'won') return;

    setGameState(prev => {
      const dirs: Direction[] = ['N', 'E', 'S', 'W'];
      const currentIdx = dirs.indexOf(prev.bee.direction);
      
      // Calculate new index wrapping around 0-3
      let newIdx;
      if (turn === 'RIGHT') {
        newIdx = (currentIdx + 1) % 4;
      } else {
        newIdx = (currentIdx - 1 + 4) % 4;
      }

      return {
        ...prev,
        bee: { ...prev.bee, direction: dirs[newIdx] }
      };
    });
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.status === 'won') return;
      
      switch(e.key) {
        case 'ArrowUp': moveBee('FORWARD'); break;
        case 'ArrowDown': moveBee('BACKWARD'); break;
        case 'ArrowLeft': rotateBee('LEFT'); break;
        case 'ArrowRight': rotateBee('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status, language]); // Added dependencies

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4 font-sans selection:bg-yellow-200">
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl shadow-2xl p-6 overflow-hidden border-[6px] border-yellow-300 relative">
        
        {/* Language Toggle (Top Right) */}
        <button 
          onClick={toggleLanguage}
          className="absolute top-4 right-4 z-50 bg-white/80 hover:bg-white text-slate-500 font-bold py-1 px-3 rounded-full border border-slate-200 text-xs shadow-sm transition-colors"
        >
          {language === 'es' ? '🇺🇸 EN' : '🇪🇸 ES'}
        </button>

        {/* --- LEFT COLUMN: The Map (Grid) --- */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center relative p-2">
          
          <h2 className="text-2xl font-black text-orange-500 mb-4 lg:hidden">{t.mobileTitle}</h2>

          {/* Grid Container */}
          <div className="relative w-full max-w-xl aspect-square rounded-xl overflow-hidden shadow-2xl border-8 border-yellow-600 bg-slate-200">
            
            {/* Background Layer (Default Garden or AI Map) */}
            <div 
              className="absolute inset-0 transition-all duration-500"
              style={{ 
                // Default garden gradient if no AI map, otherwise the AI map
                background: gameState.backgroundUrl 
                    ? `url(${gameState.backgroundUrl}) center/cover no-repeat` 
                    : 'linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)' 
              }}
            >
                 {/* Grass texture overlay if no AI map */}
                 {!gameState.backgroundUrl && (
                     <div className="w-full h-full opacity-20" style={{backgroundImage: 'radial-gradient(circle, #fff 10%, transparent 10.5%)', backgroundSize: '20px 20px'}}></div>
                 )}
            </div>

            {/* Grid Cells Layer */}
            <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 z-10">
              {gameState.grid.map((row, y) => (
                row.map((cellType, x) => (
                  <div key={`${x}-${y}`} className="w-full h-full">
                    <GridCell 
                      type={cellType}
                      hasBee={gameState.bee.x === x && gameState.bee.y === y}
                      beeDirection={gameState.bee.direction}
                      isOdd={(x + y) % 2 !== 0}
                      startText={t.start}
                    />
                  </div>
                ))
              ))}
            </div>

            {/* Messages Toast */}
            {message && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white px-6 py-4 rounded-3xl shadow-[0_10px_25px_rgba(0,0,0,0.2)] border-4 border-orange-200 animate-bounce text-orange-600 font-black text-xl text-center whitespace-nowrap">
                 {message}
               </div>
            )}
             
            {/* Loading State */}
            {isGeneratingMap && (
              <div className="absolute inset-0 z-40 bg-white/80 flex flex-col items-center justify-center">
                <div className="w-20 h-20 border-8 border-orange-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-orange-600 font-bold text-xl animate-pulse">{t.painting}</p>
              </div>
            )}

          </div>
        </div>

        {/* --- RIGHT COLUMN: Controls & Status --- */}
        <div className="lg:col-span-4 flex flex-col items-center justify-between gap-6 bg-amber-50 rounded-2xl p-6 border-4 border-amber-100">
          
          <div className="text-center hidden lg:block mt-4">
            <h1 className="text-4xl font-black text-orange-500 tracking-tight drop-shadow-sm">{t.title}<br/><span className="text-yellow-500">{t.subtitle}</span></h1>
            <p className="text-slate-500 font-bold mt-2">{t.instruction}</p>
          </div>

          {/* Honey Jar Score */}
          <Jar collected={gameState.honeyCollected} total={gameState.honeyTotal} label={t.drops} />

          {/* Controls */}
          <div className="bg-white p-4 lg:p-6 rounded-[2rem] shadow-xl border-4 border-slate-100 w-full flex justify-center transform hover:scale-[1.02] transition-transform">
            <Controls 
              onMoveForward={() => moveBee('FORWARD')}
              onMoveBackward={() => moveBee('BACKWARD')}
              onTurnLeft={() => rotateBee('LEFT')}
              onTurnRight={() => rotateBee('RIGHT')}
              disabled={gameState.status === 'won'}
            />
          </div>

          {/* Actions - Icon Only for kids */}
          <div className="flex gap-4 w-full justify-center">
             
             {/* Magic Map Button */}
             <button 
              onClick={handleGenerateMap}
              className="w-20 h-20 bg-violet-100 hover:bg-violet-200 text-violet-600 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.1)] border-2 border-violet-200 active:shadow-none active:translate-y-1 transition-all flex items-center justify-center"
              disabled={isGeneratingMap}
              aria-label="Magic Map"
              title={t.painting} // Tooltip for adults
             >
               <span className="text-4xl filter drop-shadow-sm">✨</span> 
             </button>
             
             {/* Reset Button */}
             <button 
              onClick={resetGame}
              className="w-20 h-20 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.1)] border-2 border-blue-200 active:shadow-none active:translate-y-1 transition-all flex items-center justify-center"
              aria-label="Reset"
              title={t.playAgain}
             >
               <span className="text-4xl filter drop-shadow-sm">🔄</span> 
             </button>
          </div>

        </div>
      </div>

      {/* Win Modal */}
      {gameState.status === 'won' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden transform transition-all scale-100 border-8 border-yellow-300">
            {/* Confetti (CSS simplified) */}
            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400"></div>
            
            <div className="text-7xl mb-4 animate-bounce filter drop-shadow-md">🌻🐝</div>
            <h2 className="text-3xl font-black text-orange-500 mb-2">{t.wonTitle}</h2>
            <p className="text-slate-600 mb-8 text-lg font-medium leading-tight">{t.wonDesc}</p>
            
            <button 
              onClick={resetGame}
              className="w-full bg-green-500 text-white py-4 rounded-2xl font-black text-xl hover:bg-green-600 shadow-[0_6px_0_rgb(21,128,61)] active:shadow-none active:translate-y-[6px] transition-all"
            >
              {t.playAgain}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
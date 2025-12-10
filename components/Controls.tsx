import React from 'react';

interface ControlsProps {
  onMoveForward: () => void;
  onMoveBackward: () => void;
  onTurnLeft: () => void;
  onTurnRight: () => void;
  disabled: boolean;
}

// Straight Arrows for Movement
const ArrowUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
  </svg>
);

const ArrowDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
  </svg>
);

// Curved Arrows for Rotation (Clarifies that it turns in place)
const RotateLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
  </svg>
);

const RotateRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
  </svg>
);

const Controls: React.FC<ControlsProps> = ({ onMoveForward, onMoveBackward, onTurnLeft, onTurnRight, disabled }) => {
  const btnClass = "w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-[0_6px_0_rgb(0,0,0,0.2)] active:shadow-none active:translate-y-[6px] transition-all flex items-center justify-center text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Orange for Forward/Back (Movement)
  const moveBtnClass = `${btnClass} bg-orange-500 hover:bg-orange-400 border-b-4 border-orange-700`;
  // Blue for Rotation (Turning)
  const turnBtnClass = `${btnClass} bg-blue-500 hover:bg-blue-400 border-b-4 border-blue-700`;

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {/* Forward */}
      <div className="flex justify-center">
        <button className={moveBtnClass} onClick={onMoveForward} disabled={disabled} aria-label="Avanzar">
          <ArrowUp />
        </button>
      </div>

      {/* Middle Row: Turn Left, Spacer, Turn Right */}
      <div className="flex gap-4 justify-center items-center">
        <button className={turnBtnClass} onClick={onTurnLeft} disabled={disabled} aria-label="Girar Izquierda">
          <RotateLeft />
        </button>
        
        {/* Bee-Bot Logo center placeholder */}
        <div className="w-12 h-12 flex items-center justify-center bg-yellow-400 rounded-full border-2 border-black shadow-sm">
             <span className="text-2xl">👀</span>
        </div>

        <button className={turnBtnClass} onClick={onTurnRight} disabled={disabled} aria-label="Girar Derecha">
          <RotateRight />
        </button>
      </div>

      {/* Backward */}
      <div className="flex justify-center">
        <button className={moveBtnClass} onClick={onMoveBackward} disabled={disabled} aria-label="Retroceder">
          <ArrowDown />
        </button>
      </div>
    </div>
  );
};

export default Controls;

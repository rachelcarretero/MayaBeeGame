import React from 'react';
import { CellType, Direction } from '../types';
import { DIRECTION_ROTATION } from '../constants';

interface GridCellProps {
  type: CellType;
  hasBee: boolean;
  beeDirection: Direction;
  isOdd: boolean;
}

// --- SVG COMPONENTS ---

const BeeSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl filter">
    <g transform="translate(50,50)">
      {/* Wings (animated) */}
      <g className="animate-[pulse_0.5s_ease-in-out_infinite]">
        <ellipse cx="-20" cy="-10" rx="25" ry="18" fill="#E0F7FA" stroke="#4DD0E1" strokeWidth="2" className="opacity-90" />
        <ellipse cx="20" cy="-10" rx="25" ry="18" fill="#E0F7FA" stroke="#4DD0E1" strokeWidth="2" className="opacity-90" />
      </g>
      
      {/* Body Base */}
      <ellipse cx="0" cy="5" rx="35" ry="42" fill="#FFD700" stroke="#F57F17" strokeWidth="2" />
      
      {/* Stripes (Curved for volume) */}
      <path d="M-32 -5 Q0 -15 32 -5" stroke="#212121" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M-34 15 Q0 5 34 15" stroke="#212121" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M-25 35 Q0 25 25 35" stroke="#212121" strokeWidth="8" strokeLinecap="round" fill="none" />

      {/* Face */}
      <circle cx="-12" cy="-15" r="5" fill="#212121" />
      <circle cx="12" cy="-15" r="5" fill="#212121" />
      <path d="M-8 -5 Q0 0 8 -5" stroke="#212121" strokeWidth="2" fill="none" />

      {/* Cheeks */}
      <circle cx="-18" cy="-8" r="4" fill="#FF8A80" opacity="0.6" />
      <circle cx="18" cy="-8" r="4" fill="#FF8A80" opacity="0.6" />

      {/* Stinger */}
      <path d="M0 47 L-4 58 L4 58 Z" fill="#212121" />
    </g>
  </svg>
);

const HoneySVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg animate-float">
    {/* Main Drop */}
    <path d="M50 15 Q80 60 80 75 A30 30 0 0 1 20 75 Q20 60 50 15 Z" fill="#FFB300" stroke="#FF6F00" strokeWidth="2" />
    {/* Highlight for volume */}
    <ellipse cx="35" cy="65" rx="8" ry="12" fill="white" opacity="0.4" transform="rotate(20 35 65)" />
    {/* Shine top */}
    <circle cx="50" cy="75" r="25" fill="url(#honeyGradient)" opacity="0.3" />
    <defs>
      <radialGradient id="honeyGradient">
        <stop offset="0%" stopColor="#FFF176" />
        <stop offset="100%" stopColor="#FFB300" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

const FlowerSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
    <g className="animate-[bounce_2s_infinite]">
        {/* Leaves */}
        <path d="M50 80 Q20 80 10 50 Q50 60 50 80" fill="#66BB6A" stroke="#2E7D32" strokeWidth="1" />
        <path d="M50 80 Q80 80 90 50 Q50 60 50 80" fill="#66BB6A" stroke="#2E7D32" strokeWidth="1" />
        
        {/* Petals */}
        <g fill="#F48FB1" stroke="#C2185B" strokeWidth="1">
            <circle cx="50" cy="20" r="15" />
            <circle cx="80" cy="50" r="15" />
            <circle cx="50" cy="80" r="15" />
            <circle cx="20" cy="50" r="15" />
            <circle cx="29" cy="29" r="15" />
            <circle cx="71" cy="29" r="15" />
            <circle cx="71" cy="71" r="15" />
            <circle cx="29" cy="71" r="15" />
        </g>

        {/* Center */}
        <circle cx="50" cy="50" r="20" fill="#FFF176" stroke="#FBC02D" strokeWidth="2" />
        
        {/* Face */}
        <circle cx="43" cy="45" r="2" fill="#212121" />
        <circle cx="57" cy="45" r="2" fill="#212121" />
        <path d="M45 55 Q50 60 55 55" stroke="#212121" strokeWidth="2" fill="none" />
    </g>
  </svg>
);

const StartMatSVG = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-60">
        <rect x="10" y="10" width="80" height="80" rx="10" fill="#8D6E63" stroke="#5D4037" strokeWidth="2" />
        <rect x="15" y="15" width="70" height="70" rx="5" fill="none" stroke="#D7CCC8" strokeWidth="2" strokeDasharray="5,5" />
        <text x="50" y="55" textAnchor="middle" fontSize="14" fill="#EFEBE9" fontFamily="sans-serif" fontWeight="bold">INICIO</text>
    </svg>
);

// --- MAIN COMPONENT ---

const GridCell: React.FC<GridCellProps> = ({ type, hasBee, beeDirection, isOdd }) => {
  // Stronger grid lines for better visibility
  const baseClasses = `w-full h-full relative flex items-center justify-center border-slate-300 border-2`;
  
  // Subtle checkerboard pattern to help counting squares
  const bgClasses = isOdd ? 'bg-white/40' : 'bg-white/20';

  return (
    <div className={`${baseClasses} ${bgClasses} backdrop-blur-[1px]`}>
      
      {/* --- FLOOR ITEMS --- */}
      
      {/* Start Mat */}
      {type === 'start' && !hasBee && (
         <div className="w-[80%] h-[80%]">
             <StartMatSVG />
         </div>
      )}

      {/* Honey Drop */}
      {!hasBee && type === 'honey' && (
        <div className="w-[60%] h-[60%]">
            <HoneySVG />
        </div>
      )}
      
      {/* Flower Goal */}
      {type === 'flower' && (
        <div className="w-[85%] h-[85%]">
            <FlowerSVG />
        </div>
      )}

      {/* --- THE BEE (Top Layer) --- */}
      {hasBee && (
        <div 
          className="w-[85%] h-[85%] transition-transform duration-500 ease-in-out z-20 drop-shadow-2xl"
          style={{ 
            transform: `rotate(${DIRECTION_ROTATION[beeDirection]}deg)`,
            filter: 'drop-shadow(0px 10px 6px rgba(0,0,0,0.3))' // Floating effect shadow
          }}
        >
          <BeeSVG />
        </div>
      )}
    </div>
  );
};

export default GridCell;
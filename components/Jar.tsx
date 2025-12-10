import React from 'react';

interface JarProps {
  collected: number;
  total: number;
}

const Jar: React.FC<JarProps> = ({ collected, total }) => {
  // Calculate fill percentage (clamp between 5% and 100% for visuals)
  const percentage = total === 0 ? 0 : Math.max(5, (collected / total) * 100);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-32 md:w-32 md:h-40 bg-white/50 rounded-b-3xl rounded-t-xl border-4 border-slate-300 overflow-hidden shadow-xl backdrop-blur-sm">
        
        {/* Lid */}
        <div className="absolute top-0 left-0 w-full h-4 bg-red-500 border-b-2 border-red-700 z-20 shadow-sm"></div>
        
        {/* Glass Reflection */}
        <div className="absolute top-6 left-2 w-3 h-20 bg-white opacity-40 rounded-full rotate-2 z-20 pointer-events-none"></div>

        {/* Honey Liquid */}
        <div 
          className="absolute bottom-0 left-0 w-full bg-amber-400 transition-all duration-700 ease-in-out border-t-4 border-amber-300"
          style={{ height: `${percentage}%` }}
        >
          {/* Bubbles in the honey */}
          <div className="absolute w-2 h-2 bg-amber-200 rounded-full top-2 left-4 animate-ping opacity-75"></div>
          <div className="absolute w-3 h-3 bg-amber-200 rounded-full top-6 right-8 animate-pulse opacity-50"></div>
        </div>

        {/* Empty State Text */}
        {collected === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10 opacity-50">
            <span className="text-4xl grayscale">🍯</span>
          </div>
        )}
      </div>

      {/* Score Text */}
      <div className="mt-2 bg-white/80 px-4 py-1 rounded-full font-black text-slate-700 border border-slate-200 shadow-sm">
        {collected} / {total} Gotas
      </div>
    </div>
  );
};

export default Jar;

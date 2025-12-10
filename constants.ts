import { Direction, CellType } from './types';

export const GRID_SIZE = 5;

export const INITIAL_BEE_DIRECTION: Direction = 'N';

export const DIRECTION_ROTATION: Record<Direction, number> = {
  'N': 0,
  'E': 90,
  'S': 180,
  'W': 270,
};

// Helper to create the initial grid
export const createInitialGrid = (): { grid: CellType[][], totalHoney: number, startPos: {x: number, y: number} } => {
  const grid: CellType[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty'));
  
  // Configuration similar to your request
  // (0,0 is Top-Left)
  
  // Start Position (Bottom-Left usually, e.g., Door)
  const startX = 0;
  const startY = 4;
  grid[startY][startX] = 'start'; // Mark start visually if needed

  // Honey Drops (Fixed positions for demo)
  const honeyPositions = [
    { x: 2, y: 2 },
    { x: 3, y: 1 },
    { x: 1, y: 3 },
    { x: 4, y: 3 }
  ];

  honeyPositions.forEach(pos => {
    grid[pos.y][pos.x] = 'honey';
  });

  // Flower (Goal)
  grid[0][4] = 'flower';

  return {
    grid,
    totalHoney: honeyPositions.length,
    startPos: { x: startX, y: startY }
  };
};

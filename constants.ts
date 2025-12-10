import { Direction, CellType, Language } from './types';

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
  
  // Start Position (Bottom-Left)
  const startX = 0;
  const startY = 4;
  grid[startY][startX] = 'start'; 

  // Flower (Goal) - Top Right
  const flowerX = 4;
  const flowerY = 0;
  grid[flowerY][flowerX] = 'flower';

  // Random Honey Drops
  // We place 4 drops randomly in empty cells (avoiding Start and Flower)
  let dropsToPlace = 4;
  
  while (dropsToPlace > 0) {
    const rx = Math.floor(Math.random() * GRID_SIZE);
    const ry = Math.floor(Math.random() * GRID_SIZE);

    // Only place if the cell is currently empty
    // This automatically prevents overwriting Start or Flower
    if (grid[ry][rx] === 'empty') {
      grid[ry][rx] = 'honey';
      dropsToPlace--;
    }
  }

  return {
    grid,
    totalHoney: 4,
    startPos: { x: startX, y: startY }
  };
};

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  es: {
    title: "Aventura",
    subtitle: "de Maya 🐝",
    instruction: "¡Lleva la miel a la flor!",
    drops: "Gotas",
    wall: "¡Auch! Una pared 🧱",
    needHoney: "¡Falta miel!",
    wonTitle: "¡Lo conseguiste!",
    wonDesc: "Maya está muy contenta con toda su miel.",
    playAgain: "¡Jugar Otra Vez!",
    painting: "Pintando el aula...",
    mobileTitle: "La Aventura de Maya",
    start: "INICIO"
  },
  en: {
    title: "Maya's",
    subtitle: "Adventure 🐝",
    instruction: "Take the honey to the flower!",
    drops: "Drops",
    wall: "Ouch! A wall 🧱",
    needHoney: "Need more honey!",
    wonTitle: "You did it!",
    wonDesc: "Maya is very happy with all her honey.",
    playAgain: "Play Again!",
    painting: "Painting the room...",
    mobileTitle: "Maya's Adventure",
    start: "START"
  }
};
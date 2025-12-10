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
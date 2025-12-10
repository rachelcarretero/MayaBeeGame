export type Direction = 'N' | 'E' | 'S' | 'W';

export type CellType = 'empty' | 'honey' | 'flower' | 'start' | 'wall';

export type Language = 'es' | 'en';

export interface BeeState {
  x: number;
  y: number;
  direction: Direction;
}

export interface GameState {
  bee: BeeState;
  grid: CellType[][]; // 2D Array as requested
  honeyCollected: number;
  honeyTotal: number;
  status: 'playing' | 'won';
  backgroundUrl?: string;
}
import { validate, version } from 'uuid';
import { create } from 'zustand';

interface GameState {
  gameId: string | null;
  setGameId: (id: string) => boolean; // returns true if valid, false if invalid
  clearGameId: () => void;
  updateGameId: (updater: (prevId: string | null) => string | null) => boolean;
  isValidUuid4: (id: string) => boolean;

  roundId: string | null;
  setRoundId: (id: string) => boolean; // returns true if valid, false if invalid
  clearRoundId: () => void;
  updateRoundId: (updater: (prevId: string | null) => string | null) => boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameId: null,
  roundId: null,

  // Check if given ID is a valid UUID v4
  isValidUuid4: (id) => validate(id) && version(id) === 4,

  setGameId: (id) => {
    const { isValidUuid4 } = get();
    if (!isValidUuid4(id)) return false;
    set({ gameId: id });
    return true;
  },

  clearGameId: () => set({ gameId: null }),

  updateGameId: (updater) => {
    const { isValidUuid4 } = get();
    const newId = updater(get().gameId);
    if (newId !== null && !isValidUuid4(newId)) return false;
    set({ gameId: newId });
    return true;
  },

  setRoundId: (id) => {
    const { isValidUuid4 } = get();
    if (!isValidUuid4(id)) return false;
    set({ roundId: id });
    return true;
  },

  clearRoundId: () => set({ roundId: null }),

  updateRoundId: (updater) => {
    const { isValidUuid4 } = get();
    const newId = updater(get().roundId);
    if (newId !== null && !isValidUuid4(newId)) return false;
    set({ roundId: newId });
    return true;
  }
}));

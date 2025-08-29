import type { RoundStatus } from './round.type';

export type GameStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface GameListEntity {
  id: string;
  name: string;
  description: string | null;
  status: GameStatus;
  totalRounds: number;
  entryFee: string;
  startedAt: string;
  endedAt: string;
  currency: string;
}

export interface GameDetailEntity {
  id: string;
  name: string;
  description: string | null;
  status: GameStatus;
  totalRounds: number;
  entryFee: string;
  startedAt: string;
  endedAt: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  rounds: {
    id: string;
    name: string;
    roundNumber: number;
    status: RoundStatus;
    prize: string; // decimal as string
    startedAt: string;
    endedAt: string | null;
  }[];
}

export interface CreateGameApiInput {
  name: string;
  description?: string;
  entryFee: string;
  startedAt: string; // ISO String
}

export class UpdateGameApiInput {
  name?: string;
  description?: string;
  entryFee?: string;
  startedAt?: string;
}

export interface GameQueryParamsIface {
  offset: number;
  limit: number;
  search?: string;
  entryFee?: string;
  status?: GameStatus;
}

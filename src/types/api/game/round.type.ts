import type { BaseQueryParamsIface } from '../base/base.type';

export type RoundStatus = 'pending' | 'active' | 'completed';

export interface RoundListEntity {
  id: string;
  name: string;
  roundNumber: number;
  status: RoundStatus;
  prize: string; // could also be number if you want to parse decimals
  startedAt: string; // ISO date string, or Date if you parse
  endedAt: string | null;
}

interface Pattern {
  id: string;
  name: string;
  type: 'static' | 'dynamic'; // adjust if there are other types
  description: string | null;
  coordinates: [number, number][];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface RoundDetailEntity {
  id: string;
  name: string;
  roundNumber: number;
  status: RoundStatus;
  prize: string; // or number if you parse it
  startedAt: string;
  endedAt: string | null;
  description: string | null;
  rows: number;
  cols: number;
  freespaceEnabled: boolean;
  freeRowPos: number | null;
  freeColPos: number | null;
  minRange: number;
  maxRange: number;
  patterns: Pattern[];
  calls: object[];
  createdAt: string;
  updatedAt: string;
}

export interface RoundQueryParamsIface extends BaseQueryParamsIface {
  status?: RoundStatus;
  gameId?: string;
}

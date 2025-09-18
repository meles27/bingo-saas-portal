// --- DTOs are usually defined in a shared library or API package ---
// For this example, we'll define simplified versions of the DTOs
export interface BingoCallDetailDto {
  id: string;
  number: number;
  sequence: number;
}
export interface WinnerDetailDto {
  id: string;
  status: string;
  participant: { id: string };
}
export interface RoundDetailDto {
  id: string;
  status: string;
  roundNumber: number;
}
// --------------------------------------------------------------------

/**
 * Standardized status codes for all socket events.
 */
export enum SocketStatus {
  SUCCESS = 'success', // The operation was successful.
  ERROR = 'error', // A critical error occurred.
  INFO = 'info' // Informational message (e.g., 'Player X has joined').
}

/**
 * Defines the names of all possible server-to-client events.
 * Using a string enum makes debugging easier and provides type safety.
 */
export enum SocketEvent {
  // Round & Call Events
  NEW_BINGO_CALL = 'round:new_call',
  ROUND_STATUS_UPDATE = 'round:status_update',

  // Winner Events
  BINGO_CLAIM_PENDING = 'winner:claim_pending',
  WINNER_VERIFIED = 'winner:verified',

  // Generic/System Events
  NOTIFICATION = 'system:notification',
  ERROR = 'system:error' // A generic error event for unhandled failures
}

/**
 * A standardized payload for error responses.
 */
export interface SocketErrorPayload {
  code: string; // e.g., 'VALIDATION_ERROR', 'UNAUTHORIZED'
  message: string;
  details?: Record<string, any>;
}

// --- The Core Discriminated Union Response Type ---

interface BaseSocketResponse {
  event: SocketEvent;
  entity?: string;
  timestamp: string;
  requestId?: string;
}

interface SuccessSocketResponse<T> extends BaseSocketResponse {
  status: SocketStatus.SUCCESS;
  payload: T;
}

interface InfoSocketResponse<T> extends BaseSocketResponse {
  status: SocketStatus.INFO;
  payload: T;
}

interface ErrorSocketResponse extends BaseSocketResponse {
  status: SocketStatus.ERROR;
  payload: SocketErrorPayload;
}

/**
 * The single, universal response type for all server-to-client communication.
 */
export type SocketResponse<T = unknown> =
  | SuccessSocketResponse<T>
  | InfoSocketResponse<T>
  | ErrorSocketResponse;

/**
 * Standardized status codes for all socket events.
 */
export const SocketStatus = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
} as const;

/** Type-safe union for SocketStatus */
export type SocketStatus = (typeof SocketStatus)[keyof typeof SocketStatus];

export const SocketEvent = {
  // Tenant world (per-tenant namespace)
  T_CONNECT: "t:connect",
  T_WELCOME: "t:welcome",
  T_DISCONNECT: "t:disconnect",
  T_AUTH: "t:auth",
  T_BROADCAST: "t:broadcast",
  T_NOTIFY: "t:notify",
  T_ERROR: "t:error",

  // User related
  T_CREATE_USER: "t:create-user",
  T_UPDATE_USER: "t:update-user",
  T_DELETE_USER: "t:delete-user",

  // Game related
  T_GAME_SCHEDULED: "t:game-scheduled",
  T_GAME_STARTED: "t:game-started",
  T_NEW_NUMBER_CALLED: "t:game-new_number",
  T_GAME_PAUSED: "t:game-paused",
  T_GAME_RESUMED: "t:game-resumed",
  T_WINNER_CLAIMED: "t:game-winner_claimed",
  T_GAME_OVER: "t:game-over",

  // System world (SaaS provider / control plane)
  S_CONNECT: "s:connect",
  S_DISCONNECT: "s:disconnect",
  S_AUTH: "s:auth",
  S_CREATE_TENANT: "s:create-tenant",
  S_UPDATE_TENANT: "s:update-tenant",
  S_DELETE_TENANT: "s:delete-tenant",
  S_CREATE_PLAN: "s:create-plan",
  S_UPDATE_PLAN: "s:update-plan",
  S_DELETE_PLAN: "s:delete-plan",
  S_NOTIFY: "s:notify",
  S_ERROR: "s:error",
} as const;

// Type helper to get union of all values
export type SocketEvent = (typeof SocketEvent)[keyof typeof SocketEvent];

/**
 * A standardized payload for error responses.
 */
export interface SocketErrorPayload {
  code: string; // e.g., 'VALIDATION_ERROR', 'UNAUTHORIZED'
  message: string;
  details?: Record<string, any>; // Optional field for more detailed error info
}

/**
 * Defines the structure of the data object that will be sent as the payload
 * in every socket emission.
 *
 * @template T The type of the core data being sent.
 */
export interface SocketPayload<T> {
  /** The name of the event being emitted. */
  event: SocketEvent;

  /** The standardized status of the message. */
  status: SocketStatus;

  /** An ISO 8601 timestamp of when the message was created. */
  timestamp: string;

  /** The core data payload of the message. */
  payload: T;
}

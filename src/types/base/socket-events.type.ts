/**
 * Defines the events emitted from the Server to the Client.
 * The key is the event name, and the value is the function signature of the listener.
 */
export interface ServerToClientEvents {
  newNumberCalled: (data: { number: number; calledAt: string }) => void;
  playerJoined: (data: { userId: string; name: string }) => void;
  gameWinner: (data: { winnerName: string; prize: number }) => void;
  reconnect_attempt: (attempt: number) => void; // Standard event
  error: (data: { message: string }) => void;
}

/**
 * Defines the events emitted from the Client to the Server.
 * The key is the event name, and the value is the function signature of the emitter.
 * You can include acknowledgement callbacks here.
 */
export interface ClientToServerEvents {
  joinGame: (
    data: { shopId: string; gameId: string },
    ack: (response: { status: 'ok' | 'error'; message?: string }) => void
  ) => void;
  callBingo: (data: { gameId: string; cardData: number[][] }) => void;
}

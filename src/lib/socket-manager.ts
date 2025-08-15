import { urls } from '@/config/urls';
import { io, Socket } from 'socket.io-client';
import type {
  ClientToServerEvents,
  ServerToClientEvents
} from '../types/base/socket-events.type';

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

class SocketManager {
  private static instance: SocketManager;
  private socket: TypedSocket | null = null;

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public connect(token: string, subdomain: string, namespace: string): void {
    if (this.socket && this.socket.connected) {
      return;
    }

    if (this.socket) {
      this.socket.disconnect();
    }

    const socketUrl = urls.get_sock_base_url(subdomain, namespace);
    console.log(`Attempting to connect to ${socketUrl}`);

    // The 'io' function is also generic and accepts our event types
    this.socket = io(socketUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      autoConnect: false,
      auth: {
        token
      }
    });

    // You can still add generic listeners for debugging if needed
    this.socket.on('connect', () => {
      console.log(`Socket connected successfully with id: ${this.socket?.id}`);
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${reason}`);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    this.socket.connect();
  }

  public disconnect(): void {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
      this.socket = null;
    } else {
      this.socket = null;
    }
  }

  /**
   * return the raw socket
   */
  public getSocket() {
    return this.socket;
  }
  /**
   * Registers a type-safe event listener.
   */
  public on<E extends keyof ServerToClientEvents>(
    eventName: E,
    callback: ServerToClientEvents[E]
  ): void {
    this.socket?.on(eventName, callback as any); // Type assertion is safe here
  }

  /**
   * Removes a type-safe event listener.
   */
  public off<E extends keyof ServerToClientEvents>(
    eventName: E,
    callback: ServerToClientEvents[E]
  ): void {
    this.socket?.off(eventName, callback as any); // Type assertion is safe here
  }

  /**
   * Emits a type-safe event to the server.
   * The arguments are automatically type-checked against the ClientToServerEvents interface.
   */
  public emit<E extends keyof ClientToServerEvents>(
    eventName: E,
    ...args: Parameters<ClientToServerEvents[E]>
  ): void {
    this.socket?.emit(eventName, ...args);
  }
}

// Export the single, ready-to-use instance
export const socketManager = SocketManager.getInstance();

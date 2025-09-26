import { useAuthStore } from '@/store/authStore';
import { useConfigStore } from '@/store/configStore';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { SocketEvent, type SocketResponse } from './socket.schema';

// --- Type Definitions ---
export type NamespaceType = 'private' | 'public';
export type SocketEventListener<T = unknown> = (
  response: SocketResponse<T>
) => void;

// --- Helper Functions ---
const getSocketUrl = (subdomain: string, type: NamespaceType): string => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  // In a real app, you'd use environment variables for the host
  const baseHost =
    process.env.NODE_ENV === 'production'
      ? window.location.host
      : 'localhost:3000'; // Your local development server

  const namespace =
    type === 'private' ? `tenant-${subdomain}` : `public-${subdomain}`;
  return `${protocol}://${baseHost}/${namespace}`;
};

/**
 * A robust, multitenant-aware class to manage all Socket.IO connections.
 * This class maintains a pool of connections and is reactive to auth state changes.
 */
class SocketManager {
  private sockets: Map<NamespaceType, Socket> = new Map();

  constructor() {
    // Subscribe to the auth store to automatically manage private connections.
    useAuthStore.subscribe((state, prevState) => {
      // User logged in: establish private connection.
      if (state.token?.access && !prevState.token?.access) {
        console.log(
          '[SocketManager] Auth token detected. Connecting private socket.'
        );
        this.connect('private');
      }
      // User logged out: terminate private connection.
      if (!state.token?.access && prevState.token?.access) {
        console.log(
          '[SocketManager] Auth token removed. Disconnecting private socket.'
        );
        this.disconnect('private');
      }
    });
  }

  /**
   * Explicitly establishes a connection for a given namespace type.
   */
  public connect(type: NamespaceType): Socket | null {
    const subdomain = useConfigStore.getState().getTenantSubDomain();
    if (!subdomain) {
      console.error(
        '[SocketManager] Cannot connect without a tenant subdomain.'
      );
      return null;
    }

    if (this.sockets.get(type)?.connected) {
      return this.sockets.get(type)!;
    }

    this.disconnect(type); // Ensure any old connection is closed first.

    const url = getSocketUrl(subdomain, type);
    let newSocket: Socket;

    if (type === 'private') {
      const token = useAuthStore.getState().token?.access;
      if (!token) {
        console.warn(
          '[SocketManager] Attempted to connect to private namespace without a token. Aborting.'
        );
        return null;
      }
      newSocket = io(url, { auth: { token } });
    } else {
      // 'public'
      newSocket = io(url);
    }

    this.addDefaultListeners(newSocket, type, subdomain);
    this.sockets.set(type, newSocket);
    console.log(`[SocketManager] Connection initiated for ${type} namespace.`);
    return newSocket;
  }

  /**
   * Returns an existing socket instance without creating a new one.
   */
  public getSocket(type: NamespaceType): Socket | null {
    return this.sockets.get(type) || null;
  }

  private addDefaultListeners(
    socket: Socket,
    type: NamespaceType,
    subdomain: string
  ) {
    socket.on('connect', () =>
      toast.success(`Connected to ${type} channel for ${subdomain}.`)
    );
    socket.on('disconnect', (reason) =>
      toast.warn(`Disconnected from ${type} channel: ${reason}`)
    );
    socket.on('connect_error', (err) =>
      toast.error(`Connection failed for ${type} channel: ${err.message}`)
    );
    socket.on(SocketEvent.ERROR, (response: SocketResponse) => {
      if (response.status === 'error') {
        toast.error(`Server Error: ${response.payload.message}`);
      }
    });
  }

  public on<T>(
    type: NamespaceType,
    eventName: string,
    handler: SocketEventListener<T>
  ) {
    const socket = this.getSocket(type);
    socket?.on(eventName, handler);
  }

  public off<T>(
    type: NamespaceType,
    eventName: string,
    handler: SocketEventListener<T>
  ) {
    const socket = this.getSocket(type);
    socket?.off(eventName, handler);
  }

  public emit<TPayload = unknown, TResponse = unknown>(
    type: NamespaceType,
    eventName: string,
    payload: TPayload,
    ack?: (response: TResponse) => void
  ) {
    const socket = this.getSocket(type);
    if (socket?.connected) {
      socket.emit(eventName, payload, ack);
    } else {
      console.warn(
        `[SocketManager] Could not emit event '${eventName}'. Socket '${type}' is not connected.`
      );
    }
  }

  public disconnect(type: NamespaceType) {
    const socket = this.sockets.get(type);
    if (socket) {
      console.log(`[SocketManager] Disconnecting from ${type} namespace.`);
      socket.disconnect();
      this.sockets.delete(type);
    }
  }

  public disconnectAll() {
    this.sockets.forEach((_, type) => this.disconnect(type));
  }
}

// Create a singleton instance for use throughout the application.
export const socketManager = new SocketManager();

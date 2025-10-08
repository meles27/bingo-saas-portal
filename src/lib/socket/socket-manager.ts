import { urls } from '@/config/urls';
import { useConfigStore } from '@/store/config-store';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { SocketEvent, SocketStatus, type SocketPayload } from './socket.schema';

export type NamespaceType = 'private' | 'public';

// const getSocketUrl = (subdomain: string, type: NamespaceType): string => {
//   const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
//   const baseHost =
//     process.env.NODE_ENV === 'production'
//       ? window.location.host
//       : 'localhost:3000';
//   const namespace =
//     type === 'private' ? `tenant-${subdomain}` : `public-${subdomain}`;
//   return `${protocol}://${baseHost}/${namespace}`;
// };

/**
 * A robust, multitenant-aware class to manage all Socket.IO connections.
 * This class is framework-agnostic and maintains a pool of active connections.
 */
class SocketManager {
  private sockets: Map<NamespaceType, Socket> = new Map();

  /**
   * Establishes or returns a connection for a given namespace type.
   */
  public connect(type: NamespaceType, token?: string): Socket {
    if (this.sockets.get(type)?.connected) {
      return this.sockets.get(type)!;
    }

    this.disconnect(type); // Ensure any old connection is closed first.

    // const url = getSocketUrl(subdomain, type);
    const url = urls.getSockBaseUrl();
    const tenantId = useConfigStore.getState().tenant?.id;
    const options = type === 'private' ? { auth: { token } } : {};
    const newSocket = io(url, options);

    this.addDefaultListeners(newSocket, type, tenantId || '');
    this.sockets.set(type, newSocket);
    console.log(
      `[SocketManager] Connected to ${type} namespace for ${tenantId}.`
    );
    return newSocket;
  }

  public getSocket(type: NamespaceType): Socket | null {
    return this.sockets.get(type) || null;
  }

  public emit<P = unknown, R = unknown>(
    type: NamespaceType,
    eventName: string,
    payload: P,
    ack?: (res: R) => void
  ) {
    const socket = this.getSocket(type);
    if (socket?.connected) {
      socket.emit(eventName, payload, ack);
    } else {
      console.warn(
        `[SocketManager] Could not emit '${eventName}'. Socket '${type}' is not connected.`
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

  private addDefaultListeners(
    socket: Socket,
    type: NamespaceType,
    tenantId: string
  ) {
    socket.on('connect', () =>
      toast.success(`[*] - '${type}' namespace connected to ${tenantId}.`)
    );

    socket.on('disconnect', (reason) =>
      toast.warning(`Real-time channel disconnected: ${reason}`)
    );
    socket.on('disconnect', () =>
      toast.success(`[*] - '${type}' namespace disconnected from ${tenantId}.`)
    );
    socket.on('connect_error', (err) =>
      toast.error(`[*] - '${type}' namespace connection error: ${err}`)
    );

    socket.on(SocketEvent.T_ERROR, (response: SocketPayload<any>) => {
      if (response.status === SocketStatus.ERROR) {
        toast.error(`Server Error: ${response.payload.message}`);
      }
    });

    socket.on(SocketEvent.T_WELCOME, (response: SocketPayload<any>) => {
      toast.info(response.payload.message);
    });
  }
}

// Create a singleton instance for use throughout the application.
export const socketManager = new SocketManager();

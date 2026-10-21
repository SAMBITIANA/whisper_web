import { io, type Socket } from "socket.io-client";

export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL?.trim().replace(/\/+$/, "") ??
  "http://localhost:3200";

export const SOCKET_PATH = "/api/socket.io";

/**
 * Le WebSocket n'est pas proxyfiable par les rewrites Next : on vise donc
 * l'hôte du serveur Nest en direct. `transports: ['websocket']` est requis en
 * cluster (sans sticky-session, le polling long-polling casse le routage).
 */
export function createSocket(): Socket {
  return io(SOCKET_URL, {
    path: SOCKET_PATH,
    transports: ["websocket"],
    autoConnect: false,
  });
}

import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let socket: Socket | null = null;

export const initSocket = (roomId: string, userId: string, userName: string) => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    // After connection, emit the join event with user info
    socket?.emit("room:join", { roomId, userId, userName });
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

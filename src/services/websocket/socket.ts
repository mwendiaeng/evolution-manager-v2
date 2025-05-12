// src/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (url: string): Socket => {
  const apiKey = localStorage.getItem("accessToken");

  const urlWithToken = `${url}?apikey=${apiKey}`;

  // if (!socket) {
  socket = io(urlWithToken, {
    autoConnect: false,
  });
  // }
  return socket;
};

// export const disconnectSocket = () => {
export const disconnectSocket = (socket: Socket) => {
  if (socket) {
    socket.disconnect();
    // socket = null;
  }
};

export type SocketType = Socket;

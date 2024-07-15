// socketInstance.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    socket = io('http://localhost:4000');
    console.log('Socket Initialized');
  }
  return socket;
}

export default getSocket;
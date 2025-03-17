import { io } from 'socket.io-client';

export const socket = io('/', {
  transports: ['websocket'],
});

export function getSocket() {
  return socket;
}

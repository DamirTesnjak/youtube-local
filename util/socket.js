import { io } from "socket.io-client";

export const socket = io("http://webocket:5001");
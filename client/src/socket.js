import { io } from "socket.io-client";

const SOCKET_IO_URL = "http://localhost:3001"; 

const socket = io(SOCKET_IO_URL, {
  autoConnect: false, 
  transports: ["websocket"], 
});

export default socket;
import { io } from "socket.io-client";

const SOCKET_IO_URL = "https://brainbuster-12xu.onrender.com/"; 

const socket = io(SOCKET_IO_URL, {
  autoConnect: false, 
  transports: ["websocket"], 
});

export default socket;
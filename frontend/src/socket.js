import { io } from "socket.io-client";
import { apiUrl } from "./services/api";

export function connectSocket() {
  return io(apiUrl(""), {
    transports: ["websocket"],
    withCredentials: true,
  });
}

export default connectSocket;

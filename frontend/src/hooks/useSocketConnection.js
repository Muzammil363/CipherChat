import { useEffect,useState } from "react";
import toast from "react-hot-toast";
import { connectSocket } from '../socket.js';
// import socket from "../socket";// adjust the path if needed

export const useSocketConnection = (handleStopTyping,handleTypingReceive,handleReceive,setSocket ,handleDeletedMessage) => {
  // const [connected,setConnected]=useState(false);
    useEffect(() => {
      let socket = connectSocket();
      if (socket.connected) {
        // setConnected(true);
      }
  
      const onConnect = () => {
        setSocket(socket);
        // setConnected(true);
      };
  
      const onDisconnect = () => {
        setSocket(null);
        // setConnected(false);
      };
      
      const onRecieve=(data)=>{
        handleReceive(data);
      }

      const onTyping=(data)=>{
        handleTypingReceive(data);
      }
      
      const onStopTyping=(data)=>{
        handleStopTyping(data.from)
      }

      const onDeletedId=(data)=>{
        handleDeletedMessage(data.id);
      }

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("recieve",onRecieve);
      socket.on("message:receive",onRecieve);
      socket.on("typing",onTyping);
      socket.on("stop-typing",onStopTyping);
      // Event name is correct ! OK 
      socket.on("deletedId",onDeletedId);
  
      // Cleanup
      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("recieve", onRecieve);
        socket.off("message:receive", onRecieve);
        socket.off("typing", onTyping);
        socket.off("stop-typing", onStopTyping);
        socket.off("deletedId", onDeletedId);
        socket.disconnect();
      };
    }, []);
};

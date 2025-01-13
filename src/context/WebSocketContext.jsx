import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [appId, setAppId] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // requestNotificationPermission()
    if (!appId && !username) return;

    console.log("App Id:", appId)
  
    const prod = "https://limppay-api-production.up.railway.app/";
    const local = "http://localhost:3000/";

    const newSocket = io(prod, {
      query: {
        appId,
        username
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    console.log('Conectado ao servidor WebSocket:', newSocket);
    setSocket(newSocket);

    const pingInterval = setInterval(() => {
      newSocket.emit('ping');
    }, 25000);

    newSocket.on('ping', () => {
      if (newSocket.connected) {
        console.log('Ping recebido, enviado pong...');
        newSocket.emit('pong');
      } else {
        console.log('Tentando enviar pong, mas o cliente não está conectado');
      }
    });

    newSocket.on('data-updated', (data) => {
        // console.log('Notificação recebida:', data);
        // showNotification("Limppay Administrativo", data?.resource);
    });

    return () => {
      clearInterval(pingInterval);
      console.log('Desconectando do WebSocket...');
      newSocket.disconnect();
    };

    
  }, [appId, username]);

  return (
    <WebSocketContext.Provider value={{socket, setAppId, setUsername}}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);

  return context;
};

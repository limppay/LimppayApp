import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

//   const requestNotificationPermission = async () => {
//     if (Notification.permission !== "granted") {
//       const permission = await Notification.requestPermission();
//       if (permission === "granted") {
//         console.log("Permissão para notificações concedida.");
//       } else {
//         console.log("Permissão para notificações negada.");
//       }
//     }
//   };

//   const showNotification = (title, body) => {
//     if (Notification.permission === "granted") {
//       new Notification(title, { body });
//     }
//   };

  useEffect(() => {
    // requestNotificationPermission()
    
    const prod = "https://limppay-api-production.up.railway.app/";
    const newSocket = io(prod, {
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
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

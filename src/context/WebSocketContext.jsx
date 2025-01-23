import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useUser } from './UserProvider';
import { usePrestador } from './PrestadorProvider';
import { perfil, prestadorProfile } from '../services/api';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [appId, setAppId] = useState(null);
  const [username, setUsername] = useState(null);
  const { user, setUser } = useUser()
  const { prestador, setPrestador } = usePrestador()

  console.log("Usuários", {
    cliente: user,
    prestador: prestador
  })

  const fetchUserInfo = async () => {
      try {
          const response = await user ? perfil() : prestadorProfile()
          console.log(response)
          
          if(user) {
            setUser(response)

          } else if (prestador) {
            setPrestador(response)

          } else {
            console.log("Nenhum usuário online")
          }
          
          
      } catch (error) {
          console.error('Erro ao buscar informações do usuário:', error);

      }
  };

  useEffect(() => {
    if (!socket ) return;

    socket.on('data-updated', (data) => {
        console.log('Notificação recebida:', data);
        fetchUserInfo(); // Atualiza os dados ao receber o evento
    });

    return () => {
      socket.off('data-updated')
    };

  }, [user]);

  useEffect(() => {
    // requestNotificationPermission()
    if (!prestador && !user) return;
  
    const prod = "https://limppay-api-production.up.railway.app/";
    const local = "http://localhost:3000/";

    const newSocket = io(prod, {
      query: {
        appId: user?.id || prestador?.id,
        username: user?.name || prestador?.name
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

    
  }, [user, prestador]);

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

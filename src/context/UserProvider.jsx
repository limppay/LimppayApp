import React, { createContext, useState, useContext, useEffect } from 'react';
import { perfil } from '../services/api';
import { useWebSocket } from './WebSocketContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const [loadingUser, setLoadingUser] = useState(false)
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
          setLoadingUser(true)
          
          const user = await perfil()
          setUser(user)
          console.log("Sessão recuperada com sucesso!", user)

        } catch (error) {
          console.error('Erro ao buscar informações do usuário:', error);
          setUser(null)

        } finally {
          setLoadingUser(false)

        }
    };
    
    fetchUserInfo()

  }, []);


  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

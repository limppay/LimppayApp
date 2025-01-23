import React, { createContext, useState, useContext, useEffect } from 'react';
import { perfil, prestadorProfile } from '../services/api';
import { useWebSocket } from './WebSocketContext';

const PrestadorContext = createContext();

export const PrestadorProvider = ({ children }) => {
  const [loadingUser, setLoadingUser] = useState(false)
  const [prestador, setPrestador] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
          setLoadingUser(true)
          
          const user = await prestadorProfile()
          setPrestador(user)
          console.log("Sessão recuperada com sucesso!", user)

        } catch (error) {
            console.log(error)
            setPrestador(null)

        } finally {
          setLoadingUser(false)

        }
    };
    
    fetchUserInfo()

  }, []);


  return (
    <PrestadorContext.Provider value={{ prestador, setPrestador, loadingUser }}>
      {children}
    </PrestadorContext.Provider>
  );
};

export const usePrestador = () => useContext(PrestadorContext);

import React, { createContext, useState, useContext, useEffect } from 'react';
import { prestadorProfile } from '../services/api';
const PrestadorContext = createContext();

export const PrestadorProvider = ({ children }) => {
  const [loadingUser, setLoadingUser] = useState(true)
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

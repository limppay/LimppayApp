import React, { createContext, useState, useContext, useEffect } from 'react';
import { perfil } from '../services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const [loadingUser, setLoadingUser] = useState(true)
  const [user, setUser] = useState(null);


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
          setLoadingUser(true)
          
          const user = await perfil()
          setUser(user)
          console.log("Sessão recuperada com sucesso!", user)

        } catch (error) {
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

import React, { createContext, useState, useContext } from 'react';

const ScreenSelectContext = createContext();

export const ScreenSelect = ({ children }) => {
    const [screenSelected, setScreenSelected] = useState("perfil")

    return (
        <ScreenSelectContext.Provider value={{screenSelected, setScreenSelected}}>
            {children}
        </ScreenSelectContext.Provider>
    )
}

export const useScreenSelected = () => useContext(ScreenSelectContext);

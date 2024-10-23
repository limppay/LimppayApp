import React, { createContext, useState, useContext } from 'react';

const TimesContext = createContext();

export const SelectedTimes = ({ children }) => {
    const [selectedTimes, setSelectedTimes] = useState([]); // Estado para armazenar os horários selecionados

    return (
        <TimesContext.Provider value={{selectedTimes, setSelectedTimes}}>
            {children}
        </TimesContext.Provider>
    )
}

export const useSelectedTimes = () => useContext(TimesContext);


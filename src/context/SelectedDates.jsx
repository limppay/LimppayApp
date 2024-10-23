import React, { createContext, useState, useContext } from 'react';

const DatesContext = createContext();

export const SelectedDates = ({ children }) => {
    const [selectedDates, setSelectedDates] = useState([]); // Estado para armazenar a data selecionada

    return (
        <DatesContext.Provider value={{selectedDates, setSelectedDates}}>
            {children}
        </DatesContext.Provider>
    )
}

export const useSelectedDates = () => useContext(DatesContext);


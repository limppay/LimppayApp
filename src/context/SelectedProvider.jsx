import React, { createContext, useState, useContext } from 'react';

// Renomeei para manter consistência no nome
const SelectedProviderContext = createContext();

export const SelectedProvider = ({ children }) => {
    const [selectedProvider, setSelectedProvider] = useState(null);

    return (
        <SelectedProviderContext.Provider value={{ selectedProvider, setSelectedProvider }}>
            {children}
        </SelectedProviderContext.Provider>
    );
};

export const useSelectedProvider = () => useContext(SelectedProviderContext);

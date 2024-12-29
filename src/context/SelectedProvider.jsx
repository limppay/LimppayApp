import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';

// Renomeei para manter consistência no nome
const SelectedProviderContext = createContext();

export const SelectedProvider = ({ children }) => {
    const [selectedProvider, setSelectedProvider] = useState(() => {
        // Busca o valor inicial do cookie (se existir)
        const storedValue = Cookies.get('selectedProvider');
        return storedValue ? JSON.parse(storedValue) : null;
    });

    useEffect(() => {
        // Atualiza o cookie sempre que o selectedProvider mudar
        if (selectedProvider !== null) {
            Cookies.set('selectedProvider', JSON.stringify(selectedProvider), { 
                expires: 7,  
            });
        }
    }, [selectedProvider]);

    return (
        <SelectedProviderContext.Provider value={{ selectedProvider, setSelectedProvider }}>
            {children}
        </SelectedProviderContext.Provider>
    );
};

export const useSelectedProvider = () => useContext(SelectedProviderContext);

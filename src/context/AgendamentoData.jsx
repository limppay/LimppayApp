import React, { createContext, useState, useContext } from 'react';

const AgendamentoContext = createContext();

export const AgendamentoData = ({ children }) => {
    const [agendamentoData, setAgendamentoData] = useState(null)

  return (
    <AgendamentoContext.Provider value={{agendamentoData, setAgendamentoData}}>
        {children}
    </AgendamentoContext.Provider>
  )
}

export const useAgendamentoData = () => useContext(AgendamentoContext);


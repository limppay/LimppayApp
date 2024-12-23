import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  // Use um estado para manter os dados do checkout e inicialize com os dados dos cookies se existirem
  const [checkoutData, setCheckoutDataState] = useState(() => {
    const storedData = Cookies.get("checkoutData");
    return storedData ? JSON.parse(storedData) : {
      userId: null,
      clienteId: null,
      servicoId: null,
      dataServico: null,
      Servico: null,
      horaServico: null,
      valorServico: null,
      valorBruto: null,
      valorCupom: null,
      descontoTotal: null,
      valorLiquido: null,
      observacao: null,
    };
  });

  // Função para atualizar tanto o estado quanto o cookie
  const setCheckoutData = (data) => {
    setCheckoutDataState(data);
    Cookies.set("checkoutData", JSON.stringify(data), { expires: 1 }); // Expira em 1 dia
  };

  return (
    <CheckoutContext.Provider value={{ checkoutData, setCheckoutData }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);

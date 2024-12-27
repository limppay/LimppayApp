import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  // Inicializar o estado com o array "data" do cookie, se existir
  const [checkoutData, setCheckoutDataState] = useState(() => {
    const storedData = Cookies.get("checkoutData");
    console.log("Cookie do agendamentoData: ", storedData);

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        return parsedData.data || null; // Retorna apenas o array "data"
      } catch (error) {
        console.error("Erro ao parsear o cookie:", error);
        return null;
      }
    }

    return null; // Estado inicial vazio se o cookie não existir
  });

  // Função para atualizar o estado e cookie com somente o array "data"
  const setCheckoutData = (data) => {
    console.log("Dados sendo setados no context: ", data);
    setCheckoutDataState(data);

    // Atualizar o cookie com a nova estrutura, incluindo o "hash" (opcional)
    // Cookies.set("checkoutData", JSON.stringify({ data, hash: "hash-opcional" }));
  };

  return (
    <CheckoutContext.Provider value={{ checkoutData, setCheckoutData }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);

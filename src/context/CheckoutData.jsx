import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios"; // Certifique-se de importar o axios
import { verifyCheckout } from "../services/api"; // Verifique se o verifyCheckout é importado corretamente
import { useSelectedProvider } from "./SelectedProvider";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  // Inicializa o sessionCode a partir do cookie
  const [sessionCode, setSessionCodeState] = useState(() => {
    const storedSessionCode = Cookies.get("checkoutSession");
    return storedSessionCode || null;
  });
  
  // Estado para armazenar os dados de checkout
  const [checkoutData, setCheckoutData] = useState(null);
  const [ status, setStatus ] = useState(null)
  const [ invoiceId, setInvoiceId ] = useState(null)
  const [ codePix, setCodePix ] = useState(null)
  const [ keyPix, setKeyPix ] = useState(null)

  const [isLoadingCheckout, setiIsLoadingCheckout] = useState(true); // Para controlar o estado de carregamento
  const { selectedProvider, setSelectedProvider } = useSelectedProvider()
  
  // Fazer a requisição para recuperar os dados do checkout usando o sessionCode
  useEffect(() => {
    
    const fetchCheckoutData = async () => {
      
      if(sessionCode) {
        setiIsLoadingCheckout(true); // Inicia o carregamento
        try {
          const response = await verifyCheckout(sessionCode); // Envia o sessionCode para a API
          setCheckoutData(response?.data.data); // Atualiza com os dados retornados
          setSelectedProvider(response?.data.user)
          setStatus(response?.data?.status)
          setInvoiceId(response?.data?.invoiceId)
          setCodePix(response?.data?.qrCodePix)
          setKeyPix(response?.data?.keyPix)
          
        } catch (error) {
          console.error("Erro ao recuperar os dados de checkout:", error);
          
        } finally {
          setiIsLoadingCheckout(false)
        }
        
      } else {
        setiIsLoadingCheckout(false)
      }
      
    }
    
    setiIsLoadingCheckout(false)
    fetchCheckoutData();
    
    
    
  }, [sessionCode]);
  
  return (
    <CheckoutContext.Provider value={{ sessionCode, status, invoiceId, codePix, keyPix, checkoutData, isLoadingCheckout, setCheckoutData }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);

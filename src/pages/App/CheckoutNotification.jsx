import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../../context/CheckoutData";
import { cancelarFatura, removeCheckout, verifyCheckout } from "../../services/api";
import { useUser } from "../../context/UserProvider";

const CheckoutNotification = () => {
  const { user } = useUser()
  const {setStatus, setInvoiceId, setCodePix, setKeyPix, sessionCode } = useCheckout()

  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Função para ler os cookies
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    // Verifique se o cookie "checkoutData" está presente
    const checkoutCookie = getCookie("checkoutSession");

    // Se o cookie estiver presente e tiver dados, exibe a notificação
    if (checkoutCookie) {
      setShowNotification(true);
    }
  }, []);

  const [loading, setLoading] = useState(false)
  const handleCloseNotification = async () => {
    setLoading(true)
    try {
      if(!sessionCode) return
      const verify = await verifyCheckout(sessionCode)

      if(verify?.data?.invoiceId) {
        const response = await cancelarFatura(verify?.data?.invoiceId)
        console.log("Fatura cancelada com sucesso!")

      } else {
        console.log("Nenhuma fatura criada nesse pedido.")

      }

      const response = await removeCheckout()
      console.log("Pedido cancelado com sucesso!")

      setStatus(null)
      setInvoiceId(null)
      setCodePix(null)
      setKeyPix(null)

      // Oculta a notificação
      setShowNotification(false);

      // Remove a notificação após o tempo da animação
      setTimeout(() => setShowNotification(false), 1000);
      setLoading(false)

    } catch (error) {
      console.log(error)
      
    }


  };


  return (
    user && (
      <div
        className={`fixed bottom-4 w-full flex justify-center items-center transition-transform duration-300 ${
          showNotification ? "translate-y-0" : "translate-y-52"
        }`}
      >
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-prim border border-prim border-opacity-15 py-2 px-4 rounded-lg shadow-lg min-w-[40vh] max-w-[40vh] sm:max-w-[150vh]">
          <div className="flex flex-col w-full sm:flex-row justify-between items-center gap-5 p-2">
            <span>Você tem um pedido em andamento no checkout</span>
            <div className="flex gap-2">
              <Button className="bg-white text-error shadow-md " onPress={() => handleCloseNotification()} isDisabled={loading}>
                Cancelar
              </Button>
              <a href="/checkout-pagamento">
                <button className="bg-white border-desSec border shadow-md text-desSec p-2 rounded-lg">
                  Continuar
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CheckoutNotification;

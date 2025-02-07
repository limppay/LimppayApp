import { Image } from '@nextui-org/image'
import { Spinner } from '@nextui-org/react'
import { Snippet } from '@nextui-org/snippet'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { criarFaturaPix, paymentCheckoutPix, removeCheckout, verifyCheckout } from '../../services/api'
import io from 'socket.io-client';
import { useCheckout } from '../../context/CheckoutData'

export default function Pix({calcularDataValidade, user, checkoutData, metodoPagamento, setPaymentStatus, paymentStatus}) {
    const { isLoadingCheckout, sessionCode, status, setInvoiceId, setCodePix, setKeyPix, fetchCheckoutData } = useCheckout()

    const [qrCodePix, setQrCodePix] = useState('');  // Estado para armazenar o QR Code PIX
    const [pixChave, setPixChave] = useState('');    // Estado para armazenar a chave PIX
    const [isLoading, setIsLoading] = useState(false)
    const [ loading, setloandig ] = useState(false)

    console.log("Status do checkout: ", status)

    // salva no banco de dados a fatura do pix
    const handlePaymentePix = async (invoiceId, qrCodePix, keyPix) => {
        setloandig(true)        
        try {
            const response = await paymentCheckoutPix(invoiceId, qrCodePix, keyPix)
            console.log("Fatura enviada com sucesso!")
            setloandig(false)

        } catch (error) {
            console.log(error)
    
        }
    }

    // função para criar a fatura do pix
    const createPix = async () => {
        if(isLoading) return

        const response = await criarFaturaPix(
            {
                email: user.email,
                due_date: calcularDataValidade(1),
                items: [
                {
                    "description": "Fatura do seu Pedido",
                    "quantity": checkoutData.length,
                    "price_cents": (checkoutData[0].valorLiquido / checkoutData.length) * 100
                }
                ],
                payer: {
                "cpf_cnpj": user?.cpfCnpj, // trocar para "user?.cpfCnpj"
                "name": user.name
                },
            }
        );
        
        setQrCodePix(response.data.pix.qrcode)
        setPixChave(response.data.pix.qrcode_text)

        setInvoiceId(response.data.id)
        setCodePix(response.data.pix.qrcode)
        setKeyPix(response.data.pix.qrcode_text)

        handlePaymentePix(response.data.id, response.data.pix.qrcode, response.data.pix.qrcode_text)
        setIsLoading(true)
    }

    useEffect(() => {
        const handleVerify = async () => {
            try {
                console.log("Codigo de sessão: ", sessionCode)

                if (isLoadingCheckout || metodoPagamento !== "pix" || !sessionCode) return; // Evita execuções desnecessárias

                const response = await verifyCheckout(sessionCode); // Envia o sessionCode para a API
                console.log("Fatura: ", response?.data?.invoiceId)
                console.log("Chave Pix: ", response?.data?.keyPix)
                console.log("QR Pix: ", response?.data?.qrCodePix)
                
                
                if (!response?.data?.invoiceId) {  
                    console.log("Fatura não encontrada ou incompleta, gerando uma nova...");
                    createPix();
        
                } else {
                    console.log("Já existe uma fatura em aberto.");
                    setQrCodePix(response?.data?.qrCodePix);
                    setPixChave(response?.data?.keyPix);
        
                }

            } catch (error) {
                console.log(error)

            }
        }

        handleVerify()

    }, []);

    // efeito para atualizar a pagina ao efetuar o pagamento via pix
    useEffect(() => {
        if (!sessionCode) return;
    
        // Conectar ao WebSocket
        const socket = io(import.meta.env.VITE_URL_API, {
            query: { sessionCode }, // Código da sessão como parâmetro
        });
    
        // Escutar eventos do status de pagamento
        socket.on('payment_status', async (data) => {
            if (data.status === 'paid') {
                await fetchCheckoutData()

            } else {
                setPaymentStatus({ status: 'Falhou' });
                alert("Pagamento falhou. Tente novamente ou contate o suporte.");

            }
        });
    
        // Desconectar WebSocket ao desmontar o componente
        return () => {
            socket.disconnect();
        };

    }, [sessionCode]);
    
    return (
        <div className='flex justify-center w-full h-full'>
            {qrCodePix && !loading ? (
                paymentStatus ? (
                    <>
                        <div className='flex flex-col min-h-full min-w-full items-center gap-5'>
                            <div className='text-center flex flex-col justify-center items-center'>
                                <h3 className='text-prim font-semibold'>Pagamento realizado com sucesso!</h3>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-[20vh] text-sec">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                </svg>

                            </div>
                        </div>
                    </>

                ) : (
                    <>
                        <div className='flex flex-col min-h-full min-w-full items-center gap-5'>
                            <div className='text-center flex flex-col justify-center items-center'>
                                <h3 className='text-prim font-semibold'>Escaneie o QR Code para pagamento via PIX:</h3>
                                <Image
                                    className='z-0'
                                    height={250}
                                    width={250}
                                    alt="QR Code Pix"
                                    src={qrCodePix}
                                />
                            </div>
                            <div className='max-w-full flex flex-col gap-2'>
                                <div className='flex justify-center items-center gap-2'>
                                    <p className='text-center text-prim font-semibold'>Pix copia e cole</p>
                                </div>
                                <div className='flex items-center gap-2 max-w-full'>
                                <Snippet hideSymbol="true" 
                                    tooltipProps={{
                                        color: "default",
                                        content: "Copiar chave pix",
                                        disableAnimation: true,
                                        placement: "right",
                                        closeDelay: 0
                                    }} 
                                >
                                    <div className='max-w-60  lg:max-w-[60vh]'>
                                        <div className='p-2 flex flex-row overflow-x-scroll '>
                                            <p className='text-prim whitespace-nowrap '>{pixChave}</p>
                                        </div>
                                    </div>
                                </Snippet>
                                </div>
                            </div>
                        </div>
                    </>
                )
            ) : (
                <div className='flex justify-center items-center w-full h-[60vh] md:h-[40vh] text-white'>
                    <Spinner size='lg' />
                </div>
            )}
        </div>
    )
}

import React, { useState } from 'react'
import CardLogoLimppay from "../../assets/img/limppay-icone-branco-card.svg"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { obterTokenCartao } from '../../services/iuguApi'
import { createAgendamento,  criarFaturaCartao, removeCheckout } from '../../services/api'
import { Button } from '@nextui-org/button'
import { useCheckout } from '../../context/CheckoutData'
import { useNavigate } from 'react-router-dom';

export default function Credit_Card({setIsPayment, setIsPaymentFinally, setIsPaymentFailed, metodoPagamento, checkoutData, calcularDataValidade, user, setMessage, setDetails}) {

    const navigate = useNavigate();

    const { setCheckoutData, setStatus, setInvoiceId, setCodePix, setKeyPix, } = useCheckout()

    const [dadosCartao, setDadosCartao] = useState({
        numero: null,
        cvc: null,
        mesExpiracao: null,
        anoExpiracao: null,
        nome: ""
    });

    
    const schemaDadosCartao = yup.object({
        numero: yup.number("Número do cartão é obrigatório.").required("Número do cartão é obrigatório.").typeError("Número do cartão dever ser um número válido."),
        cvc: yup.number().required("Código de segurança é obrigatório."),
        mesExpiracao: yup.number("somente numeros").required("Mês de expiração é obrigatório."),
        anoExpiracao: yup.number("somente numeros").required("Ano de expiração é obrigatório"),
        nome: yup.string().required("Nome é obrigatório.").trim()
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
        } = useForm({
        resolver: yupResolver(schemaDadosCartao),
    })

    
    const handleFinalizarCompra = async (data) => {
        setMessage(null)
        setDetails(null)
        setIsPayment(true);
        setIsPaymentFinally(false);
        setIsPaymentFailed(false);
        
        try {
            // Obter token do cartão
            const token = await obterTokenCartao(data);

            if (!token) {
                throw new Error("Falha ao gerar o token do cartão. Tente novamente.");
            }

            // Criar fatura
            const fatura = {
                email: user.email,
                items: [
                    {
                        description: "Fatura do seu agendamento na Limppay",
                        quantity: checkoutData.length,
                        price_cents: Math.round(checkoutData[0].valorLiquido / checkoutData.length) * 100,
                    },
                ],
                payment_method: "credit_card",
                due_date: calcularDataValidade(2),
                payer: {
                    name: user?.name,
                    cpf_cnpj: user?.cpfCnpj,
                },
                token,
                credit_card: {
                    number: data.numero,
                    verification_value: data.cvc,
                    expiration_month: data.mesExpiracao,
                    expiration_year: data.anoExpiracao,
                    holder_name: data.nome,
                },
            }
            
            try {
                const response = await createAgendamento(checkoutData, fatura)
                console.log("Resposta ao tentar criar o agendamento", response)

                if(!response?.success && !response?.data?.disponivel) {
                    setIsPaymentFinally(true)
                    setIsPaymentFailed(true)
                    setMessage(response?.message)
                    setDetails(response?.details)
                }

                if(response?.success) {
                    setIsPaymentFinally(true)
                    setIsPaymentFailed(false)
                    reset()
                    setStatus(null)
                    setInvoiceId(null)
                    setCodePix(null)
                    setKeyPix(null)
                    navigate('/sucesso')

                } else if (!response?.success && !response?.data?.pagamento) {
                    setIsPaymentFinally(true)
                    setIsPaymentFailed(true)

                } else if (!response?.success && response?.data?.pagamento && !response?.data?.agendamentos) {
                    setIsPaymentFinally(true)
                    setIsPaymentFailed(false)
                    
                } 

            } catch (error) {
                console.log("Erro ao criar agendamento", error.response.data)

            }


        } catch (error) {
            console.error("Erro no pagamento ou criação da fatura:", error);
            setIsPaymentFinally(true)
            setIsPaymentFailed(true);
        }
        
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDadosCartao((prevState) => ({
          ...prevState,
          [name]: value,
        }));
    };
    
    // Função auxiliar que mescla o onChange do react-hook-form com o handleInputChange
    const registerWithOnChange = (name) => {
      const { onChange, ...rest } = register(name)
      return {
        onChange: (e) => {
          handleInputChange(e)
          onChange(e)
        },
        ...rest
      }
    }
    
    return (
        <div>
            {/* cartão ilustrativo */}
            <div className="max-w-sm mx-auto bg-desSec rounded-xl p-5 shadow-lg text-white mb-4  text-sm lg:text-md">
                <div className="flex items-center justify-between mb-6">
                    <img 
                    src={CardLogoLimppay} 
                    alt="Visa Logo"
                    className="h-7 "
                    />
                <div className='p-4 pl-5 pr-5 border rounded-md bg-white'></div>
                </div>

                <div className="mt-4">
                <p className="text-sm uppercase text-gray-400">Número</p>
                <p className="text-md font-semibold">{dadosCartao.numero ? dadosCartao.numero : "1234 5678 9101 1121"}</p>
                </div>

                <div className="flex justify-between mt-4">
                <div>
                    <p className="text-sm uppercase text-gray-400">Nome</p>
                    <p className="text-md uppercase">{dadosCartao.nome ? dadosCartao.nome : "NOME IGUAL DO CARTAO"}</p>
                </div>
                </div>
                <div className='flex justify-between w-full mt-4'>
                <div>
                    <p className="text-sm uppercase text-gray-400">Validade</p>
                    <p className="text-md">{dadosCartao.mesExpiracao? dadosCartao.mesExpiracao : "MM"} / {dadosCartao.anoExpiracao? dadosCartao.anoExpiracao : "YY"}</p>
                </div>
                <div>
                    <p className="text-sm uppercase text-gray-400">ccv</p>
                    <p className="text-md">{dadosCartao.cvc? dadosCartao.cvc : "000"}</p>
                </div>
                </div>
            </div>

            {/* formulário do cartão de crédito */}
            <form onSubmit={handleSubmit(handleFinalizarCompra)}>
                <div className="mb-4">
                    <label htmlFor="cardholdername" className="block text-prim mb-2">Nome</label>
                    <input
                        id="cardholdername"
                        name="nome"
                        type="text"
                        placeholder="Igual ao do cartão"
                        className=" w-full p-2 border border-bord rounded-md text-prim focus:outline-prim "
                        onChange={handleInputChange}
                        {...registerWithOnChange("nome")}
                    />
                    {errors.nome && <span className="text-error opacity-75">{errors.nome?.message}</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="cardnumber" className="block text-prim mb-2">Número do cartão</label>
                    <input
                        id="cardnumber"
                        placeholder="8888-8888-8888-8888"
                        className="w-full p-2 border border-bord rounded-md text-prim focus:outline-prim "
                        maxLength="19"
                        {...registerWithOnChange("numero")}
                    />
                    {errors.numero && <span className="text-error opacity-75">{errors.numero?.message}</span>}
                </div>

                <div className="flex justify-between  mb-4">
                    <div className="w-1/2 pr-2">
                        <div className='flex gap-2'>
                        <label htmlFor="expiry-date" className="block text-prim mb-2">Validade</label>
                        {errors.mesExpiracao || errors.anoExpiracao ? 
                            <span className="text-error opacity-75">*</span> : ""}
                        </div>
                        <div className="flex gap-2">
                        <div>
                            <input
                            className="w-full p-2 border border-bord rounded-md text-prim focus:outline-prim "
                            maxLength="2"
                            placeholder="MM"
                            {...registerWithOnChange("mesExpiracao")}
                            />
                        </div>
                        <div>
                            <input
                            className="w-full p-2 border border-bord rounded-md text-prim focus:outline-prim "
                            maxLength="2"
                            placeholder="YY"
                            {...registerWithOnChange("anoExpiracao")}
                            />
                        </div>
                        </div>
                    </div>
                    <div className="w-1/2 pl-2">
                        <div className='flex gap-2'>
                        <label htmlFor="cvv" className="block text-prim mb-2">CVC</label>
                        {errors.cvc && 
                        <span className="text-error opacity-75">*</span>}
                        </div>
                        <input
                        maxLength="4"
                        placeholder="123"
                        className="w-full p-2 border border-bord rounded-md text-prim focus:outline-prim "
                        {...registerWithOnChange("cvc")}
                        />
                        
                    </div>
                </div>

                <div className="mt-6">
                    <Button 
                        type='submit'
                        className="p-2 rounded-md 
                        text-center
                        text-white 
                        bg-des         
                        hover:text-white transition-all
                        duration-200
                        hover:bg-sec hover:bg-opacity-75
                        hover:border-trans
                        flex 
                        items-center
                        justify-center
                        text-sm
                        gap-2
                        w-full
                        "
                    >
                        <i className="ion-locked mr-2"></i>Finalizar compra
                    </Button>
                </div>
            </form>
        </div>
    )
}

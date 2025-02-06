import React, { useState } from 'react'
import CardLogoLimppay from "../../assets/img/limppay-icone-branco-card.svg"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { obterTokenCartao } from '../../services/iuguApi'
import { createAgendamento, criarFaturaCartao, removeCheckout } from '../../services/api'
import { Button } from '@nextui-org/button'
import { useCheckout } from '../../context/CheckoutData'

export default function Credit_Card({setIsPayment, setIsPaymentFinally, setIsPaymentFailed, metodoPagamento, checkoutData, calcularDataValidade, user}) {

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
        setIsPayment(true);
        setIsPaymentFinally(false);
        setIsPaymentFailed(false);

        try {
            // Obter token do cartão
            const token = await obterTokenCartao(data);

            if (!token) {
                throw new Error("Falha ao gerar o token do cartão. Tente novamente.");
            }

            if (metodoPagamento === 'credit_card') {
                // Criar fatura
                const response = await criarFaturaCartao({
                    email: user.email,
                    items: [
                        {
                            description: "Fatura do seu agendamento na Limppay",
                            quantity: checkoutData.length,
                            price_cents: (checkoutData[0].valorLiquido / checkoutData.length) * 100,
                        },
                    ],
                    payment_method: "credit_card",
                    due_date: calcularDataValidade(2),
                    payer: {
                        name: data.nome,
                        cpf_cnpj: "08213350227",
                    },
                    token,
                    credit_card: {
                        number: data.numero,
                        verification_value: data.cvc,
                        expiration_month: data.mesExpiracao,
                        expiration_year: data.anoExpiracao,
                        holder_name: data.nome,
                    },
                });


                // Criar agendamentos
                const agendamentoPromises = checkoutData.map(agendamento => createAgendamento(agendamento));
                
                const agendamentoResults = await Promise.allSettled(agendamentoPromises);

                const errosDeAgendamento = agendamentoResults.filter(result => result.status === "rejected");

                if (errosDeAgendamento.length > 0) {
                    console.error("Alguns agendamentos falharam:", errosDeAgendamento);

                    // Notificar suporte (opcional: enviar para API de log/suporte)
                    await notificarSuporte({
                        userId: user.id,
                        email: user.email,
                        erro: "Falha ao criar agendamentos após o pagamento.",
                        detalhes: errosDeAgendamento,
                    });

                    // Informar o usuário
                    alert("Pagamento realizado com sucesso, mas houve falha ao criar alguns agendamentos. Nossa equipe já foi notificada e resolveremos o problema.");
                } else {
                    try {
                        const response = await removeCheckout()
                        setStatus(null)
                        setInvoiceId(null)
                        setCodePix(null)
                        setKeyPix(null)

                    } catch (error) {
                        console.log(error)
                        
                    }

                }

                reset()
                setIsPaymentFinally(true)
                setIsPaymentFailed(false)
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
                        {...register("nome")}
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
                        {...register("numero")}
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
                            {...register("mesExpiracao")}
                            />
                        </div>
                        <div>
                            <input
                            className="w-full p-2 border border-bord rounded-md text-prim focus:outline-prim "
                            maxLength="2"
                            placeholder="YY"
                            {...register("anoExpiracao")}
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
                        {...register("cvc")}
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

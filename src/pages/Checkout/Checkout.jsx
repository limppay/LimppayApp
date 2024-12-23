import React, { useEffect, useState } from 'react';
import { useAgendamentoData } from '../../context/AgendamentoData';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderWebApp from '../../componentes/App/HeaderWebApp';
import { Logo, Footer } from '../../componentes/imports';
import CardLogoLimppay from "../../assets/img/limppay-icone-branco-card.svg"
import { useSelectedProvider } from '../../context/SelectedProvider';
import { useSelectedDates } from '../../context/SelectedDates';
import { useSelectedTimes } from '../../context/SelectedTimes';
import { Avatar } from '@nextui-org/avatar'
import { createAgendamento, criarFaturaCartao, criarFaturaPix } from '../../services/api';
import { obterTokenCartao } from '../../services/iuguApi';
import { useUser } from '../../context/UserProvider';
import { Button, Input, Spinner } from '@nextui-org/react';
import {Image} from "@nextui-org/image";
import {Snippet} from "@nextui-org/snippet";

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import io from 'socket.io-client';

'use client'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

import { useCheckout } from '../../context/CheckoutData';
import axios from 'axios';

export default function Checkout() {
  const {user} = useUser()
  const {checkoutData, setCheckoutData} = useCheckout()
  console.log("Dados recebidos para o checkout: ", checkoutData)



  


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

  console.log(errors)

  const {selectedProvider, setSelectedProvider} = useSelectedProvider()
  const {selectedDates, setSelectedDates} = useSelectedDates()
  const {selectedTimes, setSelectedTimes} = useSelectedTimes()
  const navigate = useNavigate();

  const location = useLocation();
  const [isLoadingQrCode, setIsLoadingQrCode] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false);


  const [dadosCartao, setDadosCartao] = useState({
      numero: null,
      cvc: null,
      mesExpiracao: null,
      anoExpiracao: null,
      nome: ""
  });


  const [metodoPagamento, setMetodoPagamento] = useState('credit_card'); // Cartão de crédito padrão
  const [qrCodePix, setQrCodePix] = useState('');  // Estado para armazenar o QR Code PIX
  const [pixChave, setPixChave] = useState('');    // Estado para armazenar a chave PIX
  const [isLoading, setIsLoading] = useState(false)
  const [isPayment, setIsPayment] = useState(false) 
  const [isPaymentFinally, setIsPaymentFinally] = useState(false) 
  const [isPaymentFailed, setIsPaymentFailed] = useState(false)

  const [paymentStatus, setPaymentStatus] = useState(null);

  const AgendamenteDataQtd = [checkoutData]
  console.log(AgendamenteDataQtd.length)

  function calcularDataValidade(diasParaVencer, dataInicial = new Date()) {
    const data = new Date(dataInicial); // Cria uma cópia da data inicial
    data.setDate(data.getDate() + diasParaVencer); // Adiciona os dias
    return data.toISOString().split('T')[0]; // Retorna a data no formato YYYY-MM-DD
  }

  const [sessionCode, setSessionCode] = useState(null);
  // gera o codigo de sessao unica
  const getCodeSession = async (id) => {
    try {
      const response = await axios.get(`https://limppay-api-production.up.railway.app/checkout/session/${id}`)
      console.log("Codigo da sessão: ", response.data)
      setSessionCode(response.data.sessionCode)

    } catch (error) {
      console.log(error)
      
    }
    
  }

  const createPix = async () => {
    if(isLoading) return

    const response = await criarFaturaPix(
      {
        email: user.email,
        due_date: calcularDataValidade(1),
        items: [
          {
            "description": "Fatura do seu Pedido",
            "quantity": AgendamenteDataQtd.length,
            "price_cents": 1 * 100
          }
        ],
        payer: {
          "cpf_cnpj": user.cpfCnpj,
          "name": user.name
        },
      }
    );
    
    console.log(response.data.pix.qrcode)
    console.log(response.data.pix.qrcode_text)
    console.log("Id unico do pix", response.data.id)
    console.log("Id unico do pix", response)

    getCodeSession(response.data.id)
    setQrCodePix(response.data.pix.qrcode)
    setPixChave(response.data.pix.qrcode_text)
    setIsLoading(true)
  }

  if(metodoPagamento == "pix") {
    createPix()
  }
  



  //https://limppay-api-production.up.railway.app

  // efeito para atualizar a pagina ao efetuar o pagamento via pix
  useEffect(() => {
    if (!sessionCode) return;
    // Conectar ao servidor WebSocket
    const socket = io('https://limppay-api-production.up.railway.app', {
      query: { sessionCode } // Enviar o código de sessão como parâmetro
    }); // A URL do seu servidor WebSocket

    console.log("Conexão WebSocket estabelecida:", socket);

    socket.on('payment_status', (data) => {
      console.log('Status de pagamento recebido:', data);
      setPaymentStatus(data.status);  // Atualiza o status de pagamento no front-end
    });


    // Ouvir o evento 'payment_status' enviado pelo servidor
    // socket.on('payment_status', (data) => {
    //   console.log('Pagamento status recebido:', data);
      
    //   if (data.status === 'paid') {
    //     setPaymentStatus({
    //       status: 'Pago',
    //       amount: data.paidAmount,
    //       pixId: data.pixEndToEndId,
    //     });

    //     const createNewAgendamento = async () => {
    //       // Se o pagamento foi bem-sucedido, cria o agendamento
    //       try {
              
    //         console.log("agendamentos: ", checkoutData)

    //         for (const agendamento of checkoutData) {

    //           const agendamentoResponse = await createAgendamento(agendamento);
    //           console.log(`Agendamento para ${agendamento.dataServico} criado com sucesso!`, agendamentoResponse);

    //         }
              
    //       } catch (agendamentoError) {
    //           console.error("Erro ao criar os agendamentos", agendamentoError);
    //           alert("Erro ao criar os agendamentos!");
    //       } finally {
    //           reset();
    //       }
          
    //     }

    //     createNewAgendamento()

    //   } else {
    //     setPaymentStatus({ status: 'Falhou' });

    //   }
    // });

    // Fechar a conexão quando o componente for desmontado
    return () => {
      socket.disconnect();
    };
  }, [sessionCode]);


  const handleFinalizarCompra = async (data) => {
    setIsPaymentFailed(false);
    setIsPaymentFinally(false);
    setIsPayment(true);

    console.log("Valor total: ", checkoutData[0]?.valorLiquido || 0)

    console.log("Dados do cartão recebido: ", data);

    try {
        const token = await obterTokenCartao(data);
        console.log(token);

        if (metodoPagamento === 'credit_card') {
            // Cria a fatura do pedido
            const response = await criarFaturaCartao({
                email: user.email,
                items: [
                    {
                        description: "Fatura do seu pedido",
                        quantity: selectedDates.length, // Define a quantidade de itens com base nas datas selecionadas
                        price_cents: (checkoutData[0].valorLiquido / selectedDates.length) * 100, // Valor total
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

            console.log('Fatura criada com sucesso:', response);

            try {
              
              console.log("agendamentos: ", checkoutData)

              for (const agendamento of checkoutData) {

                const agendamentoResponse = await createAgendamento(agendamento);
                console.log(`Agendamento para ${agendamento.dataServico} criado com sucesso!`, agendamentoResponse);

              }
                
            } catch (agendamentoError) {
                console.error("Erro ao criar os agendamentos", agendamentoError);
                alert("Erro ao criar os agendamentos!");
            } finally {
                reset();
            }
          

            setTimeout(() => {
                navigate("/area-cliente");
                localStorage.removeItem('agendamentoData');
                localStorage.removeItem('selectedProvider');
                localStorage.removeItem('selectedDates');
                localStorage.removeItem('selectedTimes');

                setCheckoutData(null);
                setIsPayment(false);
            }, 4000);
        }
    } catch (error) {
        console.error('Erro no pagamento:', error);
        setIsPaymentFailed(true);
    } finally {
        setIsPaymentFinally(true);
    }
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDadosCartao((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const buttons = [
    { link: "#quem-somos", text: "Quem somos" },
    { link: "#duvidas", text: "Dúvidas" },
  ];

  const btnAcess = [
      {
          AcessPrim: "Criar Conta",
          AcessSec: "Fazer Login",
          LinkPrim: "cadastro-cliente",
          LinkSec: "login-cliente"
      },
  ];

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    }).format(valor);
  }

  const HandleCreditCard = () => {
    setMetodoPagamento("credit_card")
  }

  const handlePix = () => {
    setMetodoPagamento("pix")
  }

  const [loadingCheckout, setLoadingCheckout] = useState(true)

  useEffect(() => {
    // Durante o carregamento dos dados, manter o loading
    if (checkoutData.clienteId === null) {
      console.log("Dados do checkout não encontrados. Redirecionando...");
      navigate("/contrate-online");
    } else {
      // Quando os dados estão disponíveis, parar o loading
      setLoadingCheckout(false);
    }
  }, [checkoutData, navigate]);
  

  return (
    <>
      <HeaderWebApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess}/>
      <>
        {loadingCheckout ? (
          <div className='w-full h-screen flex items-center justify-center text-white'>
            <Spinner/>


          </div>

        ) : (
          <>
            <main className="relative p-4 flex lg:justify-between lg:pl-20 lg:pr-20 justify-center gap-5">
              <div className='flex flex-col p-10  min-w-[45vh] max-w-[45vh] lg:min-w-[120vh] lg:max-w-[120vh] md:min-w-[80vh] md:max-w-[80vh] sm:min-w-[80vh] sm:max-w-[80vh] shadow-lg pt-20 rounded-xl lg:min-h-[150vh] min-h-[90vh]'>
                <div className="mb-6 flex flex-col">
                  <div className='pb-4' >
                    <h1 className='text-prim font-semibold text-lg'>Método de pagamento</h1>
                  </div>
                  <div className='flex w-full gap-5'>
                    <div>
                      <div>
                          <Button
                          className='p-2 border bg-white sm:min-w-[30vh] border-bord rounded-md text-prim  text-start w-full flex items-center gap-2 justify-between'
                          onClick={HandleCreditCard}
                          >
                            <div className='flex items-center gap-2'>
                              <i className='fas fa-credit-card font-semibold text-ter'></i>
                                Cartão de crédito
                            </div>

                            {metodoPagamento === "credit_card" && (
                              <i class="fas fa-check"></i>
                            )}

                          </Button>
                      </div>
                    </div>
                    <div className='w-4/12'>
                      <div className='w-12/12'>
                        <Button
                        className='sm:min-w-[30vh]  p-2 border bg-white border-bord rounded-md text-prim lg:w-6/12 w-full text-start flex gap-2 items-center justify-between'
                        onClick={handlePix}
                        >
                          <div className='flex gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                              <path fill="#4db6ac" d="M11.9,12h-0.68l8.04-8.04c2.62-2.61,6.86-2.61,9.48,0L36.78,12H36.1c-1.6,0-3.11,0.62-4.24,1.76	l-6.8,6.77c-0.59,0.59-1.53,0.59-2.12,0l-6.8-6.77C15.01,12.62,13.5,12,11.9,12z"></path><path fill="#4db6ac" d="M36.1,36h0.68l-8.04,8.04c-2.62,2.61-6.86,2.61-9.48,0L11.22,36h0.68c1.6,0,3.11-0.62,4.24-1.76	l6.8-6.77c0.59-0.59,1.53-0.59,2.12,0l6.8,6.77C32.99,35.38,34.5,36,36.1,36z"></path><path fill="#4db6ac" d="M44.04,28.74L38.78,34H36.1c-1.07,0-2.07-0.42-2.83-1.17l-6.8-6.78c-1.36-1.36-3.58-1.36-4.94,0	l-6.8,6.78C13.97,33.58,12.97,34,11.9,34H9.22l-5.26-5.26c-2.61-2.62-2.61-6.86,0-9.48L9.22,14h2.68c1.07,0,2.07,0.42,2.83,1.17	l6.8,6.78c0.68,0.68,1.58,1.02,2.47,1.02s1.79-0.34,2.47-1.02l6.8-6.78C34.03,14.42,35.03,14,36.1,14h2.68l5.26,5.26	C46.65,21.88,46.65,26.12,44.04,28.74z"></path>
                            </svg>
                            Pix
                          </div>
                          {metodoPagamento === "pix" && (
                              <i class="fas fa-check"></i>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {metodoPagamento === 'credit_card' && (
                  <div>
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
                        {errors.nome && 
                          <span className="text-error opacity-75">{errors.nome?.message}</span>}
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
                        {errors.numero && 
                          <span className="text-error opacity-75">{errors.numero?.message}</span>}
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
                )}

                {metodoPagamento === 'pix' && (
                  <div className='flex justify-center w-full h-full'>
                    {qrCodePix ? (
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
                                  <div className='max-w-80 lg:max-w-xl'>
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
                      <div className='flex justify-center items-center w-full h-1/2 text-white'>
                        <Spinner size='lg' />
                      </div>
                    )}
            
            
                  </div>
                )}
              </div>

              <div className="hidden lg:block pt-[4vh] w-4/12 ">
                <div className="bg-desSec text-white shadow-md rounded-t-none rounded-lg pb-10  flex flex-col items-center gap-7">
                    <div className='w-full flex justify-between items-center border-b p-12 pb-2 pt-16 pl-7 pr-7'>
                        <h3 className="text-xl flex flex-wrap ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 font-semibold">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>

                            Valor a ser pago
                            
                        </h3>
                        <p className='text-lg ' >{checkoutData ? formatarMoeda(checkoutData[0].valorLiquido) : "R$ 0,00"}</p>

                    </div>
                    <div className='flex flex-col gap-7 w-full pl-7 pr-7'>
                        {checkoutData ?(
                            <div className='w-full flex flex-col  gap-2 justify-between'>
                                <p className='text-lg font-semibold'>Serviço selecionado:</p>
                                <p className='text-base'>{checkoutData[0].Servico}</p>
                            </div>
                        ):(
                            <div className='w-full flex flex-col  gap-2'>
                                <p className='text-lg font-semibold'>Serviço selecionado:</p>
                                <p className='text-base'>Nenhum serviço selecionado.</p>
                            </div>
                        )}

                        {/*Exibe as datas e horários selecionados */}
                        {selectedDates.length > 0 ? (
                            <div className='w-full flex flex-col gap-2 justify-between'>
                                <p className='text-md font-semibold'> Data(s) selecionado(s):</p>
                                <ul>
                                    {selectedDates.map((date, index) => (
                                        <li key={index} className="flex gap-5 items-center justify-between w-1/2">
                                            {/* Formata a data */}
                                            <span>{new Date(date).toLocaleDateString()}</span>
                                            {/* Exibe o horário correspondente à data */}
                                            {selectedTimes ? (
                                            (() => {
                                                const formattedDate = new Date(date).toDateString();
                                                const times = selectedTimes[formattedDate];
                                                return <span>{times ? times : "--:--"}</span>;
                                            })()
                                            ) : (
                                                <span> --:-- </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ):(
                            <div className='w-full flex flex-col  gap-2'>
                                <p className='text-lg font-semibold'>Data(s) selecionada(o):</p>
                                <p className='text-base'>Nenhuma data selecionada</p>
                            </div>
                        )}

                        {selectedProvider ? (
                            <div className='w-full flex flex-col  gap-2'>
                                <p className='text-md font-semibold'> Prestador selecionado:</p>
                                <div className='flex w-full items-center gap-2'>
                                    <Avatar src={selectedProvider.avatarUrl?.avatarUrl || ""} size="md"/>
                                    <p className='text-base'>{selectedProvider.name}</p>
                                </div>
                            </div>
                        ):(
                            <div className='w-full flex flex-col  gap-2'>
                                <p className='text-lg font-semibold'>Prestador selecionado</p>
                                <p className='text-base'>Nenhum prestador selecionado.</p>
                            </div>
                        )}

                        {checkoutData ?(
                            <div className='w-full flex flex-col  gap-2'>
                                <p className='text-md font-semibold'> Observação:</p>
                                <div className='flex w-full items-center gap-2'>
                                    <p className='text-base'>{checkoutData.observacao}</p>
                                    {/*Mostra o avatar do prestador */}
                                </div>
                            </div>
                        ):(
                            <div className='w-full flex flex-col  gap-2'>
                                <p className='text-lg font-semibold'>Observação:</p>
                                <p className='text-base'>Nenhuma</p>
                            </div>
                        )}

                    </div>
                  </div>
              </div> 
              </main>
              <Footer/>
              <Dialog open={isPayment} onClose={() => {}} className="relative z-10">
                <DialogBackdrop
                  transition
                  className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-prim bg-opacity-50">
                  <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                      transition
                      className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 max-w-full"
                    >
                      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 flex flex-col justify-center items-center min-h-96 gap-5 w-96 lg:w-auto md:w-auto sm:w-auto">
                        {isPaymentFinally ? (
                          <>
                            {isPaymentFailed ? (
                              <>
                                <div className='text-sec'>
                                  {/* icone aqui */}
                                  <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="red" strokeWidth="2"/>
                                    <line x1="8" y1="8" x2="16" y2="16" stroke="red" strokeWidth="2"/>
                                    <line x1="8" y1="16" x2="16" y2="8" stroke="red" strokeWidth="2"/>
                                  </svg>
                                </div>
                                <div className='text-center'>
                                  <p className='text-error'>｡•́︿•̀｡</p>
                                  <h2 className='text-error font-semibold text-xl'>Falha ao processar pagamento</h2>
                                  <p className='text-prim text-sm' >Não foi possível realizar o pagamento, tente novamente mais tarde ou entre em contato com o seu banco.</p>
                                </div>
                                <div>
                                  <Button className='bg-white text-error border border-error' onPress={() => setIsPayment(false)}>
                                    Voltar
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className='text-sec flex justify-center items-center gap-5'>
                                  <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="green" strokeWidth="2"/>
                                    <path d="M8 12l2 2 4-4" stroke="green" strokeWidth="2" fill="none"/>
                                  </svg>
                                </div>
                                <div className='text-center'>
                                  <p className='text-sec font-semibold '>＾▽＾</p>
                                  <h2 className='text-sec font-semibold text-xl'>Pagamento realizado com sucesso!</h2>
                                  <div>
                                    <p className='text-prim text-sm text-center' >Obrigado por agendar um serviço na Limppay, volte sempre! Para mais detalhes sobre seu agendamento, entre no seu perfil</p>
                                  </div>
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <div className='text-white'>
                              <Spinner size='lg'/>
                            </div>
                            <div>
                              <h2 className='text-prim font-semibold'>Processando pagamento</h2>
                            </div>
                          </>
                        )}
                      </div>
                    </DialogPanel>
                  </div>
                </div>
              </Dialog>

              {/* resumo da compra */}
              <div className={`sm:hidden fixed bottom-0 left-0 min-w-[45vh] max-w-[45vh]  transition-all duration-300 ease-in-out ${isExpanded ? 'h-[60vh]' : 'h-[10vh]'} bg-white border-2 border-desSec  rounded-t-3xl p-2  text-prim shadow-2xl  `}>
                <div
                    className="cursor-pointer bg-white  p-4 text-center  font-semibold rounded-t-lg"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="text-xl font-semibold text-prim">Total</h3>
                        <div className='flex gap-2 items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 text-sec">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>

                            <p className="text-lg text-sec">{checkoutData ? formatarMoeda(checkoutData[0].valorServico) : "R$ 0,00"}</p>

                        </div>
                    </div>
                    
                    

                </div>

                <div className={`overflow-y-auto p-4 ${isExpanded ? 'block' : 'hidden'}`}>
                    <div className="flex flex-col gap-4">
                        {/* Valor total */}
                        

                        {/* Serviço selecionado */}
                        <div className="flex flex-col gap-2">
                            <p className="text-lg font-semibold">Serviço selecionado:</p>
                            <p className="text-base">{checkoutData[0]?.Servico || 'Nenhum serviço selecionado.'}</p>
                        </div>

                        {/* Datas e horários */}
                        <div className="flex flex-col gap-2">
                            <p className="text-lg font-semibold">Data(s) selecionada(s):</p>
                            {selectedDates.length > 0 ? (
                                <ul>
                                    {selectedDates.map((date, index) => (
                                        <li key={index} className="flex justify-between">
                                            <span>{new Date(date).toLocaleDateString()}</span>
                                            <span>{selectedTimes ? selectedTimes[new Date(date).toDateString()] || '--:--' : '--:--'}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-base">Nenhuma data selecionada.</p>
                            )}
                        </div>

                        {/* Prestador selecionado */}
                        <div className="flex flex-col gap-2">
                            <p className="text-lg font-semibold">Prestador selecionado:</p>
                            {selectedProvider ? (
                                <div className="flex items-center gap-2">
                                    <Avatar src={selectedProvider?.avatarUrl?.avatarUrl || ""} size="sm" />
                                    <p className="text-base">{selectedProvider.name}</p>
                                </div>
                            ) : (
                                <p className="text-base">Nenhum prestador selecionado.</p>
                            )}
                        </div>

                        {/* Observação */}
                        <div className="flex flex-col gap-2">
                            <p className="text-lg font-semibold">Observação:</p>
                            <p className="text-base">{checkoutData.observacao || 'Nenhuma'}</p>
                        </div>
                    </div>
                </div>
              </div>
          
          
          
          </>
          
        )}
      
      </>

    </>
  );
}

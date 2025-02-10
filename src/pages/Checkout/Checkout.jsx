import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderWebApp from '../../componentes/App/HeaderWebApp';
import { Logo, Footer } from '../../componentes/imports';
import { useSelectedProvider } from '../../context/SelectedProvider';
import { Avatar } from '@nextui-org/avatar'
import { useUser } from '../../context/UserProvider';
import { Button, Spinner } from '@nextui-org/react';
'use client'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { useCheckout } from '../../context/CheckoutData';
import Credit_Card from '../../componentes/Checkout/Credit_Card';
import Pix from '../../componentes/Checkout/Pix';
import { fetchUserInfo } from '../../common/FetchUserInfo'
import StepLoginCustomer from '../App/StepLoginCustomer';
import { createAgendamento, removeCheckout, verifyCheckout } from '../../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const {user, setUser, loadingUser} = useUser()
  const { selectedProvider } = useSelectedProvider()
  const {checkoutData , setCheckoutData, isLoadingCheckout, sessionCode, setiIsLoadingCheckout, setStatus, setInvoiceId, setCodePix, setKeyPix, setSessionCodeState} = useCheckout()

  const [metodoPagamento, setMetodoPagamento] = useState('credit_card'); // Cartão de crédito padrão
  const [isPayment, setIsPayment] = useState(false) // abre o modal de loading
  const [isPaymentFinally, setIsPaymentFinally] = useState(false) // define se o pagamento foi finalizado
  const [isPaymentFailed, setIsPaymentFailed] = useState(false) // define se houve erro ou nao ao processar pagamento
  const [paymentStatus, setPaymentStatus] = useState(null);
  

  function calcularDataValidade(diasParaVencer, dataInicial = new Date()) {
    const data = new Date(dataInicial); // Cria uma cópia da data inicial
    data.setDate(data.getDate() + diasParaVencer); // Adiciona os dias
    return data.toISOString().split('T')[0]; // Retorna a data no formato YYYY-MM-DD
  }

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

  useEffect(() => {
    if(!isLoadingCheckout ) {
      if (!checkoutData) {
        navigate("/contrate-online");
        return;
      } 
    }
      
  }, [isLoadingCheckout, checkoutData]);

  const HandleContinue = () => {
    setCheckoutData(null)
    setSessionCodeState(null)
    navigate('/area-cliente')
  }

  const HandleNew = () => {
    setCheckoutData(null)
    setSessionCodeState(null)
    navigate('/contrate-online')
  }

  console.log("Codigo de sessão: ", sessionCode)
  if (!sessionCode) {            
    setiIsLoadingCheckout(true)
    window.location.reload()
  }

  // efeito para identificar se o pedido já foi pago 
  useEffect(() => {
    const handleFinalizarCheckout = async () => {
      try {
          console.log("Codigo de sessão: ", sessionCode)
          if (!sessionCode) return

          const response = await verifyCheckout(sessionCode); // Envia o sessionCode para a API

          console.log("Status do pedido: ", response?.data?.status)


          if (response?.data?.status === 'Pago') {
            console.log("Pedido pago com sucesso!");
            setIsPayment(true);

            // Criar agendamentos
            const agendamentoPromises = checkoutData.map(agendamento => createAgendamento(agendamento));
            const agendamentoResults = await Promise.allSettled(agendamentoPromises);
            const errosDeAgendamento = agendamentoResults.filter(result => result.status === "rejected");

            if (errosDeAgendamento.length > 0) {
              console.error("Alguns agendamentos falharam:", errosDeAgendamento);

              // Notificar suporte (opcional: enviar para API de log/suporte)

              // Informar o usuário
              alert("Pagamento realizado com sucesso, mas houve falha ao criar alguns agendamentos. Nossa equipe já foi notificada e resolveremos o problema.");

            } else {
              try {
                const response = await removeCheckout()
                setPaymentStatus(null);
                setStatus(null)
                setInvoiceId(null)
                setCodePix(null)
                setKeyPix(null)
                setIsPaymentFinally(true)

              } catch (error) {
                console.log(error)
                  
              }
            }  
            
          } else {
            console.log("Pedido ainda não foi pago.");  
          }

      } catch (error) {
        console.log(error)

      }

    };
  
    
    handleFinalizarCheckout();

  }, [sessionCode, checkoutData, isLoadingCheckout]);
  
  return (
    <>
      <HeaderWebApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess}/>
      <>
        {loadingUser || user ? (
          isLoadingCheckout || !checkoutData ? (
            <div className='w-full h-screen flex items-center justify-center text-white'>
              <Spinner/>
            </div>
  
          ) : (
            <>
              <main className="relative sm:p-4 flex flex-col sm:flex-row lg:justify-between lg:pl-10 lg:pr-10 justify-center gap-5 sm:pb-25 ">
                <div className='flex flex-col p-10 md:min-w-90vh]  md:max-w-[90vh]  min-w-[45vh] max-w-[45vh] 2xl:min-h-[90vh]  2xl:pt-[10vh] 2xl:min-w-[100vh] 2xl:max-w-[100vh] lg:min-w-[100vh] lg:max-w-[100vh]  sm:min-w-[80vh] sm:max-w-[80vh] shadow-lg pt-20 rounded-xl lg:min-h-[95vh] min-h-[90vh] '>
                  <div className="mb-6 flex flex-col">
                    <div className='pb-4' >
                      <h1 className='text-prim font-semibold text-lg 2xl:text-xl'>Método de pagamento</h1>
                    </div>
                    <div className='flex w-full gap-5'>
                      <div>
                        <div>
                            <Button
                            className='p-2 border bg-white sm:min-w-[30vh] border-bord rounded-md text-prim  text-start w-full flex items-center gap-2 justify-between'
                            onPress={() => HandleCreditCard()}
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
                          onPress={() => handlePix()}
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
                    <>
                      <Credit_Card
                        setIsPayment={setIsPayment}
                        setIsPaymentFailed={setIsPaymentFailed}
                        setIsPaymentFinally={setIsPaymentFinally}
                        calcularDataValidade={calcularDataValidade}
                        checkoutData={checkoutData}
                        metodoPagamento={metodoPagamento}
                        user={user}
                      />
                    </>
                  )}
  
                  {metodoPagamento === 'pix' && (
                    <Pix
                      calcularDataValidade={calcularDataValidade}
                      user={user}
                      checkoutData={checkoutData}
                      metodoPagamento={metodoPagamento}
                      setPaymentStatus={setPaymentStatus}
                      paymentStatus={paymentStatus}
                    />
                  )}
                </div>
  
                <div className="  w-full flex flex-col justify-start items-center ">
                  <div className='2xl:min-w-[80vh]  2xl:max-w-[80vh] xl:min-w-[90vh]  xl:pt-[10vh] flex flex-col pt-5 p-10 min-w-[45vh] max-w-[50vh] 2xl:min-h-[90vh]  2xl:pt-[10vh] lg:min-w-[60vh]  lg:max-w-[60vh] md:min-w-[50vh]  md:max-w-[50vh] shadow-lg sm:pt-20 rounded-xl    text-prim  '>
  
                    <div className='w-full flex flex-col justify-between items-center border-bord pb-2 border-b xl:pt-[2vh] '>
                        <div className='flex justify-center items-center w-full '>
                          <h3 className="text-2xl flex flex-wrap text-prim font-semibold justify-center items-center ">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 font-semibold ">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                              </svg>
  
                              Resumo do Pedido
                              
                          </h3>                        
                        </div>
  
                    </div>
                    
                    <div className='flex flex-col gap-7 w-full pt-5'>
                      <div>
                        <div className='w-full flex flex-col gap-5'>
                          <div className='pt-2'>
                            <div className='w-full flex justify-between'>
                              <p>Quantidade: </p>
                              <span> {checkoutData?.length} </span>
                            </div>
                            <div className='w-full flex justify-between'>
                              <p>Valor Serviço: </p>
                              <span> {formatarMoeda(checkoutData[0]?.valorServico)} </span>
                            </div>
                            <div className='w-full flex justify-between'>
                              <p>Total: </p>
                              <span> {formatarMoeda(checkoutData[0]?.valorBruto)} </span>
                            </div>
  
                          </div>
  
                          <div className='w-full shadow-md  text-prim p-2 rounded-md flex flex-col gap-2'>
                            <div className='w-full flex justify-between'>
                              <p>Desconto Total: </p>
                              <span> {formatarMoeda(checkoutData[0]?.descontoTotal)} </span>
                            </div>
                            <div className='w-full flex justify-between'>
                              <p>Valor a ser pago: </p>
                              <span> {formatarMoeda(checkoutData[0]?.valorLiquido)} </span>
                            </div>
  
                          </div>
  
  
                        </div>
                      </div>
  
                        {checkoutData ?(
                          <div className="flex flex-col gap-2">
                            <div className='w-full flex flex-col  gap-2 justify-between'>
                                <p className='text-lg font-semibold'>Serviço selecionado:</p>
                                <div className='flex items-center w-full justify-between'>
                                    <p className='text-base'>{checkoutData[0].Servico}</p>
                                    <p className='text-base'>{formatarMoeda(checkoutData[0].valorServico)}</p>
                                </div>
                            </div>
                          </div>
                        ):(
                            <div className='w-full flex flex-col  gap-2'>
                                <p className='text-lg font-semibold'>Serviço selecionado:</p>
                                <p className='text-base'>Nenhum serviço selecionado.</p>
                            </div>
                        )}
  
                        {/*Exibe as datas e horários selecionados */}
                        {checkoutData.length > 0 ? (
                            <div className='w-full flex flex-col gap-2 justify-between overflow-y-auto max-h-[40vh]'>
                                <p className='text-md font-semibold'> Data(s) selecionado(s):</p>
                                <ul>
                                    {checkoutData.map((date, index) => (
                                        <li key={index} className="flex gap-5 items-center justify-between w-1/2">
                                            {/* Formata a data */}
                                            <span>{new Date(date.dataServico).toLocaleDateString()}</span>
                                            {/* Exibe o horário correspondente à data */}
                                            <span>{date.horaServico ? date.horaServico : "--:--"}</span>
  
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
                                    <p className='text-base'>{checkoutData[0].observacao}</p>
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
                                <div className='w-full flex justify-center gap-5'>
                                  <a href="/contrate-online">
                                    <Button className='bg-white text-sec border border-sec ' onPress={() => HandleNew()}>
                                      Novo pedido
                                    </Button>
                                  </a>
                                  <a href="/area-cliente">
                                    <Button className='bg-white text-sec border border-sec' onPress={() => HandleContinue()}>
                                      Continuar
                                    </Button>
                                  </a>
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
                              <h2 className='text-prim font-semibold text-center'>
                                {metodoPagamento == 'credit_card' ? "Processando pagamento" : " Criando agendamentos, aguarde :)"} 
                              </h2>
                            </div>
                          </>
                        )}
                      </div>
                    </DialogPanel>
                  </div>
                </div>
              </Dialog>
            </>
            
          )
        ) : (
          <div className='pt-[10vh]'>
            <StepLoginCustomer/>
          </div>
        )}
      
      
      </>

    </>
  );
}

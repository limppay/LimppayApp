import React, { useEffect, useState } from 'react';
import { useAgendamentoData } from '../../context/AgendamentoData';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderWebApp from '../../componentes/App/HeaderWebApp';
import { Logo, Footer } from '../../componentes/imports';
import CardLogoLimppay from "../../assets/img/limppay-icone-branco-card.svg"

import { useSelectedProvider } from '../../context/SelectedProvider';
import { useSelectedDates } from '../../context/SelectedDates';
import { useSelectedTimes } from '../../context/SelectedTimes';

import { Avatar } from '@nextui-org/avatar';

import { criarFaturaCartao, criarFaturaPix } from '../../services/api';

import { useUser } from '../../context/UserProvider';

export default function Checkout() {
  const { agendamentoData, setAgendamentoData } = useAgendamentoData();
  const {selectedProvider} = useSelectedProvider()
  const {selectedDates} = useSelectedDates()
  const {selectedTimes} = useSelectedTimes()
  const navigate = useNavigate();
  const location = useLocation(); // Obtém a localização atual

  const [dadosCartao, setDadosCartao] = useState({
      numero: null,
      cvc: null,
      mesExpiracao: null,
      anoExpiracao: null,
      nome: ""
  });

  const {user} = useUser()

  const [metodoPagamento, setMetodoPagamento] = useState('credit_card'); // Cartão de crédito padrão
  const [qrCodePix, setQrCodePix] = useState('');  // Estado para armazenar o QR Code PIX
  const [pixChave, setPixChave] = useState('');    // Estado para armazenar a chave PIX
  const [isLoading, setIsLoading] = useState(false)

  console.log(agendamentoData)
  const AgendamenteDataQtd = [agendamentoData]
  console.log(AgendamenteDataQtd.length)

  const createPix = async () => {
    if(isLoading) return

    const response = await criarFaturaPix(
      {
        email: user.email,
        due_date: "2024-12-01",
        items: [
          {
            "description": "Testando API de pagamento via pix da Iugu",
            "quantity": AgendamenteDataQtd.length,
            "price_cents": agendamentoData.valorServico * 100
          }
        ],
        payer: {
          "cpf_cnpj": "08213350227",
          "name": user.name
        },
      }
    );
    
    console.log(response.pix.qrcode)
    console.log(response.pix.qrcode_text)
    setQrCodePix(response.pix.qrcode)
    setPixChave(response.pix.qrcode_text)
    setIsLoading(true)
  }

  if (metodoPagamento === 'pix') {
    createPix()
  }

  const handleFinalizarCompra = async () => {
    try {
      let response;

      if (metodoPagamento === 'credit_card') {
        response = await criarFaturaCartao(
          {
            email: user.email,
            items: [
              {
                "description": "Fatura do seu pedido",
                "quantity": AgendamenteDataQtd.length,
                "price_cents": agendamentoData.valorServico * 100
              }
            ],
            payment_method: "credit_card",
            due_date: "2024-12-31", 
            payer: {
              name: dadosCartao.nome,
              cpf_cnpj: "08213350227"
            },
            credit_card: {
              number: dadosCartao.numero, 
              verification_value: dadosCartao.cvc, 
              expiration_month: dadosCartao.mesExpiracao, 
              expiration_year: dadosCartao.anoExpiracao,
              holder_name: dadosCartao.nome 
            }
          }          
        );
        console.log(response)
      } 

    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro ao processar o pagamento. Tente novamente.');
    }
  };

  console.log(pixChave)
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDadosCartao({
        ...dadosCartao,
        [name]: value,
    });
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

  useEffect(() => {
    const savedData = localStorage.getItem('agendamentoData');
    if (savedData) {
      setAgendamentoData(JSON.parse(savedData));
    }
  }, [setAgendamentoData]);

  useEffect(() => {
    const handleRouteChange = () => {
      // Limpa os dados apenas se sair da rota '/checkout-pagamento'
      if (location.pathname !== '/checkout-pagamento') {
        setAgendamentoData(null);
        localStorage.removeItem('agendamentoData'); // Remove do localStorage
      }
    };

    // Verifica se os dados do agendamento não existem, redireciona para '/contrate-online'
    if (!agendamentoData) {
      return navigate('/contrate-online');
    }

    // Salva os dados no localStorage sempre que o estado mudar
    localStorage.setItem('agendamentoData', JSON.stringify(agendamentoData));

    // Ouve mudanças na rota para limpar dados ao sair de '/checkout-pagamento'
    return () => {
      handleRouteChange();
    };
  }, [location.pathname, agendamentoData, setAgendamentoData, navigate]);

  if (!agendamentoData) {
    return null; // Não renderiza se os dados não estiverem disponíveis
  }

  return (
    <>
      <HeaderWebApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess}/>

      <main className="relative p-4 flex lg:justify-between lg:pl-20 lg:pr-20 justify-center gap-5">
        <div className='flex flex-col p-10  min-w-[50vh] max-w-[50vh] lg:min-w-[120vh] lg:max-w-[120vh] md:min-w-[80vh] md:max-w-[80vh] sm:min-w-[80vh] sm:max-w-[80vh] shadow-lg pt-20 rounded-xl min-h-[150vh]'>
          <div className="mb-6 flex flex-col">
            <div className='pb-2' >
              <h1 className='text-prim font-semibold text-lg'>Método de pagamento</h1>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <input 
                id="pp" 
                type="radio" 
                name="payment" 
                className="mr-2" 
                checked={metodoPagamento === 'credit_card'}
                value="credit_card"
                onChange={(e) => setMetodoPagamento(e.target.value)}
                />
                <label htmlFor="pp" className="text-prim ">cartão de crédito</label>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <input 
                id="cd" 
                type="radio" 
                name="payment" 
                className="mr-2" 
                value='pix'
                checked={metodoPagamento === 'pix'}
                onChange={(e) => setMetodoPagamento(e.target.value)}
                />
                <label htmlFor="cd" className="text-prim">Pix</label>
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

              <div className="mb-4">
                <label htmlFor="cardholdername" className="block text-prim mb-2">Nome</label>
                <input
                  id="cardholdername"
                  type="text"
                  placeholder="Igual ao do cartão"
                  className=" w-full p-2 border border-bord rounded-md text-prim focus:outline-prim "
                  name='nome'
                  value={dadosCartao.nome}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="cardnumber" className="block text-prim mb-2">Número do cartão</label>
                <input
                  id="cardnumber"
                  type="text"
                  placeholder="8888-8888-8888-8888"
                  className="w-full p-2 border border-bord rounded-md text-prim focus:outline-prim "
                  maxLength="19"
                  name='numero'
                  value={dadosCartao.numero}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-between  mb-4">
                <div className="w-1/2 pr-2">
                  <label htmlFor="expiry-date" className="block text-prim mb-2">Validade</label>
                  <div className="flex gap-2">

                    <input
                      className="w-full p-2 border border-bord rounded-md text-prim focus:outline-prim "
                      type="number"
                      name="mesExpiracao"
                      placeholder="MM"
                      value={dadosCartao.mesExpiracao}
                      onChange={handleInputChange}
                    />

                    <input
                      className="w-full p-2 border border-bord rounded-md text-prim focus:outline-prim "
                      type="number"
                      name="anoExpiracao"
                      maxLength="2"
                      placeholder="YY"
                      value={dadosCartao.anoExpiracao}
                      onChange={handleInputChange}
                    />

                  </div>
                </div>
                <div className="w-1/2 pl-2">
                  <label htmlFor="cvv" className="block text-prim mb-2">CVC</label>
                  <input
                    type="number"
                    maxLength="4"
                    placeholder="123"
                    className="w-full p-2 border border-bord rounded-md text-prim focus:outline-prim "
                    name='cvc'
                    value={dadosCartao.cvc}
                    onChange={handleInputChange}
                    />
                </div>
              </div>

              <div className="mt-6">
                <button 
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
                onClick={handleFinalizarCompra}
                >
                  <i className="ion-locked mr-2"></i>Finalizar compra
                </button>
              </div>
            </div>
          )}

          {metodoPagamento === 'pix' && (
            <div className='flex justify-center w-full'>
              {qrCodePix && (
                <div>
                  <h3>Escaneie o QR Code para pagamento via PIX:</h3>
                  <img src={qrCodePix} alt="QR Code PIX" />
                  <p>Ou use a chave PIX</p>
                  <div className='w-1/2'>
                    <p className='text-sm flex flex-wrap max-w-[10vh]'>{pixChave}</p>
                  </div>
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
                  <p className='text-lg ' >{agendamentoData ? formatarMoeda(agendamentoData.valorServico) : "R$ 0,00"}</p>

              </div>
              <div className='flex flex-col gap-7 w-full pl-7 pr-7'>
                  {agendamentoData ?(
                      <div className='w-full flex flex-col  gap-2 justify-between'>
                          <p className='text-lg font-semibold'>Serviço selecionado:</p>
                          <p className='text-base'>{agendamentoData.Servico}</p>
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

                  {agendamentoData ?(
                      <div className='w-full flex flex-col  gap-2'>
                          <p className='text-md font-semibold'> Prestador selecionado:</p>
                          <div className='flex w-full items-center gap-2'>
                              <Avatar src={selectedProvider.avatar?.avatarUrl} size="md"/>
                              <p className='text-base'>{selectedProvider.name}</p>
                          </div>
                      </div>
                  ):(
                      <div className='w-full flex flex-col  gap-2'>
                          <p className='text-lg font-semibold'>Prestador selecionado</p>
                          <p className='text-base'>Nenhum prestador selecionado.</p>
                      </div>
                  )}

                  {agendamentoData ?(
                      <div className='w-full flex flex-col  gap-2'>
                          <p className='text-md font-semibold'> Observação:</p>
                          <div className='flex w-full items-center gap-2'>
                              <p className='text-base'>{agendamentoData.observacao}</p>
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
    </>
  );
}

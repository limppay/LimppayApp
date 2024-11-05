import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HeaderApp, Logo,Footer} from '../../componentes/imports.jsx'
import User from "../../assets/img/diarista-cadastro/user.png"
import LoadingSpinner from '../../componentes/FormCadastro/Loading.jsx';
import EditClienteModal from './EditClienteModal.jsx';
import { createReview, getAvaliacoes, getEnderecoDefaultCliente } from '../../services/api.js';
import HeaderWebApp from '../../componentes/App/HeaderWebApp.jsx';
import { Avatar, Spinner } from '@nextui-org/react';
import { getAgendamentos } from '../../services/api.js';
'use client'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

const AreaCliente = () => {
    
    const [userInfo, setUserInfo] = useState(null);
    const[Open, SetOpen] = useState(false)
    const userId = localStorage.getItem('userId'); // Obter o ID do usuário do localStorage
    const token = localStorage.getItem('token'); // Obter o token do localStorage
    // Recuperar as URLs e converter para objeto JSON
    const [urls, setUrls] = useState(JSON.parse(localStorage.getItem('urls')) || {}); // Atualize o estado URLs aqui
    const [adressDefault, setAdressDefault] = useState([])
    const [agendamentos, setAgendamentos] = useState([])
    const [avaliacoes, setAvaliacoes] = useState([])

    const [selectedAgendamento, setSelectedAgendamento] = useState([])
    const [selectedAvaliacao, setSelectedAvaliacao] = useState([])

    const [openPerfil, setOpenPerfil] = useState(false)
    const [openDetalhes, setOpenDetalhes] = useState(false)

    const [rating, setRating] = useState(0); // Estado para armazenar o valor da avaliação
    // Função para atualizar a avaliação
    const [prestadorId, setPrestadorId] = useState('')

    const handleRating = (value) => {
        setRating(value);
    };
    const [review, setReview] = useState(''); // Estado para armazenar o valor do textarea
    // Função para atualizar o estado com o valor do textarea
    const handleReviewChange = (event) => {
        setReview(event.target.value);
    };

    function Star({ filled, onClick }) {
        return (
            <>
                <div >
                    <span
                        onClick={onClick}
                        className={`text-4xl cursor-pointer transition-colors ${
                        filled ? 'text-des' : 'text-prim hover:text-des'
                        }`}
                    >
                        ★
                    </span>
                </div>
            </>
        );
    }

    function StarReview({ filled }) {
        return (
            <span
                className={`text-4xl ${
                    filled ? 'text-des' : 'text-prim'
                }`}
            >
                ★
            </span>
        );
    }
    

 


    const handleCreateReview = async () => {
        const reviewData = {
            clientId: userId,
            providerId: prestadorId,
            stars: rating,
            comment: review,
        };

        console.log("Avaliação", reviewData);
        
        try {
            const response = await createReview(reviewData);
            console.log(response);
            setRating(0)
            setReview('')

        } catch (error) {
            console.log(error);
        } finally {
            const avaliacoes = await getAvaliacoes(userId)
            setAvaliacoes(avaliacoes)
            setOpenDetalhes(false)

        }
    };



    

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`https://limppay-api-production.up.railway.app/cliente/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const enderecoDefault = await getEnderecoDefaultCliente(userId)
                const agendamentos = await getAgendamentos(userId)
                const avaliacoes = await getAvaliacoes(userId)

                setAgendamentos(agendamentos)
                setAvaliacoes(avaliacoes)

                const endereco = {
                    iD_Endereco: enderecoDefault[0].id,
                    clienteId: enderecoDefault[0].clienteId,
                    cep: enderecoDefault[0].cep,
                    cidade: enderecoDefault[0].cidade,
                    complemento: enderecoDefault[0].complemento,
                    estado: enderecoDefault[0].estado,
                    logradouro: enderecoDefault[0].logradouro,
                    numero: enderecoDefault[0].numero,
                    referencia: enderecoDefault[0].referencia,
                    bairro: enderecoDefault[0].bairro
                }

                console.log(endereco)

                setAdressDefault([endereco])
                
                const combineData = {
                    ...response.data,
                    ...endereco,
                }
                
                setUserInfo(combineData);
                
            } catch (error) {
                console.error('Erro ao buscar informações do usuário:', error);
            }
        };
        
        if (token && userId) {
            fetchUserInfo();
        }
    }, [token, userId]);

    
    console.log("Endereco padrao", adressDefault)
    console.log("Dados combinados do cliente: ", userInfo)
    console.log("Meus Agendamentos",agendamentos)
    console.log("Minhas avaliaçoes",avaliacoes)


    useEffect(() => {
        console.log("Informações do usuário atualizadas:", userInfo);
    }, [userInfo]); // Isso vai logar as informações do usuário toda vez que mudarem

    

    const handleUserUpdated = (updatedInfo) => {
        const enderecoDefault = updatedInfo.updatedCliente.EnderecoDefault[0];
    
        const updatedUserInfo = {
            ...userInfo,
            ...updatedInfo.updatedCliente,
            iD_Endereco: enderecoDefault.id,
            clienteId: enderecoDefault.clienteId,
            cep: enderecoDefault.cep,
            cidade: enderecoDefault.cidade,
            complemento: enderecoDefault.complemento,
            estado: enderecoDefault.estado,
            logradouro: enderecoDefault.logradouro,
            numero: enderecoDefault.numero,
            referencia: enderecoDefault.referencia,
            bairro: enderecoDefault.bairro,
        };
    
        // Remover a propriedade EnderecoDefault do objeto principal
        delete updatedUserInfo.EnderecoDefault;
    
        setUserInfo(updatedUserInfo);
    
        const newUrls = updatedInfo.urls;
        localStorage.setItem('urls', JSON.stringify(newUrls));
        setUrls(newUrls);
    };
    

    // Anexos
    const avatarUrl = urls ? Object.values(urls)[0] : null;

    const buttons = [
        { link: "/", text: "Dúvidas"},
        { link: "/", text: "Quem Somos"},
        { link: "/contrate-online", text: "Contrate Online"},
    ]

    const btnAcess = [

    ]

    const calcularIdade = (data) =>{
        const hoje = new Date();
        const nascimento = new Date(data);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();

        if(mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())){
            idade--;
        }

        return idade;
    };

    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        }).format(valor);
    }

    return (
        <div>
            <HeaderWebApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess}/>
            <main className='flex flex-col  p-5 '>
                {userInfo ? (
                    <>
                        <section className='pt-14 lg:pt-24 lg:flex justify-between w-full gap-1 '>
                            <div className='flex flex-col gap-5 text-center max-w-50 min-w-72 min-h-60  p-5 rounded-md  lg:w-4/12 lg:h-full'>
                                <div className="flex flex-col justify-center items-center gap-2">
                                    <div className='flex items-center'>
                                        <div>
                                            <p className='text-prim cursor-pointer' onClick={()=> SetOpen(true)}>Editar Perfil</p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-6 text-prim">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </div>
                                    <img src={avatarUrl}
                                    id='avatar' 
                                    alt="foto de perfil" 
                                    className="transition-all duration-200 rounded-full w-60 h-60  hover:bg-ter p-0.5 hover:bg-opacity-40 shadow-md cursor-pointer" 
                                    onClick={()=> SetOpen(true)}
                                    
                                    />                                             
                                </div>
                                
                                <div className='flex flex-col gap-3 h-full max-w-full max-h-full pl-5 pr-5'>
                                    <h1 className='text-xl text-ter'>{userInfo.name}</h1>
                                    <div className="overflow-y-auto max-h-32">
                                        <p className='text-prim text-center'>
                                            {calcularIdade(userInfo.data)} anos
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col shadow-md shadow-prim rounded-md text-center lg:w-8/12 '>
                                <div className='bg-desSec text-white p-5 rounded-b-none rounded-md lg:hidden'>
                                    <h1 className='text-xl'>Minhas Informações</h1>
                                </div>
                                <div className='p-5 flex gap-10 flex-col lg:gap-7'>
                                    <div className='border-b border-bord p-2 flex  gap-2 flex-col lg:flex-row lg:p-0'>
                                        <div className='lg:w-3/12'>
                                            <p className='flex items-start text-ter lg:text-sm'>Nome Completo</p>
                                        </div>
                                        <div>
                                            <p className='flex items-start text-prim lg:text-sm'>{userInfo.name}</p>
                                        </div>
                                    </div>
                                    <div className='border-b border-bord p-2 flex  gap-2 flex-col lg:flex-row lg:p-0'>
                                        <div className='w-3/12'>
                                            <p className='flex items-start text-ter lg:text-sm'>Email</p>
                                        </div>
                                        <div className='flex'>
                                            <p className='flex items-start text-prim lg:text-sm'>{userInfo.email}</p>
                                        </div>
                                    </div>
                                    <div className='border-b border-bord p-2 flex  gap-2 flex-col lg:flex-row lg:p-0'>
                                        <div className='w-3/12'>
                                            <p className='flex items-start text-ter lg:text-sm'>Telefones</p>
                                        </div>
                                        <div>
                                            <p className='flex items-start text-prim lg:text-sm'>{userInfo.telefone_1}</p>
                                        </div>
                                        <div>
                                            <p className='flex items-start text-prim lg:text-sm'>{userInfo.telefone_2}</p>
                                        </div>
                                    </div>
                                    <div className='border-b border-bord p-2 flex  gap-2 flex-col lg:flex-row lg:p-0'>
                                        <div className='w-3/12'>
                                            <p className='flex items-start text-ter lg:text-sm'>Estado</p>
                                        </div>
                                        <div>
                                            <p className='flex items-start text-prim lg:text-sm'>{userInfo.estado}</p>
                                        </div>
                                    </div>
                                    <div className='border-b border-bord p-2 flex  gap-2 flex-col lg:flex-row lg:p-0'>
                                        <div className='w-3/12'>
                                            <p className='flex items-start text-ter lg:text-sm'>Cidade</p>
                                        </div>
                                        <div>
                                            <p className='flex items-start text-prim lg:text-sm'>{userInfo.cidade}</p>
                                        </div>
                                    </div>
                                    <div className='border-b border-bord p-2 flex flex-col  gap-2 lg:flex-row lg:p-0'>
                                        <div className='w-3/12'>
                                            <p className='flex items-start text-ter lg:text-sm'>Endereço</p>
                                        </div>
                                        <div>
                                            <p className='text-start text-prim lg:text-sm '>{userInfo.logradouro + ", " +  userInfo.numero + ", " + userInfo.bairro + ", " + userInfo.cep}</p>
                                        </div>
                                    </div>

                                </div>
                                {/* Modal de edição */}
                                <EditClienteModal 
                                    Open={Open}
                                    SetOpen={() => SetOpen(false)} 
                                    userInfo={userInfo} 
                                    token={token} 
                                    onUserUpdated={handleUserUpdated}
                                    Urls={urls} 
                                />                          
                            </div>      
                        </section>
                        <section className='mt-5 lg:flex-row lg:gap-5 lg:justify-around flex flex-col gap-5'>
                            <div className='lg:w-1/2 flex flex-col items-center shadow-md shadow-prim rounded-md ' >
                                <div className='p-5 pb-3 border-b border-bord w-full text-center'>
                                    <h1 className='text-ter text-lg' >Serviços e Históricos</h1>
                                </div>
                                <div className='overflow-y-auto max-h-96 h-full'>
                                    {agendamentos ? (
                                        agendamentos.map((agendamento) => (
                                            <div key={agendamento.id} className='p-5 flex flex-col gap-5'>
                                                <div className='flex gap-3 bg-bord bg-opacity-30 rounded-md p-5 justify-center items-start'>
                                                    <div className='flex flex-col gap-2 items-center max-w-24 justify-center'
                                                        onClick={() => {
                                                            setSelectedAgendamento(agendamento); // Armazena o provider selecionado
                                                            console.log("agendamento selecionado:", agendamento)
                                                            setOpenPerfil(true); // Abre o modal
                                                        }}
                                                    >
                                                        <Avatar 
                                                            src={agendamento.user.avatarUrl} 
                                                            alt="avatarPrestador"
                                                            size='lg'
                                                        />
                                                        <h3 className='text-prim font-semibold flex flex-wrap text-center'>{agendamento.user.name}</h3>
                                                        
                                                        <Dialog open={openPerfil} onClose={() => (setOpenPerfil(false))} className="relative z-10">
                                                            <DialogBackdrop
                                                                transition
                                                                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                                                            />
                                                            <div className="fixed inset-0 z-10 p-5  overflow-y-auto bg-prim bg-opacity-50">
                                                                <div className=" flex min-h-full items-center justify-center text-center sm:items-center ">
                                                                    <DialogPanel
                                                                        transition
                                                                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 w-full"
                                                                    >
                                                                        <div className="bg-white pb-4 pt-5 ">
                                                                            <div className="sm:flex sm:items-start flex-col">
                                                                                <div className="text-center sm:mt-0 sm:text-left border-b border-bord w-full pb-4">
                                                                                    <DialogTitle as="h3" className="font-semibold text-desSec text-2xl text-center">
                                                                                        Perfil Prestador
                                                                                    </DialogTitle>
                                                                                </div>
                                                                                {selectedAgendamento && ( 
                                                                                    <div className="pt-0 flex flex-col gap-5 w-full bg-pri">
                                                                                        <div className='flex flex-col gap-2 justify-start'>
                                                                                            <div className="flex items-center space-x-10 lg:pl-10 pl-5 p-20 pb-5 bg-desSec  ">
                                                                                                {/* Container do Avatar */}
                                                                                                <div className="absolute">
                                                                                                    <Avatar src={selectedAgendamento.user?.avatarUrl} size="lg"    
                                                                                                    className="w-24 h-24 text-large
                                                                                                    border-white
                                                                                                    border-5
                                                                                                    "
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='p-5'>
                                                                                            <div className='border rounded-lg border-bord w-full shadow-md  bg-white p-5'>
                                                                                                <h1 className='text-prim font-semibold text-xl'>{selectedAgendamento.user?.name}</h1>
                                                                                                <p className='text-prim text-[0.8rem]'>
                                                                                                    {calcularIdade(selectedAgendamento.user?.data)} anos
                                                                                                </p>
                                                                                                <p className='text-[0.8rem] text-prim pb-2'>{selectedAgendamento.user?.genero}</p>
                                                                                                <div className='overflow-y-auto h-[18vh]'>
                                                                                                    <p className='text-prim text-start pt-4'>{selectedAgendamento.user?.sobre}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className=" px-4 py-3 sm:flex sm:px-6 flex justify-end gap-3 border-t border-bord">
          
                                                                            <button
                                                                                type="button"
                                                                                data-autofocus
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
                                                                                gap-2"
                                                                                onClick={() => setOpenPerfil(false)}


                                                                                
                                                                            >
                                                                                Fechar
                                                                            </button>
                                                                        </div>
                                                                    </DialogPanel>
                                                                </div>
                                                            </div>
                                                        </Dialog>
                                                    
                                                    </div>
                                                    <div className='flex flex-col lg:flex-row gap-5 items-start'>
                                                        <div className='flex flex-col gap-2'>
                                                            <div className="overflow-y-auto max-h-32 bg-white p-3 rounded-md text-ter">
                                                                <p>
                                                                    {agendamento.Servico} - {agendamento.horaServico} - {new Date(agendamento.dataServico).toLocaleDateString('pt-BR', {
                                                                        day: '2-digit',
                                                                        month: 'long',
                                                                        year: 'numeric'
                                                                    })}
                                                                </p>
                                                                <p>Subtotal: {formatarMoeda(agendamento.valorServico)}</p>
                                                            </div>
                                                        </div>
                                                        <div className='flex lg:flex-col justify-between h-full gap-5 items-center'>
                                                            <div>
                                                                <p className={`${agendamento.status === 'Pendente' ? "text-des" : agendamento.status === "Andamento" ? "text-desSec" : agendamento.status === "Concluido" ? "text-sec" : ""}`}>{agendamento.status}</p>
                                                            </div>
                                                            <div>
                                                                <button 
                                                                className='bg-des p-2 rounded-md text-white'
                                                                onClick={() => {
                                                                    setSelectedAgendamento(agendamento)
                                                                    setPrestadorId(agendamento.user.id)
                                                                    setOpenDetalhes(true)
                                                                }}
                                                                
                                                                >
                                                                    Detalhes
                                                                
                                                                </button>
                                                            </div>
                                                            <Dialog open={openDetalhes} onClose={() => setOpenDetalhes(false)} className="relative z-10">
                                                                <DialogBackdrop
                                                                    transition
                                                                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                                                                />
                                                                <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-prim bg-opacity-50">
                                                                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                                                                    <DialogPanel
                                                                        transition
                                                                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                                                                    >
                                                                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                                                        <div>
                                                                            <div className="mt-3 text-center">
                                                                            <DialogTitle as="h3" className="font-semibold  text-desSec text-2xl">
                                                                                Detalhes do serviço
                                                                            </DialogTitle>
                                                                            <div className="mt-2">
                                                                                <div className="flex flex-col gap-7 text-prim  overflow-y-auto max-h-[60vh] ">
                                                                                    <p className='font-semibold border-t-2 pt-5 border-bord'>Agendamento feito dia {new Date(selectedAgendamento?.dataAgendamento).toLocaleDateString('pt-BR', {
                                                                                        day: '2-digit',
                                                                                        month: 'long',
                                                                                        year: 'numeric'
                                                                                    })}</p>
                                                                                    <div className='text-justify flex flex-col gap-2'>
                                                                                        <p><b>Endereço:</b> {selectedAgendamento?.enderecoCliente}</p>

                                                                                        <p><b>Prestador:</b> {selectedAgendamento?.user?.name}</p>

                                                                                        <p><b>Serviço:</b> {selectedAgendamento?.Servico}</p>

                                                                                        <p><b>Observação:</b> {selectedAgendamento?.observacao ? selectedAgendamento.observacao : "Nenhuma obervação."}</p>

                                                                                        <p><b>Endereço:</b> {formatarMoeda(selectedAgendamento?.valorServico)}</p>

                                                                                        <p><b>Data:</b> {new Date(selectedAgendamento?.dataServico).toLocaleDateString('pt-BR', {
                                                                                            day: '2-digit',
                                                                                            month: 'long',
                                                                                            year: 'numeric'
                                                                                        })}</p>

                                                                                    </div> 

                                                                                    {selectedAgendamento.status === "Concluido" && (
                                                                                        <div className='border-t-2 border-bord '>
                                                                                            <h2 className='font-semibold text-lg pt-5'>Avaliar Prestador</h2>
                                                                                            <label htmlFor="avaliacao">Conte-nos como foi o serviço desse prestador :D <br />
                                                                                            Não se preocupe, sua avaliação é totalmente anônima</label>
                                                                                            <div className='flex flex-col gap-3 pt-5'>
                                                                                                <div className='flex justify-center gap-10'>
                                                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                                                        <Star
                                                                                                        key={star}
                                                                                                        filled={star <= rating}
                                                                                                        onClick={() => handleRating(star)}
                                                                                                        />
                                                                                                    ))}
                                                                                                </div>
                                                                                                <div className='flex flex-col gap-2'>
                                                                                                    <textarea
                                                                                                        placeholder="Avalie com suas palavras como foi o serviço desse prestador"
                                                                                                        className="border rounded-md border-bord p-3 min-h-20 lg:min-h-40 focus:outline-ter text-prim w-full max-h-5"
                                                                                                        rows="3"
                                                                                                        id="avaliacao"
                                                                                                        value={review}
                                                                                                        onChange={handleReviewChange}
                                                                                                    ></textarea>

                                                                                                    <button 
                                                                                                    className="w-full bg-des text-white py-2 rounded-lg hover:bg-sec transition-all"
                                                                                                    onClick={handleCreateReview}
                                                                                                    >
                                                                                                        Enviar avaliação
                                                                                                    </button>
                                                                                                </div>
                                                                                            </div>
                                                                                            
                                                                                        </div>        
                                                                                    )}                                                                              
                                                                                </div>
                                                                            </div>
                                                                            </div>
                                                                        </div>
                                                                        </div>
                                                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                                        <button
                                                                            type="button"
                                                                            data-autofocus
                                                                            onClick={() => setOpenDetalhes(false)}
                                                                            className="p-2 rounded-md w-1/4 max-w-full text-center bg-des text-white transition-all duration-150 hover:bg-sec "
                                                                        >
                                                                            Fechar
                                                                        </button>
                                                                        </div>
                                                                    </DialogPanel>
                                                                    </div>
                                                                </div>
                                                            </Dialog>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className='text-prim text-center flex flex-col justify-center items-center h-full '>
                                            <p>Você não possui nenhum agendamento</p>
                                        </div>

                                    )}
                                </div>
                            </div>

                            <div className='lg:w-6/12 flex flex-col items-center shadow-md shadow-prim rounded-md'>
                                <div className='title p-5 pb-3 border-b border-bord w-full text-center'>
                                    <h1 className='text-ter text-lg'>Minhas Avaliações</h1>
                                </div>
                                <div className='overflow-y-auto max-h-96'>
                                    {avaliacoes ? (
                                        avaliacoes.map((avaliacao) => (
                                            
                                            <div key={avaliacao.id} className='avaliacoes p-5 overflow-y-auto max-h-96 flex flex-col gap-5 min-w-full'>
                                                <div className='avaliacao flex gap-3 bg-bord bg-opacity-30 rounded-md p-5'>
                                                    <div className='flex flex-col gap-2 items-center'
                                                    
                                                    >
                                                        <Avatar 
                                                        src={avaliacao.provider?.avatarUrl} 
                                                        alt="avatarCliente"
                                                        size='lg'
                                                        />
                                                        <h3 className='text-prim font-semibold'>{avaliacao.provider?.name}</h3>
                                                    </div>
                                                    <div className='flex flex-col w-full'>
                                                        <div className="overflow-y-auto max-h-32 bg-white p-3 rounded-md w-full min-h-20">
                                                            <p className='text-prim'>"{avaliacao?.comment}"</p>
                                                        </div>
                                                        <div className='flex justify-center gap-10'>
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <StarReview
                                                                key={star}
                                                                filled={star <= avaliacao?.stars}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))

                                    ) : (
                                        <div className='text-prim text-center flex flex-col justify-center items-center h-full '>
                                            <p>Você não fez nenhuma avaliação.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                        </section>
                    </>                    
                ) : (
                    <>
                        <section className=' flex-col flex justify-center items-center h-[90vh] gap-4'>
                            <div className='text-white'>
                                <Spinner size='lg' />
                            </div>
                            <p className='text-prim text-center text-md'>Aguarde enquanto carregamos suas informações</p>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};

export default AreaCliente;

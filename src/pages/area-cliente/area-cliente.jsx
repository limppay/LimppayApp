import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { HeaderApp, Logo,Footer} from '../../componentes/imports.jsx'
import User from "../../assets/img/diarista-cadastro/user.webp"
import LoadingSpinner from '../../componentes/FormCadastro/Loading.jsx';
import EditClienteModal from './EditClienteModal.jsx';
import { CreateEnderecosCliente, createReview, deleteEnderecosCliente, getAvaliacoes, getEnderecoDefaultCliente, getPrestadorMaisContratado, getSolicitacoesDoMes, getSolicitacoesTotal, getGastoMes } from '../../services/api.js';
import HeaderWebApp from '../../componentes/App/HeaderWebApp.jsx';
import { Avatar, ScrollShadow, Spinner,  } from '@nextui-org/react';
import { getAgendamentos } from '../../services/api.js';
'use client'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Button } from '@nextui-org/react';
import {Accordion, AccordionItem} from "@nextui-org/accordion";
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter, useDisclosure} from "@nextui-org/modal";

import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import InputMask from "react-input-mask"
import { Helmet } from 'react-helmet-async';
import { useUser } from '../../context/UserProvider';
import { useNavigate } from 'react-router-dom';
import CheckoutNotification from '../App/CheckoutNotification.jsx';
import Navigation from './Navigation.jsx';

import { io } from 'socket.io-client';
import { useWebSocket } from '../../context/WebSocketContext.jsx';

const AreaCliente = () => {

    // Determina a URL com base no NODE_ENV
    const baseURL =
    import.meta.env.VITE_ENV === 'development'
    ? 'http://localhost:3000/cliente/me'
    : 'https://limppay-api-production.up.railway.app/cliente/me';

    const [userInfo, setUserInfo] = useState(null);
    const { user, setUser  } = useUser();
    
    const[Open, SetOpen] = useState(false)

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
    const navigate = useNavigate()

    const [screenSelected, setScreenSelected] = useState("painel")
    const [isOpen, setIsOpen] = useState(true)
    const [deleting, setDeleting] = useState(false)
    const [openCreateAdress, setOpenCreateAdress] = useState(false)
    const [cepError, setCepError] = useState('')
    const [creating, setCreating] = useState(false)
    const inputRef = useRef(null)
    const [loadingEdit, setLoadingEdit] = useState(false)
    const [loadingReview, setLoadingReview] = useState(false)
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

    const { socket, setAppId, setUsername } = useWebSocket();

    const fetchUserInfo = async () => {
        try {
            const response = await axios.get(baseURL, {
                withCredentials: true
            });


            const enderecoDefault = await getEnderecoDefaultCliente(response.data.id)
            const agendamentos = await getAgendamentos(response.data.id)
            const avaliacoes = await getAvaliacoes(response.data.id)

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


            setAdressDefault([endereco])
            
            const combineData = {
                ...response.data,
                ...endereco,
            }
            
            setAppId(response.data.id)
            setUsername(response.data.name)
            console.log("Nome: ", response.data.name)
            setUserInfo(combineData);
            const status = localStorage.setItem("status", response.data.ativa)

            
        } catch (error) {
            console.error('Erro ao buscar informações do usuário:', error);
        }
    };

    useEffect(() => {
      if (!socket ) return;
  
      socket.on('data-updated', (data) => {
          console.log('Notificação recebida:', data);
          fetchUserInfo(); // Atualiza os dados ao receber o evento
      });
  
      return () => {
        socket.off('data-updated')
      };
    }, [userInfo]);


    const schema = yup.object().shape({
        clienteId: yup.string().default(userInfo?.id),
        localServico: yup.string().required("Informe o nome do endereço").trim(),
        cep: yup.string().required("Cep é obrigatório"),
        logradouro: yup.string(),
        numero: yup.string().required("Número é obrigatório").trim(),
        complemento: yup.string(),
        referencia: yup.string(),
        bairro: yup.string(),
        cidade: yup.string(),
        estado: yup.string(),   
    
    });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue
        } = useForm({
        resolver: yupResolver(schema)
    })

    // Criar endereço do cliente
    const onSubmit = async (data) => {
        setCreating(true)

        try {
            const response = await CreateEnderecosCliente(data);
            setCreating(false)
            setOpenCreateAdress(false)

            fetchUserInfo()

            reset()
            
        
        
        } catch (error) {
            console.error(error.message);
            setCreating(false)
        } 

    }

    const HandleDeleteEndereco = async (enderecoId) => {
        setDeleting(true)

        try {
            // Realiza a exclusão do endereço na API
            const DeleteEndereco = await deleteEnderecosCliente(enderecoId);
            
    
            
            setDeleting(false)

            fetchUserInfo()
    
        } catch (error) {
            console.error("Erro ao excluir o endereço: ", error);
            setDeleting(false)
    
        }
    };
    
      const estados = {
        "AC": "Acre",
        "AL": "Alagoas",
        "AP": "Amapá",
        "AM": "Amazonas",
        "BA": "Bahia",
        "CE": "Ceará",
        "DF": "Distrito Federal",
        "ES": "Espírito Santo",
        "GO": "Goiás",
        "MA": "Maranhão",
        "MT": "Mato Grosso",
        "MS": "Mato Grosso do Sul",
        "MG": "Minas Gerais",
        "PA": "Pará",
        "PB": "Paraíba",
        "PR": "Paraná",
        "PE": "Pernambuco",
        "PI": "Piauí",
        "RJ": "Rio de Janeiro",
        "RN": "Rio Grande do Norte",
        "RS": "Rio Grande do Sul",
        "RO": "Rondônia",
        "RR": "Roraima",
        "SC": "Santa Catarina",
        "SP": "São Paulo",
        "SE": "Sergipe",
        "TO": "Tocantins"
      };
      
    const handleCepChange = async (e) => {
        const cep = e.target.value.replace(/\D/g, ''); // Remove qualquer não numérico
        setCepError("")
        
        if (cep.length === 8) {
            try {

                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

                if (!response.data.erro) {
                    setValue("logradouro", response.data.logradouro);
                    setValue("bairro", response.data.bairro);
                    setValue("cidade", response.data.localidade);

                    // Converter a sigla do estado para o nome completo
                    const nomeEstado = estados[response.data.uf];
                    setValue("estado", nomeEstado);
            
                    setCepError("");
                } else {
                    setCepError("CEP não encontrado");
                }

            } catch (error) {
                console.error('Erro ao buscar o CEP:', error);
                alert('Erro ao buscar o CEP.');
            }
        }
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

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
    
    const handleCreateReview = async (id) => {
        setLoadingReview(true)
        const reviewData = {
            clientId: userInfo?.id,
            providerId: id,
            stars: rating,
            comment: review,
        };

        
        try {
            const response = await createReview(reviewData);
            setRating(0)
            setReview('')
            setLoadingReview(false)
        } catch (error) {
        } finally {
            const avaliacoes = await getAvaliacoes(userInfo?.id)
            setAvaliacoes(avaliacoes)
            setOpenDetalhes(false)

        }
    };


    const [errorLogin, setErrorLogin] = useState(false)
    
    useEffect(() => {
        const fetchUserInfo = async () => {
            setErrorLogin(false)
            try {
                const response = await axios.get(baseURL, {
                    withCredentials: true
                });


                const enderecoDefault = await getEnderecoDefaultCliente(response.data.id)
                const agendamentos = await getAgendamentos(response.data.id)
                const avaliacoes = await getAvaliacoes(response.data.id)

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


                setAdressDefault([endereco])
                
                const combineData = {
                    ...response.data,
                    ...endereco,
                }

                console.log("Setando app id: ", response.data.id)
                setAppId(response.data.id)
                setUsername(response.data.name)

                setUserInfo(combineData);
                const status = localStorage.setItem("status", response.data.ativa)
                setErrorLogin(false)
                
            } catch (error) {
                console.error('Erro ao buscar informações do usuário:', error);
                setErrorLogin(true)

            }
        };
        
        fetchUserInfo()

    }, []);

    const status = localStorage.getItem("status")

    


    useEffect(() => {
    }, [userInfo]); // Isso vai logar as informações do usuário toda vez que mudarem

    
    const handleUserUpdated = (updatedInfo) => {
        // const enderecoDefault = updatedInfo.updatedCliente.EnderecoDefault[0];
    
        // const updatedUserInfo = {
        //     ...userInfo,
        //     ...updatedInfo.updatedCliente,
        //     iD_Endereco: enderecoDefault.id,
        //     clienteId: enderecoDefault.clienteId,
        //     cep: enderecoDefault.cep,
        //     cidade: enderecoDefault.cidade,
        //     complemento: enderecoDefault.complemento,
        //     estado: enderecoDefault.estado,
        //     logradouro: enderecoDefault.logradouro,
        //     numero: enderecoDefault.numero,
        //     referencia: enderecoDefault.referencia,
        //     bairro: enderecoDefault.bairro,
        // };
    
        // // Remover a propriedade EnderecoDefault do objeto principal
        // delete updatedUserInfo.EnderecoDefault;
    
        window.location.reload()

    };
    
    // Anexos
    // const avatarUrl = urls ? Object.values(urls)[0] : null;

    const buttons = [
        { link: "/contrate-online", text: "Contrate Online"},
        { link: "/", text: "Quem Somos"},
        { link: "/", text: "Dúvidas"},
    ]

    const btnAcess = [

    ]

    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        }).format(valor);
    }
    
const [searchTerm, setSearchTerm] = useState("");
const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);

  
// Função para filtrar os agendamentos com base no nome e na data
const agendamentosFiltrados = agendamentos.length > 0 && agendamentos.filter((agendamento) => {
    const nameMatch = agendamento.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtra pela data, caso as datas de início e fim estejam definidas
    const dateMatch = (startDate && new Date(agendamento.dataServico) >= new Date(startDate)) && (endDate && new Date(agendamento.dataServico) <= new Date(endDate));

    // Retorna true se ambos os filtros (nome e data) coincidirem
    return nameMatch && (!startDate || !endDate || dateMatch);
});
  
const nivelProgress = 75; // Defina a lógica para calcular o progresso
const experienciaPercent = 60; // Defina a lógica para calcular o percentual de experiência
const [PrestadorMaisContratado, setPrestadorMaisContratado] = useState()
useEffect(() => {
    const handlePrestadorMaisContratado = async() => {
        try {
            const response = await getPrestadorMaisContratado(userInfo?.id)
            setPrestadorMaisContratado(response)
        } catch (error) {
        }
    }
    handlePrestadorMaisContratado()
  }, [userInfo?.id, userInfo]);

 const [SolicitacoesDoMes, setSolicitacoesDoMes] = useState(0);
  useEffect(()=>{
    const handleSolicitacoesDoMes = async()=>{
        try{
            const solMes = await getSolicitacoesDoMes(userInfo?.id)
            setSolicitacoesDoMes(solMes)
        }catch(error){
        }
    }
    handleSolicitacoesDoMes()
  }, [userInfo?.id, userInfo]);

  const [SolicitacoesTotal, setSolicitacoesTotal] = useState(0);
  useEffect(() =>{
    const handleSolicitacoesTotal = async()=>{
        try{
            const solTotal = await getSolicitacoesTotal(userInfo?.id)
            setSolicitacoesTotal(solTotal)
        }catch(error){
        }
    }
    handleSolicitacoesTotal()
  }, [userInfo?.id, userInfo]);
    
  const [GastoMes, setGastoMes] = useState(0);
  useEffect(()=>{
    const handleGastoMes = async()=>{
        try{
            const fatMes = await getGastoMes(userInfo?.id)
            setGastoMes(fatMes)
        }catch(error){
        }
    }
    handleGastoMes()
  }, [userInfo?.id, userInfo]);


  const calcularValorLiquido = (valorLiquido, desconto, valorServico) => {
    const ValorBruto =  valorLiquido + desconto
    const qtdAgendamentos = ValorBruto / valorServico
    const descontoPorServico = desconto / qtdAgendamentos

    const descontoTotalServico = valorServico - descontoPorServico

    return formatarMoeda(descontoTotalServico)

  }

  const calcularValorDesconto = (valorLiquido, desconto, valorServico) => {
    const ValorBruto =  valorLiquido + desconto
    const qtdAgendamentos = ValorBruto / valorServico
    const descontoPorServico = desconto / qtdAgendamentos

    return formatarMoeda(descontoPorServico)

  }

  const calcularQtdAgendamentos = (valorLiquido, desconto, valorServico) => {
    const ValorBruto =  valorLiquido + desconto
    const qtdAgendamentos = ValorBruto / valorServico
  
    return qtdAgendamentos

  }

  const calcularValorBruto = (valorLiquido, desconto, valorServico) => {
    const ValorBruto =  valorLiquido + desconto
  
    return formatarMoeda(ValorBruto)

  }

  const MapsLocate = (logradouro, numero, bairro, cidade, estado, cep) => {
    const local = `${logradouro}, ${numero} - ${bairro}, ${cidade} - ${estado}, ${cep} `

    return local
  }

  
    useEffect(() => {
        const HandleVerify = async () => {

            if(errorLogin) {
              navigate("/contrate-online")
            }
            
        }

        HandleVerify()
    
    }, [errorLogin, setErrorLogin])
    
    const EstadoCivil = [
        { text: "Solteiro(a)", value: 1 },
        { text: "Casado(a)", value: 2 },
        { text: "Divorciado(a)", value: 3 },
        { text: "Viúvo(a)", value: 4 },
        { text: "Separado(a)", value: 5 },
    ];

    const estadoCivilTexto = EstadoCivil.find(item => item.value === userInfo?.estadoCivil)?.text || '';

    const calcularMediaStars = (reviews) => {
        if (!reviews || reviews.length === 0) return 0; // Retorna 0 caso não tenha avaliações
        const totalStars = reviews.reduce((acc, avaliacao) => acc + avaliacao.stars, 0);
        const averageStars = totalStars / reviews.length;
        return averageStars;
    };

    return (
        <div>
            <Helmet>
                <title>Limppay: Area Cliente</title>
            </Helmet>
            <HeaderWebApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess}/>
            <main className='h-screen w-screen'>

                {userInfo ? (
                    <>
                        <div className='flex flex-col lg:flex-row h-screen'>
                            {/* menu lateral */}
                            <div className={`hidden lg:flex flex-col pt-[7vh] min-h-[15vh]  lg:pt-[10vh] xl:pt-[12vh] lg:h-screen bg-neutral-800 shadow-lg transition-all transform overflow-x-auto max-w-[100vh]  ${
                            isOpen ? " lg:min-w-[30vh] lg:max-w-[30vh] xl:min-w-[35vh] xl:max-w-[35vh] 2xl:min-w-[26vh] 2xl:max-w-[26vh]" : "w-full lg:min-w-[10vh] lg:max-w-[13vh] xl:min-w-[15vh] xl:max-w-[15vh] 2xl:min-w-[12vh] 2xl:max-w-[12vh] "
                            }`}>
                                

                                <div className=" hidden  shadow-md lg:flex items-center justify-between pt-2 pb-2 p-4 ">
                                    <Avatar
                                    src={userInfo?.AvatarUrl.avatarUrl || User}
                                    className={`${isOpen ? "" : ""} cursor-pointer`}
                                    onClick={() => setScreenSelected("perfil")}
                                    />


                                    <Button className="bg- text-des justify-end" onPress={()=> toggleSidebar()} >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                                    </svg>
                                    </Button>
                                </div>
                                
                                <div className='flex flex-row lg:grid gap-5 pt-5 p-2 '>
                                    <div>
                                        <Button
                                        className='w-full border border-des bg-trans text-des justify-start'
                                        onPress={() => setScreenSelected("painel")}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                            </svg>


                                            {isOpen ? "Painel" : ""}
                                            
                                        </Button>
                                    </div> 
                                    <div>
                                        <Button
                                        className='w-full border shadow-md bg-trans text-des justify-start'
                                        onPress={() => setScreenSelected("pedidos")}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                                            </svg>

                                            {isOpen ? "Meus pedidos" : ""}
                                            
                                        </Button>
                                    </div>
                                    <div>
                                        <Button
                                        className='w-full border shadow-md bg-trans text-des justify-start'
                                        onPress={() => setScreenSelected("avaliacoes")}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                            </svg>


                                            {isOpen ? "Minhas Avaliações" : ""}
                                            
                                        </Button>
                                    </div>
                                    <div>
                                        <Button
                                        className='w-full border shadow-md bg-trans text-des justify-start '
                                        onPress={() => setScreenSelected("perfil")}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                            </svg>
                                            
                                            {isOpen ? "Perfil" : ""}
                                            
                                        </Button>
                                    </div>
                                    <div>
                                        <Button
                                        className='w-full border shadow-md bg-trans text-des justify-start'
                                        onPress={() => setScreenSelected("enderecos")}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591  0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                            </svg>



                                            {isOpen ? "Meus Endereços" : ""}
                                            
                                        </Button>
                                    </div>                                    

                                </div>
                                    
                            </div>

                            {screenSelected === "painel" && (
                                <div className="md:pt-28 flex-1 p-6 pb-[8vh] pt-[10vh] overflow-y-auto  ">
                                    {/* Grid do dashboard */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Prestador mais contratado */}
                                        <div className="bg-white  shadow-md rounded-lg p-6">
                                            <h2 className="text-desSec text-lg font-semibold text-gray-600 mb-4">Prestador Mais Contratado</h2>
                                            <div className="flex items-center">
                                                <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden mr-4">
                                                <Avatar
                                                    src={PrestadorMaisContratado?.avatarUrl?.avatarUrl || User}
                                                    alt={PrestadorMaisContratado?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                </div>
                                                <span className="text-desSec  font-medium">
                                                {PrestadorMaisContratado?.name || <span className='text-white'> <Spinner/> </span>}
                                                </span>
                                            </div>
                                        </div>


                                        {/* Solicitações do mês */}
                                        <div className="bg-white  shadow-md rounded-lg p-6">
                                            <h2 className="text-desSec text-lg font-semibold text-gray-600 mb-4">
                                                Solicitações do Mês
                                            </h2>
                                            <p className="text-desSec text-3xl font-bold text-gray-800">
                                                {SolicitacoesDoMes || 0}
                                            </p>
                                        </div>

                                        {/* Total de agendamentos */}
                                        <div className="bg-white  shadow-md rounded-lg p-6">
                                            <h2 className="text-desSec text-lg font-semibold text-gray-600 mb-4">Total de Agendamentos</h2>
                                            <p className="text-desSec text-3xl font-bold text-gray-800">{SolicitacoesTotal || 0}</p>
                                        </div> 
                                    </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                                {/* Total de gastos no mês */}
                                <div className="bg-white shadow-md rounded-lg p-6">
                                    <h2 className="text-desSec text-lg font-semibold text-gray-600 mb-4">Gasto no mês</h2>
                                    <p className="text-desSec text-3xl font-bold text-gray-800">
                                        {formatarMoeda(GastoMes.toFixed(2) || "0.00")}
                                    </p>
                                </div>

                                        {/* Próximo Agendamento */}
                                        <div className="bg-white shadow-md rounded-lg p-4">
                                            <h2 className="text-desSec text-lg font-semibold text-gray-600 mb-2">Próximo Agendamento</h2>
                                            <div className="flex flex-col gap-6">
                                                {agendamentosFiltrados && agendamentosFiltrados.length > 0 ? (
                                                    (() => {
                                                        const hoje = new Date();

                                                        // Filtrar apenas agendamentos futuros com status "Agendado"
                                                        const agendamentosFuturos = agendamentosFiltrados.filter(
                                                            agendamento =>
                                                                new Date(agendamento.dataServico) >= hoje &&
                                                                agendamento.status === "Agendado"
                                                        );

                                                        if (agendamentosFuturos.length === 0) {
                                                            return <p className="text-prim flex-1">Nenhum agendamento futuro encontrado com status "Agendado".</p>;
                                                        }

                                                        // Ordenar por data e hora
                                                        const agendamentosOrdenados = agendamentosFuturos.sort((a, b) => {
                                                            const dataA = new Date(a.dataServico).setHours(...a.horaServico.split(':').map(Number));
                                                            const dataB = new Date(b.dataServico).setHours(...b.horaServico.split(':').map(Number));
                                                            return dataA - dataB;
                                                        });

                                                        // Selecionar o primeiro agendamento e todos com a mesma data e horário
                                                        const primeiroAgendamento = agendamentosOrdenados[0];
                                                        const agendamentosComMesmoHorario = agendamentosOrdenados.filter(agendamento => {
                                                            const dataHoraA = new Date(agendamento.dataServico).setHours(...agendamento.horaServico.split(':').map(Number));
                                                            const dataHoraB = new Date(primeiroAgendamento.dataServico).setHours(...primeiroAgendamento.horaServico.split(':').map(Number));
                                                            return dataHoraA === dataHoraB;
                                                        });

                                                        return (
                                                            <div className="flex flex-col gap-6 flex-1">
                                                                {agendamentosComMesmoHorario.map((agendamento, index) => (
                                                                    <div key={index} className="flex flex-col gap-3 shadow-lg rounded-lg p-5">
                                                                        <p><b>Serviço:</b> {agendamento.Servico}</p>
                                                                        <p>
                                                                            <b>Data:</b> {new Date(agendamento.dataServico).toLocaleDateString('pt-BR', {
                                                                                day: '2-digit',
                                                                                month: 'long',
                                                                                year: 'numeric'
                                                                            })}
                                                                        </p>
                                                                        <p><b>Hora:</b> {agendamento.horaServico}</p>
                                                                        <p><b>Preço:</b> {formatarMoeda(agendamento.valorServico)}</p>
                                                                        <p><b>Status:</b> {agendamento.status}</p>
                                                                        <p><b>Endereço:</b> {agendamento.enderecoCliente}</p>
                                                                        <a
                                                                            href={`https://www.google.com/maps/place/${encodeURIComponent(agendamento.enderecoCliente)}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                        >
                                                                            <Button className="w-full bg-sec text-white mt-4">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-2 inline-block">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                                                                                </svg>
                                                                                Abrir com o Google Maps
                                                                            </Button>
                                                                        </a>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        );
                                                    })()
                                                ) : (
                                                    <p className="text-prim flex-1">Nenhum agendamento encontrado.</p>
                                                )}
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            )}

                            {screenSelected == "perfil" && (
                                <section className='w-full gap-1 pb-[8vh] pt-[8vh]  sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim'>
                                    <div className='lg:flex flex-col max-w-50 min-w-72 min-h-60 p-10 pt-5 w-full 
                                    '>
                                        <div className='flex flex-col lg:flex-row lg:justify-between w-full'>
                                            <div className='text-center flex flex-col gap-2'>
                                                <div className="flex flex-col justify-center items-center gap-2">
                                                    <div className='flex items-center'>
                                                        <div>
                                                            <p className='text-prim cursor-pointer' onClick={()=> SetOpen(true)}>Editar Perfil</p>
                                                        </div>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-6 text-prim">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                        </svg>
                                                    </div>
                                                    <img src={userInfo?.AvatarUrl?.avatarUrl ? userInfo?.AvatarUrl?.avatarUrl : User}
                                                    id='avatar' 
                                                    alt="foto de perfil" 
                                                    className="transition-all duration-200 rounded-full w-60 h-60  hover:bg-ter p-0.5 hover:bg-opacity-40 shadow-md cursor-pointer" 
                                                    onClick={()=> SetOpen(true)}
                                                    
                                                    />                                             
                                                </div>
                                                
                                                <div className='flex flex-col gap-3 h-full max-w-full max-h-full pl-5 pr-5'>
                                                    <h1 className='text-xl text-ter'>{userInfo.name}</h1>

                                                </div>

                                            </div>
                                        </div>

                                        <h2 className="text-xl pt-10 text-prim font-semibold">Informações Pessoais</h2>
                                        <div className="grid  sm:grid-cols-3 gap-5 pt-2">
                                            
                                            <div className="grid gap-2">
                                                <label htmlFor="email" className="text-neutral-500">E-mail</label>
                                                <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.email} />
                                            </div>
                                            <div className="grid gap-2">
                                                <label htmlFor="telefone" className="text-neutral-500">Telefone 1</label>
                                                <InputMask
                                                    ref={inputRef}
                                                    mask="(99) 99999-9999" 
                                                    maskChar={null}
                                                    className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled
                                                    id="telefone_1" 
                                                    type="text" 
                                                    placeholder="(00) 00000-0000" 
                                                    value={userInfo?.telefone_1}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <label htmlFor="telefone" className="text-neutral-500">Telefone 2</label>
                                                <InputMask
                                                    ref={inputRef}
                                                    mask="(99) 99999-9999" 
                                                    maskChar={null}
                                                    className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled
                                                    id="telefone_2" 
                                                    type="text" 
                                                    placeholder="(00) 00000-0000" 
                                                    value={userInfo?.telefone_2}
                                                />
                                            </div>

                                        </div>

                                        <div className="grid  sm:grid-cols-2 gap-5 pt-5">

                                            <div className="grid gap-2">
                                                <label htmlFor="rg" className="text-neutral-500">Estado Civil</label>
                                                <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={estadoCivilTexto} />
                                            </div>

                                            <div className="grid gap-2">
                                            <label htmlFor="genero" className="text-neutral-500">Gênero</label>
                                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.genero} />
                                            </div>

                                        </div>

                                        
                                        <h2 className="text-xl pt-10 text-prim font-semibold">Endereço</h2>
                                        <div className="grid sm:grid-cols-3 gap-5 pt-2">

                                            <div className="grid gap-2">
                                                <label htmlFor="cep" className="text-prim">CEP</label>

                                                <InputMask 
                                                ref={inputRef}
                                                mask="99999-999"
                                                maskChar={null}
                                                className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled
                                                id="cep" 
                                                type="text" 
                                                placeholder="CEP" 
                                                value={userInfo.cep}
                                                
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <label htmlFor="logradouro" className="text-prim">Logradouro</label>
                                                <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.logradouro} />
                                            </div>

                                            <div className="grid gap-2">
                                                <label htmlFor="numero" className="text-prim">Número</label>
                                                <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.numero} />
                                            </div>

                                            <div className="grid gap-2">
                                                <label htmlFor="complemento" className="text-prim">Complemento</label>
                                                <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.complemento} />
                                            </div>

                                            <div className="grid gap-2">
                                                <label htmlFor="referencia" className="text-prim">Ponto de referência</label>
                                                <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.referencia} />
                                            </div>

                                            <div className="grid gap-2">
                                                <label htmlFor="bairro" className="text-prim">Bairro</label>
                                                <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.bairro} />
                                            </div>

                                            <div className="grid gap-2">
                                                <label htmlFor="cidade" className="text-prim">Cidade</label>
                                                <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.cidade} />
                                            </div>

                                            <div className="grid gap-2">
                                                <label htmlFor="estado" className="text-prim">Estado</label>
                                                <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.estado} />
                                            </div>
                                            
                                        </div>
                                        
                                    </div>
                                    {/* Modal de edição */}
                                    <EditClienteModal 
                                        Open={Open}
                                        SetOpen={() => SetOpen(false)} 
                                        userInfo={userInfo} 
                                        // token={token} 
                                        onUserUpdated={handleUserUpdated}
                                        Urls={userInfo?.AvatarUrl?.avatarUrl} 
                                    /> 
                                
                                </section>
                                
                            )}

                            {screenSelected == "pedidos" && (
                                <section className='w-full gap-1 pb-[8vh] pt-[8vh] sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim'>
                                    <div className='p-5 flex flex-col gap-5'>
                                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-5">
                                            <input
                                                type="text"
                                                placeholder="Pesquisar"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="border p-2 rounded-lg w-full border-bord focus:outline-bord"
                                            />

                                            <div className='flex justify-between w-full gap-5 items-center'>
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="border p-2 rounded-lg w-full border-bord focus:outline-bord"
                                                    placeholder="Início"
                                                />
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    className="border p-2 rounded-lg w-full border-bord focus:outline-bord"
                                                    placeholder="Fim"
                                                />

                                            </div>
                                        </div>

                                        {agendamentos.length > 0 ? (
                                            agendamentosFiltrados.sort((a, b) => {
                                                const prioridade = (status) => {
                                                    if (status === "Iniciado") return 1;
                                                    if (status === "Agendado") return 2;
                                                    return 3;
                                                };
                                                return prioridade(a.status) - prioridade(b.status);
                                            })   
                                            .map((agendamento) => (
                                                <>
                                                    <div className='flex flex-col gap-3  shadow-lg shadow-bord rounded-lg p-5 justify-center items-start'>
                                                        <div className='flex flex-col  gap-5 items-start w-full justify-between p-2'>
                                                            <div className='w-full flex gap-2 items-center '
                                                                onClick={() => {
                                                                    setSelectedAgendamento(agendamento); // Armazena o provider selecionado
                                                                    setOpenPerfil(true); // Abre o modal
                                                                }}
                                                            >
                                                                    <Avatar 
                                                                        src={agendamento.user.avatarUrl} 
                                                                        alt="avatarPrestador"
                                                                        size='lg'
                                                                    />
                                                                    <h3 className='text-prim font-semibold flex flex-wrap text-center'>{agendamento.user.name}</h3>
                                                                                                                                
                                                            </div>

                                                            <div className='flex flex-col gap-2 w-full  '>
                                                                <div className="overflow-y-auto  bg-white  rounded-md text-ter w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-5 ">
                                                                    
                                                                    <div className='text-prim w-full flex flex-col gap-5'>
                                                                        <p className='text-justify'>
                                                                            {agendamento.Servico} - {agendamento.horaServico} - {new Date(agendamento?.dataServico).toLocaleDateString('pt-BR', {
                                                                                day: '2-digit',
                                                                                month: 'long',
                                                                                year: 'numeric'
                                                                            })}

                                                                        </p>

                                                                        <div className='flex flex-col w-full gap-5 '>
                                                                            {calcularQtdAgendamentos(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico) > 1 && (
                                                                                <div>
                                                                                    {calcularQtdAgendamentos(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico) > 1 && (
                                                                                        <div className='w-full flex justify-between'>
                                                                                            <span>
                                                                                                Combo:
                                                                                            </span> 
                                                                                            {

                                                                                            calcularValorBruto(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico)}
                                                                                        </div>



                                                                                    )}

                                                                                    {calcularQtdAgendamentos(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico) > 1 && (
                                                                                        <div className='w-full flex justify-between'>
                                                                                            <span>
                                                                                                Desconto Total:
                                                                                            </span> 
                                                                                            {calcularQtdAgendamentos(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico) ? formatarMoeda(agendamento?.descontoTotal) : "Não"}
                                                                                        </div>
                                                                                    )}

                                                                                    {calcularQtdAgendamentos(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico) > 1 && (
                                                                                        <div className='w-full flex justify-between'>
                                                                                            <span>
                                                                                                Valor pago:
                                                                                            </span> 
                                                                                            {formatarMoeda(agendamento?.valorLiquido)}
                                                                                        </div>
                                                                                    )}

                                                                                    

                                                                                </div>

                                                                            )}

                                                                            <div >
                                                                                {
                                                                                calcularQtdAgendamentos(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico) <= 1 &&
                                                                                    <div className='w-full flex justify-between'>
                                                                                        <span>
                                                                                            Cupom Desconto:
                                                                                        </span> 
                                                                                        {calcularValorDesconto(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico)}
                                                                                    </div>
                                                                                
                                                                                }

                                                                                <div className='w-full flex justify-between'>
                                                                                    <span>
                                                                                        Valor Serviço: 
                                                                                    </span>
                                                                                    {formatarMoeda(agendamento.valorServico)}
                                                                                </div>
                                                                                <div className='w-full flex justify-between'>
                                                                                    <span>
                                                                                        {calcularQtdAgendamentos(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico) > 1  ? "Total" : "Valor Pago"}
                                                                                    </span> 
                                                                                    {calcularValorLiquido(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico)}
                                                                                </div>

                                                                            </div>

                                                                            


                                                                        </div>


                                                                        <div className='w-4/12 sm:w-auto text-center pt- sm:pt-0 flex items-center justify-start gap-5'>
                                                                            <div className={`p-2 rounded-md text-white ${agendamento.status === 'Agendado' ? " bg-des" : agendamento.status === "Iniciado" ? "bg-desSec" : agendamento.status === "Cancelado" ? "bg-error" : agendamento.status === "Realizado" ? "text-sec bg-sec " : ""} `}>{agendamento.status}</div>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>

                                                            
                                                        </div>



                                                        <Accordion isCompact itemClasses={{title: "text-prim"}}>
                                                            <AccordionItem key={agendamento.id} title="Detalhes" >
                                                                
                                                                <div className="mt-2">
                                                                    
                                                                    {agendamento.status === "Realizado" && (
                                                                        <div className=' text-justify pt-2 pb-4 '>
                                                                            <h2 className='font-semibold text-lg '>Avaliar Prestador</h2>
                                                                            <label htmlFor="avaliacao">Conte-nos como foi o serviço desse prestador :D <br />
                                                                            Não se preocupe, sua avaliação é totalmente anônima</label>
                                                                            <div className='flex flex-col gap-3 pt-2'>
                                                                                <div className='flex  gap-10'>
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
                                                                                        className="border rounded-md border-bord p-3 min-h-[20vh] lg:min-h-40 focus:outline-ter text-prim w-full max-h-[20vh]"
                                                                                        rows="3"
                                                                                        id="avaliacao"
                                                                                        value={review}
                                                                                        onChange={handleReviewChange}
                                                                                    ></textarea>

                                                                                    <Button 
                                                                                        className="w-full bg-des text-white py-2 rounded-lg hover:bg-sec transition-all"
                                                                                        onPress={() => (
                                                                                            handleCreateReview(agendamento.user.id)

                                                                                        )}
                                                                                        isDisabled={loadingReview}
                                                                                    >
                                                                                        {loadingReview? <Spinner/> : "Enviar Avaliação"}
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                            
                                                                        </div>        
                                                                    )}

                                                                    <div className="flex flex-col gap-7 text-prim  overflow-y-auto max-h-[60vh] ">
                                                                        <p className='font-semibold border-t-2 pt-5 border-bord'>Agendamento feito dia {new Date(agendamento?.dataAgendamento).toLocaleDateString('pt-BR', {
                                                                            day: '2-digit',
                                                                            month: 'long',
                                                                            year: 'numeric'
                                                                        })}</p>
                                                                        <div className='text-justify flex flex-col gap-4'>

                                                                            <p><b>Prestador:</b> {agendamento?.user?.name}</p>

                                                                            <p><b>Serviço:</b> {agendamento?.Servico}</p>

                                                                            <p><b>Observação:</b> {agendamento?.observacao ? agendamento.observacao : "Nenhuma obervação."}</p>


                                                                            <p><b>Data:</b> {new Date(agendamento?.dataServico).toLocaleDateString('pt-BR', {
                                                                                day: '2-digit',
                                                                                month: 'long',
                                                                                year: 'numeric'
                                                                            })}</p>
                                                                            <div className='flex flex-col gap-2 max-w-[100vh]'>
                                                                                <p><b>Endereço:</b> {agendamento?.enderecoCliente}</p>
                                                                                <a 
                                                                                    href={`https://www.google.com/maps/place/${encodeURIComponent(MapsLocate(agendamento?.logradouro, agendamento?.numero, agendamento?.bairro, agendamento?.cidade, agendamento?.estado, agendamento?.cep))}`} 
                                                                                    target="_blank" 
                                                                                    rel="noopener noreferrer"
                                                                                >
                                                                                    <Button className='w-full bg-sec text-white'>
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                                                                                        </svg>

                                                                                        Abrir com o Google Maps

                                                                                    </Button>
                                                                                </a>

                                                                            </div>

                                                                        </div> 
                                                                    </div>


                                                                </div>


                                                            </AccordionItem>
                                                        </Accordion>

                                                    </div>
                                                
                                                </>
                                            ))
                                        
                                            
                                        ) : (
                                            <div className='text-prim text-center flex flex-col justify-center items-center h-[70vh] '>
                                                <p>Você não possui nenhum agendamento</p>
                                                <div className='pt-5'>
                                                    <a href="/contrate-online">
                                                        <Button className='bg-des text-white'>
                                                            Fazer agendamento
                                                        </Button>
                                                    </a>
                                                </div>
                                            </div>

                                        )}

                                        <Modal 
                                            backdrop="opaque" 
                                            isOpen={openPerfil} 
                                            onOpenChange={setOpenPerfil}
                                            placement='center'
                                            classNames={{
                                                backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 "
                                            }}
                                            className='max-w-[40vh] sm:max-w-[80vh]'
                                        >
                                            <ModalContent>
                                                {(onClose) => (
                                                <>
                                                    <ModalHeader className="flex flex-col gap-1 p-0 text-desSec"></ModalHeader>
                                                    <ModalBody className='p-0'>

                                                    <div className="bg-white pb-4 pt-0 p-0 ">
                                                        <div className="sm:flex sm:items-start flex-col">
                                                            
                                                            {selectedAgendamento?.user && ( // Renderiza as informações do provider selecionado
                                                                <div className="pt-0 p-0 flex flex-col w-full bg-pri max-h-[60vh] sm:max-h-[65vh]">
                                                                    <div className='flex flex-col gap-2 justify-start'>
                                                                        <div className="flex items-center space-x-96 lg:pl-10 pl-5 p-20  pb-5 bg-desSec  ">
                                                                            {/* Container do Avatar */}
                                                                            <div className="absolute">
                                                                                <Avatar src={selectedAgendamento?.user?.avatarUrl} size="lg"    
                                                                                className="w-24 h-24 text-large
                                                                                border-white
                                                                                border-5
                                                                                "
                                                                                />
                                                                            </div>
                                                                            
                                                                        </div>
                                                                    </div>

                                                                    <div className='flex justify-end items-center gap-2 pr-5 pt-2'>
                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                            <StarReview
                                                                                key={star}
                                                                                filled={star <= calcularMediaStars(selectedAgendamento?.user.Review)}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    
                                                                    <div className='overflow-y-auto max-h-[80vh] '>
                                                                        <div className='p-5 pb-1'>
                                                                            <div className='border rounded-lg border-bord w-full shadow-md  bg-white p-5 '>
                                                                                <h1 className='text-prim font-semibold text-xl'>{selectedAgendamento?.user?.name}</h1>
                                                                                <p className='text-prim text-[0.8rem]'>
                                                                                    {calcularIdade(selectedAgendamento?.user?.data)} anos
                                                                                </p>
                                                                                <p className='text-[0.8rem] text-prim pb-2'>{selectedAgendamento?.user?.genero}</p>
                                                                                <div className='overflow-y-auto lg:h-[20vh]'>
                                                                                    <p className='text-prim text-start pt-4 text-sm'>{selectedAgendamento?.user?.sobre}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className='p-5'>
                                                                            <div className='border rounded-lg border-bord w-full shadow-md  bg-white p-5 '>
                                                                                <Accordion   >
                                                                                    <AccordionItem  key="1" aria-label="Accordion 1" title={`Avaliações ( ${selectedAgendamento?.user?.Review.length} )`} classNames={{title: 'text-prim text-md '}} >
                                                                                        <div className='flex flex-col gap-5'>
                                                                                            {selectedAgendamento?.user && (
                                                                                                selectedAgendamento?.user?.Review.length == 0 ? (
                                                                                                    <div className=' p-5 text-prim flex flex-col justify-center text-center'>
                                                                                                        <h3 className='font-semibold'>Sem avaliações</h3>
                                                                                                    </div>
                                                                                                    
                                                                                                ) : (
                                                                                                    selectedAgendamento?.user?.Review.map((avaliacao) => (
                                                                                                        <div key={avaliacao.id} className=' p-5 border border-bord rounded-md text-prim flex flex-col gap-2'>
                                                                                                            <h3 className='font-semibold'>{new Date(avaliacao.createdAt).toLocaleDateString('pt-BR', {
                                                                                                                day: '2-digit',
                                                                                                                month: 'long',
                                                                                                                year: 'numeric'
                                                                                                            })}</h3>
                                                                                                            <p className='text-prim'>{avaliacao?.comment === "" ? <span className='text-prim text-opacity-40'>Nenhum comentário</span>: avaliacao.comment}</p>
                                                                                                            <div className='flex justify-start items-center gap-2 pr-5 pt-2'>
                                                                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                                                                    <StarReview
                                                                                                                        key={star}
                                                                                                                        filled={star <= avaliacao.stars}
                                                                                                                    />
                                                                                                                ))}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    ))
                                                                                                )
                                                                                            )}
                                                                                        </div>
                                                                                    </AccordionItem>
                                                                                </Accordion>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                        </div>
                                                    </div>
                                                                                                    

                                        
                                                    </ModalBody>
                                                    <ModalFooter>
                                                    <Button className='bg-desSec text-white' onPress={onClose}  >
                                                        Fechar
                                                    </Button>
                                                    </ModalFooter>
                                                </>
                                                )}
                                            </ModalContent>
                                        </Modal>

                                    </div>
                                </section>
                            )}

                            {screenSelected == "avaliacoes" && (
                                <section className='w-full gap-1 pb-[8vh] pt-[8vh] sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim'>
                                    <div className='p-5 flex flex-col gap-5'>

                                        {avaliacoes ? (
                                            avaliacoes.map((avaliacao) => (
                                                
                                                <div key={avaliacao.id} className='avaliacoes p-5 overflow-y-auto max-h-96 flex flex-col gap-5 min-w-full shadow-xl rounded-md'>

                                                    <div className='avaliacao flex flex-col gap-3  rounded-md '>
                                                        <div className='flex gap-2 items-center'
                                                        
                                                        >
                                                            <Avatar 
                                                            src={avaliacao.provider?.avatarUrl} 
                                                            alt="avatarCliente"
                                                            size='lg'
                                                            />
                                                            <h3 className='text-prim font-semibold'>{avaliacao.provider?.name}</h3>
                                                        </div>

                                                        <div className='flex flex-col w-full'>
                                                            <div className="overflow-y-auto max-h-52 bg-white pt-2 rounded-md w-full min-h-20">
                                                                <p className='text-prim'>{avaliacao?.comment === "" ? <span className='text-prim text-opacity-40'>Nenhum comentário</span>: avaliacao.comment}</p>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className='flex flex-col sm:flex-row items-center justify-between gap-2'>
                                                        <div className='flex justify-start gap-10'>
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <StarReview
                                                                key={star}
                                                                filled={star <= avaliacao?.stars}
                                                                />
                                                            ))}
                                                        </div>
                                                        <div className='w-full flex justify-end'>
                                                            <span>
                                                                {avaliacao?.createdAt &&
                                                                new Intl.DateTimeFormat('pt-BR', {
                                                                    day: '2-digit',
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                }).format(new Date(avaliacao.createdAt))}
                                                            </span>
                                                        </div>




                                                    </div>


                                                </div>
                                            ))

                                        ) : (
                                            <div className='h-[60vh] w-full'>
                                                <div className='text-prim text-center flex flex-col justify-center items-center h-full '>
                                                    <p>Você não fez nenhuma avaliação</p>
                                                </div>

                                            </div>
                                        )}
                                        

                                    </div>
                                </section>
                            )}

                            {screenSelected == "enderecos" && (
                                <section className='w-full gap-1 pb-[8vh] pt-[8vh] sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim'>
                                    <div className='p-5'>
                                        <h2 className='text-xl font-semibold text-desSec text-center sm:text-start'>Endereços cadastrados</h2>

                                        <div className='pt-5 flex flex-col justify-center w-full'>
                                            {userInfo.EnderecosCliente.length == 0 ? (
                                                <div className='grid
                                                  sm:grid-cols-3
                                                  gap-10
                                                  pt-5
                                                  justify-items-center
                                                  w-full
                                                  
                                                  scrollbar-hide'>
                                                    <div className='
                                                    
                                                    border-2 border-sec  rounded-lg 
                                                    
                                                    2xl:min-h-[32vh] 
                                                    2xl:max-h-[32vh]  
                                                    2xl:max-w-[32vh] 
                                                    2xl:min-w-[32vh]

                                                    xl:min-h-[38vh] 
                                                    xl:max-h-[38vh]  
                                                    xl:max-w-[38vh] 
                                                    xl:min-w-[38vh] 

                                                    lg:min-h-[36vh] 
                                                    lg:max-h-[36vh] 
                                                    lg:max-w-[36vh] 
                                                    lg:min-w-[36vh] 

                                                    min-h-[30vh] 
                                                    max-h-[30vh] 
                                                    min-w-[30vh] 
                                                    max-w-[30vh] 

                                                    flex flex-col justify-center items-center  transition-all '
                                                    onClick={() => (
                                                        
                                                        setOpenCreateAdress(true)

                                                    ) }
                                                    >
                                                        <Button 
                                                            className='p-2 text-des rounded-md bg-trans text-sm'
                                                            type="button"
                                                            onPress={() => (
                                                                
                                                                setOpenCreateAdress(true)

                                                            )}
                                                        >
                                                            
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                            </svg>

                                                        
                                                        </Button>
                                                    </div>

                                                </div>
                                            ) : (
                                              <div className='sm:p-5'>
                                                  <div className='grid
                                                  sm:grid-cols-3
                                                  gap-10
                                                  pt-5
                                                  justify-items-center
                                                  w-full
                                                  
                                                  scrollbar-hide
                                                  '>
                                                    

                                                    {userInfo.EnderecosCliente?.map((endereco) => (
                                                        <div key={endereco.id} className={`
                                                            border-2 border-sec  rounded-lg 

                                                            2xl:min-h-[32vh] 
                                                            2xl:max-h-[32vh]  
                                                            2xl:max-w-[32vh] 
                                                            2xl:min-w-[32vh]

                                                            xl:min-h-[38vh] 
                                                            xl:max-h-[38vh]  
                                                            xl:max-w-[38vh] 
                                                            xl:min-w-[38vh] 

                                                            lg:min-h-[36vh] 
                                                            lg:max-h-[36vh] 
                                                            lg:max-w-[36vh] 
                                                            lg:min-w-[36vh] 

                                                            min-h-[30vh] 
                                                            max-h-[30vh] 
                                                            min-w-[30vh] 
                                                            max-w-[30vh] 

                                                            flex flex-col justify-center items-center  transition-all 
                                                        
                                                        `}


                                                        >
                                                            {deleting ? (
                                                                <div className='rounded-md w-full h-full flex items-center justify-center  text-white'>
                                                                    <Spinner size='lg'/>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className='p-5 text-start flex flex-col text-prim w-full justify-between'>
                                                                        <h2 className='text-sec font-semibold pb-2'>{endereco?.localServico}</h2>
                                                                        <p>{endereco?.logradouro}, {endereco?.numero}</p> 
                                                                        <p>{endereco?.complemento}</p> 
                                                                        <p>{endereco?.bairro}</p> 
                                                                        <p>{endereco?.cidade}, {endereco?.estado} - {endereco?.cep} </p> 
                                                                        <div className='flex justify-end pt-2 text-red-400'>
                                                                            <Button
                                                                            onPress={() => (HandleDeleteEndereco(endereco.id))}
                                                                            type="button"
                                                                            className='text-error bg-white justify-end p-0'
                                                                            >
                                                                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                              </svg>
      
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                      ))}

                                                      <div className='
                                                            border-2 border-sec  rounded-lg 
                                                            
                                                            2xl:min-h-[32vh] 
                                                            2xl:max-h-[32vh]  
                                                            2xl:max-w-[32vh] 
                                                            2xl:min-w-[32vh]

                                                            xl:min-h-[38vh] 
                                                            xl:max-h-[38vh]  
                                                            xl:max-w-[38vh] 
                                                            xl:min-w-[38vh] 

                                                            lg:min-h-[36vh] 
                                                            lg:max-h-[36vh] 
                                                            lg:max-w-[36vh] 
                                                            lg:min-w-[36vh] 

                                                            min-h-[30vh] 
                                                            max-h-[30vh] 
                                                            min-w-[30vh] 
                                                            max-w-[30vh] 

                                                            flex flex-col justify-center items-center  transition-all '
                                                      onClick={() => (
                                                        
                                                        setOpenCreateAdress(true)

                                                      ) }
                                                      >
                                                          <button 
                                                            className='p-2 text-des rounded-md bg-trans text-sm'
                                                            type="button"
                                                            onClick={() => (
                                                                
                                                                setOpenCreateAdress(true)
        
                                                            )}
                                                          >
                                                            
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                            </svg>

                                                          
                                                          </button>
                                                      </div>

                                                      
                                                  </div>
                                                  
                                              </div>
                                              
                                            )}

                                        </div>
                                    </div>

                                    {/* modal para criar um novo endereço */}
                                    <Modal 
                                    backdrop="opaque" 
                                    isOpen={openCreateAdress} 
                                    onClose={setOpenCreateAdress}
                                    classNames={{
                                    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
                                    body: "bg-white",
                                    header: "bg-white",
                                    
                                    }}
                                    placement='center'


                                    className="max-w-[40vh] sm:min-w-[80vh]"
                                    >
                                        <ModalContent className="bg-">
                                        {(onClose) => (
                                            <>

                                            <form  onSubmit={handleSubmit(onSubmit)} >
                                                <ModalHeader className="flex flex-col gap-1 text-prim text-2xl ">
                                                <div className="flex w-full justify-between pr-10">
                                                    <h2 className="flex gap-2 items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                    </svg>
                                                    Criar novo endereço
                                                    </h2>
                                                    
                                                </div>
                                                </ModalHeader>

                                                <ModalBody className="flex flex-col p-0">
                                                <ScrollShadow className="flex flex-col overflow-y-auto max-h-[65vh] " hideScrollBar>
                                                    <div className="text-neutral-400 flex  w-full justify-between gap-5 ">
                                                    <div className="text-neutral-400 flex  w-full justify-between flex-col">
                                                        <div className="w-full flex flex-col gap-4">
                                                            {/* endereco padrao do cliente */}
                                                                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                                                    <label htmlFor="localServico" className="text-prim">Local do serviço</label>
                                                                    <input 
                                                                    className="placeholder:text-neutral-600 border rounded-md border-bord bg-neutral-700 p-3 pt-2 pb-2 focus:outline-neutral-600 text-prim "
                                                                    id="localServico" 
                                                                    type="text" 
                                                                    placeholder="nome do endereço" 
                                                                    {...register("localServico")}
                                                                    />
                                                                    {errors.localServico && 
                                                                    <span className="text-error opacity-75">{errors.localServico?.message}</span>}
                                                                </div>
                                                                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                                                    <label htmlFor="cep" className="text-prim">CEP</label>
                                                                    <InputMask 
                                                                    ref={inputRef}
                                                                    mask="99999-999"
                                                                    maskChar={null}
                                                                    className="placeholder:text-neutral-600 border rounded-md border-bord bg-neutral-700 p-3 pt-2 pb-2 focus:outline-neutral-600 text-prim "
                                                                    id="cep" 
                                                                    type="text" 
                                                                    placeholder="Somente números" 
                                                                    {...register("cep")}
                                                                    onChange={handleCepChange}
                                                                    />
                                                                    {cepError && <p className="text-error text-sm mt-1">{cepError}</p>}
                                                                </div>
                                                                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                                                    <label htmlFor="logradouro" className="text-prim">Logradouro</label>
                                                                    <input 
                                                                    className="placeholder:text-neutral-600 border rounded-md border-bord bg-neutral-700 p-3 pt-2 pb-2 focus:outline-neutral-600 text-prim "
                                                                    id="logradouro" 
                                                                    type="text" 
                                                                    placeholder="" 
                                                                    {...register("logradouro")}
                                                                    readOnly
                                                                    />
                                                                    {errors.logradouro && 
                                                                    <span className="text-error opacity-75">{errors.logradouro?.message}</span>}
                                                                </div>
                                                                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                                                    <label htmlFor="numero" className="text-prim">Número</label>
                                                                    <input 
                                                                    className="placeholder:text-neutral-600 border rounded-md border-bord bg-neutral-700 p-3 pt-2 pb-2 focus:outline-neutral-600 text-prim "
                                                                    id="numero" 
                                                                    type="text" 
                                                                    placeholder="" 
                                                                    {...register("numero")}
                                                                    />
                                                                    {errors.numero && 
                                                                    <span className="text-error opacity-75">{errors.numero?.message}</span>}
                                                                </div>
                                                                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                                                    <label htmlFor="complemento" className="text-prim">Complemento</label>
                                                                    <input 
                                                                    className="placeholder:text-neutral-600 border rounded-md border-bord bg-neutral-700 p-3 pt-2 pb-2 focus:outline-neutral-600 text-prim "
                                                                    id="complemento" 
                                                                    type="text" 
                                                                    placeholder="Casa, apt, bloco, etc"
                                                                    maxLength="100" 
                                                                    {...register("complemento")}
                                                                    />
                                                                    {errors.complemento && 
                                                                    <span className="text-error opacity-75">{errors.complemento?.message}</span>}
                                                                </div>
                                                                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                                                    <label htmlFor="pontoRef" className="text-prim">Ponto de Referência</label>
                                                                    <input 
                                                                    className="placeholder:text-neutral-600 border rounded-md border-bord bg-neutral-700 p-3 pt-2 pb-2 focus:outline-neutral-600 text-prim "
                                                                    id="pontoRef" 
                                                                    type="text" 
                                                                    placeholder="" 
                                                                    maxLength="150"
                                                                    {...register("referencia")}
                                                                    />
                                                                    {errors.pontoRef && 
                                                                    <span className="text-error opacity-75">{errors.referencia?.message}</span>}
                                                                </div>
                                                                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                                                    <label htmlFor="bairro" className="text-prim">Bairro</label>
                                                                    <input 
                                                                    className="placeholder:text-neutral-600 border rounded-md border-bord bg-neutral-700 p-3 pt-2 pb-2 focus:outline-neutral-600 text-prim "
                                                                    id="bairro" 
                                                                    type="text" 
                                                                    placeholder="" 
                                                                    {...register("bairro")}
                                                                    readOnly
                                                                    />
                                                                    {errors.bairro && 
                                                                    <span className="text-error opacity-75">{errors.bairro?.message}</span>}
                                                                </div>

                                                                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                                                    <label htmlFor="cidade" className="text-prim">Cidade</label>
                                                                    <input 
                                                                    className="placeholder:text-neutral-600 border rounded-md border-bord bg-neutral-700 p-3 pt-2 pb-2 focus:outline-neutral-600 text-prim "
                                                                    id="cidade" 
                                                                    type="text" 
                                                                    placeholder="" 
                                                                    {...register("cidade")}
                                                                    readOnly
                                                                    />
                                                                    {errors.cidade && 
                                                                    <span className="text-error opacity-75">{errors.cidade?.message}</span>}
                                                                </div>

                                                                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                                                    <label htmlFor="estado" className="text-prim">Estado</label>
                                                                    <input 
                                                                    className="placeholder:text-neutral-600 border rounded-md border-bord bg-neutral-700 p-3 pt-2 pb-2 focus:outline-neutral-600 text-prim "
                                                                    id="estado" 
                                                                    type="text" 
                                                                    placeholder=""
                                                                    {...register("estado")}
                                                                    readOnly
                                                                    />
                                                                    {errors.estado && 
                                                                    <span className="text-error opacity-75">{errors.estado?.message}</span>}
                                                                </div>                                
                                                        </div>
                                                    </div>
                                                    
                                                    </div>
                                                </ScrollShadow>
                                                    <ModalFooter className='justify-between'>
                                                        <Button color="danger" variant="light" onPress={() => (onClose(), setOpenEdit(true))}
                                                        >
                                                        Cancelar
                                                        </Button>
                                                    
                                                        <Button type="submit" className="bg-desSec text-white min-w-[18vh]" isDisabled={creating}>
                                                        {creating ? <Spinner/> : "Criar endereço"}
                                                        </Button>
                                                    </ModalFooter>
                                                </ModalBody>

                                            </form>
                                            </>
                                        )}
                                        </ModalContent>
                                    </Modal>
                                </section>
                            )}
                            
                            <Navigation screenSelected={screenSelected} setScreenSelected={setScreenSelected}/>
                        </div>
                        
                    </>       

                ) : (
                    <>
                        <section className=' flex-col flex justify-center items-center h-[90vh] gap-4'>
                            <div className='text-white'>
                                <Spinner size='lg' />
                            </div>
                        </section>
                    </>
                )}
                
            </main>
            <CheckoutNotification/>         
                
        </div>
    );
};

export default AreaCliente;

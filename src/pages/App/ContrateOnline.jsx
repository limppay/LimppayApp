import React, { useEffect, useRef, useState } from 'react';
import { applyCoupom, createCheckout, getDisponiveis } from '../../services/api';
import {Avatar, Spinner} from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import {Logo, Footer } from '../../componentes/imports';
import ServiceSelection from '../../componentes/App/ServiceSelection';
import CustomCalendar from '../../componentes/App/DatePicker';
import ProgressBar from '../../componentes/App/ProgressBar';
import Banner from "../../assets/img/App/limpando.webp"
import HeaderWebApp from '../../componentes/App/HeaderWebApp';
import StepLoginCustomer from './StepLoginCustomer';
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter} from "@nextui-org/modal";

import { useUser } from '../../context/UserProvider';
import { useAgendamentoData } from '../../context/AgendamentoData';
import { useSelectedProvider } from '../../context/SelectedProvider';
import { useSelectedDates } from '../../context/SelectedDates';
import { useSelectedTimes } from '../../context/SelectedTimes';

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import {Accordion, AccordionItem} from "@nextui-org/accordion";
import { Button } from '@nextui-org/react';
import CookieBanner from '../../componentes/App/CookieBanner';
import WhatsappButton from '../../componentes/WhatsAppContact';
import WhatsAppIcon from "../../assets/img/whatsapp.webp"
import { Helmet } from 'react-helmet-async';

import { useCheckout } from '../../context/CheckoutData';
import CheckoutNotification from './CheckoutNotification';
import AdressCliente from '../../componentes/App/AdressCliente';


export default function ContrateOnline() {
    const { checkoutData, setCheckoutData } = useCheckout()
    const { setAgendamentoData } = useAgendamentoData()
    const { setSelectedProvider } = useSelectedProvider()
    const { selectedDates, setSelectedDates } = useSelectedDates([])
    const { user, setUser, loadingUser } = useUser();
    const navigate = useNavigate();
    
    const [provider, setProvider] = useState()
    const [observacao, setObservacao ] = useState('')
    const [cidade, setCidade] = useState("")
    const [estado, setEstado] = useState("")
    const [providers, setProviders] = useState([])
    const [open, setOpen] = useState(false)
    const [finding, setFinding] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false);

    const [currentStep, setCurrentStep] = useState(0);
    const [showCalendar, setShowCalendar] = useState(false);
    const [numberOfDays, setNumberOfDays] = useState(0); // Número de dias que o usuário selecionou

    const [selectedService, setSelectedService] = useState(''); // Estado para armazenar o serviço selecionado
    const [servicoId, setServicoId] = useState("")
    const [serviceValue, setServiceValue] = useState() // Estado para armazenar o valor do serviço
    
    const {selectedTimes, setSelectedTimes} = useSelectedTimes([])

    const [enderecoDefaultCliente, SetEnderecoDefaultCliente] = useState([])    
    const [selectedEnderecoCliente, setSelectedEnderecoCliente] = useState(null)

    const [providerId, setProviderId] = useState("")
    const [avaliacoes, setAvaliacoes] = useState([])
    const [mediaStars, setMediaStars] = useState(0)
    const [loadingReview, setLoadingReview] = useState(false)

    const [searchQuery, setSearchQuery] = useState('');

    
    const [sumValueService, setSumValueService] = useState(serviceValue * selectedDates.length)

    const [valorCupom, setValorCupom] = useState(0)
    const [descontoTotal, setDescontoTotal] = useState(0)
    const [valorLiquido, setValorLiquido]  = useState(0)

    const [apply, setApply] = useState(false);
    const [cupomError, setCupomError] = useState(null);

    const [loadingCheckout, setLoadingCheckout] = useState(false)



    const cupom = yup.object({
        code: yup.string().required("Digite o codigo do cupom"),
    })

    const {
        register: registerCupom,
        handleSubmit: handleSubmitCupom,
        formState: { errors: errorCupom },
        reset: resetCupom,
        } = useForm({
        resolver: yupResolver(cupom),
    })

    const buttons = [
        { link: "#quem-somos", text: "Quem Somos" },
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

    useEffect(() => {
        setSelectedEnderecoCliente(user?.EnderecoDefault[0].id);
        setEstado(user?.EnderecoDefault[0].estado)
        setCidade(user?.EnderecoDefault[0].cidade)

    }, [user]);
        
    // função para resetar o agendamento, toda vez que sair de checkout e voltar para contrate
    useEffect(() => {
        setAgendamentoData([]);
        setProvider(null)
        setSelectedDates([])
        setSelectedTimes([])

    }, [setAgendamentoData]);
    
    
    const handleServiceChange = (service, id) => {
        setSelectedService(service); // Atualiza o serviço selecionado
        setServicoId(id)

    };

    const handleTimeChange = (time) => {
        setSelectedTimes(time)
    }

    const selectRandomProvider = () => {
        return providers[Math.floor(Math.random() * providers.length)];
    };

    const HandleSelectedRandomProvider = () => {
        if (!provider) {
            const randomProvider = selectRandomProvider();
            setProvider(randomProvider);
        } else {
        }

        setCurrentStep(prevStep => Math.min(prevStep + 1, 4));
    }

    // Tela dos prestadores: faz a requisição para buscar somente os prestadores disponíveis
    const handleProceed = async () => {
        setFinding(true);

        try {
            if (selectedDates.length > 0) {
                // Formata todas as datas selecionadas no array como strings no formato YYYY-MM-DD
                const formattedDates = selectedDates.map((date) => date.toISOString().split('T')[0]);

                // Faz a requisição para a API enviando o array de datas
                const response = await getDisponiveis(formattedDates, servicoId, cidade, estado);


                // Inicialmente, define os providers sem as URLs de avatar
                setProviders(response.data);

                if (response.data.length > 0) {
                    // Busca as URLs de avatar de cada prestador e atualiza o estado
                    const updatedProviders = await Promise.all(
                        response.data.map(async (provider) => {
                            return provider; // Retorna o objeto provider com o avatar incluído
                        })
                    );

                    setProviders(updatedProviders); // Atualiza o estado com os providers incluindo seus avatares
                } else {
                    console.error("Nenhum prestador disponível encontrado");
                }
            } else {
                console.error("Nenhuma data selecionada");
            }
        } catch (error) {
            console.error("Erro ao buscar prestadores disponíveis:", error);
        } finally {
            setFinding(false);
            setCurrentStep((prevStep) => Math.min(prevStep + 1, 4));
        }
    };


    const handleStepClick = (index) => {
        if (index < currentStep) {

            if ( index < 2 ) {
                setProvider(null)
                setSelectedEnderecoCliente(enderecoDefaultCliente[0]?.id)
                setEstado(enderecoDefaultCliente[0]?.estado)
                setCidade(enderecoDefaultCliente[0]?.cidade)
            }
            

            if ( index < 3 ) {
                setProvider(null)
                setProviders([])
            }

            if ( index < 1 ) {
                setSelectedDates([])
                setProvider(null)
            }

            setCurrentStep(index);
            setShowCalendar(index === 1);
        } 
        
    };

    const handleDaysChange = (days) => {
        setNumberOfDays(days); // Atualiza o número de dias selecionados
    };

    //função que recebe as informações de data e serviço, para retorna os prestadores disponveis 
    const handleConfirmSelection = async () => {
        setCurrentStep(currentStep + 1);
        setShowCalendar(false);

    };

    const handleObterAvaliacoes = async () => {
        setLoadingReview(true) // Indica que as avaliações estão sendo carregadas
        
        setAvaliacoes([])
        setAvaliacoes([]) // Limpa as avaliações para o novo provider
        setMediaStars()
    
        setAvaliacoes(provider?.Review)
        const totalStars = avaliacoes.reduce((acc, avaliacao) => acc + avaliacao.stars, 0);
        const averageStars = totalStars / avaliacoes.length;
        setMediaStars(averageStars)

        setLoadingReview(false) // Termina o carregamento
    }

    // UseEffect para carregar as avaliações quando providerId mudar
    useEffect(() => {
        if (providerId) {
            handleObterAvaliacoes()

        }
    }, [providerId])
    

    const filteredProviders = providers.filter(provider =>
        provider.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    // Atualiza dinamicamente o valor total ao selecionar novas datas ou alterar o valor do serviço
    useEffect(() => {
        const total = serviceValue * selectedDates.length;

        setSumValueService(total);
    }, [serviceValue, selectedDates]);

    useEffect(() => {
        setValorLiquido(sumValueService)

    }, [sumValueService])

    const handleApplyCupom = async (data) => {
        setApply(true);
        setCupomError(null); // Limpa erros anteriores

        try {
            const response = await applyCoupom(data.code, sumValueService, user?.id );
            setApply(false);

            if (response && response.data) {

                // Atualiza o valor total do pedido com o valor descontado
                setDescontoTotal(response.data.discount);
                setValorLiquido(sumValueService - Number(descontoTotal))
                
            } else {
                setCupomError("Não foi possível adicionar este cupom");
            }
        } catch (error) {
            setApply(false);
            setCupomError("Ocorreu um erro ao tentar aplicar o cupom");
        }
    };

    useEffect(() => {
        setValorLiquido(sumValueService - Number(descontoTotal))

    }, [descontoTotal])

    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        }).format(valor);
    }

    const gerarCodigoAleatorio = () => {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let codigo = '';
        for (let i = 0; i < 6; i++) {
          codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return codigo;
    };
      
    const gerarIDGrupo = () => {
        const prefixo = 'CB';
        const codigo = gerarCodigoAleatorio()
        const novoGrupoID = `${prefixo}${codigo}`; // Combina os elementos
        
        return novoGrupoID
    };

    const HandleNavigateCheckout = async () => {
        setLoadingCheckout(true)
        const codeComb = gerarIDGrupo()

        // Cria um array com os dados de todos os agendamentos
        const agendamentos = selectedDates.map((date) => {
            
            const FormDate = new Date(date).toDateString(); // Formata a data
            const times = selectedTimes[FormDate]; // Obtém o horário correspondente
    
            return {
                userId: provider.id,
                clienteId: user?.id,
                servicoId: servicoId,
                dataServico: FormDate,
                Servico: selectedService,
                horaServico: times,
                valorServico: serviceValue,
                valorBruto: sumValueService,

                valorCupom: valorCupom,
                descontoTotal: Number(descontoTotal),

                valorLiquido: valorLiquido || sumValueService,

                observacao: observacao,
                ...(
                    selectedEnderecoCliente?.id && { enderecoId: selectedEnderecoCliente.id },
                    selectedDates.length > 1 && { comboId: codeComb }
                ),
                    
                
            };

        });

        try {
            const response = await createCheckout(agendamentos)
            setLoadingCheckout(false)

        } catch (error) {
            
        } finally {
            await setCheckoutData(agendamentos)
            await setSelectedProvider(provider)
            navigate("/checkout-pagamento");

        }
    
    };
    

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


    const calcularMediaStars = (reviews) => {
        if (!reviews || reviews.length === 0) return 0; // Retorna 0 caso não tenha avaliações
        const totalStars = reviews.reduce((acc, avaliacao) => acc + avaliacao.stars, 0);
        const averageStars = totalStars / reviews.length;
        return Math.round(averageStars * 10) / 10
    };

    // Ordena os providers com base na média de estrelas (ordem decrescente)
    const sortedProviders = filteredProviders.sort((a, b) => {
        const mediaA = calcularMediaStars(a?.Review);
        const mediaB = calcularMediaStars(b?.Review);
        return mediaB - mediaA; // Ordem decrescente, do maior para o menor
    });
    
    if(user && !user?.ativa) {
        return (
            <>
                <HeaderWebApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess}/>
                <main className="w-screen h-screen bg-neutral-900 flex justify-center items-center">
                    <div className="flex flex-col justify-center items-center p-10">
                        <div className="text-prim ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-28">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <h1 className="text-prim  font-semibold text-xl">Não foi possível continuar</h1>
                            <p className="text-prim  text-justify">Sua conta foi desativada, entre em contato com o suporte</p>
                        </div>

                    </div>
                </main>
            </>
        )
    }

    return (
        <>
            <Helmet>
                <title>Limppay: Contrate Online</title>
            </Helmet>
            <HeaderWebApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess}/>

            {loadingUser ? (
                <div className='flex flex-col justify-center items-center h-screen w-full text-white'>
                    <Spinner size='lg' label='Aguarde, estamos carregando suas informações' classNames={{label: "text-prim text-center pt-[2vh] text-sm"}}/>
                </div>

            ) : (
                <main className="relative p-4 pb-20 flex justify-center gap-5 min-h-[100vh] md:justify-around lg:justify-around 2xl:pt-[3vh]">
                    <div className='flex flex-col items-center text-center min-w-[30vh] max-w-[50vh] sm:max-w-[80vh] sm:min-w-[80vh]  lg:min-w-[100vh] lg:max-w-[100vh] xl:min-w-[120vh] xl:max-w-[100vh] 2xl:min-w-[110vh] 2xl:max-w-[130vh]    '>

                        <ProgressBar currentStep={currentStep} onStepClick={handleStepClick} />

                        {currentStep == 0 && (
                            <>
                                <ServiceSelection 
                                    onProceed={handleConfirmSelection} 
                                    onDaysChange={handleDaysChange} // Passa a função de atualizar os dias
                                    onServiceChange={handleServiceChange} // Passa a função de atualizar o serviço
                                    setServiceValue={setServiceValue}
                                />
                            </>
                        )}

                        {currentStep == 1 && (
                            <>
                                <CustomCalendar 
                                    onConfirmSelection={handleConfirmSelection}
                                    selectedDates={selectedDates}
                                    setSelectedDates={setSelectedDates}
                                    maxSelection={numberOfDays} // Defina aqui o número máximo de seleções permitidas
                                    selectedTimes={selectedTimes}
                                    setSelectedTimes={handleTimeChange}
                                />
                            </>
                        )}

                        {currentStep == 2 && (
                            <>
                                {user ? (
                                    <AdressCliente 
                                        finding={finding} 
                                        handleProceed={handleProceed} 
                                        selectedEnderecoCliente={selectedEnderecoCliente}
                                        setSelectedEnderecoCliente={setSelectedEnderecoCliente}
                                        setCidade={setCidade} 
                                        setEstado={setEstado}
                                    />

                                ) : (
                                    <StepLoginCustomer />

                                )}
                                
                            </>                 
                        )}

                        {currentStep == 3 && (
                            <>
                                <div className='pt-5'>
                                    {providers.length === 0 ? (
                                        <div className="h-[40vh] flex flex-col justify-center items-center gap-4 text-desSec opacity-60">
                                            <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-16 h-16 text-sec"
                                            >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                            />
                                            </svg>
                                            <p className="text-justify text-lg font-medium max-w-md ">
                                            Infelizmente, nenhum prestador está disponível para os critérios especificados. Tente ajustar os filtros ou volte mais tarde :(
                                            </p>
                                    </div>
                                    
                                    ) : (
                                        <div className='flex flex-col gap-3'>

                                            <div>
                                                <h1 className='text-desSec text-lg font-semibold'>Selecione o prestador</h1>
                                            </div>

                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    id='searchQuery'
                                                    placeholder="Buscar profissional"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="focus:outline-prim w-full border border-bord rounded-full px-4 py-2 text-prim"
                                                />
                                                <label htmlFor="searchQuery">
                                                    <button className="absolute right-4 top-2 text-sec">
                                                    <i className="fas fa-search"></i>
                                                    </button>
                                                </label>
                                            </div>

                                            <div className='h-[55vh] flex flex-col justify-between'>
                                                <div className='flex flex-col justify-between  max-h-[45vh]'>
                                                    <div className={` grid ${filteredProviders.length > 0 ? " pb-2       lg:grid-cols-2  grid-cols-1 min-h-[20vh] max-h-[50vh] overflow-y-auto min-w-[40vh] max-w-[45vh] sm:min-w-[80vh] sm:max-w-[100vh]  " : "grid-none"}  pt-3 gap-10`}>
                                                        {filteredProviders.length > 0 ? (
                                                            sortedProviders.map((prestador) => (
                                                                <>
                                                            
                                                                    <div key={prestador.id} className='flex flex-col gap-3 '>
                                                                        <div 
                                                                        className={`shadow-md  flex gap-3  items-center cursor-pointer transition-all duration-200   
                                                                        border rounded-lg bg-white  p-2 
                                                                        ${provider && provider.id === prestador.id ? ' border-sec ' : 'hover:border-sec border-trans'}`}
                                                                        
                                                                        
                                                                        
                                                                        onClick={() => {
                                                                            setProvider(prestador); // Armazena o provider selecionado
                                                                        }}

                                                                        >
                                                                            <div>
                                                                                <Avatar 
                                                                                    src={prestador?.avatarUrl.avatarUrl}
                                                                                    size="lg"
                                                                                    sizes="(max-width: 768px) 50px, 100px"
                                                                                    loading='lazy'
                                                                                />
                                                                                
                                                                            </div>

                                                                            <div className='flex justify-start flex-col w-full'>
                                                                                <p className='
                                                                                text-prim
                                                                                text-start
                                                                                '>{prestador.name}</p>
                                                                                <Button 
                                                                                    className='
                                                                                    p-2  w-full max-w-full text-center
                                                                                    bg-white
                                                                                    text-des 
                                                                                    shadow-sm
                                                                                    shadow-bord
                                                                                    border
                                                                                    border-bord
                                                                                    border-opacity-60
                                                                                    
                                                                                    transition-all  
                                                                                    hover:border-trans
                                                                                    flex 
                                                                                    items-center
                                                                                    justify-between
                                                                                    gap-2
                                                                                    '

                                                                                    onPress={() => {
                                                                                        setProvider(prestador)
                                                                                        setProviderId(prestador.id) // Atualiza o providerId e o useEffect dispara handleObterAvaliacoes automaticamente
                                                                                        setOpen(true)
                                                                                    }}                                                         
                                                                                
                                                                                >
                                                                                    <div className='flex items-center gap-2'>
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                                                                        </svg>
                                                                                        <div className='flex items-center gap-1'>
                                                                                            <span
                                                                                                className={`text-3xl text-des`}
                                                                                            >
                                                                                                ★
                                                                                            </span>
                                                                                            <span>
                                                                                                {calcularMediaStars(prestador?.Review)}
                                                                                            </span>
                                                                                        
                                                                                        </div>


                                                                                    </div>
                                                                                    


                                                                                    
                                                                                    
                                                                                </Button>
                                                                            </div>

                                                                        </div>

                                                                        


                                                                    </div>
                                                                    
                                                                </>                                                
                                                            ))
                                                            

                                                            
                                                        ) : (
                                                            <>
                                                                <p className="text-prim">Nenhum prestador encontrado.</p>
                                                            </>
                                                        )}
                                                        
                                                        <Modal 
                                                            backdrop="opaque" 
                                                            isOpen={open} 
                                                            onOpenChange={setOpen}
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
                                                                            
                                                                            {provider && ( // Renderiza as informações do provider selecionado
                                                                                <div className="pt-0 p-0 flex flex-col w-full bg-pri max-h-[60vh] sm:max-h-[65vh]">
                                                                                    <div className='flex flex-col gap-2 justify-start'>
                                                                                        <div className="flex items-center space-x-96 lg:pl-10 pl-5 p-20  pb-5 bg-desSec  ">
                                                                                            {/* Container do Avatar */}
                                                                                            <div className="absolute">
                                                                                                <Avatar src={provider?.avatarUrl.avatarUrl} size="lg"    
                                                                                                className="w-24 h-24 text-large
                                                                                                border-white
                                                                                                border-5
                                                                                                "
                                                                                                loading='lazy'
                                                                                                />
                                                                                            </div>
                                                                                            
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className='flex justify-end items-center gap-2 pr-5 pt-2'>
                                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                                            <StarReview
                                                                                                key={star}
                                                                                                filled={star <= calcularMediaStars(provider?.Review)}
                                                                                            />
                                                                                        ))}
                                                                                    </div>
                                                                                    
                                                                                    <div className='overflow-y-auto max-h-[80vh] '>
                                                                                        <div className='p-5 pb-1'>
                                                                                            <div className='border rounded-lg border-bord w-full shadow-md  bg-white p-5 '>
                                                                                                <h1 className='text-prim font-semibold text-xl'>{provider.name}</h1>
                                                                                                <p className='text-prim text-[0.8rem]'>
                                                                                                    {calcularIdade(provider.data)} anos
                                                                                                </p>
                                                                                                <p className='text-[0.8rem] text-prim pb-2'>{provider.genero}</p>
                                                                                                <div className='overflow-y-auto lg:h-[20vh]'>
                                                                                                    <p className='text-prim text-start pt-4 text-sm'>{provider.sobre}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='p-5'>
                                                                                            <div className='border rounded-lg border-bord w-full shadow-md  bg-white p-5 '>
                                                                                                <Accordion   >
                                                                                                    <AccordionItem  key="1" aria-label="Accordion 1" title={`Avaliações ( ${provider.Review.length} )`} classNames={{title: 'text-prim text-md '}} >
                                                                                                        <div className='flex flex-col gap-5'>
                                                                                                            {provider && (
                                                                                                                provider.Review.length == 0 ? (
                                                                                                                    <div className=' p-5 text-prim flex flex-col justify-center text-center'>
                                                                                                                        <h3 className='font-semibold'>Sem avaliações</h3>
                                                                                                                    </div>
                                                                                                                    
                                                                                                                ) : (
                                                                                                                    provider?.Review.map((avaliacao) => (
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
                                                                    <Button color="danger" variant="light" onPress={onClose}>
                                                                        Fechar
                                                                    </Button>
                                                                    <Button className='bg-desSec text-white' onPress={handleConfirmSelection}  >
                                                                        Selecionar e prosseguir
                                                                    </Button>
                                                                    </ModalFooter>
                                                                </>
                                                                )}
                                                            </ModalContent>
                                                        </Modal>
                                                    </div>


                                                </div>
                                                
                                                <div className='flex justify-center pt-5 border-b border-bord'>
                                                    {provider ? (
                                                        <Button
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
                                                            gap-2
                                                            w-full
                                                            "
                                                            onPress={() =>handleConfirmSelection()}
                                                            
                                                        >
                                                            Selecionar e prosseguir
                                                        </Button>
                                                    ) : ( 
                                                        <Button
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
                                                            gap-2
                                                            w-full
                                                            "
                                                            onPress={() => HandleSelectedRandomProvider()}
                                                            
                                                        >
                                                            Selecione por mim e prosseguir
                                                        </Button>
                                                        
                                                    )}
                                                </div>

                                            </div>


                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {currentStep == 4 && (
                            <>
                                <div className='w-full  flex flex-col items-center  justify-between  p-2 gap-5 sm:p-10 sm:pl-20 sm:pr-20 pt-5 shadow-md rounded-md pb-0 h-[60vh]'>
                                    <div className='w-full 2xl:min-w-[70vh]'>
                                        <div className='flex flex-col gap-14 '>
                                            <div className='w-full flex flex-col gap-3'>
                                                <h2 className='text-desSec font-semibold text-xl'>Observação</h2>
                                                <textarea
                                                placeholder="Se necessário, deixe-nos uma observação"
                                                className="border rounded-md border-bord p-3 min-h-20 lg:min-h-24 2xl:min-h-36 focus:outline-ter text-prim w-full max-h-1"
                                                rows="3"
                                                value={observacao}  // Valor vinculado ao estado
                                                onChange={(e) => setObservacao(e.target.value)}  // Atualiza o estado quando o valor mudar
                                                ></textarea>
                                            </div>
                                            
                                            <div className='w-full flex flex-col gap-3'>
                                                <h2 className='text-desSec font-semibold text-xl'>Cupom de desconto</h2>
                                                <div className='flex gap-5'>
                                                    <form onSubmit={handleSubmitCupom(handleApplyCupom)} className='flex gap-5 w-full'>
                                                        <div className='w-full flex flex-col items-center gap-2'>
                                                            <input  className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter w-full" placeholder='Digite o cupom' 
                                                                {...registerCupom("code")}
                                                            />
                                                            <span className='text-error'>{cupomError}</span>


                                                        </div>
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
                                                        w-4/12
                                                        "
                                                        isDisabled={apply}
                                                        >
                                                            {apply ? <Spinner/> : "Utilizar"}
                                                        </Button>

                                                    </form>
                                                </div>
                                                
                                            </div>

                                        </div>

                                    </div>
                                    <div className=' w-full 2xl:min-w-[70vh]'>
                                        <div className='w-full flex flex-col gap-5 pt-5 pb-5 '>
                                            <Button 
                                            className="
                                            p-5 rounded-md 
                                            text-center
                                            text-white 
                                            bg-sec         
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
                                            onPress={() => HandleNavigateCheckout()}
                                            isDisabled={loadingCheckout}

                                            >
                                                {loadingCheckout ? <Spinner/> : "Conferir e solicitar serviço"}
                                            </Button>
                                        </div>
                                    </div>

                                    

                                </div>
                            </>
                        )}
                        
                    </div>

                    {/* Cartão azul - Visível somente em telas grandes (desktop) */}
                    {currentStep > 0 && (
                        <div className="hidden md:block lg:block  lg:pt-[5vh] ">
                            <div className="bg-desSec text-white shadow-md rounded-t-none rounded-lg pt-[12vh] md:pt-[13vh] lg:pt-[0vh] xl:pt-[0vh] p-4 flex flex-col items-center gap-10 max-w-[50vh] xl:max-w-[60vh] xl:min-w-[60vh] text-justify min-h-[80vh]  ">

                                <div className='w-full flex justify-between items-center border-b p-12 pt-0 pb-2 lg:pt-12 xl:pt-16 pl-7 pr-7 '>
                                    <h3 className="text-xl 2xl:text-2xl flex flex-wrap items-end ">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 font-semibold 2xl:size-10">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                        </svg>
                                        Total
                                    </h3>

                                    <div className="flex flex-col lg:flex-row items-center gap-2">
                                        {/* Se o valor do desconto existir, mostra a linha riscada */}
                                        {descontoTotal ? (
                                            <>
                                                <div className='flex flex-col justify-end items-end'>
                                                    <div className='flex'>
                                                        <p className=' relative text-[1.5vh]'>
                                                            -${descontoTotal}
                                                        </p>
                                                        <p className="text-md line-through text-gray-500">
                                                            {formatarMoeda(sumValueService)}
                                                        </p>

                                                    </div>
                                                    <p className="text-md 2xl:text-2xl font-semibold text-green-500">
                                                        {formatarMoeda(valorLiquido)}
                                                    </p>

                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-lg 2xl:text-2xl">{formatarMoeda(valorLiquido)}</p>
                                        )}
                                    </div>
                                </div>


                                    <div className='flex flex-col gap-7 w-full pl-7 pr-7'>
                                        {selectedService?(
                                            <div className='w-full flex flex-col  gap-2 justify-between'>
                                                <p className='text-lg 2xl:text-xl font-semibold'>Serviço selecionado:</p>
                                                <div className='flex items-center w-full justify-between'>
                                                    <p className='text-base 2xl:text-xl'>{selectedService}</p>
                                                    <p className='text-base 2xl:text-xl'>{formatarMoeda(serviceValue)}</p>
                                                </div>
                                            </div>
                                        ):(
                                            <div className='w-full flex flex-col  gap-2'>
                                                <p className='text-lg font-semibold 2xl:text-xl'>Serviço selecionado:</p>
                                                <p className='text-base 2xl:text-xl'>Nenhum serviço selecionado.</p>
                                            </div>
                                        )}

                                        {/*Exibe as datas e horários selecionados */}
                                        {selectedDates.length > 0 ? (
                                            <div className='w-full flex flex-col gap-2 justify-between'>
                                                <p className='text-md 2xl:text-xl font-semibold'> Data(s) selecionado(s):</p>
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
                                            <div className='w-full flex flex-col   gap-2'>
                                                <p className='text-lg font-semibold 2xl:text-xl'>Data(s) selecionada(o):</p>
                                                <p className='text-base 2xl:text-xl'>Nenhuma data selecionada</p>
                                            </div>
                                        )}

                                        {/* Exibe o prestador selecionado*/}
                                        {provider?(
                                            <div className='w-full flex flex-col  gap-2'>
                                                <p className='text-md font-semibold 2xl:text-xl'> Prestador selecionado:</p>
                                                <div className='flex w-full items-center gap-2'>
                                                    <Avatar src={provider?.avatarUrl?.avatarUrl} size="md"/>
                                                    <p className='text-base 2xl:text-xl'>{provider.name}</p>
                                                    {/*Mostra o avatar do prestador */}
                                                </div>
                                            </div>
                                        ):(
                                            <div className='w-full flex flex-col  gap-2'>
                                                <p className='text-lg font-semibold 2xl:text-xl'>Prestador selecionado</p>
                                                <p className='text-base 2xl:text-xl'>Nenhum prestador selecionado.</p>
                                            </div>
                                        )}

                                        {observacao?(
                                            <div className='w-full flex flex-col  gap-2'>
                                                <p className='text-md font-semibold 2xl:text-xl'> Observação:</p>
                                                <div className='flex w-full items-center gap-2'>
                                                    <p className='text-base 2xl:text-xl'>{observacao}</p>
                                                    {/*Mostra o avatar do prestador */}
                                                </div>
                                            </div>
                                        ):(
                                            <div className='w-full flex flex-col  gap-2'>
                                                <p className='text-lg font-semibold 2xl:text-xl'>Observação:</p>
                                                <p className='text-base 2xl:text-xl'>Nenhuma</p>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div> 
                    )}
                        
                    {currentStep == 0 &&(
                        <div className="hidden md:block lg:block  lg:pt-[5vh]   ">
                            <div className="bg-desSec text-white shadow-md rounded-t-none rounded-lg pt-[12vh] md:pt-[13vh] lg:pt-[10vh] p-4 flex flex-col items-center gap-10 max-w-[50vh] xl:max-w-[60vh] 2xl:max-w-[65vh] 2xl:pl-10 2xl:pr-10 text-justify min-h-[80vh] ">
                                <h3 className="text-xl 2xl:text-2xl font-bold flex flex-wrap">Olá, agende um serviço conosco é fácil e rápido!</h3>
                                <img
                                src={Banner}
                                alt="Ilustração de limpeza"
                                className="xl:w-[50vh] mb-4"
                                />
                                <ul className="text-sm 2xl:text-xl">
                                    <li className="mb-2">
                                        <i className="fas fa-calendar-alt mr-2"></i> Para agendar um serviço...
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-check-square mr-2"></i> Comece selecionando onde será a limpeza;
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-tasks mr-2"></i> Em sequência, escolha as etapas.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className={`${currentStep >= 1 ? "" : "hidden"} sm:hidden fixed bottom-0 left-0 w-full transition-all duration-300 ease-in-out ${isExpanded ? 'min-h-[65vh] max-h-[65vh]' : 'min-h-[8vh] max-h-[12vh]'} bg-white p-2  text-prim  shadow-[0_-4px_10px_rgba(0,0,0,0.3)] rounded-t-[2vh]`}>
                        <div
                            className="cursor-pointer  bg-white pt-2 p-4 text-center  font-semibold rounded-t-lg border-b border-bord"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <div className="flex justify-between items-center ">

                                <div className='flex flex-col'>
                                    <div className='flex gap-2 items-center'>
                                        {descontoTotal ? (
                                            <>
                                                <div className='flex flex-col justify-end items-end'>
                                                    <div className='flex'>
                                                        <p className=' relative text-[1.2vh] text-prim'>
                                                            -${descontoTotal}
                                                        </p>
                                                        <p className="text-sm line-through font-semibold text-prim">
                                                            {formatarMoeda(sumValueService)}
                                                        </p>

                                                    </div>
                                                    <p className="text-lg font-semibold text-desSec">
                                                        {formatarMoeda(valorLiquido)}
                                                    </p>

                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-xl font-semibold text-desSec">{formatarMoeda(valorLiquido)}</p>
                                        )}

                                    </div>
                                </div>
                                <div className='flex flex-col justify-center items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 text-sec">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                    <span className='text-sec'>Resumo</span>

                                </div>
                                <a
                                    href="https://api.whatsapp.com/send?phone=5592992648251&text=Ol%C3%A1,%20vim%20pelo%20seu%20site%20e%20gostaria%20de%20saber%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20servi%C3%A7o!%20%E2%9C%85"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                
                                    {/* Ícone do WhatsApp */}
                                    <div className=" flex flex-col items-center">
                                        <img
                                        src={WhatsAppIcon}
                                        alt="WhatsApp"
                                        className="w-6 h-6"
                                        />
                                        <p className='text-sec'>Atendimento</p>
                                    </div>
                                </a>
                            </div>
                            
                            

                        </div>

                        <div className={`overflow-y-auto max-h-[50vh]  p-4 ${isExpanded ? 'block' : 'hidden'} `}>
                            <div className="flex flex-col gap-4">
                                {/* Valor total */}
                                

                                {/* Serviço selecionado */}
                                <div className="flex flex-col gap-2">
                                    <div className='w-full flex flex-col  gap-2 justify-between'>
                                        <p className='text-lg font-semibold'>Serviço selecionado:</p>
                                        <div className='flex items-center w-full justify-between'>
                                            <p className='text-base'>{selectedService}</p>
                                            <p className='text-base'>{formatarMoeda(serviceValue)}</p>
                                        </div>
                                    </div>
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
                                    {provider ? (
                                        <div className="flex items-center gap-2">
                                            <Avatar src={provider.avatarUrl?.avatarUrl} size="sm" />
                                            <p className="text-base">{provider.name}</p>
                                        </div>
                                    ) : (
                                        <p className="text-base">Nenhum prestador selecionado.</p>
                                    )}
                                </div>

                                {/* Observação */}
                                <div className="flex flex-col gap-2">
                                    <p className="text-lg font-semibold">Observação:</p>
                                    <p className="text-base">{observacao || 'Nenhuma'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <WhatsappButton/>

                </main>
                
            )}

            
            {/* banner para aceitar os cookies */}
            <CookieBanner/>
            {currentStep == 0 && (
                <CheckoutNotification/>

            )} 

            <Footer />

            
        </>
    );
    
}

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Logo, Footer } from '../../componentes/imports';
import ServiceSelection from '../../componentes/App/ServiceSelection';
import CustomCalendar from '../../componentes/App/DatePicker';
import ProgressBar from '../../componentes/App/ProgressBar';
import { createAgendamento, CreateEnderecosCliente, deleteEnderecosCliente, getDisponiveis, getEnderecoDefaultCliente, getEnderecosCliente, getUserProfile } from '../../services/api';
import {Avatar, Spinner, spinner} from "@nextui-org/react";
'use client'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import Banner from "../../assets/img/App/limpando.png"
import HeaderWebApp from '../../componentes/App/HeaderWebApp';
import StepLoginCustomer from './StepLoginCustomer';

import { useUser } from '../../context/UserProvider';
import { useAgendamentoData } from '../../context/AgendamentoData';
import { useSelectedProvider } from '../../context/SelectedProvider';
import { useSelectedDates } from '../../context/SelectedDates';
import { useSelectedTimes } from '../../context/SelectedTimes';

import DeleteIcon from '@mui/icons-material/Delete'

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import InputMask from "react-input-mask"
import axios from 'axios';


export default function ContrateOnline() {

    const clienteId = localStorage.getItem('userId')

    const schema = yup.object({
        clienteId: yup.string().default(clienteId),
        localServico: yup.string().required("Informe o nome do endereço").trim(),
        cep: yup.string().required("Cep é obrigatório"),
        logradouro: yup.string(),
        numero: yup.string().required("Número é obrigatório").trim(),
        complemento: yup.string(),
        referencia: yup.string(),
        bairro: yup.string(),
        cidade: yup.string(),
        estado: yup.string(),
    })

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        reset,
        setValue, 
        getValues,
        setError, 
        watch,
        clearErrors
        } = useForm({
        resolver: yupResolver(schema),
    })

    const onSubmit = async (data) => {

        console.log(data)

        try {
          const response = await CreateEnderecosCliente(data);
          console.log("Endereço criado com sucesso!",response);

          setEnderecosCliente((prevEnderecos) => [...prevEnderecos, response])

          setOpenCreateAdress(false)


        } catch (error) {
            console.error(error.message);
            setMessage(error.message)
        }

    }

    console.log(errors)

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

    const removerMascara = (valor) => {
        return valor.replace(/\D/g, ''); // Remove todos os caracteres que não são números
    };

    const inputRef = useRef(null)


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

    const [cepError, setCepError] = useState("")
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [numberOfDays, setNumberOfDays] = useState(0); // Número de dias que o usuário selecionou

    const [selectedService, setSelectedService] = useState(''); // Estado para armazenar o serviço selecionado
    const [serviceValue, setServiceValue] = useState() // Estado para armazenar o valor do serviço

    const {selectedTimes, setSelectedTimes} = useSelectedTimes([])

    const [selectedEnderecoCliente, setSelectedEnderecoCliente] = useState(false)
    const [observacao, setObservacao ] = useState('')

    const [providers, setProviders] = useState([])
    const [open, setOpen] = useState(false)
    const [openCreateAdress, setOpenCreateAdress] = useState(false)
    const [enderecosCliente, setEnderecosCliente] = useState([])
    const [enderecoDefaultCliente, SetEnderecoDefaultCliente] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    const { user } = useUser();
    const { agendamentoData, setAgendamentoData } = useAgendamentoData()
    const { selectedProvider, setSelectedProvider } = useSelectedProvider()
    const { selectedDates, setSelectedDates } = useSelectedDates([])
    
    const HandleGetEnderecosCliente = async (id) => {
        if (clienteId) {
            setIsLoading(true);
            try {
                const GetEnderecosCliente = await getEnderecosCliente(id);
                const GetEnderecoDefaultCliente = await getEnderecoDefaultCliente(id)

                setEnderecosCliente(GetEnderecosCliente);
                SetEnderecoDefaultCliente(GetEnderecoDefaultCliente)

            } catch (error) {
                console.error("Erro ao obter endereços: ", error);
            } finally {
                setIsLoading(false); // Garantindo que o loading será encerrado
            }
        }
    };

    useEffect(() => {
        if (!enderecosCliente.length && !enderecoDefaultCliente.length && clienteId) {
            HandleGetEnderecosCliente(clienteId);
        }
    }, [enderecosCliente, clienteId]); // Chama a função ao montar o componente

    console.log(enderecoDefaultCliente)
    console.log(enderecosCliente)

    
    const handleServiceChange = (service) => {
        setSelectedService(service); // Atualiza o serviço selecionado
        console.log(service)
    };

    const handleTimeChange = (time) => {
        setSelectedTimes(time)
        console.log(time)
    }

    const selectRandomProvider = () => {
        return providers[Math.floor(Math.random() * providers.length)];
    };

    const HandleSelectedRandomProvider = () => {
        if (!selectedProvider) {
            const randomProvider = selectRandomProvider();
            setSelectedProvider(randomProvider);
            console.log(randomProvider); // Log do provedor selecionado aleatoriamente
        } else {
            console.log(selectedProvider); // Log do provedor já selecionado
        }

        setCurrentStep(prevStep => Math.min(prevStep + 1, 4));
    }


    const handleProceed = () => {
        console.log(selectedService)
        console.log(selectedDates)
        console.log(selectedTimes)
        
        setCurrentStep(prevStep => Math.min(prevStep + 1, 4));
    };

    const handleStepClick = (index) => {
        if (index < currentStep) {

            if ( index < 2 ) {
                setSelectedTimes(null)
            }

            if ( index < 2 ) {
                setSelectedProvider(null)
                setSelectedEnderecoCliente(null)
            }

            if ( index < 1 ) {
                setSelectedDates([])
                setSelectedProvider(null)
            }

            setCurrentStep(index);
            setShowCalendar(index === 1);
        } 
        
    };

    const handleDaysChange = (days) => {
        setNumberOfDays(days); // Atualiza o número de dias selecionados
    };

    const HandleDeleteEndereco = async (enderecoId) => {
        try {
            // Realiza a exclusão do endereço na API
            const DeleteEndereco = await deleteEnderecosCliente(enderecoId);
    
            // Atualiza a lista de endereços removendo o endereço excluído
            setEnderecosCliente(prevEnderecos => prevEnderecos.filter(endereco => endereco.id !== enderecoId));
            setSelectedEnderecoCliente(null)
            
            console.log(`Endereço ${enderecoId} excluído com sucesso!`);
        } catch (error) {
            console.error("Erro ao excluir o endereço: ", error);
        }
    };
    
    //função que recebe as informações de data e serviço, para retorna os prestadores disponveis 
    const handleConfirmSelection = async () => {
        console.log('Datas selecionadas:', selectedDates);
        try {
            if (selectedDates.length > 0) {
                const formattedDate = selectedDates[0].toISOString().split('T')[0]; // Formata a data para YYYY-MM-DD
    
                const response = await getDisponiveis(formattedDate, selectedService);
                console.log("Resposta da API:", response.data);
                
                // Inicialmente, define os providers sem as URLs de avatar
                setProviders(response.data);
    
                if (response.data.length > 0) {
                    // Loop para buscar as URLs de avatar de cada prestador e atualizar o estado
                    const updatedProviders = await Promise.all(
                        response.data.map(async (provider) => {
                            const avatar = await getUserProfile(provider.cpfCnpj); // Obtenha a URL do avatar
                            return { ...provider, avatar }; // Retorna o objeto provider com o avatar incluído
                        })
                    );
    
                    setProviders(updatedProviders); // Atualiza o estado com os providers incluindo seus avatares

                    console.log(updatedProviders);

                } else {
                    console.error('Nenhum prestador disponível encontrado');
                }
                
                setCurrentStep(currentStep + 1);
                setShowCalendar(false);

            } else {
                console.error('Nenhuma data selecionada');
            }
        } catch (error) {
            console.error('Erro ao buscar prestadores disponíveis:', error);
        }
    };

    const [searchQuery, setSearchQuery] = useState('');

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

    const formatarCep = (cep) => {
        return cep?.replace(/^(\d{5})(\d{3})$/, "$1-$2");
    };

    console.log(serviceValue)

    const sumValueService = (serviceValue * selectedDates.length)
    console.log(sumValueService)

    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        }).format(valor);
    }

    const HandleTimesForDate = () => {
        selectedDates.forEach((date) => {
            const formateDate = new Date(date).toDateString()
            const times = selectedTimes[formateDate]

            console.log(times)
        })
    }

    
    const HandleNavigateCheckout = async () => {
        const FormDate = new Date(selectedDates[0]).toDateString(); // Converte a data para o formato legivel
        const times = selectedTimes[FormDate]; // Acessa o valor correspondente no objeto
        console.log(times)
        console.log(observacao)

    
        const data = {
            userId: selectedProvider.id,
            clienteId: clienteId,
            dataServico: new Date(selectedDates[0]).toDateString(),
            Servico: selectedService,
            horaServico: times,
            valorServico: sumValueService, // falta ajustar para pegar o valor do serviço
            observacao: observacao //ajustar para pegar a observação do cliente
        };

        await setAgendamentoData(data)
        navigate("/checkout-pagamento")
    }

    console.log("Dados enviados para checkout:",agendamentoData)

    return (
        <>

            <HeaderWebApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess}/>

            <main className="relative p-4 flex lg:justify-between lg:pl-20 lg:pr-20 justify-center gap-5">
                <div className='flex  flex-col items-center text-center min-w-[50vh] max-w-[50vh] lg:min-w-[120vh] lg:max-w-[120vh] md:min-w-[80vh] md:max-w-[80vh] sm:min-w-[80vh] sm:max-w-[80vh] shadow-lg pt-0 p-4 rounded-xl min-h-[80vh]'>

                    <ProgressBar currentStep={currentStep} onStepClick={handleStepClick} />

                    {currentStep == 0 && (
                        <>
                            <ServiceSelection 
                                onProceed={handleProceed} 
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
                                isLoading ? (
                                    <Spinner color='primary'/>
                                ) : (
                                    enderecoDefaultCliente ? ( 
                                        <div>
                                            <div className='grid lg:grid-cols-2
                                            md:grid-cols-2
                                            sm:grid-cols-2
                                            pt-5 gap-10 overflow-auto max-h-[100vh] '>
                                                <div className={`border border-bord rounded-lg lg:min-h-[46vh] lg:max-h-[46vh] lg:max-w-[46vh] lg:min-w-[46vh] min-h-[35vh] max-h-[35vh] min-w-[38vh] max-w-[38vh]
                                                
                                                
                                                ${selectedEnderecoCliente && selectedEnderecoCliente.id === enderecoDefaultCliente[0].id ? 'border-sec ' : 'hover:border-sec border-bord' }
                                                `}
                                                
                                                onClick={() => {
                                                    setSelectedEnderecoCliente(enderecoDefaultCliente[0])
                                                    console.log(enderecoDefaultCliente[0].id)
                                                }}
                                                
                                                
                                                >
                                                    <div className={`border-b border-bord p-3 ${selectedEnderecoCliente && selectedEnderecoCliente.id === enderecoDefaultCliente[0].id ? "border-sec" : "border-bord"}`}>
                                                        <h1 className={` font-semibold ${selectedEnderecoCliente && selectedEnderecoCliente.id === enderecoDefaultCliente[0].id ? "text-sec" : "text-prim"} `}>{selectedEnderecoCliente && selectedEnderecoCliente.id === enderecoDefaultCliente[0].id ? "Serviço será feito aqui" : "Selecionar endereço"}</h1>
                                                    </div>
                                                    <div className='p-5 text-start flex flex-col text-prim'>
                                                        <h2 className='text-prim font-semibold pb-2'>Endereço principal</h2>
                                                        <p>{enderecoDefaultCliente[0]?.logradouro}, {enderecoDefaultCliente[0]?.numero}</p> 
                                                        <p>{enderecoDefaultCliente[0]?.complemento}</p> 
                                                        <p>{enderecoDefaultCliente[0]?.bairro}</p> 
                                                        <p>{enderecoDefaultCliente[0]?.cidade}, {enderecoDefaultCliente[0]?.estado} - {formatarCep(enderecoDefaultCliente[0]?.cep)} </p> 
                                                    </div>
                                                </div>

                                                {enderecosCliente.map((endereco) => (
                                                    <div key={endereco.id} className={`border border-bord rounded-lg lg:min-h-[46vh] lg:max-h-[46vh] lg:max-w-[46vh] lg:min-w-[46vh] min-h-[35vh] max-h-[35vh] min-w-[38vh] max-w-[38vh]

                                                    ${selectedEnderecoCliente && selectedEnderecoCliente.id === endereco.id ? 'border-sec' : 'hover:border-sec border-bord' }
                                                    `}

                                                    onClick={() => {
                                                        setSelectedEnderecoCliente(endereco)
                                                        console.log(endereco.id)
                                                    }}


                                                    >
                                                        <div className={`border-b border-bord p-3 ${selectedEnderecoCliente && selectedEnderecoCliente.id === endereco.id ? "border-sec" : "border-bord"}`}>

                                                            <h1 className={` font-semibold ${selectedEnderecoCliente && selectedEnderecoCliente.id === endereco.id ? "text-sec" : "text-prim"} `}>{selectedEnderecoCliente && selectedEnderecoCliente.id === endereco.id ? "Serviço será feito aqui" : "Selecionar endereço"}</h1>
                                                        </div>
                                                        <div className='p-5 text-start flex flex-col text-prim'>
                                                            <h2 className='text-prim font-semibold pb-2'>{endereco?.localServico}</h2>
                                                            <p>{endereco?.logradouro}, {endereco?.numero}</p> 
                                                            <p>{endereco?.complemento}</p> 
                                                            <p>{endereco?.bairro}</p> 
                                                            <p>{endereco?.cidade}, {endereco?.estado} - {formatarCep(endereco?.cep)} </p> 
                                                            <div className='text-start pt-2'>
                                                                <button
                                                                onClick={() => (HandleDeleteEndereco(endereco.id))}
                                                                >
                                                                    <DeleteIcon style={{ fontSize: 24, color: 'red' }} /> 
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className='p-5 border border-bord border-opacity-50  lg:min-h-[46vh] lg:max-h-[46vh] lg:max-w-[46vh] lg:min-w-[46vh] min-h-[35vh] max-h-[35vh] min-w-[38vh] max-w-[38vh]
                                                
                                                flex items-center justify-center'>
                                                    <button 
                                                    className='p-2 bg-des rounded-md text-white text-sm'
                                                    onClick={() => setOpenCreateAdress(true)}
                                                    >Cadastrar novo endereço</button>
                                                </div>

                                                <Dialog open={openCreateAdress} onClose={() => setOpenCreateAdress(false)} className="relative z-10">
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
                                                                                Cadastrar novo endereço
                                                                            </DialogTitle>
                                                                        </div>
                                                                        
                                                                        <form className="pt-0 flex flex-col gap-5 w-full bg-pri " 
                                                                        onSubmit={handleSubmit(onSubmit)}
                                                                        >
                                                                            <div className='overflow-auto h-[65vh] lg:h-[55vh]'>
                                                                                    <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                                                                        <label htmlFor="localServico" className="text-prim">Local do serviço</label>
                                                                                        <input 
                                                                                        className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
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
                                                                                        className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
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
                                                                                        className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
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
                                                                                        className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
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
                                                                                        className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
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
                                                                                        className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
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
                                                                                        className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
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
                                                                                    className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
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
                                                                                    className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
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

                                                                            <div className=" px-4 py-3 sm:flex sm:px-6 flex justify-end gap-3 ">
                                                                                <button
                                                                                    data-autofocus
                                                                                    onClick={() => setOpenCreateAdress(false)}
                                                                                    className="inline-flex  justify-center rounded-md bg-white p-2 text-sm text-prim shadow-sm border sm:mt-0 sm:w-auto border-bord "
                                                                                >
                                                                                    Fechar
                                                                                </button>
                                                                                <button
                                                                                    type="submit"
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

                                                                                    
                                                                                >
                                                                                    Cadastrar
                                                                                </button>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </DialogPanel>
                                                        </div>
                                                    </div>
                                                </Dialog>
                                            </div>
                                            {selectedEnderecoCliente && (
                                                <div className='flex justify-center pt-5 border-b border-bord'>
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
                                                        gap-2
                                                        w-full
                                                        "
                                                        onClick={handleProceed}
                                                    >
                                                        Selecionar e prosseguir
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        
                                    ) : (
                                        <>
                                            <h1>Não foi possivel carregar os endereços, tente novamente.</h1>
                                        </>
                                    )

                
                                    
                                )
                            ) : (
                                <StepLoginCustomer />
                            )}
                            
                        </>                 
                    )}

                    {currentStep == 3 && (
                        <>
                            <div className='pt-5'>
                                {providers.length === 0 ? (
                                    <div className='h-[40vh] flex justify-center items-center'>
                                        <h1 className='text-desSec'>Não há prestadores disponíveis nessa data ou serviço :/</h1>
                                    </div>
                                ) : (
                                    <div className='flex flex-col gap-2'>
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
                                        <div className={`grid ${filteredProviders.length > 0 ? "lg:grid-cols-3 grid-cols-2" : "grid-none"} items-center pt-3 gap-5`}>
                                        {filteredProviders.length > 0 ? (
                                            filteredProviders.map((provider) => (
                                                <>
                                            
                                                    <div key={provider.id} className='flex flex-col gap-3 '>
                                                        <div 
                                                        
                                                        className={`flex gap-3 p-2 items-center cursor-pointer transition-all duration-200
                                                        border rounded-lg 
                                                        ${selectedProvider && selectedProvider.id === provider.id ? ' border-sec' : 'hover:border-sec border-trans'}`}
                                                        
                                                        onClick={() => {
                                                            setSelectedProvider(provider); // Armazena o provider selecionado
                                                            console.log(provider.id);
                                                        }}

                                                        >
                                                            <div>
                                                                <Avatar 
                                                                src={provider.avatar.avatarUrl}
                                                                size="lg"
                                                                />
                                                            </div>
                                                            <div className='flex justify-start flex-col w-full'>
                                                                <p className='
                                                                text-prim
                                                                text-start
                                                                '>{provider.name}</p>
                                                                <button className='p-1 rounded-md w-full max-w-full text-center
                                                                text-sec 
                                                                border-sec
                                                                border
                                                                hover:text-white transition-all hover:bg-sec hover:bg-opacity-75
                                                                hover:border-trans
                                                                flex 
                                                                items-center
                                                                justify-center
                                                                gap-2
                                                                '

                                                                onClick={() => {
                                                                    setSelectedProvider(provider); // Armazena o provider selecionado
                                                                    setOpen(true); // Abre o modal
                                                                }}                                                            
                                                                
                                                                >
                                                                    <i className="fa-solid fa-star" ></i>
                                                                    Perfil
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
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
                                                                                {selectedProvider && ( // Renderiza as informações do provider selecionado
                                                                                    <div className="pt-0 flex flex-col gap-5 w-full bg-pri">
                                                                                        <div className='flex flex-col gap-2 justify-start'>
                                                                                            <div className="flex items-center space-x-10 lg:pl-10 pl-5 p-20 pb-5 bg-desSec  ">
                                                                                                {/* Container do Avatar */}
                                                                                                <div className="absolute">
                                                                                                    <Avatar src={selectedProvider.avatar.avatarUrl} size="lg"    
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
                                                                                                <h1 className='text-prim font-semibold text-xl'>{selectedProvider.name}</h1>
                                                                                                <p className='text-prim text-[0.8rem]'>
                                                                                                    {calcularIdade(selectedProvider.data)} anos
                                                                                                </p>
                                                                                                <p className='text-[0.8rem] text-prim pb-2'>{selectedProvider.genero}</p>
                                                                                                <div className='overflow-y-auto h-[18vh]'>
                                                                                                    <p className='text-prim text-start pt-4'>{selectedProvider.sobre}</p>
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
                                                                                onClick={() => setOpen(false)}
                                                                                className="inline-flex  justify-center rounded-md bg-white p-2 text-sm text-prim shadow-sm border sm:mt-0 sm:w-auto border-bord "
                                                                            >
                                                                                Fechar
                                                                            </button>
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

                                                                                onClick={handleProceed}
                                                                                
                                                                            >
                                                                                Selecionar e prosseguir
                                                                            </button>
                                                                        </div>
                                                                    </DialogPanel>
                                                                </div>
                                                            </div>
                                                        </Dialog>
                                                    </div>
                                                </>                                                
                                            ))
                                        ) : (
                                            <>
                                                <p className="text-prim">Nenhum prestador encontrado.</p>
                                            </>
                                        )}
                                        </div>
                                        <div className='flex justify-center pt-5 border-b border-bord'>
                                            {selectedProvider ? (
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
                                                    gap-2
                                                    w-full
                                                    "
                                                    onClick={handleProceed}
                                                    
                                                >
                                                    Selecionar e prosseguir
                                                </button>
                                            ) : ( 
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
                                                    gap-2
                                                    w-full
                                                    "
                                                    onClick={HandleSelectedRandomProvider}
                                                    
                                                >
                                                    Selecione por mim e prosseguir
                                                </button>
                                                
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {currentStep == 4 && (
                        <>
                            <div className='w-full flex flex-col gap-5 p-10 pl-20 pr-20 pt-5 shadow-md rounded-md pb-0'>
                                <div className='w-full flex flex-col gap-3'>
                                    <h2 className='text-desSec font-semibold text-xl'>Observação</h2>
                                    <textarea
                                    placeholder="Se necessário, deixe-nos uma observação"
                                    className="border rounded-md border-bord p-3 min-h-20 lg:min-h-50 focus:outline-ter text-prim w-full max-h-1"
                                    rows="3"
                                    value={observacao}  // Valor vinculado ao estado
                                    onChange={(e) => setObservacao(e.target.value)}  // Atualiza o estado quando o valor mudar
                                    ></textarea>
                                </div>
                                <div className='w-full flex flex-col gap-3'>
                                    <h2 className='text-desSec font-semibold text-xl'>Cupom de desconto</h2>
                                    <div className='flex gap-5'>
                                        <input  className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter w-full" placeholder='Digite o cupom' />
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
                                        w-4/12
                                        "
                                        >
                                            Utilizar
                                        </button>
                                    </div>
                                </div>
                                <div className='w-full flex flex-col gap-5 pt-5 pb-5'>
                                    <button 
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
                                    onClick={HandleNavigateCheckout}

                                    >
                                        Conferir e solicitar serviço
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                    
                </div>
                {/* Cartão azul - Visível somente em telas grandes (desktop) */}
                {currentStep > 0 &&(
                    <div className="hidden lg:block pt-[4vh] w-5/12 ">
                        <div className="bg-desSec text-white shadow-md rounded-t-none rounded-lg pb-10  flex flex-col items-center gap-7">
                            <div className='w-full flex justify-between items-center border-b p-12 pb-2 pt-16 pl-7 pr-7'>
                                <h3 className="text-xl flex flex-wrap ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 font-semibold">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>

                                    Resumo
                                    
                                </h3>
                                <p className='text-lg ' >{sumValueService ? formatarMoeda(sumValueService) : "R$ 0,00"}</p>

                            </div>
                                <div className='flex flex-col gap-7 w-full pl-7 pr-7'>
                                    {selectedService?(
                                        <div className='w-full flex flex-col  gap-2 justify-between'>
                                            <p className='text-lg font-semibold'>Serviço selecionado:</p>
                                            <p className='text-base'>{selectedService}</p>
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

                                    {/* Exibe o prestador selecionado*/}
                                    {selectedProvider?(
                                        <div className='w-full flex flex-col  gap-2'>
                                            <p className='text-md font-semibold'> Prestador selecionado:</p>
                                            <div className='flex w-full items-center gap-2'>
                                                <Avatar src={selectedProvider.avatar?.avatarUrl} size="md"/>
                                                <p className='text-base'>{selectedProvider.name}</p>
                                                {/*Mostra o avatar do prestador */}
                                            </div>
                                        </div>
                                    ):(
                                        <div className='w-full flex flex-col  gap-2'>
                                            <p className='text-lg font-semibold'>Prestador selecionado</p>
                                            <p className='text-base'>Nenhum prestador selecionado.</p>
                                        </div>
                                    )}

                                    {observacao?(
                                        <div className='w-full flex flex-col  gap-2'>
                                            <p className='text-md font-semibold'> Observação:</p>
                                            <div className='flex w-full items-center gap-2'>
                                                <p className='text-base'>{observacao}</p>
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
                    )}
                    {currentStep == 0 &&(<div className="hidden lg:block pt-[9vh] w-4/12">
                        <div className="bg-desSec text-white shadow-md rounded-t-none rounded-lg p-12 flex flex-col items-center gap-10">
                            <h3 className="text-xl font-bold flex flex-wrap">Olá, agende um serviço conosco é fácil e rápido!</h3>
                            <img
                            src={Banner}
                            alt="Ilustração de limpeza"
                            className="w-full mb-4"
                            />
                            <ul className="text-sm">
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
                      
            </main>

            <Footer/>

            
        </>
    );
}

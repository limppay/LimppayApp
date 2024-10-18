import React, { useState } from 'react';
import {Logo, Footer } from '../../componentes/imports';
import ServiceSelection from '../../componentes/App/ServiceSelection';
import CustomCalendar from '../../componentes/App/DatePicker';
import ProgressBar from '../../componentes/App/ProgressBar';
import { getDisponiveis, getUserProfile } from '../../services/api';
import {Avatar} from "@nextui-org/react";
'use client'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import Banner from "../../assets/img/App/limpando.png"
import HeaderWebApp from '../../componentes/App/HeaderWebApp';

export default function ContrateOnline() {
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

    const [showCalendar, setShowCalendar] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [numberOfDays, setNumberOfDays] = useState(0); // Número de dias que o usuário selecionou

    const [selectedService, setSelectedService] = useState(''); // Estado para armazenar o serviço selecionado
    const [selectedDates, setSelectedDates] = useState([]); // Estado para armazenar a data selecionada
    const [selectedTimes, setSelectedTimes] = useState([]); // Estado para armazenar os horários selecionados
    const [selectedProvider, setSelectedProvider] = useState(null) // Estado para armazenar as informações do prestador selecionado
    
    const [providers, setProviders] = useState([])
    const [open, setOpen] = useState(false)

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


    const handleProceed = () => {
        console.log(selectedService)
        console.log(selectedDates)
        console.log(selectedTimes)
        
        if (!selectedProvider) {
            const randomProvider = selectRandomProvider();
            setSelectedProvider(randomProvider);
            console.log(randomProvider); // Log do provedor selecionado aleatoriamente
        } else {
            console.log(selectedProvider); // Log do provedor já selecionado
        }

        setCurrentStep(prevStep => Math.min(prevStep + 1, 4));
    };

    const handleStepClick = (index) => {
        if (index < currentStep) {

            if ( index < 2) {
                setSelectedProvider(null)
            }

            if ( index < 1 ) {
                setSelectedDates([])
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
    

    return (
        <>

            <HeaderWebApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess}/>

            <main className="relative p-4 flex items-baseline lg:justify-between lg:pl-20 lg:pr-20 justify-center gap-5">
                <div className='flex justify-center flex-col items-center text-center lg:w-8/12 md:w-8/12 shadow-lg pt-0 p-4 rounded-md'>

                    <ProgressBar currentStep={currentStep} onStepClick={handleStepClick} />

                    {currentStep == 0 && (
                        <>
                            <ServiceSelection 
                                onProceed={handleProceed} 
                                onDaysChange={handleDaysChange} // Passa a função de atualizar os dias
                                onServiceChange={handleServiceChange} // Passa a função de atualizar o serviço
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
                                                    onClick={handleProceed}
                                                    
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

                    {currentStep == 3 && (
                        <>
                            <h1>teste</h1>
                        </>
                    )}

                </div>
                {/* Cartão azul - Visível somente em telas grandes (desktop) */}
                    <div className="hidden lg:block pt-42 w-4/12">
                        <div className="bg-desSec text-white shadow-md rounded-lg p-12 flex flex-col items-center gap-10">
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
            </main>

            <Footer/>

            
        </>
    );
}

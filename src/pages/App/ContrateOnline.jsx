import React, { useEffect, useState } from 'react';
import { createCheckout, getDisponiveis } from '../../services/api';
import { Spinner} from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import {Logo, Footer } from '../../componentes/imports';
import ServiceSelection from '../../componentes/App/ServiceSelection';
import CustomCalendar from '../../componentes/App/DatePicker';
import ProgressBar from '../../componentes/App/ProgressBar';
import HeaderWebApp from '../../componentes/App/HeaderWebApp';
import StepLoginCustomer from './StepLoginCustomer';

import { useUser } from '../../context/UserProvider';
import { useAgendamentoData } from '../../context/AgendamentoData';
import { useSelectedProvider } from '../../context/SelectedProvider';
import { useSelectedDates } from '../../context/SelectedDates';
import { useSelectedTimes } from '../../context/SelectedTimes';

import CookieBanner from '../../componentes/App/CookieBanner';
import WhatsappButton from '../../componentes/WhatsAppContact';
import { Helmet } from 'react-helmet-async';

import { useCheckout } from '../../context/CheckoutData';
import CheckoutNotification from './CheckoutNotification';
import AdressCliente from '../../componentes/App/AdressCliente';
import Prestadores from '../../componentes/App/Prestadores';
import FinallyStep from '../../componentes/App/FinallyStep';
import BarMolie from '../../componentes/App/BarMolie';
import BarDesktop from '../../componentes/App/BarDesktop';
import BannerApp from '../../componentes/App/BannerApp';
import BlockClient from '../../componentes/App/BlockClient';
import Welcome from '../../componentes/App/Welcome';

export default function ContrateOnline() {
    const { checkoutData, setCheckoutData } = useCheckout()
    const { setAgendamentoData } = useAgendamentoData()
    const { setSelectedProvider } = useSelectedProvider()
    const { selectedDates, setSelectedDates } = useSelectedDates([])
    const { user, setUser, loadingUser } = useUser();
    const navigate = useNavigate();
    
    const [provider, setProvider] = useState('')
    const [providerId, setProviderId] = useState("")
    
    const [observacao, setObservacao ] = useState('')
    const [cidade, setCidade] = useState("")
    const [estado, setEstado] = useState("")
    const [providers, setProviders] = useState([])
    const [finding, setFinding] = useState(false)

    const [currentStep, setCurrentStep] = useState(0);
    const [showCalendar, setShowCalendar] = useState(false);
    const [numberOfDays, setNumberOfDays] = useState(0); // Número de dias que o usuário selecionou

    const [selectedService, setSelectedService] = useState(''); // Estado para armazenar o serviço selecionado
    const [servicoId, setServicoId] = useState("")
    const [serviceValue, setServiceValue] = useState() // Estado para armazenar o valor do serviço
    
    const {selectedTimes, setSelectedTimes} = useSelectedTimes([])

    const [enderecoDefaultCliente, SetEnderecoDefaultCliente] = useState([])    
    const [selectedEnderecoCliente, setSelectedEnderecoCliente] = useState(null)
    
    const [sumValueService, setSumValueService] = useState(serviceValue * selectedDates.length)

    const [valorCupom, setValorCupom] = useState('')
    const [descontoTotal, setDescontoTotal] = useState(0)
    const [valorLiquido, setValorLiquido]  = useState(0)

    const [loadingCheckout, setLoadingCheckout] = useState(false)
    const [ timeTotal, setTimeTotal ] = useState(0)

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
    
    // Atualiza dinamicamente o valor total ao selecionar novas datas ou alterar o valor do serviço
    useEffect(() => {
        const total = serviceValue * selectedDates.length;

        setSumValueService(total);
    }, [serviceValue, selectedDates]);

    useEffect(() => {
        setValorLiquido(sumValueService)

    }, [sumValueService])


    useEffect(() => {
        setValorLiquido(sumValueService - Number(descontoTotal))

    }, [descontoTotal])


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

    console.log("Endereço selecionado:", selectedEnderecoCliente)

    const HandleNavigateCheckout = async () => {
        setLoadingCheckout(true)
        const codeComb = gerarIDGrupo()

        // Cria um array com os dados de todos os agendamentos
        const agendamentos = selectedDates.map((date) => {
            
            const FormDate = new Date(date).toDateString(); // Formata a data
            const times = selectedTimes[FormDate]; // Obtém o horário correspondente
    
            return {
                userId: provider?.id,
                clienteId: user?.id,
                servicoId: servicoId,
                dataServico: FormDate,
                Servico: selectedService,
                horaServico: times,
                timeTotal: timeTotal,

                valorServico: serviceValue,
                valorBruto: sumValueService,

                valorCupom: valorCupom,
                descontoTotal: Number(descontoTotal),

                valorLiquido: valorLiquido || sumValueService,

                observacao: observacao,
                  
                enderecoId: selectedEnderecoCliente.id, 
                
                ...(
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
    
    if(user && !user?.ativa) {
        return (
            <BlockClient/>
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
                    <div className='flex flex-col items-center text-center min-w-[30vh] max-w-[50vh] sm:max-w-[80vh] sm:min-w-[80vh] lg:min-w-[100vh] lg:max-w-[100vh] xl:min-w-[120vh] xl:max-w-[100vh] 2xl:min-w-[110vh] 2xl:max-w-[130vh]'>
                        <ProgressBar currentStep={currentStep} onStepClick={handleStepClick} />

                        {currentStep == 0 && (
                            <ServiceSelection 
                                onProceed={handleConfirmSelection} 
                                onDaysChange={handleDaysChange} // Passa a função de atualizar os dias
                                onServiceChange={handleServiceChange} // Passa a função de atualizar o serviço
                                setServiceValue={setServiceValue}
                                setTimeTotal={setTimeTotal}
                            />
                        )}

                        {currentStep == 1 && (
                            <CustomCalendar 
                                onConfirmSelection={handleConfirmSelection}
                                selectedDates={selectedDates}
                                setSelectedDates={setSelectedDates}
                                maxSelection={numberOfDays} // Defina aqui o número máximo de seleções permitidas
                                selectedTimes={selectedTimes}
                                setSelectedTimes={handleTimeChange}
                                timeTotal={timeTotal}
                            />
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
                            <Prestadores
                                HandleSelectedRandomProvider={HandleSelectedRandomProvider}
                                handleConfirmSelection={handleConfirmSelection}
                                providers={providers}
                                provider={provider}
                                setProvider={setProvider}
                                providerId={providerId}
                                setProviderId={setProviderId}
                            
                            />
                           
                        )}

                        {currentStep == 4 && (
                            <FinallyStep
                                HandleNavigateCheckout={HandleNavigateCheckout}
                                descontoTotal={descontoTotal}
                                loadingCheckout={loadingCheckout}
                                setDescontoTotal={setDescontoTotal}
                                setValorLiquido={setValorLiquido}
                                sumValueService={sumValueService}
                                observacao={observacao}
                                setObservacao={setObservacao}
                                setValorCupom={setValorCupom}
                            />
                        )}
                        
                    </div>

                    {currentStep == 0 &&(
                        <BannerApp/>
                    )}

                    {/* resumo do pedido para desktop */}
                    {currentStep > 0 && (
                        <BarDesktop
                            descontoTotal={descontoTotal}
                            observacao={observacao}
                            provider={provider}
                            selectedDates={selectedDates}
                            selectedService={selectedService}
                            selectedTimes={selectedTimes}
                            serviceValue={serviceValue}
                            sumValueService={sumValueService}
                            valorLiquido={valorLiquido}
                        />
                    )}
                        
                    {/* resumo do pedido para mobile */}
                    <BarMolie
                        currentStep={currentStep}
                        descontoTotal={descontoTotal}
                        observacao={observacao}
                        provider={provider}
                        selectedDates={selectedDates}
                        selectedService={selectedService}
                        selectedTimes={selectedTimes}
                        serviceValue={serviceValue}
                        sumValueService={sumValueService}
                        valorLiquido={valorLiquido}
                    />

                    <WhatsappButton/>
                </main>
                
            )}

            {/* banner para aceitar os cookies */}
            {currentStep == 0 && (
                <CheckoutNotification/>
                
            )} 
            <Welcome/>
            <CookieBanner/>

        </>
    );
    
}

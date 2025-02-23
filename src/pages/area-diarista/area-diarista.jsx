import React, { useEffect, useState } from 'react';
import { HeaderApp, Logo,  ModalQuemSomos, ModalDuvidas} from '../../componentes/imports.jsx'
import { Avatar, Button, Spinner } from '@nextui-org/react';
import { useScreenSelected } from '../../context/ScreenSelect.jsx';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { usePrestador } from '../../context/PrestadorProvider.jsx';
import StepOne from '../../componentes/Prestador/StepOne.jsx';
import StepTwo from '../../componentes/Prestador/StepTwo.jsx';
import Painel from '../../componentes/Prestador/Painel.jsx';
import Profile from '../../componentes/Prestador/Profile.jsx';
import Pedidos from '../../componentes/Prestador/Pedidos.jsx';
import Avaliacoes from '../../componentes/Prestador/Avaliacoes.jsx';
import DatasBloqueadas from '../../componentes/Prestador/DatasBloqueadas.jsx';
import Servicos from '../../componentes/Prestador/Servicos.jsx';
import Navigation from '../../componentes/Prestador/Navigation.jsx';
import axios from 'axios';
import Reenviar from '../../componentes/Prestador/Reenviar.jsx';

const AreaDiarista = () => {
    const { prestador, setPrestador, loadingUser } = usePrestador()
    const navigate = useNavigate()
    const [OpenWho, SetOpenWho] = useState(false)
    const [OpenDuvidas, SetOpenDuvidas] = useState(false)
    const [cadastroCompleto, setCadastroCompleto] = useState()
    const [entrevistaAprovada, setEntrevistaAprovada] = useState()
    const [etapaCadastro, setEtapaCadastro] = useState()
    const [isOpen, setIsOpen] = useState(true)
    const {screenSelected, setScreenSelected} = useScreenSelected()

    const buttons = [
        {
            link: "#", 
            text: "Dúvidas", 
            OnClick: () => SetOpenDuvidas(true)
        },
        {
            link: "#", 
            text: "Quem Somos", 
            Id: "OpenQuemSomos",
            OnClick: () => SetOpenWho(true)
        },
    ]

    const btnAcess = [
        {
            AcessPrim: "Suporte", 
            AcessSec: "Sair", 
            LinkPrim: "/",
            LinkSec: "/",
        }
    ]

    useEffect(() => {
        const cadastro = prestador?.cadastroCompleto
        const entrevista = prestador?.Entrevista
        const etapa = prestador?.etapaCadastro

        setCadastroCompleto(cadastro)
        setEntrevistaAprovada(entrevista)
        setEtapaCadastro(etapa)

    }, [prestador, setPrestador])


    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };


    useEffect(() => {
        if(!loadingUser && !prestador) {
            navigate("/diarista-login")
        }

    }, [prestador, loadingUser])


    const subscribeUserToPush = async () => {
        const registration = await navigator.serviceWorker.ready;

        // Verifica se já existe uma inscrição ativa
        const existingSubscription = await registration.pushManager.getSubscription();

        if (existingSubscription) {
            console.log('Usuário já inscrito', existingSubscription);

            // Convertendo para uma string JSON
            const jsonString = JSON.stringify(existingSubscription)

            // Agora, para pegar as chaves de volta, usamos JSON.parse
            const parsedSubscription = JSON.parse(jsonString)

            // Acessando as chaves
            const p256dh = parsedSubscription.keys.p256dh;
            const auth = parsedSubscription.keys.auth;
            
            const payload = {
                endpoint: existingSubscription.endpoint,
                keys: { p256dh, auth }
            };

            const local = 'http://localhost:3000/push-notifications/subscribe/prestador'
            const prod = `${import.meta.env.VITE_URL_API}/push-notifications/subscribe/prestador`
            
            try {
                // Usando o Axios para enviar a requisição
                const response = await axios.post(prod, payload, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true, // Habilita o envio de cookies, caso necessário
                });
        
                console.log('Inscrição atualizada com sucesso!', response.data);
            } catch (error) {
                console.error('Erro ao atualizar a inscrição:', error.response.data);
            } 

            return
        }
        
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: import.meta.env.VITE_REACT_APP_VAPID_PUBLIC_KEY, // Chave pública VAPID
        });

        // Convertendo para uma string JSON
        const jsonString = JSON.stringify(subscription);
        // Agora, para pegar as chaves de volta, usamos JSON.parse
        const parsedSubscription = JSON.parse(jsonString);

        // Acessando as chaves
        const p256dh = parsedSubscription.keys.p256dh;
        const auth = parsedSubscription.keys.auth;
        
        const payload = {
            endpoint: subscription.endpoint,
            keys: { p256dh, auth }
        };

        const local = 'http://localhost:3000/push-notifications/subscribe/prestador'
        const prod = `${import.meta.env.VITE_URL_API}/push-notifications/subscribe/prestador`
        
        try {
            // Usando o Axios para enviar a requisição
            const response = await axios.post(prod, payload, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true, // Habilita o envio de cookies, caso necessário
            });
    
            console.log('Inscrição enviada com sucesso!', response.data);
        } catch (error) {
            console.error('Erro ao enviar a inscrição:', error);
        }
    };

    const requestNotificationPermission = async () => {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Permissão concedida!');
            subscribeUserToPush();
        } else {
            console.warn('Permissão negada para notificações');
        }
    };

    useEffect(() => {
        requestNotificationPermission()

    }, [prestador])

    
    return (
        <>
            <Helmet>
                <title>Limppay: Area Prestador</title>
            </Helmet>
            <div>
                <HeaderApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess}/>

                <main className='h-screen pt-[8vh] pb-[8vh]  sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] '>
                    {prestador ? (
                        <>
                            <div className='flex'>
                                {etapaCadastro <= 2 && (
                                    <StepOne 
                                        etapaCadastro={etapaCadastro}
                                    />
                                )}

                                {etapaCadastro == 3 && !cadastroCompleto && entrevistaAprovada && (
                                    <StepTwo
                                        old={prestador?.Old}
                                    />
                                )}

                                {prestador?.ReturnFiles &&(
                                    <Reenviar />
                                )}

                            </div>

                            {cadastroCompleto && !prestador?.ReturnFiles ? (
                                <>
                                    <div className='flex flex-col lg:flex-row h-screen'>
                                        {/* menu lateral */}
                                        <div className={`hidden lg:flex flex-col min-h-[15vh]  lg:h-screen bg-neutral-800 shadow-lg transition-all transform overflow-x-auto max-w-[100vh]  ${
                                        isOpen ? " lg:min-w-[30vh] lg:max-w-[30vh] xl:min-w-[35vh] xl:max-w-[35vh] 2xl:min-w-[26vh] 2xl:max-w-[26vh]" : "overflow-hidden w-full lg:min-w-[10vh] lg:max-w-[13vh] xl:min-w-[15vh] xl:max-w-[15vh] 2xl:min-w-[12vh] 2xl:max-w-[12vh] "
                                        }`}>

                                            <div className=" hidden  lg:flex items-center justify-between pt-5 pb-2 p-4 ">
                                                <Avatar
                                                src={prestador?.AvatarUrl.avatarUrl}
                                                className={`${isOpen ? "" : "hidden"} cursor-pointer`}
                                                onClick={() => setScreenSelected("perfil")}
                                                />


                                                <Button className="bg-trans text-desSec justify-end min-w-[1vh]" onPress={() => toggleSidebar()} >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                                                    </svg>
                                                </Button>
                                            </div>

                                            <div className='flex flex-row lg:grid gap-5 pt-5 p-2 '>
                                                {/* tela para o dashboard */}
                                                <div>
                                                    <Button
                                                    className={`w-full justify-start  transition-all ${screenSelected == 'painel' ? "bg-desSec text-white" : "bg-white text-prim"} ${isOpen ? "w-full" : "min-w-[1vh]"} `}
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
                                                    className={`w-full justify-start  transition-all ${screenSelected == 'perfil' ? "bg-desSec text-white" : "bg-white text-prim"}  ${isOpen ? "w-full" : "min-w-[1vh]"}`}
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
                                                    className={`w-full justify-start  transition-all ${screenSelected == 'pedidos' ? "bg-desSec text-white" : "bg-white text-prim"} ${isOpen ? "w-full" : "min-w-[1vh]"}`}
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
                                                    className={`w-full justify-start  transition-all ${screenSelected == 'avaliacoes' ? "bg-desSec text-white" : "bg-white text-prim"} ${isOpen ? "w-full" : "min-w-[1vh]"}`}
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
                                                    className={`w-full justify-start  transition-all ${screenSelected == 'datasBloqueadas' ? "bg-desSec text-white" : "bg-white text-prim"} ${isOpen ? "w-full" : "min-w-[1vh]"}`}
                                                    onPress={() => setScreenSelected("datasBloqueadas")}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                                                        </svg>



                                                        {isOpen ? "Dias disponíveis" : ""}
                                                        
                                                    </Button>
                                                </div>

                                                <div>
                                                    <Button
                                                    className={`w-full justify-start  transition-all ${screenSelected == 'servicos' ? "bg-desSec text-white" : "bg-white text-prim"} ${isOpen ? "w-full" : "min-w-[1vh]"}`}
                                                    onPress={() => setScreenSelected("servicos")}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                                                        </svg>




                                                        {isOpen ? "Serviços" : ""}
                                                        
                                                    </Button>
                                                </div>

                                                

                                            </div>
                                                                             
                                        </div>

                                        <div className='w-full pb-[8vh] '>
                                            {screenSelected === "painel" && (
                                                <Painel/>
                                            )}

                                            {screenSelected == "perfil" && (
                                                <Profile />
                                            )}

                                            {screenSelected == "pedidos" && (
                                                <Pedidos 
                                                    setScreenSelected={setScreenSelected} 
                                                />
                                            )}

                                            {screenSelected == "avaliacoes" && (
                                                <Avaliacoes/>
                                            )}

                                            {screenSelected == "datasBloqueadas" && (
                                                <DatasBloqueadas/>
                                            )}

                                            {screenSelected == "servicos" && (
                                                <Servicos/>
                                            )}
                                        </div>

                                        <Navigation screenSelected={screenSelected} setScreenSelected={setScreenSelected}/>
                                    </div>                       
                                </>

                            ) : (
                                etapaCadastro === 3 && !prestador?.ReturnFiles && (
                                    <>
                                        <StepOne 
                                            etapaCadastro={etapaCadastro}
                                        />
                                    
                                    </>
                                )
                            )}                        
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

                <ModalQuemSomos Open={OpenWho} SetOpen={() => SetOpenWho(!OpenWho)}/>
                <ModalDuvidas OpenDuvidas={OpenDuvidas} SetOpenDuvidas={() => SetOpenDuvidas(!OpenDuvidas)}/>

            </div>
        
        
        </>
    );


};

export default AreaDiarista;

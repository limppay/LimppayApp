import React, { useEffect, useState } from 'react';
import {Logo} from '../../componentes/imports.jsx'
import User from "../../assets/img/diarista-cadastro/user.webp"
import HeaderWebApp from '../../componentes/App/HeaderWebApp.jsx';
import { Avatar, Spinner,  } from '@nextui-org/react';
'use client'
import { Button } from '@nextui-org/react';
import { Helmet } from 'react-helmet-async';
import { useUser } from '../../context/UserProvider';
import { useNavigate } from 'react-router-dom';
import CheckoutNotification from '../App/CheckoutNotification.jsx';
import Painel from '../../componentes/Cliente/Painel.jsx';
import Pedidos from '../../componentes/Cliente/Pedidos.jsx';
import Avaliacoes from '../../componentes/Cliente/Avaliacoes.jsx';
import Enderecos from '../../componentes/Cliente/Enderecos.jsx';
import Profile from '../../componentes/Cliente/Profile.jsx';
import Navigation from '../../componentes/Cliente/Navigations.jsx';

const AreaCliente = () => {
    const { user, loadingUser } = useUser();
    const [screenSelected, setScreenSelected] = useState("painel")
    const [isOpen, setIsOpen] = useState(true)
    const navigate = useNavigate()

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
        
    const buttons = [
        { link: "/", text: "Quem Somos"},
        { link: "/", text: "Dúvidas"},
    ]

    const btnAcess = [

    ]
            
    useEffect(() => {
        if(!loadingUser && !user) {
            navigate("/login-cliente")
        }

    }, [user, loadingUser])

    return (
        <div>
            <Helmet>
                <title>Limppay: Area Cliente</title>
            </Helmet>
            <HeaderWebApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess}/>
            <main className='h-screen w-screen'>

                {user ? (
                    <>
                        <div className='flex flex-col lg:flex-row h-screen'>
                            {/* menu lateral */}
                            <div className={`hidden lg:flex flex-col pt-[7vh] min-h-[15vh]  lg:pt-[10vh] xl:pt-[12vh] lg:h-screen bg-neutral-800 shadow-lg transition-all transform overflow-x-auto max-w-[100vh]  ${
                            isOpen ? " lg:min-w-[30vh] lg:max-w-[30vh] xl:min-w-[35vh] xl:max-w-[35vh] 2xl:min-w-[26vh] 2xl:max-w-[26vh]" : "w-full lg:min-w-[10vh] lg:max-w-[13vh] xl:min-w-[15vh] xl:max-w-[15vh] 2xl:min-w-[12vh] 2xl:max-w-[12vh] "
                            }`}>
                                

                                <div className="hidden lg:flex items-center justify-between pt-5 pb-2 p-4 ">
                                    <Avatar
                                    src={user?.AvatarUrl.avatarUrl || User}
                                    className={`${isOpen ? "" : "hidden"} cursor-pointer`}
                                    onClick={() => setScreenSelected("perfil")}
                                    />


                                    <Button className="bg-white text-desSec min-w-[1vh] justify-end" onPress={()=> toggleSidebar()} >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                                        </svg>
                                    </Button>
                                </div>
                                
                                <div className='flex flex-row lg:grid gap-5 pt-5 p-2 '>
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
                                        className={`w-full justify-start  transition-all ${screenSelected == 'pedidos' ? "bg-desSec text-white" : "bg-white text-prim"} ${isOpen ? "w-full" : "min-w-[1vh]"} `}
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
                                        className={`w-full justify-start  transition-all ${screenSelected == 'avaliacoes' ? "bg-desSec text-white" : "bg-white text-prim"} ${isOpen ? "w-full" : "min-w-[1vh]"} `}
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
                                        className={`w-full justify-start  transition-all ${screenSelected == 'perfil' ? "bg-desSec text-white" : "bg-white text-prim"} ${isOpen ? "w-full" : "min-w-[1vh]"} `}
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
                                        className={`w-full justify-start  transition-all ${screenSelected == 'enderecos' ? "bg-desSec text-white" : "bg-white text-prim"} ${isOpen ? "w-full" : "min-w-[1vh]"} `}
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
                                <Painel/>
                            )}

                            {screenSelected == "perfil" && (
                                <Profile/>
                            )}

                            {screenSelected == "pedidos" && (
                                <Pedidos/>
                            )}

                            {screenSelected == "avaliacoes" && (
                                <Avaliacoes/>
                            )}

                            {screenSelected == "enderecos" && (
                                <Enderecos/>
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

import React from 'react'
import HeaderWebApp from './HeaderWebApp'
import {Footer, Logo } from '../../componentes/imports';
import WhatsappButton from '../WhatsAppContact';


export default function BlockClient() {
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

    return (
        <>
            <HeaderWebApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess}/>
            <main className="w-full h-screen bg-neutral-900 flex justify-center items-center">
                <div className="flex flex-col justify-center items-center p-10">
                    <div className="text-prim">
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
            <WhatsappButton/>
            <Footer />
            
        
        </>
    )
}

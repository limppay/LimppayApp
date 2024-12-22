import React from 'react';
import { HeaderApp } from '../componentes/imports';
import { Logo } from '../componentes/imports';

const CookiePolicy = () => {

    const buttons = [
        {link: "#quem-somos", text: "Quem somos"},
        {link: "#servicos", text: "Serviços"},
        {link: "#duvidas", text: "Dúvidas"},
        {link: "#", text: "Blog"},
        {link: "#contatos", text: "Contato"},
    ]

    const btnAcess = [
        { AcessPrim: "Seja Diarista", 
            AcessSec: "Contrate Online",
            LinkPrim: "seja-diarista",
            LinkSec: "contrate-online"  
        },
    ]

    return (
        <>
            <HeaderApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess}/>
            <div className="max-w-3xl mx-auto pt-[12vh] p-10 container text-prim">
            <h1 className="text-3xl font-bold text-center mb-6 text-prim">Política de Cookies</h1>

            <p className="text-lg mb-4">
                Esta página descreve como usamos os cookies no nosso site e por que eles são importantes para proporcionar uma experiência de navegação mais personalizada e eficiente.
            </p>

            <h2 className="text-2xl font-semibold mt-4 text-prim">O que são cookies?</h2>
            <p className="text-lg mb-4">
                Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo (computador, smartphone, etc.) quando você acessa sites na internet. Eles ajudam os sites a lembrar de suas preferências e atividades durante ou entre as visitas. 
            </p>

            <h2 className="text-2xl font-semibold mt-4 text-prim">Como usamos cookies?</h2>
            <p className="text-lg mb-4">
                Utilizamos cookies para:
            </p>
            <ul className="list-disc pl-6 mb-4">
                <li>Melhorar sua experiência de navegação e personalizar os conteúdos exibidos.</li>
                <li>Manter você logado durante a navegação (cookies essenciais).</li>
                <li>Coletar dados analíticos para melhorar a performance do site.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-4 text-prim">Tipos de cookies utilizados</h2>
            <p className="text-lg mb-4">
                No nosso site, utilizamos diferentes tipos de cookies:
            </p>
            <ul className="list-disc pl-6 mb-4">
                <li><strong>Cookies essenciais:</strong> Necessários para o funcionamento básico do site, como manter a sessão do usuário.</li>
                <li><strong>Cookies de desempenho:</strong> Coletam dados sobre como os usuários interagem com o site para melhorar sua usabilidade.</li>
                <li><strong>Cookies de funcionalidade:</strong> Usados para lembrar preferências do usuário e personalizar sua experiência.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-4 text-prim">Como gerenciar os cookies?</h2>
            <p className="text-lg mb-4">
                Você pode gerenciar seus cookies diretamente nas configurações do seu navegador. A maioria dos navegadores permite que você bloqueie ou exclua cookies, mas isso pode afetar a funcionalidade de alguns sites.
            </p>

            <h2 className="text-2xl font-semibold mt-4 text-prim">Consentimento</h2>
            <p className="text-lg mb-4">
                Ao continuar a usar nosso site, você concorda com o uso de cookies conforme descrito nesta política. Se você não aceitar o uso de cookies, pode optar por desativá-los nas configurações do seu navegador ou clicar em "Recusar" no banner de cookies.
            </p>

            <p className="text-lg mt-6">
                Para mais informações sobre nossa política de privacidade, acesse nossa <a href="/politica-de-privacidade" className="text-blue-500 underline">Política de Privacidade</a>.
            </p>
            </div>
        
        </>
    );
};

export default CookiePolicy;

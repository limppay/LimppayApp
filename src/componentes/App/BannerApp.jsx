import React from 'react'
import Banner from "../../assets/img/App/limpando.webp"

export default function BannerApp() {
  return (
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
  )
}

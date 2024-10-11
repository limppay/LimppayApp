import React, { useState } from 'react';
import { HeaderApp, Logo, Footer } from '../../componentes/imports';
import ServiceSelection from '../../componentes/App/ServiceSelection';
import CustomCalendar from '../../componentes/App/DatePicker';
import ProgressBar from '../../componentes/App/ProgressBar';

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
    const [selectedDates, setSelectedDates] = useState([]);
    const [numberOfDays, setNumberOfDays] = useState(0); // Número de dias que o usuário selecionou

    const handleProceed = () => {
        setCurrentStep(prevStep => Math.min(prevStep + 1, 4));
        setShowCalendar(true);
    };

    const handleStepClick = (index) => {
        if (index < currentStep) {
            setCurrentStep(index);
            setShowCalendar(index === 1);
        }
    };

    const handleDaysChange = (days) => {
        setNumberOfDays(days); // Atualiza o número de dias selecionados
    };

    const handleConfirmSelection = () => {
        console.log('Datas selecionadas:', selectedDates);
        // Lógica para prosseguir para o próximo passo
        setCurrentStep(currentStep + 1);
        setShowCalendar(false); // Esconder o calendário após a confirmação
    };

    return (
        <>
            <HeaderApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess} text1="Seja Bem-vindo!" text2="Entre ou cadastre-se" />
            <main className="relative p-4 flex items-baseline lg:justify-between lg:pl-20 lg:pr-20 justify-center gap-5">
                <div className='flex justify-center flex-col items-center text-center lg:w-8/12 md:w-8/12 shadow-lg pt-0 p-4 rounded-md'>

                    <ProgressBar currentStep={currentStep} onStepClick={handleStepClick} />

                    {showCalendar ? (
                        <>
                            <CustomCalendar 
                            onConfirmSelection={handleConfirmSelection}
                            selectedDates={selectedDates}
                            setSelectedDates={setSelectedDates}
                            maxSelection={numberOfDays} // Defina aqui o número máximo de seleções permitidas
                            />
                        </>
                    ) : (
                        <ServiceSelection 
                            onProceed={handleProceed} 
                            onDaysChange={handleDaysChange} // Passa a função de atualizar os dias
                        />
                    )}
                </div>
                {/* Cartão azul - Visível somente em telas grandes (desktop) */}
                    <div className="hidden lg:block pt-42 w-4/12">
                        <div className="bg-desSec text-white shadow-md rounded-lg p-12 flex flex-col items-center gap-10">
                            <h3 className="text-xl font-bold flex flex-wrap">Olá, agende um serviço conosco é fácil e rápido!</h3>
                            <img
                            src="../src/assets/img/App/limpando.png"
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

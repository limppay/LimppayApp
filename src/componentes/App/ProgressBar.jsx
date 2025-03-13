// ProgressBar.js
import React from 'react';

const ProgressBar = ({ currentStep, onStepClick }) => {
    const steps = ['', '', '', '', '']; // Os passos não têm nomes

    return (
        <div className="pt-[2vh] sm:pt-24 xl:pt-24  flex items-center justify-center mb-1 gap-5">
            {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center relative">
                    {/* Círculo do passo */}
                    <div
                        onClick={() => onStepClick(index)} // Adiciona a funcionalidade de clique
                        className={`h-4 w-4 rounded-full cursor-pointer transition-colors duration-300 ${index <= currentStep ? 'bg-desSec' : 'bg-prim'}`}
                    />
                    {/* Linha de conexão */}
                    {index < steps.length - 1 && (
                        <div
                            className={`absolute h-1 bg-prim transition-colors duration-300 ${index < currentStep ? 'bg-desSec' : 'bg-prim'}`}
                            style={{
                                left: '50%',
                                top: '0.7rem',
                                width: 'calc(100% - 1rem)',
                                transform: 'translateX(-50%)',
                                zIndex: -1,
                            }}
                        />
                    )}
                    {/* Sem texto para o passo */}
                    <span className={`text-xs ${index <= currentStep ? 'text-desSec' : 'text-prim'} text-center`}></span>
                </div>
            ))}
        </div>
    );
};

export default ProgressBar;

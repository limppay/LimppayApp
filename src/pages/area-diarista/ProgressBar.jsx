import React from 'react';

const ProgressBar = ({ step }) => {

  const steps = [
    { id: 1, label: "Criar conta" },
    { id: 2, label: "Cadastro completo" },
    { id: 3, label: "Entrevista" },
    { id: 4, label: "Conta ativada" },
  ];

  return (
    <div className="flex flex-col items-center w-full pt-5">
      {steps.map((item, index) => (
        <div key={item.id} className="flex items-baseline w-full ">
          {/* Coluna para bolinha e linha */}
          <div className="flex flex-col items-center">
            {/* Marcador */}
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                step >= item.id ? 'border-sec text-sec' : 'border-bord bg-white text-prim'
              }`}
            >
              {item.id}
            </div>

            {/* Linha vertical */}
            {index < steps.length - 1 && (
              <div
                className={`w-1 h-8 lg:h-16 ${
                  step > item.id ? 'bg-sec' : 'bg-prim'
                }`}
              ></div>
            )}
          </div>

          {/* Texto ao lado da bolinha */}
          <span
            className={`ml-4 text-sm ${
              step >= item.id ? 'text-desSec' : 'text-prim'
            }`}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;

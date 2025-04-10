import React from 'react';
import { usePrestador } from '../../context/PrestadorProvider';
import { formatarData } from "../../common/FormatarData"

const ProgressBar = ({ step }) => {
  const { prestador } = usePrestador()

  const steps = [
    { id: 1, label: ` Data de criação ${formatarData(new Date(prestador?.createdAt).toISOString().split('T')[0])}`},
    { id: 2, label:  prestador?.Entrevista ? "Entrevista aprovada" : "Entrevista" },
    { id: 3, label:  prestador?.cadastroCompleto ? "Cadastro completo" : "Completar cadastro" },
    { id: 4, label:  "Ativação da conta" },
  ];

  return (
    <div className="flex flex-col items-center w-full pt-5">
      {steps.map((item, index) => (
        <div key={item.id} className="flex items-baseline w-full h-full ">
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
                className={`w-1 h-[10vh] lg:h-16 ${
                  step > item.id ? 'bg-sec' : 'bg-prim'
                }`}
              ></div>
            )}
          </div>

          {/* Texto ao lado da bolinha */}
          <span
            className={`ml-4 text-sm w-full ${
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

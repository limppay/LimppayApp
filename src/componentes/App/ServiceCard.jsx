import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ServiceCard = ({ icon, title, description, value, isExpanded, onClick, days, setDays, onProceed }) => {
  const incrementDays = () => {
    setDays(days + 1); // Aumentar o número de dias
  };

  const decrementDays = () => {
    if (days > 0) setDays(days - 1); // Diminuir o número de dias, mas manter mínimo de 0
  };

  const handleProceed = (e) => {
    e.stopPropagation(); // Evitar que o clique feche o bloco
    if (days > 0) {
      onProceed(); // Chamar a função de prosseguir passada como prop
    }
  };

  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${isExpanded ? 'border-desSec bg-desSec' : 'border-desSec'}`}
      onClick={onClick} // Chama a função de clique passada como prop
    >
      <div className="flex items-center flex-col gap-3">
        <div className={`text-3xl flex gap-4 w-full ${isExpanded ? 'text-white' : 'text-sec'}`}>
          <i className={icon}></i>
          <h3 className={`text-lg font-semibold ${isExpanded ? 'text-white' : 'text-ter'}`}>{title}</h3>
        </div>

        <div>
          <p className={`text-sm ${isExpanded ? 'text-white text-justify' : 'text-prim text-justify'}`}>{description}</p>
        </div>

      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} // Iniciar com opacidade 0 e altura 0
            animate={{ opacity: 1, height: 'auto' }} // Aumentar opacidade e altura ao expandir
            exit={{ opacity: 0, height: 0 }} // Reduzir opacidade e altura ao fechar
            transition={{ duration: 0.2 }} // Duração da animação
            className="mt-4 overflow-hidden"
          >
            <p className="text-lg font-semibold text-white text-start ">Valor R$ {value},00</p>
            <div className="flex items-center mt-2 justify-between border border-white p-2 rounded-md">
              <span className="text-white">Número de dias</span>
              <div className="bg-white text-prim flex justify-end rounded-lg px-4 py-1">
                <button 
                  className="text-des mr-4"
                  onClick={(e) => { e.stopPropagation(); decrementDays(); }} // Prevenir propagação do clique
                >-</button>
                <span>{days}</span>
                <button 
                  className="text-des ml-4"
                  onClick={(e) => { e.stopPropagation(); incrementDays(); }} // Prevenir propagação do clique
                >+</button>
              </div>
            </div>

            {/* Botão Prosseguir */}
            <div className='flex justify-end  '>
              <button 
                className={`mt-4 bg-des text-white py-2 px-5 rounded-lg hover:bg-sec ${days === 0 ? 'opacity-85 cursor-not-allowed' : ''}`} 
                onClick={handleProceed} // Aciona ao clicar em "Prosseguir"
                disabled={days === 0} // Desativa o botão quando days é 0
              >
                Prosseguir
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceCard;

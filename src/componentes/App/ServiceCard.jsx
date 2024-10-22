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
      onProceed(); // Chamar a função de prosseguir passada como prop
    
  };

  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${isExpanded ? 'border-desSec bg-desSec shadow-lg' : 'border-desSec'}`}
      onClick={onClick} // Chama a função de clique passada como prop
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className={`text-3xl flex gap-4 w-full ${isExpanded ? 'text-white' : 'text-sec'}`}>
          <i className={icon}></i>
          <h3 className={`text-lg font-semibold ${isExpanded ? 'text-white' : 'text-ter'} mb-2`}>{title}</h3>
        </div>
      </div>

      <p className={`text-sm ${isExpanded ? 'text-white' : 'text-prim'} text-justify mb-4`}>
        {description}
      </p>

      <AnimatePresence>
      {isExpanded && (
      <motion.div
        initial={{ opacity: 0, height: 0 }} // Iniciar com opacidade 0 e altura 0
        animate={{ opacity: 1, height: 'auto' }} // Aumentar opacidade e altura ao expandir
        exit={{ opacity: 0, height: 0 }} // Reduzir opacidade e altura ao fechar
        transition={{ duration: 0.2 }} // Duração da animação
        className="mt-4 overflow-hidden"
      >
        <p className="text-lg font-semibold text-white text-start">Valor R$ {value},00</p>

        {/* Botão Prosseguir */}
        <div className='flex justify-end'>
          <button 
            className="mt-4 bg-des text-white py-2 px-5 rounded-lg hover:bg-sec transition-opacity duration-200" 
            onClick={handleProceed} // Aciona ao clicar em "Prosseguir"
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

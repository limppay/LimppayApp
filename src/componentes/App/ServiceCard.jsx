import React from 'react';
import { motion } from 'framer-motion';

const ServiceCard = ({ icon, title, description, value, isExpanded, onClick }) => {
  const [days, setDays] = React.useState(1); // Iniciar com 1 dia

  const incrementDays = () => {
    setDays(days + 1); // Aumentar o número de dias
  };

  const decrementDays = () => {
    if (days > 1) setDays(days - 1); // Diminuir o número de dias, mas manter mínimo de 1
  };

  return (
    <motion.div 
      className={`border rounded-lg p-4 cursor-pointer ${isExpanded ? 'bg-desSec text-white' : 'border-desSec'}`}
      onClick={onClick} // Chama a função de clique passada como prop
      initial={{ scale: 1 }} // Inicializa o cartão em escala normal
      animate={{ scale: isExpanded ? 1.05 : 1 }} // Aumenta a escala se expandido
      transition={{ duration: 0.2 }} // Duração da animação
    >
      <div className="flex items-center">
        <div className={`text-3xl mr-4 ${isExpanded ? 'text-white' : 'text-sec'}`}>
          <i className={icon}></i>
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${isExpanded ? 'text-white' : 'text-ter'}`}>{title}</h3>
          <p className={`text-sm ${isExpanded ? 'text-white' : 'text-prim'}`}>{description}</p>
        </div>
      </div>

      {isExpanded && (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, height: 0 }} // Iniciar com opacidade 0 e altura 0
          animate={{ opacity: 1, height: 'auto' }} // Animar para opacidade 1 e altura automática
          exit={{ opacity: 0, height: 0 }} // Sair com opacidade 0 e altura 0
          transition={{ duration: 0.2 }} // Duração da animação
        >
          <p className="text-lg font-semibold">Valor R$ {value},00</p>
          <div className="flex items-center mt-2">
            <span>Número de dias</span>
            <div className="bg-white text-prim flex ml-2 rounded-lg px-2 py-1">
              <button 
                className="text-des mr-2"
                onClick={(e) => { e.stopPropagation(); decrementDays(); }} // Prevenir propagação do clique
              >-</button>
              <span>{days}</span>
              <button 
                className="text-des ml-2"
                onClick={(e) => { e.stopPropagation(); incrementDays(); }} // Prevenir propagação do clique
              >+</button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ServiceCard;

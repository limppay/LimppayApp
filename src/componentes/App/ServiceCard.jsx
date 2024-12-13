import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@nextui-org/react';
// Font Awesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBroom,
  faHome,
  faBaby,
  faUtensils,
  faBolt,
  faWrench,
  faPlus,
  faComputer,
  faSeedling,
  faBuilding,
  faCouch,
  faTShirt,
  faTools,
  faPaintRoller,
  faGlassMartini,
  faTshirt,
  faHouse,
  faScrewdriverWrench,
  faMartiniGlass,
} from "@fortawesome/free-solid-svg-icons";

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

  const iconMap = {
    broom: faBroom,
    house: faHouse,
    baby: faBaby,
    utensils: faUtensils,
    bolt: faBolt,
    wrench: faWrench,
    plus: faPlus,
    computer: faComputer,
    seedling: faSeedling,
    building: faBuilding,
    couch: faCouch,
    shirt: faTShirt,
    "screwdriver-wrench": faScrewdriverWrench,
    "paint-roller": faPaintRoller,
    "martini-glass": faMartiniGlass,
  };

  const IconComponent = ({ iconName }) => {
    const icon = iconMap[iconName];
    return icon ? <FontAwesomeIcon icon={icon} className="size-10 text-neutral-500"  /> : null;
  };

  return (
    <div 
      className={`border rounded-lg p-5 cursor-pointer transition-all duration-200 ${isExpanded ? 'border-desSec bg-desSec shadow-lg' : 'border-desSec'}`}
      onClick={onClick} // Chama a função de clique passada como prop
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center pb-5 ">
        <div className={`text-3xl flex gap-4 w-full ${isExpanded ? 'text-white' : 'text-sec'}`}>
          <IconComponent iconName={icon} />
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
          <Button 
            className="mt-4 bg-des text-white py-2 px-5 rounded-lg hover:bg-sec transition-opacity duration-200" 
            onClick={handleProceed} // Aciona ao clicar em "Prosseguir"
          >
            Prosseguir
          </Button>
        </div>
      </motion.div>
    )}

      </AnimatePresence>
    </div>
  );
};

export default ServiceCard;

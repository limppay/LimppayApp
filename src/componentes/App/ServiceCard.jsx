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

const ServiceCard = ({HandleSetServiceValue, HandleSetTipoServico, icon, title, description, value, isExpanded, onClick, days, setDays, onProceed, valueMeia, valueHora }) => {
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
      className={` border rounded-lg p-5 cursor-pointer transition-all duration-200 ${isExpanded ? 'border-desSec bg-desSec shadow-lg' : 'border-desSec'}`}
      onClick={onClick} // Chama a função de clique passada como prop
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center pb-5 ">
        <div className={`text-3xl flex gap-4 w-full ${isExpanded ? 'text-white' : 'text-sec'}`}>
          <IconComponent iconName={icon} />
          <h3 className={`text-lg 2xl:text-2xl  font-semibold ${isExpanded ? 'text-white' : 'text-sec'} mb-2`}>{title}</h3>
        </div>
      </div>

      <p className={`text-sm 2xl:text-lg ${isExpanded ? 'text-white' : 'text-prim'} text-justify mb-4`}>
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
        <div className='flex flex-col gap-2 text-start'>
          {/* Diaria */}
          <Button className="text-md font-semibold text-desSec text-start bg-white justify-between"
            onPress={() => (
              onProceed(),
              HandleSetTipoServico('8'),
              HandleSetTipoServico(value)
            )}
          >
            <div className='flex items-center  gap-2'>
              <svg className='size-5 fill-desSec' viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_19_120)">
                  <path d="M15.985 1.37892e-05C12.8211 0.00297991 9.72919 0.943884 7.09997 2.70379C4.47076 4.46369 2.42234 6.96359 1.21363 9.88746C0.00493133 12.8113 -0.309783 16.0279 0.309274 19.1306C0.92833 22.2334 2.45336 25.0829 4.6916 27.319C6.92984 29.5552 9.78079 31.0775 12.8841 31.6937C15.9874 32.3098 19.2037 31.9921 22.1264 30.7806C25.0491 29.5692 27.5471 27.5184 29.3046 24.8876C31.062 22.2567 32 19.1639 32 16C32.0008 13.8974 31.587 11.8152 30.7823 9.87268C29.9775 7.93013 28.7977 6.16533 27.3102 4.67924C25.8227 3.19315 24.0568 2.01494 22.1135 1.21202C20.1702 0.409111 18.0876 -0.0027471 15.985 1.37892e-05ZM16 28.8C13.4684 28.8 10.9937 28.0493 8.88871 26.6428C6.78376 25.2363 5.14315 23.2373 4.17435 20.8984C3.20555 18.5595 2.95206 15.9858 3.44596 13.5029C3.93985 11.0199 5.15893 8.73916 6.94904 6.94905C8.73915 5.15893 11.0199 3.93985 13.5029 3.44596C15.9858 2.95207 18.5595 3.20555 20.8984 4.17436C23.2372 5.14316 25.2363 6.78377 26.6428 8.88871C28.0493 10.9937 28.8 13.4684 28.8 16C28.8 17.6809 28.4689 19.3454 27.8257 20.8984C27.1824 22.4513 26.2396 23.8624 25.051 25.051C23.8624 26.2396 22.4513 27.1824 20.8984 27.8257C19.3454 28.4689 17.6809 28.8 16 28.8Z" />
                  <path d="M17.1239 8.57996H14.9309V17.355L22.6089 21.96L23.7089 20.16L17.1279 16.26L17.1239 8.57996Z" />
                </g>
                <defs>
                  <clipPath id="clip0_19_120">
                  <rect className='size-10' fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              Diária (8h) 
            </div>
            <span> R$ {value},00 </span>

          </Button>
        
          {/* Meia-Diaria */}
          {valueMeia > 0 && 
            <Button className="text-md font-semibold text-desSec text-start bg-white justify-between"
            onPress={() => (
              onProceed(),
              HandleSetTipoServico('4'),
              HandleSetServiceValue(valueMeia)
            )}
            >
              <div className='flex items-center gap-2'>
                <svg className='size-5 fill-desSec' viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.784 9.216C21.8948 8.32248 20.8376 7.61367 19.6733 7.13038C18.509 6.64709 17.2606 6.39887 16 6.4V16L9.21601 22.784C11.0152 24.5832 13.4555 25.594 16 25.594C18.5445 25.594 20.9848 24.5832 22.784 22.784C24.5832 20.9848 25.594 18.5445 25.594 16C25.594 13.4555 24.5832 11.0152 22.784 9.216ZM16 0C12.8355 0 9.74207 0.938383 7.11088 2.69649C4.4797 4.45459 2.42894 6.95345 1.21793 9.87706C0.0069325 12.8007 -0.309921 16.0177 0.307443 19.1214C0.924806 22.2251 2.44866 25.0761 4.6863 27.3137C6.92394 29.5513 9.77487 31.0752 12.8786 31.6926C15.9823 32.3099 19.1993 31.9931 22.1229 30.7821C25.0466 29.5711 27.5454 27.5203 29.3035 24.8891C31.0616 22.2579 32 19.1645 32 16C31.9984 11.757 30.3122 7.68829 27.312 4.68805C24.3117 1.68781 20.243 0.00159022 16 0ZM16 28.8C13.4684 28.8 10.9937 28.0493 8.88871 26.6428C6.78376 25.2363 5.14315 23.2372 4.17435 20.8983C3.20555 18.5595 2.95206 15.9858 3.44596 13.5028C3.93985 11.0199 5.15893 8.73915 6.94904 6.94903C8.73915 5.15892 11.0199 3.93984 13.5029 3.44595C15.9858 2.95206 18.5595 3.20554 20.8984 4.17434C23.2372 5.14314 25.2363 6.78375 26.6428 8.8887C28.0493 10.9937 28.8 13.4684 28.8 16C28.8 19.3948 27.4514 22.6505 25.051 25.051C22.6505 27.4514 19.3948 28.8 16 28.8Z"/>
                </svg>
                Meia-Diária (4h)
              </div>

              <span> R$ {valueMeia},00</span>
            </Button>
          }

          {/* Servico de 1hr (somente empresarial) */}
          {valueHora > 0 && 
            <Button className="text-md font-semibold text-desSec text-start bg-white justify-between"
            onPress={() => (
              onProceed(),
              HandleSetTipoServico('1'),
              HandleSetServiceValue(valueHora)
            )}
            >
              <div className='flex items-center gap-2'>
              <svg className='size-5 fill-desSec' viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-3.91642e-05 14.025C-0.0154077 11.5519 0.637595 9.12058 1.88996 6.98798C3.1163 4.86646 4.87844 3.10431 6.99996 1.87798C8.87314 0.794503 10.9724 0.160898 13.1322 0.027102C15.292 -0.106694 17.4534 0.262977 19.446 1.10698C21.1118 1.80687 22.6278 2.81984 23.912 4.09098C25.1925 5.37126 26.2067 6.89255 26.896 8.56698C27.6224 10.2578 28.0058 12.0761 28.024 13.9163C28.0422 15.7565 27.6948 17.5821 27.0019 19.2869C26.309 20.9918 25.2845 22.5422 23.9878 23.848C22.6911 25.1539 21.148 26.1892 19.448 26.894C17.7252 27.6243 15.8731 28.0006 14.002 28.0006C12.1308 28.0006 10.2787 27.6243 8.55596 26.894C6.88725 26.194 5.36792 25.1811 4.07996 23.91C2.80932 22.6312 1.79628 21.1201 1.09596 19.459C0.357943 17.7432 -0.0152884 15.8927 -3.91642e-05 14.025ZM3.08296 14.025C3.07094 15.4571 3.35018 16.8768 3.90371 18.1977C4.45724 19.5186 5.27352 20.7132 6.30296 21.709C7.29918 22.7447 8.4974 23.5648 9.82342 24.1187C11.1494 24.6726 12.575 24.9484 14.012 24.929C15.9307 24.9445 17.8175 24.4373 19.47 23.462C21.1224 22.5036 22.4976 21.1325 23.461 19.483C24.4299 17.8249 24.9405 15.9389 24.9405 14.0185C24.9405 12.098 24.4299 10.2121 23.461 8.55398C22.5015 6.8983 21.1256 5.52241 19.47 4.56298C17.8114 3.60186 15.9284 3.09572 14.0115 3.09572C12.0945 3.09572 10.2116 3.60186 8.55296 4.56298C6.90044 5.52958 5.52328 6.90364 4.55296 8.55398C3.5723 10.2091 3.06389 12.1013 3.08296 14.025ZM12.93 14.025V5.74398C12.93 5.47027 13.0387 5.20778 13.2322 5.01424C13.4258 4.82071 13.6883 4.71198 13.962 4.71198C14.2357 4.71198 14.4982 4.82071 14.6917 5.01424C14.8852 5.20778 14.994 5.47027 14.994 5.74398V12.98H19.694C19.83 12.9782 19.965 13.0037 20.0909 13.055C20.2169 13.1062 20.3314 13.1822 20.4276 13.2784C20.5238 13.3745 20.5997 13.489 20.651 13.615C20.7022 13.741 20.7277 13.876 20.726 14.012C20.7263 14.2866 20.6185 14.5502 20.426 14.746C20.3327 14.8469 20.219 14.9268 20.0924 14.9805C19.9659 15.0341 19.8294 15.0602 19.692 15.057H14.172C14.098 15.0698 14.0228 15.0738 13.948 15.069C13.8112 15.0718 13.6753 15.0466 13.5486 14.9949C13.422 14.9431 13.3073 14.8659 13.2117 14.768C13.1161 14.6702 13.0416 14.5537 12.9928 14.4259C12.944 14.2981 12.9219 14.1617 12.928 14.025H12.93Z" />
              </svg>

                1 Hora
              </div>

              <span> R$ {valueHora},00</span>
            </Button>
          }
        </div>
      </motion.div>
    )}

      </AnimatePresence>
    </div>
  );
};

export default ServiceCard;

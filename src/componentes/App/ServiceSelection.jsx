import React, { useState } from 'react';
import ServiceCard from './ServiceCard';

const ServiceSelection = ({ onProceed, onDaysChange }) => {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [days, setDays] = useState(0);

  const services = [
    { icon: 'fas fa-baby', title: 'Babá', description: 'Cuida de bebês e crianças, garantindo segurança e bem-estar.', value: 180 },
    { icon: 'fas fa-utensils', title: 'Cozinheira', description: 'Prepara refeições deliciosas para escritórios, consultórios e salas comerciais.', value: 150 },
    { icon: 'fas fa-bolt', title: 'Eletricista', description: 'Realiza manutenção preventiva e corretiva em instalações elétricas.', value: 140 },
    { icon: 'fas fa-wrench', title: 'Encanador', description: 'Resolve problemas hidráulicos em escritórios e salas comerciais.', value: 160 },
    { icon: 'fas fa-seedling', title: 'Jardinagem', description: 'Cuida de jardins em casas e apartamentos, mantendo-os sempre bonitos.' },
    { icon: 'fas fa-building', title: 'Limpeza empresarial', description: 'Serviço de limpeza para escritórios, consultórios e salas comerciais.', value: 140 },
    { icon: 'fas fa-broom', title: 'Limpeza pós-obra', description: 'Limpeza especializada para ambientes após obras e reformas.' },
    { icon: 'fas fa-home', title: 'Limpeza residencial', description: 'Limpeza completa para casas e apartamentos.', value: 140 },
    { icon: 'fas fa-couch', title: 'Montador de móveis', description: 'Montagem de móveis com precisão e cuidado.' },
    { icon: 'fas fa-tshirt', title: 'Passar roupas', description: 'Passa roupas, deixando-as impecáveis e prontas para uso.' },
    { icon: 'fas fa-tools', title: 'Pedreiro', description: 'Serviços de construção e reparo para casas e apartamentos.' },
    { icon: 'fas fa-paint-roller', title: 'Pintor', description: 'Pintura de alta qualidade para escritórios e salas comerciais.' },
    { icon: 'fas fa-glass-martini', title: 'Vidraceiro', description: 'Instalação e reparo de vidros para escritórios, consultórios e salas comerciais.' }
  ];

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleServiceClick = (index) => {
    if (selectedServiceIndex !== index) {
      setDays(0);
    }
    setSelectedServiceIndex(selectedServiceIndex === index ? null : index);
  };

  const handleProceed = () => {
    onDaysChange(days); // Chama a função para atualizar o número de dias no componente pai
    onProceed(); // Prossegue para a próxima etapa
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 pt-18">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-7xl mx-auto">
        {/* Coluna principal */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-center text-xl font-semibold text-desSec mb-4">Escolha o serviço</h2>

            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar profissional"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-bord rounded-full px-4 py-2 text-prim"
              />
              <button className="absolute right-4 top-2 text-sec">
                <i className="fas fa-search"></i>
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {filteredServices.length > 0 ? (
                filteredServices.map((service, index) => (
                  <ServiceCard
                    key={index}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    value={service.value}
                    isExpanded={selectedServiceIndex === index}
                    onClick={() => handleServiceClick(index)}
                    days={days}
                    setDays={setDays}
                    onProceed={handleProceed} // Passa a função onProceed para o ServiceCard
                  />
                ))
              ) : (
                <p className="text-center text-prim">Nenhum serviço encontrado.</p>
              )}
            </div>
          </div>

          <div className="mt-6 bg-white shadow-md rounded-lg p-4">
            <h3 className="text-center text-lg font-semibold text-prim mb-4">Não encontrou o que queria?</h3>
            <textarea
              placeholder="Escreva aqui e envie sua sugestão"
              className="w-full border border-bord rounded-lg p-4 mb-4"
              rows="3"
            ></textarea>
            <button className="w-full bg-des text-white py-2 rounded-lg hover:bg-sec">
              Enviar sugestão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelection;

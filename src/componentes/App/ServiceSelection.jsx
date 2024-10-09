import React, { useState } from 'react';
import ServiceCard from './ServiceCard';

const ServiceSelection = () => {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const services = [
    { icon: 'fas fa-pump-soap', title: 'Limpeza', description: 'Limpeza de residências e escritórios.', value: 140 },
    { icon: 'fas fa-baby', title: 'Babá', description: 'Cuida de bebês e crianças, zelando pelo bem-estar.', value: 180 },
    { icon: 'fas fa-utensils', title: 'Cozinheira', description: 'Recomendada para escritórios, consultórios e salas comerciais.', value: 150 },
    { icon: 'fas fa-bolt', title: 'Eletricista', description: 'Manutenção preventiva e corretiva.', value: 140 },
    { icon: 'fas fa-wrench', title: 'Encanador', description: 'Recomendada para escritórios e salas comerciais.', value: 160 },
  ];

  const handleServiceClick = (index) => {
    setSelectedServiceIndex(selectedServiceIndex === index ? null : index); // Alterna entre expandir e colapsar
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4 pt-24">
      {/* Barra de progresso */}
      <div className="flex justify-center mt-4 mb-6">
        <div className="flex space-x-2">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 rounded-full ${index < 2 ? 'bg-desSec' : 'bg-prim'}`}
            />
          ))}
        </div>
      </div>

      {/* Seleção de serviços */}
      <div className="bg-white shadow-md rounded-lg p-4 max-w-md mx-auto">
        <h2 className="text-center text-xl font-semibold text-desSec mb-4">Escolha o serviço</h2>

        {/* Barra de pesquisa */}
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

        {/* Renderizando os ServiceCard filtrados */}
        <div className="space-y-4">
          {filteredServices.length > 0 ? (
            filteredServices.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                value={service.value}
                isExpanded={selectedServiceIndex === index} // Define se o card está expandido
                onClick={() => handleServiceClick(index)} // Chama a função ao clicar
              />
            ))
          ) : (
            <p className="text-center text-prim">Nenhum serviço encontrado.</p>
          )}
        </div>
      </div>

      {/* Formulário de sugestão */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-4 max-w-md mx-auto">
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
  );
};

export default ServiceSelection;

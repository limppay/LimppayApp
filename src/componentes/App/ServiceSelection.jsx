import React, { useState } from 'react';
import ServiceCard from './ServiceCard';

const ServiceSelection = () => {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(null); // Estado para controlar qual serviço está selecionado
  const [searchQuery, setSearchQuery] = useState(''); // Estado para armazenar a consulta de pesquisa
  const [days, setDays] = useState(0); // Estado para armazenar o número de dias

  const services = [
    { icon: 'fas fa-building', title: 'Limpeza empresarial', description: 'Esta opção é recomendada para escritórios, consultórios e salas comerciais', value: 140 },
    { icon: 'fas fa-home',  title: 'Limpeza residencial', description: 'Esta opção é recomendada para casas e apartamentos', value: 140 },
    { icon: 'fas fa-baby', title: 'Babá', description: 'Cuida de bebês e crianças, zelando pelo bem-estar.', value: 180 },
    { icon: 'fas fa-utensils', title: 'Cozinheira', description: 'Recomendada para escritórios, consultórios e salas comerciais.', value: 150 },
    { icon: 'fas fa-bolt', title: 'Eletricista', description: 'Manutenção preventiva e corretiva.', value: 140 },
    { icon: 'fas fa-wrench', title: 'Encanador', description: 'Recomendada para escritórios e salas comerciais.', value: 160 },
  ];

  // Função para filtrar serviços com base na consulta de pesquisa
  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleServiceClick = (index) => {
    // Se um novo serviço for selecionado, resetar o número de dias
    if (selectedServiceIndex !== index) {
      setDays(0);
    }
    setSelectedServiceIndex(selectedServiceIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 pt-24">
      {/* Progress bar */}
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

      {/* Service selection */}
      <div className="bg-white shadow-md rounded-lg p-4 max-w-4xl mx-auto">
        <h2 className="text-center text-xl font-semibold text-desSec mb-4">Escolha o serviço</h2>

        {/* Search bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Buscar profissional"
            value={searchQuery} // Controlando o valor do input
            onChange={(e) => setSearchQuery(e.target.value)} // Atualiza a consulta de pesquisa
            className="w-full border border-bord rounded-full px-4 py-2 text-prim"
          />
          <button className="absolute right-4 top-2 text-sec">
            <i className="fas fa-search"></i> {/* Ícone de lupa */}
          </button>
        </div>
          
        {/* Renderizando os ServiceCard filtrados */}
        <div className="max-h-80 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Usando grid para responsividade */}
          {filteredServices.length > 0 ? ( // Exibe serviços filtrados ou mensagem se não houver
            filteredServices.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                value={service.value}
                isExpanded={selectedServiceIndex === index} // Passa se o bloco deve estar expandido
                onClick={() => handleServiceClick(index)} // Função para selecionar o serviço
                days={days} // Passa o valor de dias
                setDays={setDays} // Passa a função para atualizar o valor de dias
              />
            ))
          ) : (
            <p className="text-center text-prim">Nenhum serviço encontrado.</p>
          )}
        </div>
      </div>

      {/* Suggestion form */}
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

import React, { useEffect, useState } from 'react';
import ServiceCard from './ServiceCard';
import { findAllServicos } from '../../services/api';

const ServiceSelection = ({ onProceed, onDaysChange, onServiceChange, setServiceValue }) => {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [days, setDays] = useState(0);
  const [servicos, setServicos] = useState([])
  const [loading, setLoading] = useState(false)
  

    // função para fazer as requisições
    useEffect(() => {
      setLoading(true)
  
      const handleGetServicos = async () => {
        try {
  
          const response = await findAllServicos()
          console.log("Servicos", response)
  
          setServicos(response)
          setLoading(false)
    
        } catch (error) {
          console.log(error)
  
        } 
  
      }
  
      handleGetServicos()
  
    }, [])

  const services = servicos
  .filter((servico) => servico.status === true) // Filtra apenas os com status true
  .map((servico) => ({
    // icon: 'fas fa-baby',
    title: servico.nome,
    description: servico.descricao,
    value: servico.valorDiaria
  }));
  
    

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleServiceClick = (index) => {
    if (selectedServiceIndex !== index) {
      setDays(0);
    }
    setSelectedServiceIndex(selectedServiceIndex === index ? null : index);
    onServiceChange(services[index].title)
    setServiceValue(services[index].value)
  };

  const handleProceed = () => {
    onDaysChange(days); // Chama a função para atualizar o número de dias no componente pai
    onProceed(); // Prossegue para a próxima etapa
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-7xl mx-auto">
        {/* Coluna principal */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-center text-xl font-semibold text-desSec mb-4">Escolha o serviço</h2>

            <div className="relative mb-4">
              <input
                type="text"
                id='searchQuery'
                placeholder="Buscar profissional"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:outline-prim w-full border border-bord rounded-full px-4 py-2 text-prim"
              />
              <label htmlFor="searchQuery">
                <button className="absolute right-4 top-2 text-sec">
                  <i className="fas fa-search"></i>
                </button>
              </label>
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

          <div className="mt-6 bg-white shadow-md rounded-lg p-4 flex flex-col gap-5">
            <h3 className="text-center text-lg font-semibold text-prim mb-4">Não encontrou o que queria?</h3>
            <textarea
              placeholder="Escreva aqui e envie sua sugestão"
              className="border rounded-md border-bord p-3 min-h-20 lg:min-h-40 focus:outline-ter text-prim w-full max-h-1"
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

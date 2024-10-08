import React, { useState } from 'react';

const ServiceSelection = () => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    { id: 1, name: 'Babá', description: 'Cuida de crianças...', price: 140 },
    { id: 2, name: 'Cozinheira', description: 'Prepara refeições...', price: 140 },
    { id: 3, name: 'Eletricista', description: 'Serviços elétricos...', price: 140 },
  ];

  const handleSelectService = (service) => {
    setSelectedService(service.id);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Escolha o serviço</h2>
      <div className="mt-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`border p-3 my-2 ${selectedService === service.id ? 'bg-blue-100' : ''}`}
            onClick={() => handleSelectService(service)}
          >
            <h3 className="font-semibold">{service.name}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;

import React, { useEffect, useState } from 'react';
import ServiceCard from './ServiceCard';
import { createSugestao, findAllServicos } from '../../services/api';
import { Spinner } from '@nextui-org/react';
import { Button } from '@nextui-org/react';

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

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

  const services = servicos.filter((servico) => servico.status === true) // Filtra apenas os com status true
  .map((servico) => ({
    icone: servico.icone,
    id: servico.id,
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
    onServiceChange(services[index].title, services[index].id)
    setServiceValue(services[index].value)
    
  };

  const handleProceed = () => {
    onDaysChange(days); // Chama a função para atualizar o número de dias no componente pai
    onProceed(); // Prossegue para a próxima etapa
  };

  console.log("Servicos filtrados: ", filteredServices)

  const [creating, setCreating] = useState(false)

  const schema = yup.object({
    serviceName: yup.string().required("Titulo é obrigatório"),
    description: yup.string().required("Descrição é obrigatório")
  })

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
    setValue, 
    getValues,
    setError, 
    watch,
    clearErrors
    } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    console.log("Dados recebidos", data)
    setCreating(true)

    try {
      const response = await createSugestao(data)
      console.log("Sugestao enviada com sucesso!", response.data)
      setCreating(false)
      reset()
      
    } catch (error) {
      console.log(error)
      
    }
    
  }

  return (
    <div className="bg-gray-50 min-h-screen w-full h-full ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-7xl mx-auto">
        {/* Coluna principal */}
        <div className="lg:col-span-2">
          <div className="bg-white sm:shadow-md rounded-lg p-4 w-full">
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

            <div className={`max-h-80 overflow-y-auto grid grid-cols-1  lg:grid-cols-2  gap-4 min-h-[35vh] ${loading ? "items-center" : ""} `}>
              {loading ? (
                <div className='col-span-2 text-white min-w-[20vh] '>
                  <Spinner size='lg' />

                </div>
              ) : filteredServices.length > 0 ? (
                filteredServices.map((service, index) => (
                  <ServiceCard
                    key={index}
                    icon={service.icone}
                    title={service.title}
                    description={service.description}
                    value={service.value}
                    isExpanded={selectedServiceIndex === index}
                    onClick={() => handleServiceClick(index, service?.id)}
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

          <div className="mt-6 bg-white shadow-md rounded-lg p-4 flex flex-col gap-2">
            <h3 className="text-center text-lg font-semibold text-prim ">Não encontrou o que queria?</h3>
            <div className='text-prim'>
              <p>Nos envie uma sugestão de serviço que você gostaria de contratar. <br />
              Não se preocupe, sua sugestão é totalmente anônima :D
              </p>

            </div>
            <p></p>
            <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
              <div className='flex flex-col justify-start'>
                <input 
                  type='text' 
                  className='w-full rounded-md border border-bord p-2 focus:outline-ter text-prim' 
                  placeholder='Nome do serviço'
                  {...register("serviceName")}
                
                />
                {errors?.serviceName && (
                  <span className='text-error text-sm text-start'>{errors?.serviceName?.message}</span>
                )}

              </div>
              <div className='flex flex-col justify-start'>
                <textarea
                  placeholder="Descrição da sugestão"
                  className="border rounded-md border-bord p-3 min-h-20 lg:min-h-40 focus:outline-ter text-prim w-full max-h-1"
                  rows="3"
                  {...register("description")}
                ></textarea>
                {errors?.description && (
                  <span className='text-error text-sm text-start'>{errors?.description?.message}</span>
                )}

              </div>
              <Button className="w-full bg-des text-white py-2 rounded-lg hover:bg-sec" type='submit' isDisabled={creating}>
                {creating ? <Spinner/> : "Enviar sugestão "}
              </Button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ServiceSelection;

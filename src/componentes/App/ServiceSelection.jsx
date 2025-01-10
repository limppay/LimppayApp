import React, { useEffect, useState } from 'react';
import ServiceCard from './ServiceCard';
import { createSugestao, findAllServicos } from '../../services/api';
import { Spinner } from '@nextui-org/react';
import { Button } from '@nextui-org/react';

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import { io } from 'socket.io-client';


const ServiceSelection = ({ onProceed, onDaysChange, onServiceChange, setServiceValue }) => {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [days, setDays] = useState(0);

  const [servicos, setServicos] = useState([])

  const [loading, setLoading] = useState(false)

  const handleGetServicos = async () => {
    setLoading(true)
    try {

      const response = await findAllServicos()

      setServicos(response)
      setLoading(false)

    } catch (error) {

    } 

  }

  // função para fazer as requisições
  useEffect(() => {
    setLoading(true)

    const handleGetServicos = async () => {
      try {

        const response = await findAllServicos()

        setServicos(response)
        setLoading(false)
  
      } catch (error) {

      } 

    }

    handleGetServicos()

  }, [])

  const prod = "https://limppay-api-production.up.railway.app/"
  const local = 'http://localhost:3000'
    
  // Conectando ao servidor WebSocket
  const socket = io(prod)
  console.log("Conectado ao servidor: ", socket)

  socket.on('data-updated', (data) => {
    console.log('Data updated:', data);

    handleGetServicos()
  })

  const services = servicos.filter((servico) => servico.status === true) // Filtra apenas os com status true
  .map((servico) => ({
    icone: servico.icone,
    id: servico.id,
    title: servico.nome,

    description: servico.descricao,
    value: servico.valorDiaria,
    valueMeia: servico.valorMeiaDiaria,
    valueHora: servico.valorUmaHora
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

  const HandleSetServiceValue = (value) => {
    setServiceValue(value)
  }

  const handleProceed = () => {
    onDaysChange(days); // Chama a função para atualizar o número de dias no componente pai
    onProceed(); // Prossegue para a próxima etapa
  };


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
    setCreating(true)

    try {
      const response = await createSugestao(data)
      setCreating(false)
      reset()
      
    } catch (error) {
      
    }
    
  }

  return (
    <div className="min-h-screen w-full h-full max-w-[110vh] 2xl:text-md">
      <div className="grid gap-4 max-w-7xl mx-auto lg:grid-cols-2 ">
        <div className="lg:col-span-2">
          <div className="bg-white sm:shadow-md rounded-lg p-4 w-full">
            <h2 className="text-center text-xl 2xl:text-2xl font-semibold text-desSec mb-4">Escolha o serviço</h2>

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

            <div className={`min-w-[35vh] min-h-[35vh] max-h-[35vh] overflow-y-auto grid grid-cols-1  lg:grid-cols-2  gap-4 md:min-h-[45vh] ${loading ? "items-center" : ""} `}>
              {loading ? (
                <div className='col-span-2 text-white w-full '>
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
                    valueMeia={service.valueMeia}
                    valueHora={service.valueHora}
                    isExpanded={selectedServiceIndex === index}
                    onClick={() => handleServiceClick(index, service?.id)}
                    days={days}
                    setDays={setDays}
                    onProceed={handleProceed} // Passa a função onProceed para o ServiceCard
                    HandleSetServiceValue={HandleSetServiceValue}
                  />
                ))
              ) : (
                <p className="text-center text-prim">Nenhum serviço encontrado.</p>
              )}
            </div>

          </div>

          <div className="mt-6 bg-white shadow-md rounded-lg p-4 flex flex-col gap-2">
            <h3 className="text-center text-lg font-semibold text-prim 2xl:text-2xl">Não encontrou o que queria?</h3>
            <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
              <div className='flex flex-col justify-start'>
                <input 
                  type='text' 
                  className='w-full rounded-md border border-bord p-2 2xl:p-4 focus:outline-prim text-prim' 
                  placeholder='Nome do serviço'
                  {...register("serviceName")}
                
                />
                {errors?.serviceName && (
                  <span className='text-error text-sm text-start'>{errors?.serviceName?.message}</span>
                )}

              </div>
              <div className='flex flex-col justify-start'>
                <textarea
                  placeholder="Nos envie uma sugestão de serviço que você gostaria de contratar"
                  className="border rounded-md border-bord p-3 min-h-20 lg:min-h-40 2xl:min-h-60 focus:outline-prim text-prim w-full max-h-1"
                  rows="3"
                  {...register("description")}
                ></textarea>
                {errors?.description && (
                  <span className='text-error text-sm text-start'>{errors?.description?.message}</span>
                )}

              </div>
              <Button className="w-full bg-des text-white p-2 2xl:p-4 rounded-lg hover:bg-sec" type='submit' isDisabled={creating}>
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

import React, { useEffect, useState } from 'react'

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import { usePrestador } from '../../context/PrestadorProvider'
import { findAllServicos, updateServico } from '../../services/api'
import { fetchPrestadorInfo } from '../../common/FetchPrestadorInfo'
import { Button } from '@nextui-org/button'
import { Spinner } from '@nextui-org/react'
import { formatarMoeda } from '../../common/FormatarMoeda'

export default function Servicos() {
    const { prestador, setPrestador } = usePrestador()
    const [loadingServico, setLoadingServico] = useState(false)
    const [ loading, setLoading ] = useState(true)
    const [serviceMessage, setServiceMessage] = useState("")
    const [servicos, setServicos] = useState([])
    const [selectedServices, setSelectedServices] = useState([])

    const servicosSchema = yup.object({
        servicosSelecionados: yup.array().required("Selecione um servico")
    })
    .required()

    // Hook Forms
    const {
        register: registerService,
        handleSubmit: handleSubmitService,
        formState: { errors: errorsService },
        reset: resetService,  
        } = useForm({
        resolver: yupResolver(servicosSchema),
    })

    const handleUpdateServicos = async (data) => {
        setLoadingServico(true)
        
        const req = {
            servicosSelecionados: JSON.stringify(selectedServices)
        }

        try {
            const response = await updateServico(prestador?.id, data)
            await fetchPrestadorInfo(setPrestador)
            setLoadingServico(false)
            resetService()
            setServiceMessage("Enviado com sucesso!")

        } catch (error) {
            setServiceMessage(error)

        } 
        
    }

    const toggleService = (id) => {
        if (selectedServices.includes(id)) {
            // Remove se já estiver selecionado
            setSelectedServices(selectedServices.filter((service) => service !== id));
        } else {
            // Adiciona à lista
            setSelectedServices([...selectedServices, id]);
        }
    };

    useEffect(() => {

        const handleGetServicos = async () => {
            setLoading(true)
            try {
                const response = await findAllServicos()
                setServicos(response)
                setLoading(false)
        
            } catch (error) {
                setServicos([])
                

            } 

        }

        handleGetServicos()

    }, [prestador, setPrestador])

    useEffect(() => {
        if (selectedServices) {
                resetService({
                servicosSelecionados: selectedServices,
            });

        }
    }, [selectedServices]);

    const taxaPrestador = (valor) => {
        const value = valor * 0.75
        return formatarMoeda(value)
    }

    return (
        <section className='w-full gap-1 pt-[8vh] pb-[8vh] sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim'>
            {loading ? (
                <div className='text-white flex flex-col items-center justify-center w-full min-h-[80vh]'>
                    <Spinner size='md' />
                </div>

            ) : (
                <div className='p-7   flex flex-col gap-5'>
                    <div>
                        <h2 className='text-2xl font-semibold '>Serviços</h2>
                    </div>

                    <div className="w-full pb-10 flex flex-col gap-5 ">
                        <form className='flex flex-col gap-5 ' onSubmit={handleSubmitService(handleUpdateServicos)}>
                            <div className="overflow-y-auto max-h-[60vh] lg:p-2 grid grid-cols-1 gap-5 lg:grid-cols-5 items-center lg:gap-5">
                                {servicos?.filter((servico) => servico.status)
                                .map((servico) => (
                                    <div key={servico.id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`servico-${servico.id}`}
                                            value={servico.id}
                                            checked={selectedServices.includes(servico.id)}
                                            onChange={() => toggleService(servico.id)}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                        <label
                                            htmlFor={`servico-${servico.id}`}
                                            className="ml-2 block text-sm text-gray-900"
                                        >
                                            {servico.nome}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className='flex flex-col w-full md:w-6/12 gap-2'>
                                <Button className=' bg-sec text-white' isDisabled={selectedServices.length > 0 ? false : true} type='submit'>
                                    {loadingServico ? <Spinner/> : "Confirmar"}
                                </Button>
                                
                                {serviceMessage && 
                                    <span className='text-center'>{serviceMessage}</span>
                                }
                            </div>


                        </form>
                        
                        <span className='opacity-50 flex items-center gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                            </svg>

                            Selecione os serviços que você deseja realizar
                        </span>
                    </div>

                    <h2 className="font-semibold text-xl mb-4">Tabela de Preços</h2>
                    <div className="overflow-x-auto border rounded-md">
                        <table className="min-w-full table-auto rounded-md  ">
                            <thead className=''>
                                <tr className=" text-white  text-sm  bg-sec ">
                                    <th className="p-2 text-start  ">Serviço</th>
                                    <th className="p-2 text-start ">Valor Diária</th>
                                    <th className="p-2 text-start">Valor Meia Diária</th>
                                    <th className="p-2 text-start">Valor por Hora</th>
                                </tr>
                            </thead>
                            <tbody >
                                {servicos.filter((servico) => servico.status).map((servico) => (
                                    <tr key={servico.id} className="hover:bg-gray-50 border-b border-t ">
                                        <td className=" px-5 py-2 font-medium">
                                            <i className={`fas fa-${servico.icone} mr-2`}></i>
                                            {servico.nome}
                                        </td>
                                        <td className=" px-5 py-2">
                                            {servico.valorDiaria ? `${taxaPrestador(servico.valorDiaria)}` : "-"}
                                        </td>
                                        <td className=" px-5 py-2">
                                            {servico.valorMeiaDiaria ? `${taxaPrestador(servico.valorMeiaDiaria)}` : "-"}
                                        </td>
                                        <td className=" px-5 py-2">
                                            {servico.valorUmaHora ? `${taxaPrestador(servico.valorUmaHora)}` : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>

            )}
        </section>
    )
}

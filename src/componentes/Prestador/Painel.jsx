import React, { useEffect, useState } from 'react'
import { usePrestador } from '../../context/PrestadorProvider';
import { getFaturamentoMes, getSolicitacoesGeraisPrestador, getSolicitacoesTotalPrestador, updateAgendamento } from '../../services/api';
import { formatarMoeda } from "../../common/FormatarMoeda"
import { formatarData } from '../../common/FormatarData';
import { Button } from '@nextui-org/button';
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter} from "@nextui-org/modal";
import { fetchPrestadorInfo } from '../../common/FetchPrestadorInfo';
import { Avatar, Spinner } from '@nextui-org/react';
import User from "../../assets/img/diarista-cadastro/user.webp"

export default function Painel() {
    const { prestador, setPrestador } = usePrestador()
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [SolicitacoesTotalPrestador, setSolicitacoesTotalPrestador] = useState()
    const [SolicitacoesGeraisPrestador, setSolicitacoesGeraisPrestador] = useState()
    const [FaturamentoMes, setFaturamentoMes] = useState()
    const [ open, setOpen ] = useState(false)
    const [ loadingEdit, setLoadingEdit ] = useState(false)

    const agendamentosFiltrados = prestador?.Agendamentos && prestador?.Agendamentos?.filter((agendamento) => {
        const nameMatch = agendamento.Servico.toLowerCase().includes(searchTerm.toLowerCase());
        const dateMatch = (!startDate || new Date(agendamento.dataServico) >= new Date(startDate)) &&
                            (!endDate || new Date(agendamento.dataServico) <= new Date(endDate));
    
        return nameMatch && dateMatch;
    });

    useEffect(() => {
    const handleSolicitacoesTotalPrestador = async() => {
        try {
            const response = await getSolicitacoesTotalPrestador(prestador?.id)
            setSolicitacoesTotalPrestador(response)
        } catch (error){
        }
    }
    handleSolicitacoesTotalPrestador()
    }, [prestador?.id, prestador]);

    useEffect(() => {
    const handleSolicitacoesGeraisPrestador = async() => {
        try {
            const response = await getSolicitacoesGeraisPrestador(prestador?.id)
            setSolicitacoesGeraisPrestador(response)
        } catch (error){
        }
    }
    handleSolicitacoesGeraisPrestador()
    }, [prestador?.id, prestador]);

    useEffect(() => {
        const handleFaturamentoMes = async() => {
            try {
                const response = await getFaturamentoMes(prestador?.id)
                setFaturamentoMes(response)
            } catch (error){
            }
        }
        handleFaturamentoMes()

    }, [prestador?.id, prestador]);

    const taxaPrestador = (valor) => {
        const value = valor * 0.75
        return formatarMoeda(value)
    }


    return (
        <div className="md:pt-28 pt-[8vh] pb-[8vh] flex-1 p-6 gap-5 "> 
            {/* Grid do dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">                                        
                {/* Solicitações do mês */}
                <div className="bg-white shadow-md  rounded-lg p-6">
                    <h2 className="text-desSec text-sm lg:text-lg font-semibold text-gray-600 mb-4">
                        Solicitações do Mês
                    </h2>
                    <p className="text-desSec text-3xl font-bold text-gray-800">
                        {SolicitacoesTotalPrestador || 0}
                    </p>
                </div>

                {/* Total de agendamentos */}
                <div className="bg-white shadow-md  rounded-lg p-6">
                    <h2 className="text-desSec text-sm lg:text-lg font-semibold text-gray-600 mb-4">
                        Total de Agendamentos
                    </h2>
                    <p className="text-desSec text-3xl font-bold text-gray-800">
                        {SolicitacoesGeraisPrestador || 0}
                    </p>
                </div>

                {/* Total de faturamento no mês */}
                <div className="col-span-2 lg:col-span-1   bg-white shadow-md  rounded-lg p-6">
                    <h2 className="text-desSec text-sm lg:text-lg font-semibold text-gray-600 mb-4">
                        Faturamento no mês 
                    </h2>
                    <p className="text-desSec text-3xl font-bold text-gray-800">
                        {formatarMoeda(FaturamentoMes?.toFixed(2) || "0.00")}
                    </p>
                </div>

                
            </div>

            {/* Próximo agendamento e média de estrelas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5">
                {/* Média de estrelas */}
                <div className=" bg-white shadow-md  rounded-lg p-6 ">
                    <h2 className="text-desSec text-sm lg:text-lg font-semibold text-gray-600 mb-4">
                        Média de Estrelas
                    </h2>
                    <div className="flex flex-col gap-6">
                        {prestador?.Review && prestador?.Review?.length > 0 ? (
                            (() => {
                                const totalEstrelas = prestador?.Review?.reduce((sum, avaliacao) => sum + (avaliacao.stars || 0), 0);
                                const mediaEstrelas = (totalEstrelas / prestador?.Review?.length).toFixed(1);

                                return (
                                    <p className="text-desSec text-3xl font-bold text-gray-800">{mediaEstrelas} ★</p>
                                );
                            })()
                        ) : (
                            <p className="text-prim">Nenhuma avaliação recebida ainda.</p>
                        )}
                    </div>
                </div>

                <div className='md:col-span-2'>
                    <h2 className="text-desSec text-lg font-semibold text-gray-600 mb-4 pt-2"> Próximo Agendamento </h2>
                    
                    {agendamentosFiltrados && agendamentosFiltrados.length > 0 ? (
                        (() => {
                            const hoje = new Date();
                            const proximoAgendamento = agendamentosFiltrados
                                .filter(
                                    agendamento => 
                                        new Date(agendamento.dataServico) >= hoje && // Data futura ou atual
                                        agendamento.status === "Agendado" // Status "Agendado"
                                )
                                .sort((a, b) => new Date(a.dataServico) - new Date(b.dataServico))[0]; // Ordenar por proximidade

                            

                            return proximoAgendamento ? (
                                <div className="flex-1 w-full">
                                    <div className="flex flex-col rounded-lg p-5 gap-10 h-full w-full shadow-lg">
                                        <div className='flex flex-col gap-2 text-prim'>
                                            <div className='w-full flex gap-2 items-center '>
                                                <Avatar 
                                                    src={User} 
                                                    alt="avatarPrestador"
                                                    size='lg'
                                                />
                                                <h3 className='text-prim font-semibold flex flex-wrap text-center'>{proximoAgendamento.cliente?.name}</h3>
                                                                                                                
                                            </div>
    
                                            <div className='flex gap-5 justify-between text-prim'>
                                                <p className='font-semibold'>Serviço de {proximoAgendamento.timeTotal}hr</p>
                                                <p className='font-semibold'> {proximoAgendamento.Servico}</p>
                                                <p className='font-semibold'>{formatarData(new Date(proximoAgendamento?.dataServico).toISOString().split('T')[0])} </p>
                                                <p className='font-semibold'>{proximoAgendamento?.horaServico}</p>
                                                
                                            </div>
                                            <p> {proximoAgendamento.enderecoCliente}</p>
                                            <div>
                                                <p>{taxaPrestador(proximoAgendamento.valorLiquido)}</p>
                                            </div>                                        
                                        </div>

                                        <div className='grid grid-cols-1  gap-2 items-center w-full justify-between'>
                                            <a 
                                                href={`https://www.google.com/maps/place/${encodeURIComponent(proximoAgendamento.enderecoCliente)}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                
                                            >
                                                <button className="justify-center text-sm shadow-sm w-full bg-sec text-white p-2 flex items-center gap-2 rounded-lg">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                                                        />
                                                    </svg>
                                                    Abrir com o Google Maps
                                                </button>
                                            </a>                                           
                                        </div>
                                    </div>


                                </div>
                            ) : (
                                <p className="text-prim flex w-full">Nenhum agendamento futuro encontrado com status "Agendado".</p>
                            );
                        })()
                    ) : (
                        <p className="text-prim flex w-full">Nenhum agendamento encontrado.</p>
                    )}



                </div>
                                                                        
            </div>

        </div>
    )
}

import React, { useEffect, useState } from 'react'
import { usePrestador } from '../../context/PrestadorProvider';
import { getFaturamentoMes, getSolicitacoesGeraisPrestador, getSolicitacoesTotalPrestador, updateAgendamento } from '../../services/api';
import { formatarMoeda } from "../../common/FormatarMoeda"
import { formatarData } from '../../common/FormatarData';
import { Button } from '@nextui-org/button';
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter} from "@nextui-org/modal";
import { fetchPrestadorInfo } from '../../common/FetchPrestadorInfo';
import { Spinner } from '@nextui-org/react';

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

    const handleCancelarAgendamento = async (agendamento) => {
        setLoadingEdit(true);
        const data = {
            status: 'Cancelado'
        }

        try {        
            const response = await updateAgendamento(agendamento?.id, data);
            await fetchPrestadorInfo(setPrestador)
            setLoadingEdit(false)
            setOpen(false)
            console.log("Agendamento atualizado com sucesso!", response);

        } catch (error) {
            console.error("Erro ao atualizar o agendamento:", error);
        }

    };

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
                                    <div className="flex flex-col shadow-lg rounded-lg p-5 gap-10">
                                        <div className='flex flex-col gap-2 text-prim'>
                                            <div className='flex gap-5 justify-between text-prim'>
                                                <p className='font-semibold'> {proximoAgendamento.Servico}</p>
                                                <p className='font-semibold'>{formatarData(new Date(proximoAgendamento?.dataServico).toISOString().split('T')[0])} </p>
                                                <p className='font-semibold'>{proximoAgendamento.horaServico}</p>
                                            </div>
                                            <p> {proximoAgendamento.enderecoCliente}</p>

                                            <p>{taxaPrestador(proximoAgendamento.valorLiquido)}</p>
                                            
                                        </div>

                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 items-center w-full justify-between'>
                                            <Button className='border border-error text-error bg-white w-full' onPress={() => (setOpen(true))}>
                                                Cancelar serviço
                                            </Button>
                                            <a 
                                                href={`https://www.google.com/maps/place/${encodeURIComponent(proximoAgendamento.enderecoCliente)}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                
                                            >
                                                <Button className="w-full bg-sec text-white">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 mr-2 inline-block">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                                                    </svg>
                                                    Abrir com o Google Maps
                                                </Button>
                                            </a>                                           
                                        </div>
                                    </div>

                                    <Modal 
                                        backdrop="opaque" 
                                        isOpen={open} 
                                        onClose={setOpen}
                                        placement='center'
                                        classNames={{
                                            backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
                                            body: "bg-white",
                                            header: "bg-white",
                                            footer: "bg-white"
                                        }}
                                        className="max-w-[40vh] sm:min-w-[80vh]"
                                    >
                                        <ModalContent className="bg-">
                                        {(onClose) => (
                                            <>
                                            <ModalHeader className="flex flex-col gap-1 text-neutral-600 text-2xl  border-b border-bord ">
                                                <div className="flex w-full justify-between pr-10">
                                                    <h2 className='text-error'>Atenção!</h2>
                                                </div>
                                            </ModalHeader>

                                            <ModalBody>
                                                <div className="text-neutral-400 flex  w-full justify-between gap-5 pt-5 pb-5 ">
                                                    <div className='text-ter grid gap-2'>
                                                        <p>Se houver muitos cancelamentos, sua conta pode ficar temporariamente indisponivel para os clientes.</p>

                                                        <p>Você tem certeza que deseja cancelar este serviço? :(</p>
                                                    </div>
                                                    
                                                </div>
                                            </ModalBody>
                                            <ModalFooter className='shadow-none'>
                                                <Button className=' text-prim border bg-white w-1/2' isDisabled={loadingEdit} onPress={() => onClose()}>
                                                    Voltar
                                                </Button>
                                                <Button className='bg-error text-white w-1/2' isDisabled={loadingEdit} onPress={() => handleCancelarAgendamento(proximoAgendamento)}>
                                                    {loadingEdit ? <Spinner/> : "Confirmar"}
                                                </Button>
                                            </ModalFooter>
                                            </>
                                        )}
                                        </ModalContent>
                                    </Modal>
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

import React, { useState } from 'react'
import { usePrestador } from '../../context/PrestadorProvider';
import { Button } from '@nextui-org/button';
import { formatarData } from '../../common/FormatarData';
import { formatarMoeda } from '../../common/FormatarMoeda';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import Temporizador from './Temporizador';
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter} from "@nextui-org/modal";
import { fetchPrestadorInfo } from '../../common/FetchPrestadorInfo';
import { finalizarAgendamento, iniciarAgendamento, pausarAgendamento, retornarAgendamento, updateAgendamento } from '../../services/api';
import { Avatar, Spinner } from '@nextui-org/react';
import User from "../../assets/img/diarista-cadastro/user.webp"

export default function Pedidos({setScreenSelected}) {
    const { prestador, setPrestador } = usePrestador()
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [ open, setOpen ] = useState(false)
    const [ openPausar, setOpenPausar ] = useState(false)
    const [ openRetornar, setOpenRetornar ] = useState(false)
    const [ openFinalizar, setFinalizar ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const [ sucess, setSucess ] = useState(false)

    const [ runnig, setRunnig ] = useState(false)

    const taxaPrestador = (valor) => {
        const value = valor * 0.75
        return formatarMoeda(value)
    }
    
    const agendamentosFiltrados = prestador?.Agendamentos && prestador?.Agendamentos?.filter((agendamento) => {
        const nameMatch = agendamento.Servico.toLowerCase().includes(searchTerm.toLowerCase());
        const dateMatch = (!startDate || new Date(agendamento.dataServico) >= new Date(startDate)) &&
                            (!endDate || new Date(agendamento.dataServico) <= new Date(endDate));
    
        return nameMatch && dateMatch;
    });

    const hoje = new Date();
    const hojeSemHora = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    
    const proximoAgendamento = prestador?.Agendamentos
    ?.filter(agendamento => {
      const dataServico = new Date(agendamento.dataServico);
      const dataServicoSemHora = Date.UTC(
        dataServico.getUTCFullYear(),
        dataServico.getUTCMonth(),
        dataServico.getUTCDate()
      );
  
      const hojeSemHora = Date.UTC(
        hoje.getUTCFullYear(),
        hoje.getUTCMonth(),
        hoje.getUTCDate()
      );
  
      const statusValido = agendamento.status !== "Cancelado" && agendamento.status !== "Realizado";
      return dataServicoSemHora === hojeSemHora && statusValido;
    })
    .sort((a, b) => new Date(a.dataServico) - new Date(b.dataServico))[0]; // Ordenar por proximidade
  
    
    
    const handleIniciarAgendamento = async (agendamento) => {
        setLoading(true);

        try {        
            const response = await iniciarAgendamento(agendamento?.id);
            await fetchPrestadorInfo(setPrestador)
            setLoading(false)
            setOpen(false)
            console.log("Agendamento atualizado com sucesso!", response);

        } catch (error) {
            console.error("Erro ao atualizar o agendamento:", error);
        }

    };

    const handlePausarAgendamento = async (agendamento) => {
        setLoading(true);

        try {        
            const response = await pausarAgendamento(agendamento?.id);
            await fetchPrestadorInfo(setPrestador)
            setLoading(false)
            setOpenPausar(false)
            console.log("Agendamento atualizado com sucesso!", response);

        } catch (error) {
            console.error("Erro ao atualizar o agendamento:", error);
        }
    };

    const handleRetornarAgendamento = async (agendamento) => {
        setLoading(true);

        try {        
            const response = await retornarAgendamento(agendamento?.id);
            await fetchPrestadorInfo(setPrestador)
            setLoading(false)
            setOpenRetornar(false)
            console.log("Agendamento atualizado com sucesso!", response);

        } catch (error) {
            console.error("Erro ao atualizar o agendamento:", error);
        }
    };

    const handleFinalizarServico = async (agendamento) => {
        setLoading(true);

        try {        
            const response = await finalizarAgendamento(agendamento?.id);
            await fetchPrestadorInfo(setPrestador)
            setLoading(false)
            setFinalizar(false)
            setSucess(true)
            console.log("Agendamento atualizado com sucesso!", response);

        } catch (error) {
            console.error("Erro ao atualizar o agendamento:", error);
        }

    };

    console.log("Agendamentos: ", agendamentosFiltrados)

    return (
        <section className='w-full  gap-1 pb-[8vh] pt-[8vh] sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim'>
            <div className='p-5 flex flex-col gap-5'>
                <div className="flex flex-col sm:flex-row items-center gap-4 ">
                    <input
                        type="text"
                        placeholder="Pesquisar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border p-2 rounded-lg w-full border-bord focus:outline-bord"
                    />

                    <div className='flex justify-between w-full gap-5 items-center'>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border p-2 rounded-lg w-full border-bord focus:outline-bord"
                            placeholder="Início"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border p-2 rounded-lg w-full border-bord focus:outline-bord"
                            placeholder="Fim"
                        />

                    </div>

                    <Button
                        className='w-full border shadow-sm bg-trans text-desSec justify-start'
                        onPress={() => setScreenSelected("avaliacoes")}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>

                        Minhas Avaliações
                        
                    </Button>
                        
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-5 w-full min-h-[50vh] rounded-xl shadow-md justify-between'>
                    {/* relogio */}
                    <div className='w-full h-full '>
                        <Temporizador
                            agendamento={proximoAgendamento}
                            setRunnig={setRunnig}
                        />
                    </div>

                    {/* Agedamento em andamento */}
                    <div className='w-full h-full justify-center flex'>
                        {proximoAgendamento ? (
                            <div className="flex flex-col rounded-lg p-5 gap-10 h-full justify-between w-full">
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
                                        {/* <p className='font-semibold'>{new Date(proximoAgendamento?.timeStart)}</p> */}
                                        <p className='font-semibold'>{new Date(proximoAgendamento?.timeStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}h</p>
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
                                        <Button className="w-full bg-sec text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 mr-2 inline-block">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                                            </svg>
                                            Abrir com o Google Maps
                                        </Button>
                                    </a>

                                    {proximoAgendamento?.status == 'Repouso' ? (
                                        <Button
                                            className="bg-white text-sec border"
                                            onPress={() => (setOpenRetornar(true)) }
                                        >
                                            Voltar ao serviço 
                                        </Button>

                                    ) : (
                                        <Button
                                            className="bg-white text-sec border"
                                            onPress={() => (setOpenPausar(true)) }
                                            isDisabled={!!proximoAgendamento?.timePause }
                                        >
                                            {!!proximoAgendamento?.timePause ? "Você ja fez uma pausa" : "Pausar serviço"} 
                                        </Button>

                                    )}

                            
                                    <Button
                                        className={` border bg-white w-full 
                                            ${proximoAgendamento?.status === "Iniciado" && !runnig ? "text-sec font-semibold" : "text-desSec"} 
                                        `}
                                        isDisabled={proximoAgendamento?.status === "Iniciado" && runnig || proximoAgendamento?.status === 'Repouso' }
                                        onPress={() => proximoAgendamento?.status === "Iniciado" && !runnig ? setFinalizar(true)  : setOpen(true)  }
                                    >
                                        {   proximoAgendamento?.status === "Iniciado" && runnig
                                            ? "Serviço em andamento"
                                            : proximoAgendamento?.status === "Iniciado" && !runnig
                                            ? "Concluir serviço" 
                                            : proximoAgendamento?.status === "Repouso" ? "Em repouso" 
                                            : "Iniciar serviço"
                                        }
                                    </Button>

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
                                                <h2 className='text-desSec'>Iniciar agendamento</h2>
                                            </div>
                                        </ModalHeader>

                                        <ModalBody>
                                            <div className="text-neutral-400 flex  w-full justify-between gap-5 pt-5 pb-5 ">
                                                <div className='text-ter grid gap-2'>
                                                    <p>Deseja iniciar o serviço?</p>
                                                </div>
                                                
                                            </div>
                                        </ModalBody>
                                        <ModalFooter className='shadow-none'>
                                            <Button className=' text-prim border bg-white w-1/2' isDisabled={loading} onPress={() => onClose()}>
                                                Voltar
                                            </Button>
                                            <Button className='bg-desSec text-white w-1/2' isDisabled={loading} onPress={() => handleIniciarAgendamento(proximoAgendamento)}>
                                                {loading ? <Spinner/> : "Confirmar"}
                                            </Button>
                                        </ModalFooter>
                                        </>
                                    )}
                                    </ModalContent>
                                </Modal>

                                <Modal 
                                    backdrop="opaque" 
                                    isOpen={openFinalizar} 
                                    onClose={setFinalizar}
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
                                                <h2 className='text-sec'>Finalizar serviço</h2>
                                            </div>
                                        </ModalHeader>

                                        <ModalBody>
                                            <div className="text-neutral-400 flex  w-full justify-between gap-5 pt-5 pb-5 ">
                                                <div className='text-ter grid gap-2'>
                                                    <p>Deseja finalizar o serviço?</p>
                                                </div>
                                                
                                            </div>
                                        </ModalBody>
                                        <ModalFooter className='shadow-none'>
                                            <Button className=' text-prim border bg-white w-1/2' isDisabled={loading} onPress={() => onClose()}>
                                                Voltar
                                            </Button>
                                            <Button className='bg-desSec text-white w-1/2' isDisabled={loading} onPress={() => handleFinalizarServico(proximoAgendamento)}>
                                                {loading ? <Spinner/> : "Confirmar"}
                                            </Button>
                                        </ModalFooter>
                                        </>
                                    )}
                                    </ModalContent>
                                </Modal>

                                <Modal 
                                    backdrop="opaque" 
                                    isOpen={openPausar} 
                                    onClose={setOpenPausar}
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
                                                <h2 className='text-sec'>Deseja fazer uma pausa?</h2>
                                            </div>
                                        </ModalHeader>

                                        <ModalBody>
                                            <div className="text-neutral-400 flex  w-full justify-between gap-5 pt-5 pb-5 ">
                                                <div className='text-ter grid gap-2'>
                                                    <p>não se preocupe, assim que você retornar da sua pausa, o seu horário para terminar o serviço será calculado novamente :)</p>
                                                </div>
                                                
                                            </div>
                                        </ModalBody>
                                        <ModalFooter className='shadow-none'>
                                            <Button className=' text-prim border bg-white w-1/2' isDisabled={loading} onPress={() => onClose()}>
                                                Voltar
                                            </Button>
                                            <Button className='bg-desSec text-white w-1/2' isDisabled={loading} onPress={() => handlePausarAgendamento(proximoAgendamento)}>
                                                {loading ? <Spinner/> : "Confirmar"}
                                            </Button>
                                        </ModalFooter>
                                        </>
                                    )}
                                    </ModalContent>
                                </Modal>

                                <Modal 
                                    backdrop="opaque" 
                                    isOpen={openRetornar} 
                                    onClose={setOpenRetornar}
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
                                                <h2 className='text-sec'>Retornar ao serviço</h2>
                                            </div>
                                        </ModalHeader>

                                        <ModalBody>
                                            <div className="text-neutral-400 flex  w-full justify-between gap-5 pt-5 pb-5 ">
                                                <div className='text-ter grid gap-2'>
                                                    <p>Deseja retornar ao serviço?</p>
                                                </div>
                                                
                                            </div>
                                        </ModalBody>
                                        <ModalFooter className='shadow-none'>
                                            <Button className=' text-prim border bg-white w-1/2' isDisabled={loading} onPress={() => onClose()}>
                                                Voltar
                                            </Button>
                                            <Button className='bg-desSec text-white w-1/2' isDisabled={loading} onPress={() => handleRetornarAgendamento(proximoAgendamento)}>
                                                {loading ? <Spinner/> : "Confirmar"}
                                            </Button>
                                        </ModalFooter>
                                        </>
                                    )}
                                    </ModalContent>
                                </Modal>



                            </div>
                        
                        ) : (
                            <div className='text-center w-full flex flex-col gap-10'>
                                <p className="font-semibold">Nenhum serviço pra hoje.</p>
                            </div>
                        )}

                        <Modal 
                            backdrop="opaque" 
                            isOpen={sucess} 
                            onClose={setSucess}
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
                                        <h2 className='text-sec'>Sucesso!</h2>
                                    </div>
                                </ModalHeader>

                                <ModalBody>
                                    <div className="text-neutral-400 flex  w-full justify-between gap-5 pt-5 pb-5 ">
                                        <div className='text-ter grid gap-2'>
                                            <p>Você concluiu esse serviço com sucesso! :D</p>
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter className='shadow-none'>
                                    <Button className='bg-desSec text-white w-1/2'  onPress={() => (onClose())}>
                                        Continuar
                                    </Button>
                                </ModalFooter>
                                </>
                            )}
                            </ModalContent>
                        </Modal>                        
                    </div>

                </div>

                {agendamentosFiltrados && agendamentosFiltrados.length > 0 ? (
                    agendamentosFiltrados.map((agendamento) => {
                        // Lógica de cálculo
                        const taxaPrestador = (valor) => valor * 0.75;
                        const ValorBruto = agendamento.valorLiquido + agendamento.descontoTotal;
                        const qtdAgendamentos = ValorBruto / agendamento.valorServico;
                        const descontoPorServico = agendamento.descontoTotal / qtdAgendamentos;
                        const valorLiquidoServico = agendamento.valorServico - descontoPorServico;

                        return (
                            <>
                                <div className="flex flex-col gap-3 shadow-md shadow-bord rounded-lg p-5 justify-center items-start">
                                    <div className='flex flex-col  gap-5 items-start w-full justify-between p-2'>
                                        <div className='w-full flex gap-2 items-center '>
                                            <Avatar 
                                                src={User} 
                                                alt="avatarPrestador"
                                                size='lg'
                                            />
                                            <h3 className='text-prim font-semibold flex flex-wrap text-center'>{agendamento.cliente?.name}</h3>
                                                                                                            
                                        </div>

                                        <div className='flex flex-col gap-2 w-full  '>
                                            <div className="overflow-y-auto  bg-white  rounded-md text-ter w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-5 ">
                                                <div className='text-prim w-full flex flex-col gap-5'>
                                                    <div className='flex gap-5  text-prim'>
                                                        <p className='font-semibold'>Serviço de {agendamento.timeTotal}hr - {agendamento.Servico} - {formatarData(new Date(agendamento?.dataServico).toISOString().split('T')[0])} - {agendamento.horaServico} </p> 
                                                    </div>
    
                                                    <div className='flex flex-col w-full gap-5 '>    
                                                        <div >    
                                                            <div className='w-full flex justify-between'>
                                                                <span>
                                                                    Valor Serviço: 
                                                                </span>
                                                                {formatarMoeda(taxaPrestador(agendamento.valorServico))}
                                                            </div>
    
                                                        </div>    
                                                    </div>
    
    
                                                    <div className='w-4/12 sm:w-auto text-center pt- sm:pt-0 flex items-center justify-start gap-5'>
                                                        <div className={`p-2 rounded-md text-white ${agendamento.status === 'Agendado' ? " bg-des" : agendamento.status === "Iniciado" ? "bg-desSec" : agendamento.status === "Cancelado" ? "bg-error" : agendamento.status === "Realizado" ? "text-sec bg-sec " : ""} `}>{agendamento.status}</div>
                                                    </div>
    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Accordion isCompact itemClasses={{ title: "text-prim" }}>
                                        <AccordionItem key={agendamento.id} title="Detalhes">
                                            <div className="mt-2">
                                                <div className="flex flex-col gap-7 text-prim overflow-y-auto max-h-[60vh]">
                                                    <div className="text-justify flex flex-col gap-2">
                                                        <p>
                                                            <b>Serviço de {agendamento.timeTotal}hr</b>
                                                        </p>
                                                        <p>
                                                            <b>Serviço:</b> {agendamento?.Servico}
                                                        </p>
                                                        <p>
                                                            <b>Observação:</b>{" "}
                                                            {agendamento?.observacao
                                                                ? agendamento.observacao
                                                                : "Nenhuma observação."}
                                                        </p>
                                                        <p>
                                                            <b>Valor serviço:</b> {formatarMoeda(taxaPrestador(valorLiquidoServico))}
                                                        </p>
                                                        <p>
                                                            <b>Data:</b>{" "}
                                                            {formatarData(new Date(agendamento?.dataServico).toISOString().split('T')[0])}
                                                        </p>
                                                        <div className="flex flex-col gap-2 max-w-[100vh]">
                                                            <p>
                                                                <b>Endereço:</b> {agendamento?.enderecoCliente}
                                                            </p>
                                                            <a
                                                                href={`https://www.google.com/maps/place/${encodeURIComponent(
                                                                    agendamento?.enderecoCliente
                                                                )}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <Button className="w-full bg-sec text-white">
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
                                                                </Button>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </>
                        );
                    })
                ) : (
                    <div className="text-prim text-center flex flex-col justify-center items-center h-[70vh]">
                        <p>Você não possui nenhum agendamento</p>
                    </div>
                )}

            </div>
            
        </section>
    )
}

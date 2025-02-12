import React, { useState } from 'react'
import { useUser } from '../../context/UserProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from '@nextui-org/button';
import { Avatar } from '@nextui-org/avatar';
import { formatarData } from '../../common/FormatarData';
import { formatarMoeda } from '../../common/FormatarMoeda';
import { calcularIdade } from '../../common/CalcularIdade';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import CreateAvaliacao from './CreateAvaliacao';
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter} from "@nextui-org/modal";
import Temporizador from '../Prestador/Temporizador';


export default function Pedidos() {
    const { user } = useUser()
    const navigate = useNavigate()
    const [selectedAgendamento, setSelectedAgendamento] = useState([])
    const [openPerfil, setOpenPerfil] = useState(false)
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [ runnig, setRunnig ] = useState(false)
    const [ disablePause, setDisablePause ] = useState(false)
    const [ changeHistorico, setChangeHistorico ] = useState(false)
    
    
    const calcularValorLiquido = (valorLiquido, desconto, valorServico) => {
        const ValorBruto =  valorLiquido + desconto
        const qtdAgendamentos = ValorBruto / valorServico
        const descontoPorServico = desconto / qtdAgendamentos

        const descontoTotalServico = valorServico - descontoPorServico

        return formatarMoeda(descontoTotalServico)

    }

    const calcularValorDesconto = (valorLiquido, desconto, valorServico) => {
        const ValorBruto =  valorLiquido + desconto
        const qtdAgendamentos = ValorBruto / valorServico
        const descontoPorServico = desconto / qtdAgendamentos

        return formatarMoeda(descontoPorServico)

    }

    const calcularQtdAgendamentos = (valorLiquido, desconto, valorServico) => {
        const ValorBruto =  valorLiquido + desconto
        const qtdAgendamentos = ValorBruto / valorServico
    
        return qtdAgendamentos

    }

    const calcularValorBruto = (valorLiquido, desconto, valorServico) => {
        const ValorBruto =  valorLiquido + desconto
    
        return formatarMoeda(ValorBruto)

    }

    const MapsLocate = (logradouro, numero, bairro, cidade, estado, cep) => {
        const local = `${logradouro}, ${numero} - ${bairro}, ${cidade} - ${estado}, ${cep} `

        return local
    }

    const calcularMediaStars = (reviews) => {
        if (!reviews || reviews.length === 0) return 0; // Retorna 0 caso não tenha avaliações
        const totalStars = reviews.reduce((acc, avaliacao) => acc + avaliacao.stars, 0);
        const averageStars = totalStars / reviews.length;
        return averageStars;
    };

    function StarReview({ filled }) {
        return (
            <span
                className={`text-4xl ${
                    filled ? 'text-des' : 'text-prim'
                }`}
            >
                ★
            </span>
        );
    }

    // Função para filtrar os agendamentos com base no nome e na data
    const agendamentosFiltrados = user?.agendamentos && user?.agendamentos?.filter((agendamento) => {
        const nameMatch = agendamento.Servico.toLowerCase().includes(searchTerm.toLowerCase());
        const dateMatch = (!startDate || new Date(agendamento.dataServico) >= new Date(startDate)) &&
                          (!endDate || new Date(agendamento.dataServico) <= new Date(endDate));
    
        // Aplica o filtro de status apenas se changeHistorico for true
        const statusMatch = changeHistorico ? ["Cancelado", "Realizado"].includes(agendamento.status) : ["Agendado", "Iniciado"].includes(agendamento.status)
    
        return nameMatch && dateMatch && statusMatch;
    }).sort((a, b) => changeHistorico ? new Date(b.dataServico) - new Date(a.dataServico) : new Date(a.dataServico) - new Date(b.dataServico)  )



    const hoje = new Date();

    
    // Remover horas para comparar apenas a data
    const hojeSemHora = Date.UTC(
        hoje.getUTCFullYear(),
        hoje.getUTCMonth(),
        hoje.getUTCDate()
    );

    const agendamentosDoMesmoDia = user?.agendamentos?.filter(agendamento => {
       const dataServico = new Date(agendamento.dataServico);
        const dataServicoSemHora = Date.UTC(
            dataServico.getUTCFullYear(),
            dataServico.getUTCMonth(),
            dataServico.getUTCDate()
        );

        // Verifica se o agendamento ainda está em andamento ou em repouso
        const statusValido = !["Cancelado", "Realizado"].includes(agendamento.status);

        // Manter apenas agendamentos do dia ou não concluídos dos dias anteriores
        return (dataServicoSemHora <= hojeSemHora && statusValido);
    })
    .sort((a, b) => new Date(b.timeStart) - new Date(a.timeStart)); // Ordenando do mais recente para o mais antigo
    
    const handleChange = () => {
        setChangeHistorico(!changeHistorico)
        setSearchTerm("")
    }
      

    return (
        <section className='w-full gap-1 pb-[8vh] pt-[8vh] sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim'>
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

                    <div className='flex gap-2 flex-col w-full md:flex-row-reverse'>
                        <div className='w-full'>
                            <Button className='w-full bg-sec text-white' onPress={() => (handleChange())}>
                                {changeHistorico ? "Voltar" : "Histórico de agendamentos"}
                            </Button>
                        </div>
                        <div className='w-full sm:hidden'>
                            <Button className='w-full text-desSec font-semibold  bg-white border-2' onPress={() => (navigate("/contrate-online"))}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="size-6">
                                    <path strokeLinecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                                Agendar novo serviço
                            </Button>
                        </div>

                    </div>
                </div>

                {agendamentosDoMesmoDia && (
                    agendamentosDoMesmoDia.sort((a, b) => {
                        const prioridade = (status) => {
                            if (status === "Iniciado") return 1;
                            if (status === "Agendado") return 2;
                            return 3;
                        };
                    
                        // Comparação pela prioridade do status
                        const prioridadeDiff = prioridade(a.status) - prioridade(b.status);
                    
                        return prioridadeDiff;
                    }) 
                    .map((agendamento) => (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5 w-full min-h-[50vh] rounded-xl shadow-md justify-between'>
                            {/* relogio */}
                            <div className='w-full h-full '>
                                <Temporizador
                                    agendamento={agendamento}
                                    setRunnig={setRunnig}
                                    setDisablePause={setDisablePause}
                                />
                            </div>

                            {/* Agedamento em andamento */}
                            <div className='w-full h-full justify-center flex'>
                                <div className="flex flex-col rounded-lg p-5 gap-10 h-full justify-between w-full">
                                    <div className='flex flex-col gap-2 text-prim'>
                                        <div className='w-full flex gap-2 items-center '
                                            onClick={() => {
                                                setSelectedAgendamento(agendamento)
                                                setOpenPerfil(true)
                                            }}
                                        >
                                                <Avatar 
                                                    src={agendamento.user.avatarUrl.avatarUrl} 
                                                    alt="avatarPrestador"
                                                    size='lg'
                                                />
                                                <h3 className='text-prim font-semibold flex flex-wrap text-center'>{agendamento.user.name}</h3>
                                                                                                            
                                        </div>
                                        <div className='flex gap-5 justify-between text-prim'>
                                            <p className='font-semibold'>Serviço de {agendamento.timeTotal}hr</p>
                                            <p className='font-semibold'> {agendamento.Servico}</p>
                                            <p className='font-semibold'>{formatarData(new Date(agendamento?.dataServico).toISOString().split('T')[0])} </p>
                                            <p className='font-semibold'>{agendamento.horaServico}</p>
                                        </div>
                                        <p> {agendamento.enderecoCliente}</p>
                                        <div>
                                            <p>{formatarMoeda(agendamento.valorLiquido)}</p>
                                        </div>

                                        
                                        
                                    </div>
                                    <div className='grid grid-cols-1  gap-3 items-center w-full justify-between '>
                                        <a 
                                            href={`https://www.google.com/maps/place/${encodeURIComponent(agendamento.enderecoCliente)}`} 
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

                                        {(agendamento?.status === "Iniciado" || agendamento?.status === "Repouso") && (
                                            <Button
                                                className='bg-white border text-desSec' 
                                                isDisabled
                                            >
                                                {agendamento?.status === "Repouso" ? "Serviço em repouso" : "Serviço em andamento"}
                                            </Button>
                                        )}



                                    </div>
                                </div>
                                
                            </div>

                        </div>
                    ))
                )}


                {user?.agendamentos.length > 0 ? (
                    agendamentosFiltrados.map((agendamento) => (
                        <>
                            <div className='flex flex-col gap-3  shadow-lg shadow-bord rounded-lg p-5 justify-center items-start'>
                                <div className='flex flex-col  gap-5 items-start w-full justify-between p-2'>
                                    <div className='w-full flex gap-2 items-center '
                                        onClick={() => {
                                            setSelectedAgendamento(agendamento)
                                            setOpenPerfil(true)
                                        }}
                                    >
                                            <Avatar 
                                                src={agendamento.user.avatarUrl.avatarUrl} 
                                                alt="avatarPrestador"
                                                size='lg'
                                            />
                                            <h3 className='text-prim font-semibold flex flex-wrap text-center'>{agendamento.user.name}</h3>
                                                                                                        
                                    </div>

                                    <div className='flex flex-col gap-2 w-full  '>
                                        <div className="overflow-y-auto  bg-white  rounded-md text-ter w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-5 ">
                                            
                                            <div className='text-prim w-full flex flex-col gap-5'>
                                                <div className='flex gap-5  text-prim'>
                                                    <p className='font-semibold'>Serviço de {agendamento.timeTotal}hr - {agendamento.Servico} - {formatarData(new Date(agendamento?.dataServico).toISOString().split('T')[0])} - {agendamento.horaServico} </p> 
                                                </div>

                                                <div className='flex flex-col w-full gap-5 '>
                                                    {calcularQtdAgendamentos(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico) > 1 && (
                                                        <div>
                                                            {calcularQtdAgendamentos(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico) > 1 && (
                                                                <div className='w-full flex justify-between'>
                                                                    <span>
                                                                        Combo:
                                                                    </span> 
                                                                    {

                                                                    calcularValorBruto(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico)}
                                                                </div>



                                                            )}

                                                            {calcularQtdAgendamentos(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico) > 1 && (
                                                                <div className='w-full flex justify-between'>
                                                                    <span>
                                                                        Desconto Total:
                                                                    </span> 
                                                                    {calcularQtdAgendamentos(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico) ? formatarMoeda(agendamento?.descontoTotal) : "Não"}
                                                                </div>
                                                            )}

                                                            {calcularQtdAgendamentos(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico) > 1 && (
                                                                <div className='w-full flex justify-between'>
                                                                    <span>
                                                                        Valor pago:
                                                                    </span> 
                                                                    {formatarMoeda(agendamento?.valorLiquido)}
                                                                </div>
                                                            )}

                                                            

                                                        </div>

                                                    )}

                                                    <div >
                                                        {
                                                        calcularQtdAgendamentos(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico) <= 1 &&
                                                            <div className='w-full flex justify-between'>
                                                                <span>
                                                                    Cupom Desconto:
                                                                </span> 
                                                                {calcularValorDesconto(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico)}
                                                            </div>
                                                        
                                                        }

                                                        <div className='w-full flex justify-between'>
                                                            <span>
                                                                Valor Serviço: 
                                                            </span>
                                                            {formatarMoeda(agendamento.valorServico)}
                                                        </div>
                                                        <div className='w-full flex justify-between'>
                                                            <span>
                                                                {calcularQtdAgendamentos(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico) > 1  ? "Total" : "Valor Pago"}
                                                            </span> 
                                                            {calcularValorLiquido(agendamento?.valorLiquido, agendamento?.descontoTotal, agendamento?.valorServico)}
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

                                <Accordion isCompact itemClasses={{title: "text-prim"}}>
                                    <AccordionItem key={agendamento.id} title="Detalhes" >
                                        
                                        <div className="mt-2">
                                            {agendamento.status === "Realizado" && (
                                                <CreateAvaliacao
                                                    agendamento={agendamento}
                                                />

                                            )}

                                            <div className="flex flex-col gap-7 text-prim   ">
                                                <p className='font-semibold border-t-2 pt-5 border-bord'>Agendamento feito dia {new Date(agendamento?.dataAgendamento).toLocaleDateString('pt-BR', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}</p>
                                                
                                                <div className='text-justify flex flex-col gap-4'>
                                                    <p>
                                                        <b>Serviço de {agendamento.timeTotal}hr</b>
                                                    </p>

                                                    {agendamento.status === "Realizado" && (
                                                        <div>
                                                            <>
                                                                <p>
                                                                    <b>Data e hora que iniciou: </b>
                                                                    {new Date(agendamento?.timeStart).toLocaleString('pt-BR', {
                                                                        day: '2-digit',
                                                                        month: '2-digit',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    })}
                                                                </p>

                                                                <p>
                                                                    <b>Tempo de repouso: </b>
                                                                    {agendamento?.totalPausado ? (agendamento?.totalPausado / 60000).toFixed(2) + " min" : "0 min"}
                                                                </p>

                                                                <p>
                                                                    <b>Tempo de trabalho: </b>
                                                                    {(() => {
                                                                        const timeStart = new Date(agendamento?.timeStart).getTime();
                                                                        const timeFinally = new Date(agendamento?.timeFinally).getTime();
                                                                        const timePause = agendamento?.totalPausado || 0; // Garante que seja um número válido

                                                                        const diff = (timeFinally - timeStart) - timePause; // Subtrai o tempo de pausa da diferença total

                                                                        const hoursWorked = Math.floor(diff / 1000 / 60 / 60); // Converte para horas
                                                                        const minutesWorked = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); // Converte para minutos restantes

                                                                        return `${hoursWorked}h ${minutesWorked}m`;
                                                                    })()}
                                                                </p>

                                                                <p>
                                                                    <b>Data e hora que terminou: </b>
                                                                    {new Date(agendamento?.timeFinally).toLocaleString('pt-BR', {
                                                                        day: '2-digit',
                                                                        month: '2-digit',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    })}
                                                                </p>

                                                            </>

                                                        </div>
                                                        

                                                    )}

                                                    <p><b>Serviço:</b> {agendamento?.Servico}</p>

                                                    <p><b>Prestador:</b> {agendamento?.user?.name}</p>
                                                    

                                                    <p><b>Observação:</b> {agendamento?.observacao ? agendamento.observacao : "Nenhuma obervação."}</p>


                                                    <p><b>Data:</b> {formatarData(new Date(agendamento?.dataServico).toISOString().split('T')[0])}</p>
                                                    <div className='flex flex-col gap-2 max-w-[100vh]'>
                                                        <p><b>Endereço:</b> {agendamento?.enderecoCliente}</p>
                                                        <a 
                                                            href={`https://www.google.com/maps/place/${encodeURIComponent(MapsLocate(agendamento?.logradouro, agendamento?.numero, agendamento?.bairro, agendamento?.cidade, agendamento?.estado, agendamento?.cep))}`} 
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


                                        </div>


                                    </AccordionItem>
                                </Accordion>

                            </div>
                        
                        </>
                    ))
                
                ) : (
                    <div className='text-prim text-center flex flex-col justify-center items-center h-[70vh] '>
                        <p>Você não possui nenhum agendamento</p>
                        <div className='pt-5'>
                            <a href="/contrate-online">
                                <Button className='bg-des text-white'>
                                    Fazer agendamento
                                </Button>
                            </a>
                        </div>
                    </div>
                )}

                <Modal 
                    backdrop="opaque" 
                    isOpen={openPerfil} 
                    onOpenChange={setOpenPerfil}
                    placement='center'
                    classNames={{
                        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 "
                    }}
                    className='max-w-[40vh] sm:max-w-[80vh]'
                >
                    <ModalContent>
                        {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 p-0 text-desSec"></ModalHeader>
                            <ModalBody className='p-0'>

                            <div className="bg-white pb-4 pt-0 p-0 ">
                                <div className="sm:flex sm:items-start flex-col">
                                    {selectedAgendamento?.user && ( // Renderiza as informações do provider selecionado
                                        <div className="pt-0 p-0 flex flex-col w-full bg-pri max-h-[60vh] sm:max-h-[65vh]">
                                            <div className='flex flex-col gap-2 justify-start'>
                                                <div className="flex items-center space-x-96 lg:pl-10 pl-5 p-20  pb-5 bg-desSec  ">
                                                    {/* Container do Avatar */}
                                                    <div className="absolute">
                                                        <Avatar src={selectedAgendamento?.user?.avatarUrl?.avatarUrl} size="lg"    
                                                        className="w-24 h-24 text-large
                                                        border-white
                                                        border-5
                                                        "
                                                        />
                                                    </div>
                                                    
                                                </div>
                                            </div>

                                            <div className='flex justify-end items-center gap-2 pr-5 pt-2'>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <StarReview
                                                        key={star}
                                                        filled={star <= calcularMediaStars(selectedAgendamento?.user.Review)}
                                                    />
                                                ))}
                                            </div>
                                            
                                            <div className='overflow-y-auto max-h-[80vh] '>
                                                <div className='p-5 pb-1'>
                                                    <div className='border rounded-lg border-bord w-full shadow-md  bg-white p-5 '>
                                                        <h1 className='text-prim font-semibold text-xl'>{selectedAgendamento?.user?.name}</h1>
                                                        <p className='text-prim text-[0.8rem]'>
                                                            {calcularIdade(selectedAgendamento?.user?.data)} anos
                                                        </p>
                                                        <p className='text-[0.8rem] text-prim pb-2'>{selectedAgendamento?.user?.genero}</p>
                                                        <div className='overflow-y-auto lg:h-[20vh]'>
                                                            <p className='text-prim text-start pt-4 text-sm'>{selectedAgendamento?.user?.sobre}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='p-5'>
                                                    <div className='border rounded-lg border-bord w-full shadow-md  bg-white p-5 '>
                                                        <Accordion>
                                                            <AccordionItem  key="1" aria-label="Accordion 1" title={`Avaliações ( ${selectedAgendamento?.user?.Review.length} )`} classNames={{title: 'text-prim text-md '}} >
                                                                <div className='flex flex-col gap-5'>
                                                                    {selectedAgendamento?.user && (
                                                                        selectedAgendamento?.user?.Review.length == 0 ? (
                                                                            <div className=' p-5 text-prim flex flex-col justify-center text-center'>
                                                                                <h3 className='font-semibold'>Sem avaliações</h3>
                                                                            </div>
                                                                            
                                                                        ) : (
                                                                            selectedAgendamento?.user?.Review.map((avaliacao) => (
                                                                                <div key={avaliacao.id} className=' p-5 border border-bord rounded-md text-prim flex flex-col gap-2'>
                                                                                    <h3 className='font-semibold'>{new Date(avaliacao.createdAt).toLocaleDateString('pt-BR', {
                                                                                        day: '2-digit',
                                                                                        month: 'long',
                                                                                        year: 'numeric'
                                                                                    })}</h3>
                                                                                    <p className='text-prim'>{avaliacao?.comment === "" ? <span className='text-prim text-opacity-40'>Nenhum comentário</span>: avaliacao.comment}</p>
                                                                                    <div className='flex justify-start items-center gap-2 pr-5 pt-2'>
                                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                                            <StarReview
                                                                                                key={star}
                                                                                                filled={star <= avaliacao.stars}
                                                                                            />
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            ))
                                                                        )
                                                                    )}
                                                                </div>
                                                            </AccordionItem>
                                                        </Accordion>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                                                                            

                
                            </ModalBody>
                            <ModalFooter>
                            <Button className='bg-desSec text-white' onPress={onClose}  >
                                Fechar
                            </Button>
                            </ModalFooter>
                        </>
                        )}
                    </ModalContent>
                </Modal>

            </div>
        </section>
    )
}

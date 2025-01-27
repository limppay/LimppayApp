import { Avatar, Button, Spinner } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'
import { formatarMoeda } from '../../common/FormatarMoeda'
import { formatarData } from "../../common/FormatarData"
import { getGastoMes, getPrestadorMaisContratado, getSolicitacoesDoMes, getSolicitacoesTotal } from '../../services/api';
import { useUser } from '../../context/UserProvider';
import User from "../../assets/img/diarista-cadastro/user.webp"
import { useNavigate } from 'react-router-dom';


export default function Painel() {
    const { user } = useUser()
    const navigate = useNavigate()
    const [ loading, setLoading ] = useState(false)
    const [SolicitacoesDoMes, setSolicitacoesDoMes] = useState(0);
    const [SolicitacoesTotal, setSolicitacoesTotal] = useState(0);
    const [PrestadorMaisContratado, setPrestadorMaisContratado] = useState()
    const [GastoMes, setGastoMes] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        if (!user?.id) return

        const fetchData = async () => {
            setLoading(true)
            try {
                const [solMes, solTotal, fatMes, prestador] = await Promise.all([
                    getSolicitacoesDoMes(user.id),
                    getSolicitacoesTotal(user.id),
                    getGastoMes(user.id),
                    getPrestadorMaisContratado(user.id),
                ]);

                setSolicitacoesDoMes(solMes);
                setSolicitacoesTotal(solTotal);
                setGastoMes(fatMes);
                setPrestadorMaisContratado(prestador);

                setLoading(false)

            } catch (error) {
                console.error("Erro ao buscar dados do dashboard:", error);
                setLoading(false)

            }
        };

        fetchData()

    }, [user?.id]);

    // Função para filtrar os agendamentos com base no nome e na data
    const agendamentosFiltrados = user?.agendamentos.length > 0 && user?.agendamentos.filter((agendamento) => {
        const nameMatch = agendamento.user.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filtra pela data, caso as datas de início e fim estejam definidas
        const dateMatch = (startDate && new Date(agendamento.dataServico) >= new Date(startDate)) && (endDate && new Date(agendamento.dataServico) <= new Date(endDate));

        // Retorna true se ambos os filtros (nome e data) coincidirem
        return nameMatch && (!startDate || !endDate || dateMatch);
    });

    
    return (
        <div className="md:pt-28 flex-1 p-6 pb-[8vh] pt-[10vh] overflow-y-auto  ">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Solicitações do mês */}
                <div className="bg-white  shadow-md rounded-lg p-6">
                    <h2 className="text-desSec text-sm md:text-lg font-semibold text-gray-600 mb-4">
                        Solicitações do Mês
                    </h2>
                    <p className="text-desSec text-3xl font-bold text-gray-800">
                        {SolicitacoesDoMes || 0}
                    </p>
                </div>

                {/* Total de agendamentos */}
                <div className="bg-white  shadow-md rounded-lg p-6">
                    <h2 className="text-desSec text-sm md:text-lg font-semibold text-gray-600 mb-4">Total de Agendamentos</h2>
                    <p className="text-desSec text-3xl font-bold text-gray-800">{SolicitacoesTotal || 0}</p>
                </div>

                {/* Total de gastos no mês */}
                <div className="bg-white shadow-md rounded-lg p-6 col-span-2 lg:col-span-1">
                    <h2 className="text-desSec text-sm md:text-lg font-semibold text-gray-600 mb-4">Gasto no mês</h2>
                    <p className="text-desSec text-3xl font-bold text-gray-800">
                        {formatarMoeda(GastoMes.toFixed(2) || "0.00")}
                    </p>
                </div> 
                
                <div className='w-full sm:hidden col-span-2'>
                    <Button className='w-full text-desSec bg-white border-2 font-semibold' onPress={() => (navigate("/contrate-online"))}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="size-6">
                            <path strokeLinecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                        Agendar novo serviço
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-5">
                {/* Prestador mais contratado */}
                <div className="bg-white  shadow-md rounded-lg p-6">
                    <h2 className="text-desSec text-sm md:text-lg font-semibold text-gray-600 mb-4">Prestador Mais Contratado</h2>
                    <div className="flex items-center ">
                        {loading ? (
                            <div className='w-full flex justify-center items-center text-white pt-[5vh]'>
                                <Spinner size='lg'/>
                            </div>

                        ) : (
                            PrestadorMaisContratado ? (
                                <>
                                    <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden mr-4">
                                        <Avatar
                                            src={PrestadorMaisContratado?.avatarUrl?.avatarUrl || User}
                                            alt={PrestadorMaisContratado?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span className="text-desSec  font-medium">
                                        {PrestadorMaisContratado?.name || <span className='text-white'> <Spinner/> </span> }
                                    </span>
                                
                                </>

                            ) : (
                                <span  className='text-sm text-prim'>Não há dados o suficiente.</span>

                            )


                        )}
                    </div>

                </div>                                        

                {/* Próximo Agendamento */}
                <div className="bg-white  rounded-lg lg:col-span-2 ">
                    <h2 className="text-desSec text-lg font-semibold text-gray-600 mb-2">Próximo Agendamento</h2>
                    <div className="flex flex-col gap-6">
                        {agendamentosFiltrados && agendamentosFiltrados.length > 0 ? (
                            (() => {
                                const hoje = new Date();

                                // Filtrar apenas agendamentos futuros com status "Agendado"
                                const agendamentosFuturos = agendamentosFiltrados.filter(
                                    agendamento =>
                                        new Date(agendamento.dataServico) >= hoje &&
                                        agendamento.status === "Agendado"
                                );

                                if (agendamentosFuturos.length === 0) {
                                    return <p className="text-prim flex-1">Nenhum agendamento futuro encontrado com status "Agendado".</p>;
                                }

                                // Ordenar por data e hora
                                const agendamentosOrdenados = agendamentosFuturos.sort((a, b) => {
                                    const dataA = new Date(a.dataServico).setHours(...a.horaServico.split(':').map(Number));
                                    const dataB = new Date(b.dataServico).setHours(...b.horaServico.split(':').map(Number));
                                    return dataA - dataB;
                                });

                                // Selecionar o primeiro agendamento e todos com a mesma data e horário
                                const primeiroAgendamento = agendamentosOrdenados[0];
                                const agendamentosComMesmoHorario = agendamentosOrdenados.filter(agendamento => {
                                    const dataHoraA = new Date(agendamento.dataServico).setHours(...agendamento.horaServico.split(':').map(Number));
                                    const dataHoraB = new Date(primeiroAgendamento.dataServico).setHours(...primeiroAgendamento.horaServico.split(':').map(Number));
                                    return dataHoraA === dataHoraB;
                                });

                                return (
                                    <div className="flex flex-col gap-6 flex-1">
                                        {agendamentosComMesmoHorario.map((agendamento, index) => (
                                            <div key={index} className="flex flex-col gap-4 p-4 bg-gray-100 shadow-md rounded-lg">
                                                <div className="flex items-center gap-4">
                                                    <Avatar 
                                                    src={agendamento.user.avatarUrl.avatarUrl} 
                                                    alt="avatarPrestador"
                                                    size="lg"
                                                    />
                                                    <h3 className="text-prim font-semibold text-lg">
                                                    {agendamento.user.name}
                                                    </h3>
                                                </div>

                                                <div className="flex flex-col gap-3 mt-2">
                                                    <div className="flex justify-between items-center">
                                                    <p className="text-prim font-medium">{agendamento.Servico}</p>
                                                    <p className="text-prim text-sm">
                                                        {formatarData(new Date(agendamento?.dataServico).toISOString().split('T')[0])}
                                                    </p>
                                                    <p className="text-prim text-sm">{agendamento.horaServico}</p>
                                                    </div>
                                                    <p className="text-prim text-sm">{agendamento.enderecoCliente}</p>
                                                </div>

                                                <div className="flex justify-between items-center mt-2">
                                                    <p className="text-prim font-semibold">
                                                    {formatarMoeda(agendamento.valorServico)}
                                                    </p>
                                                    <a
                                                    href={`https://www.google.com/maps/place/${encodeURIComponent(agendamento.enderecoCliente)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    >
                                                    <Button className="bg-sec text-white flex items-center gap-2">
                                                        <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="w-5 h-5"
                                                        >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                                                        />
                                                        </svg>
                                                        Abrir no Google Maps
                                                    </Button>
                                                    </a>
                                                </div>

                                            </div>
                                        ))}
                                    
                                    </div>
                                );
                            })()
                        ) : (
                            <div className="flex flex-col gap-4 p-4 bg-gray-100 shadow-md rounded-lg md:min-h-[30vh]">
                                <p className="text-prim flex-1 ">Nenhum agendamento encontrado.</p>

                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

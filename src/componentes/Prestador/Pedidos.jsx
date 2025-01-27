import React, { useState } from 'react'
import { usePrestador } from '../../context/PrestadorProvider';
import { Button } from '@nextui-org/button';
import { formatarData } from '../../common/FormatarData';
import { formatarMoeda } from '../../common/FormatarMoeda';
import { Accordion, AccordionItem } from '@nextui-org/accordion';

export default function Pedidos({setScreenSelected}) {
    const { prestador } = usePrestador()
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    
    const agendamentosFiltrados = prestador?.Agendamentos && prestador?.Agendamentos?.filter((agendamento) => {
        const nameMatch = agendamento.Servico.toLowerCase().includes(searchTerm.toLowerCase());
        const dateMatch = (!startDate || new Date(agendamento.dataServico) >= new Date(startDate)) &&
                            (!endDate || new Date(agendamento.dataServico) <= new Date(endDate));
    
        return nameMatch && dateMatch;
    });

    return (
        <section className='w-full  gap-1 pb-[8vh] pt-[8vh] sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim'>
            <div className='p-5 flex flex-col gap-5'>
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-5">
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
                                <div className="flex flex-col gap-3 shadow-lg shadow-bord rounded-lg p-5 justify-center items-start">
                                    <div className="flex flex-col lg:flex-row gap-5 items-start w-full justify-between">
                                        <div className="flex flex-col gap-2 w-full">
                                            <div className="overflow-y-auto bg-white p-3 rounded-md text-ter w-full flex flex-col sm:flex-row sm:justify-between">
                                                <p>
                                                    {agendamento.Servico} - {agendamento.horaServico} -{" "}
                                                    {formatarData(new Date(agendamento?.dataServico).toISOString().split('T')[0])}
                                                </p>
                                                <p>{formatarMoeda(taxaPrestador(agendamento?.valorLiquido))}</p>
                                                <div className="w-4/12 sm:w-auto text-center pt-2 sm:pt-0">
                                                    <div
                                                        className={`p-2 rounded-md text-white ${
                                                            agendamento.status === "Agendado"
                                                                ? "bg-des"
                                                                : agendamento.status === "Iniciado"
                                                                ? "bg-desSec"
                                                                : agendamento.status === "Cancelado"
                                                                ? "bg-error"
                                                                : agendamento.status === "Realizado"
                                                                ? "text-sec bg-sec"
                                                                : ""
                                                        } `}
                                                    >
                                                        {agendamento.status}
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
                                                            <b>Serviço:</b> {agendamento?.Servico}
                                                        </p>
                                                        <p>
                                                            <b>Observação:</b>{" "}
                                                            {agendamento?.observacao
                                                                ? agendamento.observacao
                                                                : "Nenhuma observação."}
                                                        </p>
                                                        <p>
                                                            <b>Preço:</b> {formatarMoeda(taxaPrestador(valorLiquidoServico))}
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

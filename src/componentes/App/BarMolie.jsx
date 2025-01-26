import React, { useState } from 'react'
import { formatarMoeda } from '../../common/FormatarMoeda';
import WhatsAppIcon from "../../assets/img/whatsapp.webp"
import { Avatar } from '@nextui-org/avatar';

export default function BarMolie({currentStep, descontoTotal, sumValueService, valorLiquido, selectedService, serviceValue, selectedDates, selectedTimes, provider, observacao}) {
    const [isExpanded, setIsExpanded] = useState(false);
    

    return (
        <div className={`${currentStep >= 1 ? "" : "hidden"} sm:hidden fixed bottom-0 left-0 w-full transition-all duration-300 ease-in-out ${isExpanded ? 'min-h-[65vh] max-h-[65vh]' : 'min-h-[8vh] max-h-[12vh]'} bg-white p-2  text-prim  shadow-[0_-4px_10px_rgba(0,0,0,0.3)] rounded-t-[2vh]`}>
            <div
                className="cursor-pointer  bg-white pt-2 p-4 text-center  font-semibold rounded-t-lg border-b border-bord"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex justify-between items-center ">
                    <div className='flex flex-col'>
                        <div className='flex gap-2 items-center'>
                            {descontoTotal ? (
                                <>
                                    <div className='flex flex-col justify-end items-end'>
                                        <div className='flex'>
                                            <p className=' relative text-[1.2vh] text-prim'>
                                                -${descontoTotal}
                                            </p>
                                            <p className="text-sm line-through font-semibold text-prim">
                                                {formatarMoeda(sumValueService)}
                                            </p>

                                        </div>
                                        <p className="text-lg font-semibold text-desSec">
                                            {formatarMoeda(valorLiquido)}
                                        </p>

                                    </div>
                                </>
                            ) : (
                                <p className="text-xl font-semibold text-desSec">{formatarMoeda(valorLiquido)}</p>
                            )}
                        </div>
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 text-sec">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                        <span className='text-sec'>Resumo</span>
                    </div>
                    <a
                        href="https://api.whatsapp.com/send?phone=5592992648251&text=Ol%C3%A1,%20vim%20pelo%20seu%20site%20e%20gostaria%20de%20saber%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20servi%C3%A7o!%20%E2%9C%85"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                    
                        {/* Ícone do WhatsApp */}
                        <div className=" flex flex-col items-center">
                            <img
                            src={WhatsAppIcon}
                            alt="WhatsApp"
                            className="w-6 h-6"
                            />
                            <p className='text-sec'>Atendimento</p>
                        </div>
                    </a>
                </div>
                
            </div>

            <div className={`overflow-y-auto max-h-[50vh]  p-4 ${isExpanded ? 'block' : 'hidden'} `}>
                <div className="flex flex-col gap-4">                
                    {/* Serviço selecionado */}
                    <div className="flex flex-col gap-2">
                        <div className='w-full flex flex-col  gap-2 justify-between'>
                            <p className='text-lg font-semibold'>Serviço selecionado:</p>
                            <div className='flex items-center w-full justify-between'>
                                <p className='text-base'>{selectedService}</p>
                                <p className='text-base'>{formatarMoeda(serviceValue)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Datas e horários */}
                    <div className="flex flex-col gap-2">
                        <p className="text-lg font-semibold">Data(s) selecionada(s):</p>
                        {selectedDates.length > 0 ? (
                            <ul>
                                {selectedDates.map((date, index) => (
                                    <li key={index} className="flex justify-between">
                                        <span>{new Date(date).toLocaleDateString()}</span>
                                        <span>{selectedTimes ? selectedTimes[new Date(date).toDateString()] || '--:--' : '--:--'}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-base">Nenhuma data selecionada.</p>
                        )}
                    </div>

                    {/* Prestador selecionado */}
                    <div className="flex flex-col gap-2">
                        <p className="text-lg font-semibold">Prestador selecionado:</p>
                        {provider ? (
                            <div className="flex items-center gap-2">
                                <Avatar src={provider.avatarUrl?.avatarUrl} size="sm" />
                                <p className="text-base">{provider.name}</p>
                            </div>
                        ) : (
                            <p className="text-base">Nenhum prestador selecionado.</p>
                        )}
                    </div>

                    {/* Observação */}
                    <div className="flex flex-col gap-2">
                        <p className="text-lg font-semibold">Observação:</p>
                        <p className="text-base">{observacao || 'Nenhuma'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

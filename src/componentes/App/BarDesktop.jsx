import React from 'react'
import { formatarMoeda } from '../../common/FormatarMoeda';
import { Avatar } from '@nextui-org/avatar';

export default function BarDesktop({descontoTotal, sumValueService, valorLiquido, selectedService, serviceValue, selectedDates, selectedTimes, provider, observacao}) {

    return (
        <div className="hidden md:block lg:block  lg:pt-[5vh] ">
            <div className="bg-desSec text-white shadow-md rounded-t-none rounded-lg pt-[12vh] md:pt-[13vh] lg:pt-[0vh] xl:pt-[0vh] p-4 flex flex-col items-center gap-10 max-w-[50vh] xl:max-w-[60vh] xl:min-w-[60vh] text-justify min-h-[80vh]">
                <div className='w-full flex justify-between items-center border-b p-12 pt-0 pb-2 lg:pt-12 xl:pt-16 pl-7 pr-7 '>
                    <h3 className="text-xl 2xl:text-2xl flex flex-wrap items-end ">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 font-semibold 2xl:size-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                        Total
                    </h3>

                    <div className="flex flex-col lg:flex-row items-center gap-2">
                        {/* Se o valor do desconto existir, mostra a linha riscada */}
                        {descontoTotal ? (
                            <>
                                <div className='flex flex-col justify-end items-end'>
                                    <div className='flex'>
                                        <p className=' relative text-[1.5vh]'>
                                            -${descontoTotal}
                                        </p>
                                        <p className="text-md line-through text-gray-500">
                                            {formatarMoeda(sumValueService)}
                                        </p>

                                    </div>
                                    <p className="text-md 2xl:text-2xl font-semibold text-green-500">
                                        {formatarMoeda(valorLiquido)}
                                    </p>

                                </div>
                            </>
                        ) : (
                            <p className="text-lg 2xl:text-2xl">{formatarMoeda(valorLiquido)}</p>
                        )}
                    </div>
                </div>
                
                <div className='flex flex-col gap-7 w-full pl-7 pr-7'>
                    {selectedService?(
                        <div className='w-full flex flex-col  gap-2 justify-between'>
                            <p className='text-lg 2xl:text-xl font-semibold'>Serviço selecionado:</p>
                            <div className='flex items-center w-full justify-between'>
                                <p className='text-base 2xl:text-xl'>{selectedService}</p>
                                <p className='text-base 2xl:text-xl'>{formatarMoeda(serviceValue)}</p>
                            </div>
                        </div>
                    ):(
                        <div className='w-full flex flex-col  gap-2'>
                            <p className='text-lg font-semibold 2xl:text-xl'>Serviço selecionado:</p>
                            <p className='text-base 2xl:text-xl'>Nenhum serviço selecionado.</p>
                        </div>
                    )}

                    {/*Exibe as datas e horários selecionados */}
                    {selectedDates.length > 0 ? (
                        <div className='w-full flex flex-col gap-2 justify-between'>
                            <p className='text-md 2xl:text-xl font-semibold'> Data(s) selecionado(s):</p>
                            <ul>
                                {selectedDates.map((date, index) => (
                                    <li key={index} className="flex gap-5 items-center justify-between w-1/2">
                                        {/* Formata a data */}
                                        <span>{new Date(date).toLocaleDateString()}</span>
                                        {/* Exibe o horário correspondente à data */}
                                        {selectedTimes ? (
                                        (() => {
                                            const formattedDate = new Date(date).toDateString();
                                            const times = selectedTimes[formattedDate];
                                            return <span>{times ? times : "--:--"}</span>;
                                        })()
                                        ) : (
                                            <span> --:-- </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ):(
                        <div className='w-full flex flex-col   gap-2'>
                            <p className='text-lg font-semibold 2xl:text-xl'>Data(s) selecionada(o):</p>
                            <p className='text-base 2xl:text-xl'>Nenhuma data selecionada</p>
                        </div>
                    )}

                    {/* Exibe o prestador selecionado*/}
                    {provider?(
                        <div className='w-full flex flex-col  gap-2'>
                            <p className='text-md font-semibold 2xl:text-xl'> Prestador selecionado:</p>
                            <div className='flex w-full items-center gap-2'>
                                <Avatar src={provider?.avatarUrl?.avatarUrl} size="md"/>
                                <p className='text-base 2xl:text-xl'>{provider.name}</p>
                                {/*Mostra o avatar do prestador */}
                            </div>
                        </div>
                    ):(
                        <div className='w-full flex flex-col  gap-2'>
                            <p className='text-lg font-semibold 2xl:text-xl'>Prestador selecionado</p>
                            <p className='text-base 2xl:text-xl'>Nenhum prestador selecionado.</p>
                        </div>
                    )}

                    {observacao?(
                        <div className='w-full flex flex-col  gap-2'>
                            <p className='text-md font-semibold 2xl:text-xl'> Observação:</p>
                            <div className='flex w-full items-center gap-2'>
                                <p className='text-base 2xl:text-xl'>{observacao}</p>
                                {/*Mostra o avatar do prestador */}
                            </div>
                        </div>
                    ):(
                        <div className='w-full flex flex-col  gap-2'>
                            <p className='text-lg font-semibold 2xl:text-xl'>Observação:</p>
                            <p className='text-base 2xl:text-xl'>Nenhuma</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

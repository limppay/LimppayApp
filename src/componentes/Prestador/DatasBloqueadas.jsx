import React, { useState } from 'react'
import { usePrestador } from '../../context/PrestadorProvider'
import { bloquearData, desbloquearData, updateDiasDisponveis } from '../../services/api'
import { fetchPrestadorInfo } from '../../common/FetchPrestadorInfo'
import { Button, Spinner } from '@nextui-org/react'
import Calendar from './Calendar'
import { formatarData } from '../../common/FormatarData'

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

export default function DatasBloqueadas() {
    const { prestador, setPrestador } = usePrestador()
    const [loadingDay, setLoadingDay] = useState(false)
    const [ selectedDates, setSelectedDates ] = useState([])
    const [numberOfDays, setNumberOfDays] = useState(0)
    const [ errorBlock, setErrorBlock ] = useState('')
    const [ loadingBlock, setLoadingBlock ] = useState(false)
    const [ loadingUnlock, setLoadingUnlock ] = useState(false)
    const [ errorUnlock, SetErrorUnlock ] = useState('')
    const formattedDates = selectedDates?.map(date => {
        return new Date(date).toISOString().split('T')[0];
    });

    const diasDisponveisSchema = yup.object({
        // Dias da semana 
        dom: yup.boolean(),
        seg: yup.boolean(),
        ter: yup.boolean(),
        quart: yup.boolean(),
        qui: yup.boolean(),
        sex: yup.boolean(),
        sab: yup.boolean(),
        diasSemana: yup.boolean().test('at-least-one-day', 'Selecione pelo menos um dia', function () {
            const { dom, seg, ter, quart, qui, sex, sab } = this.parent
            return dom || seg || ter || quart || qui || sex || sab
        }),
    })
    .required()

    // Hook Forms
    const {
        register: registerDay,
        handleSubmit: handleSubmitDay,
        formState: { errors: errorsDay },
        reset: resetDay,  
        } = useForm({
        resolver: yupResolver(diasDisponveisSchema),
    })
    
    const handleUpdateDiasDisponveis = async (data) => {
        setLoadingDay(true)

        try {
            const response = await updateDiasDisponveis(prestador?.id, data)
            await fetchPrestadorInfo(setPrestador)
            setLoadingDay(false)

        } catch (error) {
            console.log(error)
            
        } 
        
    }

    const blockDates = async () => {
        setErrorBlock('')
        setLoadingBlock(true)

        for(const date of formattedDates ) {
            const data = {
                userId: prestador?.id,
                data: date
            }
            
            try {
                const response = await bloquearData(data)
                await fetchPrestadorInfo(setPrestador)
                setSelectedDates([])
                setLoadingBlock(false)

    
            } catch (error) {
                console.error(error.message)
                setErrorBlock(error.message)
                setSelectedDates([])
                setLoadingBlock(false)
                
            }

        }
        
    }

    const unlockDate = async (data) => {
        setLoadingUnlock(true)
        SetErrorUnlock('')

        const date = new Date(data).toISOString().split('T')[0]

        try {
            const response = await desbloquearData(prestador?.id, date );
            await fetchPrestadorInfo(setPrestador)
            setLoadingUnlock(false)

        } catch (error) {
            console.error("Erro ao desbloquear data: ", error.message);
            SetErrorUnlock(error.message);
            setLoadingUnlock(false)
        }
    };

    return (
        <section className='w-full gap-1 pb-[8vh] pt-[9vh] sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim'>
            <div className='w-full p-10 pb-0 pt-2'>
                <div>
                    <h2 className='text-xl font-semibold'>Precisa mudar os seus dias disponveis na semana? </h2>
                    <p>Sem problemas, você pode editar quando quiser, sinta-se livre! :D </p>
                </div>
            </div>

            <div className='p-10 flex flex-col md:flex-row gap-10 justify-around  items-start'>
                <form className='w-full grid gap-2' onSubmit={handleSubmitDay(handleUpdateDiasDisponveis)}>
                    <div className='w-full grid grid-cols-3'>
                        <div className="m-3 mb-0 ml-0 flex gap-2">
                            <input 
                            type="checkbox" 
                            id="domingo" 
                            {...registerDay("dom", {required: true})}
                            className="days cursor-pointer"
                            defaultChecked={prestador?.DiasDisponiveis[0].dom}
                            />
                            <label htmlFor="domingo">Domingo</label>
                        </div>
                        <div className="m-3 mb-0 ml-0 flex gap-2">
                            <input 
                            type="checkbox" 
                            id="segunda" 
                            {...registerDay("seg")}
                            className="days cursor-pointer"
                            defaultChecked={prestador?.DiasDisponiveis[0].seg}
                            />
                            <label htmlFor="segunda">Segunda</label>
                        </div>
                        <div className="m-3 mb-0 ml-0 flex gap-2">
                            <input 
                            type="checkbox" 
                            id="terca" 
                            {...registerDay("ter")}
                            className="days cursor-pointer"
                            defaultChecked={prestador?.DiasDisponiveis[0].ter}
                            />
                            <label htmlFor="terca">Terça</label>
                        </div>
                    
                    
                        <div className="m-3 mb-0 ml-0 flex gap-2">
                            <input 
                            type="checkbox" 
                            id="quarta" 
                            {...registerDay("quart")}
                            className="days cursor-pointer"
                            defaultChecked={prestador?.DiasDisponiveis[0].quart}
                            />
                            <label htmlFor="quarta">Quarta</label>
                        </div>
                        <div className="m-3 mb-0 ml-0 flex gap-2">
                            <input 
                            type="checkbox" 
                            id="quinta" 
                            {...registerDay("qui")}
                            className="days cursor-pointer"
                            defaultChecked={prestador?.DiasDisponiveis[0].qui}
                            />
                            <label htmlFor="quinta">Quinta</label>
                        </div>
                        <div className="m-3 mb-0 ml-0 flex gap-2">
                            <input 
                            type="checkbox" 
                            id="sexta" 
                            {...registerDay("sex")}
                            className="days cursor-pointer"
                            defaultChecked={prestador?.DiasDisponiveis[0].sex}
                            />
                            <label htmlFor="sexta">Sexta</label>
                        </div>
                    
                    
                        <div className="m-3 mb-0 ml-0 flex gap-2">
                            <input 
                            type="checkbox" 
                            id="sabado" 
                            {...registerDay("sab")}
                            className="days cursor-pointer"
                            defaultChecked={prestador?.DiasDisponiveis[0].sab}
                            />
                            <label htmlFor="sabado">Sábado</label>
                        </div>
                    </div>
                    <div>
                        <Button className='bg-white text-sec border border-sec w-full' type='submit' isDisabled={loadingDay}>
                            {loadingDay ? <Spinner className='text-white'/> : "Confirmar e atualizar"}
                        </Button>
                    </div>
                    <div className="mt-2 w-full">
                        {errorsDay.diasSemana && <p className="text-error opacity-75">{errorsDay.diasSemana.message}</p>}
                    </div>


                </form>                
            </div>

            <div className='w-full p-10 pb-0 pt-0'>
                <p className='font-semibold text-xl'>Houve um imprevisto?</p>
                <p>sem problemas, você pode bloquear ou desbloquear especificamente o dia que você não vai está disponível :D</p>
            </div>

            <div className='p-10 flex flex-col md:flex-row gap-10 justify-around  items-start'>
                <Calendar 
                    selectedDates={selectedDates}
                    setSelectedDates={setSelectedDates}
                    maxSelection={numberOfDays} // Defina aqui o número máximo de seleções permitidas
                    blockDates={() => blockDates()}
                    loadingBlock={loadingBlock}
                    errorBlock={errorBlock}
                />
                
                <div className='rounded-lg  md:min-h-[60vh] md:max-h-[50vh] w-full gap-2 flex flex-col max-h-[50vh] '>
                    <div className='w-full justify-center items-center text-center'>
                        <h2 className='text-desSec text-xl font-semibold text-center'>Datas Bloqueadas</h2>
                    </div>
                    <div className='flex flex-col overflow-y-auto pb-2 gap-5'>
                        {prestador?.DiasBloqueados?.length == 0 ? (
                            <div className='flex flex-col w-full max-h-[40vh] text-center justify-center  '>
                                <span className='opacity-30'>
                                    Nenuma data bloqueada
                                </span>
                            </div>

                        ) : (
                            prestador?.DiasBloqueados?.length > 0 &&
                            prestador?.DiasBloqueados?.map((dataBloqueada) => (
                                <div key={dataBloqueada.id} className=' rounded-lg'>
                                    <div className="  bg-white w-full opacity-100 rounded-lg flex items-center p-2   pb-2 shadow-md justify-between ">
                                        <div className='w-full sm:min-w-min'>
                                            <span className='text-center'>
                                                {formatarData(new Date(dataBloqueada.data).toISOString().split('T')[0])}
                                            </span>
                                        </div>
                                        <div className='sm:min-w-min'>
                                            <Button
                                                className="bg-white justify-between min-w-full sm:min-w-min"
                                                onPress={() => unlockDate(dataBloqueada.data)}
                                                isDisabled={loadingUnlock}
                                            >
                                                <span className="text-sec">
                                                    Desbloquear
                                                </span>

                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="size-4 text-sec"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                                                    />
                                                </svg>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))

                        )}


                    </div>

                </div>
            
                

            </div>
            
            
        </section>
                                                        
    )
}

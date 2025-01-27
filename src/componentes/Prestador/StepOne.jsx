import React from 'react'
import { usePrestador } from '../../context/PrestadorProvider'
import ProgressBar from './ProgressBar'

export default function StepOne({etapaCadastro}) {
    const { prestador } = usePrestador()

    const fullName = prestador?.name?.trim()
    const firstName = fullName?.split(' ')[0]

    return (
        <section className='lg:flex justify-between w-8/12 gap-1 h-[80vh] pt-[10vh] lg:pt-[12vh] xl:pt-[14vh] '>
            <div className='w-full flex flex-col  pl-10 pr-10 h-full'>
                <div className='max-w-[55vh]'>
                    <h2 className='text-desSec text-xl sm:text-2xl'>Cadastro em andamento</h2>
                    <p className='text-prim'><b>{firstName} </b>,  {prestador?.cadastroCompleto ? "Seu cadastro está completo, aguarde enquanto nossa equipe avalia os dados enviados! :D" : "Falta pouco para sua conta ser ativada! :D"} </p>
                </div>
                <div className='pt-5 text-prim '>
                    <ProgressBar step={etapaCadastro} />
                </div>
            </div>
        </section>
    )
}

import React, { useEffect } from 'react';
import HeaderApp from '../../componentes/HeaderApp.jsx';
import Button from '../../componentes/Button.jsx';
import '../../styles/index.css'
import '../../styles/font.css'
import diaristaBanner from '../../assets/img/seja-diarista/banner-02-1.jpg'

export default function DiaristaApp() {
    return (
        <>
            <HeaderApp/>
            <main className='w-full flex flex-col items-center justify-center'>
                <section className='pb-5 w-full lg:md:sm:flex  items-center'>
                    <img src={diaristaBanner} alt="seja-diarista" className='w-ful lg:md:sm:w-1/2 max-w-full '/>
                    <div className="p-3 lg:md:sm:w-full lg:md:sm:flex lg:md:sm:justify-center">
                        <div className='flex flex-col gap-5 p-2 text-center lg:md:sm:gap-8 lg:md:sm:flex lg:md:sm:w-8/12'>
                            <div>
                                <h2 className='text-desSec text-2xl mb-2'>Diarista</h2>
                                <p className='text-ter'>A <b>Limppay</b> te conecta ao cliente de forma totalmente gratuita</p>
                            </div>
                            <div>
                                <Button buttonName="Quero ser diarista"/>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='pb-5 w-full lg:md:sm:flex  items-center'>
                    <div className='p-3 flex flex-col gap-3 lg:md:sm:w-full lg:md:sm:flex lg:md:sm:justify-center '>
                        <div className='text-center text-xl'>
                            <h2 className='text-ter'>Fiz meu cadastro</h2>
                            <h3 className='text-desSec'>Quero fazer meu login</h3>
                        </div>
                        <div className='flex flex-col gap-5 items-center text-center'>
                            <div>
                                <p>Você que fez seu cadastro de diarista, já pode entrar na sua área para ver seus serviços, valores, avaliações e muito mais.</p>
                            </div>
                            <div>
                                <Button buttonName="Entrar na área diarista"/>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
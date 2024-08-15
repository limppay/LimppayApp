import React, { useEffect } from 'react';
import HeaderApp from '../../componentes/HeaderApp.jsx';
import '../../styles/index.css'

export default function DiaristaApp() {
    return (
        <>
            <HeaderApp/>
            <main>
                <section className='pt-12'>
                    <div className="flex items-center justify-around">
                        <h1 >Seja Diarista</h1>
                        <div>
                            <h2>Diarista</h2>
                            <p>A<b>Limppay</b> te conecta ao cliente de forma totalmente gratuita</p>
                            <a href="#">Quero ser diarista</a>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
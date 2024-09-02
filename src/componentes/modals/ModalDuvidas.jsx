import React from 'react'
import {useEffect} from 'react'

export default function ModalDuvidas() {
    useEffect(() => {
        const OpenModal = document.getElementById("OpenDuvidas")
        const Modal = document.getElementById("Duvidas")
        const CloseModal = document.querySelector(".CloseModalDuvidas")
        console.log(OpenModal)
        
        OpenModal.onclick = () => {
            Modal.showModal()
        }

        CloseModal.onclick = () => {
            Modal.close()
        }

    }, [])
    
    return (
    <>
        <dialog id='Duvidas'>
            <div>
                <div>
                    <div className='text-desSec text-2xl border-b border-bord p-3 shadow-md'>
                        <h1>Tem Dúvidas?</h1>
                    </div>
                </div>
                <div className='p-5 flex flex-col gap-4'>
                    <div className='flex flex-col gap-7 text-prim'>
                        <p>Este espaço é para tirar dúvidas conforme os tópicos abaixo que traz as perguntas mais frequentes feitas pelos nossos clientes.</p>
                        <p>Se nossos tópicos não conseguiu atender você, nos envie um contato através de nossos e-mail <a href="mailto:contato@limppay.com" className='text-des'>contato@limppay.com</a>, ou pelo nosso <a href="https://api.whatsapp.com/send?phone=5592992648251" className='text-des'>Whatsapp</a></p>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div className='flex items-center border-b border-bord justify-between p-3 text-prim'>
                            <span>Sobre a limpeza</span>
                            <span className="material-symbols-outlined">arrow_drop_down</span>
                        </div>
                        <div>
                            <p className="duvida"></p>
                        </div>

                        <div className='flex items-center border-b border-bord justify-between p-3 text-prim'>
                            <span>Sobre a limpeza</span>
                            <span className="material-symbols-outlined">arrow_drop_down</span>
                        </div>
                        <div>
                            <p className="duvida"></p>
                        </div>
                            
                    </div>
                    <div className='flex justify-center'>
                        <button  className='CloseModalDuvidas p-2 rounded-md w-2/4 max-w-full text-center bg-des text-white transition-all hover:bg-sec hover:bg-opacity-75'>Fechar</button>
                    </div>
                </div>
            </div>
        </dialog>
    </>
    )
}

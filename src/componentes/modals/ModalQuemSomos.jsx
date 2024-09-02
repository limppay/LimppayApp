import React from 'react'
import {useEffect} from 'react'

export default function ModalQuemSomos() {
    useEffect(() => {
        const OpenModal = document.getElementById("OpenQuemSomos")
        const Modal = document.getElementById("QuemSomos")
        const CloseModal = document.querySelector(".CloseModalSomos")
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
        <dialog id='QuemSomos'>
            <h1>Quem somos</h1>
            <button className='CloseModalSomos'>Fechar</button>
        </dialog>
    </>
    )
}

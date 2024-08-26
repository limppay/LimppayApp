import React from 'react'
import { useEffect } from 'react';

export default function ModalLoginDiarista() {
  useEffect(() => {
    const OpenModal = document.getElementById("OpenLoginDiarista")
    const Modal = document.getElementById("LoginModal")
    const CloseModal = document.querySelector(".CloseModalDiarista")
    
    OpenModal.onclick = () => {
      Modal.showModal()
    }

    CloseModal.onclick = () => {
      LoginModal.close()
    }

  }, [])

  return (
    <>
      <dialog id='LoginModal'>
        <h1>Fazer login</h1>
        <button className='CloseModalDiarista'>Fechar</button>
      </dialog>
    </>
  )
}

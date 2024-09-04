'use client'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

export default function ModalDuvidas({OpenDuvidas, SetOpenDuvidas}) {
  return (
    <Dialog open={OpenDuvidas} onClose={SetOpenDuvidas} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-prim bg-opacity-50">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className="font-semibold  text-desSec text-2xl">
                    Tem Dúvidas?
                  </DialogTitle>
                  <div className="mt-2">
                    <div className='overflow-y-auto max-h-[60vh] flex flex-col gap-10'>
                        <div className='flex flex-col gap-7 text-prim'>
                            <p>Este espaço é para tirar dúvidas conforme os tópicos abaixo que traz as perguntas mais frequentes feitas pelos nossos clientes.</p>
                            <p>Se nossos tópicos não conseguiram atender você, nos envie um contato através de nossos e-mail <a href="mailto:contato@limppay.com" className='text-des'>contato@limppay.com</a>, ou pelo nosso <a href="https://api.whatsapp.com/send?phone=5592992648251" className='text-des'>Whatsapp</a></p>
                        </div>
                        <div className='perguntas flex flex-col '>
                            <div className='flex items-center border-b border-bord justify-between p-3 text-prim painel-title'>
                                <span>Sobre a limpeza</span>
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </div>
                            <div className='painel-content'>
                                <p className="duvida"></p>
                            </div>

                            <div className='flex items-center border-b border-bord justify-between p-3 text-prim painel-title'>
                                <span>Sobre o Agendamento</span>
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </div>
                            <div className='painel-content'>
                                <p className="duvida"></p>
                            </div>

                            <div className='flex items-center border-b border-bord justify-between p-3 text-prim painel-title'>
                                <span>Sobre os profissionais</span>
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </div>
                            <div className='painel-content'>
                                <p className="duvida"></p>
                            </div>

                            <div className='flex items-center border-b border-bord justify-between p-3 text-prim painel-title'>
                                <span>Sobre os produtos</span>
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </div>
                            <div className='painel-content'>
                                <p className="duvida"></p>
                            </div>   

                            <div className='flex items-center border-b border-bord justify-between p-3 text-prim painel-title'>
                                <span>Por que escolher a Limppay?</span>
                                <span className="material-symbols-outlined">arrow_drop_down</span>
                            </div>
                            <div className='painel-content'>
                                <p className="duvida"></p>
                            </div>      
                        </div>
                    </div>                
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                data-autofocus
                onClick={() => SetOpenDuvidas(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Fechar
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

'use client'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { Logo } from '../imports'

export default function ModalLoginDiarista({OpenLogin, SetOpenLogin}) {
  return (
    <Dialog open={OpenLogin} onClose={SetOpenLogin} className="relative z-10">
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
              <div className="sm:flex sm:items-start justify-center">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <div className="mt-2 lg:flex h-1/2 ">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col justify-center p-2">
                      <img
                        alt="Limppay"
                        src={Logo}
                        className="mx-auto h-20 w-auto"
                      />
                      <div className='flex flex-col items-center text-justify gap-2'>
                        <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 text-desSec">
                          Ja tem uma conta?
                        </h2>
                        <p>Entre na sua conta agora mesmo para ter acesso a plataforma da Limppay</p>
                      </div>
                    </div>

                    <div className="mt-1 lg:mt-10 sm:mx-auto sm:w-full sm:max-w-sm p-2">
                      <form className="space-y-6 ">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email
                          </label>
                          <div className="mt-2">
                            <input
                              id="email"
                              name="email"
                              type="email"
                              required
                              autoComplete="email"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex flex-col justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                              Senha
                            </label>
                          </div>
                          <div className="mt-2">
                            <input
                              id="password"
                              name="password"
                              type="password"
                              required
                              autoComplete="current-password"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                          <div className="text-sm text-end mt-2">
                              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                Esqueceu sua senha?
                              </a>
                          </div>
                        </div>

                        <div>
                          <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 bg-desSec text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Entrar
                          </button>
                        </div>
                      </form>
                    </div>  
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                data-autofocus
                onClick={() => SetOpenLogin(false)}
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

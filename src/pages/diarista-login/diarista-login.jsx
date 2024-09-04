import React from 'react'
import { Logo,  } from '../../componentes/imports'
import painel from "../../assets/img/painel.jpg"

export default function DaristaLogin() {
  return (
    <>
        <div className='flex h-screen justify-center max-w-full '>
            <div className='h-screen flex flex-col p-10  shadow-2xl w-full lg:w-5/12 bg-[url(src/assets/img/painel.jpg)] bg-center bg-cover lg:bg-none md:bg-none sm:bg-none md:shadow-none sm:shadow-none'>
                <main className='flex flex-col gap-10 shadow-lg lg:shadow-none rounded-md p-5 bg-white'>
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            alt="Limppay"
                            src={Logo}
                            className="mx-auto h-20 w-auto"
                        />
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 text-desSec">
                            Entre na sua conta
                        </h2>
                        <p className='text-prim'>Entre na sua conta e acesse a plataforma da Limppay!</p>
                    </div>
                    
                    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form action="#" method="POST" className="space-y-6">
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
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Senha
                                </label>
                                <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Esqueceu sua senha?
                                </a>
                                </div>
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
                            </div>

                            <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white bg-desSec shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Entrar
                            </button>
                            </div>
                        </form>
                    </div>            
                </main>
            </div>
            <img src={painel} alt="" className='hidden lg:flex opacity-70 w-full '/>
        </div>
    </>
  )
}

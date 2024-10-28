import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Field, Label, Switch } from '@headlessui/react'

export default function NossosContatos() {
    const [agreed, setAgreed] = useState(false)

    return (
        <section className="flex justify-center pb-12 lg:pt-0 pt-10" id="nossos-contatos">
            <div className="isolate px-6 lg:px-8 flex flex-col lg:flex-row justify-around items-baseline ">
                <div className="flex flex-col md:w-1/2">
                    {/* Seção à Esquerda */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-semibold text-desSec text-center lg:text-start">Fale Conosco</h2>
                        <p className="text-ter">
                            Entre em contato com nossa equipe. Estamos aqui para ajudar e esclarecer suas dúvidas. Caso precise de mais informações, utilize as opções abaixo para nos alcançar.
                        </p>
                        <div className="space-y-2 text-prim">
                            <div>
                                <p>Avenida Rodrigo Otávio, nº 6488, Coroado 69080-005</p>
                                <p>Manaus-AM</p>
                            </div>
                            <div>
                                <p>+55 (92) 99264-8251</p>
                            </div>
                            <div>
                                <p>contato@limppay.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
                        <div className="flex flex-col gap-x-8 gap-y-6">
                            <div className='flex justify-between w-full gap-10'>
                                <div className='w-full'>
                                    <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-ter">
                                        Nome
                                    </label>
                                    <div className="mt-2.5">
                                    <input
                                        id="first-name"
                                        name="first-name"
                                        type="text"
                                        autoComplete="given-name"
                                        className="w-full border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-ter text-ter "
                                    />
                                    </div>
                                </div>
                                <div className='w-full'>
                                    <label htmlFor="email" className="block text-sm font-semibold leading-6 text-ter">
                                        Email
                                    </label>
                                    <div className="mt-2.5">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="given-name"
                                        className="w-full border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-ter text-ter"
                                    />
                                    </div>
                                </div>
                            </div>
        
                            <div className="sm:col-span-2">
                                <label htmlFor="message" className="block text-sm font-semibold leading-6 text-ter">
                                Message
                                </label>
                                <div className="mt-2.5">
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    className="block px-3.5 py-2 shadow-sm sm:text-sm sm:leading-6 w-full border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter"
                                    defaultValue={''}
                                />
                                </div>
                            </div>
                        </div>
                        <div className="mt-10">
                            <button
                                type="submit"
                                className="p-2 rounded-md w-full max-w-full text-center bg-des text-white transition-all hover:bg-sec hover:bg-opacity-75"
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
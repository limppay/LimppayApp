import React from 'react'
import { Logo } from '../../componentes/imports'
import { useState } from 'react';
import { requestPasswordReset } from '../../services/api';
'use client'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"


export default function RequestResetPassword() {

    const schema = yup.object({
        email: yup.string().email("Email inválido.").default(""),

        cpfCnpj: yup.string().default("")
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema),
    })

    const [message, setMessage] = useState(null);
    const [Open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false);
    const [sendCpfCnpj, setSendCpfCnpj] = useState(false)
  
    const onSubmit = async (data) => {
      setLoading(true);
      console.log(data)

      try {
        const response = await requestPasswordReset(data.email, data.cpfCnpj);

        if (response) {
            setLoading(false)
            setMessage(null)
            setOpen(true)
        } else {
            setLoading(false)
        }
      } catch (error) {
        console.error(error);
        setMessage(error)
      }
    };

    const handleSendCpfCnpj = () => {
        reset()
        setSendCpfCnpj(true)
    }

    const handleSendEmail = () => {
        reset()
        setSendCpfCnpj(false)
    }


  return (
        <div className='h-screen flex flex-col p-10 w-full   bg-center bg-cover '>
            <main className='flex flex-col gap-10 lg:shadow-none rounded-md p-5 bg-white'>
                <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
                    <img
                        alt="Limppay"
                        src={Logo}
                        className="mx-auto h-20 w-auto"
                    />
                    <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 text-desSec">
                        Esqueceu sua senha?
                    </h2>
                    <p className='text-prim '>Não se preocupe, mude agora mesmo! :D</p>
                </div>
                
                <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit(onSubmit)}  className="space-y-16">
                        <div>
                            {!sendCpfCnpj ? (
                                <>
                                    <div className='flex justify-between'>
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-ter">
                                            Email
                                        </label>
                                        <p className='text-prim cursor-pointer' 
                                        onClick={handleSendCpfCnpj}
                                        >Esqueci meu email</p>
                                    </div>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            {...register("email")}
                                            placeholder='Digite email da sua conta'
                                            className="border border-bord rounded-md w-full p-2 focus:outline-prim text-ter"
                                        />
                                        {errors.email?.message && (
                                            <span className="text-error opacity-75">{errors.email.message}</span>
                                        )}
                                    </div>
                                </>
                                
                            ) : (
                                <>
                                    <div className='flex justify-between'>
                                        <label htmlFor="cpfCnpj" className="block text-sm font-medium leading-6 text-ter">
                                            CPF / CNPJ
                                        </label>
                                        <p className='text-prim cursor-pointer' 
                                        onClick={handleSendEmail}
                                        >Usar Email</p>
                                    </div>
                                    <div className="mt-2">
                                        <input
                                            id="cpfCnpj"
                                            {...register("cpfCnpj")}
                                            placeholder='Digite seu CPF ou CNPJ'
                                            className="border border-bord rounded-md w-full p-2 focus:outline-prim text-ter"
                                        />
                                        {errors.cpfCnpj?.message && (
                                            <span className="text-error opacity-75">{errors.cpfCnpj.message}</span>
                                        )}
                                    </div>
                                </>
                                
                            )
                        
                            }

                        </div>

                        <div className='flex justify-center flex-col text-center gap-5'>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white bg-desSec shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:bg-sec transition-all duration-300"
                            >
                                {loading ? 'Enviando Link...' : 'Enviar link'} 
                            </button>
                            <p className='text-error'>{message}</p>
                        </div>
                    </form>
                </div>            
            </main>
            <Dialog open={Open} onClose={setOpen} className="relative z-10">
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
                    <div className="sm:flex sm:items-start ">
                        <div className="mt-3 text-center space-y-5 sm:ml-4 sm:mt-0 sm:text-left">
                            <DialogTitle as="h3" className="font-semibold  text-desSec text-2xl text-center">
                                Sucesso! :D
                            </DialogTitle>
                            <div className="mt-2">
                                <div className="flex flex-col gap-7 text-prim  overflow-y-auto max-h-[60vh] ">
                                    <p className='text-prim'>O link de redefinição de senha foi enviado com sucesso para o seu e-mail. Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
                                </div>           
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 flex justify-center">
                    <button
                        type="button"
                        data-autofocus
                        onClick={() => setOpen(false)}
                        className="border border-bord p-2 rounded-md text-prim "
                    >
                        Fechar
                    </button>
                    </div>
                </DialogPanel>
                </div>
            </div>
            </Dialog>
        </div>
  )
}

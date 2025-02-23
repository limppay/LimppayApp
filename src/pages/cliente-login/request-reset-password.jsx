import React from 'react'
import { Logo } from '../../componentes/imports'
import { useState, useRef, useEffect } from 'react';
import { requestPasswordReset } from '../../services/api';
'use client'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import InputMask from "react-input-mask"
import { Button, Spinner } from '@nextui-org/react';


export default function RequestResetPasswordCliente() {

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
    const[cpfCnpj, setcpfCnpj]=useState('')
    const inputRef = useRef(null)
    const [timer, setTimer] = useState(0);


    const CpfCnpj = [
        {text:"CPF"},
        {text:"CNPJ"},
    ]

    const handleCpfCnpjChange = (event)=>{
        const value = event.target.value;
        setcpfCnpj(value);
        setValue('CpfCnpj', value);
      }

      const voltarParaSelectCpfCnpj = () =>{
        setcpfCnpj('');
        setValue('cpfCnpj', '');
      }

  
      const onSubmit = async (data) => {
        setLoading(true);
        setMessage(null); // Limpar mensagens anteriores
        const cpfCnpjSemMascara = removerMascara(data.cpfCnpj);
    
        try {
          const response = await requestPasswordReset(data.email, cpfCnpjSemMascara, "cliente");
          
          setLoading(false);
          setOpen(true); // Sucesso ao enviar o link
          setTimer(30); // Define o timer para 5 segundos após envio bem-sucedido
          
        } catch (error) {
            setLoading(false);
            setMessage(error.message); // Definindo a mensagem de erro no estado
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

    const removerMascara = (valor) => {
        return valor.replace(/\D/g, ''); // Remove todos os caracteres que não são números
    };

    useEffect(() => {
        let interval = null;
        if (timer > 0) {


            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer]); // Reexecuta sempre que o timer mudar


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
                                        <button className='text-prim cursor-pointer' 
                                        onClick={handleSendCpfCnpj}
                                        >Esqueci meu email</button>
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
                                    <div >
                                        <div className="flex gap-2 justify-between">
                                            <label htmlFor="CpfCnpj" className="block text-sm font-medium leading-6 text-ter">
                                                {cpfCnpj ? cpfCnpj : "CPF / CNPJ"} {/* Exibe CPF ou CNPJ se selecionado */}
                                            </label>

                                            <button className='text-prim cursor-pointer' 
                                            onClick={handleSendEmail}
                                            >Usar Email</button>
                                        </div>

                                        {cpfCnpj === 'CPF' ? (
                                            <InputMask
                                                mask="999.999.999-99"
                                                maskChar={null}
                                                ref={inputRef}
                                                className="border rounded-md border-bord p-3 pt-2 pb-2 mt-2 focus:outline-prim text-ter w-full "
                                                id="cpf"
                                                type="text"
                                                placeholder="Somente números"
                                                {...register("cpfCnpj")}
                                            />
                                        ) : cpfCnpj === 'CNPJ' ? (
                                            <InputMask
                                                mask="99.999.999/9999-99"
                                                maskChar={null}
                                                ref={inputRef}
                                                className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter mt-2 w-full"
                                                id="cnpj"
                                                type="text"
                                                onChange={handleCpfCnpjChange}
                                                placeholder="Somente números"
                                                {...register("cpfCnpj")}
                                            />
                                        ) : (
                                            <select
                                                id="CpfCnpj"
                                                value={cpfCnpj}
                                                onChange={handleCpfCnpjChange}
                                                required
                                                className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim w-full mt-2">
                                                <option value="">Selecione</option>
                                                {CpfCnpj.map((options, index) => (
                                                    <option key={index} value={options.text}>{options.text}</option>
                                                ))}
                                            </select>
                                            
                                        )}

                                        {cpfCnpj === 'CPF' || cpfCnpj === 'CNPJ' ? (
                                                <p onClick={voltarParaSelectCpfCnpj} className="cursor-pointer text-prim text-end">Voltar para seleção</p>
                                            ) : (
                                                <span></span>
                                        )}

                                        {errors.cpfCnpj && (
                                            <span className="text-error opacity-75">{errors.cpfCnpj?.message}</span>
                                        )}
                                    </div>
                                </>
                                
                            )
                        
                            }

                        </div>

                        <div className='flex justify-center flex-col text-center gap-5'>
                            <Button
                                id='submitButton'
                                type="submit"
                                isDisabled={timer > 0 || loading}
                                className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white bg-desSec shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-300 ${timer > 0 ? 'bg-opacity-50 cursor-not-allowed' : 'hover:bg-sec'}`}
                            >
                                {loading ? <Spinner/> : timer > 0 ? `Aguarde ${timer}s` : 'Enviar link'} 
                            </Button>
                            {message && (
                                <div className="text-error text-center p-2 rounded-md bg-red-100">
                                    <p>{!message.includes("mas sua conta é de prestador") && message}</p>

                                    {message.includes("mas sua conta é de prestador") && (
                                    <div className="mt-2">
                                        <p className="text-sm">Parece que sua conta é de prestador.</p>
                                        <a
                                        href="/request-reset-password-user"
                                        className="inline-block mt-1 text-desSec text-sm font-medium underline hover:text-desSec transition"
                                        >
                                        Clique aqui para redefinir como prestador
                                        </a>
                                    </div>
                                    )}
                                </div>
                            )}

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

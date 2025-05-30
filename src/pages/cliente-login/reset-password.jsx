import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../../componentes/imports';
import { resetPassword } from '../../services/api';
import axios from 'axios';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import notFoundToken from "../../assets/img/botao-x.webp"
import LoadingSpinner from '../../componentes/FormCadastro/Loading';

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button, Spinner } from '@nextui-org/react';

export default function ResetPasswordCliente() {
  const [showPassword, setShowPassword] = useState(false);
  

  const schema = yup.object({
    senha: yup.string().trim().required("A senha é obrigatório").min(6, "A senha deve ter no minimo 6 caracteres"),

    confirmarSenha: yup.string().trim().required("Confirme sua senha").oneOf([yup.ref("senha")], "As senhas devem ser iguais"),
  });

  const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(schema),
  })

  const location = useLocation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [Open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL_API}/auth/verify-reset-token?token=${token}`);
        setTokenValid(response.data.valid);
        
      } catch (error) {
        setTokenValid(false);
      }
    };
    verifyToken();
  }, [token]);

  const onSubmit = async (data) => {
    setLoading(true);

    const response = await resetPassword(token, data.senha);

    if (response) {
      setLoading(false);
      setErrorMessage(null);
      setOpen(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } else {
      setLoading(false);
      setErrorMessage('Erro ao redefinir senha. Tente novamente.');
    }
  };

  if(tokenValid === null) {
    return (
            <>
              <section className='flex justify-center h-[90vh]'>
                  <LoadingSpinner/>
              </section>
            </>
    )
  }

  if (!tokenValid) {
    return (
        <div className='h-screen flex flex-col p-10 w-full bg-center bg-cover'>
          <main className='flex flex-col justify-center items-center gap-5 lg:shadow-none rounded-md p-5 bg-white'>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
              <img
                alt="Limppay"
                src={Logo}
                className="mx-auto h-20 w-auto"
              />
              <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 text-desSec">
                O link para redefinir a senha expirou ou é inválido.
              </h2>
            </div>
            <div className='flex justify-center items-center'>
              <img src={notFoundToken} alt="errorLink" className='w-2/12 text-p'/>
            </div>
          </main>
        </div>
    );
  }

  return (
    <div className='h-screen flex flex-col p-10 w-full bg-center bg-cover'>
      <main className='flex flex-col gap-5 lg:shadow-none rounded-md p-5 bg-white'>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
          <img
            alt="Limppay"
            src={Logo}
            className="mx-auto h-20 w-auto"
          />
          <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 text-desSec">
            Crie uma senha forte
          </h2>
          <p className='text-prim text-sm lg:text-md'>
            A senha deve conter 6 caracteres no mínimo, com letras maiúsculas e minúsculas, números e caracteres especiais ( ᕙ(⇀‸↼‶)ᕗ @#%& ).
          </p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="senha" className="block text-sm font-medium leading-6 text-ter">
                Nova senha
              </label>
              <div className="mt-2 w-full">
                <div className='relative'>
                  <input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    {...register("senha")}
                    placeholder='Digite sua nova senha'
                    className="border border-bord rounded-md w-full p-2 focus:outline-prim text-ter"
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-2 flex items-center text-ter"
                  >
                      {
                          showPassword ? 
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                              :
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>

                      }
                  </button>

                </div>
                {errors.senha?.message && (
                    <span className="text-error opacity-75 text-sm w-full">{errors.senha.message}</span>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmSenha" className="block text-sm font-medium leading-6 text-ter">
                Confirmar senha
              </label>
              <div className="mt-2">
                <div className='relative'>
                  <input
                    id="confirmSenha"
                    type={showPassword ? "text" : "password"}
                    {...register("confirmarSenha")}
                    placeholder='Confirme sua senha'
                    className="border border-bord rounded-md w-full p-2 focus:outline-prim text-ter"
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-2 flex items-center text-ter"
                  >
                      {
                          showPassword ? 
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                              :
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>

                      }
                  </button>

                </div>
                {errors.confirmarSenha?.message && (
                    <span className="text-error opacity-75 text-sm">{errors.confirmarSenha.message}</span>
                )}
              </div>
              {errorMessage && <p className="text-error text-sm">{errorMessage}</p>}
            </div>
            <div className='flex justify-center'>
              <Button
              isDisabled={loading}
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white bg-desSec shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:bg-sec transition-all duration-300"
              >
                {loading ? <Spinner/> : 'Redefinir senha'}
              </Button>
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
                <div className="sm:flex sm:items-center justify-center ">
                  <div className="mt-3 text-center space-y-5 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" className="font-semibold  text-desSec text-2xl text-center">
                      Senha alterada com sucesso! :D
                    </DialogTitle>
                    <div className="mt-2 text-center">
                      <div className="flex flex-col gap-7 text-prim  overflow-y-auto max-h-[60vh]">
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 flex justify-center">
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

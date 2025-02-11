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

export default function ResetPassword() {

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
                <input
                  id="senha"
                  type='password'
                  {...register("senha")}
                  placeholder='Digite sua nova senha'
                  className="border border-bord rounded-md w-full p-2 focus:outline-prim text-ter"
                />
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
                <input
                  id="confirmSenha"
                  type='password'
                  {...register("confirmarSenha")}
                  placeholder='Confirme sua senha'
                  className="border border-bord rounded-md w-full p-2 focus:outline-prim text-ter"
                />
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
                        <p className='text-prim'>Estamos lhe redirecionando para a tela de login...</p>
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

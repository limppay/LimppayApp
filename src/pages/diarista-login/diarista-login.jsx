import React, { useEffect, useState } from 'react';
import { Logo } from '../../componentes/imports';
import painel from "../../assets/img/two-young-professional-housewives-cleaning-the-hou-2023-11-27-05-06-46-utc.webp";
import { login, prestadorProfile } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from '@nextui-org/react';
import CookieBanner from '../../componentes/App/CookieBanner';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { usePrestador } from '../../context/PrestadorProvider';

export default function DaristaLogin() {
    const { prestador, setPrestador } = usePrestador()
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('')
        
        try {
            const response = await login(email, senha, email); // utiliza-se o mesmo input, por isso é "email"
            
            if (!response) {
                setError("Erro ao fazer o login");

            } else {
                const prestador = await prestadorProfile()
                setPrestador(prestador)
                navigate("/area-diarista");

            }

        } catch (Error) {
            setError(Error.message);
            console.error(Error);

        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        if(prestador) {
            navigate("/area-diarista")
        }

    }, [prestador])

    return (
        <>
            <Helmet>
                <title>Limppay: Prestador</title>
            </Helmet>
            
            <div className='flex h-screen w-full max-w-full justify-center'>
                <div className='flex flex-col p-10 w-full lg:w-[vh] xl:w-[100vh]'>
                    <main className='flex flex-col gap-10  rounded-md p-5 bg-white'>

                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <img
                                alt="Limppay"
                                src={Logo}
                                className="mx-auto h-20 w-auto"
                            />
                            <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 text-desSec">
                                Área Diarista
                            </h2>
                            <p className='text-prim'>Entre na sua conta e acesse seu perfil da Limppay! :D</p>
                        </div>
                        
                        <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-ter">
                                        Email ou CPF
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            name="email"
                                            // type="email"
                                            required
                                            // autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="border border-bord rounded-md w-full p-2 focus:outline-prim text-ter"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-ter">
                                            Senha
                                        </label>
                                        <div className="text-sm">
                                            <a href="/request-reset-password-user"
                                            target='_blank'
                                            className="font-semibold text-ter hover:text-indigo-500">
                                                Esqueceu sua senha?
                                            </a>
                                        </div>
                                    </div>
                                    <div className="mt-2 relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            autoComplete="current-password"
                                            value={senha}
                                            onChange={(e) => setSenha(e.target.value)}
                                            className="border border-bord rounded-md w-full p-2 focus:outline-prim text-ter"
                                        />
                                        {senha.trim() && (
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
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white bg-desSec shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        isDisabled={loading}
                                    >
                                        {loading ? <Spinner/> : 'Entrar'}
                                    </Button>
                                </div>
                                {error && <p className="text-red-500 flex justify-center text-error">{error}</p>}
    
                            </form>
                        </div>      
                            
                    </main>
                </div>
                <img src={painel} alt="" className='hidden  xl:flex xl:w-[150vh]'/>
            </div>


            <CookieBanner/>
        
        </>
    );
}

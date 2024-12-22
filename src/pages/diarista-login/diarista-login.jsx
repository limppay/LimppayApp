import React, { useState } from 'react';
import { Logo } from '../../componentes/imports';
import painel from "../../assets/img/two-young-professional-housewives-cleaning-the-hou-2023-11-27-05-06-46-utc.jpg";
import { login } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from '@nextui-org/react';
import CookieBanner from '../../componentes/App/CookieBanner';
import { Helmet } from 'react-helmet-async';

export default function DaristaLogin() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('')
        
        try {
            const response = await login(email, senha);
            console.log("Usuário logado com sucesso! ", response.data)

            if (!response) {
                setError("Não foi possível fazer o login");
            } else {
                // localStorage.setItem('token_prestador', access_token);
                // localStorage.setItem('prestadorId', userId);
                navigate("/area-diarista");
            }
        } catch (err) {
            setError('Não foi possivel realizar o login: ', err);
            console.error(err);

        } finally {
            setLoading(false);
        }
    };

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
                                        Email
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            autoComplete="email"
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
                                    <div className="mt-2">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            autoComplete="current-password"
                                            value={senha}
                                            onChange={(e) => setSenha(e.target.value)}
                                            className="border border-bord rounded-md w-full p-2 focus:outline-prim text-ter"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white bg-desSec shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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

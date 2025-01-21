import React, { useState } from 'react';
import { getEnderecosCliente, loginCliente, perfil } from '../../services/api';
import { useUser } from '../../context/UserProvider';
import { Spinner } from '@nextui-org/react';
import { Button } from '@nextui-org/react';

export default function StepLoginCustomer() {
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        const login = await loginCliente(email, senha);
        const profile = await perfil(login)
        setUser(profile)
        console.log("Login realizado com sucesso!", profile)
        navigate("/contrate-online");

    } catch (err) {
        setError(err.message);
        console.error(err);

    } finally {
        setLoading(false);
    }
  };

  return (
    <div className='flex flex-col w-full bg-center bg-cover'>
      <main className='flex flex-col gap-10 lg:shadow-none rounded-md p-5 bg-white justify-center items-center'>
        <div className="w-full flex flex-col">
          <h2 className="xl:mt-5 text-center text-lg xl:text-2xl font-bold leading-9 tracking-tight text-gray-900 text-desSec">
            Faça login para continuar
          </h2>
        </div>
        <div className="w-[35vh] lg:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className='text-start'>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-ter">Email</label>
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
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-ter">Senha</label>
                <div className="text-sm ">
                  <a href="/request-reset-password"
                    target='_blank'
                    className="font-semibold text-prim hover:text-indigo-500">
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
            <div className='flex flex-col gap-5'>
              <div>
                <Button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white bg-desSec shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  isDisabled={loading}
                >
                  {loading ? <Spinner size='md'/> : 'Entrar'}
                </Button>
                {error && <p className="text-red-500 flex justify-center text-error">{error}</p>}
              </div>
              <div>
                <a href="/cadastro-cliente" target='_blank'>
                  <Button className='w-full bg-white border-desSec border text-desSec'>
                    Nova conta
                  </Button>
                
                </a>

              </div>


            </div>
          </form>
          
        </div>
      </main>
    </div>
  );
}

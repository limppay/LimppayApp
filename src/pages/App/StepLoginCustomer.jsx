import React, { useState } from 'react';
import { getEnderecosCliente, loginCliente } from '../../services/api';
import { useUser } from '../../context/UserProvider';

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
      const { access_token, userId, urls } = await loginCliente(email, senha);

      // Obtendo os endereços do cliente
      const enderecosCliente = await getEnderecosCliente(userId);
      if (!enderecosCliente) {
        setError('Erro ao buscar endereços do cliente');
        return;
      }

      if (!access_token) {
        setError('Erro ao fazer login');
      } else {

        localStorage.setItem('token', access_token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('urls', JSON.stringify(urls));
        localStorage.setItem('enderecosCliente', JSON.stringify(enderecosCliente));

        setUser({ userId, urls, enderecos: enderecosCliente });

        console.log(access_token)
        console.log(enderecosCliente)
      }
    } catch (err) {
      setError('Erro ao fazer login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col p-10 w-full lg:w-5/12 bg-center bg-cover'>
      <main className='flex flex-col gap-10 lg:shadow-none rounded-md p-5 bg-white'>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 text-desSec">
            Faça login para continuar
          </h2>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
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
                <div className="text-sm">
                  <a href="/request-reset-password"
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
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white bg-desSec shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
            {error && <p className="text-red-500 flex justify-center text-error">{error}</p>}
          </form>
        </div>
      </main>
    </div>
  );
}

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Spinner } from '@nextui-org/react';
import { Logo } from '../../componentes/imports';
import { sendMailContact } from '../../services/api';

const DeleteAccountPage = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const schema = yup.object({
      name: yup.string().required("Digite seu nome"),
      email: yup.string().required("E-mail é obrigatório"),
      message: yup.string().required("Menssagem é obrigatório")  
  })
  .required()

  const {
      register,
      handleSubmit,
      trigger,
      formState: { errors },
      reset,
      setValue, 
      getValues,
      watch,
      clearErrors
      } = useForm({
      resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    setLoading(true)

    console.log("Enviando formulario: ", data)

    try {
        const response = await sendMailContact(data)
        setMessage(response.message)
        setLoading(false)
        reset()

    } catch (error) {
      console.log(error)
        
    }
      
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-md">
        {/* Cabeçalho */}
        <div>
          <img
            alt="Limppay"
            src={Logo}
            className="mx-auto h-20 w-auto"
          />
          <h1 className="pt-[2vh] text-xl font-bold text-center text-desSec">
            Solicitação de Exclusão de Conta
          </h1>
          <p className="mt-2 text-center text-sm text-prim">
            Preencha o formulário abaixo para solicitar a exclusão da sua conta no Limppay. 
            Processaremos sua solicitação em até 7 dias úteis.
          </p>
        </div>

        {/* Formulário */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Campo de e-mail */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-prim">
                Nome Completo
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-error' : 'border-prim'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Campo de e-mail */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-prim">
                E-mail registrado na Limppay
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-error' : 'border-prim'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="seuemail@exemplo.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Campo de mensagem opcional */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-prim">
                Comentários 
              </label>
              <textarea
                id="message"
                {...register('message')}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-prim placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Digite qualquer informação adicional, se desejar"
                rows="4"
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>
          </div>

          {/* Botão de envio */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-desSec  ${
                loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? <Spinner/> : 'Enviar Solicitação'}
            </button>
          </div>
          <div className='w-full flex justify-center text-center pt-2'>
            {message && 
                <span className='text-sec'>{message}</span>
            }

          </div>
        </form>

        {/* Rodapé */}
        <p className="text-center text-sm text-prim">
          Dúvidas? Entre em contato: <a href="mailto:contato@limppay.com" className="text-desSec hover:underline">suporte@limppay.com</a>
        </p>
      </div>
    </div>
  );
};

export default DeleteAccountPage;
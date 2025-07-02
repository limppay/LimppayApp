// src/pages/Checkout/Sucesso.jsx

import React from 'react'
import { Button } from '@nextui-org/react'
import { useNavigate } from 'react-router-dom'

export default function Sucesso() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-prim p-10 text-center">
      <h1 className="text-3xl font-bold mb-4">Pagamento confirmado com sucesso!</h1>
      <p className="mb-6 text-lg">Obrigado por confiar na Limppay! Seu agendamento foi concluído com êxito.</p>
      <div className="flex gap-4">
        <Button onPress={() => navigate('/area-cliente')} className="bg-sec text-white">
          Acessar área do cliente
        </Button>
        <Button onPress={() => navigate('/contrate-online')} className="bg-white border border-sec text-sec">
          Novo agendamento
        </Button>
      </div>
    </div>
  )
}

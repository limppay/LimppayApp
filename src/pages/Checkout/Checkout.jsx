import React, { useEffect } from 'react';
import { useAgendamentoData } from '../../context/AgendamentoData';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Checkout() {
  const { agendamentoData, setAgendamentoData } = useAgendamentoData();
  const navigate = useNavigate();
  const location = useLocation(); // Obtém a localização atual

  console.log("Dados recebidos para checkout: ", agendamentoData);

  useEffect(() => {
    // Verifica se a rota atual é "contrate-online"
    if (location.pathname === '/contrate-online') {
      setAgendamentoData(null); // Limpa os dados se a rota for "contrate-online"
    }
  }, [location.pathname, setAgendamentoData]);

  if (!agendamentoData) {
    return <div>Nenhum agendamento encontrado. Volte para a página de contratação.</div>;
  }

  return (
    <div>
      <h2>Checkout Pagamento</h2>
      <p>Serviço: {agendamentoData.Servico}</p>
      <p>Data: {agendamentoData.dataServico}</p>
      <p>Hora: {agendamentoData.horaServico}</p>

      <button onClick={() => navigate('/contrate-online')}>
        Voltar para Contrate Online
      </button>
    </div>
  );
}

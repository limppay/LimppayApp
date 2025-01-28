import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import React, { useState, useEffect, useRef } from "react";
import "react-circular-progressbar/dist/styles.css";
import { usePrestador } from "../../context/PrestadorProvider";

const Temporizador = ({ agendamento }) => {
  const { prestador } = usePrestador();

  const [tempoRestante, setTempoRestante] = useState(0); // Tempo restante em segundos
  const intervaloRef = useRef(null);

  // Função para converter string HH:mm para timestamp em UTC
  const horaStringParaTimestampUTC = ( horaString) => {
    if (!horaString) return 0;

    const [horas, minutos] = horaString.split(":").map(Number);
    
    // Obter a data atual para garantir que estamos usando o mesmo dia
    const hoje = new Date();

    // Criar um novo objeto Date com o horário do agendamento, mantendo a data de hoje
    const dataServico = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate(), horas, minutos, 0));

    // console.log("Data do serviço: ", dataServico.toISOString())

    return dataServico.getTime(); // Retorna o timestamp em milissegundos
  };

  // Função para calcular o tempo restante com base no horário de término em UTC
  const calcularTempoRestante = () => {
    const hoje = new Date(); // Obtém o timestamp atual em milissegundos
    const agoraEmMs = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate(), hoje.getHours(), hoje.getMinutes(), hoje.getSeconds()))
    // console.log("Timestamp Atual (agoraEmMs):", agoraEmMs.toISOString());

    // Hora de término em UTC
    const horaTerminoEmMs = horaStringParaTimestampUTC(agendamento?.horaServico) + Number(agendamento?.tipoServico) * 3600 * 1000;

    // Calcular a diferença entre o tempo de término e o tempo atual
    const restanteEmMs = horaTerminoEmMs - agoraEmMs;

    // Retorna a diferença em segundos (garantindo que seja positivo)
    return Math.max(0, Math.floor(restanteEmMs / 1000));
  };

  // Atualiza o tempo restante a cada segundo
  const iniciarCronometro = () => {
    if (intervaloRef.current) clearInterval(intervaloRef.current);

    intervaloRef.current = setInterval(() => {
      setTempoRestante(calcularTempoRestante());
    }, 1000);
  };

  // Formata o tempo em HH:mm:ss
  const formatarTempo = (segundos) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    return `${horas > 0 ? `${horas}:` : ""}${
      minutos < 10 ? "0" : ""
    }${minutos}:${segundosRestantes < 10 ? "0" : ""}${segundosRestantes}`;
  };

  // Limpar o intervalo ao desmontar o componente
  useEffect(() => {
    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, []);

  // Inicia o temporizador quando o agendamento for iniciado
  useEffect(() => {
    setTempoRestante(calcularTempoRestante());

    if (agendamento && agendamento?.status === "Iniciado") {
      setTempoRestante(calcularTempoRestante());
      iniciarCronometro();
    }
  }, [prestador, agendamento]);

  return (
    <div className="flex flex-col items-center gap-5 h-full">
      <h2 className="font-semibold">Tempo de serviço</h2>
      <div className="w-48 h-48">
        <CircularProgressbar
          value={(tempoRestante / (agendamento?.tipoServico * 3600)) * 100 || 0}
          text={formatarTempo(tempoRestante)}
          styles={buildStyles({
            textSize: "16px",
            pathColor: "#3e98c7",
            textColor: "#3e98c7",
            trailColor: "#d6d6d6",
          })}
        />
      </div>
    </div>
  );
};

export default Temporizador;

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import React, { useState, useEffect, useRef } from "react";
import "react-circular-progressbar/dist/styles.css";
import { usePrestador } from "../../context/PrestadorProvider";

const Temporizador = ({ agendamento }) => {
  const { prestador } = usePrestador();
  const [tempoRestante, setTempoRestante] = useState(0);
  const intervaloRef = useRef(null);

  // Se o servidor já envia timestamps, podemos usá-los diretamente.
  // Se `agendamento.horaServico` for `"HH:mm"`, convertemos para timestamp.
  const horaStringParaTimestamp = (horaString) => {
    if (!horaString) return 0;

    const [horas, minutos] = horaString.split(":").map(Number);
    const agora = Date.now(); // Timestamp atual

    // Criar um timestamp fixo sem fuso horário
    const data = new Date(agora);
    data.setHours(horas, minutos, 0, 0);

    return data.getTime(); // Retorna timestamp puro (milissegundos)
  };

  // Cálculo de tempo restante usando timestamps
  const calcularTempoRestante = () => {
    const agoraEmMs = Date.now(); // Timestamp puro do momento atual
    const horaInicio = horaStringParaTimestamp(agendamento?.horaServico);
    const duracaoMs = Number(agendamento?.tipoServico) * 3600 * 1000; // Converter horas para ms
    const horaTermino = horaInicio + duracaoMs;

    return Math.max(0, Math.floor((horaTermino - agoraEmMs) / 1000)); // Retorna em segundos
  };

  const iniciarCronometro = () => {
    if (intervaloRef.current) clearInterval(intervaloRef.current);

    intervaloRef.current = setInterval(() => {
      setTempoRestante(calcularTempoRestante());
    }, 1000);
  };

  const formatarTempo = (segundos) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    return `${horas > 0 ? `${horas}:` : ""}${String(minutos).padStart(2, "0")}:${String(segundosRestantes).padStart(2, "0")}`;
  };

  useEffect(() => {
    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, []);

  useEffect(() => {
    setTempoRestante(calcularTempoRestante());

    if (agendamento && agendamento?.status === "Iniciado") {
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

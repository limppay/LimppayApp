import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import React, { useState, useEffect, useRef } from "react";
import "react-circular-progressbar/dist/styles.css";
import { usePrestador } from "../../context/PrestadorProvider";

const Temporizador = ({ agendamento }) => {
  const { prestador } = usePrestador();
  const [tempoRestante, setTempoRestante] = useState(0);
  const intervaloRef = useRef(null);

  // Cálculo de tempo restante usando timeStart, timeTotal e timeEnd
  const calcularTempoRestante = () => {
    if (!agendamento?.timeStart || !agendamento?.timeTotal) return 0;

    // Garantir que timeStart seja interpretado corretamente no horário local
    const horaInicio = new Date(agendamento.timeStart); // Hora de início no fuso horário local
    const horaTermino = new Date(horaInicio.getTime() + agendamento.timeTotal * 60 * 60 * 1000); // Hora de término no horário local

    console.log("Hora de inicio no banco de dados: ", agendamento?.timeStart)
    console.log("Apos usar new Date no timeStart: ", new Date(agendamento.timeStart))

    console.log("Hora de início (timeStart):", horaInicio.toLocaleString());
    console.log("Hora de término (timeEnd):", horaTermino.toLocaleString());
    console.log("Timestamp atual:", new Date().toLocaleString());

    const agoraEmMs = new Date().getTime(); // Timestamp atual em fuso horário local

    // Verifique se o timestamp atual é após o tempo de término
    if (agoraEmMs >= horaTermino.getTime()) {
      return 0; // O tempo já acabou
    }

    // Retorna o tempo restante até o timeEnd em segundos
    return Math.max(0, Math.floor((horaTermino.getTime() - agoraEmMs) / 1000)); // Tempo restante em segundos
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
    if (agendamento && agendamento?.status === "Iniciado") {
      setTempoRestante(calcularTempoRestante());
      iniciarCronometro();
    }
  }, [prestador, agendamento, tempoRestante]);

  useEffect(() => {
    if (tempoRestante === 0 && intervaloRef.current) {
      clearInterval(intervaloRef.current); // Parar o cronômetro quando o tempo acabar
    }
  }, [tempoRestante]);

  console.log("Tempo restante:", tempoRestante);

  return (
    <div className="flex flex-col items-center gap-5 h-full">
      <h2 className="font-semibold">Tempo de serviço</h2>
      <div className="w-48 h-48">
        <CircularProgressbar
          value={(tempoRestante / (agendamento?.timeTotal * 3600)) * 100 || 0} // Calculando o progresso
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

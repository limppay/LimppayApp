import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import React, { useState, useEffect, useRef } from "react";
import "react-circular-progressbar/dist/styles.css";
import { usePrestador } from "../../context/PrestadorProvider";

const Temporizador = ({ agendamento, setRunnig, setDisablePause }) => {
  const { prestador } = usePrestador();
  const [tempoRestante, setTempoRestante] = useState(0);
  const intervaloRef = useRef(null);

  // Cálculo de tempo restante usando timeStart, timeTotal e timeEnd
  const calcularTempoRestante = () => {
    if (!agendamento?.timeStart || !agendamento?.timeTotal) return 0;
  
    const horaInicio = new Date(agendamento?.timeStart);
    let horaTermino = new Date(horaInicio.getTime() + agendamento?.timeTotal * 60 * 60 * 1000);
    const agoraEmMs = new Date().getTime();
  
    // Se o serviço já teve seu tempo ajustado (por exemplo, após uma pausa)
    if (agendamento?.timeEnd) {
      horaTermino = new Date(agendamento?.timeEnd);
    }
  
    // Se o serviço estiver pausado, considerar o tempo de pausa
    if (agendamento?.timePause) {
      const tempoPausado = agoraEmMs - new Date(agendamento?.timePause).getTime();
      horaTermino = new Date(horaTermino.getTime() + tempoPausado);
    }
  
    // Verificar se o tempo já acabou
    if (agoraEmMs >= horaTermino.getTime()) {
      return 0; // O tempo já expirou
    }
  
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

    return `${horas > 0 ? `${horas}:` : "00:"}${String(minutos).padStart(2, "0")}:${String(segundosRestantes).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (agendamento && (agendamento?.status === "Iniciado" || agendamento?.status === 'Repouso')) {
      setTempoRestante(calcularTempoRestante());
      iniciarCronometro();
    }

  }, [tempoRestante, agendamento, prestador]);

  useEffect(() => {
    if (tempoRestante === 0 && intervaloRef.current) {
      clearInterval(intervaloRef.current); // Parar o cronômetro quando o tempo acabar
    }
  }, [tempoRestante, agendamento, prestador]);
    
  useEffect(() => {
    const agora = new Date()
    const termino = new Date(agendamento?.timeEnd)

    if(agora.getTime() >= termino.getTime()) {
      // console.log("Tempo acabou!")
      setDisablePause(true)
      setRunnig(false)

    } else {
      // console.log("Rodando...")
      setRunnig(true)

    }

  }, [tempoRestante, setTempoRestante, agendamento, prestador])


  return (
    <div className="flex flex-col items-center gap-5 h-full">
      <h2 className="font-semibold">Tempo restante</h2>
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
      {(agendamento?.status == "Iniciado" || agendamento?.status == 'Repouso') && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 pt-[2vh] justify-between">
          <div className="md:text-center">
            <h3 className="font-semibold">Horário que iniciou</h3>
            <p>{new Date(agendamento?.timeStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}h</p>
          </div>

          <div className="md:text-center">
            <h3 className="font-semibold">Tempo de repouso</h3>
            <span>{agendamento?.totalPausado ? (agendamento?.totalPausado / 60000).toFixed(2) + " min" : "0 min"} </span>

          </div>

          <div className="col-span-2 md:text-center">
            <h3 className="font-semibold">Previsão para finalizar o serviço</h3>
            <p>{new Date(agendamento?.timeEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}h</p>

          </div>


        </div>
      )}
    </div>
  );
};

export default Temporizador;

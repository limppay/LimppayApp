import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {Select, SelectSection, SelectItem} from "@nextui-org/select";

const CustomCalendar = ({ onConfirmSelection, selectedDates, setSelectedDates, maxSelection, selectedTimes, setSelectedTimes }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const [currentYearPage, setCurrentYearPage] = useState(0);
  const[isConfirmEnabled, setIsConfirmEnabled] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const currentYear = today.getFullYear();

  useEffect(() => {
    const initialYearPage = Math.floor((currentYear - (currentYear - 50)) / 16);
    setCurrentYearPage(initialYearPage);
  }, [currentYear]);

  useEffect(() => {
    if (selectedDates.length === maxSelection) {
        setIsConfirmEnabled(true);
    } else {
        setIsConfirmEnabled(false);
    }
}, [selectedDates, maxSelection])

  const renderDaysOfWeek = () => {
    const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    return daysOfWeek.map((day, index) => (
      <div key={index} className="font-bold text-lg text-center text-desSec pb-2">{day}</div>
    ));
  };

  const TimePickerPopup = ({ selectedDates, onClose, onConfirm }) => {
    const [times, setTimes] = useState({});
    const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);
    const [selectedTimes, setSelectedTime] = useState('');
  
    const handleTimeChange = (date, time) => {
      setTimes(prev => {
          const updateTimes = { ...prev, [date]: time }; // Atualiza o horário para a data específica
      
          // Verifica se todos os horários foram preenchidos
          const allTimesFilled = selectedDates.every(date => updateTimes[date.toDateString()]);
      
          setIsConfirmEnabled(allTimesFilled);
      
          return updateTimes;
      });
  };
  

    const handleSelectAllTimes = (time) => {
      setTimes(selectedDates.reduce((acc, date) => {
        acc[date.toDateString()] = time; // Atualiza o horário para cada data
        return acc;
      }, {}));
      setIsConfirmEnabled(true); // Habilita o botão de confirmar se todos os horários foram preenchidos
    };
    
    
  
    const handleConfirm = () => {
      onConfirm(times);
      onClose();
    };

    const transitionVariants = {
      enter: { opacity: 0, scale: 0.8 },
      center: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
    };

    const horarios = [
      {key: "07:00", label: "07:00", 'aria-label': "07:00"},
      {key: "07:30", label: "07:30", 'aria-label': "07:30"},
      {key: "08:00", label: "08:00", 'aria-label': "08:00"},
      {key: "08:30", label: "08:30", 'aria-label': "08:30"},
      {key: "09:00", label: "09:00", 'aria-label': "09:00"},
      {key: "09:30", label: "09:30", 'aria-label': "09:30"},
      {key: "10:00", label: "10:00", 'aria-label': "10:00"},
      {key: "10:30", label: "10:30", 'aria-label': "10:30"},
      {key: "11:00", label: "11:00", 'aria-label': "11:00"},
      {key: "11:30", label: "11:30", 'aria-label': "11:30"},
      {key: "12:00", label: "12:00", 'aria-label': "12:00"},
      {key: "12:30", label: "12:30", 'aria-label': "12:30"},
      {key: "13:00", label: "13:00", 'aria-label': "13:00"},
      {key: "13:30", label: "13:30", 'aria-label': "13:30"},
      {key: "14:00", label: "14:00", 'aria-label': "14:00"},
      {key: "14:30", label: "14:30", 'aria-label': "14:30"},
      {key: "15:00", label: "15:00", 'aria-label': "15:00"},
      {key: "15:30", label: "15:30", 'aria-label': "15:30"},
      {key: "16:00", label: "16:00", 'aria-label': "16:00"}
    ];
    
    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center"
        initial="enter"
        animate="center"
        exit="exit"
        variants={transitionVariants}
      >
      <div className="fixed inset-0 flex items-center justify-center bg-prim bg-opacity-70 ">
        <div className="bg-white p-4 rounded-lg shadow-lg flex w-9/12 lg:w-3/12 flex-col gap-5">
          <h3 className="text-lg font-bold mb-2 text-desSec">Selecione os horários</h3>

            <Select
                id='horasTodos'
                placeholder="Selecione um horário para todos"
                className="w-full text-prim"
                onChange={(e) => handleSelectAllTimes(e.target.value)}
                aria-label='horasTodos'
              >
                {horarios.map((hora) => (
                  <SelectItem key={hora.key} className='text-prim' aria-label={hora.label}>
                    {hora.label}
                  </SelectItem>
                ))}
              </Select>


          <div className='overflow-y-auto max-h-[25vh]'>
            {selectedDates.map(date => (
              <div key={date.toString()} className="flex justify-between items-center mb-2 text-prim">
                <span>{date.toLocaleDateString()}</span>

                <Select
                    id='horas'
                    isRequired
                    placeholder="--:--"
                    className="w-5/12 text-prim "
                    onChange={(value) => handleTimeChange(date.toDateString(), value)} // Ajuste aqui
                    aria-label='horas'
                >
                    {horarios.map((hora) => (
                        <SelectItem key={hora.key} className='text-prim ' aria-label={hora.label}>
                            {hora.label}
                        </SelectItem>
                    ))}
                </Select>

              </div>
            ))}
          </div>
          <div className="flex justify-end pt-5 gap-5">
            <button className="ml-2 text-error text-opacity-75" onClick={onClose}>Cancelar</button>
            <button 
              className={`bg-des text-white p-2 rounded-md ${!isConfirmEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleConfirm}
              disabled={!isConfirmEnabled} // Desativa o botão se não estiver habilitado
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
      </motion.div>
    );
  };
  

  const renderDays = () => {
    const days = [];
    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

    // Preencher dias do mês anterior
    for (let i = startDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="p-1 text-prim text-center items-center flex justify-center text-opacity-20">
          {prevMonthDays - i}
        </div>
      );
    }

    // Preencher dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const isSelected = selectedDates.some(date => date.toDateString() === dateToCheck.toDateString());
      const isDisabled = dateToCheck < today;

      days.push(
        <div
          key={i}
          onClick={() => {
            if (!isDisabled) {
              // Se a data já estiver selecionada, remove-a
              if (isSelected) {
                setSelectedDates(prev => prev.filter(date => date.toDateString() !== dateToCheck.toDateString()));
              } else {
                // Adiciona a data somente se o número máximo de seleções não for atingido
                if (selectedDates.length < maxSelection) {
                  setSelectedDates(prev => [...prev, dateToCheck]);
                }else{
                  alert(`Você ultrapassou os limites de dias definidos: ${maxSelection}`)
                }
              }
            }
          }}
          className={`m-[0.1rem] day text-center p-2 border rounded-md border-trans transition-all duration-300 transform 
            ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105 hover:border-des'}
            ${isSelected ? 'bg-des text-white scale-100' : 'scale-95'}`}
        >
          {i}
        </div>
      );
    }

    // Preencher dias do próximo mês
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(
        <div key={`next-${i}`} className="p-1 text-prim text-center items-center flex justify-center text-opacity-20">
          {i}
        </div>
      );
    }

    return days;
  };

  const handlePrevYearPage = () => {
    setCurrentYearPage((prev) => prev - 1);
  };

  const handleNextYearPage = () => {
    setCurrentYearPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (showYears) {
      handlePrevYearPage();
    } else if (showMonths) {
      setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }
  };

  const handleNext = () => {
    if (showYears) {
      handleNextYearPage();
    } else if (showMonths) {
      setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }
  };

  const handleMonthYearChange = (month, year) => {
    setCurrentDate(new Date(year, month, 1));
    setShowMonths(false);
    setShowYears(false);
  };

  const handleYearChange = (year) => {
    setCurrentDate(new Date(year, 0, 1));
    setShowYears(false);
    setShowMonths(true);
  };

  const handleMonthYearClick = () => {
    if (showMonths) {
      setShowMonths(false);
      setShowYears(true);
    } else {
      setShowMonths(!showMonths);
      setShowYears(false);
    }
  };

  const renderMonths = () => {
    const months = Array.from({ length: 12 }, (_, i) => (
      <div
        key={i}
        onClick={() => handleMonthYearChange(i, currentDate.getFullYear())}
        className="p-2 cursor-pointer text-center transition-all duration-300 transform scale-95 hover:scale-105 border rounded-md border-trans hover:border-des"
      >
        {new Date(0, i).toLocaleString('default', { month: 'long' })}
      </div>
    ));

    return (
      <div className="grid grid-cols-3 gap-2 p-4">
        {months}
      </div>
    );
  };

  const renderYears = () => {
    const startYear = currentYear - 50 + currentYearPage * 16;
    const endYear = startYear + 15;

    const years = [];
    for (let i = startYear; i <= endYear; i++) {
      years.push(i);
    }

    return (
      <div className="p-4">
        <div className="grid grid-cols-4 gap-2">
          {years.map((year) => (
            <div
              key={year}
              onClick={() => handleYearChange(year)}
              className="p-2 cursor-pointer text-center transition-all duration-300 transform scale-95 hover:scale-105 border rounded-md border-trans hover:border-des"
            >
              {year}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getCalendarTitle = () => {
    if (showYears) {
      const startYear = currentYear - 50 + currentYearPage * 16;
      const endYear = startYear + 15;
      return `${startYear} - ${endYear}`;
    } else if (showMonths) {
      return `${currentDate.getFullYear()}`;
    } else {
      return `${new Date(currentDate).toLocaleString('default', { month: 'long' })} de ${currentDate.getFullYear()}`;
    }
  };

  const transitionVariants = {
    enter: { opacity: 0, scale: 0.8 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  return (
    <div className="flex flex-col pt-4 w-full md:w-9/12 lg:w-6/12">
      <motion.div
        className="w-full bg-white shadow-xl rounded-xl border-2 border-opacity-50 border-desSec lg:h-[60vh]"
        key={`${currentDate.toISOString()}-${currentYearPage}-${showMonths}-${showYears}`} // Key para reiniciar a animação
        variants={transitionVariants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        <div className="flex justify-between items-center mb-4 p-3 border-b-2 border-desSec border-opacity-50 cursor-pointer">
          <button onClick={handlePrev} className="text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-des">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h2
            className={`text-lg font-semibold text-desSec ${showYears ? 'cursor-default' : 'cursor-pointer'}`}
            onClick={() => {
              if (!showYears) {
                handleMonthYearClick();
              }
            }}
          >
            {getCalendarTitle()}
          </h2>
          <button onClick={handleNext} className="text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-des">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 19.5 15.75 12l-7.5-7.5" />
            </svg>
          </button>
        </div>
        {showYears ? renderYears() : showMonths ? renderMonths() : (
          <>
            <div className='lg:pt-0 p-2 overflow-hidden'>
              <div className="grid grid-cols-7 overflow-hidden">
                {renderDaysOfWeek()}
              </div>
              <div className="grid grid-cols-7 overflow-hidden">
                {renderDays()}
              </div>
            </div>
          </>
        )}
      </motion.div>
        <div className="flex justify-center mt-4">
        <button
          className={`bg-des text-white p-2 rounded-md ${isConfirmEnabled ? '' : 'opacity-50 cursor-not-allowed'}`}
          disabled={!isConfirmEnabled}
          onClick={(onConfirmSelection) => setShowTimePicker(true)} // Abre o pop-up
          >
            Confirmar Seleção
          </button>
      </div>
    {/* Renderização do Pop-Up */}
    {showTimePicker && (
      <TimePickerPopup
        selectedDates={selectedDates}
        onClose={() => setShowTimePicker(false)}
        onConfirm={(times) => {
          console.log(times); // Aqui você pode fazer o que precisar com os horários
          setShowTimePicker(false);
          setSelectedTimes(times);
          onConfirmSelection();
        }}
      />
    )}
  </div>
  );
};

export default CustomCalendar;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCalendar = ({ onConfirmSelection, selectedDates, setSelectedDates, maxSelection }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const [currentYearPage, setCurrentYearPage] = useState(0);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState({}); // Para armazenar horários por data


  const currentYear = today.getFullYear();

  useEffect(() => {
    const initialYearPage = Math.floor((currentYear - (currentYear - 50)) / 16);
    setCurrentYearPage(initialYearPage);
  }, [currentYear]);

  const renderDaysOfWeek = () => {
    const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    return daysOfWeek.map((day, index) => (
      <div key={index} className="font-bold text-lg text-center text-desSec pb-2">{day}</div>
    ));
  };

  const TimePickerPopup = ({ selectedDates, onClose, onConfirm }) => {
    const [times, setTimes] = useState({});
  
    const handleTimeChange = (date, time) => {
      setTimes(prev => ({ ...prev, [date]: time }));
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
  
    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        initial="enter"
        animate="center"
        exit="exit"
        variants={transitionVariants}
      >
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded-md shadow-lg">
          <h3 className="text-lg font-bold mb-2">Selecione os horários</h3>
          {selectedDates.map(date => (
            <div key={date.toString()} className="flex justify-between items-center mb-2">
              <span>{date.toLocaleDateString()}</span>
              <input
                type="time"
                onChange={(e) => handleTimeChange(date.toDateString(), e.target.value)}
                className="border p-1"
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button className="bg-des text-white py-1 px-2 rounded-md" onClick={handleConfirm}>
              Confirmar
            </button>
            <button className="ml-2 text-red-500" onClick={onClose}>Cancelar</button>
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
            <div className='lg:pb-12 lg:pt-0 p-2 overflow-hidden'>
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
          className={`bg-des text-white py-2 px-4 rounded-md ${selectedDates.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={selectedDates.length === 0}
          onClick={() => setShowTimePicker(true)} // Abre o pop-up
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
        }}
      />
    )}
  </div>
  );
};

export default CustomCalendar;

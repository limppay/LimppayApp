import React, { useState, useEffect } from 'react';

const CustomCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const [currentYearPage, setCurrentYearPage] = useState(0);

  const currentYear = currentDate.getFullYear();

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

  const renderDays = () => {
    const days = [];
    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

    for (let i = startDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="p-1 text-prim text-center items-center flex justify-center text-opacity-20">
          {prevMonthDays - i}
        </div>
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected = currentDate.getDate() === i;
      days.push(
        <div
          key={i}
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))}
          className={`m-[0.1rem] day text-center p-2 cursor-pointer border rounded-md border-trans transition-all duration-100 hover:border-solid text-ter hover:border-des ${isSelected ? 'bg-des text-white' : ''}`}
        >
          {i}
        </div>
      );
    }

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

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleMonthYearChange = (month, year) => {
    setCurrentDate(new Date(year, month, 1));
    setShowMonths(false);
    setShowYears(false);
  };

  const handleYearChange = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setShowYears(false);
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
        className="p-2 cursor-pointer hover:bg-gray-200 text-center"
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
    const startYear = currentYear - 50;
    const endYear = currentYear + 50;

    const years = [];
    for (let i = startYear; i <= endYear; i++) {
      years.push(i);
    }

    const startIndex = currentYearPage * 16;
    const endIndex = startIndex + 16;

    const paginatedYears = years.slice(startIndex, endIndex);

    return (
      <div className="p-4">
        <div className="grid grid-cols-4 gap-2">
          {paginatedYears.map((year) => (
            <div
              key={year}
              onClick={() => handleYearChange(year)}
              className="p-2 cursor-pointer hover:bg-gray-200 text-center"
            >
              {year}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentYearPage(prev => Math.max(prev - 1, 0))}
            disabled={currentYearPage === 0}
            className="text-blue-500"
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentYearPage(prev => Math.min(prev + 1, Math.floor((years.length - 1) / 16)))}
            disabled={currentYearPage >= Math.floor((years.length - 1) / 16)}
            className="text-blue-500"
          >
            Próximo
          </button>
        </div>
      </div>
    );
  };

  // Título do calendário com base na visualização atual
  const getCalendarTitle = () => {
    if (showYears) {
      const startYear = currentYear - 50 + currentYearPage * 16; // Primeiro ano exibido
      const endYear = startYear + 15; // Último ano exibido
      return `${startYear} - ${endYear}`;
    } else {
      return showMonths
        ? `${new Date(currentDate).toLocaleString('default', { month: 'long' })} - ${currentDate.getFullYear()}`
        : currentDate.getFullYear();
    }
  };

  return (
    <div className="flex justify-center items-center h-screen pt-[10vh]">
      <div className="w-4/12 bg-white shadow-xl rounded-xl border-2 border-opacity-50 border-desSec">
        <div className="flex justify-between items-center mb-4 p-3 border-b-2 border-desSec border-opacity-50">
          <button onClick={handlePrevMonth} className="text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-des">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-desSec" onClick={handleMonthYearClick}>
            {getCalendarTitle()}
          </h2>
          <button onClick={handleNextMonth} className="text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-des">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        <div className='pt-0 pr-5 pl-5'>
          {showYears ? renderYears() : showMonths ? renderMonths() : (
            <>
              <div className="grid grid-cols-7">
                {renderDaysOfWeek()}
              </div>
              <div className="grid grid-cols-7 mt-2">
                {renderDays()}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomCalendar;

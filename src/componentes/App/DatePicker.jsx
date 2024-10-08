import React, { useState } from 'react';

const CustomCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

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

    // Adiciona dias do mês anterior
    for (let i = startDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="p-1 text-prim text-center items-center flex justify-center text-opacity-20">
          {prevMonthDays - i}
        </div>
      );
    }

    // Adiciona dias do mês atual
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

    // Adiciona dias do próximo mês
    const remainingDays = 42 - days.length; // 42 = 7 dias * 6 semanas
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

  const handleYearClick = () => {
    setShowModal(true);
  };

  const handleMonthYearChange = (month, year) => {
    setCurrentDate(new Date(year, month, 1));
    setShowModal(false);
  };

  return (
    <div className="flex justify-center items-center h-screen pt-[10vh] ">
      <div className="w-4/12 bg-white shadow-xl rounded-xl border-2 border-opacity-50 border-desSec ">
        <div className="flex justify-between items-center mb-4 p-3 border-b-2 border-desSec border-opacity-50">
          <button onClick={handlePrevMonth} className="text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-des">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-desSec" onClick={handleYearClick}>
            {currentDate.toLocaleString('default', { month: 'long' })} de {currentDate.getFullYear()}
          </h2>
          <button onClick={handleNextMonth} className="text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-des">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        <div className='pt-0 pr-5 pl-5'>
          <div className="grid grid-cols-7">
            {renderDaysOfWeek()}
          </div>
          <div className="grid grid-cols-7 mt-2">
            {renderDays()}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Selecione o mês e o ano</h3>
            <div className="flex justify-between mb-4">
              <select
                onChange={(e) => handleMonthYearChange(e.target.value, currentDate.getFullYear())}
                value={currentDate.getMonth()}
                className="border p-2 rounded-md"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={currentDate.getFullYear()}
                onChange={(e) => handleMonthYearChange(currentDate.getMonth(), e.target.value)}
                className="border p-2 rounded-md"
              />
            </div>
            <button onClick={() => setShowModal(false)} className="bg-blue-500 text-white p-2 rounded-md">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;

// LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center flex-col gap-5">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-bord"></div>
    <div>
      <p className='text-prim'>Carregando...</p>
    </div>
  </div>
);

export default LoadingSpinner;

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', 
  // Não defina o Content-Type como 'application/json' aqui
  // para não interferir com o FormData posteriormente
});

// Função para criar o usuário e enviar arquivos
export const createUser = async (userData) => {
  return await api.post('/users', userData, {
    headers: {
      // O Content-Type será definido automaticamente como multipart/form-data
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default api;

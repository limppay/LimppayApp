import axios from 'axios';

// Cria a instância do Axios
const api = axios.create({
  baseURL: 'http://localhost:3000', // URL base da sua API
  headers: {
    'Content-Type': 'application/json',
  },
  //timeout: 10000
});

export const createUser = async (userData) => {
  return await api.post('/users', userData);
};


export default api;

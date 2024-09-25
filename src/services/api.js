import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
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

// Função para fazer login
export const login = async (email, senha) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      senha,
    });

    const { token } = response.data;
    localStorage.setItem('token', token); // Armazenar o token

    return true; // Login bem-sucedido
  } catch (error) {
    console.error('Erro ao fazer login:', error.response?.data || error.message);
    return false; // Login falhou
  }
};

export default api;

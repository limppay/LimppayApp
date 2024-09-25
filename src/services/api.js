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

    const { access_token, userId } = response.data; // Desestruturando corretamente

    if (access_token) {
      localStorage.setItem('token', access_token); // Armazenar o token
      localStorage.setItem('userId', userId); // Armazenar o ID do usuário

      return { access_token, userId }; // Retornar o token e o ID do usuário
    } else {
      throw new Error('Token não encontrado na resposta.');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error.response?.data || error.message);
    return false; // Login falhou
  }
};


export default api;

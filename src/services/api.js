import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Função para criar o usuário e enviar arquivos
export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Problema de conexão, tente novamente mais tarde'

    throw new Error(errorMessage)
  }
};

// Função para criar o cliente e enviar arquivos
export const createCliente = async (clienteData) => {
  try {
    const response = await api.post('/cliente', clienteData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Problema de conexão, tente novamente mais tarde'

    throw new Error(errorMessage)
  }
};

// Função para fazer login
export const login = async (email, senha) => {
  try {
    const response = await api.post('/auth/login-user', {
      email,
      senha,
    });

    const { access_token, userId, urls } = response.data; // Desestruturando corretamente

    if (access_token) {
      localStorage.setItem('token', access_token); // Armazenar o token
      localStorage.setItem('userId', userId); // Armazenar o ID do usuário
      localStorage.setItem('urls', JSON.stringify(urls))

      return { access_token, userId, urls }; // Retornar o token e o ID do usuário
    } else {
      throw new Error('Token não encontrado na resposta.');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Problema de conexão, tente novamente mais tarde'

    throw new Error(errorMessage)
  }
};

// Função para fazer login como cliente
export const loginCliente = async (email, senha) => {
  try {
    const response = await api.post('/auth/login-cliente', {
      email,
      senha,
    });

    const { access_token, userId, urls } = response.data; // Desestruturando corretamente

    if (access_token) {
      localStorage.setItem('token', access_token); // Armazenar o token
      localStorage.setItem('userId', userId); // Armazenar o ID do usuário
      localStorage.setItem('urls', JSON.stringify(urls))

      return { access_token, userId, urls }; // Retornar o token e o ID do usuário
    } else {
      throw new Error('Token não encontrado na resposta.');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Problema de conexão, tente novamente mais tarde'

    throw new Error(errorMessage)
  }
};

// Função para atualizar o usuário
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adicionando o token no cabeçalho
      },
    });
    return response.data; // Retornar os dados do usuário atualizado
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error.response?.data || error.message);
    return false; // Retornar false em caso de erro
  }
};

// Função para atualizar o cliente
export const updateCliente = async (id, clienteData) => {
  try {
    const response = await api.put(`/cliente/${id}`, clienteData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adicionando o token no cabeçalho
      },
    });
    return response.data; // Retornar os dados do usuário atualizado
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error.response?.data || error.message);
    return false; // Retornar false em caso de erro
  }
};


// Função para solicitar o link de redefinição de senha
export const requestPasswordReset = async (email, cpfCnpj) => {
  try {
    const response = await api.post('/auth/request-password-reset', {
      email,
      cpfCnpj
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Problema de conexão, tente novamente mais tarde';
    throw new Error(errorMessage); // Lançando o erro com a mensagem apropriada
  }
};

// Função para redefinir a senha
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword,
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao redefinir senha:', error.response?.data || error.message);
    return false;
  }
}


export default api;

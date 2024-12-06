import axios from 'axios';

const api = axios.create({
  baseURL: 'https://limppay-api-production.up.railway.app'
});

// Função para criar o usuário e enviar arquivos
export const createUser = async (userData) => {
  try {
    const response = await api.post('/users/create-step-one', userData, {
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

export const CreateStepTwo = async (id, userData) => {
  try {
    const response = await api.patch(`/users/update-step-two/${id}`, userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;

  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Problema de conexão, tente novamente mais tarde'

    throw new Error(errorMessage)
  }
}

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

//Função para pegar os prestadores disponiveis
export const getDisponiveis = (dataServico, servicoId, cidade, estado) => {
  return api.get('/prestadores/disponiveis', {
    params: {
      datas: dataServico,
      servicoId: servicoId,
      cidade: cidade,
      estado: estado
    },
  });
};

export const getUserProfile = async (cpfCnpj) => {
  try {
    const response = await api.get(`/users/profile/${cpfCnpj}`);
    return response.data;
    
  } catch (error) {
    console.error('Erro ao obter o perfil do usuário:', error); // Exibir erro no console
    return false; // Retornar false em caso de erro
  }
};

export const getEnderecosCliente = async (clienteId) => {
  try {
    const response = await api.get(`/cliente/enderecos/${clienteId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adicionando o token no cabeçalho
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Erro ao obter os endereços:', error.response?.data || error.message);
    return false; // Retornar false em caso de erro
  }
};

export const getEnderecoDefaultCliente = async (clienteId) => {
  try {
    const response = await api.get(`/cliente/enderecoDefault/${clienteId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adicionando o token no cabeçalho
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Erro ao obter o endereco padrão do cliente:', error.response?.data || error.message);
    return false; // Retornar false em caso de erro
  }
};

export const deleteEnderecosCliente = async (enderecoId) => {
  try {
    const response = await api.delete(`/cliente/enderecos/${enderecoId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adicionando o token no cabeçalho
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Erro ao deletar o endereco do cleinte:', error.response?.data || error.message);
    return false; // Retornar false em caso de erro
  }
};

export const CreateEnderecosCliente = async (enderecoData) => {
  try {
    const response = await api.post('/cliente/enderecos', enderecoData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adicionando o token no cabeçalho
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Erro ao criar o endereco do cliente:', error.response?.data || error.message);
    return false; // Retornar false em caso de erro
  }
};

export const createAgendamento = async (agendamentoData) => {
  try {
    const response = await api.post('/agendamentos', agendamentoData)
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Problema de conexão, tente novamente mais tarde'

    throw new Error(errorMessage)
  }
};

export const criarFaturaPix = async (dadosFatura) => {
  try {
    const response = await api.post('pagamentos/fatura/pix', dadosFatura);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar fatura PIX:', error.response?.data || error.message);
    throw error;
  }
};

export const criarFaturaCartao = async (dadosFatura) => {
  try {
    const response = await api.post('pagamentos/fatura/cartao', dadosFatura);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar fatura com cartão:', error.response?.data || error.message);
    throw error;
  }
};

export const getAgendamentos = async (id) => {
  try {
    const response = await api.get(`/agendamentos/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adicionando o token no cabeçalho
      },
    });
    return response.data; 
    
  } catch (error) {
    console.error('Erro ao obter os agendamentos:', error.response?.data || error.message);
    return false; // Retornar false em caso de erro
  }

}

export const getAvaliacoes = async (id) => {
  try {
    const response = await api.get(`/reviews/MadeReviewClient/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adicionando o token no cabeçalho
      },
    });

    return response.data; 
    
  } catch (error) {
    console.error('Erro ao obter as avaliações:', error.response?.data || error.message);
    return false; // Retornar false em caso de erro
  }
}

export const getAvaliacoesByPrestador = async (id) => {
  try {
    const response = await api.get(`/reviews/provider/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    return response.data; 
    
  } catch (error) {
    console.error('Erro ao obter as avaliações:', error.response?.data || error.message);
    return false;
  }
}

export const createReview = async (reviews) => {
  try {
    const response = await api.post('reviews/', reviews);

    return response.data;
  } catch (error) {
    console.error('Erro ao criar avaliação:', error.response?.data || error.message);
    throw error;
  }
};

export const findAllServicos = async () => {
  try {
    const response = await api.get('/servicos')
    return response.data

  } catch (error) {
    console.error('Erro ao encontrar os servicos:', error.response?.data || error.message);
    return false; // Retornar false em caso de erro
  }
}

export const applyCoupom = async (code, valor) => {
  try {
    const response = await api.post(`/coupons/${code}/apply`, {
      totalAmount: valor
    })
    
    return response
  } catch (error) {
    console.error(error.response?.data.message || error.message);
    return false; // Retornar false em caso de erro
  }
}  

export default api;

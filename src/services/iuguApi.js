import axios from 'axios';
import { Buffer } from 'buffer';

// Configura a instância axios com a chave da API Iugu
const iuguApi = axios.create({
  baseURL: '/api',
  headers: {
    Authorization: `Basic ${Buffer.from(import.meta.env.VITE_IUGU_API_KEY + ':').toString('base64')}`,
  },
});
// import.meta.env.VITE_ENV === 'development'

export const obterTokenCartao = async (dadosCartao) => {
  try {
    const response = await iuguApi.post('/payment_token', {
      account_id: import.meta.env.VITE_ACCOUNT_ID,
      method: 'credit_card',
      test: false, // Defina como true no ambiente de desenvolvimento
      data: {
        number: dadosCartao.numero,
        verification_value: dadosCartao.cvc,
        first_name: dadosCartao.nome.split(' ')[0],
        last_name: dadosCartao.nome.split(' ')[1] || '',
        month: dadosCartao.mesExpiracao,
        year: dadosCartao.anoExpiracao,
      },
    });
    console.log(response.data);
    return response.data.id; // Retorna o token do cartão
  } catch (error) {
    console.error('Erro ao obter token do cartão:', error.response?.data || error.message);
    throw error;
  }
};

export default iuguApi;

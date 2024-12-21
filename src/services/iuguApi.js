import axios from 'axios';
import { Buffer } from 'buffer';
import dotenv from 'dotenv';
// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Configura a instância axios com a chave da API Iugu
const iuguApi = axios.create({
  baseURL: '/api',
  headers: {
    Authorization: `Basic ${Buffer.from('5E355F52141F420D520B1984AFB5EEA867E5FFF4D791539E19C0C6E8A93B2384' + ':').toString('base64')}`,
  },
});

export const obterTokenCartao = async (dadosCartao) => {
    try {
      const response = await iuguApi.post('/payment_token', {
        account_id: '2DB84A3C876E4C3CA1D8DB98C6425456',  // Defina o ID da sua conta aqui
        method: 'credit_card',
        test: process.env.NODE_ENV === 'development',  // Defina como true no ambiente de desenvolvimento
        data: {
          number: dadosCartao.numero,
          verification_value: dadosCartao.cvc,
          first_name: dadosCartao.nome.split(' ')[0],
          last_name: dadosCartao.nome.split(' ')[1] || '',
          month: dadosCartao.mesExpiracao,
          year: dadosCartao.anoExpiracao,
        },
      });
      console.log(response.data)
      return response.data.id;  // Retorna o token do cartão
    } catch (error) {
      console.error('Erro ao obter token do cartão:', error.response?.data || error.message);
      throw error;
    }
};
  

export default iuguApi;

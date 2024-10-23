import axios from 'axios';

const IUGU_API_URL = '/api'
const IUGU_API_TOKEN = '5E355F52141F420D520B1984AFB5EEA867E5FFF4D791539E19C0C6E8A93B2384'

// Configuração do Axios
const api = axios.create({
    baseURL: IUGU_API_URL,
    headers: {
        Authorization: `Basic ${btoa(IUGU_API_TOKEN + ':')}`, // Autenticação básica, 
        'Content-Type': 'application/json',
    },
});

// Função para gerar o token do cartão
export const gerarTokenCartao = async (dadosCartao) => {
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };
  
    const data = {
      account_id: IUGU_API_TOKEN,
      method: 'credit_card',
      test: true, // Remova isso em produção
      data: {
        number: dadosCartao.numero,    // Número do cartão
        verification_value: dadosCartao.cvc,  // Código de segurança
        first_name: dadosCartao.first_name,
        last_name: dadosCartao.last_name,
        month: dadosCartao.mesExpiracao,
        year: dadosCartao.anoExpiracao,
      },
    };
  
    try {
      const response = await api.post('/payment_token', data, config);
      return response.data.id; // Token do cartão gerado
    } catch (error) {
      console.error('Erro ao gerar o token do cartão: ', error.response ? error.response.data : error.message);
      throw error;
    }
  };

// Função para criar fatura
export const criarFatura = async (token, valorTotal, email) => {
    const response = await api.post('/invoices', {
        token,
        items: [
            {
                description: 'Pagamento de serviço',
                quantity: 1,
                price_cents: valorTotal * 100, // O valor deve ser em centavos
            },
        ],
        payer: {
            email,
        },
    });
    return response.data; // Retorna a fatura criada
};

// Função para criar fatura PIX
export const criarFaturaPix = async (valorTotal, email) => {
    const response = await api.post('/invoices', {
        method: 'pix',
        items: [
            {
                description: 'Pagamento de serviço',
                quantity: 1,
                price_cents: valorTotal * 100, // O valor deve ser em centavos
            },
        ],
        payer: {
            email,
        },
    });
    return response.data; // Retorna a fatura criada com QR Code
};

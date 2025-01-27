import { prestadorProfile } from "../services/api";

export const fetchPrestadorInfo = async (setPrestador) => {
    try {
        const response = await prestadorProfile();
        setPrestador(response);

    } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);

    }
};

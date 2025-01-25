import { perfil } from "../services/api";

export const fetchUserInfo = async (setUser) => {
    try {
        const response = await perfil();
        setUser(response);

    } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);

    }
};

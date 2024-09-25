import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AreaDiarista = () => {
    const [userInfo, setUserInfo] = useState(null);
    const userId = localStorage.getItem('userId'); // Obter o ID do usuário do localStorage
    const token = localStorage.getItem('token'); // Obter o token do localStorage

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserInfo(response.data);
            } catch (error) {
                console.error('Erro ao buscar informações do usuário:', error);
            }
        };

        if (token && userId) {
            fetchUserInfo();
        }
    }, [token, userId]);

    return (
        <div>
            {userInfo ? (
                <div>
                    <h1>Informações do Usuário</h1>
                    <p>{userInfo.arquivoFoto}</p>
                    <p>Email: {userInfo.email}</p>
                    <p>Nome: {userInfo.name}</p>
                    {/* Adicione mais informações conforme necessário */}
                </div>
            ) : (
                <p>Carregando informações...</p>
            )}
        </div>
    );
};

export default AreaDiarista;

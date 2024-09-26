import React, { useState } from 'react';
import axios from 'axios';

const EditUserModal = ({ isOpen, onClose, userInfo, token, onUserUpdated }) => {
    const [formData, setFormData] = useState({ ...userInfo });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/users/${userInfo.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            onUserUpdated(formData); // Atualiza as informações no componente pai
            onClose(); // Fecha o modal
        } catch (error) {
            console.error('Erro ao atualizar informações do usuário:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-md shadow-lg">
                <h2 className="text-xl mb-4">Editar Informações</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1">Nome Completo:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Telefone:</label>
                        <input
                            type="text"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    {/* Adicione mais campos conforme necessário */}
                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Salvar</button>
                        <button type="button" onClick={onClose} className="ml-2 bg-gray-300 p-2 rounded-md">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;

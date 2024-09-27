import React, { useState } from 'react';
import axios from 'axios';
'use client'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

const EditUserModal = ({ Open, SetOpen, userInfo, token, onUserUpdated }) => {
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

    if (!Open) return null;

    return (
        <Dialog open={Open} onClose={SetOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-prim bg-opacity-50">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <div className="mt-2">
                    <div className="flex flex-col justify-center gap-7 text-prim  overflow-y-auto max-h-[60vh] ">

                        <div className="p-9 pt-0 pb-0 flex flex-col">
                            <label htmlFor="name" className="text-prim">Nome</label>
                            <input 
                            className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                            id="name"
                            type="text" 
                            placeholder="Nome"                         
                            />
                        </div>

                        <div className="p-9 pt-0 pb-0 flex flex-col">
                            <label htmlFor="email" className="text-prim">Email</label>
                            <input 
                            className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                            id="email"
                            type="text" 
                            placeholder="Email"                         
                            />
                        </div>

                        <div className="p-9 pt-0 pb-0 flex flex-col">
                            <label htmlFor="telefone" className="text-prim">Telefone</label>
                            <input 
                            className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                            id="telefone"
                            type="text" 
                            placeholder="Nome"                         
                            />
                        </div>
                        
                        
                    </div>           
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                data-autofocus
                onClick={() => SetOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Fechar
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
    );
};

export default EditUserModal;

import React, { useRef, useState } from 'react'
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter} from "@nextui-org/modal";
import { useUser } from '../../context/UserProvider'
import { Button } from '@nextui-org/button';
import { CreateEnderecosCliente, deleteEnderecosCliente } from '../../services/api';
import { fetchUserInfo } from '../../common/FetchUserInfo';

import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import InputMask from "react-input-mask"
import axios from 'axios';
import { Spinner } from '@nextui-org/react';


export default function Enderecos() {
    const [openCreateAdress, setOpenCreateAdress] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [creating, setCreating] = useState(false)
    const [cepError, setCepError] = useState('')
    const { user, setUser } = useUser()
    
    const schema = yup.object().shape({
        clienteId: yup.string().default(user?.id),
        localServico: yup.string().required("Informe o nome do endereço").trim(),
        cep: yup.string().required("Cep é obrigatório"),
        logradouro: yup.string(),
        numero: yup.string().required("Número é obrigatório").trim(),
        complemento: yup.string(),
        referencia: yup.string(),
        bairro: yup.string(),
        cidade: yup.string(),
        estado: yup.string(),   
    
    });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue
        } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = async (data) => {
        setCreating(true)

        try {
            const response = await CreateEnderecosCliente(data);
            await fetchUserInfo(setUser)
            reset()
            setCreating(false)
            setOpenCreateAdress(false)
        
        } catch (error) {
            console.error(error.message);
            setCreating(false)
        } 

    }
    
    const HandleDeleteEndereco = async (enderecoId) => {
        setDeleting(true)

        try {
            const DeleteEndereco = await deleteEnderecosCliente(enderecoId);            
            await fetchUserInfo(setUser)
            setDeleting(false)
    
        } catch (error) {
            console.error("Erro ao excluir o endereço: ", error);
            setDeleting(false)
    
        }
    };

    const estados = {
        "AC": "Acre",
        "AL": "Alagoas",
        "AP": "Amapá",
        "AM": "Amazonas",
        "BA": "Bahia",
        "CE": "Ceará",
        "DF": "Distrito Federal",
        "ES": "Espírito Santo",
        "GO": "Goiás",
        "MA": "Maranhão",
        "MT": "Mato Grosso",
        "MS": "Mato Grosso do Sul",
        "MG": "Minas Gerais",
        "PA": "Pará",
        "PB": "Paraíba",
        "PR": "Paraná",
        "PE": "Pernambuco",
        "PI": "Piauí",
        "RJ": "Rio de Janeiro",
        "RN": "Rio Grande do Norte",
        "RS": "Rio Grande do Sul",
        "RO": "Rondônia",
        "RR": "Roraima",
        "SC": "Santa Catarina",
        "SP": "São Paulo",
        "SE": "Sergipe",
        "TO": "Tocantins"
    };
          
    // Função para retorna o endereço do CEP 
    const handleCepChange = async (cep, setValue, setCepError) => {
        cep = cep.replace(/\D/g, ''); // Remove qualquer não numérico
        setCepError("");
    
        if (cep.length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    
                if (!response.data.erro) {
                    setValue("logradouro", response.data.logradouro);
                    setValue("bairro", response.data.bairro);
                    setValue("cidade", response.data.localidade);
    
                    // Converter a sigla do estado para o nome completo
                    const nomeEstado = estados[response.data.uf];
                    setValue("estado", nomeEstado);
    
                    setCepError("");
                } else {
                    setCepError("CEP não encontrado");
                }
            } catch (error) {
                console.error("Erro ao buscar o CEP:", error);
                alert("Erro ao buscar o CEP.");
            }
        }
    };

    const HandleCancel = (onClose) => {
        onClose()
        reset()
    }


    return (
        <section className='w-full gap-1 pb-[8vh]  sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim'>
            <div className='p-5'>
                <h2 className='text-xl font-semibold text-desSec text-center sm:text-start'>Endereços cadastrados</h2>

                <div className='pt-5 flex flex-col justify-center w-full'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                        {user?.EnderecosCliente?.length > 0 && (
                            user?.EnderecosCliente?.map((endereco) => (
                                <div key={endereco.id} className={`p-5 border rounded-lg border-prim bg-white  ${deleting ? "opacity-30" : ""}`}>
                                    <div className='text-start flex flex-col text-prim w-full justify-between '>
                                        <h2 className='text-sec font-semibold pb-2'>{endereco?.localServico}</h2>
                                        <p>{endereco?.logradouro}, {endereco?.numero}</p> 
                                        <p>{endereco?.complemento}</p> 
                                        <p>{endereco?.bairro}</p> 
                                        <p>{endereco?.cidade}, {endereco?.estado} - {endereco?.cep} </p> 
                                        <div className='flex justify-end pt-2 text-red-400'>
                                            <Button
                                                onPress={() => (HandleDeleteEndereco(endereco.id))}
                                                type="button"
                                                className='text-error bg-white justify-end p-0'
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>

                                            </Button>
                                        </div>
                                    </div>

                                </div>

                            ))
                        )}

                        <Button 
                            className='p-2 text-white rounded-md bg-trans text-sm bg-desSec md:col-span-2'
                            type="button"
                            onPress={() => (
                                setOpenCreateAdress(true)

                            )}
                        >
                            
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>                                                
                        </Button>
                    </div>
                </div>
            </div>

            {/* modal para criar um novo endereço */}
            <Modal 
                backdrop="opaque" 
                isOpen={openCreateAdress} 
                onClose={setOpenCreateAdress}
                classNames={{
                    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
                    body: "bg-white",
                    header: "bg-white",
                
                }}
                placement='center'
                className="max-w-[40vh] sm:min-w-[80vh]"
            >
                <ModalContent className="bg-">
                {(onClose) => (
                    <>

                    <form  onSubmit={handleSubmit(onSubmit)} >
                        <ModalHeader className="flex flex-col gap-1 text-prim text-2xl ">
                        <div className="flex w-full justify-between pr-10">
                            <h2 className="flex gap-2 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            Criar novo endereço
                            </h2>
                            
                        </div>
                        </ModalHeader>

                        <ModalBody className="flex flex-col p-0">
                        <ScrollShadow className="flex flex-col overflow-y-auto max-h-[65vh] " hideScrollBar>
                            <div className="text-neutral-400 flex  w-full justify-between gap-5 ">
                            <div className="text-neutral-400 flex  w-full justify-between flex-col">
                                <div className="w-full flex flex-col gap-4">
                                    {/* endereco padrao do cliente */}
                                        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                            <label htmlFor="localServico" className="text-prim">Local do serviço</label>
                                            <input 
                                            className="placeholder:text-neutral-600 border rounded-md border-bord bg-neutral-700 p-3 pt-2 pb-2 focus:outline-neutral-600 text-prim "
                                            id="localServico" 
                                            type="text" 
                                            placeholder="nome do endereço" 
                                            {...register("localServico")}
                                            />
                                            {errors.localServico && 
                                            <span className="text-error opacity-75">{errors.localServico?.message}</span>}
                                        </div>
                                        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                            <label htmlFor="cep" className="text-prim">CEP</label>
                                            <Controller
                                                name="cep"
                                                control={control}
                                                render={({ field: { onChange, value, ref } }) => (
                                                    <InputMask
                                                        ref={ref}
                                                        mask="99999-999"
                                                        maskChar={null}
                                                        className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter"
                                                        id="cep"
                                                        type="text"
                                                        placeholder="Somente números"
                                                        value={value || ""}
                                                        onChange={(e) => {
                                                            const cepValue = e.target.value;
                                                            onChange(cepValue); // Atualiza o valor no react-hook-form
                                                            handleCepChange(cepValue, setValue, setCepError); // Chama a lógica de CEP
                                                        }}
                                                    />
                                                )}
                                            />
                                            {cepError && <p className="text-error text-sm mt-1">{cepError}</p>}
                                        </div>
                                        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                            <label htmlFor="logradouro" className="text-prim">Logradouro</label>
                                            <input 
                                            className="placeholder:text-neutral-600 border rounded-md border-bord bg-neutral-700 p-3 pt-2 pb-2 focus:outline-neutral-600 text-prim "
                                            id="logradouro" 
                                            type="text" 
                                            placeholder="" 
                                            {...register("logradouro")}
                                            readOnly
                                            />
                                            {errors.logradouro && 
                                            <span className="text-error opacity-75">{errors.logradouro?.message}</span>}
                                        </div>
                                        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                            <label htmlFor="numero" className="text-prim">Número</label>
                                            <input 
                                            className="placeholder:text-neutral-600 border rounded-md border-bord bg-neutral-700 p-3 pt-2 pb-2 focus:outline-neutral-600 text-prim "
                                            id="numero" 
                                            type="text" 
                                            placeholder="" 
                                            {...register("numero")}
                                            />
                                            {errors.numero && 
                                            <span className="text-error opacity-75">{errors.numero?.message}</span>}
                                        </div>
                                        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                            <label htmlFor="complemento" className="text-prim">Complemento</label>
                                            <input 
                                            className="placeholder:text-neutral-600 border rounded-md border-bord bg-neutral-700 p-3 pt-2 pb-2 focus:outline-neutral-600 text-prim "
                                            id="complemento" 
                                            type="text" 
                                            placeholder="Casa, apt, bloco, etc"
                                            maxLength="100" 
                                            {...register("complemento")}
                                            />
                                            {errors.complemento && 
                                            <span className="text-error opacity-75">{errors.complemento?.message}</span>}
                                        </div>
                                        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                            <label htmlFor="pontoRef" className="text-prim">Ponto de Referência</label>
                                            <input 
                                            className="placeholder:text-neutral-600 border rounded-md border-bord bg-neutral-700 p-3 pt-2 pb-2 focus:outline-neutral-600 text-prim "
                                            id="pontoRef" 
                                            type="text" 
                                            placeholder="" 
                                            maxLength="150"
                                            {...register("referencia")}
                                            />
                                            {errors.pontoRef && 
                                            <span className="text-error opacity-75">{errors.referencia?.message}</span>}
                                        </div>
                                        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                            <label htmlFor="bairro" className="text-prim">Bairro</label>
                                            <input 
                                            className="placeholder:text-neutral-600 border rounded-md border-bord bg-neutral-700 p-3 pt-2 pb-2 focus:outline-neutral-600 text-prim "
                                            id="bairro" 
                                            type="text" 
                                            placeholder="" 
                                            {...register("bairro")}
                                            readOnly
                                            />
                                            {errors.bairro && 
                                            <span className="text-error opacity-75">{errors.bairro?.message}</span>}
                                        </div>

                                        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                            <label htmlFor="cidade" className="text-prim">Cidade</label>
                                            <input 
                                            className="placeholder:text-neutral-600 border rounded-md border-bord bg-neutral-700 p-3 pt-2 pb-2 focus:outline-neutral-600 text-prim "
                                            id="cidade" 
                                            type="text" 
                                            placeholder="" 
                                            {...register("cidade")}
                                            readOnly
                                            />
                                            {errors.cidade && 
                                            <span className="text-error opacity-75">{errors.cidade?.message}</span>}
                                        </div>

                                        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                            <label htmlFor="estado" className="text-prim">Estado</label>
                                            <input 
                                            className="placeholder:text-neutral-600 border rounded-md border-bord bg-neutral-700 p-3 pt-2 pb-2 focus:outline-neutral-600 text-prim "
                                            id="estado" 
                                            type="text" 
                                            placeholder=""
                                            {...register("estado")}
                                            readOnly
                                            />
                                            {errors.estado && 
                                            <span className="text-error opacity-75">{errors.estado?.message}</span>}
                                        </div>                                
                                </div>
                            </div>
                            
                            </div>
                        </ScrollShadow>
                            <ModalFooter className='justify-between'>
                                <Button color="danger" variant="light" onPress={() => HandleCancel(onClose)}
                                >
                                Cancelar
                                </Button>
                            
                                <Button type="submit" className="bg-desSec text-white min-w-[18vh]" isDisabled={creating}>
                                {creating ? <Spinner/> : "Criar endereço"}
                                </Button>
                            </ModalFooter>
                        </ModalBody>

                    </form>
                    </>
                )}
                </ModalContent>
            </Modal>

        </section>
    )
}

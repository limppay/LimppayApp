import { Button } from '@nextui-org/button';
import React, { useState } from 'react'
import { removerMascara } from '../../common/RemoverMascara';
import { CreateStepTwo } from '../../services/api';
import { usePrestador } from '../../context/PrestadorProvider';
import { Avatar } from '@nextui-org/avatar';
import { Tooltip } from '@nextui-org/tooltip';

import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import InputMask from "react-input-mask"
import axios from 'axios';
import { Spinner } from '@nextui-org/react';
import User from "../../assets/img/diarista-cadastro/user.webp"
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter} from "@nextui-org/modal";

export default function Reenviar() {
    const { prestador } = usePrestador()
    const [openSucess, setOpenSucess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [image, setImage] = useState(User)

    const schema = yup.object({
        // Currículo
        arquivoCurriculo: yup
            .mixed()
            // .test("required", "Currículo é obrigatório", (value) => {
            //     return value instanceof File; // Verifica se o valor é um arquivo
            // })
            .test("fileSize", "O arquivo é muito grande", (value) => {
                return !value || value.size <= 5000000; // Limita o tamanho do arquivo a 5MB
            })
            .test("fileType", "Formato de arquivo não suportado", (value) => {
                return !value || ['image/jpeg', 'image/png', 'application/pdf'].includes(value?.type); // Limita os tipos permitidos
            }),

        arquivoCpf: yup
            .mixed()
            // .test("required", "CPF é obrigatório", (value) => {
            // return value instanceof File; // Verifica se o valor é um arquivo
            // })
            .test("fileSize", "O arquivo é muito grande", (value) => {
            return value && value.size <= 5000000; // Limita o tamanho do arquivo a 5MB (ajuste conforme necessário)
            })
            .test("fileType", "Formato de arquivo não suportado", (value) => {
            return value && ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type); // Limita os tipos permitidos
            }),

        arquivoResidencia: yup
            .mixed()
            // .test("required", "Comprovante de Residência é obrigatório", (value) => {
            // return value instanceof File; // Verifica se o valor é um arquivo
            // })
            .test("fileSize", "O arquivo é muito grande", (value) => {
            return value && value.size <= 5000000; // Limita o tamanho do arquivo a 5MB (ajuste conforme necessário)
            })
            .test("fileType", "Formato de arquivo não suportado", (value) => {
            return value && ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type); // Limita os tipos permitidos
            }),            

        arquivodt: yup
            .mixed()
            // .test("required", "A Identidade é obrigatória", (value) => {
            // return value instanceof File; // Verifica se o valor é um arquivo
            // })
            .test("fileSize", "O arquivo é muito grande", (value) => {
            return value && value.size <= 5000000; // Limita o tamanho do arquivo a 5MB (ajuste conforme necessário)
            })
            .test("fileType", "Formato de arquivo não suportado", (value) => {
            return value && ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type); // Limita os tipos permitidos
            }),
    })
    .required()

    // Hook Forms
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        reset,
        setValue,
        control, 
        getValues,
        setError, 
        watch,
        clearErrors
        } = useForm({
        resolver: yupResolver(schema)
    })

    console.log(errors)

    // onSubmit do Forms
    const onSubmit = async (data) => {
        setLoading(true)
        setMessage(null)

        const formData = new FormData()
                
        formData.append('arquivoCurriculo', data.arquivoCurriculo);
        formData.append('arquivodt', data.arquivodt);
        formData.append('arquivoCpf', data.arquivoCpf);
        formData.append('arquivoResidencia', data.arquivoResidencia);

        try {
            const response = await CreateStepTwo(prestador?.id, formData);
            reset()
            setLoading(false)
            setOpenSucess(true)
            
        } catch (error) {
            setLoading(false)
            console.error(error.message);
            setMessage(error.message)

        } finally {
            setLoading(false)

        }

    };

    
    const handleNameChange = (event) => {
        const { name, files } = event.target;
        const file = files[0];
        setFileNames((prevFileNames) => ({
            ...prevFileNames,
            [name]: file ? file.name : "Arquivo não selecionado",
        }));
    };

    const [fileNames, setFileNames] = useState({
        docIdt: "Arquivo não selecionado",
        docCpf: "Arquivo não selecionado",
        docResidencia: "Arquivo não selecionado",
        docCurriculo: "Arquivo não selecionado",
    });

      
    return (
        <section className=' lg:flex justify-between w-full gap-1 pt-[10vh] lg:pt-[12vh] xl:pt-[14vh] '>
            <form className="flex flex-col w-full gap-5 lg:p-[5vh] lg:pt-[2vh] " onSubmit={handleSubmit(onSubmit)}>
                <div className=' p-[2vh] md:p-0 '>
                    <h2 className='font-semibold text-2xl text-desSec'>Atualizar anexos</h2>
                    <p className='text-prim'>Foi solicitado que você deve reenviar seus anexos novamente :)</p>   

                </div>
                <div>
                    <div className='grid gap-2 pb-5'>                        
                        <div className="mt-4 text-prim pr-9 pl-9">
                            <label htmlFor="docCpf">
                                CPF
                                <span className="ml-2">(Frente e verso)</span>
                                <div className="border gap-3 border-bord rounded-md flex items-center lg:gap-5 ">
                                    <div className="p-1 bg-prim bg-opacity-90 text-white rounded-l-md lg:p-3 h-12">
                                        <p>Selecione o arquivo</p>
                                        <input 
                                        type="file" 
                                        name="docCpf" 
                                        id="docCpf"  
                                        accept="application/pdf, image/*" 
                                        className=" p-2 w-full hidden" 
                                        onChange={(e) => {
                                            const file = e.target.files[0]; // Pega o arquivo selecionado
                                            handleNameChange(e); // Exibe o nome do arquivo
                                            setValue("arquivoCpf", file, { shouldValidate: true }); // Atribui o arquivo e dispara a validação
                                        }}/>
                                    </div>
                                    <div className="flex  overflow-hidden lg:text-start">
                                        <span className="max-w-28 max-h-12 lg:max-w-xl">{fileNames.docCpf}</span>
                                    </div>
                                </div>           
                            </label> 
                            {errors.arquivoCpf && (
                                <span className="text-error opacity-75">{errors.arquivoCpf.message}</span>
                            )}      
                        </div>
                        <div className="mt-4 text-prim pr-9 pl-9">
                            <label htmlFor="docResidencia">
                                Comprovante de residência
                                <span className="ml-2"></span>
                                <div className="border gap-3 border-bord rounded-md flex items-center lg:gap-5 ">
                                    <div className="p-1 bg-prim bg-opacity-90 text-white rounded-l-md lg:p-3 h-12">
                                        <p>Selecione o arquivo</p>
                                        <input 
                                        type="file" 
                                        name="docResidencia" 
                                        id="docResidencia"  
                                        accept="application/pdf, image/*" 
                                        className=" p-2 w-full hidden" 
                                        onChange={(e) => {
                                            const file = e.target.files[0]; // Pega o arquivo selecionado
                                            handleNameChange(e); // Exibe o nome do arquivo
                                            setValue("arquivoResidencia", file, { shouldValidate: true }); // Atribui o arquivo e dispara a validação
                                        }}/>
                                    </div>
                                    <div className="flex  overflow-hidden lg:text-start">
                                        <span className="max-w-28 max-h-12 lg:max-w-xl">{fileNames.docResidencia}</span>
                                    </div>
                                </div>           
                            </label>  
                            {errors.arquivoResidencia && (
                                <span className="text-error opacity-75">{errors.arquivoResidencia.message}</span>
                            )}      
                        </div>
                        <div className="mt-4 text-prim pr-9 pl-9">
                            <label htmlFor="docIdt">
                                RG ou CNH
                                <span className="ml-2">(Frente e verso)</span>
                                <div className="border gap-3 border-bord rounded-md flex items-center lg:gap-5 ">
                                    <div className="p-1 bg-prim bg-opacity-90 text-white rounded-l-md lg:p-3 h-12">
                                        <p>Selecione o arquivo</p>
                                        <input 
                                        type="file" 
                                        name="docIdt"
                                        id="docIdt"  
                                        accept="application/pdf, image/*" 
                                        className=" p-2 w-full hidden" 
                                        onChange={(e) => {
                                            const file = e.target.files[0]; // Pega o arquivo selecionado
                                            handleNameChange(e); // Exibe o nome do arquivo
                                            setValue("arquivodt", file, { shouldValidate: true }); // Atribui o arquivo e dispara a validação
                                        }}/>
                                    </div>
                                    <div className="flex  overflow-hidden lg:text-start">
                                        <span className="max-w-28 max-h-12 lg:max-w-xl">{fileNames.docIdt}</span>
                                    </div>
                                </div>           
                            </label>
                            {errors.arquivodt && 
                            <span className="text-error opacity-75">{errors.arquivodt?.message}</span>}       
                        </div>
                        <div className="mt-4 text-prim pr-9 pl-9">
                            <label htmlFor="docCurriculo">
                                Currículo
                                <span className="ml-2"></span>
                                <div className="border gap-3 border-bord rounded-md flex items-center lg:gap-5 ">
                                    <div className="p-1 bg-prim bg-opacity-90 text-white rounded-l-md lg:p-3 h-12">
                                        <p>Selecione o arquivo</p>
                                        <input 
                                        type="file" 
                                        name="docCurriculo" 
                                        id="docCurriculo"  
                                        accept="application/pdf, image/*" 
                                        className=" p-2 w-full hidden" 
                                        onChange={(e) => {
                                            const file = e.target.files[0]; // Pega o arquivo selecionado
                                            handleNameChange(e); // Exibe o nome do arquivo
                                            setValue("arquivoCurriculo", file, { shouldValidate: true }); // Atribui o arquivo e dispara a validação
                                        }}/>
                                    </div>
                                    <div className="flex  overflow-hidden lg:text-start">
                                        <span className="max-w-28 max-h-12 lg:max-w-xl">{fileNames.docCurriculo}</span>
                                    </div>
                                </div>           
                            </label>    
                            {errors.arquivoCurriculo && (
                                <span className="text-error opacity-75">{errors.arquivoCurriculo.message}</span>
                            )}    
                        </div>
                    </div>

                </div>
                
                <div className="mt-4 pl-9 pr-9 pb-9 space-y-5">
                    <Button type="submit" className="text-center w-full md:max-w-md   bg-des rounded-md text-white p-2 hover:bg-sec transition-all " id="buttonSubmit" isDisabled={loading} >{loading ? <Spinner /> : 'Enviar'}</Button>
                </div>
            </form>

            <Modal 
                backdrop="opaque" 
                isOpen={openSucess} 
                onClose={() => {}}
                placement='center'
                classNames={{
                    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
                    body: "bg-white",
                    header: "bg-white",
                    footer: "bg-white"
                }}
                className="max-w-[40vh] sm:min-w-[80vh]"
            >
                <ModalContent className="bg-">
                {(onClose) => (
                    <>

                    <ModalHeader className="flex flex-col gap-1 text-neutral-600 text-2xl  border-b border-bord ">
                        <div className="flex w-full justify-between pr-10">
                            <h2 className='text-sec'>Sucesso!</h2>
                        </div>
                    </ModalHeader>

                    <ModalBody>
                        <div className="text-neutral-400 flex  w-full justify-between gap-5 pt-5 pb-5 ">
                            <div className='text-prim grid gap-2'>
                                <p>Suas informações foram enviadas com sucesso e seu cadastro está em processo de análise.</p>
                            </div>
                            
                        </div>
 
                    </ModalBody>
                    <ModalFooter>
                        <div>
                            <Button className='bg-desSec text-white' onPress={() => window.location.reload()}>
                                Continuar
                            </Button>
                        </div>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
        </section>
    )
}

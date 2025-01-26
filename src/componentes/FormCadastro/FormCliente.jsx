import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {useEffect} from 'react'
import { useState} from "react"
import React, { useRef } from "react"
import { createCliente } from "../../services/api.js"
import axios from "axios"
import InputMask from "react-input-mask"

'use client'
import {  Dialog, DialogBackdrop, DialogPanel, Input } from '@headlessui/react'
import {useNavigate } from 'react-router-dom';
import { Logo } from "../imports.jsx"

import User from "../../assets/img/diarista-cadastro/user.webp"
import { Avatar, Spinner } from "@nextui-org/react"
import {Button} from "@nextui-org/react";
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter, useDisclosure} from "@nextui-org/modal";


export default function FormCliente() {
    const navigate = useNavigate();
    // schema de validações do form
    const schema = yup.object({
        // scheam do prisma na API
        name: yup.string().trim().required("O nome é obrigatório"),

        cpfCnpj: yup.string().trim().required("O CPF é obrigatório").min(11, "Digite um CPF válido"),

        genero: yup.string(),
        estadoCivil: yup.number().required("Estado civil é obrigatório").typeError("Estado Civil é obrigatório"),

        telefone_1: yup.string().trim().required("Telefone é obrigatório"),
        telefone_2: yup.string(),
        email: yup.string().trim().required("E-mail é obrigatório").email("Email inválido."),


        cep:  yup.string().required("Preencha os campos abaixo").min(8, "Digite um cep válido"),
        logradouro:  yup.string(),
        numero:  yup.string().trim().required("Número é obrigatório"),
        complemento:  yup.string(),
        bairro:  yup.string(),
        cidade:  yup.string(),
        estado: yup.string().typeError(""),
        referencia:  yup.string(),

        senha: yup.string().trim().required("A senha é obrigatório").min(6, "A senha deve ter no minimo 6 caracteres"),
        confirmarSenha: yup.string().trim().required("Confirme sua senha").oneOf([yup.ref("senha")], "As senhas devem ser iguais"),

        arquivoFoto: yup
            .mixed()
            .test("required", "Foto de perfil é obrigatório", (value) => {
                return value instanceof File; // Verifica se o valor é um arquivo
            })
            .test("fileSize", "O arquivo é muito grande", (value) => {
                return value && value.size <= 5000000; // Limita o tamanho do arquivo a 5MB (ajuste conforme necessário)
            })
            .test("fileType", "Formato de arquivo não suportado", (value) => {
                return value && ['image/jpeg', 'image/png', 'image/webp'].includes(value.type); // Limita os tipos permitidos
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
        getValues,
        setError, 
        watch,
        control,
        clearErrors
        } = useForm({
        resolver: yupResolver(schema),
    })
    

    // onSubmit do Forms
    const onSubmit = async (data) => {
        setLoading(true)
        setMessage(null)

        const cpfCnpjSemMascara = removerMascara(data.cpfCnpj);
        const telefone_1_SemMascara = removerMascara(data.telefone_1);
        const telefone_2_SemMascara = removerMascara(data.telefone_2);
        const cepSemMascara = removerMascara(data.cep);

        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('genero', data.genero)
        formData.append('estadoCivil', data.estadoCivil)

        formData.append('telefone_1', telefone_1_SemMascara)
        formData.append('telefone_2', telefone_2_SemMascara)

        formData.append('email', data.email)

        formData.append('cep', cepSemMascara)

        formData.append('logradouro', data.logradouro)
        formData.append('numero', data.numero)
        formData.append('complemento', data.complemento)
        formData.append('bairro', data.bairro)
        formData.append('cidade', data.cidade)
        formData.append('estado', data.estado)

        formData.append('cpfCnpj', cpfCnpjSemMascara)

        formData.append('senha', data.senha)

        formData.append('referencia', data.referencia)

        formData.append('arquivoFoto', data.arquivoFoto);

        try {
          const response = await createCliente(formData);
          reset()

          setModalIsOpen(true)
          setLoading(false)
          
        } catch (error) {
            setLoading(false)
            console.error(error.message);
            setMessage(error.message)
        }

      };


    const closeModal = () => {
        // setModalIsOpen(false)
        navigate("/login-cliente")
    }

    // Funções
    // Função de ativar o botão quando o termo for clicado
    // Função de ativar o botão quando o termo for clicado
    const [termosCheck, setTermosCheck] = useState(true)
    useEffect(() => {
        const checkTermos = document.getElementById("termo")

        checkTermos.onclick = () => {
            setTermosCheck(!termosCheck)
        }
    })

    
    // Arrays
    const Genero = [
        {text: "Masculino"},
        {text: "Feminino"},
        {text: "Outro"},
    ]

    const EstadoCivil = [
        {text: "Solteiro(a)", value: 1},
        {text: "Casado(a)", value: 2},
        {text: "Divorciado(a)", value: 3},
        {text: "Viúvo(a)", value: 4},
        {text: "Separado(a)", value: 5},
    ]

    const CpfCnpj = [
        {text:"CPF"},
        {text:"CNPJ"},
    ]

    // states
    const [image, setImage] = useState(User)

    useEffect(() => {
        // Buscar o caminho da imagem padrão e convertê-la em um arquivo
        fetch(User)
        .then((response) => response.blob())
        .then((blob) => {
            const defaultFile = new File([blob], "default.png", { type: blob.type });
            setValue("arquivoFoto", defaultFile, { shouldValidate: true }); // Define o arquivo no formulário
            setImage(User); // Exibe a imagem padrão
        });
    }, [setValue]);


    const [fileNames, setFileNames] = useState({
        docIdt: "Arquivo não selecionado",
        docCpf: "Arquivo não selecionado",
        docResidencia: "Arquivo não selecionado",
        docCurriculo: "Arquivo não selecionado",
    });
    const [loading, setLoading] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [cepError, setCepError] = useState("")
    const [message, setMessage] = useState(null);

    const [genero, setGenero] = useState('');
    const [outroGenero, setOutroGenero] = useState('');

    const[cpfCnpj, setcpfCnpj]=useState('')

    const inputRef = useRef(null)
    
    const watchCep = watch("cep");
    
    
    // Handles
    const handleGeneroChange = (event) => {
        const value = event.target.value;
        setGenero(value);
        setValue('genero', value); // Atualiza o valor no React Hook Form
        if (value !== 'Outro') {
          setOutroGenero('');
        }
      };
    
      const handleOutroGeneroChange = (event) => {
        const value = event.target.value;
        setOutroGenero(value);
        setValue('genero', value); // Atualiza o valor no React Hook Form
      };
    
      const voltarParaSelect = () => {
        setGenero('');
        setOutroGenero('');
        setValue('genero', ''); // Reseta o valor no React Hook Form
      };

      const handleCpfCnpjChange = (event)=>{
        const value = event.target.value;
        setcpfCnpj(value);
        setValue('CpfCnpj', value);
      }

      const voltarParaSelectCpfCnpj = () =>{
        setcpfCnpj('');
        setValue('cpfCnpj', '');
      }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
          setImage(imageUrl);
          setValue("arquivoFoto", file); // Armazenando o arquivo no formulário
          trigger("arquivoFoto"); // Forçando a validação do campo
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

    const removerMascara = (valor) => {
        return valor.replace(/\D/g, ''); // Remove todos os caracteres que não são números
    };
    
      

  return (
    <>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                <h2 className="text-2xl text-desSec">Dados pessoais</h2>
            </div>
            
            <div className="lg:flex lg:items-center ">
                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col items-center">
                    <div className="flex flex-col justify-center items-center gap-2">
                        <label htmlFor="fotoPerfil" className="cursor-pointer flex justify-center flex-col items-center gap-1">
                            <Avatar 
                                src={image} 
                                alt="foto de perfil" 
                                className="transition-all duration-200 rounded-full w-60 h-60 hover:bg-ter shadow-md" 
                            />                  
                            <input
                                type="file"
                                id="fotoPerfil"
                                accept="image/*"
                                {...register("arquivoFoto")}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const imageUrl = URL.createObjectURL(file);
                                        setImage(imageUrl); // Atualiza a imagem exibida
                                        setValue("arquivoFoto", file, { shouldValidate: true }); // Define o arquivo selecionado
                                    } else {
                                        // Reverte para a imagem padrão
                                        fetch(User)
                                            .then((response) => response.blob())
                                            .then((blob) => {
                                                const defaultFile = new File([blob], "default.png", { type: blob.type });
                                                setValue("arquivoFoto", defaultFile, { shouldValidate: true });
                                                setImage(User); // Atualiza a imagem exibida para o padrão
                                                trigger("arquivoFoto"); // Revalida o campo
                                            });
                                    }
                                }}
                                className="p-2 w-full hidden"
                            />
                      
                        </label>
                        <span className="text-prim">Foto de perfil</span>
                        {errors.arquivoFoto && (
                            <span className="text-error opacity-75">{errors.arquivoFoto.message}</span>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="lg:flex">
                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                    <label htmlFor="name" className="text-prim">Nome</label>
                    <input 
                    className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                    id="name"
                    type="text" 
                    placeholder="Nome completo" 
                    {...register("name")}
                    
                    />
                    { errors.name &&
                    <span className="text-error opacity-75">{errors.name?.message}</span>}
                </div>

                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col w-full">
                    <div className="flex gap-2 justify-between">
                        <label htmlFor="Genero" className="text-prim">Gênero</label>

                        {genero === 'Outro' ? (
                            <>
                                <p onClick={voltarParaSelect} className="cursor-pointer text-prim">Voltar para seleção</p>
                            </>
                        ) : (
                            <span>
                                
                            </span>
                        )}
                    </div>
                    
                    {genero === 'Outro' ? (
                        <>
                            <input
                            type="text"
                            id="outroGenero"
                            name="outroGenero"
                            value={outroGenero}
                            onChange={handleOutroGeneroChange}
                            required
                            placeholder="Especifique seu gênero"
                            className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim"
                            />
                        </>
                    ) : (
                        <select
                        id="Genero"
                        value={genero}
                        onChange={handleGeneroChange}
                        required
                        className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim w-full">
                            <option value="">Selecione</option>
                            {Genero.map((options, index) => (
                                <option key={index} value={options.text}>{options.text}</option>
                            ))}                            
                        </select>
                    )}


                    {errors.genero && (
                        <span className="text-error opacity-75">{errors.genero?.message}</span>
                    )}
                </div>
                
                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col w-full">
                    <div className="flex gap-2 justify-between">
                        <label htmlFor="CpfCnpj" className="text-prim">
                            {cpfCnpj ? cpfCnpj : "CPF / CNPJ"} {/* Exibe CPF ou CNPJ se selecionado */}
                        </label>

                        {cpfCnpj === 'CPF' || cpfCnpj === 'CNPJ' ? (
                            <p onClick={voltarParaSelectCpfCnpj} className="cursor-pointer text-prim">Voltar para seleção</p>
                        ) : (
                            <span></span>
                        )}
                    </div>

                    {cpfCnpj === 'CPF' ? (
                        <InputMask
                            mask="999.999.999-99"
                            maskChar={null}
                            ref={inputRef}
                            className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                            id="cpf"
                            type="text"
                            placeholder="Somente números"
                            {...register("cpfCnpj")}
                        />
                    ) : cpfCnpj === 'CNPJ' ? (
                        <InputMask
                            mask="99.999.999/9999-99"
                            maskChar={null}
                            ref={inputRef}
                            className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                            id="cnpj"
                            type="text"
                            onChange={handleCpfCnpjChange}
                            placeholder="Somente números"
                            {...register("cpfCnpj")}
                        />
                    ) : (
                        <select
                            id="CpfCnpj"
                            value={cpfCnpj}
                            onChange={handleCpfCnpjChange}
                            required
                            className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim w-full">
                            <option value="">Selecione</option>
                            {CpfCnpj.map((options, index) => (
                                <option key={index} value={options.text}>{options.text}</option>
                            ))}
                        </select>
                    )}

                    {errors.cpfCnpj && (
                        <span className="text-error opacity-75">{errors.cpfCnpj?.message}</span>
                    )}
                </div>

            </div>

            <div className="lg:flex">
                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                    <label htmlFor="email" className="text-prim">E-mail</label>
                    <input 
                    className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                    id="email" 
                    type="text" 
                    placeholder="" 
                    {...register("email")}
                    />
                    {errors.email && 
                    <span className="text-error opacity-75">{errors.email?.message}</span>}
                </div>
                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                    <label htmlFor="telefone" className="text-prim">Telefone 1</label>
                    <InputMask
                    ref={inputRef}
                    mask="(99) 99999-9999" 
                    maskChar={null}
                    className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                    id="telefone" 
                    type="text" 
                    placeholder="(00) 00000-0000" 
                    {...register("telefone_1")}
                    />
                    {errors.telefone_1 && 
                    <span className="text-error opacity-75">{errors.telefone_1?.message}</span>}
                </div>

                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                    <label htmlFor="telefone" className="text-prim">Telefone 2</label>
                    <InputMask
                    ref={inputRef}
                    mask="(99) 99999-9999" 
                    maskChar={null}
                    className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                    id="telefone" 
                    type="text" 
                    placeholder="(00) 00000-0000" 
                    {...register("telefone_2")}
                    />
                    {errors.telefone_1 && 
                    <span className="text-error opacity-75">{errors.telefone_2?.message}</span>}
                </div>
            </div>

            <div>
                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col w-full">
                    <label htmlFor="EstadoCivil" className="text-prim">Estado Civil</label>
                    <select  
                    id="EstadoCivil"
                    {...register("estadoCivil")}
                    className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim">
                        <option defaultValue='0' >Selecione</option>
                        {EstadoCivil.map((options, index) => (
                            <option key={index} value={options.value}>{options.text}</option>
                        ))}
                    </select>
                    {errors.estadoCivil && 
                    <span className="text-error opacity-75">{errors.estadoCivil?.message}</span>}           
                </div>
                

            </div>
            

            <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                <h2 className="text-2xl text-desSec">Endereço</h2>
                {errors.cep && 
                <span className="text-error opacity-75">{errors.cep?.message}</span>}
            </div>

            <div className="lg:flex lg:justify-between">
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
                    className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
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
                    className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                    id="numero" 
                    type="text" 
                    placeholder="" 
                    {...register("numero")}
                    />
                    {errors.numero && 
                    <span className="text-error opacity-75">{errors.numero?.message}</span>}
                </div>
            </div>
            <div className="lg:flex lg:justify-between">
                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                    <label htmlFor="complemento" className="text-prim">Complemento</label>
                    <input 
                    className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
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
                    className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
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
                    className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                    id="bairro" 
                    type="text" 
                    placeholder="" 
                    {...register("bairro")}
                    readOnly
                    />
                    {errors.bairro && 
                    <span className="text-error opacity-75">{errors.bairro?.message}</span>}
                </div>
            </div>

            <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                <label htmlFor="cidade" className="text-prim">Cidade</label>
                <input 
                className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
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
                className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                id="estado" 
                type="text" 
                placeholder=""
                {...register("estado")}
                readOnly
                />
                {errors.estado && 
                <span className="text-error opacity-75">{errors.estado?.message}</span>}
            </div>
            
           

            <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                <h2 className="text-2xl text-desSec">Senha</h2>
            </div>
            <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                <label htmlFor="password" className="text-prim">Senha</label>
                <input 
                className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                id="password" 
                type="password"
                placeholder="" 
                {...register("senha")}
                />
                {errors.senha && 
                <span className="text-error opacity-75">{errors.senha?.message}</span>}
            </div>


            <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                <label htmlFor="confirmPassword" className="text-prim">Confirmar Senha</label>
                <input 
                className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                id="confirmPassword" 
                type="password"
                {...register('confirmarSenha')}
                placeholder=""
                />
                {errors.confirmarSenha && 
                <span className="text-error opacity-75">{errors.confirmarSenha?.message}</span>}
            </div>


            <div className="mt-4 text-prim pr-9 pl-9">
                <div className="flex gap-2 items-baseline">
                    <input 
                    type="checkbox" 
                    id="termo" 
                    />
                    <label htmlFor="termo">Concordo com os termos de uso e contrato de serviço - <a href="#" className="text-des">Ver termos</a></label>
                </div>
            </div>
            <div className="mt-4 pl-9 pr-9 pb-9 space-y-5">
                <Button  type="submit" className="text-center w-full lg:w-1/2  bg-des rounded-md text-white p-2 hover:bg-sec transition-all duration-100 " id="buttonSubmit" isDisabled={loading || termosCheck}  >
                    {loading ? <Spinner/> : 'Cadastrar'}
                </Button>
                <p className="text-md text-error text-center lg:text-start">{message}</p>
            </div>
        </form>

        <Modal 
            backdrop="opaque" 
            isOpen={modalIsOpen} 
            onOpenChange={setModalIsOpen}
            placement='center'
            classNames={{
                backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 "
            }}
            className="min-w-[35] max-w-[40vh] sm:max-w-[60vh] "
        >
            <ModalContent>
                {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1 text-desSec p-0"></ModalHeader>
                    <ModalBody>
                        <div className="bg-white sm:pb-4">
                            <div className="sm:flex sm:items-start justify-center">
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <div className="mt-2 lg:flex h-1/2 ">
                                        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col justify-center p-2">
                                            <img
                                                alt="Limppay"
                                                src={Logo}
                                                className="mx-auto h-20 w-auto"
                                            />
                                            <div className='flex flex-col items-center text-justify gap-2'>
                                                <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 text-desSec">
                                                Conta criada com sucesso! :D
                                                </h2>
                                                <p className='text-prim'>Entre na sua conta agora mesmo para ter acesso a plataforma da Limppay</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    
        
                    </ModalBody>
                    <ModalFooter className="bg-none shadow-none">
                        
                        <Button className='bg-desSec text-white' onPress={closeModal} >
                            Confirmar
                        </Button>
                    </ModalFooter>
                </>
                )}
            </ModalContent>
        </Modal>
    </>
  )
}
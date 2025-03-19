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
import { Avatar, Spinner, Tooltip } from "@nextui-org/react"
import {Button} from "@nextui-org/react";
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter, useDisclosure} from "@nextui-org/modal";


export default function FormCliente() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    
    // schema de validações do form
    const schema = yup.object({
        // scheam do prisma na API
        name: yup.string().trim().required("O nome é obrigatório"),

        cpfCnpj: yup.string().trim().required("O CPF é obrigatório").min(11, "Digite um CPF válido"),

        genero: yup.string().default(""),
        estadoCivil: yup.number().default(0),

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

    console.log(errors)

    

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
        navigate("/login-cliente")
    }

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
    const { isOpen: isTermsOpen, onOpen: onTermsOpen, onClose: onTermsClose } = useDisclosure();
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

    const imageDefault = () => {
        // Buscar o caminho da imagem padrão e convertê-la em um arquivo
        fetch(User)
        .then((response) => response.blob())
        .then((blob) => {
            const defaultFile = new File([blob], "default.png", { type: blob.type });
            setValue("arquivoFoto", defaultFile, { shouldValidate: true }); // Define o arquivo no formulário
            setImage(User); // Exibe a imagem padrão
        });
    }


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
    
    const [isOpenAlert, setIsOpenAlert] = useState(false);
    const handleToggleAlert = () => setIsOpenAlert (!isOpenAlert);
      

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
                        {image != "/src/assets/img/diarista-cadastro/user.webp" && (
                            <Button className="text-white bg-desSec" onPress={() => (imageDefault())}>
                                Remover
                            </Button>

                        )}
                        <span className="text-prim text-center">Foto de perfil  <br /> <span className="text-center text-sm">opcional</span> </span>
                        {errors.arquivoFoto && (
                            <span className="text-error opacity-75">{errors.arquivoFoto.message}</span>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="lg:flex">
                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
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
                        <label htmlFor="Genero" className="text-prim">Gênero <span className="text-sm"> ( opcional ) </span> </label>

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
                            placeholder="Especifique seu gênero"
                            className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim"
                            />
                        </>
                    ) : (
                        <select
                        id="Genero"
                        value={genero}
                        onChange={handleGeneroChange}
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
                        <div>
                            <label htmlFor="CpfCnpj" className="text-prim">
                                {cpfCnpj ? cpfCnpj : "CPF / CNPJ"} {/* Exibe CPF ou CNPJ se selecionado */}
                            </label>
                            <Tooltip
                                content="Atenção! para que os metodos de pagamento funcione corretamente, preencha esse campo com um CPF / CNPJ válido."
                                isOpen={isOpenAlert}
                                onOpenChange={setIsOpenAlert}
                                size="md"
                                radius="md"
                                shadow="sm"
                                placement="top"
                                showArrow
                                shouldFlip
                            >
                                <button type="button" onClick={handleToggleAlert} onMouseEnter={() => setIsOpenAlert(true)} onMouseLeave={() => setIsOpenAlert(false)} className="w-5 h-5 text-white bg-prim rounded-full">
                                    ?
                                </button>
                            </Tooltip>

                        </div>

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
                    <label htmlFor="EstadoCivil" className="text-prim">Estado Civil <span className="text-sm"> ( opcional ) </span> </label>
                    <select  
                    id="EstadoCivil"
                    {...register("estadoCivil")}
                    className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim">
                        <option value={0} >Selecione</option>
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
                <div className="relative">
                    <input 
                    className="w-full border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="" 
                    {...register("senha")}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-2 flex items-center text-ter"
                    >
                        {
                            showPassword ? 
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                                :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>

                        }
                    </button>

                </div>
                {errors.senha && 
                <span className="text-error opacity-75">{errors.senha?.message}</span>}
            </div>


            <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                <label htmlFor="confirmPassword" className="text-prim">Confirmar Senha</label>
                <div className="relative">
                    <input 
                    className="w-full border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                    id="confirmPassword" 
                    type={showPassword ? "text" : "password"}
                    {...register('confirmarSenha')}
                    placeholder=""
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-2 flex items-center text-ter"
                    >
                        {
                            showPassword ? 
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                                :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>

                        }
                    </button>

                </div>
                {errors.confirmarSenha && 
                <span className="text-error opacity-75">{errors.confirmarSenha?.message}</span>}
            </div>


            <div className="mt-4 text-prim pr-9 pl-9">
                <div className="flex gap-2 items-baseline">
                    <input 
                    type="checkbox" 
                    id="termo" 
                    />
<label htmlFor="termo">Concordo com os termos de uso e contrato de serviço - <a href="#" className="text-des" onClick={(e) => { e.preventDefault(); onTermsOpen(); }}>Ver termos</a></label>                </div>
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
    isOpen={isTermsOpen} 
    onOpenChange={onTermsClose}
    placement='center'
    classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
    }}
    className="w-full h-full md:min-w-[50vw] md:max-w-[70vw] md:max-h-[90vh] md:rounded-lg" // Ajustes para mobile e desktop
>
    <ModalContent>
        {(onClose) => (
            <>
                <ModalHeader className="flex flex-col gap-1 text-desSec p-5">Termos de uso e contrato de serviço</ModalHeader>
                <ModalBody className="overflow-y-auto"> {/* Scroll interno */}
                    <div className="bg-white sm:pb-4">
                        <div className="sm:flex sm:items-start justify-center">
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <div className="mt-2 lg:flex h-1/2">
                                    <div className="sm:mx-auto sm:w-full sm:max-w-5xl flex flex-col justify-center p-2">
                                        <div className='flex flex-col items-center text-justify gap-2'>
                                            <p className="text-prim text-sm leading-5">
                                                Olá! Que bom contar com seu interesse! Antes de usar nossos serviços, tire um tempo para ler
                                                nossos Termos de Uso e Serviços e conhecer as regras que regem nossa relação com você.
                                                Abaixo esclareceremos alguns pontos que julgamos importantes. Caso persista alguma dúvida acerca
                                                de quaisquer pontos discutidos ou não neste documento, ou ainda, caso queira dar sugestões ou
                                                relatar problemas, por favor, não hesite em contatar-nos pelo endereço de e-mail:
                                                <a href="mailto:contato@limppay.com">contato@limppay.com</a>.
                                                <br /><br />

                                                <b className="text-dark">1. DAS DEFINIÇÕES:</b>
                                                <br /><br />
                                                No presente instrumento, entendemos as expressões abaixo de acordo com as seguintes definições:
                                                <br /><br />
                                                LIMPPAY: LIMPPAY LTDA, sociedade empresarial de responsabilidade limitada, inscrita no
                                                CNPJ sob
                                                o n° 43.367.752/0001-06, com sede na cidade de Manaus/AM, na Av. Rodrigo Otávio, n° 6488, Sala
                                                02, Coroado, CEP 69080-005.
                                                <br /><br />
                                                PLATAFORMA: sistema constituído por uma aplicação web, oferecido por LIMPPAY e de
                                                propriedade,
                                                operação e responsabilidade da LIMPPAY, onde todos os USUÁRIOS podem visualizar e utilizar os
                                                serviços oferecidos pela LIMPPAY.
                                                <br /><br />
                                                <b>SERVIÇOS:</b> Os Serviços oferecidos através da PLATAFORMA integram um portal de tecnologia
                                                que
                                                permite ao cliente (“USUÁRIO/CLIENTE”) encontrar e contratar serviços de limpeza e outros
                                                oferecidos por um prestador de serviços autônomo (“USUÁRIO PRESTADOR”) cadastrado na PLATAFORMA.
                                                O USUÁRIO/CLIENTE utiliza os serviços da LIMPPAY com o intuito de encontrar e contratar um
                                                USUÁRIO PRESTADOR. Em contrapartida, o USUÁRIO PRESTADOR utiliza os Serviços da LIMPPAY com o
                                                intuito de divulgar suas informações profissionais e ser encontrado e contratado pelo
                                                USUÁRIO/CLIENTE. Os Serviços de informação na internet oferecidos pela LIMPPAY permitem a
                                                realização da referida busca e contratação por meio eletrônico, uma vez que os serviços da
                                                LIMPPAY facilitam a relação desejada entre o USUÁRIO/CLIENTE e o USUÁRIO PRESTADOR.
                                                <br /><br />
                                                <b>TRATAMENTO DE DADOS:</b> Toda operação realizada pela LIMPPAY com os dados pessoais do
                                                USUÁRIO, e
                                                mediante expresso consentimento deste ao aceitar os presentes Termos, como as que se referem a
                                                coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão,
                                                distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da
                                                informação, modificação, comunicação, transferência, difusão ou extração.
                                                <br /><br />
                                                <b>USUÁRIOS:</b>
                                                <br /><br />
                                                <b>USUÁRIO/CLIENTE:</b> pessoa física ou jurídica cadastrada na PLATAFORMA, que acesse e/ou
                                                utilize os
                                                serviços ofertados pelos USUÁRIOS PRESTADORES na PLATAFORMA.
                                                <br /><br />
                                                USUÁRIO PRESTADOR: pessoa física ou jurídica cadastrada na PLATAFORMA, que no uso desta
                                                irá
                                                ofertar os seus serviços aos USUÁRIOS CLIENTES, bem como fará uso de seu Aplicativo Específico
                                                para gestão de seus serviços.
                                                <br /><br />

                                                <b className="text-dark">2. DA ADESÃO:</b>
                                                <br /><br />
                                                Este instrumento regula as condições de uso dos serviços da PLATAFORMA, sendo um contrato entre
                                                os USUÁRIOS e a LIMPPAY.
                                                <br /><br />
                                                Este documento visa registrar a manifestação livre, informada e inequívoca pela qual o Titular
                                                concorda com o tratamento de seus dados pessoais para finalidade específica, em conformidade com
                                                a Lei nº 13.709 – Lei Geral de Proteção de Dados Pessoais (LGPD).
                                                <br /><br />
                                                Ao manifestar sua aceitação para com o presente termo, o usuário indica expressamente que
                                                concorda com os termos e condições contidos neste instrumento e com as disposições legais
                                                aplicáveis à espécie.
                                                <br /><br />
                                                Uma vez cadastrado, o USUÁRIO poderá, a qualquer tempo, por meio de ferramenta oferecida no
                                                Website, revisar e alterar suas informações de cadastro.
                                                <br /><br />
                                                O aceite do USUÁRIO também autoriza a LIMPPAY a elaborar relatórios sobre os contratos e/ou os
                                                outros documentos assinados e disponibilizar estes relatórios ao Usuário e/ou aos demais
                                                signatários.
                                                <br /><br />
                                                A LIMPPAY trabalha com uma rede de parceiros, de modo a fornecer ao usuário conteúdo útil e em
                                                seu benefício, mediante a sua expressa autorização dada ao aceitar ao final os presentes Termos,
                                                em consonância com a previsão legal do art. 10, II, da Lei 13.709/18.
                                                <br /><br />
                                                Deste modo, o usuário concorda expressamente em receber da LIMPPAY: (i) anúncios de terceiros
                                                dentro do website (ii) amostras grátis de produtos de estabelecimentos parceiros e (iii) links
                                                para compras dentro do website de produtos fornecidos por terceiros.
                                                <br /><br />
                                                O USUÁRIO reconhece que a LIMPPAY não é fornecedora de bens e não presta serviços de limpeza ou
                                                cuidados em geral, nem funciona como empresa de cessão de mão de obra terceirizada, e que todos
                                                os serviços de limpeza e cuidados em geral são prestados por USUÁRIOS PRESTADORES independentes
                                                que não são empregados (as) e nem representantes da LIMPPAY.
                                                <br /><br />
                                                A LIMPPAY apenas cobra uma taxa de utilização dos usuários prestadores para cada contratação
                                                realizada pelos USUÁRIOS CLIENTES. Essa taxa de utilização é cobrada de forma automática no
                                                momento que o USUÁRIO PRESTADOR recebe o preço pago pelo USUÁRIO/CLIENTE.
                                                <br /><br />
                                                Caso o USUÁRIO NÃO CONCORDE com os termos previstos neste instrumento, basta não clicar na caixa
                                                que será disponibilizada ao final, onde o USUÁRIO declara expressamente estar de acordo com os
                                                termos de uso.
                                                <br /><br />

                                                <b className="text-dark">3. QUEM SOMOS E O QUE FAZEMOS:</b>
                                                <br /><br />
                                                A LIMPPAY é uma empresa privada, que oferece uma PLATAFORMA constituída por uma aplicação web
                                                disponível no site <a href="http://limppay.com" target="_blank">limppay.com</a>,
                                                que aproxima os USUÁRIOS. Nela os USUÁRIOS CLIENTES
                                                consentem em informar a sua localidade, o tipo de diária para limpeza de acordo com o tipo de
                                                imóvel, observando sempre as recomendações durante a contratação, a fim de ter a melhor
                                                experiência de limpeza.
                                                <br /><br />

                                                <b className="text-dark">4. DAS CONDIÇÕES GERAIS DE USO:</b>
                                                <br /><br />
                                                A LIMPPAY apenas é uma PLATAFORMA que conecta os USUÁRIOS, sendo a sua responsabilidade restrita
                                                apenas ao funcionamento correto da PLATAFORMA e de suas funcionalidades, conforme este
                                                instrumento.
                                                <br /><br />
                                                Na relação entre USUÁRIO/CLIENTE e a LIMPPAY ou entre USUÁRIO PRESTADOR e a LIMPPAY, a LIMPPAY
                                                reserva-se o direito de estabelecer, remover e/ou revisar o Preço relativo a todos os serviços
                                                de limpeza e cuidados em geral obtidos por meio do uso da PLATAFORMA e dos Serviços a qualquer
                                                momento, a critério exclusivo da LIMPPAY. Ademais, você reconhece e concorda que o preço
                                                aplicável em certas áreas geográficas poderá variar e/ou aumentar substancialmente quando a
                                                oferta de limpezas e cuidados em geral por parte dos USUÁRIOS PRESTADORES for menor do que a
                                                demanda por limpezas e cuidados em geral.
                                                <br /><br />
                                                O tipo de diária escolhido para a contratação do USUÁRIO PRESTADOR é de responsabilidade
                                                exclusivamente do USUÁRIO/CLIENTE, e as recomendações por parte da LIMPPAY ou dos USUÁRIOS
                                                PRESTADORES é meramente uma SUGESTÃO com base em históricos de USUÁRIOS CLIENTES anteriores. A
                                                LIMPPAY não tem nenhuma responsabilidade pela insuficiência de tempo ou incompletude dos dados
                                                disponibilizados. Caso a insuficiência de tempo ou incompletude dos dados fornecidos pelo
                                                USUÁRIO/CLIENTE impossibilite que o USUÁRIO PRESTADOR conclua todo o serviço de limpeza desejado
                                                dentro do tipo de diária escolhida pelo USUÁRIO/CLIENTE, o USUÁRIO/CLIENTE assume a culpa
                                                exclusiva pela não conclusão do serviço desejado dentro do tipo de diária escolhida, isentando
                                                nestes casos a LIMPPAY e o USUÁRIO PRESTADOR de toda e qualquer responsabilidades.
                                                <br /><br />
                                                A LIMPPAY não detém nenhuma relação com os USUÁRIOS PRESTADORES cadastrados, não sendo possível
                                                imputar à LIMPPAY a responsabilidade por qualquer dano causado aos USUÁRIOS CLIENTES ou a
                                                terceiros, por atos oriundos dos PRESTADORES DE SERVIÇOS no momento da prestação dos serviços
                                                intermediados através PLATAFORMA.
                                                <br /><br />
                                                Ainda, a LIMPPAY não pode ser responsabilizada por serviços realizados entre os USUÁRIOS
                                                PRESTADORES da PLATAFORMA acertados diretamente com os USUÁRIOS CLIENTES, de forma que a LIMPPAY
                                                orienta que aos USUÁRIOS CLIENTES não troquem informações pessoais de telefone com fito de
                                                contratar os serviços além da PLATAFORMA.
                                                <br /><br />
                                                A LIMPPAY aconselha que os serviços contratados sejam realizados por meio da PLATAFORMA
                                                disponibilizada pela LIMPPAY, de forma que esta mantenha em sua base de USUÁRIOS PRESTADORES
                                                apenas pessoas qualificadas, gerando maior credibilidade e segurança para os USUÁRIOS CLIENTES.
                                                <br /><br />
                                                É de responsabilidade dos USUÁRIOS PRESTADORES terem e manterem equipamentos e estruturas que
                                                respeitem os requisitos mínimos para a utilização dos serviços oferecidos pela LIMPPAY.
                                                <br /><br />

                                                <b className="text-dark">5. DO CADASTRO:</b>
                                                <br /><br />
                                                Os serviços oferecidos pela LIMPPAY estão disponíveis para pessoas físicas absolutamente capazes
                                                e pessoas jurídicas devidamente inscritas no CNPJ.
                                                Para os USUÁRIOS CLIENTES pessoa física realizarem o seu cadastro na PLATAFORMA, eles fornecerão
                                                à LIMPPAY os seguintes dados: Nome, sobrenome, data de nascimento, CPF, telefone celular,
                                                cidade, endereço de e-mail e farão o cadastro de uma senha para acesso.
                                                <br /><br />
                                                Para os USUÁRIOS CLIENTES pessoa jurídica realizarem o seu cadastro na PLATAFORMA, eles
                                                fornecerão à LIMPPAY os seguintes dados: CNPJ, nome fantasia, razão social, endereço de e-mail,
                                                dados do seu representante: Nome, sobrenome, data de nascimento, CPF, telefone celular e
                                                endereço completo (Rua, número, complemento, bairro, cidade e CEP) e farão o cadastro de uma
                                                senha para acesso.
                                                <br /><br />
                                                Para os USUÁRIOS PRESTADORES pessoa física realizarem o seu cadastro na PLATAFORMA, eles
                                                fornecerão à LIMPPAY os seguintes dados: Nome, sobrenome, data de nascimento, CPF, telefone
                                                celular, cidade, endereço de e-mail e farão o cadastro de uma senha para acesso. Os USUÁRIOS
                                                PRESTADORES precisarão anexar no momento do cadastro cópia dos documentos pessoais, foto e
                                                Curriculum, além de fazer um breve resumo sobre suas experiências profissionais e sobre si.
                                                <br /><br />
                                                A coleta dos dados dos USUÁRIOS, mediante seu expresso consentimento, tem a finalidade de
                                                identificá-los, bem como habilitá-los ao correto uso da PLATAFORMA, e, com isto, a LIMPPAY
                                                poderá assegurar a boa qualidade das funcionalidades da PLATAFORMA, atendendo ao legítimo
                                                interesse da LIMPPAY e em benefício dos USUÁRIOS.
                                                <br /><br />
                                                Ao consentir com os termos do presente instrumento, os USUÁRIOS declaram expressamente estar
                                                cientes que a coleta dos seus dados é primordial para o bom funcionamento da PLATAFORMA, e que
                                                serão utilizados respeitando as normas previstas na Lei Geral de Proteção de Dados.
                                                <br /><br />
                                                É expressamente vedada a criação de mais de um cadastro por USUÁRIO na PLATAFORMA. Em caso de
                                                multiplicidade de cadastros elaborados por um só USUÁRIO, a LIMPPAY se reserva o direito de, ao
                                                seu exclusivo critério, sem contrapartida indenizatória e sem necessidade de prévia anuência ou
                                                comunicação, inabilitar todos os cadastros existentes em nome deste USUÁRIO, podendo não aceitar
                                                novo cadastro do referido USUÁRIO na PLATAFORMA.
                                                <br /><br />
                                                É necessário o preenchimento completo de todos os dados solicitados pela PLATAFORMA no momento
                                                do cadastramento, para que os USUÁRIOS estejam habilitados a utilizar a PLATAFORMA.
                                                <br /><br />
                                                É de exclusiva responsabilidade dos USUÁRIOS fornecer, atualizar e garantir a veracidade dos
                                                dados cadastrais, não recaindo à LIMPPAY qualquer tipo de responsabilidade civil e criminal
                                                resultante de dados inverídicos, incorretos ou incompletos fornecidos pelos USUÁRIOS.
                                                <br /><br />
                                                Sendo permitido aos USUÁRIOS requisitar à LIMPPAY, a correção de dados incompletos, inexatos ou
                                                desatualizados, mediante fornecimento pelos USUÁRIOS.
                                                <br /><br />
                                                A LIMPPAY se reserva o direito de utilizar todos os meios válidos e possíveis para identificar
                                                seus USUÁRIOS, bem como de solicitar dados adicionais e documentos que estime serem pertinentes
                                                a fim de conferir os dados informados. Neste caso, o uso da PLATAFORMA pelo USUÁRIO fica
                                                condicionado ao envio dos documentos e dos dados eventualmente solicitados.
                                                <br /><br />
                                                A solicitação de dados adicionais, atenderá à finalidade específica, consentida pelo titular.
                                                <br /><br />
                                                O USUÁRIO acessará a sua conta na PLATAFORMA por meio de login e senha, comprometendo-se a não
                                                informar a terceiros estes dados, responsabilizando-se integralmente pelo uso que deles será
                                                feito.
                                                <br /><br />
                                                O USUÁRIO poderá ter acesso às informações coletadas e tratadas pela LIMPPAY, de forma gratuita,
                                                através do link <a href="https://app.limppay.com/?page=cliente.login" target="_blank">https://app.limppay.com/?page=cliente.login</a> ou através da sua conta na
                                                Plataforma,
                                                podendo editá-las ou excluí-las a qualquer tempo.
                                                <br /><br />
                                                O USUÁRIO compromete-se a notificar a LIMPPAY imediatamente, por meio dos canais de contato
                                                mantidos pela LIMPPAY na PLATAFORMA, a respeito de qualquer uso não autorizado de sua conta. O
                                                USUÁRIO será o único responsável pelas operações efetuadas em sua conta, uma vez que o acesso só
                                                será possível mediante a utilização de senha de seu exclusivo conhecimento.
                                                <br /><br />
                                                O USUÁRIO compromete-se a notificar a LIMPPAY imediatamente, por meio dos canais de contato
                                                mantidos pela LIMPPAY na PLATAFORMA, a respeito de qualquer conhecimento de irregularidades de
                                                outros USUÁRIOS que possam ocasionar danos aos próprios USUÁRIOS da PLATAFORMA, a esta, a
                                                LIMPPAY ou a terceiros.
                                                <br /><br />
                                                Em nenhuma hipótese será permitida a cessão, a venda, o aluguel ou outra forma de transferência
                                                da conta do USUÁRIO.
                                                <br /><br />
                                                O apelido que o USUÁRIO PRESTADOR utiliza na PLATAFORMA não poderá guardar semelhança com o nome
                                                LIMPPAY, tampouco poderá ser utilizado qualquer apelido que insinue ou sugira que os serviços
                                                serão prestados pela LIMPPAY.
                                                <br /><br />
                                                Ao seu exclusivo critério a LIMPPAY poderá excluir, inabilitar, suspender, bloquear, por tempo
                                                indeterminado, sem aviso prévio ou contrapartida indenizatória, cadastros de USUÁRIOS que sejam
                                                considerados ofensivos, que infrinjam os termos deste instrumento ou a legislação em vigor.
                                                <br /><br />
                                                A LIMPPAY se reserva ao direito de não permitir novo cadastro de USUÁRIOS que já tenham sido
                                                cancelados, inabilitados, bloqueados, excluídos ou suspensos da PLATAFORMA. Não se permitirá,
                                                ainda, a criação de novos cadastros por pessoas cujos cadastros originais tenham sido
                                                cancelados, bloqueados, inabilitados, excluídos ou suspensos por infrações às políticas da
                                                LIMPPAY ou a legislação vigente.
                                                <br /><br />
                                                A LIMPPAY se reserva o direito de, unilateralmente, sem prévio aviso, anuência ou contrapartida
                                                indenizatória, recusar qualquer solicitação de cadastro de um USUÁRIO na PLATAFORMA, bem como
                                                cancelar, inabilitar, bloquear, excluir ou suspender o uso de um cadastro previamente aceito.
                                                <br /><br />
                                                Para se cadastrar como USUÁRIO PRESTADOR na PLATAFORMA, deve o USUÁRIO preencher o formulário
                                                solicitado em <a href="https://diarista.limppay.com/diarista.cadastro.html" target="_blank">https://diarista.limppay.com/diarista.cadastro.html</a>, onde irá informar a
                                                LIMPPAY, suas
                                                referências profissionais, comprovante de residência, cópia frente e verso do documento de
                                                identificação, bem como demais documentos solicitados pela própria PLATAFORMA ou pela equipe da
                                                LIMPPAY. Após o recebimento do e-mail a LIMPPAY informará a validação, ou não, do cadastro do
                                                USUÁRIO como PRESTADOR DE SERVIÇO, no prazo de até 72 (setenta e duas) horas úteis.
                                                <br /><br />
                                                Os dados fornecidos pelo USUÁRIO PRESTADOR, serão tratados mediante seu expresso consentimento,
                                                com a finalidade específica de serem utilizados para a correta prestação dos serviços constantes
                                                nestes termos, incluindo a análise de antecedentes (background check), eis que referida análise
                                                é necessária para a correta execução do contrato, atendendo ao legítimo interesse da LIMPPAY e
                                                dos próprios USUÁRIOS, respeitando o direito à privacidade e intimidade do titular dos dados,
                                                nos termos previstos na Lei Geral de Proteção de Dados.
                                                <br /><br />
                                                Após a validação e a liberação do cadastro de um USUÁRIO PRESTADOR na PLATAFORMA pela equipe da
                                                LIMPPAY, o USUÁRIO PRESTADOR, começará, mediante sua concordância, a receber notificações em seu
                                                Aplicativo Específico, sobre os serviços solicitados de compras efetuadas na PLATAFORMA LIMPPAY
                                                pelo USUÁRIO/CLIENTE.
                                                <br /><br />
                                                A validação, ou não, de um USUÁRIO PRESTADOR na PLATAFORMA, compete exclusivamente a LIMPPAY,
                                                que se reserva ao direito de recusar, a seu exclusivo critério, o cadastro de algum USUÁRIO
                                                PRESTADOR.
                                                <br /><br />

                                                <b className="text-dark">6. DAS FUNCIONALIDADES:</b>
                                                <br /><br />
                                                Após a realização de cadastro pelo USUÁRIO/CLIENTE, a PLATAFORMA disponibiliza formulário de
                                                agendamento de limpeza a ser preenchida por este, onde serão informados o local da faxina, o
                                                horário, a data e as características dos serviços de que necessita, podendo ser mais de 01 (um).
                                                <br /><br />
                                                O USUÁRIO/CLIENTE poderá escolher a melhor data para a sua faxina, ou ainda, dias alternativos
                                                disponibilizados pelo USUÁRIO PRESTADOR, assim como o horário de início da faxina pelo USUÁRIO
                                                PRESTADOR, a qual terá o limite diário de 1 (uma) a 8 (oito) horas de duração, podendo ser entre
                                                as 7h e 22h de acordo com sua necessidade informada na PLATAFORMA e desde que haja USUÁRIO
                                                PRESTADOR disponível.
                                                <br /><br />
                                                A PLATAFORMA irá sugerir USUÁRIOS PRESTADORES de acordo com a localidade do USUÁRIO/CLIENTE,
                                                podendo ele escolher o profissional autônomo pesquisando pelo nome do USUÁRIO PRESTADOR, ou a
                                                partir das avaliações anteriores de limpezas realizadas pelo USUÁRIO PRESTADOR.
                                                <br /><br />
                                                No valor da limpeza a ser realizada pelo USUÁRIO PRESTADOR estão inclusos: (i) o serviço a ser
                                                prestado, (ii) transporte e (iii) alimentação do USUÁRIO PRESTADOR.
                                                <br /><br />
                                                Os itens e produtos de limpeza que cada USUÁRIO PRESTADOR utiliza pode variar, porém, todos
                                                levam uma quantidade mínima de itens e produtos de limpeza que constam na lista disponível no
                                                site da LIMPPAY. A lista de produtos mínimos incluídos não consta: baldes, escadas, rodos e
                                                vassouras, sendo constantemente atualizada no site da LIMPPAY (<a href="https://limppay.com" target="_blank">limppay.com</a>).
                                                <br /><br />
                                                O USUÁRIO/CLIENTE poderá sugerir o uso ou não de determinado item ou produto de limpeza levado
                                                pelo USUÁRIO PRESTADOR, ou, ainda, poderá sugerir o uso de seus itens ou produtos de limpeza de
                                                acordo com sua preferência, como aspirador de pó, baldes, escadas, vassouras, ou qualquer outro
                                                que não consta na lista disponibilizada pela LIMPPAY, bem como a quantidade de produtos descrito
                                                na lista, bastando preencher as instruções no campo destinado ao agendamento na PLATAFORMA ou
                                                comunicar ao USUÁRIO PRESTADOR no momento da faxina.
                                                <br /><br />
                                                Após o preenchimento do formulário e a confirmação do agendamento da faxina na PLATAFORMA pelo
                                                USUÁRIO/CLIENTE, o USUÁRIO/CLIENTE receberá em seu e-mail cadastrado a confirmação do seu
                                                pedido.
                                                <br /><br />
                                                As compras realizadas pelo USUÁRIO/CLIENTE entre às 9h e as 18h podem ser agendadas para o mesmo
                                                dia, desde que iniciem 2 (duas) horas após a efetivação da compra na PLATAFORMA. Fora deste
                                                prazo, o USUÁRIO/CLIENTE só poderá agendar limpezas para o próximo dia a partir das 9h da manhã.
                                                <br /><br />
                                                O USUÁRIO/CLIENTE poderá solicitar a escolha com o mesmo USUÁRIO PRESTADOR o qual tenha gostado
                                                da prestação do serviço por meio da busca do nome do USUÁRIO PRESTADOR no fluxo de escolha
                                                dentro da PLATAFORMA.
                                                <br /><br />
                                                No uso das funcionalidades da PLATAFORMA, o USUÁRIO compreende que não é permitido: (i) usar
                                                linguajar de baixo calão, ofensivo ou com sentido dúbio; (ii) realizar comentários difamatórios,
                                                contra qualquer pessoa física (viva ou falecida) ou jurídica; (iii) realizar comentários ou
                                                publicar imagens que possam infringir direitos de terceiros, sejam contrários à moral e aos bons
                                                costumes, que incitem a violência, o ódio, o sexismo, o racismo, que façam alusão a pornografia,
                                                pedofilia, armas, drogas e demais conteúdos perturbadores ou ilegais; (iv) enviar ou solicitar
                                                dados pessoais, tais como, mas não se limitando a: e-mail, telefone, perfil do Facebook, perfil
                                                do Instagram, contato no WhatsApp, links diversos, informações de conta bancária, informações de
                                                documentos pessoais ou qualquer outro meio de comunicação pessoal; (v) fazer menção à alguma
                                                plataforma concorrente ou combinar o fechamento do negócio por outro meio diverso da PLATAFORMA;
                                                (vi) publicar imagens contendo dados pessoais como telefones de contato, e-mail, etc.
                                                <br /><br />
                                                Ao final de cada limpeza, o USUÁRIO PRESTADOR e o USUÁRIO/CLIENTE poderão avaliar um ao outro
                                                mutuamente na PLATAFORMA, sobre o serviço realizado, podendo conferir uma nota de 0 a 5, sendo
                                                esta avaliação pública para todos os outros USUÁRIOS CLIENTES da PLATAFORMA. Quando da
                                                avaliação, elas serão publicadas na PLATAFORMA sem a identificação de quem procedeu a avaliação.
                                                <br /><br />
                                                A LIMPPAY procederá com o monitoramento e publicação das avaliações realizadas pelos USUÁRIOS,
                                                buscando manter na PLATAFORMA USUÁRIOS CLIENTES e USUÁRIOS PRESTADORES qualificados.
                                                A LIMPPAY poderá, a seu exclusivo critério, criar códigos promocionais que poderão ser
                                                resgatados para crédito na conta ou outras características ou benefícios para os USUÁRIOS
                                                CLIENTES, relacionados aos serviços e/ou a serviços do USUÁRIO PRESTADOR, sujeitos a quaisquer
                                                condições adicionais que sejam estabelecidas para cada um dos códigos promocionais.
                                                <br /><br />
                                                O USUÁRIO compreende que os códigos promocionais: (i) devem ser usados de forma legal para a
                                                finalidade e o público a que se destinam; (ii) poderão ser desabilitados pela LIMPPAY a qualquer
                                                momento por motivos legalmente legítimos, sem que isto resulte qualquer responsabilidade; (iii)
                                                somente poderão ser usados de acordo com as condições específicas que a LIMPPAY estabelecer para
                                                esse Código Promocional; (iv) não são válidos como dinheiro; e (v) poderão expirar antes de
                                                serem usados. A LIMPPAY se reserva no direito de reter ou deduzir créditos ou outras
                                                funcionalidades ou vantagens obtidas por meio do uso dos Códigos Promocionais por você ou por
                                                outro USUÁRIO/CLIENTE ou USUÁRIO PRESTADOR, caso a LIMPPAY apure ou acredite que o uso ou
                                                resgate do Código Promocional foi feito com erro, fraude, ilegalidade ou violação às condições
                                                do respectivo Código Promocional. Eventuais Promoções podem afetar o preço final para a
                                                contratação de um USUÁRIO PRESTADOR através dos Serviços da LIMPPAY. Caso realizadas, essas
                                                promoções têm caráter temporário, transitório e não vinculante.
                                                <br /><br />
                                                O USUÁRIO autoriza a LIMPPAY a lhe enviar pesquisas de conhecimento/satisfação, relacionadas aos
                                                serviços e/ou a serviços do USUÁRIO PRESTADOR, do aplicativo, da própria LIMPPAY ou para
                                                avaliação das amostras de parceiros enviadas em benefício do próprio USUÁRIO.
                                                <br /><br />

                                                <b className="text-dark">7. DAS OBRIGAÇÕES DOS USUÁRIOS PRESTADORES:</b>
                                                <br /><br />
                                                Cabe unicamente ao USUÁRIO PRESTADOR emitir nota fiscal, ou recibo competente, dos serviços
                                                prestados ao USUÁRIO/CLIENTE.
                                                <br /><br />
                                                O USUÁRIO PRESTADOR cadastrado declara que detém capacidade legal e técnica para prestar o
                                                serviço ofertado na PLATAFORMA, bem como declara que é o único responsável por todo e qualquer
                                                serviço que realize e que tenha sido intermediado através da PLATAFORMA.
                                                <br /><br />
                                                Ainda, o USUÁRIO PRESTADOR fica responsável por qualquer dano ocasionado ao USUARIO CLIENTE ou a
                                                terceiros, pelos serviços que, porventura, mesmo que constatado para a realização, através da
                                                PLATAFORMA, deixe de prestar ou que seja prestado em desacordo com o que fora acertado entre as
                                                partes.
                                                <br /><br />
                                                A LIMPPAY não se responsabiliza pelas obrigações tributárias ou trabalhistas que recaiam sobre
                                                as atividades exercidas pelos USUÁRIOS PRESTADORES.
                                                <br /><br />

                                                <b className="text-dark">8. DAS OBRIGAÇÕES DOS USUÁRIOS CLIENTES:</b>
                                                <br /><br />
                                                Cabe unicamente ao USUÁRIO/CLIENTE exigir nota fiscal, ou recibo competente, do USUÁRIO
                                                PRESTADOR.
                                                <br /><br />
                                                O USUÁRIO/CLIENTE compreende que é de sua responsabilidade, assim como de seu representante caso
                                                o informe na PLATAFORMA, de estar presente na data e local agendada com o USUÁRIO PRESTADOR para
                                                o serviço de limpeza, declarando estar ciente de que a PLATAFORMA não tem nenhum vínculo com o
                                                USUÁRIO PRESTADOR.
                                                <br /><br />
                                                O USUÁRIO/CLIENTE compreende que deve agendar limpezas em horários em que possa aguardar por até
                                                15 (quinze) minutos a mais no início e no fim da limpeza, para eventuais atrasos (e compensações
                                                de atrasos) inferiores a 15 (quinze) minutos por parte dos USUÁRIOS PRESTADORES.
                                                <br /><br />
                                                O USUÁRIO/CLIENTE compreende que não é preciso estar em casa no momento da limpeza pelo USUÁRIO
                                                PRESTADOR, devendo, para isto, avisar a sua ausência no formulário de agendamento do serviço na
                                                PLATAFORMA.
                                                <br /><br />
                                                O USUÁRIO/CLIENTE compreende que, caso precise se ausentar do local durante a limpeza pelo
                                                USUÁRIO PRESTADOR, deverá deixar ao menos uma saída aberta para o USUÁRIO PRESTADOR, para que
                                                ele possa sair em caso de acidentes.
                                                <br /><br />
                                                O USUÁRIO/CLIENTE compreende que é o único responsável pelo acompanhamento do desenvolvimento
                                                dos serviços a serem prestados pelos USUÁRIO PRESTADORES.
                                                <br /><br />

                                                <b className="text-dark">9. MÉTODOS DE PAGAMENTO:</b>
                                                <br /><br />
                                                Para o pagamento dos serviços solicitados na PLATAFORMA, deverá o USUÁRIO/CLIENTE escolher por
                                                um dos métodos a seguir:
                                                <br /><br />
                                                Cartão de Crédito VISA; ou,
                                                <br />
                                                Cartão de Crédito MASTERCARD; ou,
                                                <br />
                                                Cartão de Crédito AMERICAN EXPRESS; ou,
                                                <br />
                                                Cartão de Crédito HIPERCARD; ou,
                                                <br />
                                                Cartão de Crédito ELO; ou
                                                <br />
                                                Cartão de Crédito DINERS; ou,
                                                <br />
                                                Boleto Bancário.
                                                <br /><br />
                                                Para utilizar o pagamento por meio de boleto bancário, o USUÁRIO/CLIENTE compreende que o
                                                agendamento do serviço de limpeza deve ser feito na PLATAFORMA com pelo menos 2 (dois) dias
                                                úteis de antecedência à data escolhida.
                                                <br /><br />
                                                Para processar os pagamentos através de cartão de crédito, será necessário que o USUÁRIO/CLIENTE
                                                cadastre na PLATAFORMA os seguintes dados do cartão escolhido:
                                                <br /><br />
                                                Nome do titular do Cartão de Crédito;
                                                <br />
                                                CPF do titular do Cartão de Crédito;
                                                <br />
                                                Data de nascimento do titular do Cartão de Crédito;
                                                <br />
                                                Número do Cartão de Crédito;
                                                <br />
                                                Número de Telefone do titular;
                                                <br />
                                                Vencimento do Cartão de Crédito (Mês e Ano);
                                                <br />
                                                Número de segurança do Cartão de Crédito.
                                                <br /><br />
                                                Caso o USUÁRIO/CLIENTE efetue o pagamento utilizando um cartão de crédito, receberá um e-mail
                                                confirmando o seu pagamento. Em caso de recusa do pagamento, o USUÁRIO/CLIENTE será
                                                imediatamente informado, na própria tela de pagamento. Em caso de recusa, se o USUÁRIO/CLIENTE
                                                ainda estiver dentro do tempo máximo para pagamento, o USUÁRIO/CLIENTE poderá tentar utilizar um
                                                outro cartão de crédito ou corrigir os dados. Em não estando mais dentro do tempo máximo para
                                                pagamento, o agendamento dos serviços será cancelado, podendo o USUÁRIO/CLIENTE realizar um novo
                                                agendamento ou entrar em contato com o suporte da LIMPPAY, através do e-mail
                                                contato@limppay.com.
                                                <br /><br />
                                                Os pagamentos são processados através da plataforma IUGU INSTITUIÇÃO DE PAGAMENTO S.A, sendo
                                                necessário que todos os USUÁRIOS também leiam e aceitem os termos de uso e serviços da
                                                plataforma IUGU INSTITUIÇÃO DE PAGAMENTO S.A. através do endereço eletrônico:
                                                <a href="https://www.iugu.com/juridico/contrato" target="_blank">https://www.iugu.com/juridico/contrato</a>.
                                                <br /><br />
                                                A contratação de qualquer USUÁRIO PRESTADOR feita pelo USUÁRIO/CLIENTE, com pagamento através de
                                                cartão de crédito, indica expressamente que o USUÁRIO/CLIENTE leu e aceitou todas as condições
                                                presentes neste instrumento e nos termos de uso e serviços específicos da plataforma IUGU
                                                INSTITUIÇÃO DE PAGAMENTO S.A.
                                                <br /><br />
                                                Qualquer contestação de pagamentos efetuados através da plataforma IUGU INSTITUIÇÃO DE PAGAMENTO
                                                S.A. deverá ser resolvida somente entre os USUÁRIOS e a IUGU INSTITUIÇÃO DE PAGAMENTO S.A., não
                                                recaindo à LIMPPAY qualquer responsabilidade pelo processamento dos pagamentos efetuados junto à
                                                plataforma IUGU INSTITUIÇÃO DE PAGAMENTO S.A.
                                                <br /><br />
                                                A plataforma IUGU INSTITUIÇÃO DE PAGAMENTO S.A. poderá cobrar taxas pela sua utilização, cabendo
                                                somente ao USUÁRIO se informar acerca dos valores praticados pela IUGU INSTITUIÇÃO DE PAGAMENTO
                                                S.A.
                                                <br /><br />
                                                O USUÁRIO concorda que seus dados de pagamento fornecidos à LIMPPAY, poderão ser salvos na base
                                                de dados desta e da IUGU INSTITUIÇÃO DE PAGAMENTO S.A., podendo o USUÁRIO requerer a exclusão de
                                                seus dados, após a efetivação da transação, devendo, para tanto, informar, quando solicitado
                                                pela PLATAFORMA, que os dados de pagamento serão utilizados somente naquela transação, não sendo
                                                necessários serem salvos para transações posteriores.
                                                <br /><br />
                                                A LIMPPAY somente se responsabiliza por deletar os dados de pagamento fornecidos pelo USUÁRIO de
                                                sua própria base de dados, declarando o USUÁRIO estar ciente de que não compete à LIMPPAY
                                                promover a exclusão dos referidos dados da base de dados da IUGU INSTITUIÇÃO DE PAGAMENTO S.A.
                                                <br /><br />

                                                <b className="text-dark">10. CANCELAMENTO E REMARCAÇÕES:</b>
                                                <br /><br />
                                                <b className="text-dark">10.1. USUÁRIO/CLIENTE</b>
                                                <br /><br />
                                                Caso o Cliente precise cancelar o serviço contratado, ele deverá informar a Limppay imediatamente por telefone, e-mail ou WhatsApp.
                                                <br /><br />
                                                Será cobrada uma taxa de cancelamento de 25% do valor do serviço contratado, caso o inciso 1 não seja respeitado.
                                                <br /><br />
                                                Para que não incida taxa de cancelamento, o mesmo só deverá ser realizado até as 16h do dia anterior a data de prestação do serviço.
                                                <br /><br />

                                                <b className="text-dark">10.2. USUÁRIO PRESTADOR</b>
                                                <br /><br />
                                                Caso o prestador de serviços realize o cancelamento e o cliente não esteja de acordo com a substituição do prestador de serviço ou da data de prestação de serviço,
                                                ele poderá solicitar o reembolso integral do valor pago pelo serviço cancelado.
                                                <br /><br />

                                                <b className="text-dark">10.3. CANCELAMENTO CADASTRO</b>
                                                <br /><br />
                                                A LIMPPAY, após a rescisão ou cancelamento da sua assinatura, se reserva ao direito de excluir todos os seus dados no curso normal de operação. Seus dados não poderão ser recuperados após o cancelamento de sua conta.
                                                Os USUÁRIO/CLIENTES podem encerrar o uso da PLATAFORMA a qualquer momento. A LIMPPAY também se reserva ao direito de suspender ou encerrar o oferecimento da PLATAFORMA a qualquer momento, a nosso critério e sem aviso prévio.
                                                A LIMPPAY poderá manter e tratar os dados pessoais do USUÁRIO durante todo o período em que estes forem pertinentes ao alcance das finalidades listadas neste termo. Dados pessoais anonimizados, sem possibilidade de associação ao indivíduo, poderão ser mantidos por período indefinido.
                                                A LIMPPAY se reserva ao direito de efetuar o cancelamento de contas dos USUÁRIOS CLIENTES inativos, por período igual ou maior que 01 (um) ano.
                                                O USUÁRIO poderá solicitar à LIMPPAY, a qualquer momento, que sejam eliminados os dados pessoais não anonimizados. O USUÁRIO fica ciente de que poderá ser inviável à LIMPPAY continuar o fornecimento de produtos ou serviços ao USUÁRIO a partir da eliminação dos dados pessoais.

                                                <br /><br />

                                                <b className="text-dark">11. DO USO DA IMAGEM:</b>
                                                <br /><br />
                                                O USUÁRIO autoriza expressamente à LIMPPAY, sem que nada possa ser reclamado à título de
                                                direitos de imagem ou a qualquer outro, a partir do aceite deste termo, a utilização de
                                                quaisquer imagens e vozes em todo e qualquer material, entre fotos, imagens e documentos, para
                                                ser utilizada em campanhas promocionais e institucionais da LIMPPAY, sejam essas destinadas à
                                                divulgação ao público em geral, uso na PLATAFORMA ou uso em ações internas. A presente
                                                autorização é concedida a título gratuito, abrangendo o uso da imagem e voz acima mencionada,
                                                sem limite de tempo ou número de utilizações, em todo território nacional e no exterior, das
                                                seguintes formas: (I) outdoor; (II) busdoor; folhetos em geral (encartes, mala direta, catálogo,
                                                etc.); (III) folder de apresentação; (IV) anúncios em revistas e jornais em geral; (V) home
                                                page; (VI) cartazes; (VII) back-light; (VIII) mídia eletrônica (painéis, vídeo-tapes, televisão,
                                                cinema, programa para rádio, entre outros) (IX) Mídias virtuais (Twitter, Instagram, Facebook,
                                                Spotify, entre outros); (X) plataforma LIMPPAY.
                                                <br /><br />

                                                <b className="text-dark">12. SUPORTE TÉCNICO:</b>
                                                <br /><br />
                                                A LIMPPAY prestará suporte aos USUÁRIOS da PLATAFORMA nos seguintes horários: De segunda à
                                                sexta, das 08h00 até às 18h, e nos sábados, das 8h ao 12h (exceto feriados), através dos
                                                telefones informados no website (<a href="http://limppay.com" target="_blank">limppay.com</a>),
                                                e e-mail contato@limppay.com. Nas
                                                solicitações de suporte via e-mail, a LIMPPAY terá até 72 (setenta e duas) horas úteis para
                                                proceder à resposta.
                                                <br /><br />

                                                <b className="text-dark">13. DA POLÍTICA DE PRIVACIDADE:</b>
                                                <br /><br />
                                                Os USUÁRIOS aceitam e concordam que as informações cadastradas na PLATAFORMA sejam publicadas
                                                e/ou fornecidas de acordo com o previsto neste instrumento.
                                                <br /><br />
                                                Os USUÁRIOS aceitam e concordam que:
                                                <br /><br />
                                                • Qualquer informação fornecida seja guardada numa base de dados controlada pela LIMPPAY;
                                                <br /><br />
                                                • Essa base de dados possa ser armazenada em servidores não localizados no país onde o USUÁRIO
                                                se
                                                encontra nem onde a LIMPPAY se encontra;
                                                <br /><br />
                                                • Os servidores sejam de propriedade e administrados por prestadoras de serviço contratados pela
                                                LIMPPAY.
                                                <br /><br />
                                                Ainda que utilizando infraestrutura computacional administrada por terceiros, a LIMPPAY não
                                                autoriza o uso das informações do USUÁRIO pela prestadora de serviço.
                                                <br /><br />
                                                A PLATAFORMA é nossa. O USUÁRIO pode usá-la de acordo com esse Termo de Uso, mas o código-fonte,
                                                a marca, os elementos técnicos, de design, de processos, relatórios, e outros que nos ajudam a
                                                caracterizar a PLATAFORMA são de nossa propriedade e não devem ser usados pelo USUÁRIO de
                                                nenhuma forma que não seja previamente autorizada por escrito pela LIMPPAY.
                                                <br /><br />
                                                O USUÁRIO concorda que não vai fazer, tentar fazer, ou ajudar alguém a fazer nenhum tipo de
                                                engenharia reversa ou tentativa de acesso ao código fonte e estrutura do banco de dados, em
                                                relação a PLATAFORMA. Os comentários e sugestões dos USUÁRIOS são muito bem-vindos e podem gerar
                                                inovações ou implementações que podem ser incorporadas à PLATAFORMA, mas isso não dará ao
                                                USUÁRIO nenhuma espécie de direito sobre elas. O USUÁRIO não tem e não terá nenhuma propriedade,
                                                titularidade ou participação direta ou indireta na PLATAFORMA ou na LIMPPAY.
                                                <br /><br />
                                                Ainda que a LIMPPAY escolha as prestadoras de serviço líderes mundiais em segurança de dados, a
                                                LIMPPAY se exime de responsabilidade por qualquer possível atentado hacker ou falha das
                                                tecnologias de segurança que possam levar essa informação a ser exposta.
                                                <br /><br />
                                                A LIMPPAY protege todos os dados pessoais do USUÁRIO utilizando padrões de cuidado técnica e
                                                economicamente razoáveis considerando-se a tecnologia atual da Internet. O USUÁRIO reconhece que
                                                não pode haver expectativa quanto a segurança total na Internet contra invasão de websites ou
                                                outros atos irregulares.
                                                <br /><br />
                                                A LIMPPAY coleta dados pessoais com a finalidade de prestar seus serviços. Somos comprometidos a
                                                preservar a privacidade e segurança de nossos usuários, com tal processamento de dados sendo
                                                feito em estrita conformidade às leis e regulamentos aplicáveis, em particular com a Lei Geral
                                                de Proteção de Dados (LGPD).
                                                <br /><br />
                                                É reservado o direito da LIMPPAY em fornecer os dados e informações do USUÁRIO, bem como de todo
                                                o sistema utilizado na PLATAFORMA, para sua equipe técnica, podendo ser formada por funcionários
                                                da LIMPPAY e/ou por empresa terceirizada, nos quais serão responsáveis por administrar a
                                                segurança e confiabilidade da PLATAFORMA e dos dados dos USUÁRIOS.
                                                <br /><br />
                                                Todos os integrantes da equipe técnica, sejam funcionários ou empresa terceirizada, firmarão
                                                termo de confidencialidade, declarando que se obrigam a manter sob absoluto sigilo todas as
                                                informações comerciais, contábeis, administrativas, tecnológicas, infra estruturais, técnicas,
                                                ou seja, quaisquer dados revelados mutuamente em decorrência da manutenção do funcionamento e
                                                segurança da PLATAFORMA, abstendo-se de utilizá-las em proveito próprio ou de terceiros,
                                                comprometendo-se a zelar para que seus sócios, funcionários com vínculo empregatício e terceiros
                                                de sua confiança, informados dessa obrigação, também o façam.
                                                <br /><br />
                                                A LIMPPAY não está autorizada a fornecer os dados cadastrados pelo USUÁRIO à terceiros, a não
                                                ser nas formas previstas neste instrumento e mediante seu expresso consentimento.
                                                É de competência exclusiva da Justiça e órgãos legais do território brasileiro requerer
                                                fundamentadamente a LIMPPAY o fornecimento de dados pessoais do USUÁRIO que comprovadamente
                                                desrespeitar os termos e condições presentes neste instrumento e as disposições legais
                                                aplicáveis à espécie, reservando-se a LIMPPAY no direito de fornecer à Justiça e órgãos legais
                                                competentes os dados pessoais do USUÁRIO, quando fundamentadamente requeridos.
                                                <br /><br />

                                                <b className="text-dark">14. DAS DISPOSIÇÕES GERAIS:</b>
                                                <br /><br />
                                                O USUÁRIO se obriga a manter atualizados seus dados cadastrais, bem como informar qualquer
                                                modificação verificada, especialmente seus dados de pagamento, bem como seu endereço de e-mail e
                                                telefone os quais serão os principais canais de comunicação entre a LIMPPAY e os USUÁRIOS.
                                                <br /><br />
                                                A LIMPPAY poderá alterar este instrumento a qualquer momento, bastando, para tanto, publicarmos
                                                uma versão revisada em nosso site. Por este motivo, recomendamos veementemente que sempre visite
                                                esta seção de nosso site, lendo, periodicamente. Mas, para contribuir com o bom relacionamento,
                                                também enviaremos um e-mail informando acerca dessas mudanças.
                                                <br /><br />
                                                O presente instrumento constitui o entendimento integral entre o USUÁRIO e a LIMPPAY e é regido
                                                pelas Leis Brasileiras, ficando eleito o foro da cidade de Manaus - AM, como único competente
                                                para dirimir questões decorrentes do presente instrumento, com renúncia expressa a qualquer
                                                outro foro, por mais privilegiado que seja.
                                                <br /><br />
                                                Manaus/AM, 27 de agosto de 2021.
                                                <br />
                                                LIMPPAY LTDA.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="bg-none shadow-none">
                    <Button className='bg-desSec text-white' onPress={onClose}>
                        Fechar
                    </Button>
                </ModalFooter>
            </>
        )}
    </ModalContent>
</Modal>

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
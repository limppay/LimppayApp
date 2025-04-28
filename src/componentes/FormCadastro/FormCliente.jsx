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
                                            TERMO DE ADESÃO DA PLATAFORMA LIMPPAY<br />
                                            Olá! Que bom contar com seu interesse em utilizar nossa plataforma! Antes de usar nossos serviços, tire um tempo para ler nossos Termos de Uso e Serviços e conhecer as regras que regem nossa relação com você. Abaixo esclareceremos alguns pontos que julgamos importantes.<br />
                                            A LIMPPAY LTDA é uma empresa registrada no CNPJ sob o n° 43.367.752/0001-06, e está estabelecida na cidade de Manaus/AM, na Tv. Rodrigo Otávio, n° 6488, Sala 02, Coroado, CEP 69080-007.<br />
                                            Caso persista alguma dúvida acerca de quaisquer pontos discutidos ou não neste documento, ou ainda, caso queira dar sugestões ou relatar problemas, por favor, não hesite em contatar-nos pelo endereço de e-mail: <a href="mailto:contato@limppay.com">contato@limppay.com</a>.<br /><br />

                                            <b className="text-dark">1. DA ADESÃO:</b><br /><br />
                                            Este instrumento regula as condições de uso dos serviços da PLATAFORMA. Ao fornecer dados a partir do sítio eletrônico da LIMPPAY, o USUÁRIO CLIENTE adere integralmente ao presente instrumento, entendendo e aceitando todas as condições a seguir estabelecidas.<br />
                                            Uma vez que cadastrado, o USUÁRIO CLIENTE poderá, a qualquer tempo, por meio de ferramenta oferecida no Website, revisar e alterar suas informações de cadastro.<br />
                                            A LIMPPAY conecta o USUÁRIO CLIENTE com os prestadores de serviços, facilitando o agendamento e o pagamento dos serviços contratados.<br />
                                            Caso o USUÁRIO CLIENTE NÃO CONCORDE com os termos previstos neste instrumento, basta não clicar na caixa que será disponibilizada ao final, onde o USUÁRIO CLIENTE declara expressamente estar de acordo com os termos de uso.<br /><br />

                                            <b className="text-dark">2. DAS DEFINIÇÕES:</b><br /><br />
                                            No presente instrumento, entendemos as expressões abaixo de acordo com as seguintes definições:<br />
                                            <b>CONTROLADOR:</b> pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais. A LIMPPAY atua como controladora ao tratar seus dados pessoais dos USUÁRIOS da plataforma.<br />
                                            <b>ENCARREGADO DE DADOS:</b> pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Autoridade Nacional de Proteção de Dados (ANPD).<br />
                                            Nosso encarregado de dados (DPO), Kellen Galeno, pode ser contatada por meio do e-mail: <a href="mailto:dpo@limppay.com">dpo@limppay.com</a><br />
                                            <b>FORNECEDORES DA PLATAFORMA:</b> empresas terceiras que prestam serviços e fornecem tecnologia, realizando o tratamento de dados pessoais em nome da plataforma. A plataforma utiliza os serviços da HOSTGATOR BRASIL LTDA (CNPJ 15.754.475/0001-40), AMAZON WEB SERVICE (CNPJ: 23.412.247/0001-10), CORA SOCIEDADE DE CREDITO, FINANCIAMENTO E INVESTIMENTO S.A. (CNPJ 37.880.206/0001-63), IUGU INSTITUIÇÃO DE PAGAMENTO S.A (CNPJ 15.111.975/0001-64), CYBERWEB NETWORKS LTDA (KINGHOST - CNPJ 05.305.671/0001-84), para as seguintes finalidades: i) hospedar os Serviços e conteúdo que processa na plataforma; (ii) prestar serviços de nuvem para a nossa plataforma; iii) meios de pagamentos e transações financeiras; (iv) servidor de e-mail.<br />
                                            Todos os fornecedores que atuam em nosso nome apenas tratam seus dados de acordo com nossas instruções, bem como as legislações de proteção de dados e quaisquer outras medidas de confidencialidade e segurança apropriadas.<br />
                                            <b>OPERADOR:</b> pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais, em nome do controlador. Entendemos como operadores os nossos fornecedores de serviços da plataforma.<br />
                                            <b>PLATAFORMA:</b> sistema constituído por uma aplicação web, oferecido por LIMPPAY e de propriedade, operação e responsabilidade da LIMPPAY, onde todos os USUÁRIOS podem visualizar e utilizar os serviços oferecidos pela LIMPPAY.<br />
                                            <b>SERVIÇOS:</b> Os Serviços oferecidos através da PLATAFORMA integram um portal de tecnologia que permite ao cliente (“USUÁRIO CLIENTE”) encontrar e contratar serviços de limpeza e outros oferecidos por um prestador de serviços autônomo (“USUÁRIO PRESTADOR”) cadastrado na PLATAFORMA. O USUÁRIO CLIENTE utiliza os serviços da LIMPPAY com o intuito de encontrar e contratar um USUÁRIO PRESTADOR. Em contrapartida, o USUÁRIO PRESTADOR utiliza os Serviços da LIMPPAY com o intuito de divulgar suas informações profissionais e ser encontrado e contratado pelo USUÁRIO CLIENTE. Os Serviços de informação na internet oferecidos pela LIMPPAY permitem a realização da referida busca e contratação por meio eletrônico, uma vez que os serviços da LIMPPAY facilitam a relação desejada entre o USUÁRIO CLIENTE e o PRESTADOR.<br />
                                            <b>TITULAR DE DADOS:</b> pessoa natural a quem se referem os dados pessoais que são objeto de tratamento. O USUÁRIO CLIENTE é um titular de dados.<br />
                                            <b>TRATAMENTO DE DADOS:</b> Toda operação realizada pela LIMPPAY com os dados pessoais do USUÁRIO CLIENTE, como as que se referem a coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração.<br />
                                            <b>USUÁRIOS:</b> ao ser utilizada essa terminologia entende-se que se referirão ao USUÁRIO CLIENTE e o PRESTADOR.<br />
                                            <b>USUÁRIO CLIENTE:</b> pessoa física ou jurídica cadastrada na PLATAFORMA, que acesse e/ou utilize os serviços ofertados pelos USUÁRIO PRESTADOR na PLATAFORMA.<br />
                                            <b>USUÁRIO PRESTADOR:</b> pessoa física ou jurídica cadastrada na PLATAFORMA, que no uso desta irá ofertar os seus serviços ao USUÁRIO CLIENTE, bem como fará uso de seu Aplicativo Específico para gestão de seus serviços.<br /><br />

                                            <b className="text-dark">3. DAS CONDIÇÕES GERAIS DE USO:</b><br /><br />
                                            A LIMPPAY é uma empresa privada, que oferece uma PLATAFORMA constituída por uma aplicação web disponível no site <a href="http://limppay.com" target="_blank">limppay.com</a>, que aproxima os USUÁRIOS. Nela os USUÁRIOS CLIENTES consentem em informar a sua localidade, escolher o tipo de diária para limpeza de acordo com o tipo de imóvel, observando sempre as recomendações durante a prestação de serviço, a fim de ter a melhor experiência de limpeza.<br />
                                            Na relação entre USUÁRIO CLIENTE e a LIMPPAY, está reserva-se ao direito de estabelecer, remover e/ou revisar o Preço relativo a todos os serviços de limpeza e cuidados em geral obtidos por meio do uso da PLATAFORMA e dos Serviços a qualquer momento, a critério exclusivo da LIMPPAY.<br />
                                            Ademais, poderá haver variação de preço aplicável em certas áreas geográficas quando a oferta de mão-de-obra for menor do que a demanda por limpezas e cuidados em geral.<br />
                                            O tipo de diária escolhido pelo USUÁRIO CLIENTE é de responsabilidade exclusivamente do mesmo, e as recomendações por parte da LIMPPAY ao USUÁRIO CLIENTE é meramente uma SUGESTÃO com base em históricos anteriores. A LIMPPAY não tem nenhuma responsabilidade pela insuficiência de tempo ou incompletude dos dados disponibilizados. Caso a insuficiência de tempo ou incompletude dos dados fornecidos pelo USUÁRIO CLIENTE impossibilite que o prestador conclua todo o serviço de limpeza desejado dentro do tipo de diária escolhida, o USUÁRIO CLIENTE assume a culpa exclusiva pela não conclusão do serviço desejado dentro do tipo de diária escolhida, isentando nestes casos a LIMPPAY e o PRESTADOR de toda e qualquer responsabilidades.<br />
                                            A LIMPPAY não detém nenhuma relação trabalhista com os PRESTADORES cadastrados, não sendo possível imputar à LIMPPAY a responsabilidade por qualquer dano causado aos USUÁRIOS CLIENTES ou a terceiros, por atos oriundos dos PRESTADORES no momento da execução dos serviços intermediados por meio da PLATAFORMA.<br />
                                            Ainda, a LIMPPAY não pode ser responsabilizada por serviços realizados entre os PRESTADORES da PLATAFORMA acertados diretamente com os USUÁRIOS CLIENTES, de forma que a LIMPPAY orienta que aos USUÁRIOS CLIENTES não troquem informações pessoais de telefone com fito de contratar os serviços além da PLATAFORMA.<br />
                                            A LIMPPAY aconselha que os serviços contratados sejam realizados por meio da PLATAFORMA disponibilizada pela LIMPPAY, de forma que esta mantenha em sua base de PRESTADORES apenas pessoas qualificadas, gerando maior credibilidade e segurança para os USUÁRIOS CLIENTES.<br />
                                            É de responsabilidade dos USUÁRIO CLIENTE terem e manterem equipamentos e estruturas que respeitem os requisitos mínimos para a utilização dos serviços oferecidos pela LIMPPAY.<br /><br />

                                            <b className="text-dark">4. DO CADASTRO:</b><br /><br />
                                            Os serviços oferecidos pela LIMPPAY estão disponíveis para pessoas físicas absolutamente capazes e pessoas jurídicas devidamente inscritas no CNPJ.<br />
                                            Para os USUÁRIOS CLIENTES, pessoa física, realizarem o seu cadastro na PLATAFORMA, eles fornecerão à LIMPPAY os seguintes dados: Nome, sobrenome, CPF, telefone celular, endereço completo do local onde o serviço será prestado (Rua, número, complemento, bairro, cidade e CEP), endereço de e-mail e farão o cadastro de uma senha para acesso.<br />
                                            Já para os USUÁRIOS CLIENTES, pessoa jurídica, para a realização do cadastro na PLATAFORMA, devem fornecer à LIMPPAY os seguintes dados: CNPJ, nome fantasia, razão social, endereço de e-mail, endereço completo (Rua, número, complemento, bairro, cidade e CEP), telefone celular e farão o cadastro de uma senha para acesso.<br />
                                            Ao entender os termos do presente instrumento, os USUÁRIOS CLIENTES declaram expressamente estar cientes que a coleta dos seus dados é primordial para o bom funcionamento da PLATAFORMA, e que serão utilizados respeitando as normas previstas na Lei Geral de Proteção de Dados.<br />
                                            É expressamente vedada a criação de mais de um cadastro por USUÁRIO CLIENTE na PLATAFORMA. Em caso de multiplicidade de cadastros elaborados por um só USUÁRIO, a LIMPPAY se reserva o direito de, ao seu exclusivo critério, sem contrapartida indenizatória e sem necessidade de prévia anuência ou comunicação, inabilitar todos os cadastros existentes em nome deste USUÁRIO, podendo não aceitar novo cadastro do referido USUÁRIO na PLATAFORMA.<br />
                                            É necessário o preenchimento completo de todos os dados solicitados pela PLATAFORMA no momento do cadastramento, para que os USUÁRIOS estejam habilitados a utilizar a PLATAFORMA.<br />
                                            É de exclusiva responsabilidade dos USUÁRIOS fornecer, atualizar e garantir a veracidade dos dados cadastrais, não recaindo à LIMPPAY qualquer tipo de responsabilidade civil e criminal resultante de dados inverídicos, incorretos ou incompletos fornecidos pelos USUÁRIOS.<br />
                                            Sendo permitido aos USUÁRIOS requisitar à LIMPPAY, a correção de dados incompletos, inexatos ou desatualizados, mediante fornecimento pelos USUÁRIOS.<br />
                                            A LIMPPAY se reserva o direito de utilizar todos os meios válidos e possíveis para identificar seus USUÁRIOS, bem como de solicitar dados adicionais e documentos que estime serem pertinentes a fim de conferir os dados informados. Neste caso, o uso da PLATAFORMA pelo USUÁRIO fica condicionado ao envio dos documentos e dos dados eventualmente solicitados.<br />
                                            A solicitação de dados adicionais será para atender finalidade específica, informada previamente ao titular.<br />
                                            O USUÁRIO acessará a sua conta na PLATAFORMA por meio de login e senha, comprometendo-se a não informar a terceiros estes dados, responsabilizando-se integralmente pelo uso que deles será feito.<br />
                                            O USUÁRIO CLIENTE poderá ter acesso às informações coletadas e tratadas pela LIMPPAY, de forma gratuita, através do link (<a href="https://limppay.com/login-cliente" target="_blank">https://limppay.com/login-cliente</a>) ou através da sua conta na Plataforma, podendo editá-las a qualquer tempo.<br />
                                            O USUÁRIO CLIENTE compromete-se a notificar a LIMPPAY imediatamente, por meio dos canais de contato mantidos pela LIMPPAY na PLATAFORMA, a respeito de qualquer uso não autorizado de sua conta. O USUÁRIO CLIENTE será o único responsável pelas operações efetuadas em sua conta, uma vez que o acesso só será possível mediante a utilização de senha pessoal de seu exclusivo conhecimento.<br />
                                            O USUÁRIO CLIENTE compromete-se a notificar a LIMPPAY imediatamente, por meio dos canais de contato mantidos pela LIMPPAY na PLATAFORMA, a respeito de qualquer conhecimento de irregularidades de outros USUÁRIOS que possam ocasionar danos aos próprios USUÁRIOS da PLATAFORMA, a esta, a LIMPPAY ou a terceiros.<br />
                                            Em nenhuma hipótese será permitida a cessão, a venda, o aluguel ou outra forma de transferência da conta do USUÁRIO CLIENTE.<br />
                                            Ao seu exclusivo critério a LIMPPAY poderá excluir, inabilitar, suspender, bloquear, por tempo indeterminado, sem aviso prévio ou contrapartida indenizatória, cadastros de USUÁRIOS CLIENTES que sejam considerados ofensivos, que infrinjam os termos deste instrumento ou a legislação em vigor.<br />
                                            A LIMPPAY se reserva ao direito de não permitir novo cadastro de USUÁRIOS que já tenham sido cancelados, inabilitados, bloqueados, excluídos ou suspensos da PLATAFORMA. Não se permitirá, ainda, a criação de novos cadastros por pessoas cujos cadastros originais tenham sido cancelados, bloqueados, inabilitados, excluídos ou suspensos por infrações às políticas da LIMPPAY ou a legislação vigente.<br />
                                            A LIMPPAY se reserva o direito de, unilateralmente, sem prévio aviso, anuência ou contrapartida indenizatória, recusar qualquer solicitação de cadastro de um USUÁRIO na PLATAFORMA, bem como cancelar, inabilitar, bloquear, excluir ou suspender o uso de um cadastro previamente aceito.<br />
                                            Para se cadastrar como USUÁRIO CLIENTE na PLATAFORMA, o mesmo deve preencher o formulário solicitado em (<a href="https://limppay.com/cadastro-cliente" target="_blank">https://limppay.com/cadastro-cliente</a>).<br /><br />

                                            <b className="text-dark">5. DAS FUNCIONALIDADES:</b><br /><br />
                                            Após a realização de cadastro pelo USUÁRIO CLIENTE, a PLATAFORMA disponibiliza formulário de agendamento de serviços a ser preenchida por este, onde serão informados o local do serviço, o horário, a data e as características dos serviços de que necessita, podendo ser mais de uma.<br />
                                            O USUÁRIO CLIENTE poderá escolher a melhor data para o seu serviço, ou ainda, dias alternativos disponibilizados pelo PRESTADOR, assim como o horário de início da execução do serviço pelo PRESTADOR, a qual terá o limite diário de 1h (uma hora) e máximo de 8h (oito horas) de duração, podendo ser realizada entre as 7h e 20h de acordo com sua necessidade informada na PLATAFORMA e desde que haja PRESTADOR disponível.<br />
                                            A PLATAFORMA irá sugerir PRESTADOR de acordo com a localidade do USUÁRIO CLIENTE, podendo ele escolher o profissional autônomo pesquisando pelo nome do PRESTADOR, ou a partir das avaliações anteriores de limpezas realizadas pelo mesmo.<br />
                                            Após o preenchimento do formulário e a confirmação do agendamento do serviço na PLATAFORMA pelo USUÁRIO CLIENTE, o mesmo receberá em seu e-mail cadastrado a confirmação do seu pedido.<br />
                                            Os agendamentos devidamente pagos pelo USUÁRIO CLIENTE realizado entre às 7h e as 16h permitem o agendamento dos serviços para o mesmo dia, desde que iniciem 2 (duas) horas após a efetivação da compra na PLATAFORMA, e que haja PRESTADOR disponível. Fora deste prazo, o USUÁRIO CLIENTE só poderá agendar limpezas para o próximo dia a partir das 7h da manhã.<br />
                                            O USUÁRIO CLIENTE poderá solicitar a escolha com o mesmo PRESTADOR o qual tenha gostado da prestação do serviço por meio da busca do nome do mesmo no fluxo de escolha dentro da PLATAFORMA.<br />
                                            Os equipamentos, itens e produtos de limpeza que serão utilizados pelo PRESTADOR, deverão ser disponibilizados pelo USUÁRIO CLIENTE, de acordo com sua preferência.<br />
                                            Ao final de cada limpeza, tanto o USUÁRIO CLIENTE, como o PRESTADOR poderão avaliar um ao outro mutuamente na PLATAFORMA, sobre o serviço realizado, podendo conferir uma nota de 0 a 5, sendo esta avaliação pública para todos os outros USUÁRIOS CLIENTES da PLATAFORMA. Quando da avaliação, elas serão publicadas na PLATAFORMA sem a identificação de quem procedeu a avaliação.<br />
                                            No uso das funcionalidades da PLATAFORMA, o USUÁRIO CLIENTE compreende que não é permitido: (i) usar linguajar de baixo calão, ofensivo ou com sentido dúbio; (ii) realizar comentários difamatórios, contra qualquer pessoa física (viva ou falecida) ou jurídica; (iii) realizar comentários ou publicar imagens que possam infringir direitos de terceiros, sejam contrários à moral e aos bons costumes, que incitem a violência, o ódio, o sexismo, o racismo, que façam alusão a pornografia, pedofilia, armas, drogas e demais conteúdos perturbadores ou ilegais; (iv) enviar ou solicitar dados pessoais, tais como, mas não se limitando a: e-mail, telefone, perfil do Facebook, perfil do Instagram, contato no WhatsApp, links diversos, informações de conta bancária, informações de documentos pessoais ou qualquer outro meio de comunicação pessoal; (v) fazer menção à alguma plataforma concorrente ou combinar o fechamento do negócio por outro meio diverso da PLATAFORMA; (vi) publicar imagens contendo dados pessoais como telefones de contato, e-mail, localização do local de prestação de serviço, etc.<br />
                                            A LIMPPAY também realiza junto ao USUÁRIO CLIENTE, via e-mail e/ou Whatsapp e/ou link de avaliação do google, pesquisas de conhecimento/satisfação, relacionadas aos serviços do aplicativo, da própria LIMPPAY ou para avaliação das amostras de parceiros enviadas em benefício do próprio USUÁRIO.<br />
                                            A LIMPPAY procederá com o monitoramento e publicação das avaliações realizadas pelos USUÁRIOS, buscando manter na PLATAFORMA USUÁRIOS CLIENTES e PRESTADORES qualificados. A LIMPPAY poderá, a seu exclusivo critério, criar códigos promocionais que poderão ser resgatados para crédito na conta da plataforma ou outras características ou benefícios para os USUÁRIOS CLIENTES. Caso realizadas, essas promoções têm caráter temporário, transitório e não vinculante.<br />
                                            O USUÁRIO CLIENTE compreende que os códigos promocionais: (i) devem ser usados de forma legal para a finalidade e o público a que se destinam; (ii) poderão ser desabilitados pela LIMPPAY a qualquer momento por motivos legalmente legítimos, sem que isto resulte qualquer responsabilidade; (iii) somente poderão ser usados de acordo com as condições específicas que a LIMPPAY estabelecer para esse Código Promocional; (iv) não são válidos como dinheiro; e (v) poderão expirar antes de serem usados.<br />
                                            A LIMPPAY se reserva no direito de reter ou deduzir créditos ou outras funcionalidades ou vantagens obtidas por meio do uso dos Códigos Promocionais pelo USUÁRIO CLIENTE, caso apure que o uso ou resgate do Código Promocional foi feito com erro, fraude, ilegalidade ou violação às condições do respectivo Código Promocional.<br /><br />

                                            <b className="text-dark">6. DAS OBRIGAÇÕES DO USUÁRIO CLIENTE:</b><br /><br />
                                            O USUÁRIO CLIENTE compreende que é de sua responsabilidade, assim como de seu representante caso o informe na PLATAFORMA, de estar presente na data e local agendada com o PRESTADOR para a execução do serviço, declarando estar ciente de que a PLATAFORMA não tem nenhum vínculo com o PRESTADOR.<br />
                                            O USUÁRIO CLIENTE compreende que deve agendar limpezas em horários em que possa aguardar por até 15 (quinze) minutos a mais no início e/ou no fim da prestação de serviço, para eventuais atrasos (e compensações de atrasos) por parte do PRESTADOR.<br />
                                            O USUÁRIO CLIENTE compreende que não é preciso estar no local durante todo o tempo da execução do serviço pelo PRESTADOR, devendo, para isto, avisar a sua ausência no formulário de agendamento do serviço na PLATAFORMA.<br />
                                            O USUÁRIO CLIENTE compreende que, caso precise se ausentar do local durante a limpeza, deverá deixar ao menos uma saída aberta para o PRESTADOR, para que ele possa sair em caso de emergência.<br />
                                            O USUÁRIO CLIENTE compreende que é o único responsável pelo acompanhamento do desenvolvimento dos serviços a serem prestados pelos PRESTADORES.<br />
                                            O PRESTADOR é o único responsável por qualquer dano ocasionado ao USUARIO CLIENTE ou a terceiros, pelos serviços que, porventura, mesmo que constatado para a realização, através da PLATAFORMA, deixe de prestar ou que seja prestado em desacordo com o que fora acordado entre as partes.<br /><br />

                                            <b className="text-dark">7. VALORES DOS SERVIÇOS:</b><br /><br />
                                            O valor a ser pago pelo USUÁRIO CLIENTE serão fixados pela LIMPPAY de acordo com o serviço e quantidade de horas adquiridos, disponibilizada no ambiente do USUÁRIO CLIENTE na PLATAFORMA.<br />
                                            O pagamento do serviço contratado deverá ser pago previamente. Será enviado via e-mail ao USUÁRIO CLIENTE nota fiscal correspondente ao pagamento do serviço contratado no prazo de até 30 dias após a realização do serviço.<br />
                                            Caso o USUÁRIO CLIENTE adquira um certo número de horas para um agendamento e não as utilize por completo, não poderá fracionar a diária ou solicitar devolução da diferença. A quantidade de horas/valor de cada pacote não pode ser alterado.<br />
                                            Só haverá reembolso de valores, caso o PRESTADOR cancele e o USUÁRIO CLIENTE não esteja de acordo com a substituição do PRESTADOR por outro ou da data de prestação de serviço.<br />
                                            Para o pagamento dos serviços solicitados na PLATAFORMA, o USUÁRIO CLIENTE tem disponível os seguintes métodos pagamento:<br />
                                            <ul>
                                                <li>Cartão de Crédito VISA;</li>
                                                <li>Cartão de Crédito MASTERCARD;</li>
                                                <li>Cartão de Crédito AMERICAN EXPRESS;</li>
                                                <li>Cartão de Crédito HIPERCARD;</li>
                                                <li>Cartão de Crédito ELO;</li>
                                                <li>Cartão de Crédito DINERS;</li>
                                                <li>Boleto Bancário;</li>
                                                <li>PIX</li>
                                            </ul>
                                            Para utilizar o pagamento por meio de boleto bancário, o USUÁRIO CLIENTE compreende que o agendamento do serviço de limpeza deve ser feito pelo ATENDIMENTO com pelo menos 2 (dois) dias úteis de antecedência à data escolhida.<br />
                                            Para processar os pagamentos através de cartão de crédito, será necessário que o USUÁRIO CLIENTE cadastre na PLATAFORMA os seguintes dados do cartão escolhido:<br />
                                            <ul>
                                                <li>Nome do titular do Cartão de Crédito;</li>
                                                <li>CPF do titular do Cartão de Crédito;</li>
                                                <li>Data de nascimento do titular do Cartão de Crédito;</li>
                                                <li>Número do Cartão de Crédito;</li>
                                                <li>Número de Telefone do titular;</li>
                                                <li>Vencimento do Cartão de Crédito (Mês e Ano);</li>
                                                <li>Número de segurança do Cartão de Crédito.</li>
                                            </ul>
                                            Caso o USUÁRIO CLIENTE efetue o pagamento utilizando um cartão de crédito, receberá um e-mail confirmando o seu pagamento. Em caso de recusa do pagamento, o USUÁRIO CLIENTE será imediatamente informado, na própria tela de pagamento. Em caso de recusa, se o USUÁRIO CLIENTE ainda estiver dentro do tempo máximo para pagamento, o USUÁRIO CLIENTE poderá tentar utilizar um outro cartão de crédito ou corrigir os dados. Em não estando mais dentro do tempo máximo para pagamento, o agendamento dos serviços será cancelado, podendo o USUÁRIO CLIENTE realizar um novo agendamento ou entrar em contato com o suporte da LIMPPAY, através do e-mail <a href="mailto:contato@limppay.com">contato@limppay.com</a>.<br />
                                            Os pagamentos realizados por meio da plataforma LIMPPAY são processados pela IUGU INSTITUIÇÃO DE PAGAMENTO S.A., sendo obrigatório que todos os USUÁRIOS leiam e aceitem os Termos de Uso e Serviços da IUGU.<br />
                                            A contratação de qualquer PRESTADOR, feita pelo USUÁRIO CLIENTE com pagamento via cartão de crédito, implica a aceitação expressa das condições previstas neste instrumento e nos termos específicos da plataforma IUGU.<br />
                                            Qualquer contestação de pagamentos efetuados por meio da IUGU deverá ser tratada entre o USUÁRIO e a LIMPPAY.<br />
                                            A IUGU não cobra taxas adicionais pela sua utilização como intermediadora dos pagamentos.<br />
                                            Para fins de processamento das transações, os dados de pagamento fornecidos pelo USUÁRIO CLIENTE poderão ser armazenados na base de dados da IUGU, conforme os parâmetros estabelecidos em sua política de privacidade e segurança da informação.<br />
                                            A IUGU possui certificação de conformidade com o PCI DSS (Payment Card Industry Data Security Standard), garantindo que os dados sensíveis sejam criptografados, transmitidos e armazenados com os mais altos padrões de segurança.<br />
                                            O USUÁRIO poderá optar, por não autorizar o armazenamento de seus dados para transações futuras. Caso deseje a exclusão dos dados já armazenados, poderá solicitá-la diretamente à IUGU, por meio do formulário disponível em seu site de suporte.<br />
                                            Em conformidade com a Lei Geral de Proteção de Dados (LGPD), a IUGU poderá reter determinados dados apenas quando estritamente necessário para o cumprimento de obrigações legais ou regulatórias.<br />
                                            A LIMPPAY compromete-se a excluir de sua própria base os dados do USUÁRIO sempre que houver solicitação expressa. Adicionalmente, o USUÁRIO poderá, a qualquer momento, excluir sua conta e os dados pessoais vinculados por meio dos canais disponibilizados pela LIMPPAY, sem a necessidade de autorização prévia ou solicitação intermediária.<br /><br />

                                            <b className="text-dark">8. DOS AGENDAMENTOS:</b><br /><br />
                                            O USUÁRIO CLIENTE, na PLATAFORMA preencher o local, o horário, a data e as características dos serviços de que necessita, podendo ser mais de 01 (um) prestador.<br />
                                            O USUÁRIO CLIENTE poderá escolher a melhor data para a prestação de serviço, ou ainda, dias alternativos disponibilizados pelo PRESTADOR, assim como o horário de início dos serviços, a qual terá o limite diário de 1 (uma) a 8 (oito) horas de duração, podendo ser entre as 7h e 20h de acordo com sua necessidade informada na PLATAFORMA e desde que haja PRESTADOR disponível.<br />
                                            Os agendamentos realizados pelo USUÁRIO CLIENTE entre às 7h e às 16h podem ser agendadas para o mesmo dia, desde que iniciem 2 (duas) horas após a efetivação da compra na PLATAFORMA, desde que haja PRESTADOR disponível. Fora deste prazo, o USUÁRIO CLIENTE só poderá agendar serviços para o próximo dia a partir das 7h da manhã.<br />
                                            O PRESTADOR tem tolerância de até 15 (quinze) minutos para dar início a prestação de serviço de acordo com o horário agendado pelo USUÁRIO CLIENTE, devendo compensar o eventual atraso (inferiores a 15 (quinze) minutos), ao final do horário agendado.<br />
                                            O PRESTADOR, por meio do aplicativo da LIMPPAY deve cadastrar o início e término dos serviços.<br />
                                            Caso o PRESTADOR não tenha acesso a internet, deve solicitar ao USUÁRIO CLIENTE que registre o início e término do serviço no aplicativo, sendo que a LIMPPAY entrará em contato para confirmar a informação.<br /><br />

                                            <b className="text-dark">8.1. CANCELAMENTO DO AGENDAMENTO:</b><br /><br />
                                            Os cancelamentos dos agendamentos devem ser informados pelo USUÁRIO CLIENTE a LIMPPAY, por meio de telefone, e-mail ou WhatsApp, até às 16h do dia anterior a data da prestação do serviço.<br />
                                            Caso o prazo não seja respeitado pelo USUÁRIO CLIENTE, será cobrada uma taxa de cancelamento de 25% do valor do serviço contratado na PLATAFORMA.<br />
                                            Caso o cancelamento ocorra por parte do PRESTADOR, o USUÁRIO CLIENTE será avisado pela LIMPPAY, tendo as seguintes alternativas: substituir o PRESTADOR, agendar nova data ou pedir reembolso do valor pago.<br /><br />

                                            <b className="text-dark">9. CANCELAMENTO DO CADASTRO NA PLATAFORMA:</b><br /><br />
                                            A LIMPPAY se reserva ao direito de efetuar o cancelamento de contas dos USUÁRIO CLIENTE inativo, por período igual ou maior que 01 (um) ano.<br />
                                            Após o cancelamento da conta do USUÁRIO CLIENTE, a LIMPPAY se reserva ao direito de excluir todos os seus dados no curso normal de operação. Seus dados não poderão ser recuperados após o cancelamento de sua conta.<br />
                                            A LIMPPAY poderá manter e tratar os dados pessoais do USUÁRIO CLIENTE por até 05 anos após a realização do último agendamento.<br />
                                            Dados pessoais anonimizados, sem possibilidade de associação ao indivíduo, poderão ser mantidos por período indefinido.<br />
                                            O USUÁRIO CLIENTE poderá solicitar à LIMPPAY, a qualquer momento, que sejam eliminados os dados pessoais não anonimizados, sendo que o pedido pode não ser atendido nos casos em que a Lei 13.709/2018 (LGPD), permitir outro tratamento.<br />
                                            O USUÁRIO fica ciente de que poderá ser inviável à LIMPPAY continuar o fornecimento de produtos ou serviços a partir do pedido de eliminação dos dados pessoais.<br />
                                            Ainda, os dados pessoais dos USUÁRIOS apenas podem be conservados após o término de seu tratamento nas seguintes hipóteses previstas no artigo 16 da Lei 13.709/2018 (LGPD): i) cumprimento de obrigação legal ou regulatória pelo controlador; ii) estudo por órgão de pesquisa, garantida, sempre que possível, a anonimização dos dados pessoais; e iii) transferência a terceiro, desde que respeitados os requisitos de tratamento de dados dispostos na Lei.<br /><br />

                                            <b className="text-dark">10. AÇÕES DE MARKETING:</b><br /><br />
                                            A LIMPPAY se reserva ao direito de efetuar ações de marketing com as avaliações/comentário do USUÁRIO CLIENTE postadas na PLATAFORMA, não divulgando dados pessoais de pessoa física, salvo consentimento expresso da mesma.<br /><br />

                                            <b className="text-dark">11. SUPORTE TÉCNICO:</b><br /><br />
                                            A LIMPPAY prestará suporte aos USUÁRIOS da PLATAFORMA nos seguintes horários: De segunda à sexta, das 08h00 até às 18h, e nos sábados, das 8h ao 12h (exceto feriados), através dos telefones informados no website (<a href="http://limppay.com" target="_blank">limppay.com</a>), e e-mail <a href="mailto:contato@limppay.com">contato@limppay.com</a>. Nas solicitações de suporte via e-mail, a LIMPPAY terá até 72 (setenta e duas) horas úteis para proceder à resposta.<br /><br />

                                            <b className="text-dark">12. DA POLÍTICA DE PRIVACIDADE:</b><br /><br />
                                            Os USUÁRIOS têm ciência e concordam que as informações cadastradas na PLATAFORMA sejam publicadas e/ou fornecidas de acordo com o previsto neste instrumento.<br />
                                            Os USUÁRIOS têm ciência e concordam que:<br />
                                            <ul>
                                                <li>Qualquer informação fornecida seja guardada numa base de dados controlada pela LIMPPAY;</li>
                                                <li>Essa base de dados é armazenada em servidores AWS (Amazon Web Services) que ficam localizados fora do Brasil. O motivo da escolha da LIMPPAY por esse fornecedor é que eles estão em os 3 maiores do mundo nesse segmento e possuem os seguintes itens de segurança: PCI-DSS, HIPAA/HITECH, FedRAMP, GDPR, FIPS 140-2 e NIST 800-171, além de criptografia, proteção de rede, autenticação multifatorial, proteção de aplicações (AWS Shield, serviço que protege contra ataques DDoS).</li>
                                                <li>O site da LIMPPAY está hospedado em prestador de serviço chamado Hostgator, que possui os seguintes itens de segurança: Proteção BitNinja (anti-malware, firewall e detecção de DDoS), criptografia de banco de dados, criptografia SSL, Proteção de nameservers da Cloudflare, autenticação de dois fatores, registro de atividade da conta, módulos de segurança avançado (como o mod_security e o módulo PHP, que interceptam solicitações maliciosas), monitoramento contínuo de sistemas e servidores e Certificado SSL.</li>
                                                <li>Os servidores de e-mail da LIMPPAY são administrados por prestador de serviço chamado KingHost, que possui os seguintes itens de segurança: antivírus, Firewall de Aplicativos Web (WAF), criptografia SSL.</li>
                                            </ul>
                                            Ainda que utilizando infraestrutura computacional administrada por terceiros, a LIMPPAY não autoriza o uso das informações do USUÁRIO CLIENTE para fins diversos do objeto contratual.<br />
                                            O código-fonte, a marca, os elementos técnicos, de design, de processos, relatórios, e outros que ajudam a caracterizar a PLATAFORMA são de propriedade exclusiva da LIMPPAY e não devem ser usados ou modificados pelo USUÁRIO de nenhuma forma que não seja previamente autorizada por escrito pela LIMPPAY.<br />
                                            O USUÁRIO CLIENTE concorda que não vai fazer, tentar fazer, ou ajudar alguém a fazer nenhum tipo de engenharia reversa ou tentativa de acesso ao código fonte e estrutura do banco de dados, em relação a PLATAFORMA. Os comentários e sugestões dos USUÁRIOS são muito bem-vindos e podem gerar inovações ou implementações que podem ser incorporadas à PLATAFORMA, mas isso não dará ao USUÁRIO nenhuma espécie de direito sobre elas. O USUÁRIO não tem e não terá nenhuma propriedade, titularidade ou participação direta ou indireta na PLATAFORMA ou na LIMPPAY.<br />
                                            A LIMPPAY coleta dados pessoais com a finalidade de prestar seus serviços. Somos comprometidos a preservar a privacidade e segurança de nossos usuários, com tal processamento de dados sendo feito em estrita conformidade às leis e regulamentos aplicáveis, em particular com a Lei Geral de Proteção de Dados (LGPD).<br />
                                            É reservado o direito da LIMPPAY em fornecer os dados e informações do USUÁRIO, bem como de todo o sistema utilizado na PLATAFORMA, para sua equipe técnica, podendo ser formada por funcionários da LIMPPAY e/ou por empresa terceirizada, nos quais serão responsáveis por administrar a segurança e confiabilidade da PLATAFORMA e dos dados dos USUÁRIOS.<br />
                                            Todos os integrantes da equipe técnica, sejam funcionários ou empresa terceirizada, firmarão termo de confidencialidade, declarando que se obrigam a manter sob absoluto sigilo todas as informações comerciais, contábeis, administrativas, tecnológicas, infra estruturais, técnicas, ou seja, quaisquer dados revelados mutuamente em decorrência da manutenção do funcionamento e segurança da PLATAFORMA, abstendo-se de utilizá-las em proveito próprio ou de terceiros, comprometendo-se a zelar para que seus sócios, funcionários com vínculo empregatício e terceiros de sua confiança, informados dessa obrigação, também o façam.<br />
                                            A LIMPPAY não está autorizada a fornecer os dados cadastrados pelo USUÁRIO à terceiros, salvo:<br />
                                            <ul>
                                                <li>Com autoridades judiciais, administrativas ou governamentais competentes, sempre que houver determinação legal, requerimento, requisição ou ordem nesse sentido;</li>
                                                <li>Com as empresas e áreas de negócios da LIMPPAY, as quais estão de acordo com este Termo;</li>
                                                <li>Com prestadores de serviço ou empresas parceiras, para facilitar, prover ou executar atividades relacionadas aos Nossos Ambientes;</li>
                                            </ul>
                                            <br />

                                            <b className="text-dark">13. DAS DISPOSIÇÕES GERAIS:</b><br /><br />
                                            O USUÁRIO CLIENTE se obriga a manter atualizados seus dados cadastrais, bem como informar qualquer modificação verificada, especialmente seus dados de pagamento, bem como seu endereço de e-mail e telefone os quais serão os principais canais de comunicação entre a LIMPPAY e os USUÁRIOS.<br />
                                            A LIMPPAY poderá alterar este instrumento a qualquer momento, bastando, para tanto, publicar uma versão revisada no site. Por este motivo, recomenda-se veementemente que sempre visite esta seção, lendo-a, periodicamente. Mas, para contribuir com o bom relacionamento, também o USUÁRIO receberá um e-mail informando acerca dessas mudanças.<br />
                                            O presente instrumento constitui o entendimento integral entre o USUÁRIO e a LIMPPAY e é regido pelas Leis Brasileiras, ficando eleito o foro da cidade de Manaus - AM, como único competente para dirimir questões decorrentes do presente instrumento, com renúncia expressa a qualquer outro foro, por mais privilegiado que seja.<br /><br />
                                            Versão 02, Manaus, 04 de abril de 2025<br />
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
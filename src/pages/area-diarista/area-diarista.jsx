import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HeaderApp, Logo, Footer, ModalQuemSomos, ModalDuvidas} from '../../componentes/imports.jsx'
import User from "../../assets/img/diarista-cadastro/user.png"
import EditUserModal from './EditUserModal.jsx';
import LoadingSpinner from '../../componentes/FormCadastro/Loading.jsx';
import { Avatar, Button, ScrollShadow, Spinner, Tooltip } from '@nextui-org/react';

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { CreateStepTwo } from '../../services/api.js';
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter} from "@nextui-org/modal";
import {Progress} from "@nextui-org/progress";
import ProgressBar from './ProgressBar.jsx';

const AreaDiarista = () => {
    const [userInfo, setUserInfo] = useState(null);
    const[Open, SetOpen] = useState(false)
    const userId = localStorage.getItem('prestadorId'); // Obter o ID do usuário do localStorage
    const token = localStorage.getItem('token_prestador'); // Obter o token do localStorage
    // Recuperar as URLs e converter para objeto JSON
    const [urls, setUrls] = useState(JSON.parse(localStorage.getItem('urls_prestador')) || {}); // Atualize o estado URLs aqui

    const [OpenWho, SetOpenWho] = useState(false)
    const [OpenDuvidas, SetOpenDuvidas] = useState(false)

    const [cadastroCompleto, setCadastroCompleto] = useState()
    const [entrevistaAprovada, setEntrevistaAprovada] = useState()
    const [etapaCadastro, setEtapaCadastro] = useState()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [openSucess, setOpenSucess] = useState(false)


    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`https://limppay-api-production.up.railway.app/users/${userId}`, {
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


    useEffect(() => {
        console.log("Informações do usuário atualizadas:", userInfo);
    }, [userInfo]); // Isso vai logar as informações do usuário toda vez que mudarem
    

    const handleUserUpdated = (updatedInfo) => {
        setUserInfo(updatedInfo.updatedUser)
        // Atualize as URLs aqui também
        const newUrls = updatedInfo.urls; // Supondo que a resposta inclui as novas URLs
        localStorage.setItem('urls', JSON.stringify(newUrls));
        setUrls(newUrls); // Atualiza o estado com as novas URLs

    };

    const presignedUrls = urls || {};
  
    const getArquivoUrl = (tipo) => {
        // Encontra o arquivo com a chave que inclui o tipo especificado
        return Object.entries(presignedUrls).find(([key]) => key.includes(tipo))?.[1] || null;
    };
    
    // Selecionar os arquivos dinamicamente
    const avatarUrl = getArquivoUrl('arquivoFoto');
    
    const arquivoIdentidade = getArquivoUrl('arquivodt');
    const arquivoCPF = getArquivoUrl('arquivoCpf');
    const arquivoResidencia = getArquivoUrl('arquivoResidencia');
    const arquivoCurriculo = getArquivoUrl('arquivoCurriculo');
    
    const buttons = [
        {
            link: "#", 
            text: "Dúvidas", 
            OnClick: () => SetOpenDuvidas(true)
        },
        {
            link: "#", 
            text: "Quem Somos", 
            Id: "OpenQuemSomos",
            OnClick: () => SetOpenWho(true)
        },
    ]

    const btnAcess = [
        {
            AcessPrim: "Suporte", 
            AcessSec: "Sair", 
            LinkPrim: "/",
            LinkSec: "/",
        }
    ]

    const calcularIdade = (data) =>{
        const hoje = new Date();
        const nascimento = new Date(data);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();

        if(mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())){
            idade--;
        }

        return idade;
    };


    useEffect(() => {
        const cadastro = userInfo?.cadastroCompleto
        const entrevista = userInfo?.entrevistaAprovada
        const etapa = userInfo?.etapaCadastro

        setCadastroCompleto(cadastro)
        setEntrevistaAprovada(entrevista)
        setEtapaCadastro(etapa)

    }, [userInfo, setUserInfo])

    console.log("Situação atual da conta: ", cadastroCompleto, entrevistaAprovada, etapaCadastro)


    const schema = yup.object({
        arquivoFoto: yup
            .mixed()
            .test("required", "Foto de perfil é obrigatório", (value) => {
                return value instanceof File; // Verifica se o valor é um arquivo
            })
            .test("fileSize", "O arquivo é muito grande", (value) => {
                return value && value.size <= 5000000; // Limita o tamanho do arquivo a 5MB (ajuste conforme necessário)
            })
            .test("fileType", "Formato de arquivo não suportado", (value) => {
                return value && value.type.startsWith('image/'); // Aceita qualquer tipo de imagem
            }),

        arquivoCpf: yup
            .mixed()
            .test("required", "CPF é obrigatório", (value) => {
            return value instanceof File; // Verifica se o valor é um arquivo
            })
            .test("fileSize", "O arquivo é muito grande", (value) => {
            return value && value.size <= 5000000; // Limita o tamanho do arquivo a 5MB (ajuste conforme necessário)
            })
            .test("fileType", "Formato de arquivo não suportado", (value) => {
            return value && ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type); // Limita os tipos permitidos
            }),

        arquivoResidencia: yup
            .mixed()
            .test("required", "Comprovante de Residência é obrigatório", (value) => {
            return value instanceof File; // Verifica se o valor é um arquivo
            })
            .test("fileSize", "O arquivo é muito grande", (value) => {
            return value && value.size <= 5000000; // Limita o tamanho do arquivo a 5MB (ajuste conforme necessário)
            })
            .test("fileType", "Formato de arquivo não suportado", (value) => {
            return value && ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type); // Limita os tipos permitidos
            }),            

        arquivodt: yup
            .mixed()
            .test("required", "A Identidade é obrigatória", (value) => {
            return value instanceof File; // Verifica se o valor é um arquivo
            })
            .test("fileSize", "O arquivo é muito grande", (value) => {
            return value && value.size <= 5000000; // Limita o tamanho do arquivo a 5MB (ajuste conforme necessário)
            })
            .test("fileType", "Formato de arquivo não suportado", (value) => {
            return value && ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type); // Limita os tipos permitidos
            }),

        agencia: yup.string().required("Agência é obrigatório").trim(),
        conta: yup.string().required("Conta é obrigatório"),
        pix: yup.string().required("Informe uma chave pix")
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
        clearErrors
        } = useForm({
        resolver: yupResolver(schema),
    })

    // onSubmit do Forms
    const onSubmit = async (data) => {
        setLoading(true)
        setMessage(null)

        console.log(data)

        const formData = new FormData()

        formData.append('banco', data.banco)
        formData.append('agencia', data.agencia)
        formData.append('conta', data.conta)
        formData.append('pix', data.pix)
        
        formData.append('arquivoFoto', data.arquivoFoto);
        formData.append('arquivodt', data.arquivodt);
        formData.append('arquivoCpf', data.arquivoCpf);
        formData.append('arquivoResidencia', data.arquivoResidencia);

        try {
          const response = await CreateStepTwo(userId, formData);
          reset()
          setLoading(false)
          setOpenSucess(true)

          console.log('Usuário atualizado com sucesso:', response.data);
          
        } catch (error) {
            setLoading(false)
            console.error(error.message);
            setMessage(error.message)

        } finally {
            setLoading(false)
        }

    };

    console.log(errors)

    // states
    const [image, setImage] = useState(User)
    const [fileNames, setFileNames] = useState({
        docIdt: "Arquivo não selecionado",
        docCpf: "Arquivo não selecionado",
        docResidencia: "Arquivo não selecionado",
        docCurriculo: "Arquivo não selecionado",
    });

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

    const [isOpenFoto, setIsOpenFoto] = useState(false);
    const handleToggleFoto = () => setIsOpenFoto(!isOpenFoto);

    const handleContinue = () => {
        window.location.reload()
    }

    const fullName = userInfo?.name?.trim()
    const firstName = fullName?.split(' ')[0]

    const status = userInfo?.ativa

    console.log(status)


    return (
        <>
            <div>
                <HeaderApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess}/>
                <main className='flex flex-col  p-5 '>

                    {userInfo ? (
                        <>
                            {etapaCadastro == 1 && (
                                <section className='pt-14 pl-20 pr-20 lg:flex justify-between w-full gap-1 '>
                                    <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
                                        <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                                            <h2 className="text-2xl text-desSec">Completar cadastro</h2>
                                            <p className='text-sec font-semibold'>Olá, {userInfo.name}</p>
                                            <p className='text-prim'>Para que sua conta seja ativada e você tenha acesso a plataforma , precisamos que conclua seu cadastro :D</p>
                                        </div>

                                        <div className='pt-5'>
                                            <div className='flex justify-between'>
                                                <div className="flex flex-col justify-center items-center gap-2 ">
                                                    <label htmlFor="fotoPerfil" className="cursor-pointer flex justify-center flex-col items-center gap-1">
                                                        <Avatar src={image} 
                                                            alt="foto de perfil" 
                                                            className="min-w-72 min-h-72 max-w-72 max-h-72 lg:min-w-60 lg:min-h-60 lg:max-w-60 lg:max-h-60 text-large"
                                                        />                  
                                                        <input 
                                                            type="file" 
                                                            id="fotoPerfil"
                                                            accept="image/*"
                                                            {...register("arquivoFoto")}
                                                            onChange={(e) => {
                                                                const file = e.target.files[0]; // Pega o arquivo selecionado
                                                                handleImageChange(e); // Exibe a imagem
                                                                setValue("arquivoFoto", file, { shouldValidate: true }); // Atribui o arquivo e dispara a validação
                                                            }}
                                                            className="p-2 w-full hidden"
                                                        />                      
                                                    </label>
                                                    <div className="flex gap-2 items-center">
                                                        <span className="text-prim">Foto de perfil</span>
                                                        <Tooltip
                                                        content="Recomendamos inserir uma foto com tamanho quadrado ou altura maior que a largura"
                                                        isOpen={isOpenFoto}
                                                        onOpenChange={setIsOpenFoto}
                                                        size="md"
                                                        radius="md"
                                                        shadow="sm"
                                                        placement="top"
                                                        showArrow
                                                        shouldFlip
                                                        >
                                                            <button type="button" onClick={handleToggleFoto} onMouseEnter={() => setIsOpenFoto(true)} onMouseLeave={() => setIsOpenFoto(false)} className="w-5 h-5 text-white bg-prim rounded-full">
                                                                ?
                                                            </button>
                                                        </Tooltip>
                                                    </div>
                                                    {errors.arquivoFoto && (
                                                        <span className="text-error opacity-75">{errors.arquivoFoto.message}</span>
                                                    )}
                                                </div>
                                                <div className='grid w-1/2'>
                                                    <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                                        <label htmlFor="agencia" className="text-prim">Agência</label>
                                                        <input 
                                                        className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                                        id="agencia" 
                                                        type="text" 
                                                        placeholder="Somente números" 
                                                        {...register("agencia")}
                                                        />
                                                        {errors.agencia && 
                                                        <span className="text-error opacity-75">{errors.agencia?.message}</span>}
                                                    </div>
                                                    <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                                        <label htmlFor="conta" className="text-prim">Conta</label>
                                                        <input 
                                                        className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                                        id="conta" 
                                                        type="text" 
                                                        placeholder="Somente números" 
                                                        {...register("conta")}
                                                        />
                                                        {errors.conta && 
                                                        <span className="text-error opacity-75">{errors.conta?.message}</span>}

                                                    </div>
                                                    <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                                        <label htmlFor="pix" className="text-prim">Pix</label>
                                                        <input 
                                                        className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                                        id="pix" 
                                                        type="text" 
                                                        placeholder="Digite sua chave pix" 
                                                        {...register("pix")}
                                                        />
                                                        {errors.pix && 
                                                        <span className="text-error opacity-75">{errors.pix?.message}</span>}
                                                    </div>

                                                </div>

                                            </div>
                                            <div>
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
                                            </div>





                                        </div>
                                        
                                        <div className="mt-4 pl-9 pr-9 pb-9 space-y-5">
                                            <button type="submit" className="text-center w-full lg:w-1/2  bg-des rounded-md text-white p-2 hover:bg-sec transition-all " id="buttonSubmit"  >{loading ? <Spinner /> : 'Enviar'}</button>
                                            
                                        </div>
                                    </form>
                                </section>
                            )}

                            {etapaCadastro > 1 && !status && (
                                <>
                                    <section className='lg:flex justify-between w-full gap-1 h-[80vh] pt-14 '>
                                        <div className='w-full flex flex-col justify-center pl-10 pr-10'>
                                            <div className='max-w-[55vh]'>
                                                <h2 className='text-desSec text-2xl'>Contratação em andamento</h2>
                                                <p className='text-prim'>{firstName}, Falta pouco para sua conta ser ativada, aguarde ser chamado para uma entrevista com a Limppay! :D</p>

                                            </div>
                                            <div className='pt-5 text-prim w-1/2'>
                                                <ProgressBar step={etapaCadastro} />
                                            </div>

                                        </div>


                                    </section>

                            
                                </>

                            )}

                            { status && (
                                <>
                                    <section className='lg:flex justify-between w-full gap-1 pt-14 lg:pt-24'>
                                        <div className='flex flex-col gap-5 text-center max-w-50 min-w-72 min-h-60  p-5 rounded-md  lg:w-4/12 lg:h-full'>
                                            <div className="flex flex-col justify-center items-center gap-2">
                                                <div className='flex items-center'>
                                                    <div>
                                                        <p className='text-prim cursor-pointer' onClick={()=> SetOpen(true)}>Editar Perfil</p>
                                                    </div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-6 text-prim">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                    </svg>
                                                </div>
                                                <img src={avatarUrl}
                                                id='avatar' 
                                                alt="foto de perfil" 
                                                className="transition-all duration-200 rounded-full w-60 h-60  hover:bg-ter p-0.5 hover:bg-opacity-40 shadow-md cursor-pointer" 
                                                onClick={()=> SetOpen(true)}
                                                
                                                />                                             
                                            </div>
                                            
                                            <div className='flex flex-col gap-3 h-full max-w-full max-h-full pl-5 pr-5'>
                                                <h1 className='text-xl text-ter'>{userInfo.name}</h1>
                                                <div className="overflow-y-auto max-h-32">
                                                    <p className='text-prim text-center'>
                                                        {userInfo.sobre} 
                                                    </p>

                                                </div>
                                                    <p className='text-prim text-center'>
                                                        {calcularIdade(userInfo.data)} anos
                                                    </p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col shadow-md shadow-prim rounded-md text-center lg:w-8/12 '>
                                            <div className='bg-desSec text-white p-5 rounded-b-none rounded-md lg:hidden'>
                                                <h1 className='text-xl'>Minhas Informações</h1>
                                            </div>
                                            <div className='p-5 flex gap-10 flex-col lg:gap-7'>
                                                <div className='border-b border-bord p-2 flex  gap-2 flex-col lg:flex-row lg:p-0'>
                                                    <div className='lg:w-3/12'>
                                                        <p className='flex items-start text-ter lg:text-sm'>Nome Completo</p>
                                                    </div>
                                                    <div>
                                                        <p className='flex items-start text-prim lg:text-sm'>{userInfo.name}</p>
                                                    </div>
                                                </div>
                                                <div className='border-b border-bord p-2 flex  gap-2 flex-col lg:flex-row lg:p-0'>
                                                    <div className='w-3/12'>
                                                        <p className='flex items-start text-ter lg:text-sm'>Email</p>
                                                    </div>
                                                    <div className='flex'>
                                                        <p className='flex items-start text-prim lg:text-sm'>{userInfo.email}</p>
                                                    </div>
                                                </div>
                                                <div className='border-b border-bord p-2 flex  gap-2 flex-col lg:flex-row lg:p-0'>
                                                    <div className='w-3/12'>
                                                        <p className='flex items-start text-ter lg:text-sm'>Telefone</p>
                                                    </div>
                                                    <div>
                                                        <p className='flex items-start text-prim lg:text-sm'>{userInfo.telefone}</p>
                                                    </div>
                                                </div>
                                                <div className='border-b border-bord p-2 flex  gap-2 flex-col lg:flex-row lg:p-0'>
                                                    <div className='w-3/12'>
                                                        <p className='flex items-start text-ter lg:text-sm'>Estado</p>
                                                    </div>
                                                    <div>
                                                        <p className='flex items-start text-prim lg:text-sm'>{userInfo.estado}</p>
                                                    </div>
                                                </div>
                                                <div className='border-b border-bord p-2 flex  gap-2 flex-col lg:flex-row lg:p-0'>
                                                    <div className='w-3/12'>
                                                        <p className='flex items-start text-ter lg:text-sm'>Cidade</p>
                                                    </div>
                                                    <div>
                                                        <p className='flex items-start text-prim lg:text-sm'>{userInfo.cidade}</p>
                                                    </div>
                                                </div>
                                                <div className='border-b border-bord p-2 flex flex-col  gap-2 lg:flex-row lg:p-0'>
                                                    <div className='w-3/12'>
                                                        <p className='flex items-start text-ter lg:text-sm'>Endereço</p>
                                                    </div>
                                                    <div>
                                                        <p className='text-start text-prim lg:text-sm '>{userInfo.logradouro + ", " +  userInfo.numero + ", " + userInfo.bairro + ", " + userInfo.cep}</p>
                                                    </div>
                                                </div>

                                                {/* Modal de edição */}
                                                    <EditUserModal 
                                                        Open={Open}
                                                        SetOpen={() => SetOpen(false)} 
                                                        userInfo={userInfo} 
                                                        token={token} 
                                                        onUserUpdated={handleUserUpdated}
                                                        Urls={urls} 
                                                    />                          
                                            </div>
                                        </div>      
                                    </section>
                                    <section className='mt-5 lg:flex-row lg:gap-5 lg:justify-around flex flex-col gap-5'>
                                        <div className='lg:w-1/2 flex flex-col items-center shadow-md shadow-prim rounded-md'>
                                            <div className='p-5 pb-3 border-b border-bord w-full text-center'>
                                                <h1 className='text-ter text-lg' >Carreira</h1>
                                            </div>
                                            <div>
                                                {/* content here */}
                                            </div>
                                        </div>
                                        

                                        <div className='lg:w-1/2 flex flex-col items-center shadow-md shadow-prim rounded-md'>
                                            <div className='p-5 pb-3 border-b border-bord w-full text-center'>
                                                <h1 className='text-ter text-lg' > Serviços</h1>
                                            </div>
                                            <div className=' p-5 flex flex-col gap-5 overflow-y-auto max-h-96'>
                                                <div className='flex gap-3 bg-bord bg-opacity-30 rounded-md p-5'>
                                                    <div className='flex flex-col gap-2 items-center'>
                                                        <img 
                                                        src={User} 
                                                        alt="avatarCliente"
                                                        className='w-10'
                                                        />
                                                        <h3>Cliente</h3>
                                                    </div>
                                                    <div className='flex flex-col gap-2'>
                                                        <div className="overflow-y-auto max-h-32 bg-white p-3 rounded-md">
                                                            <p>Limpeza - 8Hrs - 26 de Setembro de 2024</p>
                                                            <p>Subtotal: R$26,60</p>
                                                        </div>
                                                        <div className='flex  justify-end gap-5 items-center'>
                                                            <div>
                                                                <p className='text-desSec'>Andamento</p>
                                                            </div>
                                                            <div >
                                                                <button className='bg-des p-2 rounded-md text-white'>Detalhes</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='flex gap-3 bg-bord bg-opacity-30 rounded-md p-5'>
                                                    <div className='flex flex-col gap-2 items-center'>
                                                        <img 
                                                        src={User} 
                                                        alt="avatarCliente"
                                                        className='w-10'
                                                        />
                                                        <h3>Cliente</h3>
                                                    </div>
                                                    <div className='flex flex-col gap-2'>
                                                        <div className="overflow-y-auto max-h-32 bg-white p-3 rounded-md">
                                                            <p>Limpeza - 16Hrs - 27 de Setembro de 2024</p>
                                                            <p>Subtotal: R$50,60</p>
                                                        </div>
                                                        <div className='flex items-end justify-end gap-5'>
                                                            <div>
                                                                <p className='text-des'>Agendado</p>
                                                            </div>
                                                            <div>
                                                                <button className='bg-des p-2 rounded-md text-white'>Detalhes</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='flex gap-3 bg-bord bg-opacity-30 rounded-md p-5'>
                                                    <div className='flex flex-col gap-2 items-center'>
                                                        <img 
                                                        src={User} 
                                                        alt="avatarCliente"
                                                        className='w-10'
                                                        />
                                                        <h3>Cliente</h3>
                                                    </div>
                                                    <div className='flex flex-col gap-2'>
                                                        <div className="overflow-y-auto max-h-32 bg-white p-3 rounded-md">
                                                            <p>Limpeza - 16Hrs - 27 de Setembro de 2024</p>
                                                            <p>Subtotal: R$50,60</p>
                                                        </div>
                                                        <div className='flex items-end justify-end gap-5'>
                                                            <div>
                                                                <p className='text-sec'>Concluído</p>
                                                            </div>
                                                            <div >
                                                                <button className='bg-des p-2 rounded-md text-white'>Detalhes</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            
                                            </div>
                                        </div>

                                        <div className='lg:w-6/12 flex flex-col items-center shadow-md shadow-prim rounded-md'>
                                            <div className='title p-5 pb-3 border-b border-bord w-full text-center'>
                                                <h1 className='text-ter text-lg'>Avaliações</h1>
                                            </div>
                                            <div className='avaliacoes p-5 overflow-y-auto max-h-96 flex flex-col gap-5'>
                                                <div className='avaliacao flex gap-3 bg-bord bg-opacity-30 rounded-md p-5'>
                                                    <div className='flex flex-col gap-2 items-center'>
                                                        <img 
                                                        src={User} 
                                                        alt="avatarCliente"
                                                        className=''
                                                        />
                                                        <h3>Cliente</h3>
                                                    </div>
                                                    <div>
                                                        <div className="overflow-y-auto max-h-32 bg-white p-3 rounded-md">
                                                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore nesciunt alias officia, veritatis quisquam eaque sed voluptatum saepe ut excepturi aperiam. Dolor eius provident sapiente dicta sed eveniet exercitationem tempora!</p>
                                                        </div>
                                                        <div>
                                                            {/* estrela */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='avaliacao flex gap-3 bg-bord bg-opacity-30 rounded-md p-5'>
                                                    <div className='flex flex-col gap-2 items-center'>
                                                        <img 
                                                        src={User} 
                                                        alt="avatarCliente"
                                                        className=''
                                                        />
                                                        <h3>Cliente</h3>
                                                    </div>
                                                    <div>
                                                        <div className="overflow-y-auto max-h-32 bg-white p-3 rounded-md">
                                                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore nesciunt alias officia, veritatis quisquam eaque sed voluptatum saepe ut excepturi aperiam. Dolor eius provident sapiente dicta sed eveniet exercitationem tempora!</p>
                                                        </div>
                                                        <div>
                                                            {/* estrela */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='avaliacao flex gap-3 bg-bord bg-opacity-30 rounded-md p-5'>
                                                    <div className='flex flex-col gap-2 items-center'>
                                                        <img 
                                                        src={User} 
                                                        alt="avatarCliente"
                                                        className=''
                                                        />
                                                        <h3>Cliente</h3>
                                                    </div>
                                                    <div>
                                                        <div className="overflow-y-auto max-h-32 bg-white p-3 rounded-md">
                                                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore nesciunt alias officia, veritatis quisquam eaque sed voluptatum saepe ut excepturi aperiam. Dolor eius provident sapiente dicta sed eveniet exercitationem tempora!</p>
                                                        </div>
                                                        <div>
                                                            {/* estrela */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='avaliacao flex gap-3 bg-bord bg-opacity-30 rounded-md p-5'>
                                                    <div className='flex flex-col gap-2 items-center'>
                                                        <img 
                                                        src={User} 
                                                        alt="avatarCliente"
                                                        className=''
                                                        />
                                                        <h3>Cliente</h3>
                                                    </div>
                                                    <div>
                                                        <div className="overflow-y-auto max-h-32 bg-white p-3 rounded-md">
                                                            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore nesciunt alias officia, veritatis quisquam eaque sed voluptatum saepe ut excepturi aperiam. Dolor eius provident sapiente dicta sed eveniet exercitationem tempora!</p>
                                                        </div>
                                                        <div>
                                                            {/* estrela */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </section>
                                
                                </>
                            )}
                        
                        </>
                        
                    ) : (
                        <>
                            <section className='flex justify-center h-[80vh]'>
                                <LoadingSpinner/>
                            </section>
                        </>
                    )}
                    
                </main>
                <Footer/>
                <ModalQuemSomos Open={OpenWho} SetOpen={() => SetOpenWho(!OpenWho)}/>
                <ModalDuvidas OpenDuvidas={OpenDuvidas} SetOpenDuvidas={() => SetOpenDuvidas(!OpenDuvidas)}/>
            </div>
            
            <Modal 
            backdrop="opaque" 
            isOpen={openSucess} 
            onClose={setOpenSucess}
            classNames={{
            backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
            body: "bg-white",
            header: "bg-white",
            footer: "bg-white"
            }}
            className="min-w-[50vh]"
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
                        <div className="text-neutral-400 flex  w-full justify-between gap-5 pt-10 pb-10 ">
                            <div className='text-prim grid gap-2'>
                                <p>Suas informações foram enviadas com sucesso e seu cadastro está em processo de análise.</p>
                                <p>Logo logo nossa equipe vai entrar em contato para agendar sua entrevista</p>
                            </div>
                            
                        </div>
 
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" className="bg-desSec w-2/12 text-white" onClick={handleContinue} >
                            Continuar
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
        
        </>
    );


};

export default AreaDiarista;

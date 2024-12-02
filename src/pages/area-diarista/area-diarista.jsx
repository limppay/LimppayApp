import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HeaderApp, Logo, Footer, ModalQuemSomos, ModalDuvidas} from '../../componentes/imports.jsx'
import User from "../../assets/img/diarista-cadastro/user.png"
import EditUserModal from './EditUserModal.jsx';
import LoadingSpinner from '../../componentes/FormCadastro/Loading.jsx';
import { accordion, Avatar, Button, ScrollShadow, Spinner, Tooltip } from '@nextui-org/react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import {Accordion, AccordionItem} from "@nextui-org/accordion";

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { CreateStepTwo, getAgendamentos } from '../../services/api.js';
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter} from "@nextui-org/modal";
import {Progress} from "@nextui-org/progress";
import ProgressBar from './ProgressBar.jsx';
import { useScreenSelected } from '../../context/ScreenSelect.jsx';

const AreaDiarista = () => {
    const [userInfo, setUserInfo] = useState(null);
    const[Open, SetOpen] = useState(false)
    const userId = localStorage.getItem('prestadorId'); // Obter o ID do usuário do localStorage
    const token = localStorage.getItem('token_prestador'); // Obter o token do localStorage
    // Recuperar as URLs e converter para objeto JSON
    const [urls, setUrls] = useState(JSON.parse(localStorage.getItem('urls_prestador')) || {}); // Atualize o estado URLs aqui
    const [agendamentos, setAgendamentos] = useState([])
    const [avaliacoes, setAvaliacoes] = useState([])
    const [selectedAgendamento, setSelectedAgendamento] = useState([])
    const [openDetalhes, setOpenDetalhes] = useState(false)


    const [OpenWho, SetOpenWho] = useState(false)
    const [OpenDuvidas, SetOpenDuvidas] = useState(false)

    const [cadastroCompleto, setCadastroCompleto] = useState()
    const [entrevistaAprovada, setEntrevistaAprovada] = useState()
    const [etapaCadastro, setEtapaCadastro] = useState()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [openSucess, setOpenSucess] = useState(false)
    const [isOpen, setIsOpen] = useState(true)
    const {screenSelected, setScreenSelected} = useScreenSelected()
    const [openPerfil, setOpenPerfil] = useState(false)

    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        }).format(valor);
    }


    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`https://limppay-api-production.up.railway.app/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const agendamentos = await getAgendamentos(userId)
                console.log(agendamentos)

                setAgendamentos(agendamentos)
                setUserInfo(response.data)
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

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const fullName = userInfo?.name?.trim()
    const firstName = fullName?.split(' ')[0]
    const status = userInfo?.ativa
    console.log(status)

    return (
        <>
            <div>
                <HeaderApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess}/>
                <main className='h-screen w-screen'>

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
                                    <div className='flex flex-col lg:flex-row h-screen'>
                                        {/* menu lateral */}
                                        <div className={` lg:flex flex-col pt-[7vh] min-h-[15vh]  lg:pt-[10vh] xl:pt-[12vh] lg:h-screen bg-neutral-800 shadow-lg transition-all transform overflow-x-auto max-w-[100vh]  ${
                                        isOpen ? " lg:min-w-[30vh] lg:max-w-[30vh] xl:min-w-[35vh] xl:max-w-[35vh] 2xl:min-w-[26vh] 2xl:max-w-[26vh]" : "w-full lg:min-w-[10vh] lg:max-w-[13vh] xl:min-w-[13vh] xl:max-w-[13vh] 2xl:min-w-[10vh] 2xl:max-w-[10vh] "
                                        }`}>

                                            <div className=" hidden border-b border-des lg:flex items-center justify-between pt-2 pb-2 p-4 ">
                                                <Avatar
                                                src={avatarUrl}
                                                className={`${isOpen ? "" : ""} cursor-pointer`}
                                                onClick={() => setScreenSelected("perfil")}
                                                />


                                                <Button className="bg- text-des" onClick={toggleSidebar} >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                                                </svg>
                                                </Button>
                                            </div>
                                            
                                            <div className='flex flex-row lg:grid gap-5 pt-5 p-2 '>
                                                <div>
                                                    <Button
                                                    className='w-full border border-des bg-trans text-des text-start '
                                                    onClick={() => setScreenSelected("perfil")}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                                        </svg>
                                                        
                                                        {isOpen ? "Perfil" : ""}
                                                        
                                                    </Button>
                                                </div>


                                                <div>
                                                    <Button
                                                    className='w-full border border-des bg-trans text-des'
                                                    onClick={() => setScreenSelected("pedidos")}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                                                        </svg>

                                                        {isOpen ? "Meus pedidos" : ""}
                                                        
                                                    </Button>
                                                </div>

                                                <div>
                                                    <Button
                                                    className='w-full border border-des bg-trans text-des'
                                                    onClick={() => setScreenSelected("avaliacoes")}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                        </svg>


                                                        {isOpen ? "Minhas Avaliações" : ""}
                                                        
                                                    </Button>
                                                </div>

                                                <div>
                                                    <Button
                                                    className='w-full border border-des bg-trans text-des'
                                                    onClick={() => setScreenSelected("painel")}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                                        </svg>


                                                        {isOpen ? "Painel" : ""}
                                                        
                                                    </Button>
                                                </div>

                                            </div>
                                                
                                        </div>
                                        
                                        {screenSelected == "perfil" && (
                                            <section className='w-full gap-1 sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim'>

                                                <div className='lg:flex flex-col max-w-50 min-w-72 min-h-60 p-10 pt-5 w-full 
                                                '>
                                                    <div className='flex flex-col lg:flex-row lg:justify-between w-full'>
                                                        <div className='text-center flex flex-col gap-2'>
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
                                                                
                                                                <p className='text-prim text-center'>
                                                                    {calcularIdade(userInfo.data)} anos
                                                                </p>
                                                            </div>

                                                        </div>
                                                        <div >
                                                            <textarea className='text-prim border border-bord p-2 w-full min-h-[20vh]  lg:w-[80vh] xl:w-[100vh] lg:min-h-[40vh] lg:max-h-[40vh] rounded-md' defaultValue={userInfo?.sobre} disabled ></textarea>
                                                        </div>
                                                    </div>

                                                    <h2 className="text-xl pt-10 text-prim font-semibold">Informações Pessoais</h2>
                                                    <div className="grid  sm:grid-cols-3 gap-5 pt-2">
                                                        <div className="grid gap-2">
                                                        <label htmlFor="cpf" className="text-neutral-500">CPF</label>
                                                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.cpfCnpj} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                        <label htmlFor="rg" className="text-neutral-500">RG</label>
                                                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.rg} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                        <label htmlFor="email" className="text-neutral-500">E-mail</label>
                                                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.email} />
                                                        </div>

                                                    </div>

                                                    <div className="grid  sm:grid-cols-3 gap-5 pt-5">
                                                        <div className="grid gap-2">
                                                        <label htmlFor="telefone" className="text-neutral-500">Telefone</label>
                                                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.telefone} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                        <label htmlFor="rg" className="text-neutral-500">Estado Civil</label>
                                                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.estadoCivil} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                        <label htmlFor="genero" className="text-neutral-500">Gênero</label>
                                                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.genero} />
                                                        </div>

                                                    </div>

                                                    <h2 className="text-xl pt-10 text-prim font-semibold">Informações Bancárias</h2>
                                                    <div className="grid sm:grid-cols-4 gap-5 pt-2">
                                                        <div className="grid gap-2">
                                                        <label htmlFor="telefone" className="text-neutral-500">Banco</label>
                                                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.banco} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                        <label htmlFor="rg" className="text-neutral-500">Agência</label>
                                                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.agencia} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                        <label htmlFor="genero" className="text-neutral-500">Conta</label>
                                                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.conta} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                        <label htmlFor="genero" className="text-neutral-500">Pix</label>
                                                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.pix} />
                                                        </div>
                                                    </div>

                                                    <h2 className="text-xl pt-10 text-prim font-semibold">Disponibilidade e Serviços</h2>
                                                    <div className="pt-2">
                                                        <span className="font-semibold text-prim pt-5 text-lg">Serviços</span>
                                                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pb-5 pt-5">

                                                        {userInfo?.UserServico.map((service) => (
                                                            <div key={service.id}>
                                                                <Button className=" border border-bord bg-trans text-prim w-full" isDisabled>
                                                                    {service.servico.nome}
                                                                </Button>
                                                            </div>
                                                        ))}

                                                        </div>

                                                        <span className="font-semibold text-prim pt-5 text-lg">Dias disponíveis</span>
                                                        {/* dias disponiveis */}
                                                        <div className="text-neutral-400 text-lg">
                                                        <div className="grid grid-cols-3">
                                                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                                                <input 
                                                                type="checkbox" 
                                                                id="domingo"
                                                                className="cursor-pointer bg-neutral-200 placeholder:bg-neutral-200 border border-neutral-600 rounded-lg"
                                                                defaultChecked={userInfo?.DiasDisponiveis[0].dom}
                                                                disabled
                                                                
                                                                />
                                                                <label htmlFor="domingo">Domingo</label>
                                                            </div>
                                                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                                                <input 
                                                                type="checkbox" 
                                                                id="segunda" 
                                                                
                                                                className="cursor-pointer bg-neutral-200 placeholder:bg-neutral-200 border border-neutral-600 rounded-lg"
                                                                defaultChecked={userInfo?.DiasDisponiveis[0].seg}
                                                                disabled

                                                                />
                                                                <label htmlFor="segunda">Segunda</label>
                                                            </div>
                                                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                                                <input 
                                                                type="checkbox" 
                                                                id="ter" 
                                                                disabled
                                                                className="cursor-pointer bg-neutral-200 placeholder:bg-neutral-200 border border-neutral-600 rounded-lg"

                                                                defaultChecked={userInfo?.DiasDisponiveis[0].ter}
                                                                

                                                                />
                                                                <label htmlFor="ter">Terça</label>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-3">
                                                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                                                <input 
                                                                type="checkbox" 
                                                                id="quarta" 
                                                                disabled
                                                                className="cursor-pointer bg-neutral-200 placeholder:bg-neutral-200 border border-neutral-600 rounded-lg"

                                                                defaultChecked={userInfo?.DiasDisponiveis[0].quart}
                                                                

                                                                />
                                                                <label htmlFor="quarta">Quarta</label>
                                                            </div>
                                                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                                                <input 
                                                                type="checkbox" 
                                                                id="quinta" 
                                                                disabled
                                                                className="cursor-pointer bg-neutral-200 placeholder:bg-neutral-200 border border-neutral-600 rounded-lg"

                                                                defaultChecked={userInfo?.DiasDisponiveis[0].qui}
                                                                

                                                                />
                                                                <label htmlFor="quinta">Quinta</label>
                                                            </div>
                                                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                                                <input 
                                                                type="checkbox" 
                                                                id="sexta" 
                                                                disabled
                                                                className="cursor-pointer bg-neutral-200 placeholder:bg-neutral-200 border border-neutral-600 rounded-lg"

                                                                defaultChecked={userInfo?.DiasDisponiveis[0].sex}
                                                                

                                                                />
                                                                <label htmlFor="sexta">Sexta</label>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-3">
                                                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                                                <input 
                                                                type="checkbox" 
                                                                id="sabado" 
                                                                disabled
                                                                className="cursor-pointer bg-neutral-200 placeholder:bg-neutral-200 border border-neutral-600 rounded-lg"

                                                                defaultChecked={userInfo?.DiasDisponiveis[0].sab}
                                                                

                                                                />
                                                                <label htmlFor="sabado">Sábado</label>
                                                            </div>
                                                        </div>

                                                        </div>

                                                        <h2 className="text-xl pt-10 text-prim font-semibold">Endereço</h2>
                                                        <div className="grid sm:grid-cols-3 gap-5 pt-2">

                                                        <div className="grid gap-2">
                                                            <label htmlFor="cep" className="text-prim">CEP</label>
                                                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.cep} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <label htmlFor="logradouro" className="text-prim">Logradouro</label>
                                                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.logradouro} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <label htmlFor="numero" className="text-prim">Número</label>
                                                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.numero} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <label htmlFor="complemento" className="text-prim">Complemento</label>
                                                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.complemento} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <label htmlFor="referencia" className="text-prim">Ponto de referência</label>
                                                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.referencia} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <label htmlFor="bairro" className="text-prim">Bairro</label>
                                                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.bairro} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <label htmlFor="cidade" className="text-prim">Cidade</label>
                                                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.cidade} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <label htmlFor="estado" className="text-prim">Estado</label>
                                                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled defaultValue={userInfo.estado} />
                                                        </div>

                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                                
                                            </section>
                                        )}

                                        {screenSelected == "pedidos" && (
                                            <section className='w-full gap-1 sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim'>
                                                <div className='p-5 flex flex-col gap-5'>
                                                
                                                    {agendamentos ? (
                                                        
                                                        agendamentos.map((agendamento) => (
                                                            <>
                                                                <div className='flex flex-col gap-3  shadow-md rounded-md p-5 justify-center items-start'>
                                                                    <div className='flex flex-col lg:flex-row gap-5 items-start w-full justify-between'>
                                                                        <div className='flex flex-col gap-2 w-full'>
                                                                            <div className="overflow-y-auto  bg-white p-3 rounded-md text-ter w-full flex flex-col sm:flex-row sm:justify-between">
                                                                                <p>
                                                                                    {agendamento.Servico} - {agendamento.horaServico} - {new Date(agendamento?.dataServico).toLocaleDateString('pt-BR', {
                                                                                        day: '2-digit',
                                                                                        month: 'long',
                                                                                        year: 'numeric'
                                                                                    })}
                                                                                </p>
                                                                                <p>Subtotal: {formatarMoeda(agendamento.valorServico)}</p>
                                                                                <div className='w-4/12 sm:w-auto text-center pt-2 sm:pt-0'>
                                                                                    <div className={`p-2 rounded-md text-white ${agendamento.status === 'Agendado' ? " bg-des" : agendamento.status === "Iniciado" ? "bg-desSec" : agendamento.status === "Cancelado" ? "bg-error" : agendamento.status === "Realizado" ? "text-sec bg-sec " : ""} `}>{agendamento.status}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                
                                                                        
                                                                    </div>
                                                                    <Accordion isCompact itemClasses={{title: "text-prim"}}>
                                                                        <AccordionItem key={agendamento.id} title="Detalhes" >
                                                                            <div className="mt-2">
                                                                                <div className="flex flex-col gap-7 text-prim  overflow-y-auto max-h-[60vh] ">
                                                                                    <p className='font-semibold border-t-2 pt-5 border-bord'>Agendamento feito dia {new Date(agendamento?.dataAgendamento).toLocaleDateString('pt-BR', {
                                                                                        day: '2-digit',
                                                                                        month: 'long',
                                                                                        year: 'numeric'
                                                                                    })}</p>
                                                                                    <div className='text-justify flex flex-col gap-2'>
                                                                                        <p><b>Endereço:</b> {agendamento?.enderecoCliente}</p>

                                                                                        <p><b>Prestador:</b> {agendamento?.user?.name}</p>

                                                                                        <p><b>Serviço:</b> {agendamento?.Servico}</p>

                                                                                        <p><b>Observação:</b> {agendamento?.observacao ? agendamento.observacao : "Nenhuma obervação."}</p>

                                                                                        <p><b>Preço:</b> {formatarMoeda(agendamento?.valorServico)}</p>

                                                                                        <p><b>Data:</b> {new Date(agendamento?.dataServico).toLocaleDateString('pt-BR', {
                                                                                            day: '2-digit',
                                                                                            month: 'long',
                                                                                            year: 'numeric'
                                                                                        })}</p>

                                                                                    </div> 

                                                                                                                                                                 
                                                                                </div>
                                                                            </div>


                                                                        </AccordionItem>
                                                                    </Accordion>
                                                                </div>
                                                            
                                                            </>
                                                        ))
                                                    
                                                        
                                                    ) : (
                                                        <div className='text-prim text-center flex flex-col justify-center items-center h-full '>
                                                            <p>Você não possui nenhum agendamento</p>
                                                        </div>

                                                    )}
                                                    

                                                </div>
                                                
                                            </section>
                                        )}

                                       
                                    </div>

                                    <EditUserModal 
                                        Open={Open}
                                        SetOpen={() => SetOpen(false)} 
                                        userInfo={userInfo} 
                                        token={token} 
                                        onUserUpdated={handleUserUpdated}
                                        Urls={urls} 
                                    />                          
                                </>
                            )}
                        
                        </>
                        
                    ) : (
                        <>
                            <section className=' flex-col flex justify-center items-center h-[90vh] gap-4'>
                                <div className='text-white'>
                                    <Spinner size='lg' />
                                </div>
                                
                            </section>
                        </>
                    )}
                    
                </main>
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

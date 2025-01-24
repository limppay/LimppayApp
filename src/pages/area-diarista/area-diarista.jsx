import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { HeaderApp, Logo, Footer, ModalQuemSomos, ModalDuvidas} from '../../componentes/imports.jsx'
import User from "../../assets/img/diarista-cadastro/user.webp"
import EditUserModal from './EditUserModal.jsx';
import LoadingSpinner from '../../componentes/FormCadastro/Loading.jsx';
import { accordion, Avatar, Button, ScrollShadow, Spinner, Tooltip } from '@nextui-org/react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import {Accordion, AccordionItem} from "@nextui-org/accordion";

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { CreateStepTwo, findAllServicos, getAgendamentos, getAvaliacoesByPrestador, updateServico, getSolicitacoesGeraisPrestador, getSolicitacoesTotalPrestador, getFaturamentoMes, prestadorProfile} from '../../services/api.js';
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter} from "@nextui-org/modal";
import {Progress} from "@nextui-org/progress";
import ProgressBar from './ProgressBar.jsx';
import { useScreenSelected } from '../../context/ScreenSelect.jsx';
import Calendar from './Calendar.jsx';
import { bloquearData } from '../../services/api.js';
import { desbloquearData } from '../../services/api.js';
import { findAllDiasBloqueados } from '../../services/api.js';
import { updateDiasDisponveis } from '../../services/api.js';
import InputMask from "react-input-mask"
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import NavigationDiarista from './NavigationDiarista.jsx';

import { io } from 'socket.io-client';
import { useWebSocket } from '../../context/WebSocketContext.jsx';
import { usePrestador } from '../../context/PrestadorProvider.jsx';


const AreaDiarista = () => {
    const { prestador, setPrestador } = usePrestador()

    const[Open, SetOpen] = useState(false)
    const navigate = useNavigate()

    const [loadingDay, setLoadingDay] = useState(false)
    const [loadingServico, setLoadingServico] = useState(false)

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
    const [ selectedDates, setSelectedDates ] = useState([])
    const [numberOfDays, setNumberOfDays] = useState(0)
    const formattedDates = selectedDates?.map(date => {
        return new Date(date).toISOString().split('T')[0];
    });
    const [old, setOld] = useState('')


    const [ errorBlock, setErrorBlock ] = useState('')
    const [ loadingBlock, setLoadingBlock ] = useState(false)
    const blockDates = async () => {
        setErrorBlock('')
        setLoadingBlock(true)
        for(const date of formattedDates ) {
            const data = {
                userId: prestador?.id,
                data: date
            }
            
            try {
                const response = await bloquearData(data)
                await fetchUserInfo()
                setSelectedDates([])
                setLoadingBlock(false)

    
            } catch (error) {
                console.error(error.message)
                setErrorBlock(error.message)
                setSelectedDates([])
                setLoadingBlock(false)
                
            }

        }
        
    }

    const [ loadingUnlock, setLoadingUnlock ] = useState(false)
    const [ errorUnlock, SetErrorUnlock ] = useState('')
    const unlockDate = async (data) => {
        setLoadingUnlock(true)
        SetErrorUnlock('')

        const date = new Date(data).toISOString().split('T')[0]

        try {
            const response = await desbloquearData(prestador?.id, date );
            await fetchUserInfo()
            setLoadingUnlock(false)



        
        } catch (error) {
            console.error("Erro ao desbloquear data: ", error.message);
            SetErrorUnlock(error.message);
            setLoadingUnlock(false)

        }
    };

    const diasDisponveisSchema = yup.object({
        // Dias da semana 
        dom: yup.boolean(),
        seg: yup.boolean(),
        ter: yup.boolean(),
        quart: yup.boolean(),
        qui: yup.boolean(),
        sex: yup.boolean(),
        sab: yup.boolean(),
        diasSemana: yup.boolean().test('at-least-one-day', 'Selecione pelo menos um dia', function () {
            const { dom, seg, ter, quart, qui, sex, sab } = this.parent
            return dom || seg || ter || quart || qui || sex || sab
        }),
    })
    .required()

    // Hook Forms
    const {
        register: registerDay,
        handleSubmit: handleSubmitDay,
        formState: { errors: errorsDay },
        reset: resetDay,  
        } = useForm({
        resolver: yupResolver(diasDisponveisSchema),
    })

    const handleUpdateDiasDisponveis = async (data) => {
        setLoadingDay(true)

        try {
            const response = await updateDiasDisponveis(prestador?.id, data)
            await fetchUserInfo()
            setLoadingDay(false)

        } catch (error) {
            console.log(error)
            
        } 
        
    }
    

    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        }).format(valor);
    }

    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    
      
    const agendamentosFiltrados = prestador?.Agendamentos && prestador?.Agendamentos?.filter((agendamento) => {
        const nameMatch = agendamento.Servico.toLowerCase().includes(searchTerm.toLowerCase());
        const dateMatch = (!startDate || new Date(agendamento.dataServico) >= new Date(startDate)) &&
                          (!endDate || new Date(agendamento.dataServico) <= new Date(endDate));
    
        return nameMatch && dateMatch;
    });

    const [SolicitacoesTotalPrestador, setSolicitacoesTotalPrestador] = useState()
    useEffect(() => {
    const handleSolicitacoesTotalPrestador = async() => {
        try {
            const response = await getSolicitacoesTotalPrestador(prestador?.id)
            setSolicitacoesTotalPrestador(response)
        } catch (error){
        }
    }
    handleSolicitacoesTotalPrestador()
    }, [prestador?.id, prestador]);

    const [SolicitacoesGeraisPrestador, setSolicitacoesGeraisPrestador] = useState()
    useEffect(() => {
    const handleSolicitacoesGeraisPrestador = async() => {
        try {
            const response = await getSolicitacoesGeraisPrestador(prestador?.id)
            setSolicitacoesGeraisPrestador(response)
        } catch (error){
        }
    }
    handleSolicitacoesGeraisPrestador()
    }, [prestador?.id, prestador]);

    const [FaturamentoMes, setFaturamentoMes] = useState()
    useEffect(() => {
    const handleFaturamentoMes = async() => {
        try {
            const response = await getFaturamentoMes(prestador?.id)
            setFaturamentoMes(response)
        } catch (error){
        }
    }
    handleFaturamentoMes()
    }, [prestador?.id, prestador]);



    const { socket, setAppId, setUsername } = useWebSocket();
    const [errorLogin, setErrorLogin] = useState(false)

    const fetchUserInfo = async () => {
        setErrorLogin(false)
        try {
            const prestador = await prestadorProfile()

            setPrestador(prestador)
            setAppId(prestador.data.id)
            setUsername(prestador.data.name)
            setOld(prestador.Old)

        } catch (error) {
            console.error('Erro ao buscar informações do usuário:', error);
            setErrorLogin(true)

        }
    };

    useEffect(() => {
      if (!socket) return;
  
      socket.on('data-updated', (data) => {
          console.log('Notificação recebida:', data);
          fetchUserInfo()
      });
  
      return () => {
        socket.off('data-updated')
      };
    }, [prestador]);
    

    const handleUserUpdated = () => {
        fetchUserInfo()
    };


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
        const cadastro = prestador?.cadastroCompleto
        const entrevista = prestador?.Entrevista
        const etapa = prestador?.etapaCadastro

        setCadastroCompleto(cadastro)
        setEntrevistaAprovada(entrevista)
        setEtapaCadastro(etapa)

    }, [prestador, setPrestador])



    const schema = yup.object({
        // Data de nascimento
        data: yup
            .date()
            .nullable()  // Permite que o valor seja null ou não fornecido
            .typeError('Data de nascimento inválida')
            .test('is-valid-date', 'Data deve ser uma data válida', (value) => {
                if (!value) return true; // Se não for fornecido, é considerado válido
                return !isNaN(value.getTime()); // Verifica se a data é válida
            })
            .min(new Date(1900, 0, 1), "Data de nascimento inválida") // Define uma data mínima
            .max(new Date(), "Data de nascimento não pode ser no futuro") // Define que não pode ser uma data futura
            .when('old', {
                is: 'Migrate', // Se a variável 'old' for igual a "Migrate"
                then: yup.date().required("Data de nascimento é obrigatória") // Torna obrigatório
            }),

        // Currículo
        arquivoCurriculo: yup
            .mixed()
            .test("fileSize", "O arquivo é muito grande", (value) => {
                return !value || value.size <= 5000000; // Limita o tamanho do arquivo a 5MB
            })
            .test("fileType", "Formato de arquivo não suportado", (value) => {
                return !value || ['image/jpeg', 'image/png', 'application/pdf'].includes(value?.type); // Limita os tipos permitidos
            })
            .when('old', {
                is: 'Migrate', // Se a variável 'old' for igual a "Migrate"
                then: yup.mixed().required("Currículo é obrigatório") // Torna obrigatório
            }),


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
        banco: yup.number().required("Banco é obrigatório"),
        pix: yup.string().required("Informe uma chave pix"),

        cep:  yup.string().required("Preencha os campos abaixo").min(8, "Digite um cep válido"),
        logradouro:  yup.string(),
        numero:  yup.string().trim().required("Número é obrigatório"),
        complemento:  yup.string(),
        referencia:  yup.string(),
        bairro:  yup.string(),
        cidade:  yup.string(),
        estado: yup.string().typeError(""),
        rg: yup.string().trim().required("O RG é obrigatório"),
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

    const removerMascara = (valor) => {
        return valor.replace(/\D/g, ''); // Remove todos os caracteres que não são números
    };

    const [dataNascimento, setDataNascimento] = useState()
    // onSubmit do Forms
    const onSubmit = async (data) => {
        setLoading(true)
        setMessage(null)

        const cepSemMascara = removerMascara(data.cep);


        const formData = new FormData()

        formData.append('banco', data.banco)
        formData.append('agencia', data.agencia)
        formData.append('conta', data.conta)
        formData.append('pix', data.pix)
        
        if(old == 'Migrate') {
            formData.append('arquivoCurriculo', data.arquivoCurriculo);
            
        }

        formData.append('arquivoFoto', data.arquivoFoto);
        formData.append('arquivodt', data.arquivodt);
        formData.append('arquivoCpf', data.arquivoCpf);
        formData.append('arquivoResidencia', data.arquivoResidencia);

        formData.append('cep', cepSemMascara)
        formData.append('logradouro', data.logradouro)
        formData.append('numero', data.numero)
        formData.append('complemento', data.complemento)
        formData.append('referencia', data.referencia)
        formData.append('bairro', data.bairro)
        formData.append('cidade', data.cidade)
        formData.append('estado', data.estado)
        formData.append('rg', data.rg)

        if(old == 'Migrate') {
            //Validação de maioridade
            const today = new Date();
            const birthDate = new Date(data.data); //Data de nascimento inserida
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();
            const dayDifference = today.getDate() - birthDate.getDate();
    
            if(age < 18 || (age === 18 && (monthDifference<0 || (monthDifference === 0 && dayDifference < 0)))){
                setLoading(false);
                setMessage("Você precisa ser maior de 18 anos para se cadastrar.");
                return; //Cancela o envio se a idade for menor que 18 anos
            }
    
            const dataNascimento = birthDate.toISOString(); //Formatação da data


            formData.append('data', dataNascimento)

        }

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

    const inputRef = useRef(null)
    const [cepError, setCepError] = useState("")

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
      
    const handleCepChange = async (e) => {
        const cep = e.target.value.replace(/\D/g, ''); // Remove qualquer não numérico
        setCepError("")
        
        if (cep.length === 8) {
            try {
            setLoading(true);
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
                console.error('Erro ao buscar o CEP:', error);
                alert('Erro ao buscar o CEP.');
            } finally {
                setLoading(false);
            }
        }
    };

    
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

    function StarReview({ filled }) {
        return (
            <span
                className={`text-4xl ${
                    filled ? 'text-des' : 'text-prim'
                }`}
            >
                ★
            </span>
        );
    }

    const fullName = prestador?.name?.trim()
    const firstName = fullName?.split(' ')[0]
    const status = prestador?.ativa
    
    const servicosSchema = yup.object({
        servicosSelecionados: yup.array().required("Selecione um servico")
    })
    .required()

   

    // Hook Forms
    const {
        register: registerService,
        handleSubmit: handleSubmitService,
        formState: { errors: errorsService },
        reset: resetService,  
        } = useForm({
        resolver: yupResolver(servicosSchema),
    })


    const handleUpdateServicos = async (data) => {
        setLoadingServico(true)
        
        const req = {
            servicosSelecionados: JSON.stringify(selectedServices)
        }

        

        try {
            const response = await updateServico(prestador?.id, data)
            await fetchUserInfo()
            setLoadingServico(false)
            resetService()
            setServiceMessage("Enviado com sucesso!")

        } catch (error) {
            setServiceMessage(error)
        } 
        
    }
    
    const [servicos, setServicos] = useState([])
    const [selectedServices, setSelectedServices] = useState([])
    const toggleService = (id) => {
        if (selectedServices.includes(id)) {
            // Remove se já estiver selecionado
            setSelectedServices(selectedServices.filter((service) => service !== id));
        } else {
            // Adiciona à lista
            setSelectedServices([...selectedServices, id]);
        }
    };

    const [serviceMessage, setServiceMessage] = useState("")

    // função para fazer as requisições
    useEffect(() => {

        const handleGetServicos = async () => {
        try {
            const response = await findAllServicos()

            setServicos(response)
            
    
        } catch (error) {
            

        } 

        }

        handleGetServicos()

    }, [])

    useEffect(() => {
        if (selectedServices) {
                resetService({
                servicosSelecionados: selectedServices,
            });

        }
    }, [selectedServices, reset]);





    useEffect(() => {
        const HandleVerify = async () => {

            if(errorLogin) {
              navigate("/seja-diarista")
            }
            
        }

        HandleVerify()
    
    }, [errorLogin, setErrorLogin])

    const EstadoCivil = [
        { text: "Solteiro(a)", value: 1 },
        { text: "Casado(a)", value: 2 },
        { text: "Divorciado(a)", value: 3 },
        { text: "Viúvo(a)", value: 4 },
        { text: "Separado(a)", value: 5 },
    ];

    const Banco = [
        {text: "Santander", value: 1}

    ]

    const estadoCivilTexto = EstadoCivil.find(item => item.value === prestador?.estadoCivil)?.text || '';
    const bancoTexto = Banco.find(item => item.value === prestador?.banco)?.text || '';

    function formatarData(dataISO) {
        const [ano, mes, dia] = dataISO.split("-"); // Divide "aaaa-mm-dd"
        return `${dia}/${mes}/${ano}`; // Retorna no formato "dd/mm/aaaa"
    }

    const taxaPrestador = (valor) => {
        const value = valor * 0.75
        return formatarMoeda(value)
    }
    
    return (
        <>
            <Helmet>
                <title>Limppay: Area Prestador</title>
            </Helmet>
            <div>
                <HeaderApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess}/>
                <main className='h-screen '>

                    {prestador ? (
                        <>
                            <div className='flex'>
                                {etapaCadastro <= 3 && !entrevistaAprovada && !status && (
                                    <>
                                        <section className='lg:flex justify-between w-8/12 gap-1 h-[80vh] pt-[10vh] lg:pt-[12vh] xl:pt-[14vh] '>
                                            <div className='w-full flex flex-col  pl-10 pr-10 h-full'>
                                                <div className='max-w-[55vh]'>
                                                    <h2 className='text-desSec text-xl sm:text-2xl'>Cadastro em andamento</h2>
                                                    <p className='text-prim'><b>{firstName} </b>, Falta pouco para sua conta ser ativada! :D</p>
                                                </div>
                                                <div className='pt-5 text-prim w-1/2 h-full'>
                                                    <ProgressBar step={etapaCadastro} />
                                                </div>

                                            </div>


                                        </section>

                                
                                    </>

                                )}

                                {etapaCadastro == 3 && !cadastroCompleto && (
                                    <section className=' lg:flex justify-between w-full gap-1 pt-[10vh] lg:pt-[12vh] xl:pt-[14vh] '>
                                        <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
                                            <div className='pt-5'>
                                                <div className='grid md:flex md:justify-between'>
                                                    <div className="flex flex-col justify-center items-center gap-2 ">
                                                        <label htmlFor="fotoPerfil" className="cursor-pointer flex justify-center flex-col items-center gap-1">
                                                            <Avatar src={image} 
                                                                alt="foto de perfil" 
                                                                className="min-w-60 min-h-60 max-w-72 max-h-72 lg:min-w-60 lg:min-h-60 lg:max-w-60 lg:max-h-60 text-large"
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
                                                </div>

                                                <div className='grid sm:grid-cols-2 '>
                                                    <div className="mt-4 p-9 pt-0 pb-0 flex flex-col w-full">
                                                        <label htmlFor="banco" className="text-prim">Banco</label>
                                                        <select  
                                                        id="banco"
                                                        {...register("banco")}
                                                        className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim">
                                                            <option value="" >Selecione</option>
                                                            {Banco.map((options, index) => (
                                                                <option key={index} value={options.value}>{options.text}</option>
                                                            ))}
                                                        </select>
                                                        {errors.banco && 
                                                        <span className="text-error opacity-75">{errors.banco?.message}</span>}           
                                                    </div>
                                                    <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                                        <label htmlFor="agencia" className="text-prim">Agência</label>
                                                        <input 
                                                        className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter w-full "
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

                                                <div className='grid gap-2 pt-5 pb-5'>
                                                    <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                                        <label htmlFor="rg" className="text-prim">RG</label>
                                                        <input
                                                        className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                                        id="rg" 
                                                        type="text" 
                                                        placeholder="Somente números" 
                                                        {...register("rg")}
                                                        />
                                                        {errors.rg && 
                                                        <span className="text-error opacity-75">{errors.rg?.message}</span>}
                                                    </div>
                                                    
                                                    {old == 'Migrate' &&
                                                        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col w-full">
                                                            <label htmlFor="data" className="text-prim">Data de Nascimento</label>
                                                            <input
                                                            className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter"
                                                            id="data"
                                                            type="date"
                                                            {...register("data")}
                                                            />
                                                            {errors.data && 
                                                            <span className="text-error opacity-75">{errors.data?.message}</span>}
                                                        </div>                                                      
                                                    }

                                                    <div className="lg:flex lg:justify-between">
                                                        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                                                            <label htmlFor="cep" className="text-prim">CEP</label>
                                                            <InputMask 
                                                            ref={inputRef}
                                                            mask="99999-999"
                                                            maskChar={null}
                                                            className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                                            id="cep" 
                                                            type="text" 
                                                            placeholder="Somente números" 
                                                            {...register("cep")}
                                                            onChange={handleCepChange}
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
                                                    {old == 'Migrate' && 
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
                                                    }
                                                </div>

                                            </div>
                                            
                                            <div className="mt-4 pl-9 pr-9 pb-9 space-y-5">
                                                <Button type="submit" className="text-center w-full   bg-des rounded-md text-white p-2 hover:bg-sec transition-all " id="buttonSubmit"  >{loading ? <Spinner /> : 'Enviar'}</Button>
                                                
                                            </div>
                                        </form>
                                    </section>
                                )}
                            </div>

                            { etapaCadastro == 3 && entrevistaAprovada && cadastroCompleto &&  (
                                <>
                                    <div className='flex flex-col lg:flex-row h-screen'>
                                        {/* menu lateral */}
                                        <div className={`hidden lg:flex flex-col pt-[7vh] min-h-[15vh]  lg:pt-[10vh] xl:pt-[12vh] lg:h-screen bg-neutral-800 shadow-lg transition-all transform overflow-x-auto max-w-[100vh]  ${
                                        isOpen ? " lg:min-w-[30vh] lg:max-w-[30vh] xl:min-w-[35vh] xl:max-w-[35vh] 2xl:min-w-[26vh] 2xl:max-w-[26vh]" : "overflow-hidden w-full lg:min-w-[10vh] lg:max-w-[13vh] xl:min-w-[15vh] xl:max-w-[15vh] 2xl:min-w-[12vh] 2xl:max-w-[12vh] "
                                        }`}>

                                            <div className=" hidden  shadow-md lg:flex items-center justify-between pt-2 pb-2 p-4 ">
                                                <Avatar
                                                src={prestador?.AvatarUrl.avatarUrl}
                                                className={`${isOpen ? "" : ""} cursor-pointer`}
                                                onClick={() => setScreenSelected("perfil")}
                                                />


                                                <Button className="bg- text-desSec justify-end" onPress={() => toggleSidebar()} >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                                                </svg>
                                                </Button>
                                            </div>
                                            
                                            <div className='flex flex-row lg:grid gap-5 pt-5 p-2 '>
                                                {/* tela para o dashboard */}
                                                <div>
                                                    <Button
                                                    className={`w-full justify-start  transition-all ${screenSelected == 'painel' ? "bg-desSec text-white" : "bg-white text-prim"} `}
                                                    onPress={() => setScreenSelected("painel")}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                                        </svg>


                                                        {isOpen ? "Painel" : ""}
                                                        
                                                    </Button>
                                                </div>

                                                <div>
                                                    <Button
                                                    className={`w-full justify-start  transition-all ${screenSelected == 'perfil' ? "bg-desSec text-white" : "bg-white text-prim"} `}
                                                    onPress={() => setScreenSelected("perfil")}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                                        </svg>
                                                        
                                                        {isOpen ? "Perfil" : ""}
                                                        
                                                    </Button>
                                                </div>


                                                <div>
                                                    <Button
                                                    className={`w-full justify-start  transition-all ${screenSelected == 'pedidos' ? "bg-desSec text-white" : "bg-white text-prim"} `}
                                                    onPress={() => setScreenSelected("pedidos")}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                                                        </svg>

                                                        {isOpen ? "Meus pedidos" : ""}
                                                        
                                                    </Button>
                                                </div>

                                                <div>
                                                    <Button
                                                    className={`w-full justify-start  transition-all ${screenSelected == 'avaliacoes' ? "bg-desSec text-white" : "bg-white text-prim"} `}
                                                    onPress={() => setScreenSelected("avaliacoes")}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                        </svg>


                                                        {isOpen ? "Minhas Avaliações" : ""}
                                                        
                                                    </Button>
                                                </div>

                                                <div>
                                                    <Button
                                                    className={`w-full justify-start  transition-all ${screenSelected == 'datasBloqueadas' ? "bg-desSec text-white" : "bg-white text-prim"} `}
                                                    onPress={() => setScreenSelected("datasBloqueadas")}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                                                        </svg>



                                                        {isOpen ? "Dias disponíveis" : ""}
                                                        
                                                    </Button>
                                                </div>

                                                <div>
                                                    <Button
                                                    className={`w-full justify-start  transition-all ${screenSelected == 'servicos' ? "bg-desSec text-white" : "bg-white text-prim"} `}
                                                    onPress={() => setScreenSelected("servicos")}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                                                        </svg>




                                                        {isOpen ? "Serviços" : ""}
                                                        
                                                    </Button>
                                                </div>

                                                

                                            </div>
                                                
                                        </div>
                                        
                                        {screenSelected == "perfil" && (
                                            <section className='w-full gap-1 pb-[8vh] pt-[8vh] sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim'>

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
                                                                <img src={prestador?.AvatarUrl?.avatarUrl}
                                                                id='avatar' 
                                                                alt="foto de perfil" 
                                                                className="transition-all duration-200 rounded-full w-60 h-60  hover:bg-ter p-0.5 hover:bg-opacity-40 shadow-md cursor-pointer" 
                                                                onClick={()=> SetOpen(true)}
                                                                
                                                                />                                             
                                                            </div>
                                                            
                                                            <div className='flex flex-col gap-3 h-full max-w-full max-h-full pl-5 pr-5'>
                                                                <h1 className='text-xl text-ter'>{prestador?.name}</h1>
                                                                
                                                                <p className='text-prim text-center'>
                                                                    {calcularIdade(prestador?.data)} anos
                                                                </p>
                                                            </div>

                                                        </div>
                                                        <div >
                                                            <textarea className='text-prim border border-bord p-2 w-full min-h-[20vh]  lg:w-[80vh] xl:w-[100vh] lg:min-h-[40vh] lg:max-h-[40vh] rounded-md' value={prestador?.sobre} disabled ></textarea>
                                                        </div>
                                                    </div>

                                                    <h2 className="text-xl pt-10 text-prim font-semibold">Informações Pessoais</h2>
                                                    <div className="grid  sm:grid-cols-2 gap-5 pt-2">
                                                        
                                                        <div className="grid gap-2">
                                                            <label htmlFor="email" className="text-neutral-500">E-mail</label>
                                                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.email} />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <label htmlFor="telefone" className="text-neutral-500">Telefone</label>
                                                            <InputMask
                                                                ref={inputRef}
                                                                mask="(99) 99999-9999" 
                                                                maskChar={null}
                                                                className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled
                                                                id="telefone_1" 
                                                                type="text" 
                                                                placeholder="(00) 00000-0000" 
                                                                value={prestador?.telefone}
                                                            />
                                                        </div>

                                                    </div>

                                                    <div className="grid  sm:grid-cols-2 gap-5 pt-5">

                                                        <div className="grid gap-2">
                                                        <label htmlFor="rg" className="text-neutral-500">Estado Civil</label>
                                                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled 
                                                        value={estadoCivilTexto} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                        <label htmlFor="genero" className="text-neutral-500">Gênero</label>
                                                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.genero} />
                                                        </div>

                                                    </div>

                                                    <h2 className="text-xl pt-10 text-prim font-semibold">Informações Bancárias</h2>
                                                    <div className="grid sm:grid-cols-4 gap-5 pt-2">
                                                        <div className="grid gap-2">
                                                        <label htmlFor="telefone" className="text-neutral-500">Banco</label>
                                                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={bancoTexto} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                        <label htmlFor="rg" className="text-neutral-500">Agência</label>
                                                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.agencia} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                        <label htmlFor="genero" className="text-neutral-500">Conta</label>
                                                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.conta} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                        <label htmlFor="genero" className="text-neutral-500">Pix</label>
                                                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.pix} />
                                                        </div>
                                                    </div>

                                                    <h2 className="text-xl pt-10 text-prim font-semibold">Disponibilidade e Serviços</h2>
                                                    <div className="pt-2">
                                                        <span className="font-semibold text-prim pt-5 text-sm lg:text-lg">Serviços</span>
                                                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pb-5 pt-5">

                                                        {prestador?.UserServico.map((service) => (
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
                                                                defaultChecked={prestador?.DiasDisponiveis[0].dom}
                                                                disabled
                                                                
                                                                />
                                                                <label htmlFor="domingo">Domingo</label>
                                                            </div>
                                                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                                                <input 
                                                                type="checkbox" 
                                                                id="segunda" 
                                                                
                                                                className="cursor-pointer bg-neutral-200 placeholder:bg-neutral-200 border border-neutral-600 rounded-lg"
                                                                defaultChecked={prestador?.DiasDisponiveis[0].seg}
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

                                                                defaultChecked={prestador?.DiasDisponiveis[0].ter}
                                                                

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

                                                                defaultChecked={prestador?.DiasDisponiveis[0].quart}
                                                                

                                                                />
                                                                <label htmlFor="quarta">Quarta</label>
                                                            </div>
                                                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                                                <input 
                                                                type="checkbox" 
                                                                id="quinta" 
                                                                disabled
                                                                className="cursor-pointer bg-neutral-200 placeholder:bg-neutral-200 border border-neutral-600 rounded-lg"

                                                                defaultChecked={prestador?.DiasDisponiveis[0].qui}
                                                                

                                                                />
                                                                <label htmlFor="quinta">Quinta</label>
                                                            </div>
                                                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                                                <input 
                                                                type="checkbox" 
                                                                id="sexta" 
                                                                disabled
                                                                className="cursor-pointer bg-neutral-200 placeholder:bg-neutral-200 border border-neutral-600 rounded-lg"

                                                                defaultChecked={prestador?.DiasDisponiveis[0].sex}
                                                                

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

                                                                defaultChecked={prestador?.DiasDisponiveis[0].sab}
                                                                

                                                                />
                                                                <label htmlFor="sabado">Sábado</label>
                                                            </div>
                                                        </div>

                                                        </div>

                                                        <h2 className="text-xl pt-10 text-prim font-semibold">Endereço</h2>
                                                        <div className="grid sm:grid-cols-3 gap-5 pt-2">

                                                        <div className="grid gap-2">
                                                            <label htmlFor="cep" className="text-prim">CEP</label>
                                                            <InputMask 
                                                            ref={inputRef}
                                                            mask="99999-999"
                                                            maskChar={null}
                                                            className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled
                                                            id="cep" 
                                                            type="text" 
                                                            placeholder="CEP" 
                                                            value={prestador.cep}
                                                            
                                                            />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <label htmlFor="logradouro" className="text-prim">Logradouro</label>
                                                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.logradouro} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <label htmlFor="numero" className="text-prim">Número</label>
                                                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.numero} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <label htmlFor="complemento" className="text-prim">Complemento</label>
                                                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.complemento} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <label htmlFor="referencia" className="text-prim">Ponto de referência</label>
                                                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.referencia} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <label htmlFor="bairro" className="text-prim">Bairro</label>
                                                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.bairro} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <label htmlFor="cidade" className="text-prim">Cidade</label>
                                                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.cidade} />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <label htmlFor="estado" className="text-prim">Estado</label>
                                                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.estado} />
                                                        </div>

                                                        </div>
                                                        
                                                    </div>

                                                </div>
                                                
                                            </section>
                                        )}

                                        {screenSelected == "pedidos" && (
                                            <section className='w-full  gap-1 pb-[8vh] pt-[8vh] sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim'>
                                                <div className='p-5 flex flex-col gap-5'>
                                                <div className="flex flex-col sm:flex-row items-center gap-4 mb-5">
                                                        <Button
                                                        className='w-full border shadow-sm bg-trans text-desSec justify-start'
                                                        onPress={() => setScreenSelected("avaliacoes")}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                            </svg>


                                                            Minhas Avaliações
                                                            
                                                        </Button>
                                                        <input
                                                            type="text"
                                                            placeholder="Pesquisar"
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            className="border p-2 rounded-lg w-full border-bord focus:outline-bord"
                                                        />

                                                        <div className='flex justify-between w-full gap-5 items-center'>
                                                            <input
                                                                type="date"
                                                                value={startDate}
                                                                onChange={(e) => setStartDate(e.target.value)}
                                                                className="border p-2 rounded-lg w-full border-bord focus:outline-bord"
                                                                placeholder="Início"
                                                            />
                                                            <input
                                                                type="date"
                                                                value={endDate}
                                                                onChange={(e) => setEndDate(e.target.value)}
                                                                className="border p-2 rounded-lg w-full border-bord focus:outline-bord"
                                                                placeholder="Fim"
                                                            />

                                                        </div>


                                                </div>

                                               {agendamentosFiltrados && agendamentosFiltrados.length > 0 ? (
                                                agendamentosFiltrados.map((agendamento) => {
                                                    // Lógica de cálculo
                                                    const taxaPrestador = (valor) => valor * 0.75;
                                                    const ValorBruto = agendamento.valorLiquido + agendamento.descontoTotal;
                                                    const qtdAgendamentos = ValorBruto / agendamento.valorServico;
                                                    const descontoPorServico = agendamento.descontoTotal / qtdAgendamentos;
                                                    const valorLiquidoServico = agendamento.valorServico - descontoPorServico;

                                                    return (
                                                        <>
                                                            <div className="flex flex-col gap-3 shadow-lg shadow-bord rounded-lg p-5 justify-center items-start">
                                                                <div className="flex flex-col lg:flex-row gap-5 items-start w-full justify-between">
                                                                    <div className="flex flex-col gap-2 w-full">
                                                                        <div className="overflow-y-auto bg-white p-3 rounded-md text-ter w-full flex flex-col sm:flex-row sm:justify-between">
                                                                            <p>
                                                                                {agendamento.Servico} - {agendamento.horaServico} -{" "}
                                                                                {formatarData(new Date(agendamento?.dataServico).toISOString().split('T')[0])}
                                                                            </p>
                                                                            <p>Subtotal: {formatarMoeda(taxaPrestador(valorLiquidoServico))}</p>
                                                                            <div className="w-4/12 sm:w-auto text-center pt-2 sm:pt-0">
                                                                                <div
                                                                                    className={`p-2 rounded-md text-white ${
                                                                                        agendamento.status === "Agendado"
                                                                                            ? "bg-des"
                                                                                            : agendamento.status === "Iniciado"
                                                                                            ? "bg-desSec"
                                                                                            : agendamento.status === "Cancelado"
                                                                                            ? "bg-error"
                                                                                            : agendamento.status === "Realizado"
                                                                                            ? "text-sec bg-sec"
                                                                                            : ""
                                                                                    } `}
                                                                                >
                                                                                    {agendamento.status}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Accordion isCompact itemClasses={{ title: "text-prim" }}>
                                                                    <AccordionItem key={agendamento.id} title="Detalhes">
                                                                        <div className="mt-2">
                                                                            <div className="flex flex-col gap-7 text-prim overflow-y-auto max-h-[60vh]">
                                                                                <div className="text-justify flex flex-col gap-2">
                                                                                    <p>
                                                                                        <b>Serviço:</b> {agendamento?.Servico}
                                                                                    </p>
                                                                                    <p>
                                                                                        <b>Observação:</b>{" "}
                                                                                        {agendamento?.observacao
                                                                                            ? agendamento.observacao
                                                                                            : "Nenhuma observação."}
                                                                                    </p>
                                                                                    <p>
                                                                                        <b>Preço:</b> {formatarMoeda(taxaPrestador(valorLiquidoServico))}
                                                                                    </p>
                                                                                    <p>
                                                                                        <b>Data:</b>{" "}
                                                                                        {formatarData(new Date(agendamento?.dataServico).toISOString().split('T')[0])}
                                                                                    </p>
                                                                                    <div className="flex flex-col gap-2 max-w-[100vh]">
                                                                                        <p>
                                                                                            <b>Endereço:</b> {agendamento?.enderecoCliente}
                                                                                        </p>
                                                                                        <a
                                                                                            href={`https://www.google.com/maps/place/${encodeURIComponent(
                                                                                                agendamento?.enderecoCliente
                                                                                            )}`}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                        >
                                                                                            <Button className="w-full bg-sec text-white">
                                                                                                <svg
                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                    fill="none"
                                                                                                    viewBox="0 0 24 24"
                                                                                                    strokeWidth="1.5"
                                                                                                    stroke="currentColor"
                                                                                                    className="size-6"
                                                                                                >
                                                                                                    <path
                                                                                                        strokeLinecap="round"
                                                                                                        strokeLinejoin="round"
                                                                                                        d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                                                                                                    />
                                                                                                </svg>
                                                                                                Abrir com o Google Maps
                                                                                            </Button>
                                                                                        </a>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </AccordionItem>
                                                                </Accordion>
                                                            </div>
                                                        </>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-prim text-center flex flex-col justify-center items-center h-[70vh]">
                                                    <p>Você não possui nenhum agendamento</p>
                                                </div>
                                            )}
                                                </div>
                                                
                                            </section>
                                        )}

                                        {screenSelected == "avaliacoes" && (
                                            <section className='w-full gap-1 pb-[8vh] pt-[8vh] sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim'>
                                                <div className='p-5 flex flex-col gap-5'>
                                                    {/* Média de estrelas */}
                                                    <div className="lg:col-span-3  bg-white shadow-md rounded-lg p-6">
                                                        <h2 className="text-desSec text-lg font-semibold text-gray-600 mb-4">
                                                            Média de Estrelas
                                                        </h2>
                                                        <div className="flex flex-col gap-6">
                                                            {prestador?.Review && prestador?.Review?.length > 0 ? (
                                                                (() => {
                                                                    const totalEstrelas = prestador?.Review?.reduce((sum, avaliacao) => sum + (avaliacao.stars || 0), 0);
                                                                    const mediaEstrelas = (totalEstrelas / prestador?.Review?.length).toFixed(1);

                                                                    return (
                                                                        <p className="text-desSec text-3xl font-bold text-gray-800">{mediaEstrelas} ★</p>
                                                                    );
                                                                })()
                                                            ) : (
                                                                <p className="text-prim">Nenhuma avaliação recebida ainda.</p>
                                                            )}
                                                        </div>
                                                    </div>  
                                                    {prestador?.Review.length > 0 ? (
                                                        prestador?.Review?.map((avaliacao) => (
                                                            
                                                            <div key={avaliacao.id} className='avaliacoes p-5 overflow-y-auto max-h-96 flex flex-col gap-5 min-w-full shadow-lg shadow-bord rounded-md'>

                                                                <div className=' avaliacao flex gap-3   bg-opacity-30 rounded-md  '>
                                                                    <div className='flex flex-col w-full'>
                                                                        <div className="overflow-y-auto max-h-52 bg-white pt-2 rounded-md w-full min-h-20">
                                                                            <p className='text-prim'>{avaliacao?.comment === "" ? <span className='text-prim text-opacity-40'>Nenhum comentário</span>: avaliacao.comment}</p>
                                                                        </div>
                                                                        <div className='flex justify-center sm:justify-start gap-10'>
                                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                                <StarReview
                                                                                key={star}
                                                                                filled={star <= avaliacao?.stars}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))

                                                    ) : (
                                                        <div className='text-prim text-center flex flex-col justify-center items-center h-[70vh] '>
                                                            <p>Você não possui nenhuma avaliação no momento</p>
                                                        </div>
                                                    )}
                                                    

                                                </div>
                                                
                                            </section>
                                        )}

                                        {screenSelected == "datasBloqueadas" && (
                                            <section className='w-full gap-1 pb-[8vh] pt-[9vh] sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim'>
                                                
                                                <div className='w-full p-10 pb-0 pt-2'>
                                                    <div>
                                                        <h2 className='text-xl font-semibold'>Precisa mudar os seus dias disponveis na semana? </h2>
                                                        <p>Sem problemas, você pode editar quando quiser, sinta-se livre! :D </p>
                                                    </div>
                                                </div>
                                                <div className='p-10 flex flex-col md:flex-row gap-10 justify-around  items-start'>
                                                    <form className='w-full grid gap-2' onSubmit={handleSubmitDay(handleUpdateDiasDisponveis)}>
                                                        <div className='w-full grid grid-cols-3'>
                                                            
                                                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                                                <input 
                                                                type="checkbox" 
                                                                id="domingo" 
                                                                {...registerDay("dom", {required: true})}
                                                                className="days cursor-pointer"
                                                                defaultChecked={prestador?.DiasDisponiveis[0].dom}
                                                                />
                                                                <label htmlFor="domingo">Domingo</label>
                                                            </div>
                                                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                                                <input 
                                                                type="checkbox" 
                                                                id="segunda" 
                                                                {...registerDay("seg")}
                                                                className="days cursor-pointer"
                                                                defaultChecked={prestador?.DiasDisponiveis[0].seg}
                                                                />
                                                                <label htmlFor="segunda">Segunda</label>
                                                            </div>
                                                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                                                <input 
                                                                type="checkbox" 
                                                                id="terca" 
                                                                {...registerDay("ter")}
                                                                className="days cursor-pointer"
                                                                defaultChecked={prestador?.DiasDisponiveis[0].ter}
                                                                />
                                                                <label htmlFor="terca">Terça</label>
                                                            </div>
                                                        
                                                        
                                                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                                                <input 
                                                                type="checkbox" 
                                                                id="quarta" 
                                                                {...registerDay("quart")}
                                                                className="days cursor-pointer"
                                                                defaultChecked={prestador?.DiasDisponiveis[0].quart}
                                                                />
                                                                <label htmlFor="quarta">Quarta</label>
                                                            </div>
                                                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                                                <input 
                                                                type="checkbox" 
                                                                id="quinta" 
                                                                {...registerDay("qui")}
                                                                className="days cursor-pointer"
                                                                defaultChecked={prestador?.DiasDisponiveis[0].qui}
                                                                />
                                                                <label htmlFor="quinta">Quinta</label>
                                                            </div>
                                                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                                                <input 
                                                                type="checkbox" 
                                                                id="sexta" 
                                                                {...registerDay("sex")}
                                                                className="days cursor-pointer"
                                                                defaultChecked={prestador?.DiasDisponiveis[0].sex}
                                                                />
                                                                <label htmlFor="sexta">Sexta</label>
                                                            </div>
                                                        
                                                        
                                                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                                                <input 
                                                                type="checkbox" 
                                                                id="sabado" 
                                                                {...registerDay("sab")}
                                                                className="days cursor-pointer"
                                                                defaultChecked={prestador?.DiasDisponiveis[0].sab}
                                                                />
                                                                <label htmlFor="sabado">Sábado</label>
                                                            </div>
                                                            

                                                        </div>
                                                        <div>
                                                            <Button className='bg-white text-sec border border-sec w-full' type='submit' isDisabled={loadingDay}>
                                                                {loadingDay ? <Spinner className='text-white'/> : "Confirmar e atualizar"}
                                                            </Button>
                                                        </div>
                                                        <div className="mt-2 w-full">
                                                            {errorsDay.diasSemana && <p className="text-error opacity-75">{errorsDay.diasSemana.message}</p>}
                                                        </div>


                                                    </form>

                                                    
                                                </div>
                                                <div className='w-full p-10 pb-0 pt-0'>
                                                    <p className='font-semibold text-xl'>Houve um imprevisto?</p>
                                                    <p>sem problemas, você pode bloquear ou desbloquear especificamente o dia que você não vai está disponível :D</p>

                                                </div>
                                                <div className='p-10 flex flex-col md:flex-row gap-10 justify-around  items-start'>
                                                    <Calendar 
                                                        // onConfirmSelection={handleConfirmSelection}
                                                        selectedDates={selectedDates}
                                                        setSelectedDates={setSelectedDates}
                                                        maxSelection={numberOfDays} // Defina aqui o número máximo de seleções permitidas
                                                        blockDates={() => blockDates()}
                                                        loadingBlock={loadingBlock}
                                                        errorBlock={errorBlock}

                                                    />
                                                    
                                                    <div className='rounded-lg  md:min-h-[60vh] md:max-h-[50vh] w-full gap-2 flex flex-col max-h-[50vh] '>
                                                        <div className='w-full justify-center items-center text-center'>
                                                            <h2 className='text-desSec text-xl font-semibold text-center'>Datas Bloqueadas</h2>
                                                            
                                                        </div>
                                                        <div className='flex flex-col overflow-y-auto pb-2 gap-5'>
                                                            {prestador?.DiasBloqueados?.length == 0 ? (
                                                                <div className='flex flex-col w-full max-h-[40vh] text-center justify-center  '>
                                                                    <span className='opacity-30'>
                                                                        Nenuma data bloqueada
                                                                    </span>

                                                                </div>

                                                            ) : (
                                                                prestador?.DiasBloqueados?.length > 0 &&
                                                                prestador?.DiasBloqueados?.map((dataBloqueada) => (
                                                                        <div key={dataBloqueada.id} className=' rounded-lg'>
                                                                            <div className="  bg-white w-full opacity-100 rounded-lg flex items-center p-2   pb-2 shadow-md justify-between ">
                                                                                <div className='w-full sm:min-w-min'>
                                                                                    <span className='text-center'>
                                                                                        {formatarData(new Date(dataBloqueada.data).toISOString().split('T')[0])}
                                                                                    </span>
                                                                                </div>
                                                                                <div className='sm:min-w-min'>
                                                                                    <Button
                                                                                        className="bg-white justify-between min-w-full sm:min-w-min"
                                                                                        onPress={() => unlockDate(dataBloqueada.data)}
                                                                                        isDisabled={loadingUnlock}
                                                                                    >
                                                                                        <span className="text-sec">
                                                                                            Desbloquear
                                                                                        </span>

                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            fill="none"
                                                                                            viewBox="0 0 24 24"
                                                                                            strokeWidth="1.5"
                                                                                            stroke="currentColor"
                                                                                            className="size-4 text-sec"
                                                                                        >
                                                                                            <path
                                                                                                strokeLinecap="round"
                                                                                                strokeLinejoin="round"
                                                                                                d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                                                                                            />
                                                                                        </svg>
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))

                                                            )}


                                                        </div>

                                                    </div>
                                                
                                                    

                                                </div>
                                                
                                                
                                            </section>
                                        )}

                                        {screenSelected == "servicos" && (
                                            <section className='w-full gap-1 pt-[8vh] sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim'>
                                                <div className='p-7   flex flex-col gap-5'>
                                                    <div>
                                                        <h2 className='text-2xl font-semibold '>Serviços</h2>
                                                    </div>
                                                    <div className="w-full pb-10 ">
                                                        <form className='flex flex-col gap-5 ' onSubmit={handleSubmitService(handleUpdateServicos)}>
                                                            <div className="overflow-y-auto max-h-[60vh] lg:p-2 grid grid-cols-1 gap-5 lg:grid-cols-5 items-center lg:gap-5">
                                                                {servicos
                                                                .filter((servico) => servico.status)
                                                                .map((servico) => (
                                                                    <div key={servico.id} className="flex items-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            id={`servico-${servico.id}`}
                                                                            value={servico.id}
                                                                            checked={selectedServices.includes(servico.id)}
                                                                            onChange={() => toggleService(servico.id)}
                                                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                                        />
                                                                        <label
                                                                            htmlFor={`servico-${servico.id}`}
                                                                            className="ml-2 block text-sm text-gray-900"
                                                                        >
                                                                            {servico.nome}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className='flex flex-col w-full md:w-6/12 gap-2'>
                                                                <Button className=' bg-sec text-white' isDisabled={selectedServices.length > 0 ? false : true} type='submit'>
                                                                    {loadingServico ? <Spinner/> : "Confirmar"}
                                                                </Button>
                                                                
                                                                {serviceMessage && 
                                                                    <span className='text-center'>{serviceMessage}</span>
                                                                }
                                                            </div>


                                                        </form>
                                                        
                                                    </div>

                                                    <span className='opacity-50 flex items-center gap-2'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                                        </svg>

                                                        Selecione os serviços que você deseja realizar
                                                    </span>

                                                </div>
                                            </section>
                                        )}

                                        {screenSelected === "painel" && (
                                            <div className="md:pt-28 pt-[8vh] pb-[8vh] flex-1 p-6 gap-5 ">                                        
                                                {/* Grid do dashboard */}
                                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">                                        
                                                    {/* Solicitações do mês */}
                                                    <div className="bg-white shadow-md  rounded-lg p-6">
                                                        <h2 className="text-desSec text-sm lg:text-lg font-semibold text-gray-600 mb-4">
                                                            Solicitações do Mês
                                                        </h2>
                                                        <p className="text-desSec text-3xl font-bold text-gray-800">
                                                            {SolicitacoesTotalPrestador || 0}
                                                        </p>
                                                    </div>

                                                    {/* Total de agendamentos */}
                                                    <div className="bg-white shadow-md  rounded-lg p-6">
                                                        <h2 className="text-desSec text-sm lg:text-lg font-semibold text-gray-600 mb-4">
                                                            Total de Agendamentos
                                                        </h2>
                                                        <p className="text-desSec text-3xl font-bold text-gray-800">
                                                            {SolicitacoesGeraisPrestador || 0}
                                                        </p>
                                                    </div>

                                                    {/* Total de faturamento no mês */}
                                                    <div className="col-span-2 lg:col-span-1   bg-white shadow-md  rounded-lg p-6">
                                                        <h2 className="text-desSec text-sm lg:text-lg font-semibold text-gray-600 mb-4">
                                                            Faturamento no mês 
                                                        </h2>
                                                        <p className="text-desSec text-3xl font-bold text-gray-800">
                                                            {formatarMoeda(FaturamentoMes.toFixed(2) || "0.00")}
                                                        </p>
                                                    </div>

                                                    
                                                </div>

                                                {/* Próximo agendamento e média de estrelas */}
                                                <div className="flex flex-col md:flex-row gap-6 pt-5">
                                                    {/* Média de estrelas */}
                                                    <div className="lg:col-span-3  bg-white shadow-md  rounded-lg p-6 w-full">
                                                        <h2 className="text-desSec text-sm lg:text-lg font-semibold text-gray-600 mb-4">
                                                            Média de Estrelas
                                                        </h2>
                                                        <div className="flex flex-col gap-6">
                                                            {prestador?.Review && prestador?.Review?.length > 0 ? (
                                                                (() => {
                                                                    const totalEstrelas = prestador?.Review?.reduce((sum, avaliacao) => sum + (avaliacao.stars || 0), 0);
                                                                    const mediaEstrelas = (totalEstrelas / prestador?.Review?.length).toFixed(1);

                                                                    return (
                                                                        <p className="text-desSec text-3xl font-bold text-gray-800">{mediaEstrelas} ★</p>
                                                                    );
                                                                })()
                                                            ) : (
                                                                <p className="text-prim">Nenhuma avaliação recebida ainda.</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className='w-full'>
                                                        <h2 className="text-desSec text-lg font-semibold text-gray-600 mb-4 pt-2"> Próximo Agendamento </h2>
                                                        
                                                        {agendamentosFiltrados && agendamentosFiltrados.length > 0 ? (
                                                            (() => {
                                                                const hoje = new Date();
                                                                const proximoAgendamento = agendamentosFiltrados
                                                                    .filter(
                                                                        agendamento => 
                                                                            new Date(agendamento.dataServico) >= hoje && // Data futura ou atual
                                                                            agendamento.status === "Agendado" // Status "Agendado"
                                                                    )
                                                                    .sort((a, b) => new Date(a.dataServico) - new Date(b.dataServico))[0]; // Ordenar por proximidade

                                                                return proximoAgendamento ? (
                                                                    <div className="flex-1 w-full">
                                                                        <div className="flex flex-col gap-3 shadow-lg rounded-lg p-5">
                                                                            <div className='flex gap-5 justify-between'>
                                                                                <p> {proximoAgendamento.Servico}</p>
                                                                                <p> {new Date(proximoAgendamento.dataServico).toLocaleDateString('pt-BR', {
                                                                                    day: '2-digit',
                                                                                    month: 'long',
                                                                                    year: 'numeric'
                                                                                })}</p>
                                                                                <p>{proximoAgendamento.horaServico}</p>
                                                                            </div>
                                                                            <p> {proximoAgendamento.enderecoCliente}</p>

                                                                            <p>{taxaPrestador(proximoAgendamento.valorServico)}</p>

                                                                            <a 
                                                                                href={`https://www.google.com/maps/place/${encodeURIComponent(proximoAgendamento.enderecoCliente)}`} 
                                                                                target="_blank" 
                                                                                rel="noopener noreferrer"
                                                                            >
                                                                                <Button className="w-full bg-sec text-white mt-4">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 mr-2 inline-block">
                                                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                                                                                    </svg>
                                                                                    Abrir com o Google Maps
                                                                                </Button>
                                                                            </a>

                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-prim flex w-full">Nenhum agendamento futuro encontrado com status "Agendado".</p>
                                                                );
                                                            })()
                                                        ) : (
                                                            <p className="text-prim flex w-full">Nenhum agendamento encontrado.</p>
                                                        )}

                                                    </div>
                                                      
                                                    
                                                    
                                                </div>

                                            </div>
                                        )}
                                        <NavigationDiarista screenSelected={screenSelected} setScreenSelected={setScreenSelected}/>

                                    </div>

                                    <EditUserModal 
                                        Open={Open}
                                        SetOpen={() => SetOpen(false)} 
                                        userInfo={prestador} 
                                        // token={token} 
                                        onUserUpdated={handleUserUpdated}
                                        Urls={prestador?.AvatarUrl?.avatarUrl} 
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
                            </div>
                            
                        </div>
 
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" className="bg-desSec w-2/12 text-white" onPress={() => handleContinue()} >
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

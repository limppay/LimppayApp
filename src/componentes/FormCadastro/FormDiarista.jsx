import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {useEffect} from 'react'
import { useState} from "react"
import React, { useRef } from "react"
import { createUser, findAllServicos } from "../../services/api.js"
import axios from "axios"
import InputMask from "react-input-mask"
import User from "../../assets/img/diarista-cadastro/user.webp"
import {Tooltip} from "@nextui-org/tooltip";
import { Spinner } from "@nextui-org/react"
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter, useDisclosure} from "@nextui-org/modal";
'use client'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import {useNavigate } from 'react-router-dom';
import { Logo } from "../imports.jsx"

import {Button} from "@nextui-org/react";




export default function FormDiarista() {
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

    const [required, setRequired] = useState("")
    

    const navigate = useNavigate();
    // schema de validações do form
    const schema = yup.object({
        // scheam do prisma na API
        name: yup.string().trim().required("O nome é obrigatório"),

        genero: yup.string(),

        estadoCivil: yup.number().required("Estado civil é obrigatório").typeError("Estado Civil é obrigatório"),
        telefone: yup.string().trim().required("Telefone é obrigatório"),
        email: yup.string().trim().required("E-mail é obrigatório").email("Email inválido."),
        

        cidade:  yup.string(),
        estado: yup.string().typeError(""),
        cpfCnpj: yup.string().trim().required("O CPF é obrigatório").min(11, "Digite um CPF válido"),

        

        senha: yup.string().trim().required("A senha é obrigatório").min(6, "A senha deve ter no minimo 6 caracteres"),
        
        confirmarSenha: yup.string().trim().required("Confirme sua senha").oneOf([yup.ref("senha")], "As senhas devem ser iguais"),

        sobre: yup.string().trim().required("Sobre mim é obrigatório"),
        referencia:  yup.string(),

        data: yup
            .date()
            .typeError('Data de nascimento inválida')
            .required("Data de nascimento é obrigatória")
            .test('is-valid-date', 'Data deve ser uma data válida', (value) =>{
                if(!value) return false; //se o valor for nulo ou indefinido
                return !isNaN(value.getTime()); //Verifica se a data é válida
            })
            .min(new Date(1900, 0, 1), "Data de nascimento inválida") //Define uma data mínima
            .max(new Date(), "Data de nascimento não pode ser no futuro"), //Define que não pode ser uma data futura

        arquivoCurriculo: yup
            .mixed()
            .test("required", "Curriculo é obrigatório", (value) => {
            return value instanceof File; // Verifica se o valor é um arquivo
            })
            .test("fileSize", "O arquivo é muito grande", (value) => {
            return value && value.size <= 5000000; // Limita o tamanho do arquivo a 5MB (ajuste conforme necessário)
            })
            .test("fileType", "Formato de arquivo não suportado", (value) => {
            return value && ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type); // Limita os tipos permitidos
            }),

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

        servicosSelecionados: yup.array().required("Selecione um servico")

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

    const WatchGenero = watch("genero")

    useEffect(() => {
        if (selectedServices) {
          reset({
            servicosSelecionados: selectedServices,
            genero: WatchGenero
          });

        }
      }, [selectedServices, reset]);
    

    // onSubmit do Forms
    const onSubmit = async (data) => {

        setLoading(true)
        setMessage(null)
        setRequired(null)

        const cpfCnpjSemMascara = removerMascara(data.cpfCnpj);
        const telefoneSemMascara = removerMascara(data.telefone);

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

        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('genero', data.genero)
        formData.append('estadoCivil', data.estadoCivil)

        formData.append('telefone', telefoneSemMascara)

        formData.append('email', data.email)

        formData.append('data', dataNascimento)

        formData.append('cidade', data.cidade)
        formData.append('estado', data.estado)

        formData.append('cpfCnpj', cpfCnpjSemMascara)


        formData.append('senha', data.senha)
        formData.append('sobre', data.sobre)
        formData.append('referencia', data.referencia)

        formData.append('dom', data.dom)
        formData.append('seg', data.seg)
        formData.append('ter', data.ter)
        formData.append('quart', data.quart)
        formData.append('qui', data.qui)
        formData.append('sex', data.sex)
        formData.append('sab', data.sab)

        formData.append('servicosSelecionados', JSON.stringify(selectedServices) )

        formData.append('arquivoCurriculo', data.arquivoCurriculo);
        
        try {
            
            const response = await createUser(formData);
            reset()

            setModalIsOpen(true)

        } catch (error) {
            setLoading(false)
            console.error(error.message);
            setMessage(error.message)
        } finally {
            setLoading(false)
        }

      };


    const closeModal = () => {
        // setModalIsOpen(false)
        navigate("/diarista-login")
    }

    // Funções
    // Função de ativar o botão quando o termo for clicado
    const [termosCheck, setTermosCheck] = useState(true)
    useEffect(() => {
        const checkTermos = document.getElementById("termo")

        checkTermos.onclick = () => {
            setTermosCheck(!termosCheck)
        }
    })

    // função para selecionar os dias da semana
    useEffect(() => {
        const selectDays = document.getElementById("selectDays")
        const days = ['dom', 'seg', 'ter', 'quart', 'qui', 'sex', 'sab']

        const updateButtonState = () => {
            const allChecked = days.every(day => getValues(day))
            selectDays.value = allChecked ? "Desmarcar todos os dias" : "Selecionar todos os dias"
        };

        selectDays.onclick = () => {
            const allChecked = days.every(day => getValues(day));
            days.forEach(day => {
                setValue(day, !allChecked)
            })
            updateButtonState()
        };

        updateButtonState()
    }, [setValue, getValues])

    // função para validar se algum dia foi selecionado ou não
    useEffect(() => {
        const daysCheckboxes = document.querySelectorAll(".days")
        daysCheckboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', () => {
                const allDays = Array.from(daysCheckboxes).map(cb => cb.checked)
                if (allDays.some(day => day)) {
                    clearErrors('diasSemana')
                } else {
                    setError('diasSemana', { message: 'Selecione pelo menos um dia' })
                }
            });
        });

        return () => {
            daysCheckboxes.forEach((checkbox) => {
                checkbox.removeEventListener('change', () => {})
            });
        };
    }, [clearErrors, setError])
    

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

    const Banco = [
        {text: "Santander", value: 1}

    ]

    // states
    const [image, setImage] = useState(User)
    const [fileNames, setFileNames] = useState({
        docIdt: "Arquivo não selecionado",
        docCpf: "Arquivo não selecionado",
        docResidencia: "Arquivo não selecionado",
        docCurriculo: "Arquivo não selecionado",
    });
    const [loading, setLoading] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false) //modal de conta criado com sucesso
    const [cepError, setCepError] = useState("")
    const [message, setMessage] = useState(null);

    const [genero, setGenero] = useState('');
    const [outroGenero, setOutroGenero] = useState('');

    const[cpfCnpj, setcpfCnpj]=useState('')
    const inputRef = useRef(null)
    
    const watchCep = watch("cep");

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


    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["Limpeza"]));

    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", ""),
        [selectedKeys]
    );

    const handleSelectionChange = (keys) => {
        setSelectedKeys(keys);
        keys.forEach((key) => {
            setValue(key.toLowerCase(), true);
        });
    };
    
    
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

    const removerMascara = (valor) => {
        return valor.replace(/\D/g, ''); // Remove todos os caracteres que não são números
    };

    const [isOpenFoto, setIsOpenFoto] = useState(false);
    const [isOpenBio, setIsOpenBio] = useState(false);
    const [isOpenService, setIsOpenService] = useState(false);
    const [isOpenDia, setIsOpenDia] = useState(false);

    const handleToggleFoto = () => setIsOpenFoto(!isOpenFoto);
    const handleToggleBio = () => setIsOpenBio(!isOpenBio);
    const handleToggleService = () => setIsOpenService(!isOpenService);
    const handleToggleDia = () => setIsOpenDia (!isOpenDia);

  return (
    <>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                <h2 className="text-2xl text-desSec">Dados pessoais</h2>
            </div>
            
            <div className="lg:grid lg:grid-cols-2 lg:pl-9 pt-7 ">
                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col lg:mt-0 lg:p-0  max-w-full ">
                    <div className="flex items-center gap-2">
                        <label htmlFor="biografia" className="text-prim">Sobre mim</label>
                        <Tooltip
                        content="Em poucas palavras fale sobre você, para que os contratantes possam te conhecer e escolhe-lo para o serviço"
                        isOpen={isOpenBio}
                        onOpenChange={setIsOpenBio}
                        size="md"
                        radius="md"
                        shadow="sm"
                        placement="top"
                        showArrow
                        shouldFlip
                        >
                            <button type="button" onClick={handleToggleBio} onMouseEnter={() => setIsOpenBio(true)} onMouseLeave={() => setIsOpenBio(false)} className="w-5 h-5 text-white bg-prim rounded-full">
                                ?
                            </button>
                        </Tooltip>
                    </div>
                    <textarea  
                    id="biografia"
                    {...register("sobre")} 
                    className="border rounded-md border-bord p-3 pt-1 pb-1 min-h-[30vh] lg:max-h-[30vh] lg:min-h-30 focus:outline-ter text-prim lg:max-w-full  h-full"></textarea>
                    {errors.sobre && (
                        <span className="text-error opacity-75">{errors.sobre.message}</span>
                    )}
                </div>
                <div>
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


            </div>

            <div>
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
                    <label htmlFor="telefone" className="text-prim">Telefone</label>
                    <InputMask
                    ref={inputRef}
                    mask="(99) 99999-9999" 
                    maskChar={null}
                    className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                    id="telefone" 
                    type="text" 
                    placeholder="(00) 00000-0000" 
                    {...register("telefone")}
                    />
                    {errors.telefone && 
                    <span className="text-error opacity-75">{errors.telefone?.message}</span>}
                </div>
                
                
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
                
            </div>
            
            <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                <h3 className="text-xl text-desSec">Disponibilidade e serviços</h3>
            </div>

            <div className="mt-4 p-9 pt-0 pb-0 flex flex-col text-prim gap-3">
                <div className="flex items-center gap-2">
                    <p><b>Meus Serviços</b></p>
                    <Tooltip
                    content="Escolha os serviços que você deseja prestar"
                    isOpen={isOpenService}
                    onOpenChange={setIsOpenService}
                    size="md"
                    radius="md"
                    shadow="sm"
                    placement="top"
                    showArrow
                    shouldFlip
                    >
                        <button type="button" onClick={handleToggleService} onMouseEnter={() => setIsOpenService(true)} onMouseLeave={() => setIsOpenService(false)} className="w-5 h-5 text-white bg-prim rounded-full">
                            ?
                        </button>
                    </Tooltip>
                </div>

                <div className="w-full ">
                    <div className="overflow-y-auto max-h-[31vh] lg:p-2 grid grid-cols-1 gap-5 lg:grid-cols-5 items-center lg:gap-5">
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
                </div>
                    

                <div className="flex items-center gap-2">
                    <p><b>Dias disponíveis para trabalhar</b></p>
                    <Tooltip
                    content="Selecione apenas os dias em que você estará disponivel para trabalhar"
                    isOpen={isOpenDia}
                    onOpenChange={setIsOpenDia}
                    size="md"
                    radius="md"
                    shadow="sm"
                    placement="top"
                    showArrow
                    shouldFlip
                    >
                        <button type="button" onClick={handleToggleDia} onMouseEnter={() => setIsOpenDia(true)} onMouseLeave={() => setIsOpenDia(false)} className="w-5 h-5 text-white bg-prim rounded-full">
                            ?
                        </button>
                    </Tooltip>
                </div>
                <div className="mt-2">
                    <input id="selectDays" type="button" value="Selecionar todos os dias" className="p-2 border border-bord rounded-md cursor-pointer"/>
                </div>
                <div className="flex justify-between">
                    <div className="m-3 mb-0 ml-0 flex gap-2">
                        <input 
                        type="checkbox" 
                        id="domingo" 
                        {...register("dom", {required: true})}
                        className="days cursor-pointer"
                        />
                        <label htmlFor="domingo">Domingo</label>
                    </div>
                    <div className="m-3 mb-0 ml-0 flex gap-2">
                        <input 
                        type="checkbox" 
                        id="segunda" 
                        {...register("seg")}
                        className="days cursor-pointer"
                        />
                        <label htmlFor="segunda">Segunda</label>
                    </div>
                    <div className="m-3 mb-0 ml-0 flex gap-2">
                        <input 
                        type="checkbox" 
                        id="terca" 
                        {...register("ter")}
                        className="days cursor-pointer"
                        />
                        <label htmlFor="terca">Terça</label>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="m-3 mb-0 ml-0 flex gap-2">
                        <input 
                        type="checkbox" 
                        id="quarta" 
                        {...register("quart")}
                        className="days cursor-pointer"
                        />
                        <label htmlFor="quarta">Quarta</label>
                    </div>
                    <div className="m-3 mb-0 ml-0 flex gap-2">
                        <input 
                        type="checkbox" 
                        id="quinta" 
                        {...register("qui")}
                        className="days cursor-pointer"
                        />
                        <label htmlFor="quinta">Quinta</label>
                    </div>
                    <div className="m-3 mb-0 ml-0 flex gap-2">
                        <input 
                        type="checkbox" 
                        id="sexta" 
                        {...register("sex")}
                        className="days cursor-pointer"
                        />
                        <label htmlFor="sexta">Sexta</label>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="m-3 mb-0 ml-0 flex gap-2">
                        <input 
                        type="checkbox" 
                        id="sabado" 
                        {...register("sab")}
                        className="days cursor-pointer"
                        />
                        <label htmlFor="sabado">Sábado</label>
                    </div>
                </div>
                <div className="mt-2">
                    {errors.diasSemana && <p className="text-error opacity-75">{errors.diasSemana.message}</p>}
                </div>
             
            </div> 

            <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                <h2 className="text-2xl text-desSec">Endereço</h2>
                {errors.cep && 
                <span className="text-error opacity-75">{errors.cep?.message}</span>}
            </div>

            
            <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                <label htmlFor="cidade" className="text-prim">Cidade</label>
                <input 
                className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                id="cidade" 
                type="text" 
                placeholder="" 
                {...register("cidade")}
                
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
                
                />
                {errors.estado && 
                <span className="text-error opacity-75">{errors.estado?.message}</span>}
            </div>
            
            <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                <h2 className="text-2xl text-desSec">Anexos</h2>
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
                <Button type="submit" className="text-center w-full lg:w-1/2  bg-des rounded-md text-white p-2 hover:bg-sec transition-all duration-100 " id="buttonSubmit" isDisabled={termosCheck || loading}  >{loading ? <Spinner /> : 'Cadastrar'}</Button>

                <p className="text-md text-error text-center lg:text-start">{message}</p>
                <p className="text-md text-error text-center lg:text-start">{required}</p>
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
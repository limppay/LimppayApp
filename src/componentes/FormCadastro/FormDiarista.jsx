import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {useEffect} from 'react'
import { useState} from "react"
import React, { useRef } from "react"
import { createUser } from "../../services/api.js"
import axios from "axios"
import InputMask from "react-input-mask"
import User from "../../assets/img/diarista-cadastro/user.png"

'use client'
import { Dialog, DialogBackdrop, DialogPanel, Input } from '@headlessui/react'
import {useNavigate } from 'react-router-dom';
import { Logo } from "../imports.jsx"

import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";

/* 

    Atenção: Alguns techos de codigos abaixo foram comentados por motivos de testes.

*/

export default function FormDiarista() {
    const navigate = useNavigate();
    // schema de validações do form
    const schema = yup.object({
        // scheam do prisma na API
        name: yup.string().trim().required("O nome é obrigatório"),
        genero: yup.string(),
        estadoCivil: yup.number().required("Estado civil é obrigatório").typeError("Estado Civil é obrigatório"),
        telefone: yup.string().trim().required("Telefone é obrigatório"),
        email: yup.string().trim().required("E-mail é obrigatório").email("Email inválido."),
        cep:  yup.string().required("Preencha os campos abaixo").min(8, "Digite um cep válido"),
        logradouro:  yup.string(),
        numero:  yup.string().trim().required("Número é obrigatório"),
        complemento:  yup.string(),
        bairro:  yup.string(),
        cidade:  yup.string(),
        estado: yup.string().typeError(""),
        cpfCnpj: yup.string().trim().required("O CPF é obrigatório").min(11, "Digite um CPF válido"),
        rg: yup.string().trim().required("O RG é obrigatório"),
        banco: yup.number().required("Banco é obrigatório").typeError("Banco é obrigatório"),
        agencia:  yup.string().trim().required("Agência é obrigatório").matches(/^\d+$/, 'Apenas números'),
        conta:  yup.string().trim().required("Conta é obrigatório").matches(/^\d+$/, 'Apenas números'),
        pix: yup.string().trim().required("Pix é obrigatório"),

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

        arquivoFoto: yup
            .mixed()
            .test("required", "Foto de perfil é obrigatório", (value) => {
                return value instanceof File; // Verifica se o valor é um arquivo
            })
            .test("fileSize", "O arquivo é muito grande", (value) => {
                return value && value.size <= 5000000; // Limita o tamanho do arquivo a 5MB (ajuste conforme necessário)
            })
            .test("fileType", "Formato de arquivo não suportado", (value) => {
                return value && ['image/jpeg', 'image/png'].includes(value.type); // Limita os tipos permitidos
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

        const cpfCnpjSemMascara = removerMascara(data.cpfCnpj);
        const telefoneSemMascara = removerMascara(data.telefone);
        const cepSemMascara = removerMascara(data.cep);

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

        console.log(data)
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('genero', data.genero)
        formData.append('estadoCivil', data.estadoCivil)

        formData.append('telefone', telefoneSemMascara)

        formData.append('email', data.email)

        formData.append('data', dataNascimento)

        formData.append('cep', cepSemMascara)

        formData.append('logradouro', data.logradouro)
        formData.append('numero', data.numero)
        formData.append('complemento', data.complemento)
        formData.append('bairro', data.bairro)
        formData.append('cidade', data.cidade)
        formData.append('estado', data.estado)

        formData.append('cpfCnpj', cpfCnpjSemMascara)

        formData.append('rg', data.rg)
        formData.append('banco', data.banco)
        formData.append('agencia', data.agencia)
        formData.append('conta', data.conta)
        formData.append('pix', data.pix)
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

        formData.append('arquivoFoto', data.arquivoFoto);
        formData.append('arquivodt', data.arquivodt);
        formData.append('arquivoCpf', data.arquivoCpf);
        formData.append('arquivoResidencia', data.arquivoResidencia);
        formData.append('arquivoCurriculo', data.arquivoCurriculo);

        try {
          const response = await createUser(formData);
          reset()

          console.log('Usuário criado com sucesso:', response.data);
          setModalIsOpen(true)
          setLoading(false)
          
        } catch (error) {
            setLoading(false)
            console.error(error.message);
            setMessage(error.message)
        }

      };

    console.log(errors)

    const closeModal = () => {
        setModalIsOpen(false)
        navigate("/diarista-login")
    }

    // Funções
    // Função de ativar o botão quando o termo for clicado
    useEffect(() => {
        const buttonSubmit = document.getElementById("buttonSubmit")
        const checkTermos = document.getElementById("termo")
        checkTermos.onclick = () => {
            buttonSubmit.toggleAttribute("disabled")
            buttonSubmit.classList.toggle("opacity-50")
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
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [cepError, setCepError] = useState("")
    const [message, setMessage] = useState(null);

    const [genero, setGenero] = useState('');
    const [outroGenero, setOutroGenero] = useState('');

    const[cpfCnpj, setcpfCnpj]=useState('')
    console.log(cpfCnpj)
    const inputRef = useRef(null)
    
    const watchCep = watch("cep");
    
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["Limpeza"]));
    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", ""),
        [selectedKeys]
    );
    
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
    
      

  return (
    <>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                <h2 className="text-2xl text-desSec">Dados pessoais</h2>
            </div>
            
            <div className="lg:flex lg:items-center lg:justify-around">
                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col items-center">
                    <div className="flex flex-col justify-center items-center gap-2">
                        <label htmlFor="fotoPerfil" className="cursor-pointer flex justify-center flex-col items-center gap-1">
                            <img src={image} 
                            alt="foto de perfil" 
                            className="transition-all duration-200 rounded-full w-60 h-60 hover:bg-ter p-0.5 hover:bg-opacity-40 shadow-md" 
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
                        <span className="text-prim">Foto de perfil</span>
                        {errors.arquivoFoto && (
                            <span className="text-error opacity-75">{errors.arquivoFoto.message}</span>
                        )}


                    </div>
                </div>


                
                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col lg:mt-0 lg:w-1/2 lg:p-0 lg:mb-10 max-w-full">
                    <label htmlFor="biografia" className="text-prim">Sobre mim</label>
                    <textarea  
                    id="biografia"
                    {...register("sobre")} 
                    className="border rounded-md border-bord p-3 pt-1 pb-1 min-h-20 lg:min-h-40 focus:outline-ter text-prim lg:max-w-full max-h-1"></textarea>
                    {errors.sobre && (
                        <span className="text-error opacity-75">{errors.sobre.message}</span>
                    )}
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
            <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                <h3 className="text-xl text-desSec">Disponibilidade e serviços</h3>
            </div>


            <div className="mt-4 p-9 pt-0 pb-0 flex flex-col text-prim gap-3">
                <p><b>Meus Serviços</b></p>
                <div>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant="bordered" className="flex flex-wrap h-20 border border-bord">
                                {Array.from(selectedKeys).map((key) => (
                                    <span key={key} className="shadow-md text-prim rounded-md p-2" >{key}</span>
                                ))}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu 
                            aria-label="Multiple selection example"
                            variant="flat"
                            closeOnSelect={false}
                            disallowEmptySelection
                            selectionMode="multiple"
                            selectedKeys={selectedKeys}
                            onSelectionChange={setSelectedKeys}
                            className="bg-white rounded-md border border-bord shadow-lg  gap-5 flex flex-col"
                        >
                            <DropdownItem key="Limpeza" className={`check-icon ${selectedKeys.has("Limpeza") ? "bg-des text-white  mt-2" : "mt-2"}`}>
                                Limpeza 
                            </DropdownItem>
                            <DropdownItem key="Baba" className={`check-icon ${selectedKeys.has("Baba") ? "bg-des text-white mt-2" : "mt-2"}`}>Babá</DropdownItem>
                            <DropdownItem key="Cozinheira" className={`check-icon ${selectedKeys.has("Cozinheira") ? "bg-des text-white mt-2" : "mt-2"}`}>Cozinheira</DropdownItem>
                            <DropdownItem key="Eletricista" className={`check-icon ${selectedKeys.has("Eletricista") ? "bg-des text-white mt-2" : "mt-2"}`}>Eletricista</DropdownItem>
                            <DropdownItem key="Encanador" className={`check-icon ${selectedKeys.has("Encanador") ? "bg-des text-white mt-2" : "mt-2"}`}>Encanador</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <p><b>Dias disponíveis para trabalhar</b></p>
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
            
            <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                <h2 className="text-2xl text-desSec">Anexos</h2>
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
                <button type="submit" className="text-center w-full lg:w-1/2  bg-des rounded-md text-white p-2 hover:bg-sec transition-all duration-100 opacity-50" id="buttonSubmit" disabled>{loading ? 'Criando conta...' : 'Cadastrar'}</button>
                <p className="text-md text-error text-center lg:text-start">{message}</p>
            </div>
        </form>


        <Dialog open={modalIsOpen} onClose={setModalIsOpen} className="relative z-10">
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
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 justify-center flex ">
                            <button
                                type="button"
                                data-autofocus
                                onClick={closeModal}
                                className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white bg-desSec shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Fazer Login
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    </>
  )
}
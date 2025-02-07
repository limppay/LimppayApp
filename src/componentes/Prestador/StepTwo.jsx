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

export default function StepTwo({old, etapaCadastro}) {
    const { prestador } = usePrestador()
    const [openSucess, setOpenSucess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [image, setImage] = useState(User)
    
    
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
        control, 
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

    const [fileNames, setFileNames] = useState({
        docIdt: "Arquivo não selecionado",
        docCpf: "Arquivo não selecionado",
        docResidencia: "Arquivo não selecionado",
        docCurriculo: "Arquivo não selecionado",
    });

    const [isOpenFoto, setIsOpenFoto] = useState(false);
    const handleToggleFoto = () => setIsOpenFoto(!isOpenFoto);

    const Banco = [
        { text: "Bradesco", value: 800 },
        { text: "Pagseguro", value: 801 },
        { text: "Caixa Econômica", value: 802 },
        { text: "Banco C6", value: 803 },
        { text: "Banco da Amazonia", value: 804 },
        { text: "Santander", value: 805 },
        { text: "Banco Original", value: 806 },
        { text: "Nubank", value: 807 },
        { text: "Banco do Brasil", value: 808 },
        { text: "Itaú", value: 809 },
        { text: "Inter", value: 811 },
        { text: "Banrisul", value: 812 },
        { text: "Sicredi", value: 813 },
        { text: "Sicoob", value: 814 },
        { text: "BRB", value: 815 },
        { text: "Via Credi", value: 816 },
        { text: "Neon", value: 817 },
        { text: "Votorantim", value: 818 },
        { text: "Safra", value: 819 },
        { text: "Modal", value: 820 },
        { text: "Banestes", value: 821 },
        { text: "Unicred", value: 822 },
        { text: "Money Plus", value: 823 },
        { text: "Mercantil do Brasil", value: 824 },
        { text: "JP Morgan", value: 825 },
        { text: "Gerencianet Pagamentos do Brasil", value: 826 },
        { text: "BS2", value: 827 },
        { text: "Banco Topazio", value: 828 },
        { text: "Uniprime", value: 829 },
        { text: "Stone", value: 830 },
        { text: "Banco Daycoval", value: 831 },
        { text: "Rendimento", value: 832 },
        { text: "Banco do Nordeste", value: 833 },
        { text: "Citibank", value: 834 },
        { text: "PJBank", value: 835 },
        { text: "Cooperativa Central de Credito Noroeste Brasileiro", value: 836 },
        { text: "Uniprime Norte do Paraná", value: 837 },
        { text: "Global SCM", value: 838 },
        { text: "Next", value: 839 },
        { text: "Cora", value: 840 },
        { text: "Mercado Pago", value: 841 },
        { text: "BNP Paribas Brasil", value: 842 },
        { text: "Juno", value: 843 },
        { text: "Cresol", value: 844 },
        { text: "BRL Trust DTVM", value: 845 },
        { text: "Banco Banese", value: 846 },
        { text: "Banco BTG Pactual", value: 847 },
        { text: "Banco Omni", value: 848 },
        { text: "Acesso Soluções de Pagamento", value: 849 },
        { text: "CCR de São Miguel do Oeste", value: 850 },
        { text: "Polocred", value: 851 },
        { text: "Ótimo", value: 852 }
    ];
    

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

    return (
        <section className=' lg:flex justify-between w-full gap-1 pt-[10vh] lg:pt-[12vh] xl:pt-[14vh] '>
            <form className="flex flex-col w-full gap-5 lg:p-[5vh] lg:pt-[2vh] " onSubmit={handleSubmit(onSubmit)}>
                <h2 className='font-semibold text-2xl text-desSec p-[2vh] md:p-0 '>Complete seu cadastro</h2>   
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
                                    className="p-2  w-full hidden"
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

                    <div className='grid sm:grid-cols-2 w-full'>
                        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col overflow-hidden">
                            <label htmlFor="banco" className="text-prim">Banco</label>
                            <select  
                            id="banco"
                            defaultValue={prestador?.banco || ''} 
                            {...register("banco")}
                            className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim ">
                                <option value="" >Selecione</option>
                                {Banco.map((options, index) => (
                                    <option key={index} value={options.value}>{options.text}</option>
                                ))}
                            </select>
                            {errors.banco && 
                            <span className="text-error opacity-75">{errors.banco?.message}</span>}           
                        </div>
                        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col ">
                            <label htmlFor="agencia" className="text-prim">Agência</label>
                            <input 
                            className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter  "
                            id="agencia" 
                            type="text" 
                            placeholder="Somente números"
                            defaultValue={prestador?.agencia || ''} 
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
                            defaultValue={prestador?.conta || ''} 
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
                            defaultValue={prestador?.pix || ''} 
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
                            value={prestador?.rg || ''} 
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

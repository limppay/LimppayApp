import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {useEffect} from 'react'
import { useState} from "react"
import { createUser } from "../../services/api.js"


/* 

    Atenção: Alguns techos de codigos abaixo foram comentados por motivos de testes.

*/


export default function FormDiarista() {
    // schema de validações do form
    const schema = yup.object({
        // scheam do prisma na API
        name: yup.string().required("O nome é obrigatório"),
        genero: yup.string().required("Gênero é obrigatório"),
        estadoCivil: yup.number().required("Estado civil é obrigatório"),
        telefone: yup.string().required("Telefone é obrigatório").min(11, "Digite um telefone válido").matches(/^\d+$/, 'Apenas números'),
        email: yup.string().required("E-mail é obrigatório").email("Email inválido."),
        cep:  yup.string().required("CEP é obrigatório").min(8, "Digite um cep válido").matches(/^\d+$/, 'Apenas números'),
        endereco: yup.string().required("Endereço é obrigatório"),
        logradouro:  yup.string().required("Logradouro é obrigatório"),
        numero:  yup.string().required("Número é obrigatório"),
        complemento:  yup.string(),
        bairro:  yup.string().required("Bairro é obrigatório"),
        cidade:  yup.string().required("Cidade é obrigatório"),
        estado: yup.number().required("Estado é obrigatório"),
        cpfCnpj: yup.string().required("O CPF é obrigatório").min(11, "Digite um CPF válido").matches(/^\d+$/, 'Apenas números').max(11, "CPF deve ter 11 digitos"),
        rg: yup.string().required("O RH é obrigatório").min(8, "Digite um RH válido").matches(/^\d+$/, 'Apenas números').max(8, "RH deve ter 8 digitos"),
        banco: yup.number().required("Banco é obrigatório"),
        agencia:  yup.string().required("Agência é obrigatório").matches(/^\d+$/, 'Apenas números'),
        conta:  yup.string().required("Conta é obrigatório").matches(/^\d+$/, 'Apenas números'),
        senha: yup.string().required("A senha é obrigatório").min(6, "A senha deve ter no minimo 6 caracteres"),
        sobre: yup.string(),
        referencia:  yup.string(),

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

        // o banco de dados não tem um campo para "confirmPassword", então removi temporariamente.
        // confirmPassword: yup.string().required("Confirme sua senha").oneOf([yup.ref("senha")], "As senhas devem ser iguais"),
        
        // o banco de dados não tem um campo para "termo", então removi temporariamente.
        // termo: yup.boolean().required("Aceite os termos"),

        // a regra de negocio para os dias da semana, ainda ta em processo de revisão.
        // Dias da semana
        // domingo: yup.boolean(),
        // segunda: yup.boolean(),
        // terca: yup.boolean(),
        // quarta: yup.boolean(),
        // quinta: yup.boolean(),
        // sexta: yup.boolean(),
        // sabado: yup.boolean(),
        // diasSemana: yup.boolean().test('at-least-one-day', 'Selecione pelo menos um dia', function () {
        //     const { domingo, segunda, terca, quarta, quinta, sexta, sabado } = this.parent
        //     return domingo || segunda || terca || quarta || quinta || sexta || sabado
        // }),


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
        clearErrors
      } = useForm({
        resolver: yupResolver(schema),
      })

    // onSubmit do Forms
    const onSubmit = async (data) => {
        console.log(data)
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('genero', data.genero)
        formData.append('estadoCivil', data.estadoCivil)
        formData.append('telefone', data.telefone)
        formData.append('email', data.email)
        formData.append('cep', data.cep)
        formData.append('endereco', data.endereco)
        formData.append('logradouro', data.logradouro)
        formData.append('numero', data.numero)
        formData.append('complemento', data.complemento)
        formData.append('bairro', data.bairro)
        formData.append('cidade', data.cidade)
        formData.append('estado', data.estado)
        formData.append('cpfCnpj', data.cpfCnpj)
        formData.append('rg', data.rg)
        formData.append('banco', data.banco)
        formData.append('agencia', data.agencia)
        formData.append('conta', data.conta)
        formData.append('senha', data.senha)
        formData.append('sobre', data.sobre)
        formData.append('referencia', data.referencia)

        formData.append('arquivoFoto', data.arquivoFoto[0]);
        formData.append('arquivodt', data.arquivodt[0]);
        formData.append('arquivoCpf', data.arquivoCpf[0]);
        formData.append('arquivoResidencia', data.arquivoResidencia[0]);
        formData.append('arquivoCurriculo', data.arquivoCurriculo[0]);

        try {
          const response = await createUser(formData);
          console.log('Usuário criado com sucesso:', response.data);
        } catch (error) {
          console.error('Erro ao criar o usuário:', error);
        }

      };
    console.log(errors)

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

    // useEffect(() => {
    //     const selectDays = document.getElementById("selectDays")
    //     const days = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado']

    //     const updateButtonState = () => {
    //         const allChecked = days.every(day => getValues(day))
    //         selectDays.value = allChecked ? "Desmarcar todos os dias" : "Selecionar todos os dias"
    //     };

    //     selectDays.onclick = () => {
    //         const allChecked = days.every(day => getValues(day));
    //         days.forEach(day => {
    //             setValue(day, !allChecked)
    //         })
    //         updateButtonState()
    //     };

    //     updateButtonState()
    // }, [setValue, getValues])

    // // função para validar se algum dia foi selecionado ou não
    // useEffect(() => {
    //     const daysCheckboxes = document.querySelectorAll(".days")
    //     daysCheckboxes.forEach((checkbox) => {
    //         checkbox.addEventListener('change', () => {
    //             const allDays = Array.from(daysCheckboxes).map(cb => cb.checked)
    //             if (allDays.some(day => day)) {
    //                 clearErrors('diasSemana')
    //             } else {
    //                 setError('diasSemana', { message: 'Selecione pelo menos um dia' })
    //             }
    //         });
    //     });

    //     return () => {
    //         daysCheckboxes.forEach((checkbox) => {
    //             checkbox.removeEventListener('change', () => {})
    //         });
    //     };
    // }, [clearErrors, setError])
    

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

    const Banco = [
        {text: "Santander", value: 1}

    ]

    const Estados = [
        {text: "Amazonas", value: 1}
    ]

    // states
    const [image, setImage] = useState("src/assets/img/diarista-cadastro/user.png")
    const [fileNames, setFileNames] = useState({
        docIdt: "Arquivo não selecionado",
        docCpf: "Arquivo não selecionado",
        docResidencia: "Arquivo não selecionado",
        docCurriculo: "Arquivo não selecionado",
      });
      
    // Handles
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
                    <label htmlFor="Genero" className="text-prim">Gênero</label>
                    <select  
                    id="Genero"
                    {...register("genero")}
                    className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim">
                        <option value="" >Selecione</option>
                        {Genero.map((options, index) => (
                            <option key={index} value={options.text}>{options.text}</option>
                        ))}
                    </select>
                    {errors.genero && 
                    <span className="text-error opacity-75">{errors.genero?.message}</span>}           
                </div>
                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                    <label htmlFor="cpf" className="text-prim">CPF</label>
                    <input 
                    className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                    id="cpf" 
                    type="text" 
                    placeholder="Somente números" 
                    {...register("cpfCnpj")}
                    />
                    {errors.cpfCnpj && 
                    <span className="text-error opacity-75">{errors.cpfCnpj?.message}</span>}
                </div>
            
                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                    <label htmlFor="cpf" className="text-prim">RG</label>
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
                    <input 
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
                    <label htmlFor="EstadoCivil" className="text-prim">Estado Civil</label>
                    <select  
                    id="EstadoCivil"
                    {...register("estadoCivil")}
                    className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim">
                        <option value="" >Selecione</option>
                        {EstadoCivil.map((options, index) => (
                            <option key={index} value={options.value}>{options.text}</option>
                        ))}
                    </select>
                    {errors.estadoCivil && 
                    <span className="text-error opacity-75">{errors.estadoCivil?.message}</span>}           
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
            <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                <h3 className="text-xl text-desSec">Disponibilidade e serviços</h3>
            </div>


            {/* <div className="mt-4 p-9 pt-0 pb-0 flex flex-col text-prim">
                <p><b>Dias disponíveis para trabalhar</b></p>
                <div className="mt-2">
                    <input id="selectDays" type="button" value="Selecionar todos os dias" className="p-2 border border-bord rounded-md cursor-pointer"/>
                </div>
                <div className="flex justify-between">
                    <div className="m-3 mb-0 ml-0 flex gap-2">
                        <input 
                        type="checkbox" 
                        id="domingo" 
                        {...register("domingo", {required: true})}
                        className="days cursor-pointer"
                        />
                        <label htmlFor="domingo">Domingo</label>
                    </div>
                    <div className="m-3 mb-0 ml-0 flex gap-2">
                        <input 
                        type="checkbox" 
                        id="segunda" 
                        {...register("segunda")}
                        className="days cursor-pointer"
                        />
                        <label htmlFor="segunda">Segunda</label>
                    </div>
                    <div className="m-3 mb-0 ml-0 flex gap-2">
                        <input 
                        type="checkbox" 
                        id="terca" 
                        {...register("terca")}
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
                        {...register("quarta")}
                        className="days cursor-pointer"
                        />
                        <label htmlFor="quarta">Quarta</label>
                    </div>
                    <div className="m-3 mb-0 ml-0 flex gap-2">
                        <input 
                        type="checkbox" 
                        id="quinta" 
                        {...register("quinta")}
                        className="days cursor-pointer"
                        />
                        <label htmlFor="quinta">Quinta</label>
                    </div>
                    <div className="m-3 mb-0 ml-0 flex gap-2">
                        <input 
                        type="checkbox" 
                        id="sexta" 
                        {...register("sexta")}
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
                        {...register("sabado")}
                        className="days cursor-pointer"
                        />
                        <label htmlFor="sabado">Sábado</label>
                    </div>
                </div>
                <div className="mt-2">
                    {errors.diasSemana && <p className="text-error opacity-75">{errors.diasSemana.message}</p>}
                </div>
             
            </div> */}


            <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                <h2 className="text-2xl text-desSec">Endereço</h2>
            </div>

            <div className="lg:flex">
                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                    <label htmlFor="cep" className="text-prim">CEP</label>
                    <input 
                    className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                    id="cep" 
                    type="text" 
                    placeholder="Somente números" 
                    {...register("cep")}
                    />
                    {errors.cep && 
                    <span className="text-error opacity-75">{errors.cep?.message}</span>}
                </div>
                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                    <label htmlFor="endereco" className="text-prim">Endereço</label>
                    <input 
                    className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                    id="endereco" 
                    type="text" 
                    placeholder="Digite seu endereço" 
                    {...register("endereco")}
                    />
                    {errors.endereco && 
                    <span className="text-error opacity-75">{errors.endereco?.message}</span>}
                </div>
                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                    <label htmlFor="logradouro" className="text-prim">Logradouro</label>
                    <input 
                    className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                    id="logradouro" 
                    type="text" 
                    placeholder="" 
                    {...register("logradouro")}
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
            <div className="lg:flex">
                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                    <label htmlFor="complemento" className="text-prim">Complemento</label>
                    <input 
                    className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                    id="complemento" 
                    type="text" 
                    placeholder="Casa, apt, bloco, etc" 
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
                />
                {errors.cidade && 
                <span className="text-error opacity-75">{errors.cidade?.message}</span>}
            </div>
            <div className="mt-4 p-9 pt-0 pb-0 flex flex-col w-full">
                <label htmlFor="estado" className="text-prim">Estado</label>
                <select  
                id="estado"
                {...register("estado")}
                className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim">
                    <option value="" >Selecione</option>
                    {Estados.map((options, index) => (
                        <option key={index} value={options.value}>{options.text}</option>
                    ))}
                </select>
                {errors.estado && 
                <span className="text-error opacity-75">{errors.estado?.message}</span>}           
            </div>
            <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                <h2 className="text-2xl text-desSec">Anexos</h2>
            </div>
            
            {/* O fluxo para salvar arquivos no banco de dados, ainda ta em andamento, por motivos de teste o mesmo foi desabilitado*/}

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
                {errors.password && 
                <span className="text-error opacity-75">{errors.senha?.message}</span>}
            </div>


            {/* <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                <label htmlFor="confirmPassword" className="text-prim">Confirmar Senha</label>
                <input 
                className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                id="confirmPassword" 
                type="password"
                placeholder="" 
                {...register("confirmPassword")}
                />
                {errors.confirmPassword && 
                <span className="text-error opacity-75">{errors.confirmPassword?.message}</span>}
            </div> */}


            <div className="mt-4 text-prim pr-9 pl-9">
                <div className="flex gap-2 items-baseline">
                    <input 
                    type="checkbox" 
                    id="termo" 

                    // {...register("termo")} 

                    />
                    <label htmlFor="termo">Concordo com os termos de uso e contrato de serviço - <a href="#" className="text-des">Ver termos</a></label>
                </div>
            </div>
            <div className="mt-4 pl-9 pr-9 pb-9 ">
                <button type="submit" className="text-center w-full lg:w-1/2  bg-des rounded-md text-white p-2 hover:bg-sec transition-all duration-100 opacity-50" id="buttonSubmit" disabled> Cadastrar </button>
            </div>
        </form>
    </>
  )
}

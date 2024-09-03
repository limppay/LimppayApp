import { AnexoForm } from "../imports.jsx"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {useEffect} from 'react'
import { useState} from "react"



export default function FormDiarista() {
    // schema de validações do form
    const schema = yup.object({
        // perfil
        bio: yup.string(),
        name: yup.string().required("O nome é obrigatório"),

        // dados pessoais
        cpf: yup.string().required("O CPF é obrigatório").min(11, "Digite um CPF válido").matches(/^\d+$/, 'Apenas números').max(11, "CPF deve ter 11 digitos"),
        rg: yup.string().required("O RH é obrigatório").min(8, "Digite um RH válido").matches(/^\d+$/, 'Apenas números').max(8, "RH deve ter 8 digitos"),
        email: yup.string().required("E-mail é obrigatório").email("Email inválido."),
        telefone: yup.string().required("Telefone é obrigatório").min(11, "Digite um telefone válido").matches(/^\d+$/, 'Apenas números'),
        EstadoCivil: yup.string().required("Estado civil é obrigatório"),
        banco: yup.string().required("Banco é obrigatório"),
        agencia:  yup.string().required("Agência é obrigatório").matches(/^\d+$/, 'Apenas números'),
        conta:  yup.string().required("Conta é obrigatório").matches(/^\d+$/, 'Apenas números'),

        // endereço
        cep:  yup.string().required("CEP é obrigatório").min(8, "Digite um cep válido").matches(/^\d+$/, 'Apenas números'),
        logradouro:  yup.string().required("Logradouro é obrigatório"),
        numero:  yup.string().required("Número é obrigatório"),
        complemento:  yup.string(),
        pontoRef:  yup.string(),
        bairro:  yup.string().required("Bairro é obrigatório"),
        cidade:  yup.string().required("Cidade é obrigatório"),
        estado: yup.string().required("Estado é obrigatório"),

        // senha
        password: yup.string().required("A senha é obrigatório").min(6, "A senha deve ter no minimo 6 caracteres"),
        confirmPassword: yup.string().required("Confirme sua senha").oneOf([yup.ref("password")], "As senhas devem ser iguais"),

        // termo
        termo: yup.boolean().required("Aceite os termos"),

        // Dias da semana
        domingo: yup.boolean(),
        segunda: yup.boolean(),
        terca: yup.boolean(),
        quarta: yup.boolean(),
        quinta: yup.boolean(),
        sexta: yup.boolean(),
        sabado: yup.boolean(),
        diasSemana: yup.boolean().test('at-least-one-day', 'Selecione pelo menos um dia', function () {
            const { domingo, segunda, terca, quarta, quinta, sexta, sabado } = this.parent
            return domingo || segunda || terca || quarta || quinta || sexta || sabado
        }),
    })
    .required()
    
    
    // Hook Forms
    const {
        register,
        handleSubmit,
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
    const onSubmit = (data) => {
        console.log(data)
        reset()
        // window.location.href = "/seja-diarista.html"
    }
    console.log(errors)

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
        const days = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado']

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
    

    // chamar via banco de dados
    const EstadoCivil = [
        {text: "Solteiro(a)"},
        {text: "Casado(a)"},
        {text: "Divorciado(a)"},
        {text: "Viúvo(a)"},
        {text: "Separado(a)"},
    ]

    const Banco = [
        {text: "Santander"}

    ]

    const Estados = [
        {text: "Amazonas"}
    ]

    // profile
    const [image, setImage] = useState("src/assets/img/diarista-cadastro/user.png")
    // estou transformando o objeto/arquivo ( imagem ), em um link, para depois utilizar ele
    const handleImageChange = (event) => {
        setImage(URL.createObjectURL(event.target.files[0]));
    }
     
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
                            name="photoProfile" 
                            id="fotoPerfil" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            className=" p-2 w-full hidden"
                            />                      
                        </label>
                        <span className="text-prim">Foto de perfil</span>  
                    </div>
                </div>
                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col lg:mt-0 lg:w-1/2 lg:p-0 lg:mb-10 max-w-full">
                    <label htmlFor="biografia" className="text-prim">Sobre mim</label>
                    <textarea  
                    id="biografia"
                    {...register("bio")} 
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
                <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                    <label htmlFor="cpf" className="text-prim">CPF</label>
                    <input 
                    className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                    id="cpf" 
                    type="text" 
                    placeholder="Somente números" 
                    {...register("cpf")}
                    />
                    {errors.cpf && 
                    <span className="text-error opacity-75">{errors.cpf?.message}</span>}
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
                    {...register("EstadoCivil")}
                    className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim">
                        <option value="" >Selecione</option>
                        {EstadoCivil.map((options, index) => (
                            <option key={index} value={options.text}>{options.text}</option>
                        ))}
                    </select>
                    {errors.EstadoCivil && 
                    <span className="text-error opacity-75">{errors.EstadoCivil?.message}</span>}           
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
                        <option key={index} value={options.text}>{options.text}</option>
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
            <div className="mt-4 p-9 pt-0 pb-0 flex flex-col text-prim">
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
             
            </div>
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
                    {...register("pontoRef")}
                    />
                    {errors.pontoRef && 
                    <span className="text-error opacity-75">{errors.pontoRef?.message}</span>}
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
                        <option key={index} value={options.text}>{options.text}</option>
                    ))}
                </select>
                {errors.estado && 
                <span className="text-error opacity-75">{errors.estado?.message}</span>}           
            </div>
            {/* <SelectForm options={estados} text={"Selecione"} label={"Estado"}/> */}
            <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                <h2 className="text-2xl text-desSec">Anexos</h2>
            </div>
            <AnexoForm name={"docIdt"} text={"RG ou CNH"} span={"(frente e verso)"}/>
            <AnexoForm name={"docCpf"} text={"CPF"} span={"(frente e verso)"}/>
            <AnexoForm name={"docResidencia"} text={"Comprovante de residência"} span={""}/>
            <AnexoForm name={"docBancario"} text={"Comprovante bancário"} span={""}/>
            <AnexoForm name={"docCurriculo"} text={"Currículo"} span={""}/>
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
                {...register("password")}
                />
                {errors.password && 
                <span className="text-error opacity-75">{errors.password?.message}</span>}
            </div>
            <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
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
            </div>

            <div className="mt-4 text-prim pr-9 pl-9">
                <div className="flex gap-2 items-baseline">
                    <input 
                    type="checkbox" 
                    id="termo" 
                    {...register("termo")} 
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

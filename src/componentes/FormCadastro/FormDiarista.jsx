import { InputForm, SelectForm, CheckForm, AnexoForm, Perfil } from "../imports.jsx"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {useEffect} from 'react'
import { useState} from "react"

export default function FormDiarista() {
    const schema = yup.object({
        bio: yup.string(),
        name: yup.string().required("O nome é obrigatório"),
        cpf: yup.string().required("O CPF é obrigatório").min(11, "Digite um CPF válido").matches(/^\d+$/, 'Apenas números').max(11, "CPF deve ter 11 digitos"),
        rg: yup.string().required("O RH é obrigatório").min(8, "Digite um RH válido").matches(/^\d+$/, 'Apenas números').max(8, "RH deve ter 8 digitos"),
        email: yup.string().required("E-mail é obrigatório").email("Email inválido."),
        telefone: yup.string().required("Telefone é obrigatório").min(11, "Digite um telefone válido").matches(/^\d+$/, 'Apenas números'),
        EstadoCivil: yup.string().required("Estado Civil é obrigatório"),
        agencia:  yup.string().required("Agência é obrigatório").matches(/^\d+$/, 'Apenas números'),
        conta:  yup.string().required("Conta é obrigatório").matches(/^\d+$/, 'Apenas números'),
        cep:  yup.string().required("CEP é obrigatório").min(8, "Digite um cep válido").matches(/^\d+$/, 'Apenas números'),
        logradouro:  yup.string().required("Logradouro é obrigatório"),
        numero:  yup.string().required("Número é obrigatório"),
        complemento:  yup.string(),
        pontoRef:  yup.string(),
        bairro:  yup.string().required("Bairro é obrigatório"),
        cidade:  yup.string().required("Cidade é obrigatório"),
        password: yup.string().required("A senha é obrigatório").min(6, "A senha deve ter no minimo 6 caracteres"),
        confirmPassword: yup.string().required("Confirme sua senha").oneOf([yup.ref("password")], "As senhas devem ser iguais"),
        termo: yup.boolean().required("Aceite os termos")
    })
    .required()
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
      } = useForm({
        resolver: yupResolver(schema),
      })

    const onSubmit = (data) => {
        console.log(data)
        reset()
        window.location.href = "/seja-diarista.html"
    }
    console.log(errors)

    useEffect(() => {
        const buttonSubmit = document.getElementById("buttonSubmit")
        const checkTermos = document.getElementById("termo")
        checkTermos.onclick = () => {
            buttonSubmit.toggleAttribute("disabled")
            buttonSubmit.classList.toggle("opacity-50")
        }
        console.log(checkTermos)
    })

    // chamar via banco de dados
    const options = [
        {text: "Solteiro(a)"},
        {text: "Casado(a)"},
        {text: "Divorciado(a)"},
        {text: "Viúvo(a)"},
        {text: "Separado(a)"},
    ]
    const optionsBanco = [

    ]
    const estados = [
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
                <SelectForm 
                options={options} 
                name={"EstadoCivil"} 
                label={"Estado Civil"} 
                text={"Selecione"} 
                />
                {errors.EstadoCivil && 
                <span className="text-error opacity-75">{errors.EstadoCivil?.message}</span>}
            </div>

            <SelectForm 
            options={optionsBanco} 
            name={"banco"} 
            label={"Banco"} 
            text={"Selecione o Banco"}
             />

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
                    <input type="button" value="Selecionar todos os dias" className="p-2 border border-bord rounded-md"/>
                </div>
                <div className="flex justify-between">
                    <CheckForm label={"Domingo"} id={"checkbox1"} value={1}/>
                    <CheckForm label={"Segunda"} id={"checkbox2"} value={2}/>
                    <CheckForm label={"Terça"} id={"checkbox3"} value={3}/>
                </div>
                <div className="flex justify-between">
                    <CheckForm label={"Quarta"} id={"checkbox4"} value={4}/>
                    <CheckForm label={"Quinta"} id={"checkbox5"} value={5}/>
                    <CheckForm label={"Sexta"} id={"checkbox6"} value={6}/>
                </div>
                <div className="flex justify-between">
                    <CheckForm label={"Sabado"} id={"checkbox7"} value={7}/>
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
            <SelectForm options={estados} text={"Selecione"} label={"Estado"}/>
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

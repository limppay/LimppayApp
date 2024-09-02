import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {useEffect} from 'react'

export default function FormTeste() {
    const schema = yup.object({
        name: yup.string().required("O nome é obrigatório"),
        cpf: yup.string().required("O CPF é obrigatório").min(11, "Digite um CPF válido").matches(/^\d+$/, 'Apenas números').max(11, "CPF deve ter 11 digitos"),
        rg: yup.string().required("O RH é obrigatório").min(8, "Digite um RH válido").matches(/^\d+$/, 'Apenas números').max(8, "RH deve ter 8 digitos"),
        email: yup.string().required("E-mail é obrigatório").email("Email inválido."),
        senha: yup.string().required("A senha é obrigatório").min(6, "A senha deve ter no minimo 6 caracteres"),
        confirmPassword: yup.string().required("Confirme sua senha").oneOf([yup.ref("senha")], "As senhas devem ser iguais"),
        termo: yup.boolean().required("Aceite os termos")
    })
    .required()

    const {register, handleSubmit,formState: { errors }, reset
      } = useForm({
        resolver: yupResolver(schema),
    })

    const onSubmit = (data) => {
        console.log(data)
        reset()
        // window.location.href = "/seja-diarista.html"
    }

    console.log(errors)

    useEffect(() => {
        const buttonSubmit = document.getElementById("buttonSubmit")
        const checkTermos = document.getElementById("termos")

        checkTermos.onclick = () => {
            buttonSubmit.toggleAttribute("disabled")
            buttonSubmit.classList.toggle("opacity-50")
        }

        console.log(checkTermos)
    
    })


  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)} >
        <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
            <h2 className="text-2xl text-desSec">Dados pessoais</h2>
        </div>
        <div className="lg:flex">
            <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                <label htmlFor="name" className="text-prim">Nome</label>
                <input 
                className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                id="name"
                type="text" 
                placeholder="Nome completo" 
                {...register("name", {required: true})}
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
                <label htmlFor="senha" className="text-prim">Senha</label>
                <input 
                className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                id="senha" 
                type="password" 
                placeholder="" 
                {...register("senha")}
                />
                {errors.senha && 
                <span className="text-error opacity-75">{errors.senha?.message}</span>}
            </div>
            <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                <label htmlFor="senha" className="text-prim">Confirmar senha</label>
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
        </div>
        <div className="mt-4 text-prim pr-9 pl-9 flex gap-2">
            <input 
            type="checkbox" 
            id="termos"
            {...register("termo")} 
            />
            <label htmlFor="termos">Concordo com os termos de uso e contrato de serviço - <a href="#" className="text-des">Ver termos</a></label>
        </div>
        <div className="mt-4 pl-9 pr-9 pb-9 ">
            <button type="submit" className="text-center w-full lg:w-1/2  bg-des rounded-md text-white p-2  transition-all duration-100 opacity-50" id="buttonSubmit" disabled> Cadastrar </button>
        </div>
    </form>
  )
}

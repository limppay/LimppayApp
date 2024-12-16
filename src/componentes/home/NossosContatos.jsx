import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Field, Label, Switch } from '@headlessui/react'
import { sendMailContact } from '../../services/api'
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button, Spinner } from '@nextui-org/react'

export default function NossosContatos() {
    const [agreed, setAgreed] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const schema = yup.object({
        name: yup.string().required("Digite seu nome"),
        email: yup.string().required("E-mail é obrigatório"),
        message: yup.string().required("Menssagem é obrigatório")  
    })
    .required()

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        reset,
        setValue, 
        getValues,
        watch,
        clearErrors
        } = useForm({
        resolver: yupResolver(schema),
    })

    const onSubmit = async (data) => {
        console.log(data)
        setLoading(true)

        try {
            const response = await sendMailContact(data)

            console.log("Email enviado com sucesso! ", response.message)
            setMessage(response.message)
            setLoading(false)
            reset()
        } catch (error) {
            console.log(error)
            
        }
        
    }
        
    return (
        <section className="pt-0 lg:p-24  lg:pt-0 flex justify-center pb-10  " >
            <div className=" container  flex flex-col lg:flex-row justify-around items-baseline">
                <div className="flex flex-col md:w-1/2 p-10 sm:p-0 ">
                    {/* Seção à Esquerda */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-semibold text-desSec text-center lg:text-start">Fale Conosco</h2>
                        <p className="text-ter">
                            Entre em contato com nossa equipe. Estamos aqui para ajudar e esclarecer suas dúvidas. Caso precise de mais informações, utilize as opções abaixo para nos alcançar.
                        </p>
                        <div className="space-y-2 text-prim">
                            <div>
                                <p>Avenida Rodrigo Otávio, nº 6488, Coroado 69080-005</p>
                                <p>Manaus-AM</p>
                            </div>
                            <div>
                                <p>+55 (92) 99264-8251</p>
                            </div>
                            <div>
                                <p>contato@limppay.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='p-10 sm:p-0' >
                    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-16 max-w-xl sm:mt-20">
                        <div className="flex flex-col gap-x-8 gap-y-6">
                            <div className='flex justify-between w-full gap-10'>
                                <div className='w-full'>
                                    <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-prim">
                                        Nome
                                    </label>
                                    <div className="mt-2.5">
                                    <input
                                        id="first-name"
                                        {...register("name")}
                                        className="w-full border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                    />
                                    </div>
                                </div>
                                <div className='w-full'>
                                    <label htmlFor="email" className="block text-sm font-semibold leading-6 text-prim">
                                        Email
                                    </label>
                                    <div className="mt-2.5">
                                    <input
                                        id="email"
                                        {...register("email")}
                                        type="email"
                                        
                                        className="w-full border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter"
                                    />
                                    </div>
                                </div>
                            </div>
        
                            <div className="sm:col-span-2">
                                <label htmlFor="message" className="block text-sm font-semibold leading-6 text-prim">
                                Message
                                </label>
                                <div className="mt-2.5">
                                <textarea
                                    id="message"
                                    {...register("message")}
                                    className="block px-3.5 py-2 shadow-sm sm:text-sm sm:leading-6 w-full border rounded-md 2xl:max-h-[25vh] 2xl:min-h-[25vh]  border-bord p-3 pt-2 pb-2 focus:outline-prim text-prim"
                                    
                                />
                                </div>
                            </div>
                        </div>
                        <div className="mt-10">
                            <Button
                                type="submit"
                                className="p-2 rounded-md w-full max-w-full text-center bg-des text-white transition-all hover:bg-sec "
                                isDisabled={loading}
                            >
                                {loading ? <Spinner/> : "Enviar"}
                            </Button>
                        </div>
                        <div className='w-full flex justify-center text-center pt-2'>
                            {message && 
                                <span className='text-prim'>{message}</span>
                            }

                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
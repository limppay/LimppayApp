import React, { useRef, useState } from 'react'
import EditClienteModal from './EditClienteModal'
import { useUser } from '../../context/UserProvider'
import { Avatar } from '@nextui-org/avatar'
import User from "../../assets/img/diarista-cadastro/user.webp"
import InputMask from "react-input-mask"
import { fetchUserInfo } from '../../common/FetchUserInfo'
import { loggoutCliente } from '../../services/api'
import { useNavigate } from 'react-router-dom'
import { Button } from '@nextui-org/button'
import { Spinner } from '@nextui-org/react'

export default function Profile() {
    const { user, setUser } = useUser()
    const [Open, SetOpen] = useState(false)
    const inputRef = useRef(null)
    const [loggout, setLoggout] = useState(false)
    const navigate = useNavigate();

    const EstadoCivil = [
        { text: "Solteiro(a)", value: 1 },
        { text: "Casado(a)", value: 2 },
        { text: "Divorciado(a)", value: 3 },
        { text: "Viúvo(a)", value: 4 },
        { text: "Separado(a)", value: 5 },
    ];

    const estadoCivilTexto = EstadoCivil.find(item => item.value === user?.estadoCivil)?.text || '';

    const handleUserUpdated = () => {    
        fetchUserInfo(setUser)
    };

    const HandleExitUser = async () => {
        setLoggout(true)

        try {
            const response = await loggoutCliente()
            console.log(response)
            setUser(null)
            setLoggout(false)

        } catch (error) {
            console.log(error)

        } finally {
            navigate("/")
            window.location.reload()
            
        }
        
    };

    return (
        <section className='w-full gap-1 pb-[8vh] pt-[vh]  sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim'>
            <div className='lg:flex flex-col max-w-50 min-w-72 min-h-60 w-full bg-desSec md:bg-white
            '>
                <div className='flex flex-col lg:flex-row lg:justify-between w-full bg-desSec md:bg-white pt-[2vh] pb-[2vh] '>
                    <div className='text-center flex flex-col gap-2 md:p-[2vh] md:text-prim text-white'>
                        <div className="flex flex-col justify-center items-center gap-2">
                            <div className='flex items-center'>
                                <div>
                                    <p className=' cursor-pointer' onClick={()=> SetOpen(true)}>Editar Perfil</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-6 ">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </div>
                            <Avatar src={user?.AvatarUrl?.avatarUrl ? user?.AvatarUrl?.avatarUrl : User}
                            id='avatar' 
                            alt="foto de perfil" 
                            className="transition-all duration-200 rounded-full w-60 h-60  hover:bg-ter shadow-md cursor-pointer" 
                            onClick={()=> SetOpen(true)}
                            
                            />                                             
                        </div>
                        
                        <div className='flex flex-col gap-3 h-full max-w-full max-h-full pl-5 pr-5'>
                            <h1 className='text-xl '>{user?.name}</h1>

                        </div>

                    </div>
                </div>

                <div className='p-[2vh] rounded-t-2xl bg-white '>
                    <h2 className="text-xl text-prim font-semibold">Informações Pessoais</h2>
                    <div className="grid  sm:grid-cols-3 gap-5 pt-2">
                        
                        <div className="grid gap-2">
                            <label htmlFor="email" className="text-neutral-500">E-mail</label>
                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={user?.email} />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="telefone" className="text-neutral-500">Telefone 1</label>
                            <InputMask
                                ref={inputRef}
                                mask="(99) 99999-9999" 
                                maskChar={null}
                                className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled
                                id="telefone_1" 
                                type="text" 
                                placeholder="(00) 00000-0000" 
                                value={user?.telefone_1}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="telefone" className="text-neutral-500">Telefone 2</label>
                            <InputMask
                                ref={inputRef}
                                mask="(99) 99999-9999" 
                                maskChar={null}
                                className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled
                                id="telefone_2" 
                                type="text" 
                                placeholder="(00) 00000-0000" 
                                value={user?.telefone_2}
                            />
                        </div>

                    </div>

                    <div className="grid  sm:grid-cols-2 gap-5 pt-5">

                        <div className="grid gap-2">
                            <label htmlFor="rg" className="text-neutral-500">Estado Civil</label>
                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={estadoCivilTexto} />
                        </div>

                        <div className="grid gap-2">
                        <label htmlFor="genero" className="text-neutral-500">Gênero</label>
                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={user?.genero || ''} />
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
                            value={user?.EnderecoDefault[0]?.cep}
                            
                            />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="logradouro" className="text-prim">Logradouro</label>
                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={user?.EnderecoDefault[0]?.logradouro} />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="numero" className="text-prim">Número</label>
                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={user?.EnderecoDefault[0]?.numero} />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="complemento" className="text-prim">Complemento</label>
                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={user?.EnderecoDefault[0]?.complemento} />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="referencia" className="text-prim">Ponto de referência</label>
                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={user?.EnderecoDefault[0]?.referencia} />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="bairro" className="text-prim">Bairro</label>
                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={user?.EnderecoDefault[0]?.bairro} />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="cidade" className="text-prim">Cidade</label>
                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={user?.EnderecoDefault[0]?.cidade} />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="estado" className="text-prim">Estado</label>
                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={user?.EnderecoDefault[0]?.estado} />
                        </div>
                        
                    </div>

                    <div className='w-full pt-[2vh]'>
                        <Button 
                        className='
                        bg-white
                        lg:p-2
                        p-2
                        text-sm
                        sm:text-md
                        md:text-md
                        lg:text-md
                        border
                        border-error
                        text-error
                        rounded-md
                        w-full
                        '
                        onPress={() => HandleExitUser()}
                        isDisabled={loggout}
                        >
                        {loggout ? <Spinner className='text-white' color='danger'/> : "Sair"}
                        </Button>
                    </div>
                </div>

                
            </div>
            
            {/* Modal de edição */}
            <EditClienteModal 
                Open={Open}
                SetOpen={() => SetOpen(false)} 
                userInfo={user} 
                onUserUpdated={handleUserUpdated}
                Urls={user?.AvatarUrl?.avatarUrl} 
            /> 
        
        </section>
    )
}

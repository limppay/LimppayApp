import React, { useRef, useState } from 'react'
import { useUser } from '../../context/UserProvider'
import { Button, Spinner } from '@nextui-org/react'
import DeleteIcon from '@mui/icons-material/Delete'
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { fetchUserInfo } from '../../common/FetchUserInfo'
import { CreateEnderecosCliente, deleteEnderecosCliente } from '../../services/api'
import { formatarCep } from '../../common/FomatarCep'
import InputMask from "react-input-mask"
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter} from "@nextui-org/modal";
import axios from 'axios'

export default function AdressCliente({selectedEnderecoCliente, setSelectedEnderecoCliente, setCidade, setEstado, finding, handleProceed }) {
    const { user, setUser } = useUser()
    const [openCreateAdress, setOpenCreateAdress] = useState(false)
    const [isCreatingAdress, setIsCreatingAdress] = useState(false)
    const [isDeleteAdress, setIsDeleteAdress] = useState(false)
    const [cepError, setCepError] = useState("")    

    const schema = yup.object({
        clienteId: yup.string().default(user?.id),
        localServico: yup.string().required("Informe o nome do endereço").trim(),
        cep: yup.string().required("Cep é obrigatório"),
        logradouro: yup.string(),
        numero: yup.string().required("Número é obrigatório").trim(),
        complemento: yup.string(),
        referencia: yup.string(),
        bairro: yup.string(),
        cidade: yup.string(),
        estado: yup.string(),
    })

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        control,
        reset,
        setValue, 
        getValues,
        setError, 
        watch,
        clearErrors
        } = useForm({
        resolver: yupResolver(schema),
    })
    
    // Criar endereço do cliente
    const onSubmit = async (data) => {
        setIsCreatingAdress(true)

        try {
            const response = await CreateEnderecosCliente(data);
            await fetchUserInfo(setUser)
            reset()
            setOpenCreateAdress(false)
            setIsCreatingAdress(false)

        
        } catch (error) {
            console.error(error.message);
            setMessage(error.message)
            setIsCreatingAdress(false)

        } 

    }

    // array de estado
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
    

    // função para excluir um endereço do cliente
    const HandleDeleteEndereco = async (enderecoId) => {
        try {
            setIsDeleteAdress(true)
            const DeleteEndereco = await deleteEnderecosCliente(enderecoId);
            await fetchUserInfo()
            setIsDeleteAdress(false)

        } catch (error) {
            console.error("Erro ao excluir o endereço: ", error);
            setIsDeleteAdress(false)

        } 
    };

    const HandleCancel = (onClose) => {
        onClose()
        reset()
    }

    // evita que ocorra um erro caso o usuario não esteja logado
    if(!user) {
        return null
    }

    return (
        <div className='flex flex-col justify-between pb-[8vh]  max-h-[85vh] min-h-[80vh] gap-10'>
            <div className='grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 pt-5 gap-10 overflow-auto max-h-[65vh] sm:max-h-[100vh] scrollbar-hide justify-items-center'>
                {/* endereço padrão do cliente */}
                <div 
                    className={`border-2 border-bord rounded-lg transition-all max-w-[40vh] min-w-[40vh] sm:max-w-full sm:min-w-full min-h-[30vh]
                        ${user?.EnderecoDefault[0] ? selectedEnderecoCliente == user?.EnderecoDefault[0].id ? 'border-sec shadow-sm shadow-sec bg-secsec bg-opacity-20' : 'hover:border-sec border-bord' : "" }`
                    }

                    onClick={() => {
                        setSelectedEnderecoCliente(user?.EnderecoDefault[0].id)
                        setCidade(user?.EnderecoDefault[0].cidade)
                        setEstado(user?.EnderecoDefault[0].estado)
                    }}

                >
                    <div className={`border-b-2 border-bord p-3 
                    ${
                        user?.EnderecoDefault[0] ?
                        selectedEnderecoCliente == user?.EnderecoDefault[0].id ? "border-sec" : "border-bord" : ""
                        
                    }`}>

                        <h1 className={` font-semibold 
                            ${
                                user?.EnderecoDefault[0] ?
                                selectedEnderecoCliente == user?.EnderecoDefault[0].id ? "text-sec" : "text-prim" : ""
                            
                            } `}
                            
                            >
                                
                            {user?.EnderecoDefault[0] ? selectedEnderecoCliente == user?.EnderecoDefault[0].id ? "Serviço será feito aqui" : "Selecionar endereço": ""}
                        </h1>

                    </div>
                    <div className='p-5 text-start flex flex-col text-prim'>
                        <h2 className='text-prim font-semibold pb-2'>Endereço principal</h2>
                        <p>{user?.EnderecoDefault[0]?.logradouro}, {user?.EnderecoDefault[0]?.numero}</p> 
                        <p>{user?.EnderecoDefault[0]?.complemento}</p> 
                        <p>{user?.EnderecoDefault[0]?.bairro}</p> 
                        <p>{user?.EnderecoDefault[0]?.cidade}, {user?.EnderecoDefault[0]?.estado} - {formatarCep(user?.EnderecoDefault[0]?.cep)} </p> 
                    </div>

                </div>

                {/* endereços do cliente ( caso tenha ) */}
                {user?.EnderecosCliente.map((endereco) => (
                    <div  
                        key={endereco.id} 
                        className={`border-2 border-bord rounded-lg transition-all w-full min-h-[30vh]
                        ${selectedEnderecoCliente && selectedEnderecoCliente.id === endereco.id ? 'border-sec shadow-sm shadow-sec' : 'border-bord' }
                        ${isDeleteAdress && selectedEnderecoCliente.id == endereco.id ? "border-none shadow-white" : "hover:border-sec"}`}
                        onClick={() => {
                            setSelectedEnderecoCliente(endereco)
                            setCidade(endereco.cidade)
                            setEstado(endereco.estado)
                        }}
                    >
                        {isDeleteAdress && selectedEnderecoCliente.id == endereco.id ? (
                            <div className='rounded-md w-full h-full flex items-center justify-center  text-white'>
                                <Spinner size='lg'/>
                            </div>

                        ) : (
                            <>
                                <div className={`border-b-2 border-bord p-3 ${selectedEnderecoCliente && selectedEnderecoCliente.id === endereco.id ? "border-sec" : "border-bord"} `}>
                                    <h1 className={` font-semibold ${selectedEnderecoCliente && selectedEnderecoCliente.id === endereco.id ? "text-sec" : "text-prim"} `}>{selectedEnderecoCliente && selectedEnderecoCliente.id === endereco.id ? "Serviço será feito aqui" : "Selecionar endereço"}</h1>
                                </div>
                                <div className='p-5 text-start flex flex-col text-prim'>
                                    <h2 className='text-prim font-semibold pb-2'>{endereco?.localServico}</h2>
                                    <p>{endereco?.logradouro}, {endereco?.numero}</p> 
                                    <p>{endereco?.complemento}</p> 
                                    <p>{endereco?.bairro}</p> 
                                    <p>{endereco?.cidade}, {endereco?.estado} - {formatarCep(endereco?.cep)} </p> 
                                    <div className='text-start pt-2'>
                                        <Button
                                            onPress={() => (HandleDeleteEndereco(endereco.id))}
                                            className='p-0 justify-start min-w-min bg-white '
                                        >
                                            <DeleteIcon style={{ fontSize: 24, color: 'red' }} /> 
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {/* botão para criar novo endereço */}
                <div className='w-full flex flex-col justify-center items-center '>
                    <Button 
                        className='p-2 border bg-desSec sm:bg-white sm:text-desSec  rounded-md text-white text-sm w-full sm:min-h-[30vh]'
                        onPress={() => setOpenCreateAdress(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>  
                    </Button>
                </div>
                
                {/* modal de criar um novo endereço */}
                <Modal 
                    backdrop="opaque" 
                    isOpen={openCreateAdress} 
                    onClose={setOpenCreateAdress}
                    classNames={{
                        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
                        body: "bg-white",
                        header: "bg-white",
                    }}
                    placement='center'
                    className="max-w-[40vh] sm:min-w-[80vh]"
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 text-desSec">Cadastrar novo endereço</ModalHeader>
                                <ModalBody>
                                    <form 
                                        className={`transition-all duration-150 pt-0 flex flex-col gap-5 w-full`} 
                                        onSubmit={handleSubmit(onSubmit)}
                                    >
                                        <div className='overflow-auto h-[65vh] lg:h-[55vh]'>
                                            <div className="mt-4  pt-0 pb-0 flex flex-col">
                                                <label htmlFor="localServico" className="text-prim">Local do serviço</label>
                                                <input 
                                                className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                                id="localServico" 
                                                type="text" 
                                                placeholder="nome do endereço" 
                                                {...register("localServico")}
                                                disabled={isCreatingAdress}
                                                />
                                                {errors.localServico && 
                                                <span className="text-error opacity-75">{errors.localServico?.message}</span>}
                                            </div>
                                            <div className="mt-4  pt-0 pb-0 flex flex-col">
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
                                                            disabled={isCreatingAdress}
                                                        />
                                                    )}
                                                />

                                                {cepError && <p className="text-error text-sm mt-1">{cepError}</p>}
                                            </div>
                                            <div className="mt-4  pt-0 pb-0 flex flex-col">
                                                <label htmlFor="logradouro" className="text-prim">Logradouro</label>
                                                <input 
                                                className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                                id="logradouro" 
                                                type="text" 
                                                placeholder="" 
                                                {...register("logradouro")}
                                                readOnly
                                                disabled={isCreatingAdress}

                                                />
                                                {errors.logradouro && 
                                                <span className="text-error opacity-75">{errors.logradouro?.message}</span>}
                                            </div>
                                            <div className="mt-4  pt-0 pb-0 flex flex-col">
                                                <label htmlFor="numero" className="text-prim">Número</label>
                                                <input 
                                                className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                                id="numero" 
                                                type="text" 
                                                placeholder="" 
                                                disabled={isCreatingAdress}
                                                {...register("numero")}
                                                />
                                                {errors.numero && 
                                                <span className="text-error opacity-75">{errors.numero?.message}</span>}
                                            </div>
                                            <div className="mt-4  pt-0 pb-0 flex flex-col">
                                                <label htmlFor="complemento" className="text-prim">Complemento</label>
                                                <input 
                                                className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                                id="complemento" 
                                                type="text" 
                                                placeholder="Casa, apt, bloco, etc"
                                                maxLength="100" 
                                                disabled={isCreatingAdress}
                                                {...register("complemento")}
                                                />
                                                {errors.complemento && 
                                                <span className="text-error opacity-75">{errors.complemento?.message}</span>}
                                            </div>
                                            <div className="mt-4  pt-0 pb-0 flex flex-col">
                                                <label htmlFor="pontoRef" className="text-prim">Ponto de Referência</label>
                                                <input 
                                                className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                                id="pontoRef" 
                                                type="text" 
                                                disabled={isCreatingAdress}
                                                placeholder="" 
                                                maxLength="150"
                                                {...register("referencia")}
                                                />
                                                {errors.pontoRef && 
                                                <span className="text-error opacity-75">{errors.referencia?.message}</span>}
                                            </div>
                                            <div className="mt-4  pt-0 pb-0 flex flex-col">
                                                <label htmlFor="bairro" className="text-prim">Bairro</label>
                                                <input 
                                                className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                                disabled={isCreatingAdress}
                                                id="bairro" 
                                                type="text" 
                                                placeholder="" 
                                                {...register("bairro")}
                                                readOnly
                                                />
                                                {errors.bairro && 
                                                <span className="text-error opacity-75">{errors.bairro?.message}</span>}
                                            </div>

                                            <div className="mt-4  pt-0 pb-0 flex flex-col">
                                                <label htmlFor="cidade" className="text-prim">Cidade</label>
                                                <input 
                                                className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                                id="cidade" 
                                                disabled={isCreatingAdress}
                                                type="text" 
                                                placeholder="" 
                                                {...register("cidade")}
                                                readOnly
                                                />
                                                {errors.cidade && 
                                                <span className="text-error opacity-75">{errors.cidade?.message}</span>}
                                            </div>

                                            <div className="mt-4  pt-0 pb-0 flex flex-col">
                                                <label htmlFor="estado" className="text-prim">Estado</label>
                                                <input 
                                                className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                                id="estado" 
                                                disabled={isCreatingAdress}
                                                type="text" 
                                                placeholder=""
                                                {...register("estado")}
                                                readOnly
                                                />
                                                {errors.estado && 
                                                <span className="text-error opacity-75">{errors.estado?.message}</span>}
                                            </div>
                                        </div>

                                        <ModalFooter className='bg-none shadow-none p-0 pt-[2vh]'>
                                            <Button color="danger" variant="light" onPress={() => (HandleCancel(onClose))} isDisabled={isCreatingAdress} >
                                                Cancelar
                                            </Button>

                                            <Button className='bg-desSec text-white' type='submit' isDisabled={isCreatingAdress} >
                                                {isCreatingAdress ? <Spinner/> : "Criar"}
                                            </Button>

                                        </ModalFooter>
                                        
                                    </form>
                            
                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>

            </div>

            {selectedEnderecoCliente && (
                <div className='flex justify-center  border-b border-bord'>
                    <Button
                        type="button"
                        data-autofocus
                        className="p-2 rounded-md 
                        text-center
                        text-white 
                        bg-des         
                        hover:text-white transition-all
                        duration-200
                        hover:bg-sec hover:bg-opacity-75
                        hover:border-trans
                        flex 
                        items-center
                        justify-center
                        text-sm
                        gap-2
                        w-full
                        "
                        onPress={() => handleProceed()}
                        isDisabled={finding}
                    >
                        {finding ? <Spinner /> : "Selecionar e prosseguir"}  
                    </Button>
                </div>
            )}

        </div>
    )
}

import React, { useRef, useState } from 'react'
import { usePrestador } from '../../context/PrestadorProvider'
import { Avatar } from '@nextui-org/avatar'
import { calcularIdade } from "../../common/CalcularIdade"
import InputMask from "react-input-mask"
import EditUserModal from './EditUserModal'
import { fetchPrestadorInfo } from "../../common/FetchPrestadorInfo"
import { Button } from '@nextui-org/button'

export default function Profile() {
    const { prestador, setPrestador } = usePrestador()
    const[Open, SetOpen] = useState(false)
    const inputRef = useRef(null)

    const EstadoCivil = [
        { text: "Solteiro(a)", value: 1 },
        { text: "Casado(a)", value: 2 },
        { text: "Divorciado(a)", value: 3 },
        { text: "Viúvo(a)", value: 4 },
        { text: "Separado(a)", value: 5 },
    ];

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

    const estadoCivilTexto = EstadoCivil.find(item => item.value === prestador?.estadoCivil)?.text || '';
    const bancoTexto = Banco.find(item => item.value === prestador?.banco)?.text || '';

    
    const handleUserUpdated = () => {
        fetchPrestadorInfo(setPrestador)
    };

    return (
        <section className='w-full gap-1 overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim   sm:bg-white '>
            <div className='lg:flex flex-col bg-desSec sm:bg-white max-w-50 min-w-72 min-h-60 pt-5 w-full 
            '>
                <div className='flex flex-col lg:flex-row lg:justify-between w-full  p-5'>
                    <div className='text-center flex flex-col gap-2'>
                        <div className="flex flex-col justify-center items-center gap-2">
                            <div className='flex items-center'>
                                <div>
                                    <p className=' text-white sm:text-prim cursor-pointer' onClick={()=> SetOpen(true)}>Editar Perfil</p>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-6 text-white sm:text-prim">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </div>
                            <Avatar 
                                src={prestador?.AvatarUrl?.avatarUrl}
                                id='avatar' 
                                alt="foto de perfil" 
                                className="transition-all duration-200 w-60 h-60  hover:bg-ter shadow-md cursor-pointer" 
                                onClick={()=> SetOpen(true)}
                            
                            />                                             
                        </div>
                        
                        <div className='flex flex-col gap-3 h-full max-w-full max-h-full pl-5 pr-5'>
                            <h1 className='text-xl sm:text-ter text-white'>{prestador?.name}</h1>
                            
                            <p className='sm:text-prim text-white text-center'>
                                {calcularIdade(prestador?.data)} anos
                            </p>
                        </div>

                    </div>
                    <div >
                        <textarea className='sm:text-prim border-trans sm:border text-white  sm:border-bord p-2 w-full min-h-[20vh]  lg:w-[80vh] xl:w-[100vh] lg:min-h-[40vh] lg:max-h-[40vh] rounded-md' value={prestador?.sobre} disabled ></textarea>
                    </div>
                </div>

                <div className='bg-white p-5 rounded-t-2xl'>
                    <h2 className="text-xl pt-10 text-prim font-semibold">Informações Pessoais</h2>
                    <div className="grid  sm:grid-cols-2 gap-5 pt-2">
                        
                        <div className="grid gap-2">
                            <label htmlFor="email" className="text-neutral-500">E-mail</label>
                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.email} />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="telefone" className="text-neutral-500">Telefone</label>
                            <InputMask
                                ref={inputRef}
                                mask="(99) 99999-9999" 
                                maskChar={null}
                                className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled
                                id="telefone_1" 
                                type="text" 
                                placeholder="(00) 00000-0000" 
                                value={prestador?.telefone}
                            />
                        </div>

                    </div>

                    <div className="grid  sm:grid-cols-2 gap-5 pt-5">

                        <div className="grid gap-2">
                        <label htmlFor="rg" className="text-neutral-500">Estado Civil</label>
                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled 
                        value={estadoCivilTexto} />
                        </div>

                        <div className="grid gap-2">
                        <label htmlFor="genero" className="text-neutral-500">Gênero</label>
                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.genero} />
                        </div>

                    </div>

                    <h2 className="text-xl pt-10 text-prim font-semibold">Informações Bancárias</h2>
                    <div className="grid sm:grid-cols-4 gap-5 pt-2">
                        <div className="grid gap-2">
                        <label htmlFor="telefone" className="text-neutral-500">Banco</label>
                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={bancoTexto} />
                        </div>

                        <div className="grid gap-2">
                        <label htmlFor="rg" className="text-neutral-500">Agência</label>
                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.agencia} />
                        </div>

                        <div className="grid gap-2">
                        <label htmlFor="genero" className="text-neutral-500">Conta</label>
                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.conta} />
                        </div>

                        <div className="grid gap-2">
                        <label htmlFor="genero" className="text-neutral-500">Pix</label>
                        <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.pix} />
                        </div>
                    </div>

                    <h2 className="text-xl pt-10 text-prim font-semibold">Disponibilidade e Serviços</h2>
                    <div className="pt-2">
                        <span className="font-semibold text-prim pt-5 text-sm lg:text-lg">Serviços</span>
                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pb-5 pt-5">

                        {prestador?.UserServico.map((service) => (
                            <div key={service.id}>
                                <Button className=" border border-bord bg-trans text-prim w-full" isDisabled>
                                    {service.servico.nome}
                                </Button>
                            </div>
                        ))}

                        </div>

                        <span className="font-semibold text-prim pt-5 text-lg">Dias disponíveis</span>
                        {/* dias disponiveis */}
                        <div className="text-neutral-400 text-lg">
                        <div className="grid grid-cols-3">
                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                <input 
                                type="checkbox" 
                                id="domingo"
                                className="cursor-pointer bg-neutral-200 placeholder:bg-neutral-200 border border-neutral-600 rounded-lg"
                                defaultChecked={prestador?.DiasDisponiveis[0].dom}
                                disabled
                                
                                />
                                <label htmlFor="domingo">Domingo</label>
                            </div>
                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                <input 
                                type="checkbox" 
                                id="segunda" 
                                
                                className="cursor-pointer bg-neutral-200 placeholder:bg-neutral-200 border border-neutral-600 rounded-lg"
                                defaultChecked={prestador?.DiasDisponiveis[0].seg}
                                disabled

                                />
                                <label htmlFor="segunda">Segunda</label>
                            </div>
                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                <input 
                                type="checkbox" 
                                id="ter" 
                                disabled
                                className="cursor-pointer bg-neutral-200 placeholder:bg-neutral-200 border border-neutral-600 rounded-lg"

                                defaultChecked={prestador?.DiasDisponiveis[0].ter}
                                

                                />
                                <label htmlFor="ter">Terça</label>
                            </div>
                        </div>
                        <div className="grid grid-cols-3">
                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                <input 
                                type="checkbox" 
                                id="quarta" 
                                disabled
                                className="cursor-pointer bg-neutral-200 placeholder:bg-neutral-200 border border-neutral-600 rounded-lg"

                                defaultChecked={prestador?.DiasDisponiveis[0].quart}
                                

                                />
                                <label htmlFor="quarta">Quarta</label>
                            </div>
                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                <input 
                                type="checkbox" 
                                id="quinta" 
                                disabled
                                className="cursor-pointer bg-neutral-200 placeholder:bg-neutral-200 border border-neutral-600 rounded-lg"

                                defaultChecked={prestador?.DiasDisponiveis[0].qui}
                                

                                />
                                <label htmlFor="quinta">Quinta</label>
                            </div>
                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                <input 
                                type="checkbox" 
                                id="sexta" 
                                disabled
                                className="cursor-pointer bg-neutral-200 placeholder:bg-neutral-200 border border-neutral-600 rounded-lg"

                                defaultChecked={prestador?.DiasDisponiveis[0].sex}
                                

                                />
                                <label htmlFor="sexta">Sexta</label>
                            </div>
                        </div>
                        <div className="grid grid-cols-3">
                            <div className="m-3 mb-0 ml-0 flex gap-2">
                                <input 
                                type="checkbox" 
                                id="sabado" 
                                disabled
                                className="cursor-pointer bg-neutral-200 placeholder:bg-neutral-200 border border-neutral-600 rounded-lg"

                                defaultChecked={prestador?.DiasDisponiveis[0].sab}
                                

                                />
                                <label htmlFor="sabado">Sábado</label>
                            </div>
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
                            value={prestador.cep}
                            
                            />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="logradouro" className="text-prim">Logradouro</label>
                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.logradouro} />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="numero" className="text-prim">Número</label>
                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.numero} />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="complemento" className="text-prim">Complemento</label>
                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.complemento} />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="referencia" className="text-prim">Ponto de referência</label>
                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.referencia} />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="bairro" className="text-prim">Bairro</label>
                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.bairro} />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="cidade" className="text-prim">Cidade</label>
                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.cidade} />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="estado" className="text-prim">Estado</label>
                            <input type="text" className="p-2 rounded-md bg-neutral-600 text-neutral-400" disabled value={prestador.estado} />
                        </div>

                        </div>
                        
                    </div>

                </div>


            </div>

            <EditUserModal 
                Open={Open}
                SetOpen={() => SetOpen(false)} 
                userInfo={prestador} 
                onUserUpdated={handleUserUpdated}
                Urls={prestador?.AvatarUrl?.avatarUrl} 
            />                          

        </section>
    )
}

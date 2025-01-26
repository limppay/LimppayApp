import React, { useState } from 'react'
import { applyCoupom } from '../../services/api';
import { Button } from '@nextui-org/button';

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useUser } from '../../context/UserProvider';
import { Spinner } from '@nextui-org/react';

export default function FinallyStep({setDescontoTotal, descontoTotal, setValorLiquido, HandleNavigateCheckout, loadingCheckout, sumValueService, observacao, setObservacao}) {
    const { user } = useUser()
    const [apply, setApply] = useState(false);
    const [cupomError, setCupomError] = useState(null);
    

    const cupom = yup.object({
        code: yup.string().required("Digite o codigo do cupom"),
    })

    const {
        register: registerCupom,
        handleSubmit: handleSubmitCupom,
        formState: { errors: errorCupom },
        reset: resetCupom,
        } = useForm({
        resolver: yupResolver(cupom),
    })

    const handleApplyCupom = async (data) => {
        setApply(true);
        setCupomError(null); // Limpa erros anteriores

        try {
            const response = await applyCoupom(data.code, sumValueService, user?.id );
            setApply(false);

            if (response && response.data) {
                // Atualiza o valor total do pedido com o valor descontado
                setDescontoTotal(response.data.discount);
                setValorLiquido(sumValueService - Number(descontoTotal))
                resetCupom()
                
            } else {
                setCupomError("Não foi possível adicionar este cupom");
                console.log(response)

            }

        } catch (error) {
            setApply(false);
            setCupomError("Ocorreu um erro ao tentar aplicar o cupom");

        }
    };
    

    return (
        <div className='w-full  flex flex-col items-center  justify-between  p-2 gap-5 sm:p-10 sm:pl-20 sm:pr-20 pt-5 shadow-md rounded-md pb-0 h-[60vh]'>
            <div className='w-full 2xl:min-w-[70vh]'>
                <div className='flex flex-col gap-14 '>
                    <div className='w-full flex flex-col gap-3'>
                        <h2 className='text-desSec font-semibold text-xl'>Observação</h2>
                        <textarea
                        placeholder="Se necessário, deixe-nos uma observação"
                        className="border rounded-md border-bord p-3 min-h-20 lg:min-h-24 2xl:min-h-36 focus:outline-ter text-prim w-full max-h-1"
                        rows="3"
                        value={observacao}  // Valor vinculado ao estado
                        onChange={(e) => setObservacao(e.target.value)}  // Atualiza o estado quando o valor mudar
                        ></textarea>
                    </div>
                    
                    <div className='w-full flex flex-col gap-3'>
                        <h2 className='text-desSec font-semibold text-xl'>Cupom de desconto</h2>
                        <div className='flex gap-5'>
                            <form onSubmit={handleSubmitCupom(handleApplyCupom)} className='flex gap-5 w-full'>
                                <div className='w-full flex flex-col items-center gap-2'>
                                    <input  className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter w-full" placeholder='Digite o cupom' 
                                        {...registerCupom("code")}
                                    />
                                    <span className='text-error'>{cupomError}</span>
                                </div>
                                <Button 
                                    type='submit'
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
                                    w-4/12
                                    "
                                    isDisabled={apply}
                                >
                                    {apply ? <Spinner/> : "Utilizar"}
                                </Button>

                            </form>
                        </div>
                        
                    </div>

                </div>

            </div>

            <div className=' w-full 2xl:min-w-[70vh]'>
                <div className='w-full flex flex-col gap-5 pt-5 pb-5 '>
                    <Button 
                    className="
                    p-5 rounded-md 
                    text-center
                    text-white 
                    bg-sec         
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
                    onPress={() => HandleNavigateCheckout()}
                    isDisabled={loadingCheckout}

                    >
                        {loadingCheckout ? <Spinner/> : "Conferir e solicitar serviço"}
                    </Button>
                </div>
            </div>

        </div>
    )
}

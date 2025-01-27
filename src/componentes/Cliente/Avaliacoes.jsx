import React from 'react'
import { useUser } from '../../context/UserProvider'
import { Avatar } from '@nextui-org/avatar'
import { formatarData } from '../../common/FormatarData'

export default function Avaliacoes() {
    const { user } = useUser()
    
    function StarReview({ filled }) {
        return (
            <span
                className={`text-4xl ${
                    filled ? 'text-des' : 'text-prim'
                }`}
            >
                ★
            </span>
        );
    }


    return (
        <section className='w-full gap-1 pb-[8vh] pt-[8vh] sm:pt-[9vh] lg:pt-[10vh] xl:pt-[12vh] overflow-hidden overflow-y-auto sm:max-h-[100vh] text-prim'>
            <div className='p-5 flex flex-col gap-5'>
                {user?.avaliacoes.length > 0 ? (
                    user?.avaliacoes?.map((avaliacao) => (
                        <div key={avaliacao.id} className='avaliacoes p-5 overflow-y-auto max-h-96 flex flex-col gap-5 min-w-full shadow-xl rounded-md'>

                            <div className='avaliacao flex flex-col gap-3  rounded-md '>
                                <div className='flex gap-2 items-center'
                                
                                >
                                    <Avatar 
                                    src={avaliacao.provider?.avatarUrl?.avatarUrl} 
                                    alt="avatarCliente"
                                    size='lg'
                                    />
                                    <h3 className='text-prim font-semibold'>{avaliacao.provider?.name}</h3>
                                </div>

                                <div className='flex flex-col w-full'>
                                    <div className="overflow-y-auto max-h-52 bg-white pt-2 rounded-md w-full min-h-20">
                                        <p className='text-prim'>{avaliacao?.comment === "" ? <span className='text-prim text-opacity-40'>Nenhum comentário</span>: avaliacao.comment}</p>
                                    </div>
                                </div>

                            </div>

                            <div className='flex flex-col sm:flex-row items-center justify-between gap-2'>
                                <div className='flex justify-start gap-10'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <StarReview
                                        key={star}
                                        filled={star <= avaliacao?.stars}
                                        />
                                    ))}
                                </div>
                                <div className='w-full flex justify-end'>
                                    <span>
                                    {formatarData(new Date(avaliacao?.createdAt).toISOString().split('T')[0])}
                                    </span>
                                </div>
                            </div>


                        </div>
                        
                    ))

                ) : (
                    <div className='h-[60vh] w-full'>
                        <div className='text-prim text-center flex flex-col justify-center items-center h-full '>
                            <p>Você não fez nenhuma avaliação</p>
                        </div>

                    </div>
                )}
                

            </div>
        </section>
    )
}

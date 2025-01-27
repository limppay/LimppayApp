import React from 'react'
import { usePrestador } from '../../context/PrestadorProvider';

export default function Avaliacoes() {
    const { prestador } = usePrestador()
    
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
                {/* Média de estrelas */}
                <div className="lg:col-span-3  bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-desSec text-lg font-semibold text-gray-600 mb-4">
                        Média de Estrelas
                    </h2>
                    <div className="flex flex-col gap-6">
                        {prestador?.Review && prestador?.Review?.length > 0 ? (
                            (() => {
                                const totalEstrelas = prestador?.Review?.reduce((sum, avaliacao) => sum + (avaliacao.stars || 0), 0);
                                const mediaEstrelas = (totalEstrelas / prestador?.Review?.length).toFixed(1);

                                return (
                                    <p className="text-desSec text-3xl font-bold text-gray-800">{mediaEstrelas} ★</p>
                                );
                            })()
                        ) : (
                            <p className="text-prim">Nenhuma avaliação recebida ainda.</p>
                        )}
                    </div>
                </div> 

                {prestador?.Review.length > 0 ? (
                    prestador?.Review?.map((avaliacao) => (
                        
                        <div key={avaliacao.id} className='avaliacoes p-5 overflow-y-auto max-h-96 flex flex-col gap-5 min-w-full shadow-lg shadow-bord rounded-md'>

                            <div className=' avaliacao flex gap-3   bg-opacity-30 rounded-md  '>
                                <div className='flex flex-col w-full'>
                                    <div className="overflow-y-auto max-h-52 bg-white pt-2 rounded-md w-full min-h-20">
                                        <p className='text-prim'>{avaliacao?.comment === "" ? <span className='text-prim text-opacity-40'>Nenhum comentário</span>: avaliacao.comment}</p>
                                    </div>
                                    <div className='flex justify-center sm:justify-start gap-10'>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <StarReview
                                            key={star}
                                            filled={star <= avaliacao?.stars}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))

                ) : (
                    <div className='text-prim text-center flex flex-col justify-center items-center h-[70vh] '>
                        <p>Você não possui nenhuma avaliação no momento</p>
                    </div>
                )}
                

            </div>
            
        </section>
    )
}

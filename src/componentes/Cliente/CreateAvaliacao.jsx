import React, { useState } from 'react'
import { useUser } from '../../context/UserProvider';
import { createReview } from '../../services/api';
import { fetchUserInfo } from '../../common/FetchUserInfo';
import { Button } from '@nextui-org/button';
import { Spinner } from '@nextui-org/react';

export default function CreateAvaliacao({agendamento}) {
    const { user, setUser } = useUser()
    const [loadingReview, setLoadingReview] = useState(false)
    const [rating, setRating] = useState(0); // Estado para armazenar o valor da avaliação
    const [review, setReview] = useState(''); // Estado para armazenar o valor do textarea
    

    function Star({ filled, onClick }) {
        return (
            <>
                <div >
                    <span
                        onClick={onClick}
                        className={`text-4xl cursor-pointer transition-colors ${
                        filled ? 'text-des' : 'text-prim hover:text-des'
                        }`}
                    >
                        ★
                    </span>
                </div>
            </>
        );
    }

    const handleReviewChange = (event) => {
        setReview(event.target.value);
    };

    const handleRating = (value) => {
        setRating(value);
    };

    const handleCreateReview = async (id) => {
        setLoadingReview(true)

        const reviewData = {
            clientId: user?.id,
            providerId: id,
            stars: rating,
            comment: review,
        };

        
        try {
            const response = await createReview(reviewData);
            setRating(0)
            setReview('')
            setLoadingReview(false)

        } catch (error) {
            console.log(error)

        } finally {
            fetchUserInfo(setUser)
            setOpenDetalhes(false)

        }
    };


    return (
        <div className=' text-justify pt-2 pb-4 '>
            <h2 className='font-semibold text-lg '>Avaliar Prestador</h2>
            <label htmlFor="avaliacao">Conte-nos como foi o serviço desse prestador :D <br />
            Não se preocupe, sua avaliação é totalmente anônima</label>
            <div className='flex flex-col gap-3 pt-2'>
                <div className='flex  gap-10'>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                        key={star}
                        filled={star <= rating}
                        onClick={() => handleRating(star)}
                        />
                    ))}
                </div>
                <div className='flex flex-col gap-2'>
                    <textarea
                        placeholder="Avalie com suas palavras como foi o serviço desse prestador"
                        className="border rounded-md border-bord p-3 min-h-[20vh] lg:min-h-40 focus:outline-ter text-prim w-full max-h-[20vh]"
                        rows="3"
                        id="avaliacao"
                        value={review}
                        onChange={handleReviewChange}
                    ></textarea>

                    <Button 
                        className="w-full bg-des text-white py-2 rounded-lg hover:bg-sec transition-all"
                        onPress={() => (
                            handleCreateReview(agendamento.user.id)

                        )}
                        isDisabled={loadingReview}
                    >
                        {loadingReview? <Spinner/> : "Enviar Avaliação"}
                    </Button>
                </div>
            </div>
            
        </div>
    )
}

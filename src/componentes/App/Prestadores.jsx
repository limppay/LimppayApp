import { Button } from '@nextui-org/button';
import React, { useState } from 'react'
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter} from "@nextui-org/modal";
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Avatar } from '@nextui-org/avatar';


export default function Prestadores({providers, handleConfirmSelection, HandleSelectedRandomProvider, provider, setProvider, setProviderId, providerId}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false)
    
    const filteredProviders = providers.filter(provider =>
        provider.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const calcularMediaStars = (reviews) => {
        if (!reviews || reviews.length === 0) return 0; // Retorna 0 caso não tenha avaliações
        const totalStars = reviews.reduce((acc, avaliacao) => acc + avaliacao.stars, 0);
        const averageStars = totalStars / reviews.length;
        return Math.round(averageStars * 10) / 10
    };

    // Ordena os providers com base na média de estrelas (ordem decrescente)
    const sortedProviders = filteredProviders.sort((a, b) => {
        const mediaA = calcularMediaStars(a?.Review);
        const mediaB = calcularMediaStars(b?.Review);
        return mediaB - mediaA; // Ordem decrescente, do maior para o menor
    });

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

    const calcularIdade = (data) =>{
        const hoje = new Date();
        const nascimento = new Date(data);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();

        if(mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())){
            idade--;
        }

        return idade;
    };

    
  return (
    <>
        <div className='pt-5'>
            {providers.length === 0 ? (
                <div className="h-[40vh] flex flex-col justify-center items-center gap-4 text-desSec opacity-60">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-16 h-16 text-sec"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                    </svg>
                    <p className="text-justify text-lg font-medium max-w-md ">
                        Infelizmente, nenhum prestador está disponível para os critérios especificados. Tente ajustar os filtros ou volte mais tarde :(
                    </p>
                </div>
            
            ) : (
                <div className='flex flex-col gap-3'>
                    <div>
                        <h1 className='text-desSec text-lg font-semibold'>Selecione o prestador</h1>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            id='searchQuery'
                            placeholder="Buscar profissional"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="focus:outline-prim w-full border border-bord rounded-full px-4 py-2 text-prim"
                        />
                        <label htmlFor="searchQuery">
                            <button className="absolute right-4 top-2 text-sec">
                            <i className="fas fa-search"></i>
                            </button>
                        </label>
                    </div>

                    <div className='h-[55vh] flex flex-col justify-between'>
                        <div className='flex flex-col justify-between  max-h-[45vh]'>
                            <div className={` grid ${filteredProviders.length > 0 ? " pb-2       lg:grid-cols-2  grid-cols-1 min-h-[20vh] max-h-[50vh] overflow-y-auto min-w-[40vh] max-w-[45vh] sm:min-w-[80vh] sm:max-w-[100vh]  " : "grid-none"}  pt-3 gap-10`}>
                                {filteredProviders.length > 0 ? (
                                    sortedProviders.map((prestador) => (
                                        <>
                                            <div key={prestador.id} className='flex flex-col gap-3 '>
                                                <div 
                                                className={`shadow-md  flex gap-3  items-center cursor-pointer transition-all duration-200   
                                                border rounded-lg bg-white  p-2 
                                                ${provider && provider.id === prestador.id ? ' border-sec ' : 'hover:border-sec border-trans'}`}
                                                
                                                
                                                
                                                onClick={() => {
                                                    setProvider(prestador); // Armazena o provider selecionado
                                                }}

                                                >
                                                    <div>
                                                        <Avatar 
                                                            src={prestador?.avatarUrl.avatarUrl}
                                                            size="lg"
                                                            sizes="(max-width: 768px) 50px, 100px"
                                                            loading='lazy'
                                                        />
                                                        
                                                    </div>

                                                    <div className='flex justify-start flex-col w-full'>
                                                        <p className='
                                                        text-prim
                                                        text-start
                                                        '>{prestador.name}</p>
                                                        <Button 
                                                            className='
                                                            p-2  w-full max-w-full text-center
                                                            bg-white
                                                            text-des 
                                                            shadow-sm
                                                            shadow-bord
                                                            border
                                                            border-bord
                                                            border-opacity-60
                                                            
                                                            transition-all  
                                                            hover:border-trans
                                                            flex 
                                                            items-center
                                                            justify-between
                                                            gap-2
                                                            '

                                                            onPress={() => (
                                                                setProvider(prestador),
                                                                setProviderId(prestador.id), // Atualiza o providerId e o useEffect dispara handleObterAvaliacoes automaticamente
                                                                setOpen(true)
                                                            )}                                                         
                                                        
                                                        >
                                                            <div className='flex items-center gap-2'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                                                </svg>
                                                                <div className='flex items-center gap-1'>
                                                                    <span
                                                                        className={`text-3xl text-des`}
                                                                    >
                                                                        ★
                                                                    </span>
                                                                    <span>
                                                                        {calcularMediaStars(prestador?.Review)}
                                                                    </span>
                                                                
                                                                </div>


                                                            </div>
                                                            


                                                            
                                                            
                                                        </Button>
                                                    </div>

                                                </div>

                                                


                                            </div>
                                        </>                                                
                                    ))
                                    
                                ) : (
                                    <>
                                        <p className="text-prim">Nenhum prestador encontrado.</p>
                                    </>
                                )}
                                
                                <Modal 
                                    backdrop="opaque" 
                                    isOpen={open} 
                                    onOpenChange={setOpen}
                                    placement='center'  
                                    classNames={{
                                        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 "
                                    }}
                                    className='max-w-[40vh] sm:max-w-[80vh]'
                                >
                                    <ModalContent>
                                        {(onClose) => (
                                        <>
                                            <ModalHeader className="flex flex-col gap-1 p-0 text-desSec"></ModalHeader>
                                            <ModalBody className='p-0'>

                                            <div className="bg-white pb-4 pt-0 p-0 ">
                                                <div className="sm:flex sm:items-start flex-col">
                                                    
                                                    {provider && ( // Renderiza as informações do provider selecionado
                                                        <div className="pt-0 p-0 flex flex-col w-full bg-pri max-h-[60vh] sm:max-h-[65vh]">
                                                            <div className='flex flex-col gap-2 justify-start'>
                                                                <div className="flex items-center space-x-96 lg:pl-10 pl-5 p-20  pb-5 bg-desSec  ">
                                                                    {/* Container do Avatar */}
                                                                    <div className="absolute">
                                                                        <Avatar src={provider?.avatarUrl.avatarUrl} size="lg"    
                                                                        className="w-24 h-24 text-large
                                                                        border-white
                                                                        border-5
                                                                        "
                                                                        loading='lazy'
                                                                        />
                                                                    </div>
                                                                    
                                                                </div>
                                                            </div>

                                                            <div className='flex justify-end items-center gap-2 pr-5 pt-2'>
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <StarReview
                                                                        key={star}
                                                                        filled={star <= calcularMediaStars(provider?.Review)}
                                                                    />
                                                                ))}
                                                            </div>
                                                            
                                                            <div className='overflow-y-auto max-h-[80vh] '>
                                                                <div className='p-5 pb-1'>
                                                                    <div className='border rounded-lg border-bord w-full shadow-md  bg-white p-5 '>
                                                                        <h1 className='text-prim font-semibold text-xl'>{provider.name}</h1>
                                                                        <p className='text-prim text-[0.8rem]'>
                                                                            {calcularIdade(provider.data)} anos
                                                                        </p>
                                                                        <p className='text-[0.8rem] text-prim pb-2'>{provider.genero}</p>
                                                                        <div className='overflow-y-auto lg:h-[20vh]'>
                                                                            <p className='text-prim text-start pt-4 text-sm'>{provider.sobre}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='p-5'>
                                                                    <div className='border rounded-lg border-bord w-full shadow-md  bg-white p-5 '>
                                                                        <Accordion>
                                                                            <AccordionItem  key="1" aria-label="Accordion 1" title={`Avaliações ( ${provider.Review.length} )`} classNames={{title: 'text-prim text-md '}} >
                                                                                <div className='flex flex-col gap-5'>
                                                                                    {provider && (
                                                                                        provider.Review.length == 0 ? (
                                                                                            <div className=' p-5 text-prim flex flex-col justify-center text-center'>
                                                                                                <h3 className='font-semibold'>Sem avaliações</h3>
                                                                                            </div>
                                                                                            
                                                                                        ) : (
                                                                                            provider?.Review.map((avaliacao) => (
                                                                                                <div key={avaliacao.id} className=' p-5 border border-bord rounded-md text-prim flex flex-col gap-2'>
                                                                                                    <h3 className='font-semibold'>{new Date(avaliacao.createdAt).toLocaleDateString('pt-BR', {
                                                                                                        day: '2-digit',
                                                                                                        month: 'long',
                                                                                                        year: 'numeric'
                                                                                                    })}</h3>
                                                                                                    <p className='text-prim'>{avaliacao?.comment === "" ? <span className='text-prim text-opacity-40'>Nenhum comentário</span>: avaliacao.comment}</p>
                                                                                                    <div className='flex justify-start items-center gap-2 pr-5 pt-2'>
                                                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                                                            <StarReview
                                                                                                                key={star}
                                                                                                                filled={star <= avaliacao.stars}
                                                                                                            />
                                                                                                        ))}
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))
                                                                                        )
                                                                                    )}
                                                                                </div>
                                                                            </AccordionItem>
                                                                        </Accordion>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                                                                            

                                
                                            </ModalBody>
                                            <ModalFooter>
                                            <Button color="danger" variant="light" onPress={onClose}>
                                                Fechar
                                            </Button>
                                            <Button className='bg-desSec text-white' onPress={handleConfirmSelection}  >
                                                Selecionar e prosseguir
                                            </Button>
                                            </ModalFooter>
                                        </>
                                        )}
                                    </ModalContent>
                                </Modal>
                            </div>


                        </div>
                        
                        <div className='flex justify-center pt-5 border-b border-bord'>
                            {provider ? (
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
                                    onPress={() =>handleConfirmSelection()}
                                    
                                >
                                    Selecionar e prosseguir
                                </Button>
                            ) : ( 
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
                                    onPress={() => HandleSelectedRandomProvider()}
                                    
                                >
                                    Selecione por mim e prosseguir
                                </Button>
                                
                            )}
                        </div>

                    </div>

                </div>
            )}
        </div>
    </>
  )
}

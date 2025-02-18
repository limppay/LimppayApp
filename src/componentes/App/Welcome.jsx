import React, { useEffect, useState } from 'react'
import {  Modal,   ModalContent,   ModalHeader,   ModalBody,   ModalFooter, useDisclosure} from "@nextui-org/modal";
'use client'
import { Logo } from "../imports.jsx"
import { Button } from '@nextui-org/button';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("source") === "app") {
        setShowModal(true);
      }
    }, []);

    const handleOnClose = () => {
        setShowModal(false)
        navigate('/contrate-online')
    }
  
    return (
      <div>
        <Modal 
            backdrop="opaque" 
            isOpen={showModal} 
            onOpenChange={setShowModal}
            placement='center'
            classNames={{
                backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 "
            }}
            className="min-w-[35] max-w-[40vh] sm:max-w-[60vh] sm:max-h-[100vh]  "
        >
        <ModalContent>
            {(onClose) => (
            <>
                <ModalHeader className="flex flex-col gap-1 text-desSec p-0"></ModalHeader>
                <ModalBody >
                    <div className="bg-white sm:pb-4">
                        <div className="sm:flex sm:items-start justify-center">
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <div className="mt-2 lg:flex h-1/2 ">
                                    <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col justify-center ">
                                        <img
                                            alt="Limppay"
                                            src={Logo}
                                            className="mx-auto h-20 w-auto"
                                        />
                                        <div className='flex flex-col items-center text-justify gap-2'>
                                            <h2 className="mt-5 text-justify text-lg md:text-xl font-bold leading-9 tracking-tight text-gray-900 text-desSec">
                                                Bem-vindo de volta à Limppay! :D
                                            </h2>
                                            <p className='text-prim'>Olá! Notamos que você já faz parte da nossa comunidade e queremos compartilhar uma novidade incrível, a Limppay está de cara nova! 🎉</p>
                                            <p className='text-prim pt-[1vh]'>
                                                Fizemos melhorias para tornar sua experiência ainda mais intuitiva e eficiente. Agora, ficou mais fácil encontrar profissionais qualificados e gerenciar seus serviços com segurança e praticidade.

                                                Aproveite as novidades e continue contando com a gente! 😉

                                            </p>
                                            <p className='text-desSec font-semibold pt-[1vh]'>
                                                🔹<b> Dúvidas? </b> Nosso suporte está sempre à disposição.
                                            </p>
                                            <p className='pt-[1vh] w-full text-prim text-sm'>
                                               - Equipe Limppay

                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="bg-none shadow-none">
                    <Button className='bg-desSec text-white' onPress={handleOnClose} >
                        Continuar
                    </Button>
                </ModalFooter>
            </>
            )}
        </ModalContent>
        </Modal>
      </div>
    );
}

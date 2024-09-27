import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HeaderApp, Logo} from '../../componentes/imports.jsx'
import User from "../../assets/img/diarista-cadastro/user.png"
import EditUserModal from './EditUserModal.jsx';

const AreaDiarista = () => {
    const [userInfo, setUserInfo] = useState(null);
    const[Open, SetOpen] = useState(false)
    const userId = localStorage.getItem('userId'); // Obter o ID do usuário do localStorage
    const token = localStorage.getItem('token'); // Obter o token do localStorage
    // Recuperar as URLs e converter para objeto JSON
    const urls = JSON.parse(localStorage.getItem('urls'));

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserInfo(response.data);
            } catch (error) {
                console.error('Erro ao buscar informações do usuário:', error);
            }
        };

        if (token && userId) {
            fetchUserInfo();
        }
    }, [token, userId]);

    const handleUserUpdated = (updatedInfo) => {
        setUserInfo(updatedInfo);
    };

    // Anexos
    const avatarUrl = urls ? Object.values(urls)[0] : null;
    const arquivoIdentidade = urls ? Object.values(urls)[1] : null; 
    const arquivoCPF = urls ? Object.values(urls)[2] : null; 
    const arquivoResidencia = urls ? Object.values(urls)[3] : null; 
    const arquivoCurriculo = urls ? Object.values(urls)[4] : null; 

    const buttons = [
        { link: "/", text: "Dúvidas"},
        { link: "/", text: "Quem Somos"},
    ]

    const btnAcess = [
        {   AcessPrim: "Suporte", 
            AcessSec: "Sair",
            LinkPrim: "cadastro-diarista",
            LinkSec: "diarista-login",  
        },
    ]

    return (
        <div>
            <HeaderApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess}/>
            <main className='flex flex-col  p-5 '>
                {userInfo ? (
                    <>
                        <section className='pt-14 lg:pt-24 lg:flex justify-between w-full gap-1 '>
                            <div className='flex flex-col gap-5 text-center max-w-50 min-w-72 min-h-60  p-5 rounded-md  lg:w-4/12 lg:h-full'>
                                <div className="flex flex-col justify-center items-center gap-2">
                                    <div className='flex items-center'>
                                        <div>
                                            <label  htmlFor='avatar'  className='text-prim cursor-pointer' onClick={()=> SetOpen(true)}>Editar Perfil</label>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-6 text-prim">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </div>
                                    <img src={avatarUrl}
                                    id='avatar' 
                                    alt="foto de perfil" 
                                    className="transition-all duration-200 rounded-full w-60 h-60  hover:bg-ter p-0.5 hover:bg-opacity-40 shadow-md cursor-pointer" 
                                    onClick={()=> SetOpen(true)}
                                    
                                    />                                             
                                </div>
                                
                                <div className='flex flex-col gap-3 h-full max-w-full max-h-full pl-5 pr-5'>
                                    <h1 className='text-xl text-ter'>{userInfo.name}</h1>
                                    <div className="overflow-y-auto max-h-32">
                                        <p className='text-prim text-center'>
                                            {userInfo.sobre} 
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col shadow-md shadow-prim rounded-md text-center lg:w-8/12 '>
                                <div className='bg-desSec text-white p-5 rounded-b-none rounded-md lg:hidden'>
                                    <h1 className='text-xl'>Minhas Informações</h1>
                                </div>
                                <div className='p-5 flex gap-10 flex-col lg:gap-7'>
                                    <div className='border-b border-bord p-2 flex  gap-2 flex-col lg:flex-row lg:p-0'>
                                        <div className='lg:w-3/12'>
                                            <p className='flex items-start text-ter lg:text-sm'>Nome Completo</p>
                                        </div>
                                        <div>
                                            <p className='flex items-start text-prim lg:text-sm'>{userInfo.name}</p>
                                        </div>
                                    </div>
                                    <div className='border-b border-bord p-2 flex  gap-2 flex-col lg:flex-row lg:p-0'>
                                        <div className='w-3/12'>
                                            <p className='flex items-start text-ter lg:text-sm'>Email</p>
                                        </div>
                                        <div className='flex'>
                                            <p className='flex items-start text-prim lg:text-sm'>{userInfo.email}</p>
                                        </div>
                                    </div>
                                    <div className='border-b border-bord p-2 flex  gap-2 flex-col lg:flex-row lg:p-0'>
                                        <div className='w-3/12'>
                                            <p className='flex items-start text-ter lg:text-sm'>Telefone</p>
                                        </div>
                                        <div>
                                            <p className='flex items-start text-prim lg:text-sm'>{userInfo.telefone}</p>
                                        </div>
                                    </div>
                                    <div className='border-b border-bord p-2 flex  gap-2 flex-col lg:flex-row lg:p-0'>
                                        <div className='w-3/12'>
                                            <p className='flex items-start text-ter lg:text-sm'>Estado</p>
                                        </div>
                                        <div>
                                            <p className='flex items-start text-prim lg:text-sm'>{userInfo.estado}</p>
                                        </div>
                                    </div>
                                    <div className='border-b border-bord p-2 flex  gap-2 flex-col lg:flex-row lg:p-0'>
                                        <div className='w-3/12'>
                                            <p className='flex items-start text-ter lg:text-sm'>Cidade</p>
                                        </div>
                                        <div>
                                            <p className='flex items-start text-prim lg:text-sm'>{userInfo.cidade}</p>
                                        </div>
                                    </div>
                                    <div className='border-b border-bord p-2 flex flex-col  gap-2 lg:flex-row lg:p-0'>
                                        <div className='w-3/12'>
                                            <p className='flex items-start text-ter lg:text-sm'>Endereço</p>
                                        </div>
                                        <div>
                                            <p className='text-start text-prim lg:text-sm '>{userInfo.logradouro + ", " +  userInfo.numero + ", " + userInfo.bairro + ", " + userInfo.cep}</p>
                                        </div>
                                    </div>

                                      {/* Modal de edição */}
                                        <EditUserModal 
                                            Open={Open}
                                            SetOpen={() => SetOpen(false)} 
                                            userInfo={userInfo} 
                                            token={token} 
                                            onUserUpdated={handleUserUpdated} 
                                        />                          
                                </div>
                            </div>      
                        </section>
                        <section className='mt-5 lg:flex-row lg:gap-5 lg:justify-around flex flex-col gap-5'>
                            <div className='lg:w-1/2 flex flex-col items-center shadow-md shadow-prim rounded-md'>
                                <div className='p-5 pb-3 border-b border-bord w-full text-center'>
                                    <h1 className='text-ter text-lg' >Carreira</h1>
                                </div>
                                <div>
                                    {/* content here */}
                                </div>
                            </div>
                            

                            <div className='lg:w-1/2 flex flex-col items-center shadow-md shadow-prim rounded-md'>
                                <div className='p-5 pb-3 border-b border-bord w-full text-center'>
                                    <h1 className='text-ter text-lg' > Serviços</h1>
                                </div>
                                <div className=' p-5 flex flex-col gap-5 overflow-y-auto max-h-96'>
                                    <div className='flex gap-3 bg-bord bg-opacity-30 rounded-md p-5'>
                                        <div className='flex flex-col gap-2 items-center'>
                                            <img 
                                            src={User} 
                                            alt="avatarCliente"
                                            className='w-10'
                                             />
                                            <h3>Cliente</h3>
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <div className="overflow-y-auto max-h-32 bg-white p-3 rounded-md">
                                                <p>Limpeza - 8Hrs - 26 de Setembro de 2024</p>
                                                <p>Subtotal: R$26,60</p>
                                            </div>
                                            <div className='flex  justify-end gap-5 items-center'>
                                                <div>
                                                    <p className='text-desSec'>Andamento</p>
                                                </div>
                                                <div >
                                                    <button className='bg-des p-2 rounded-md text-white'>Detalhes</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex gap-3 bg-bord bg-opacity-30 rounded-md p-5'>
                                        <div className='flex flex-col gap-2 items-center'>
                                            <img 
                                            src={User} 
                                            alt="avatarCliente"
                                            className='w-10'
                                             />
                                            <h3>Cliente</h3>
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <div className="overflow-y-auto max-h-32 bg-white p-3 rounded-md">
                                                <p>Limpeza - 16Hrs - 27 de Setembro de 2024</p>
                                                <p>Subtotal: R$50,60</p>
                                            </div>
                                            <div className='flex items-end justify-end gap-5'>
                                                <div>
                                                    <p className='text-des'>Agendado</p>
                                                </div>
                                                <div>
                                                    <button className='bg-des p-2 rounded-md text-white'>Detalhes</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex gap-3 bg-bord bg-opacity-30 rounded-md p-5'>
                                        <div className='flex flex-col gap-2 items-center'>
                                            <img 
                                            src={User} 
                                            alt="avatarCliente"
                                            className='w-10'
                                             />
                                            <h3>Cliente</h3>
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <div className="overflow-y-auto max-h-32 bg-white p-3 rounded-md">
                                                <p>Limpeza - 16Hrs - 27 de Setembro de 2024</p>
                                                <p>Subtotal: R$50,60</p>
                                            </div>
                                            <div className='flex items-end justify-end gap-5'>
                                                <div>
                                                    <p className='text-sec'>Concluído</p>
                                                </div>
                                                <div >
                                                    <button className='bg-des p-2 rounded-md text-white'>Detalhes</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                   
                                </div>
                            </div>

                            <div className='lg:w-6/12 flex flex-col items-center shadow-md shadow-prim rounded-md'>
                                <div className='title p-5 pb-3 border-b border-bord w-full text-center'>
                                    <h1 className='text-ter text-lg'>Avaliações</h1>
                                </div>
                                <div className='avaliacoes p-5 overflow-y-auto max-h-96 flex flex-col gap-5'>
                                    <div className='avaliacao flex gap-3 bg-bord bg-opacity-30 rounded-md p-5'>
                                        <div className='flex flex-col gap-2 items-center'>
                                            <img 
                                            src={User} 
                                            alt="avatarCliente"
                                            className=''
                                             />
                                            <h3>Cliente</h3>
                                        </div>
                                        <div>
                                            <div className="overflow-y-auto max-h-32 bg-white p-3 rounded-md">
                                                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore nesciunt alias officia, veritatis quisquam eaque sed voluptatum saepe ut excepturi aperiam. Dolor eius provident sapiente dicta sed eveniet exercitationem tempora!</p>
                                            </div>
                                            <div>
                                                {/* estrela */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='avaliacao flex gap-3 bg-bord bg-opacity-30 rounded-md p-5'>
                                        <div className='flex flex-col gap-2 items-center'>
                                            <img 
                                            src={User} 
                                            alt="avatarCliente"
                                            className=''
                                             />
                                            <h3>Cliente</h3>
                                        </div>
                                        <div>
                                            <div className="overflow-y-auto max-h-32 bg-white p-3 rounded-md">
                                                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore nesciunt alias officia, veritatis quisquam eaque sed voluptatum saepe ut excepturi aperiam. Dolor eius provident sapiente dicta sed eveniet exercitationem tempora!</p>
                                            </div>
                                            <div>
                                                {/* estrela */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='avaliacao flex gap-3 bg-bord bg-opacity-30 rounded-md p-5'>
                                        <div className='flex flex-col gap-2 items-center'>
                                            <img 
                                            src={User} 
                                            alt="avatarCliente"
                                            className=''
                                             />
                                            <h3>Cliente</h3>
                                        </div>
                                        <div>
                                            <div className="overflow-y-auto max-h-32 bg-white p-3 rounded-md">
                                                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore nesciunt alias officia, veritatis quisquam eaque sed voluptatum saepe ut excepturi aperiam. Dolor eius provident sapiente dicta sed eveniet exercitationem tempora!</p>
                                            </div>
                                            <div>
                                                {/* estrela */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='avaliacao flex gap-3 bg-bord bg-opacity-30 rounded-md p-5'>
                                        <div className='flex flex-col gap-2 items-center'>
                                            <img 
                                            src={User} 
                                            alt="avatarCliente"
                                            className=''
                                             />
                                            <h3>Cliente</h3>
                                        </div>
                                        <div>
                                            <div className="overflow-y-auto max-h-32 bg-white p-3 rounded-md">
                                                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore nesciunt alias officia, veritatis quisquam eaque sed voluptatum saepe ut excepturi aperiam. Dolor eius provident sapiente dicta sed eveniet exercitationem tempora!</p>
                                            </div>
                                            <div>
                                                {/* estrela */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </section>
                    </>                    
                ) : (
                    <p>Carregando informações...</p>
                )}
            </main>
        </div>
    );
};

export default AreaDiarista;

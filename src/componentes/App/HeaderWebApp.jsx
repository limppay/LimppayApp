import React, { useEffect, useState, useRef } from 'react';
import HeaderButton from '../HeaderButton';
import ButtonAcess from '../home/ButtonAcess';
import "../../styles/menu-hamburguer.css";
import axios from "axios";
import { useUser } from '../../context/UserProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Spinner } from "@nextui-org/react";
import {Button} from "@nextui-org/react";
import User from "../../assets/img/diarista-cadastro/user.webp"
import { loggoutCliente } from '../../services/api';
import { io } from 'socket.io-client';


export default function HeaderWebApp({ img, alt, btnAcess, buttons }) {
  const { user, setUser, loadingUser  } = useUser();
  const navigate = useNavigate();
  // const location = useLocation()
  console.log(location.pathname)

  useEffect(() => {
    const hamburguerButton = document.getElementById("hamburguerButton");
    const mobileMenu = document.getElementById("mobileMenu");
    if (hamburguerButton && mobileMenu) {
      const toggleMenu = () => {
        mobileMenu.classList.toggle("view");
      };
      const handleResize = () => {
        if (window.innerWidth > 768) {
          mobileMenu.classList.remove("view");
        }
      };
      hamburguerButton.addEventListener("click", toggleMenu);
      window.addEventListener("resize", handleResize);
      return () => {
        hamburguerButton.removeEventListener("click", toggleMenu);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const [loggout, setLoggout] = useState(false)
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
      navigate("/contrate-online")
      window.location.reload()
      
    }
        
  };

  const HandleNavigateUser = () => {
    navigate("/area-cliente");
  };

  const fullName = user?.name?.trim()
  const firstName = fullName?.split(' ')[0]


  return (
    <>
      <header className="pb-3  shadow-md w-full bg-white z-10">
        <nav className={`flex items-center  justify-between px-2 lg:px-12 ${user ? "gap-14" : "gap-5"}`}>
          <a href="/" className='w-3/12 sm:w-5/12 md:w-4/12 lg:w-3/12 lg:block '>
            <img src={img} alt={alt} className="w-11/12 2xl:w-[16vh] lg:w-5/12 md:w-5/12 sm:w-5/12" />
          </a>
          <div className="flex items-center">
            <div className='hidden items-center lg:flex'>
                  <div className='flex gap-2'>
                      {buttons?.map((button, index) => (
                          <>
                            <a href={button.link} key={index}>
                                <Button
                                    onPress={() => button.onPress()}
                                    className='bg-white text-center 2xl:text-lg text-prim border border-trans hover:border-bord hover:text-sec'
                                >
                                    {button.text}
                                </Button>
                            </a>
                          </>
                      ))}
                  </div>
            </div>
            
            {/* botões de acesso */}
            <div className='flex  items-center gap-2'>
              <div className='text-center flex justify-center items-center '>
                {user ? (
                  <div className='flex items-center gap-2 w-[25vh] sm:w-auto'>
                    <div className='flex gap-2 items-center justify-end w-full'>
                      <Avatar
                        src={user?.AvatarUrl?.avatarUrl ? user?.AvatarUrl?.avatarUrl : User}
                        alt="User Avatar"
                        size='sm'
                        onClick={HandleNavigateUser}
                        className='cursor-pointer w-8 h-8 2xl:w-12 2xl:h-12'
                      />
                      <span className='text-prim font-semibold 2xl:text-xl'>Olá, {firstName}</span>
                    </div>

                    <div>
                      <Button
                        className={`bg-white border text-desSec hidden ${location.pathname != "/area-cliente" ? "md:hidden" : "md:flex"} `}
                        onPress={() => (navigate("/contrate-online"))}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="size-6">
                            <path strokeLinecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                        Agendar novo serviço
                      </Button>
                    </div>
                    
                    {/* <div>
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
                        '
                        onPress={() => HandleExitUser()}
                        isDisabled={loggout}
                      >
                        {loggout ? <Spinner className='text-white' color='danger'/> : "Sair"}
                      </Button>
                    </div> */}
                    
                  </div>
                ) : (
                  <>
                    <ul className='flex w-full gap-2'>
                        {btnAcess.map((acess, index) => (
                            <>
                              <Button
                                key={index}
                                onPress={() => navigate(acess.LinkPrim)}
                                className='bg-white border  text-sec border-sec hover:bg-sec hover:text-white
                                
                                '
                                isDisabled={loadingUser}                                        
                                  
                              >
                                  {acess.AcessPrim}
                              </Button>
                            

                              <Button
                                key={index}
                                onPress={() => navigate(acess.LinkSec)}
                                className='bg-des hover:bg-sec text-white'
                                isDisabled={loadingUser}                                        

                              >
                                  {acess.AcessSec}
                              </Button>                                            
                                
                            
                            </>

                            
                        ))} 
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

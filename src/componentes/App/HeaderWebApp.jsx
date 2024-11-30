import React, { useEffect, useState, useRef } from 'react';
import HeaderButton from '../HeaderButton';
import ButtonAcess from '../home/ButtonAcess';
import "../../styles/menu-hamburguer.css";
import axios from "axios";
import { useUser } from '../../context/UserProvider';
import { useNavigate } from 'react-router-dom';
import { Avatar } from "@nextui-org/react";
import {Button} from "@nextui-org/react";

export default function HeaderWebApp({ img, alt, btnAcess, buttons }) {
    const [urls, setUrls] = useState(JSON.parse(localStorage.getItem('urls')) || {});
    const navigate = useNavigate();
    const { user, setUser  } = useUser();

    const isFetched = useRef(false);  // Ref para controlar a execução do useEffect

    useEffect(() => {
        if (isFetched.current) return;  // Se já foi feito, não executa de novo

        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (token && userId) {
            fetchUserInfo(token, userId).then(data => {
                if (data) {  // Verifica se obteve os dados corretamente
                    setUser(data);  // Atualiza o contexto do usuário
                    setUrls(JSON.parse(localStorage.getItem('urls')));  // Atualiza as URLs do usuário
                    isFetched.current = true;  // Marca que a requisição foi feita com sucesso
                }
            }).catch(err => {
                console.error('Erro ao buscar informações do usuário:', err);
                isFetched.current = false;  // Reseta caso ocorra um erro
            });
        }
    }, [user]);  // Dependência vazia para executar o efeito apenas uma vez

  const fetchUserInfo = async (token, userId) => {
    try {
      const response = await axios.get(`https://limppay-api-production.up.railway.app/cliente/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
      return null;
    }
  };

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

  const HandleExitUser = () => {
    setUser(null);
    setUrls({});
    localStorage.removeItem('status')
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('urls');
    localStorage.removeItem('enderecosCliente')
    window.location.reload();
  };

  const HandleNavigateUser = () => {
    navigate("/area-cliente");
  };

  const avatarUrl = urls ? Object.values(urls)[0] : null;

  return (
    <>
      <header className="pt-3 pb-3 shadow-md lg:pt-2 lg:pb-2 lg:pr-12 lg:pl-12 fixed w-full bg-white z-10">
        <nav className={`flex items-center  lg:justify-between px-2 lg:px-12 ${user ? "gap-14" : "gap-5"}`}>
          <a href="/" className='w-3/12 sm:w-5/12 md:w-4/12 lg:w-3/12 lg:block '>
            <img src={img} alt={alt} className="w-11/12 2xl:w-[16vh] lg:w-5/12 md:w-5/12 sm:w-5/12" />
          </a>
          <div className="flex items-center">
            <div className='hidden items-center lg:flex'>
                  <ul className='flex gap-2'>
                      {buttons.map((button, index) => (
                          <>
                              
                              <a href={button.link} key={index}>
                                  <Button
                                      onClick={button.OnClick}
                                      className='bg-white text-center text-prim border border-trans hover:border-bord hover:text-sec'
                                  >
                                      {button.text}
                                  </Button>
                              </a>

                          
                          </>
                      ))}
                  </ul>
            </div>
            
            {/* botões de acesso */}
            <div className='flex  items-center gap-2'>
              <div className='text-center flex justify-center items-center '>
                {user ? (
                  <div className='flex items-center gap-2'>
                    <div className='flex gap-2 items-center'>
                      <Avatar
                        src={avatarUrl}
                        alt="User Avatar"
                        size='sm'
                        onClick={HandleNavigateUser}
                        className='cursor-pointer'
                      />
                      <span className='text-prim font-semibold'>Olá, {user.name}</span>
                    </div>
                    <div>
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
                        rounded-md text-error
                        '
                        onClick={HandleExitUser}
                      >
                        Sair
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <ul className='flex w-full gap-2'>
                        {btnAcess.map((acess, index) => (
                            <>
                                <a href={acess.LinkPrim} key={index}>
                                    <Button
                                        
                                        onClick={acess.OnClickPrim}
                                        className='bg-white border  text-sec border-sec hover:bg-sec hover:text-white'
                                        
                                        
                                        
                                    >
                                        {acess.AcessPrim}
                                    </Button>
                                </a>

                                <a href={acess.LinkSec} key={index}>
                                    <Button
                                        onClick={acess.OnClickSec}
                                        className='bg-des hover:bg-sec text-white'
                                    >
                                        {acess.AcessSec}
                                    </Button>                                            
                                
                                </a> 

                            </>

                            
                        ))} 
                    </ul>
                  </>
                )}
              </div>
              <i className="fas fa-bars cursor-pointer text-2xl text-des  lg:hidden" id="hamburguerButton"></i>
            </div>
          </div>
        </nav>
      </header>
      <div className="mobile-menu bg-white shadow-md pt-24 p-5 " id="mobileMenu">
        <div className="space-y-4 text-start">
          <div>
            <ul>
              {buttons.map((button, index) => (
                <HeaderButton
                  key={index}
                  link={button.link}
                  text={button.text}
                  OnClick={button.OnClick}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

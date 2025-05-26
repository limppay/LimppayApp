import React, { useEffect, useState } from 'react';
import "../styles/menu-hamburguer.css";
import { Spinner} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import { useLocation, useNavigate } from 'react-router-dom';
import { useScreenSelected } from '../context/ScreenSelect';
import { loggoutUser } from '../services/api';
import { usePrestador } from '../context/PrestadorProvider';


export default function HeaderTeste({img, alt, btnAcess, buttons, text1, text2,  }) {
    const location = useLocation()
    const navigate = useNavigate()
    const { prestador, setPrestador } = usePrestador()


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
            const response = await loggoutUser()
            setPrestador(null)
            setLoggout(false)
            navigate("/")

        } catch (error) {
            console.log(error)          
        } 
        
        
    };


    return (
        <>
            <header className="pt-3 pb-3  shadow-md lg:pt-2 lg:pb-2 lg:pr-12 lg:pl-12  w-full bg-white z-10">
                <nav className="flex items-center justify-between px-2 lg:px-12">
                    <a href="/" className='w-3/12 sm:w-5/12 md:w-4/12 lg:w-3/12 lg:block '>
                        <img src={img} alt={alt} className="w-11/12 2xl:w-[16vh] lg:w-5/12 md:w-5/12 sm:w-5/12" />
                    </a>
                    <div className="flex items-center gap-3">
                        <div className='hidden items-center lg:flex'>
                            <div className='flex gap-2'>
                                {buttons.map((button, index) => (
                                    <>
                                        
                                        <a href={button.link} key={index} >
                                            <Button
                                                onPress={button.OnClick}
                                                className='bg-white text-center text-prim border border-trans hover:border-bord hover:text-sec'
                                            >
                                                {button.text}
                                            </Button>
                                        </a>

                                    
                                    </>
                                ))}
                            </div>
                        </div>

                        {/* botões de acesso */}
                        <div className='flex'>
                            {location.pathname == "/area-diarista" ? (
                                <> 
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
                                            onPress={HandleExitUser}
                                            isDisabled={loggout}
                                        >
                                            {loggout ? <Spinner className='text-white' color='danger'/> : "Sair"}
                                        </Button>
                                    </div>

                                </>
                            ) : (
                                <div className='flex w-full gap-2'>
                                    {btnAcess.map((acess, index) => (
                                        <>
                                            <a href={acess.LinkPrim} key={index} onClick={acess.OnClickPrim}>
                                                <Button
                                                    
                                                    onPress={() => acess.OnClickPrim()}
                                                    className='bg-white border  text-sec border-sec hover:bg-sec hover:text-white'
                                                    
                                                    
                                                    
                                                >
                                                    {acess.AcessPrim}
                                                </Button>
                                            </a>

                                            <a href={acess.LinkSec} key={index} onClick={acess.OnClickSec}>
                                                <Button
                                                    onPress={() => acess.OnClickSec()}
                                                    className='bg-des hover:bg-sec text-white'
                                                >
                                                    {acess.AcessSec}
                                                </Button>                                            
                                            
                                            </a> 

                                        </>

                                        
                                    ))} 
                                </div>

                            )}
                        </div>

                        <i className="fas fa-bars cursor-pointer text-2xl text-des lg:hidden" id="hamburguerButton"></i>
                    </div>
                </nav>
            </header>

            <div className="mobile-menu bg-white shadow-md pt-24 p-5  " id="mobileMenu">
                <div className="space-y-4 text-start">
                    
                        <div>
                            <ul className='flex flex-col gap-5'>
                                {buttons.map((button, index) => (
                                    <>
                                        
                                        <a href={button.link} key={index}>
                                            <Button
                                                onPress={button.OnClick}
                                                className={`${button.text == "Contrate Online" ? "border-desSec text-desSec bg-white" : "bg-white text-desSec border-trans"} shadow-sm  text-center border  hover:border-bord hover:text-sec justify-start w-full`}
                                            >
                                                {button.text == "Contrate Online" && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                                    </svg>
                                                
                                                )}
                    
                                                {button.text == "Dúvidas" && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                                                    </svg>
                                                
                                                
                                                )}
                    
                                                {button.text == "Quem Somos" && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                                    </svg>
                                                
                                                
                                                
                                                )}
                    
                    
                                                {button.text}
                                            </Button>
                                        </a>

                                    
                                    </>
                                ))}
                            </ul>
                        </div>
                   
    
                </div>
            </div>

        </>
    );
}

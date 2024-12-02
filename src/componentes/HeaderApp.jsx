import React, { useEffect } from 'react';
import "../styles/menu-hamburguer.css";
import {Button} from "@nextui-org/react";
import { useLocation } from 'react-router-dom';
import { useScreenSelected } from '../context/ScreenSelect';


export default function HeaderTeste({img, alt, btnAcess, buttons, text1, text2,  }) {
    const location = useLocation()
    const {screenSelected, setScreenSelected} = useScreenSelected()

    console.log("tela atual: ", screenSelected)

    console.log(location)

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

    return (
        <>
            <header className="pt-3 pb-3 shadow-md lg:pt-2 lg:pb-2 lg:pr-12 lg:pl-12 fixed w-full bg-white z-10">
                <nav className="flex items-center justify-around lg:justify-between px-2 lg:px-12">
                    <a href="/" className='w-3/12 sm:w-5/12 md:w-4/12 lg:w-3/12 lg:block '>
                        <img src={img} alt={alt} className="w-11/12 2xl:w-[16vh] lg:w-5/12 md:w-5/12 sm:w-5/12" />
                    </a>
                    <div className="flex items-center gap-3">
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
                        <div className='flex'>
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
                        </div>

                        <i className="fas fa-bars cursor-pointer text-2xl text-des lg:hidden" id="hamburguerButton"></i>
                    </div>
                </nav>
            </header>

            <div className="mobile-menu bg-white shadow-md pt-24 p-5  " id="mobileMenu">
                <div className="space-y-4 text-start">
                    
                        <div>
                            <ul className='flex flex-col gap-2'>
                                {buttons.map((button, index) => (
                                    <>
                                        
                                        <a href={button.link} key={index}>
                                            <Button
                                                onClick={button.OnClick}
                                                className='bg-white text-prim border border-trans hover:border-bord hover:text-sec w-full'
                                            >
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

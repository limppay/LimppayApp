import React, { useEffect } from 'react';
import HeaderButton from "./HeaderButton";
import ButtonAcess from './home/ButtonAcess';
import "../styles/menu-hamburguer.css";

export default function HeaderTeste({img, alt, btnAcess, buttons, text1, text2,  }) {
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
                <nav className="flex items-center justify-around px-2 lg:px-12">
                    <a href="/" className="block max-w-full">
                        <img src={img} alt={alt} className="w-8/12 lg:w-full" />
                    </a>
                    <div className="flex items-center">
                        <ul className='flex'>
                            <div className='hidden items-center lg:flex'>
                                {buttons.map((button, index) => (
                                    <HeaderButton key={index} link={button.link} text={button.text} />
                                ))}
                            </div>
                            <div className='text-center hidden lg:flex md:flex'>
                                {btnAcess.map((acess, index) => (
                                    <ButtonAcess key={index} AcessPrim={acess.AcessPrim} AcessSec={acess.AcessSec} LinkPrim={acess.LinkPrim} LinkSec={acess.LinkSec}/>
                                ))}
    
                            </div>
                        </ul>
                        <div className="flex ml-5">
                            <div className='text-sm'>
                                <p className="text-ter"><strong>{text1}</strong></p>
                                <a href="#" className="text-prim transition-all hover:text-sec">{text2}</a>
                            </div>
                        </div>
                        <i className="fas fa-bars cursor-pointer text-2xl text-des ml-2  lg:hidden" id="hamburguerButton"></i>
                    </div>
                </nav>
            </header>
            <div className="mobile-menu bg-white shadow-md pt-24 p-5 " id="mobileMenu">
                <ul className="space-y-4 text-start">
                    <div>
                        {buttons.map((button, index) => (
                            <HeaderButton key={index} link={button.link} text={button.text} />
                        ))} 
                    </div>
                  
                    <div className='flex flex-col gap-3 text-center'>
                        {btnAcess.map((acess, index) => (
                            <ButtonAcess key={index} AcessPrim={acess.AcessPrim} AcessSec={acess.AcessSec} LinkPrim={acess.LinkPrim} LinkSec={acess.LinkSec}/>
                        ))}
                    </div>
                </ul>

            </div>
        </>
    );
}

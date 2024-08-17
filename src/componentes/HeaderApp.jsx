import HeaderButton from "./HeaderButton"
import Logo from "../assets/img/limppay-logo.png"

export default function HeaderTeste({buttons, text1, text2}) {
    return(
        <header className="pt-3 pb-3 shadow-md lg:md:sm:pt-2 lg:md:sm:pb-2 lg:md:sm:pr-12 lg:md:sm:pl-12 lg:md:sm:w-full fixed w-full bg-white">
            <nav className="flex items-center pl-2 pr-2 lg:md:sm:flex lg:md:sm:items-center justify-around lg:md:sm:pl-2 lg:md:sm:pr-2 lg:md:sm:max-w-full lg:md:sm:text-md">              
                <a href="/" className="block max-w-full"><img src={Logo} alt="Limppay" className="w-8/12 lg:md:sm:w-full"/></a>
                <div className="flex max-w-full ">
                    <ul className="hidden lg:flex">
                        {/* função para adicionar os botões no header */}
                        {buttons.map((button, index) => (
                            <HeaderButton key={index} link={button.link} text={button.text}/>
                        ))}
                        
                        <li className="p-3 ml-1 mr-1 text-prim border rounded-md border-bord transition-all hover:text-sec"><a href="seja-diarista.html">Seja Diarista</a></li>
                        <li className="p-3 ml-1 mr-1 text-prim border rounded-md border-bord transition-all hover:text-sec"><a href="#">Contrate Online</a></li>
                    </ul>

                    <div className="ml-3 max-w-full">
                        <p className="text-ter"><b>{text1}</b></p>
                        <a href="#" className="text-prim transition-all hover:text-sec">{text2}</a>
                    </div>
                </div>
            </nav>
        </header>
    )
}
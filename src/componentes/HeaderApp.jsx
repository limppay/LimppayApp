export default function HeaderTeste() {
    return(
        <header className="pt-3 pb-3 shadow-md lg:md:sm:pt-2 lg:md:sm:pb-2 lg:md:sm:pr-12 lg:md:sm:pl-12 lg:md:sm:w-full fixed w-full bg-white">
            <nav className="flex items-center pl-2 pr-2 lg:md:sm:flex lg:md:sm:items-center justify-around lg:md:sm:pl-2 lg:md:sm:pr-2 lg:md:sm:max-w-full lg:md:sm:text-md">
                
                <a href="#" className="block max-w-full"><img src="src/assets/img/limppay-logo.png" alt="Limppay" className="w-8/12 lg:md:sm:w-full"/></a>

                <div className="flex max-w-full ">
                    <ul className="hidden lg:flex">
                        <li className="p-3 ml-1 mr-1 text-des border rounded-md border-trans transition-all duration-200 hover:text-sec hover:border-solid hover:border-bord"><a href="#">Contratar</a></li>
                        <li className="p-3 ml-1 mr-1 text-prim border rounded-md border-trans transition-all duration-200 hover:text-sec hover:border-solid hover:border-bord "><a href="#">Dúvidas</a></li>
                        <li className="p-3 ml-1 mr-1 text-prim border rounded-md border-trans transition-all duration-200 hover:text-sec hover:border-solid hover:border-bord "><a href="#">Quem somos</a></li>
                        <li className="p-3 ml-1 mr-1 text-prim border rounded-md border-bord transition-all hover:text-sec"><a href="#">Quero ser diarista</a></li>
                    </ul>
                    <div className="ml-3 max-w-full">
                        <p className="text-ter"><b>Bem vindo!</b></p>
                        <a href="#" className="text-prim transition-all hover:text-sec">Entre ou cadastre-se</a>
                    </div>
                </div>
            </nav>
        </header>
    )
}
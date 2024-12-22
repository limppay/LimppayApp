import { HeaderApp, Logo, Footer, ModalQuemSomos, ModalDuvidas } from "../../componentes/imports.jsx"
import "../../styles/footer.css"
import { useState } from "react"
import FormCliente from "../../componentes/FormCadastro/FormCliente.jsx"
import { Helmet } from "react-helmet-async"

export default function ClienteCadastro() {
    const [Open, SetOpen] = useState(false)
    const [OpenDuvidas, SetOpenDuvidas] = useState(false)
    
    const buttons = [
        {
            link: "#", 
            text: "Dúvidas", 
            OnClick: () => SetOpenDuvidas(true)
        },
        {
            link: "#", 
            text: "Quem Somos", 
            Id: "OpenQuemSomos",
            OnClick: () => SetOpen(true)
        },
    ]

    const btnAcess = [
        {
            AcessPrim: "Página Inicial",
            LinkPrim: "/",
            AcessSec: "Contrate Online",
            LinkSec: "/contrate-online",
        }
    ]

    return (
        <>
            <Helmet>
                <title>Limppay: Cadastro Cliente</title>
            </Helmet>
            <HeaderApp img={Logo} alt={"Diarista"} buttons={buttons} btnAcess={btnAcess} text1={"Faça seu cadastro"} text2={"E contrate um serviço! :)"}/>
            <main className="w-full flex flex-col items-center justify-center">
                <section className="pt-20">
                    <div className="mt-7 p-9 pt-0 pb-0 flex flex-col gap-2">
                        <h1 className="text-3xl text-desSec">Cadastro</h1>
                        <p className="text-prim">Crie uma conta para contratar nossos serviços, preenchendo o formulário abaixo.</p>
                    </div>
                    <FormCliente/>                                  
                </section>
            </main>
            <Footer/>
            {/* modals */}
            <ModalQuemSomos Open={Open} SetOpen={() => SetOpen(!Open)}/>
            <ModalDuvidas OpenDuvidas={OpenDuvidas} SetOpenDuvidas={() => SetOpenDuvidas(!OpenDuvidas)}/>
        </>
    )
}
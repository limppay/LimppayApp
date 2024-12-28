import { Helmet } from "react-helmet-async"
import { HeaderApp, Logo, Footer, FormDiarista, ModalQuemSomos, ModalDuvidas, ModalLoginDiarista } from "../../componentes/imports.jsx"
import "../../styles/footer.css"
import { useState } from "react"

export default function DiaristaCadastro() {
    const [Open, SetOpen] = useState(false)
    const [OpenDuvidas, SetOpenDuvidas] = useState(false)
    const [OpenLogin, SetOpenLogin] = useState(false)

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
            AcessSec: "Área Diarista",
            LinkSec: "/diarista-login",
        }
    ]

    return (
        <>
            <Helmet>
                <title>Limppay: Cadastro Prestador</title>
            </Helmet>
            <HeaderApp img={Logo} alt={"Diarista"} buttons={buttons} btnAcess={btnAcess} text1={"Faça seu cadastro"} text2={"E se torne uma diarista! :)"}/>
            <main className="w-full flex flex-col items-center justify-center">
                <section className="pt-20">
                    <div className="mt-7 p-9 pt-0 pb-0 flex flex-col gap-2">
                        <h1 className="text-3xl text-desSec">Cadastro para ser diarista</h1>
                        <p className="text-prim">Crie uma conta para fazer parte de nossas diaristas, preenchendo os formulários abaixo</p>
                    </div>
                    <FormDiarista/>                                  
                </section>
            </main>
            <Footer/>
            {/* modals */}
            <ModalQuemSomos Open={Open} SetOpen={() => SetOpen(!Open)}/>
            <ModalDuvidas OpenDuvidas={OpenDuvidas} SetOpenDuvidas={() => SetOpenDuvidas(!OpenDuvidas)}/>

            <ModalLoginDiarista OpenLogin={OpenLogin} SetOpenLogin={() => SetOpenLogin(!OpenLogin)}/>
        </>
    )
}
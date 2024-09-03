import { HeaderApp, Logo, Footer, ModalLoginDiarista, ModalQuemSomos, ModalDuvidas, FormDiarista } from "../../componentes/imports.jsx"
import "../../styles/footer.css"

export default function DiaristaCadastro() {
    const buttons = [
        {link: "#", text: "Dúvidas", Id: "OpenDuvidas"},
        {link: "#", text: "Quem Somos", Id: "OpenQuemSomos"},
    ]

    const btnAcess = [
        {
            AcessPrim: "Página Inicial",
            LinkPrim: "/",
            AcessSec: "Área Diarista",
            LinkSec: "#",
            Class: "OpenLoginDiarista"
        }
    ]

    return (
        <>
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
        </>
    )
}
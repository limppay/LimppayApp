import { HeaderApp, LogoDiarista, Logo } from "../../componentes/imports.jsx"

export default function DiaristaCadastro() {
    const buttons = [
        {link: "#", text: "Dúvidas"},
        {link: "/", text: "Quem Somos"},
    ]

    const btnAcess = [
        {
            AcessPrim: "Área Diarista",
            LinkPrim: "#",
            AcessSec: "Home",
            LinkSec: "/"
        }
    ]

    return (
        <>
            <HeaderApp img={Logo} alt={"Diarista"} buttons={buttons} btnAcess={btnAcess} text1={"Faça seu cadastro"} text2={"E se torne uma diarista! :)"}/>
            <main>
                {/* content here */}
            </main>
        </>
    )
}
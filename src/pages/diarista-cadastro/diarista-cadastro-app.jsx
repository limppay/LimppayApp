import { HeaderApp, LogoDiarista, Logo, InputForm, SelectForm } from "../../componentes/imports.jsx"

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

    const options = [
        {text: "Teste"}
    ]

    return (
        <>
            <HeaderApp img={Logo} alt={"Diarista"} buttons={buttons} btnAcess={btnAcess} text1={"Faça seu cadastro"} text2={"E se torne uma diarista! :)"}/>
            <main className="w-full flex flex-col items-center justify-center">
                <section className="pt-20">
                    <div className="mt-7 p-9 pt-0 pb-0 flex flex-col gap-2">
                        <h1 className="text-2xl text-desSec">Cadastro para ser diarista</h1>
                        <p className="text-prim">Crie uma conta para fazer parte de nossas diaristas, preenchendo os formulários abaixo</p>
                    </div>
                    <form className="flex flex-col">
                        <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                            <h2 className="text-xl text-desSec">Dados pessoais</h2>
                        </div>
                        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                            <img src="" alt="foto de perfil" />
                        </div>
                        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                            <label htmlFor="biografia" className="text-prim">Sobre mim</label>
                            <textarea name="biografia" id="biografia" className="border rounded-md border-bord p-3 pt-1 pb-1"></textarea>
                        </div>
                        <InputForm label={"Nome"} text={"Nome completo"} name={"Nome"} type={"text"}/> 
                        <InputForm label={"CPF"} text={"Somente números"} name={"Cpf"} type={"text"}/> 
                        <InputForm label={"RG"} text={"Somente números"} name={"Nome"} type={"text"}/>
                        <InputForm label={"E-mail"} text={""} name={"Nome"} type={"email"}/>
                        <InputForm label={"Telefone"} text={"(00) 00000-0000"} name={"Nome"} type={"email"}/>
                    </form>                 
                </section>
            </main>
        </>
    )
}
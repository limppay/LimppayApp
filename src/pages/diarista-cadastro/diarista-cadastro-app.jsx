import { HeaderApp, LogoDiarista, Logo, InputForm, SelectForm, CheckForm } from "../../componentes/imports.jsx"

export default function DiaristaCadastro() {
    const buttons = [
        {link: "#", text: "Dúvidas"},
        {link: "/", text: "Quem Somos"},
    ]

    const btnAcess = [
        {
            AcessPrim: "Área Diarista",
            LinkPrim: "#",
            AcessSec: "Página inicial",
            LinkSec: "/"
        }
    ]

    const options = [
        {text: "Solteiro(a)"},
        {text: "Casado(a)"},
        {text: "Divorciado(a)"},
        {text: "Viúvo(a)"},
        {text: "Separado(a)"},
    ]

    const optionsBanco = [

    ]

    const estados = [
        {text: "Amazonas"}
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
                    <form className="flex flex-col">
                        <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                            <h2 className="text-2xl text-desSec">Dados pessoais</h2>
                        </div>
                        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                            <img src="" alt="foto de perfil" />
                        </div>
                        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col">
                            <label htmlFor="biografia" className="text-prim">Sobre mim</label>
                            <textarea name="biografia" id="biografia" className="border rounded-md border-bord p-3 pt-1 pb-1 min-h-20"></textarea>
                        </div>
                        <InputForm label={"Nome"} text={"Nome completo"} name={"Nome"} type={"text"}/> 
                        <InputForm label={"CPF"} text={"Somente números"} name={"Cpf"} type={"text"}/> 
                        <InputForm label={"RG"} text={"Somente números"} name={"Rg"} type={"text"}/>
                        <InputForm label={"E-mail"} text={""} name={"Email"} type={"email"}/>
                        <InputForm label={"Telefone"} text={"(00) 00000-0000"} name={"Telefone"} type={"text"}/>
                        <SelectForm options={options} name={"estadoCivil"} label={"Estado Civil"} text={"Selecione"} />
                        <SelectForm options={optionsBanco} name={"banco"} label={"Banco"} text={"Selecione o Banco"} />
                        <InputForm label={"Agência"} text={"Somente números"} name={"Agencia"} type={"text"}/>
                        <InputForm label={"Conta"} text={"Somente números"} name={"Conta"} type={"text"}/>
                        <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                            <h3 className="text-xl text-desSec">Disponibilidade e serviços</h3>
                        </div>
                        <div className="mt-4 p-9 pt-0 pb-0 flex flex-col text-prim">
                            <p><b>Dias disponíveis para trabalhar</b></p>
                            <div className="mt-2">
                                <input type="button" value="Selecionar todos os dias" className="p-2 border border-bord rounded-md"/>
                            </div>
                            <div className="flex justify-between">
                                <CheckForm label={"Domingo"} id={"checkbox1"} value={1}/>
                                <CheckForm label={"Segunda"} id={"checkbox2"} value={2}/>
                                <CheckForm label={"Terça"} id={"checkbox3"} value={3}/>
                            </div>
                            <div className="flex justify-between">
                                <CheckForm label={"Quarta"} id={"checkbox4"} value={4}/>
                                <CheckForm label={"Quinta"} id={"checkbox5"} value={5}/>
                                <CheckForm label={"Sexta"} id={"checkbox6"} value={6}/>
                            </div>
                            <div className="flex justify-between">
                                <CheckForm label={"Sabado"} id={"checkbox7"} value={7}/>
                            </div>
                            <p className="mt-4"><b>Deseja passar roupa</b></p>
                            <div className="flex gap-2 justify-between w-1/2">
                                <div className="flex gap-2">
                                    <input type="radio" name="sim" id="sim" />
                                    <label htmlFor="sim">Sim</label>
                                </div>
                                <div className="flex gap-2">
                                    <input type="radio" name="não" id="nao" />
                                    <label htmlFor="nao">Não</label>
                                </div>      
                            </div>
                        </div>
                        <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                            <h2 className="text-2xl text-desSec">Endereço</h2>
                        </div>
                        <InputForm label={"CEP"} text={""} name={"CEP"} type={"text"}/>
                        <InputForm label={"Logradouro"} text={""} name={"Logradouro"} type={"text"}/>
                        <InputForm label={"Número"} text={""} name={"Numero"} type={"text"}/>
                        <InputForm label={"Complemento"} text={"Casa, apt, bloco, etc"} name={"Complemento"} type={"text"}/>
                        <InputForm label={"Ponto de referência"} text={""} name={"pontoReferencia"} type={"text"}/>
                        <InputForm label={"Bairro"} text={""} name={"Bairro"} type={"text"}/>
                        <InputForm label={"Cidade"} text={""} name={"Cidade"} type={"text"}/>
                        <SelectForm options={estados} text={"Selecione"} label={"Estado"}/>
                    </form>                 
                </section>
            </main>
        </>
    )
}
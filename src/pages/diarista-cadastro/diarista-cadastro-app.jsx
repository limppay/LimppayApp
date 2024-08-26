import { HeaderApp, Logo, InputForm, SelectForm, CheckForm, AnexoForm, Footer, Perfil, ModalLoginDiarista, ModalQuemSomos, ModalDuvidas } from "../../componentes/imports.jsx"
import "../../styles/footer.css"

export default function DiaristaCadastro() {
    const buttons = [
        {link: "#", text: "Dúvidas", Class: "OpenDuvidas"},
        {link: "#", text: "Quem Somos", Class: "OpenQuemSomos"},
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

    // chamar via banco de dados?
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
    // 

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
                        
                        <div className="lg:flex lg:items-center lg:justify-around">
                            <div className="mt-4 p-9 pt-0 pb-0 flex flex-col items-center">
                                <Perfil/>                     
                            </div>
                            <div className="mt-4 p-9 pt-0 pb-0 flex flex-col lg:mt-0 lg:w-1/2 lg:p-0 lg:mb-10 max-w-full">
                                <label htmlFor="biografia" className="text-prim">Sobre mim</label>
                                <textarea name="biografia" id="biografia" className="border rounded-md border-bord p-3 pt-1 pb-1 min-h-20 lg:min-h-40 focus:outline-ter text-prim lg:max-w-full max-h-1"></textarea>
                            </div>
                        </div>

                        <div className="lg:flex">
                            <InputForm label={"Nome"} text={"Nome completo"} name={"Nome"} type={"text"}/> 
                            <InputForm label={"CPF"} text={"Somente números"} name={"Cpf"} type={"text"}/> 
                            <InputForm label={"RG"} text={"Somente números"} name={"Rg"} type={"text"}/>
                        </div>

                        <div className="lg:flex">
                            <InputForm label={"E-mail"} text={""} name={"Email"} type={"email"}/>
                            <InputForm label={"Telefone"} text={"(00) 00000-0000"} name={"Telefone"} type={"text"}/>
                            <SelectForm options={options} name={"estadoCivil"} label={"Estado Civil"} text={"Selecione"} />
                        </div>

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

                        <div className="lg:flex">
                            <InputForm label={"CEP"} text={""} name={"CEP"} type={"text"}/>
                            <InputForm label={"Logradouro"} text={""} name={"Logradouro"} type={"text"}/>
                            <InputForm label={"Número"} text={""} name={"Numero"} type={"text"}/>
                        </div>
                        <div className="lg:flex">
                            <InputForm label={"Complemento"} text={"Casa, apt, bloco, etc"} name={"Complemento"} type={"text"}/>
                            <InputForm label={"Ponto de referência"} text={""} name={"pontoReferencia"} type={"text"}/>
                            <InputForm label={"Bairro"} text={""} name={"Bairro"} type={"text"}/>
                        </div>
                        <InputForm label={"Cidade"} text={""} name={"Cidade"} type={"text"}/>
                        <SelectForm options={estados} text={"Selecione"} label={"Estado"}/>
                        <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                            <h2 className="text-2xl text-desSec">Anexos</h2>
                        </div>
                        <AnexoForm name={"docIdt"} text={"RG ou CNH"} span={"(frente e verso)"}/>
                        <AnexoForm name={"docCpf"} text={"CPF"} span={"(frente e verso)"}/>
                        <AnexoForm name={"docResidencia"} text={"Comprovante de residência"} span={""}/>
                        <AnexoForm name={"docBancario"} text={"Comprovante bancário"} span={""}/>
                        <AnexoForm name={"docCurriculo"} text={"Currículo"} span={""}/>
                        <div className="mt-7 p-9 pt-0 pb-0 flex flex-col">
                            <h2 className="text-2xl text-desSec">Senha</h2>
                        </div>
                        <InputForm label={"Senha"} text={""} name={"senha"} type={"password"}/>
                        <InputForm label={"Repita a senha"} text={""} name={"againsenha"} type={"password"}/>
                        <div className="mt-4 text-prim pr-9 pl-9">
                            <div className="flex gap-2 items-baseline">
                                <input type="checkbox" name="vCheck" id="vCheck" value required />
                                <label htmlFor="vCheck">Concordo com os termos de uso e contrato de serviço - <a href="#" className="text-des">Ver termos</a></label>
                            </div>
                        </div>
                        <div className="mt-4 pl-9 pr-9 pb-9 ">
                            <button type="submit" className="text-center w-full lg:w-1/2  bg-des rounded-md text-white p-2 hover:bg-sec transition-all duration-100"> Cadastrar </button>
                        </div>
                    </form>                 
                </section>
            </main>
            <Footer/>
            <ModalDuvidas/>
            <ModalQuemSomos/>
            
        </>
    )
}
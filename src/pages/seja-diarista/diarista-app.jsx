import { Logo, cadastroIcon, areaDiarista, solicitarServiço, iniciandoServico, finalizandoServico, cancelandoServico, AreaDiarista1, AreaDiarista2, AreaDiarista3, AreaDiarista4, DuvidasFrequentes, Footer, HeaderApp, Button, CardInfo, ModalLoginDiarista } from "../../componentes/imports.jsx"
import '../../styles/index.css'
import '../../styles/font.css'
import '../../styles/duvidas.css'
import "../../styles/footer.css"

export default function DiaristaApp() {
    const buttons = [
        { link: "#contatos", text: "Contato"},
        { link: "/", text: "Serviços"},
        { link: "/", text: "Quem Somos"},
        { link: "#duvidas", text: "Dúvidas"},
    ]

    const btnAcess = [
        {   AcessPrim: "Quero ser Diarista", 
            AcessSec: "Área Diarista",
            LinkPrim: "cadastro-diarista",
            LinkSec: "diarista-login",  
        },
    ]

    return (
        <>
            <HeaderApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess} text1="Seja Bem-vindo!" text2="Entre ou cadastre-se"/>
            <main className='w-full flex flex-col items-center justify-center'>

                <section className='pb-10 w-full items-center lg:md:sm:flex lg:md:sm:flex-col pt-28 md:pt-16 sm:pt-16 lg:pt-28 bg-[url(src/assets/img/seja-diarista/banner-02-1.jpg)] bg-cover bg-center '>                 
                  <div className='lg:md:sm:flex lg:md:sm:items-baseline'>
                        <div className="p-5 lg:md:sm:flex lg:md:sm:justify-center lg:md:sm:w-full">
                            <div className='flex flex-col gap-5 p-2 text-center lg:md:sm:gap-8 lg:md:sm:flex lg:md:sm:w-8/12 lg:md:sm:text-center '>
                                <div>
                                    <div className='text-center text-3xl'>
                                        <h2 className='text-des'>Novo por aqui?</h2>
                                        <h3 className='text-white'>Quero criar minha conta</h3>
                                    </div>                                
                                    <p className='text-white opacity-80'>A <b>Limppay</b> te conecta ao cliente de forma totalmente gratuita</p>
                                </div>
                                <div>
                                    <Button text={"Quero ser diarista"} link={"cadastro-diarista"}/>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 lg:md:sm:flex lg:md:sm:justify-center lg:md:sm:w-full">
                            <div className='flex flex-col gap-5 p-2 text-center lg:md:sm:gap-8 lg:md:sm:flex lg:md:sm:w-8/12 lg:md:sm:text-center '>
                                <div>
                                    <div className='text-center text-3xl'>
                                        <h2 className='text-des'>Fiz meu cadastro</h2>
                                        <h3 className='text-white'>Quero fazer meu login</h3>
                                    </div>                                
                                    <p className='text-white opacity-90'>Entre na sua área para ver seus serviços, valores, avaliações e muito mais.</p>
                                </div>
                                <div>
                                    <Button text={"Entrar na área diarista"} link={"diarista-login"}/>
                                </div>
                            </div>
                        </div>                      
                    </div>                   
                </section>
                
                <section className='flex flex-col gap-2 pt-10 pb-5 w-full lg:md:sm:flex items-center '>
                    <div  className='p3 lg:md:ms:p-80 pt-0  pb-0 flex flex-col'>
                        <div className='text-center text-3xl text-desSec'>
                            <h2>Como funciona o cadastro</h2>
                        </div>
                        <div className='lg:md:sm:flex lg:md:sm:justify-around items-baseline'>
                            <div className='p-10 flex flex-col items-center justiy-center lg:md:sm:max-w-full lg:md:sm:w-4/12'>
                                <CardInfo img={solicitarServiço} alt={"cadastro"} title={"Realize seu cadastro"} description={[
                                    "Receba serviços através da LimpPay.",
                                    "Nos informe: qual sua disponibilidade de tempo e serviços, seus dados pessoais e seu endereço.",
                                    "Após o envio dos formulários, analisaremos seu cadastro para aprovação de prestação de serviço.",
                                    "O preenchimento total do cadastro deverá ser feito ao logar na área da diarista."
                                ]}/>
                            </div>
                            <div className='p-10 flex flex-col items-center justiy-center lg:md:sm:max-w-full lg:md:sm:w-4/12'>
                                <CardInfo img={areaDiarista} alt={"Area Diarista"} title={"Área da diarista"} description={[
                                    "Esta é sua área e através dela você verá:",
                                    "Todos os seus serviços valores a receber.",
                                    "Suas avaliações e muito mais. Eteja sempre logado e acompanhe sua área para ficar sempre atualizado."                            
                                ]}/>
                            </div> 
                        </div>
                    </div>
                </section>
                <section className='flex flex-col gap-2 pb-5 w-full lg:md:sm:flex items-center bg-sec bg-opacity-10'>
                    <div  className='p-3 lg:md:ms:p-4 pt-5 pb-0 flex flex-col'>
                        <div className='text-center '>
                            <h2 className='text-prim text-3xl'>Como funciona</h2>
                            <h3 className='text-desSec text-2xl'>Recebimento de serviço</h3>
                        </div>
                        <div className='lg:md:sm:flex lg:md:sm:justify-around items-baseline'>
                            <div className='p-10 flex flex-col items-center justiy-center lg:md:sm:max-w-full lg:md:sm:w-4/12'>
                                <CardInfo img={cadastroIcon} alt={"Cadastro"} title={"Solicitando serviço"} description={[
                                    "Você será notificado por WhatsApp, e-mail e em sua área de diarista com as seguintes informações:",
                                    "– Local de onde você fará a limpeza",
                                    "– Tipo de serviço (ou tempo da diária)",
                                    "– Data do serviço (agendamento com o mínimo de 24h de antecedência)",
                                    "– Valor que você receberá pelo serviço e quem está solicitando."                                                        
                                ]}/>                             
                            </div>
                            <div className='p-10 flex flex-col items-center justiy-center lg:md:sm:max-w-full lg:md:sm:w-4/12'>
                                <CardInfo img={iniciandoServico} alt={"Iniciando Serviço"} title={"Iniciando serviço"} description={[
                                    "Ao direcionar-se ao local do serviço, deverá levar os materiais de limpeza – você encontra mais detalhes sobre materiais de limpeza na seção Dúvidas Frequentes.",
                                    "Assim que chegar na residência:",
                                    "– Entre na área da diarista",
                                    "– Em “serviço agendado”",
                                    "– Clique no botão “Iniciar”"

                                ]}/>                                
                            </div>
                        </div>
                        <div className='lg:md:sm:flex lg:md:sm:justify-around items-baseline'>
                            <div className='p-10 flex flex-col items-center justiy-center lg:md:sm:max-w-full lg:md:sm:w-4/12'>
                                <CardInfo img={finalizandoServico} alt={"Finalizando serviço"} title={"Finalizando serviço"} description={[
                                    "Assim que notificar o cliente que o serviço terminou:",
                                    "– Entre na área da diarista",
                                    "– Em serviços em andamento, clique no botão “Finalizar”",
                                    "– Ao finalizar, sua área de diarista será atualizada com valores, e todos os campos relacionados ao serviço executado",
                                    "– Ao deixar o local não esqueça de levar os produtos de limpeza consigo"
                                ]}/>                                   
                            </div>
                            <div className='p-10 flex flex-col items-center justiy-center lg:md:sm:max-w-full lg:md:sm:w-4/12'>
                                <CardInfo img={cancelandoServico} alt={"Cancelando serviço"} title={"Cancelando serviço"} description={[
                                    "Você pode cancelar o seu serviço, antes de iniciá-lo, ou durante o serviço.",
                                    "O cancelamento pode ser feito por meio da Área da Diarista.",
                                    "Dentro de “Serviços Agendados” ou “Em andamento”.",
                                    "Se você fizer muitos cancelamentos, estará sujeito a penalidades que a impedirão de ser contratada para novos serviços."
                                ]}/>
                            </div>                                                  
                        </div>
                    </div>                   
                </section>

                <section className='flex flex-col gap-2 pb-5 w-full lg:md:sm:flex items-center'>
                    <div  className='p-3 lg:md:ms:p-80 pt-5 pb-0 flex flex-col'>
                        <div className='text-center '>
                            <h2 className='text-prim text-3xl'>Como funciona</h2>
                            <h3 className='text-desSec text-3xl'>Área diarista</h3>
                        </div>
                        <div className='lg:md:sm:flex lg:md:sm:justify-around items-baseline'>
                            <div className='p-10 flex flex-col items-center justiy-center lg:md:sm:max-w-full lg:md:sm:w-4/12'>
                                <CardInfo img={AreaDiarista1} alt={"Datas bloqueadas"} title={"Datas bloqueadas"} description={[
                                    "Você poderá bloquear alguns dias em caso de indisponibilidade de sua parte. Nos dias em que você bloquear não aparecerá sua imagem como diarista para o cliente.",
                                    "– Entre na área da diarista",
                                    "– Clique em data de bloqueios",
                                    "– Dentro do calendário clique no dia em que você não poderá trabalhar"
                                ]}/>
                            </div>
                            <div className='p-10 flex flex-col items-center justiy-center lg:md:sm:max-w-full lg:md:sm:w-4/12'>
                                <CardInfo img={AreaDiarista2} alt={"Valores"} title={"Valores"} description={[
                                    "Além do saldo, você terá um extrato com valores, serviços e datas.",
                                    "– Entre na área da diarista",
                                    "– Clique em “Valores”"
                                ]}/>
                            </div>
                        </div>
                        <div className='lg:md:sm:flex lg:md:sm:justify-around items-baseline'>
                            <div className='p-10 flex flex-col items-center justiy-center lg:md:sm:max-w-full lg:md:sm:w-4/12'>
                                <CardInfo img={AreaDiarista3} alt={"Avaliações"} title={"Avaliações"} description={[
                                    "Suas avaliações serão vistas por todos os clientes que visualizarem seu perfil durante a contratação dos serviços."
                                ]}/>
                            </div>
                            <div className='p-10 flex flex-col items-center justiy-center lg:md:sm:max-w-full lg:md:sm:w-4/12'>
                                <CardInfo img={AreaDiarista4} alt={"Produtos de limpeza"} title={"Produtos de limpeza"} description={[
                                    "A LimpPay não exige que você, profissional de limpeza, tenha gastos com materiais de limpeza.",
                                    "Tanto o produto quanto as ferramentas de limpeza – vassoura, rodo, espanador, baldes, entre outros- serão de total responsabilidade do cliente, ele deverá fornecê-los."
                                ]}/>
                            </div>
                        </div>
                    </div>
                </section>
                <DuvidasFrequentes/>
            </main>
            <Footer/>

        </>
    )
}
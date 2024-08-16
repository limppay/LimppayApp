import React, { useEffect } from 'react';
import HeaderApp from '../../componentes/HeaderApp.jsx';
import Button from '../../componentes/Button.jsx';
import '../../styles/index.css'
import '../../styles/font.css'
import '../../styles/duvidas.css'
import "../../styles/footer.css"
import diaristaBanner from '../../assets/img/seja-diarista/banner-02-1.jpg'
import cadastroIcon from "../../assets/img/seja-diarista/Screenshot_7-e1682524500249.png"
import areaDiarista from "../../assets/img/seja-diarista/Screenshot_8-e1682525181143.png"
import solicitarServiço from "../../assets/img/seja-diarista/Screenshot_1.png"
import iniciandoServico from "../../assets/img/seja-diarista/Screenshot_4-1.png"
import finalizandoServico from "../../assets/img/seja-diarista/Screenshot_5-1.png"
import cancelandoServico from "../../assets/img/seja-diarista/Screenshot_6-1.png"
import DuvidasFrequentes from '../../componentes/DuvidasFrequentes.jsx';
import Footer from '../../componentes/Footer.jsx';

export default function DiaristaApp() {
    useEffect(() => {
        // Função para adicionar um índice para cada parágrafo
        const paragraphs = document.querySelectorAll(".text");
        paragraphs.forEach((paragrafo, index) => {
          paragrafo.setAttribute('data-index', index);
        });
    
        // Função para adicionar textos grandes no HTML
        fetch('src/pages/home/index.json')
          .then(response => response.json())
          .then(data => {
            paragraphs.forEach(p => {
              const index = p.getAttribute('data-index');
              if (data[index] !== undefined) {
                p.innerHTML = data[index];
              }
            });
          })
          .catch(error => console.error("Erro ao carregar JSON:", error));
    
        // Função para a seção de dúvidas
        const spans = document.querySelectorAll(".painel-title");
        const toggleContents = [];
        spans.forEach((span, index) => {
          const handleClick = () => {
            const duvida = document.querySelectorAll(".painel-content")[index];
            duvida.classList.toggle("mostrar");
          };
          span.addEventListener("click", handleClick);
          toggleContents.push({ span, handleClick });
        });
    
        // Função de limpeza para remover event listeners
        return () => {
          toggleContents.forEach(({ span, handleClick }) => {
            span.removeEventListener("click", handleClick);
          });
        };
      }, []);
      
    return (
        <>
            <HeaderApp/>
            <main className='w-full flex flex-col items-center justify-center'>
                <section className='pb-10 w-full items-center lg:md:sm:flex lg:md:sm:flex-col'>
                    <img src={diaristaBanner} alt="seja-diarista" className='w-ful lg:md:sm:w-full lg:md:sm:h-50 max-w-full '/>
                    <div className='lg:md:sm:flex lg:md:sm:items-baseline'>
                        <div className="p-5 lg:md:sm:flex lg:md:sm:justify-center lg:md:sm:w-full">
                            <div className='flex flex-col gap-5 p-2 text-center lg:md:sm:gap-8 lg:md:sm:flex lg:md:sm:w-8/12 lg:md:sm:text-center '>
                                <div>
                                    <h2 className='text-desSec text-4xl mb-2'>Diarista</h2>
                                    <p className='text-ter'>A <b>Limppay</b> te conecta ao cliente de forma totalmente gratuita</p>
                                </div>
                                <div>
                                    <Button buttonName="Quero ser diarista"/>
                                </div>
                            </div>
                        </div>
                        <div className='p-5 flex flex-col gap-3 lg:md:sm:w-full lg:md:sm:flex lg:md:sm:justify-center lg:md:sm:gap-4'>
                            <div className='text-center text-3xl'>
                                <h2 className='text-ter'>Fiz meu cadastro</h2>
                                <h3 className='text-desSec'>Quero fazer meu login</h3>
                            </div>
                            <div className='flex flex-col gap-5 items-center text-center lg:md:sm:justify-center '>
                                <div className='flex text-center max-w-full w-3/2 lg:md:sm:w-4/12 '>
                                    <p className='text-prim'>Você que fez seu cadastro de diarista, já pode entrar na sua área para ver seus serviços, valores, avaliações e muito mais.</p>
                                </div>
                                <div>
                                    <Button buttonName="Entrar na área diarista"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </section>
                
                <section className='flex flex-col gap-2 pb-5 w-full lg:md:sm:flex items-center'>
                    <div  className='p3 lg:md:ms:p-80 pt-0  pb-0 flex flex-col'>
                        <div className='text-center text-3xl text-desSec'>
                            <h2>Como funciona o cadastro</h2>
                        </div>
                        <div className='lg:md:sm:flex lg:md:sm:justify-around items-baseline'>
                            <div className='p-10 flex flex-col items-center justiy-center lg:md:sm:max-w-full lg:md:sm:w-4/12'>
                                <div className='flex flex-col items-center justiy-center gap-2'>
                                    <img src={solicitarServiço} alt="cadastro" className='w-1/2 lg:md:sm:w-3/12'/>
                                    <div className='flex flex-col gap-3'>
                                        <h3 className='text-center text-desSec text-xl'>Realize seu cadastro</h3>
                                        <p className='text-prim text-justify'>Receba serviços através da LimpPay.</p>
                                        <p className='text-prim text-justify'>Nos informe: qual sua disponibilidade de tempo e serviços, seus dados pessoais e seu endereço.</p>
                                        <p className='text-prim text-justify'>Após o envio dos formulários, analisaremos seu cadastro para aprovação de prestação de serviço.</p>
                                        <p className='text-prim text-justify'>O preenchimento total do cadastro deverá ser feito ao logar na área da diarista.</p>
                                    </div>
                                </div>
                            </div>
                            <div className='p-10 flex flex-col items-center justiy-center lg:md:sm:max-w-full lg:md:sm:w-4/12'>
                                <div className='flex flex-col items-center justiy-center gap-2'>
                                    <img src={areaDiarista} alt="cadastro" className='w-1/2 lg:md:sm:w-3/12'/>
                                    <div className='flex flex-col gap-3'>
                                        <h3 className='text-center text-desSec text-xl'>Área da diarista</h3>
                                        <p className='text-prim text-justify'>Esta é sua área e através dela você verá:</p>
                                        <p className='text-prim text-justify'>Todos os seus serviços, valores a receber suas avaliações e muito mais.</p>
                                        <p className='text-prim text-justify'>Esteja sempre logado e acompanhe sua área para ficar sempre atualizado</p>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>
                </section>
                <section className='flex flex-col gap-2 pb-5 w-full lg:md:sm:flex items-center'>
                    <div  className='p-3 lg:md:ms:p-4 pt-5 pb-0 flex flex-col '>
                        <div className='text-center '>
                            <h2 className='text-prim text-3xl'>Como funciona</h2>
                            <h3 className='text-desSec text-2xl'>Recebimento de serviço</h3>
                        </div>
                        <div className='lg:md:sm:flex lg:md:sm:justify-around items-baseline'>
                            <div className='p-10 flex flex-col items-center justiy-center lg:md:sm:max-w-full lg:md:sm:w-4/12'>
                                <div className='flex flex-col items-center justiy-center gap-2'>
                                    <img src={cadastroIcon} alt="cadastro" className='w-1/2 lg:md:sm:w-3/12'/>
                                    <div className='flex flex-col gap-3'>
                                        <h3 className='text-center text-desSec text-xl'>Solicitando serviço</h3>
                                        <p className='text-prim text-justify'>Você será notificado por WhatsApp, e-mail e em sua área de diarista com as seguintes informações:</p>
                                        <p className='text-prim text-justify'>– Local de onde você fará a limpeza</p>
                                        <p className='text-prim text-justify'>– Tipo de serviço (ou tempo da diária)</p>
                                        <p className='text-prim text-justify'>– Data do serviço (agendamento com o mínimo de 24h de antecedência)</p>
                                        <p className='text-prim text-justify'>– Valor que você receberá pelo serviço e quem está solicitando.</p>
                                     
                                    </div>
                                </div>
                            </div>
                            <div className='p-10 flex flex-col items-center justiy-center lg:md:sm:max-w-full lg:md:sm:w-4/12'>
                                <div className='flex flex-col items-center justiy-center gap-2'>
                                    <img src={iniciandoServico} alt="cadastro" className='w-1/2 lg:md:sm:w-3/12'/>
                                    <div className='flex flex-col gap-3'>
                                        <h3 className='text-center text-desSec text-xl'>Iniciando serviço</h3>
                                        <p className='text-prim text-justify'>Ao direcionar-se ao local do serviço, deverá levar os materiais de limpeza.</p>
                                        <p className='text-prim text-justify'>Você encontra mais detalhes sobre materiais de limpeza na seção Dúvidas Frequentes.</p>
                                        <p className='text-prim text-justify'>Assim que chegar na residência:</p>
                                        <p className='text-prim text-justify'>– Entre na área da diarista</p>
                                        <p className='text-prim text-justify'>– Em “serviço agendado”,</p>
                                        <p className='text-prim text-justify'>– Clique no botão “Iniciar”</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='lg:md:sm:flex lg:md:sm:justify-around items-baseline'>
                            <div className='p-10 flex flex-col items-center justiy-center lg:md:sm:max-w-full lg:md:sm:w-4/12'>
                                <div className='flex flex-col items-center justiy-center gap-2'>
                                    <img src={finalizandoServico} alt="cadastro" className='w-1/2 lg:md:sm:w-3/12'/>
                                    <div className='flex flex-col gap-3'>
                                        <h3 className='text-center text-desSec text-xl'>Finalizando serviço</h3>
                                        <p className='text-prim text-justify'>Assim que notificar o cliente que o serviço terminou:</p>
                                        <p className='text-prim text-justify'>– Entre na área da diarista</p>
                                        <p className='text-prim text-justify'>– Em serviços em andamento, clique no botão “Finalizar”</p>
                                        <p className='text-prim text-justify'>– Ao finalizar, sua área de diarista será atualizada com valores, e todos os campos relacionados ao serviço executado</p>
                                        <p className='text-prim text-justify'>– Ao deixar o local não esqueça de levar os produtos de limpeza consigo</p>                               
                                    </div>
                                </div>
                            </div>
                            <div className='p-10 flex flex-col items-center justiy-center lg:md:sm:max-w-full lg:md:sm:w-4/12'>
                                <div className='flex flex-col items-center justiy-center gap-2'>
                                    <img src={cancelandoServico} alt="cadastro" className='w-1/2 lg:md:sm:w-3/12'/>
                                    <div className='flex flex-col gap-3'>
                                        <h3 className='text-center text-desSec text-xl'>Cancelamento do serviço</h3>
                                        <p className='text-prim text-justify'>Você pode cancelar o seu serviço, antes de iniciá-lo, ou durante o serviço.</p>
                                        <p className='text-prim text-justify'>O cancelamento pode ser feito por meio da Área da Diarista.</p>
                                        <p className='text-prim text-justify'>Dentro de “Serviços Agendados” ou “Em andamento”.</p>
                                        <p className='text-prim text-justify'>Se você fizer muitos cancelamentos, estará sujeito a penalidades que a impedirão de ser contratada para novos serviços.</p>                                     
                                    </div>
                                </div>
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
                                <div className='flex flex-col items-center justiy-center gap-2'>
                                    <img src={cadastroIcon} alt="cadastro" className='w-1/2 lg:md:sm:w-3/12'/>
                                    <div className='flex flex-col gap-3'>
                                        <h3 className='text-center text-desSec text-xl'>Solicitando serviço</h3>
                                        <p className='text-prim text-justify'>Você será notificado por WhatsApp, e-mail e em sua área de diarista com as seguintes informações:</p>
                                        <p className='text-prim text-justify'>– Local de onde você fará a limpeza</p>
                                        <p className='text-prim text-justify'>– Tipo de serviço (ou tempo da diária)</p>
                                        <p className='text-prim text-justify'>– Data do serviço (agendamento com o mínimo de 24h de antecedência)</p>
                                        <p className='text-prim text-justify'>– Valor que você receberá pelo serviço e quem está solicitando.</p>                                    
                                    </div>
                                </div>
                            </div>
                            <div className='p-10 flex flex-col items-center justiy-center lg:md:sm:max-w-full lg:md:sm:w-4/12'>
                                <div className='flex flex-col items-center justiy-center gap-2'>
                                    <img src={iniciandoServico} alt="cadastro" className='w-1/2 lg:md:sm:w-3/12'/>
                                    <div className='flex flex-col gap-3'>
                                        <h3 className='text-center text-desSec text-xl'>Iniciando serviço</h3>
                                        <p className='text-prim text-justify'>Ao direcionar-se ao local do serviço, deverá levar os materiais de limpeza.</p>
                                        <p className='text-prim text-justify'>Você encontra mais detalhes sobre materiais de limpeza na seção Dúvidas Frequentes.</p>
                                        <p className='text-prim text-justify'>Assim que chegar na residência:</p>
                                        <p className='text-prim text-justify'>– Entre na área da diarista</p>
                                        <p className='text-prim text-justify'>– Em “serviço agendado”,</p>
                                        <p className='text-prim text-justify'>– Clique no botão “Iniciar”</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='lg:md:sm:flex lg:md:sm:justify-around items-baseline'>
                            <div className='p-10 flex flex-col items-center justiy-center lg:md:sm:max-w-full lg:md:sm:w-4/12'>
                                <div className='flex flex-col items-center justiy-center gap-2'>
                                    <img src={finalizandoServico} alt="cadastro" className='w-1/2 lg:md:sm:w-3/12'/>
                                    <div className='flex flex-col gap-3'>
                                        <h3 className='text-center text-desSec text-xl'>Finalizando serviço</h3>
                                        <p className='text-prim text-justify'>Assim que notificar o cliente que o serviço terminou:</p>
                                        <p className='text-prim text-justify'>– Entre na área da diarista</p>
                                        <p className='text-prim text-justify'>– Em serviços em andamento, clique no botão “Finalizar”</p>
                                        <p className='text-prim text-justify'>– Ao finalizar, sua área de diarista será atualizada com valores, e todos os campos relacionados ao serviço executado</p>
                                        <p className='text-prim text-justify'>– Ao deixar o local não esqueça de levar os produtos de limpeza consigo</p>                               
                                    </div>
                                </div>
                            </div>
                            <div className='p-10 flex flex-col items-center justiy-center lg:md:sm:max-w-full lg:md:sm:w-4/12'>
                                <div className='flex flex-col items-center justiy-center gap-2'>
                                    <img src={cancelandoServico} alt="cadastro" className='w-1/2 lg:md:sm:w-3/12'/>
                                    <div className='flex flex-col gap-3'>
                                        <h3 className='text-center text-desSec text-xl'>Cancelamento do serviço</h3>
                                        <p className='text-prim text-justify'>Você pode cancelar o seu serviço, antes de iniciá-lo, ou durante o serviço.</p>
                                        <p className='text-prim text-justify'>O cancelamento pode ser feito por meio da Área da Diarista.</p>
                                        <p className='text-prim text-justify'>Dentro de “Serviços Agendados” ou “Em andamento”.</p>
                                        <p className='text-prim text-justify'>Se você fizer muitos cancelamentos, estará sujeito a penalidades que a impedirão de ser contratada para novos serviços.</p>                                     
                                    </div>
                                </div>
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
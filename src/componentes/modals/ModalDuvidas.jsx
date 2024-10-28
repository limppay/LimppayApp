'use client'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import {Accordion, AccordionItem} from "@nextui-org/accordion";

export default function ModalDuvidas({OpenDuvidas, SetOpenDuvidas}) {
  return (
    <Dialog open={OpenDuvidas} onClose={SetOpenDuvidas} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-prim bg-opacity-50">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className="font-semibold  text-desSec text-2xl">
                    Tem Dúvidas?
                  </DialogTitle>
                  <div className="mt-2">
                    <div className='overflow-y-auto max-h-[60vh] flex flex-col gap-10'>
                        <div className='flex flex-col gap-7 text-prim'>
                            <p>Este espaço é para tirar dúvidas conforme os tópicos abaixo que traz as perguntas mais frequentes feitas pelos nossos clientes.</p>
                            <p>Se nossos tópicos não conseguiram atender você, nos envie um contato através de nossos e-mail <a href="mailto:contato@limppay.com" className='text-des'>contato@limppay.com</a>, ou pelo nosso <a href="https://api.whatsapp.com/send?phone=5592992648251" className='text-des'>Whatsapp</a></p>
                        </div>
                        <section className='text-prim text-md'>
                          <Accordion  >
                              <AccordionItem  key="1" aria-label="Accordion 1" title="Sobre a limpeza" classNames={{title: 'text-ter'}}>
                                Sabemos como a vida pode ser agitada e é por isso que projetamos pacotes de serviços de limpeza com base em suas preferências específicas. Sem a necessidade de definir um plano de limpeza permanente, você poderá nos adaptar à sua programação caso decida aumentar ou diminuir a frequência dos nossos serviços. É nosso trabalho tornar sua vida mais fácil e nos esforçamos para torná-la o mais livre de preocupações possível.Uma vez por semana - Uma solução bem comum para residências ocupadas. A cada duas semanas - este serviço se aplica melhor para ajudar na manutenção geral. Uma vez por mês - Nós faremos uma limpeza completa em sua casa apenas quando você precisar. 
                              </AccordionItem>
                              <AccordionItem key="2" aria-label="Accordion 2" title="Sobre o Agendamento" classNames={{title: 'text-ter'}}>
                                Acesse o nosso site e faça seu cadastro - Preencha de forma rápida alguns dados ou faça o loggin usando suas redes sociais. É bem rápido! Solicite o Serviço - Defina onde será a limpeza, se é hora avulsa (1h), meia diária (4h) ou diária (8h), escolha o dia e horário, selecione sua melhor diarista, adicione detalhes do serviço e finalize a solicitação. A confirmação é instantânea. Avalie - Após a conclusão do serviço, basta avaliar a profissional.
                              </AccordionItem>
                              <AccordionItem key="3" aria-label="Accordion 3" title="Sobre os profissionais" classNames={{title: 'text-ter'}}>
                                Nossas diaristas são profissionais autônomas que passaram por um criterioso processo de seleção. Após uma cuidadosa avaliação dos documentos e referências, cada profissional participa de um treinamento remoto, desenvolvido pela nossa equipe especialmente para aperfeiçoar as técnicas de limpeza, passadoria e outras atividades.Ao final da contração e execução de cada serviço, você cliente avalia individualmente cada profissional, dessa forma um banco de dados com informações e avaliações é gerado.Dessa forma, ao escolher uma diarista, antes mesmo de contratar, é possível verificar o rating de cada uma, e seus pontos de destaque.
                              </AccordionItem>

                              <AccordionItem key="4" aria-label="Accordion 4" title="Sobre os produtos" classNames={{title: 'text-ter'}}>
                                Como nos preocupamos em tornar a sua casa o mais limpa e agradável possível, nossa equipe se preocupa em garantir que os produtos certos sejam usados o tempo todo. Muitos produtos de limpeza baratos são diluídos e deixam resíduos, enquanto os concentrados que usamos são muito mais eficazes. Também temos o prazer de levar em consideração suas preferências, se você preferir que usemos nossas soluções de limpeza específicas.
                              </AccordionItem>
                              <AccordionItem key="5" aria-label="Accordion 5" title="Por que escolher a Limppay?" classNames={{title: 'text-ter'}}>
                                Não utilizamos contratos - Quando você decide escolher a LimpPay, você pode ficar tranquilo que a burocracia contratual nunca são uma opção. Nosso processo é o mais seguro e simplificado possível para que suas necessidades sejam atendidas rapidamente.Equipe profissionalmente instruída - Nossas diaristas são amplamente treinadas para limpar todos os cômodos da sua casa com base em suas necessidades específicas, proporcionando a limpeza profissional que você espera.Limpeza e higienização - Além de nossas práticas de limpeza padrão de tirar o pó, varrer/aspirar e limpar, nossa equipe também higienizará interruptores de luz, maçanetas, telefones, superfícies de banheiro e outras áreas comumente tocadas.
                              </AccordionItem>
                          </Accordion>
                        </section>
                    </div>                
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                data-autofocus
                onClick={() => SetOpenDuvidas(false)}
                className="p-2 rounded-md w-1/4 max-w-full text-center bg-des text-white transition-all hover:bg-sec hover:bg-opacity-75"
              >
                Fechar
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

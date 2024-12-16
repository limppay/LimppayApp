import React, { useEffect } from 'react';

import {Accordion, AccordionItem} from "@nextui-org/accordion";

export default function DuvidasFrequentes() {

  return(
      <section className='sm:pt-10 shadow-md' id='duvidas' >
          <div className="p-10 pt-0 lg:p-56 lg:pt-0 lg:pb-10">
              <div className="flex flex-col gap-4">
                  <div className='text-center'>
                      <h2 className='lg:text-4xl text-4xl text text-desSec font-semibold w-full'>Dúvidas frequentes</h2>
                  </div>
                  <div className="container-duvidas-frequentes-info">
                      <p className="text-prim text-justify">Este espaço é para tirar suas dúvidas conforme os tópicos abaixo que traz as perguntas mais frequentes feitas pelos nossos clientes. Se nossos tópicos não conseguiu atender você, nos envie um contato através de nosso e-mail: contato@limppay.com, ou pelo nosso Whatsapp.</p>
                  </div>
              </div>
              <section className='text-prim text-md'>
                <Accordion  >
                    <AccordionItem  key="1" aria-label="Accordion 1" title="Como funciona o sistema da Limppay?" classNames={{title: 'text-ter'}}>
                        Os clientes terão acesso a agenda que cada profissional liberar.<br/>
                        Por exemplo, se o profissional liberar a agenda na sexta e no sábado, os clientes só poderão solicitar seus serviços nos dias liberados.<br/> 
                        Todo esse controle e acesso é feito diretamente no login do profissional.
                    </AccordionItem>
                    <AccordionItem key="2" aria-label="Accordion 2" title="Qual o custo para fazer o uso da plataforma da Limppay?" classNames={{title: 'text-ter'}}>
                        Nenhum! A Limppay disponibiliza de forma gratuita toda a plataforma para que os profissionais de limpeza possam se cadastrar e iniciar sua jornada.
                    </AccordionItem>
                    <AccordionItem key="3" aria-label="Accordion 3" title="Quem vai fazer o meu pagamento?" classNames={{title: 'text-ter'}}>
                        Logo que o cliente efetua o pagamento o valor fica retido em uma plataforma de pagamentos online. Assim que seu serviço for finalizado, automaticamente o valor a receber será creditado na conta cadastrada pelo profissional de limpeza.
                    </AccordionItem>

                    <AccordionItem key="4" aria-label="Accordion 4" title="Quais são as modalidades de limpeza?" classNames={{title: 'text-ter'}}>
                        Temos duas modalidades, a Residencial e Empresarial <br />
                        A residencial se divide em: Meia diária(4h), Diária (8h) e passar roupas. <br />
                        Já na empresarial temos: 1 hora, 4 horas e diárias (8h)
                    </AccordionItem>
                    <AccordionItem key="5" aria-label="Accordion 5" title="Quanto recebo pelas limpezas?" classNames={{title: 'text-ter'}}>
                        O profissional recebe 75% do valor total do serviço
                    </AccordionItem>
                    <AccordionItem key="6" aria-label="Accordion 6" title="O que eu preciso levar?" classNames={{title: 'text-ter'}}>
                        A Limppay não exige que você, profissional de limpeza, tenha gastos com os materiais de limpeza. <br />
                        Tanto o produto quanto as ferramentas de limpeza (vassoura, rodo, espanador, baldes, entre outros), serão de total responsabilidade do cliente, ele deverá fornecê-los.
                    </AccordionItem>
                    <AccordionItem key="7" aria-label="Accordion 7" title="Qual o próximo passo após realizar o cadastro?" classNames={{title: 'text-ter'}}>
                        Assim que fizer o seu cadastro, irá receber um e-mail confirmando sua inscrição. No momento estamos captando profissionais de limpeza, e assim que liberarmos o site para que os clientes possam se cadastrar, iremos avisá-los.
                    </AccordionItem>
                    <AccordionItem key="8" aria-label="Accordion 8" title="Após me cadastrar, tenho obrigação de permanecer por um determinado período?" classNames={{title: 'text-ter'}}>
                        Não. A Limppay dá a total liberdade para que nossos profissionais de limpeza optem por permanecer ou não em nossa plataforma. Porém é interessante avisar nossa equipe, para que possamos inativá-lo. Assim quando quiser retornar, poderá reativá-la ao invés de criar uma outra conta. Mantendo assim todas as avaliações, feedbacks e pontuações.
                    </AccordionItem>
                </Accordion>
              </section>
          </div>
      </section>
  )
}
import React, { useEffect } from 'react';
import Banner from "../../assets/img/seja-diarista/banner-02-1.jpg"
import { Logo } from '../imports';

export default function QuemSomos() {
    return (
      <section id="quem-somos" className='w-full'>
        <div className="relative isolate overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 flex ">
            <div className="mx-auto max-w-2xl lg:mx-0 flex flex-col justify-center items-center shadow-lg pt-10 p-5 lg:p-20 rounded-md">
              <h2 className="text-desSec text-4xl font-semibold tracking-tight lg:text-5xl">Quem Somos</h2>
              <div className='w-full text-md text-prim'>
                <p className="mt-8 text-pretty text-justify">
                  A LimpPay é uma comunidade de serviços domésticos que compartilham o compromisso de fornecer a você um serviço excepcional.
                </p>
                <p className="mt-8 text-pretty text-justify">
                  Sabemos que cuidar da sua casa pode ser estressante, por isso queremos que você se sinta tranquilo, sabendo que temos muito orgulho do trabalho que fazemos e nos certificamos de que seja feito de acordo com os mais altos padrões.
                </p>
                <p className="mt-8 text-pretty text-justify">
                  Nosso negócio é sobre pessoas. Quando você deposita sua confiança na gente, queremos que seja feliz por isso, então, da próxima vez que precisar de uma mão, você pode nos procurar novamente.
                </p>
                <p className="mt-8 text-pretty text-justify">
                  Nós temos o orgulho de fornecer a milhares de famílias em todo o país serviços líderes do setor, adaptados às suas necessidades específicas. Ao solicitar os serviços de diaristas, você sempre pode esperar que mantenhamos uma linha de comunicação aberta, prestamos muita atenção a cada detalhe e o nosso compromisso é com sua total satisfação.
                </p>
                <p className="mt-8 text-pretty text-justify">
                  Cada membro de nossa equipe passa por uma extensa verificação e um processo de treinamento completo no momento da contratação e é totalmente seguro para sua proteção.
                </p>
                <p className="mt-8 text-pretty text-justify">
                  Ao nos contratar, confie que sua casa será limpa do seu jeito. Vamos reservar um tempo para discutir suas preferências e prioridades com você antes do seu primeiro serviço de limpeza doméstica. Iremos combiná-los com nossos métodos serviços para fornecer a melhor limpeza possível. Nossas diaristas sempre chegarão com seu plano de limpeza personalizado em mãos para garantir que todas as suas necessidades sejam levadas em consideração.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}

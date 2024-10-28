import React, { useEffect } from 'react';
import Banner from "../../assets/img/seja-diarista/banner-02-1.jpg"
import { Logo } from '../imports';

export default function QuemSomos() {
    return (
      <section id="quem-somos">
        <div className="relative isolate overflow-hidden bg-gray-900 py-12  text-white">
          <img
            alt="Limppay"
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
            className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center "
          />
          <div
            aria-hidden="true"
            className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
            />
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8 flex justify-center ">
            <div className="mx-auto max-w-2xl lg:mx-0 flex flex-col justify-center items-center">
              <h2 className="text-2xl font-semibold tracking-tight text-white lg:text-5xl">Quem Somos</h2>
              <div className='w-full text-sm'>
                <p className="mt-8 text-pretty text-white text-xl/8 text-justify">
                  A LimpPay é uma comunidade de serviços domésticos que compartilham o compromisso de fornecer a você um serviço excepcional.
                </p>
                <p className="mt-8 text-pretty text-white text-xl/8 text-justify">
                  Sabemos que cuidar da sua casa pode ser estressante, por isso queremos que você se sinta tranquilo, sabendo que temos muito orgulho do trabalho que fazemos e nos certificamos de que seja feito de acordo com os mais altos padrões.
                </p>
                <p className="mt-8 text-pretty text-white text-xl/8 text-justify">
                  Nosso negócio é sobre pessoas. Quando você deposita sua confiança na gente, queremos que seja feliz por isso, então, da próxima vez que precisar de uma mão, você pode nos procurar novamente.
                </p>
                <p className="mt-8 text-pretty text-white text-xl/8 text-justify">
                  Nós temos o orgulho de fornecer a milhares de famílias em todo o país serviços líderes do setor, adaptados às suas necessidades específicas. Ao solicitar os serviços de diaristas, você sempre pode esperar que mantenhamos uma linha de comunicação aberta, prestamos muita atenção a cada detalhe e o nosso compromisso é com sua total satisfação.
                </p>
                <p className="mt-8 text-pretty text-white text-xl/8 text-justify">
                  Cada membro de nossa equipe passa por uma extensa verificação e um processo de treinamento completo no momento da contratação e é totalmente seguro para sua proteção.
                </p>
                <p className="mt-8 text-pretty text-white text-xl/8 text-justify">
                  Ao nos contratar, confie que sua casa será limpa do seu jeito. Vamos reservar um tempo para discutir suas preferências e prioridades com você antes do seu primeiro serviço de limpeza doméstica. Iremos combiná-los com nossos métodos serviços para fornecer a melhor limpeza possível. Nossas diaristas sempre chegarão com seu plano de limpeza personalizado em mãos para garantir que todas as suas necessidades sejam levadas em consideração.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}

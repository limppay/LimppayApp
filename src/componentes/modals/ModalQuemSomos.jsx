export default function ModalQuemSomos({ isOpen, setQuemSomos }) {
    if (isOpen) {
      return (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-50 bg-ter bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-11/12 max-w-3xl max-h-[80vh] transition-all">
            <div>
              <div className="text-desSec text-2xl border-b border-bord p-3 shadow-md">
                <h1>Quem Somos</h1>
              </div>
            </div>
            <div className="p-3">
              <div className="flex flex-col gap-7 text-prim p-3 overflow-y-auto max-h-[60vh] ">
                <p>A LimpPay é uma comunidade de serviços domésticos que compartilham o compromisso de fornecer a você um serviço excepcional.</p>
                <p>Sabemos que cuidar da sua casa pode ser estressante, por isso queremos que você se sinta tranquilo, sabendo que temos muito orgulho do trabalho que fazemos e nos certificamos de que seja feito de acordo com os mais altos padrões.</p>
                <p>Nosso negócio é sobre pessoas. Quando você deposita sua confiança na gente, queremos que seja feliz por isso, então, da próxima vez que precisar de uma mão, você pode nos procurar novamente.</p>
                <p>Nós temos o orgulho de fornecer a milhares de famílias em todo o país serviços líderes do setor, adaptados às suas necessidades específicas. Ao solicitar os serviços de diaristas, você sempre pode esperar que mantenhamos uma linha de comunicação aberta, prestamos muita atenção a cada detalhe e o nosso compromisso é com sua total satisfação.</p>
                <p>Cada membro de nossa equipe passa por uma extensa verificação e um processo de treinamento completo no momento da contratação e é totalmente seguro para sua proteção.</p>
                <p>Ao nos contratar, confie que sua casa será limpa do seu jeito. Vamos reservar um tempo para discutir suas preferências e prioridades com você antes do seu primeiro serviço de limpeza doméstica. Iremos combiná-los com nossos métodos serviços para fornecer a melhor limpeza possível. Nossas diaristas sempre chegarão com seu plano de limpeza personalizado em mãos para garantir que todas as suas necessidades sejam levadas em consideração.</p>
              </div>
            </div>
            <div className="flex justify-center mb-10 ">
              <button onClick={setQuemSomos} className="p-2 rounded-md w-2/4 max-w-full text-center bg-des text-white transition-all hover:bg-sec hover:bg-opacity-75">Fechar</button>
            </div>
          </div>
        </div>
      );
    }
  }
  
'use client'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

export default function ModalQuemSomos({Open, SetOpen}) {
  return (
    <Dialog open={Open} onClose={SetOpen} className="relative z-10">
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
                    Quem Somos
                  </DialogTitle>
                  <div className="mt-2">
                    <div className="flex flex-col gap-7 text-prim  overflow-y-auto max-h-[60vh] ">
                        <p>A LimpPay é uma comunidade de serviços domésticos que compartilham o compromisso de fornecer a você um serviço excepcional.</p>
                        <p>Sabemos que cuidar da sua casa pode ser estressante, por isso queremos que você se sinta tranquilo, sabendo que temos muito orgulho do trabalho que fazemos e nos certificamos de que seja feito de acordo com os mais altos padrões.</p>
                        <p>Nosso negócio é sobre pessoas. Quando você deposita sua confiança na gente, queremos que seja feliz por isso, então, da próxima vez que precisar de uma mão, você pode nos procurar novamente.</p>
                        <p>Nós temos o orgulho de fornecer a milhares de famílias em todo o país serviços líderes do setor, adaptados às suas necessidades específicas. Ao solicitar os serviços de diaristas, você sempre pode esperar que mantenhamos uma linha de comunicação aberta, prestamos muita atenção a cada detalhe e o nosso compromisso é com sua total satisfação.</p>
                        <p>Cada membro de nossa equipe passa por uma extensa verificação e um processo de treinamento completo no momento da contratação e é totalmente seguro para sua proteção.</p>
                        <p>Ao nos contratar, confie que sua casa será limpa do seu jeito. Vamos reservar um tempo para discutir suas preferências e prioridades com você antes do seu primeiro serviço de limpeza doméstica. Iremos combiná-los com nossos métodos serviços para fornecer a melhor limpeza possível. Nossas diaristas sempre chegarão com seu plano de limpeza personalizado em mãos para garantir que todas as suas necessidades sejam levadas em consideração.</p>
                    </div>           
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                data-autofocus
                onClick={() => SetOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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

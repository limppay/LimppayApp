import React, { useEffect } from 'react';

export default function ModalDuvidas({ isOpen, setOpenModal }) {
  useEffect(() => {
    if (isOpen) {
      const paragraphs = document.querySelectorAll(".duvida");
      paragraphs.forEach((paragrafo, index) => {
        paragrafo.setAttribute('data-index', index);
      });

      fetch('src/assets/modalDuvidas.json')
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

      const spans = document.querySelectorAll(".painel-title");
      spans.forEach((span, index) => {
        const handleClick = () => {
          const duvida = document.querySelectorAll(".painel-content")[index];
          duvida.classList.toggle("mostrar");
        };
        span.addEventListener("click", handleClick);

        return () => {
          span.removeEventListener("click", handleClick);
        };
      });
    }
  }, [isOpen]);

  if (isOpen) {
    return (
      <div className='fixed top-0 bottom-0 left-0 right-0 z-50 bg-ter bg-opacity-50 flex items-center justify-center'>
        <div className='bg-white rounded-lg w-11/12 max-w-3xl max-h-[80vh] transition-all'>
          <div>
            <div className='text-desSec text-2xl border-b border-bord p-3 shadow-md'>
              <h1>Tem Dúvidas?</h1>
            </div>
          </div>
          <div className='p-5 flex flex-col gap-4 max-h-[70vh]'>
            <div className='overflow-y-auto max-h-[60vh] flex flex-col gap-10'>
              <div className='flex flex-col gap-7 text-prim'>
                <p>Este espaço é para tirar dúvidas conforme os tópicos abaixo que traz as perguntas mais frequentes feitas pelos nossos clientes.</p>
                <p>Se nossos tópicos não conseguiram atender você, nos envie um contato através de nossos e-mail <a href="mailto:contato@limppay.com" className='text-des'>contato@limppay.com</a>, ou pelo nosso <a href="https://api.whatsapp.com/send?phone=5592992648251" className='text-des'>Whatsapp</a></p>
              </div>
              <div className='perguntas flex flex-col '>
                <div className='flex items-center border-b border-bord justify-between p-3 text-prim painel-title'>
                  <span>Sobre a limpeza</span>
                  <span className="material-symbols-outlined">arrow_drop_down</span>
                </div>
                <div className='painel-content'>
                  <p className="duvida"></p>
                </div>

                <div className='flex items-center border-b border-bord justify-between p-3 text-prim painel-title'>
                  <span>Sobre o Agendamento</span>
                  <span className="material-symbols-outlined">arrow_drop_down</span>
                </div>
                <div className='painel-content'>
                  <p className="duvida"></p>
                </div>

                <div className='flex items-center border-b border-bord justify-between p-3 text-prim painel-title'>
                  <span>Sobre os profissionais</span>
                  <span className="material-symbols-outlined">arrow_drop_down</span>
                </div>
                <div className='painel-content'>
                  <p className="duvida"></p>
                </div>

                <div className='flex items-center border-b border-bord justify-between p-3 text-prim painel-title'>
                  <span>Sobre os produtos</span>
                  <span className="material-symbols-outlined">arrow_drop_down</span>
                </div>
                <div className='painel-content'>
                  <p className="duvida"></p>
                </div>   

                <div className='flex items-center border-b border-bord justify-between p-3 text-prim painel-title'>
                  <span>Por que escolher a Limppay?</span>
                  <span className="material-symbols-outlined">arrow_drop_down</span>
                </div>
                <div className='painel-content'>
                  <p className="duvida"></p>
                </div>      
              </div>
            </div>
            <div className='flex justify-center pt-10'>
              <button onClick={setOpenModal} className=' p-2 rounded-md w-2/4 max-w-full text-center bg-des text-white transition-all hover:bg-sec hover:bg-opacity-75'>Fechar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

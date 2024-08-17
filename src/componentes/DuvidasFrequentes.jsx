import React, { useEffect } from 'react';

export default function DuvidasFrequentes() {
    useEffect(() => {
        // Função para adicionar um índice para cada parágrafo
        const paragraphs = document.querySelectorAll(".duvida");
        paragraphs.forEach((paragrafo, index) => {
          paragrafo.setAttribute('data-index', index);
        });
      
        // Função para adicionar duvidaos grandes no HTML
        fetch('src/assets/duvidas.json')
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
  return(
      <section className="duvidas-frequentes" id="duvidas">
          <div className="container-duvidas-frequentes">
              <div className="container-duvidas-frequentes-painel">
                  <div className="container-duvidas-frequentes-title">
                      <h2>Dúvidas frequentes</h2>
                  </div>
                  <div className="container-duvidas-frequentes-info">
                      <p className="duvida"></p>
                  </div>
              </div>
              <section className="paineis-duvida">
                  <div className="container-painel-duvida">
                      <div className="painel-title">
                          <span>Como funciona o sistema da Limppay?</span>
                          <span className="material-symbols-outlined">arrow_drop_down</span>
                      </div>
                      <div className="painel-content">
                          <p className="duvida"></p>
                          <p className="duvida"></p>
                      </div>
                      <div className="painel-title">
                          <span>Qual o custo para fazer o uso da plataforma Limppay?</span>
                          <span className="material-symbols-outlined">arrow_drop_down</span>
                      </div>
                      <div className="painel-content">
                          <p className="duvida"></p>
                      </div>
                      <div className="painel-title">
                          <span>Quem vai fazer o meu pagamento?</span>
                          <span className="material-symbols-outlined">arrow_drop_down</span>
                      </div>
                      <div className="painel-content">
                          <p className="duvida"></p>
                      </div>
                      <div className="painel-title">
                          <span>Quais são as modalidades de limpeza?</span>
                          <span className="material-symbols-outlined">arrow_drop_down</span>
                      </div>
                      <div className="painel-content">
                          <p className="duvida"></p>
                          <p className="duvida"></p>
                          <p className="duvida"></p>
                      </div>
                      <div className="painel-title">
                          <span>Quanto recebo pelas limpezas?</span>
                          <span className="material-symbols-outlined">arrow_drop_down</span>
                      </div>
                      <div className="painel-content">
                         <p className="duvida"></p>
                      </div>
                      <div className="painel-title">
                          <span>O que eu preciso levar?</span>
                          <span className="material-symbols-outlined">arrow_drop_down</span>
                      </div>
                      <div className="painel-content">
                          <p className="duvida"></p>
                          <p className="duvida"></p>
                      </div>
                      <div className="painel-title">
                          <span>Qual o próximo passo após realizar o cadastro?</span>
                          <span className="material-symbols-outlined">arrow_drop_down</span>
                      </div>
                      <div className="painel-content">
                          <p className="duvida"></p>
                      </div>
                      <div className="painel-title">
                          <span>Após me cadastrar, tenho obrigação de permanecer por um determinado período?</span>
                          <span className="material-symbols-outlined">arrow_drop_down</span>
                      </div>
                      <div className="painel-content">
                          <p className="duvida"></p>
                      </div>
                  </div>
              </section>
          </div>
      </section>
  )
}
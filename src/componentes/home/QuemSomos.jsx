import React, { useEffect } from 'react';

export default function QuemSomos() {
    useEffect(() => {
        // Função para adicionar um índice para cada parágrafo
        const paragraphs = document.querySelectorAll(".text");
        paragraphs.forEach((paragrafo, index) => {
          paragrafo.setAttribute('data-index', index);
        });
      
        // Função para adicionar textos grandes no HTML
        fetch("/src/assets/index.json")
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
      }, []);
      
    return (
        <section className="quem-somos" id="quem-somos">
            <div className="container-quem-somos">
                <div className="container-quem-somo-title">
                    <h2>Quem Somos</h2>
                </div>
                <div className="container-quem-somos-content">
                    <p className="text"></p>
                    <p className="text"></p>
                    <p className="text"></p>
                    <p className="text"></p>
                    <p className="text"></p>
                    <p className="text"></p>
                </div>
            </div>
        </section>
    );
}

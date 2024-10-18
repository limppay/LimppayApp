import React, { useEffect } from 'react';
import SobreNos from "../../assets/index.json"

export default function QuemSomos() {

    useEffect(() => {
      // Função para adicionar um índice para cada parágrafo
      const paragraphs = document.querySelectorAll(".text");
      paragraphs.forEach((paragrafo, index) => {
        paragrafo.setAttribute('data-index', index);
      });
    
      // Função para adicionar textos grandes no HTML
      paragraphs.forEach(p => {
        const index = p.getAttribute('data-index');
        if (SobreNos[index] !== undefined) {
          p.innerHTML = SobreNos[index];
        }
      });
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

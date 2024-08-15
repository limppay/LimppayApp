import React, { useEffect } from 'react';
import '../../styles/App.css';
import '../../styles/index.css';
import Header from '../../componentes/Header.jsx';
import Slide from '../../componentes/home/Slide.jsx';
import ElementosSobre from '../../componentes/home/ElementosSobre.jsx';
import Contrate from '../../componentes/home/Contrate.jsx';
import Servicos from '../../componentes/home/Servicos.jsx';
import Sobre from '../../componentes/home/Sobre.jsx';
import Contratar from '../../componentes/home/Contratar.jsx';
import QuemSomos from '../../componentes/home/QuemSomos.jsx';
import DuvidasFrequentes from '../../componentes/DuvidasFrequentes.jsx';
import NossosContatos from '../../componentes/home/NossosContatos.jsx';
import Footer from '../../componentes/Footer.jsx';

export default function App() {
  useEffect(() => {
    // Função para adicionar um índice para cada parágrafo
    const paragraphs = document.querySelectorAll(".text");
    paragraphs.forEach((paragrafo, index) => {
      paragrafo.setAttribute('data-index', index);
    });

    // Função para adicionar textos grandes no HTML
    fetch('src/pages/home/index.json')
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

  return (
    <div className="app">
      <Header href="src/assets/img/limppay-embreve.png" alt="Limppay"/>
      <main>
        <Slide href="src/assets/img/slide/1920x700-01.webp" alt="fale com a gente"/>
        <ElementosSobre/>
        <Contrate/>
        <Servicos/>
        <Sobre/>
        <Contratar/>
        <QuemSomos/>
        <DuvidasFrequentes/>
        <NossosContatos/>
      </main>
      <Footer/>
    </div>
  );
}

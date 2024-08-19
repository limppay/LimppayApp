import '../../styles/App.css';
import '../../styles/index.css';
import '../../styles/duvidas.css';
import "../../styles/footer.css";
import HeaderApp from '../../componentes/HeaderApp.jsx';
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
import logo from '../../assets/img/limppay-logo.png'

export default function App() {
  const buttons = [
    {link: "#quem-somos", text: "Quem somos"},
    {link: "#servicos", text: "Serviços"},
    {link: "#duvidas", text: "Dúvidas"},
    {link: "https://limppay.com/blog/", text: "Blog"},
    {link: "#contatos", text: "Contato"},
  ]

  const btnAcess = [
    { AcessPrim: "Seja Diarista", 
      AcessSec: "Contrate Online",
      LinkPrim: "seja-diarista.html",
      LinkSec: "#"  
    },
  ]

  return (
    <div className="app">
      <HeaderApp img={logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess}/>
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

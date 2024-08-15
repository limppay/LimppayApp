export default function Header(props) {
    return (
        <header>
            <div className="contatos">
                <div className="elementor-adress">
                    <span className="material-symbols-outlined">location_on</span><span><strong>Avenida Rodrigo Otávio, 6488 - Distrito Industrial Flores</strong></span>
                </div>
                <div className="elementor-contact">
                    <span className="material-symbols-outlined">call</span><span><strong>(92) 99264-8251</strong></span>
                </div>
            </div>

            <nav className="navigation">
                <a href="#"><img 
                src={props.href} 
                alt={props.alt}
                /></a>

                <ul>
                    <li><a href="#quem-somos">Quem Somos</a></li>
                    <li><a href="#servicos">Serviços</a></li>
                    <li><a href="#duvidas">Dúvidas</a></li>
                    <li><a href="https://limppay.com/blog/">Blog</a></li>
                    <li><a href="#nossos-contatos">Contato</a></li>
                </ul>
                <div className="btn">
                    <a href="seja-diarista.html" id="seja-diarista">Seja Diarista</a>
                    <a href="https://app.limppay.com/" id="contrate-online">Contrate online</a>
                </div>
            </nav>
        </header>
    )
}
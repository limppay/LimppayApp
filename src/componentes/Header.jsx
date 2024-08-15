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
                <a href="index"><img 
                src={props.href} 
                alt={props.alt}
                /></a>

                <ul>
                    <li><a href={props.l1}>{props.text1}</a></li>
                    <li><a href={props.l2}>{props.text2}</a></li>
                    <li><a href={props.l3}>{props.text3}</a></li>
                    <li><a href={props.l4}>{props.text4}</a></li>
                    <li><a href={props.l5}>{props.text5}</a></li>
                </ul>
                <div className="btn">
                    <a href="seja-diarista.html" id="seja-diarista">Seja Diarista</a>
                    <a href="#" id="contrate-online">Contrate online</a>
                </div>
            </nav>
        </header>
    )
}
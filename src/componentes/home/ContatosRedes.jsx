import Instagram from "../../assets/img/redes-sociais/instagram.png"
import TikTok from "../../assets/img/redes-sociais/tiktok.png"
import Linkedin from "../../assets/img/redes-sociais/linkedin.png"
import YouTube from "../../assets/img/redes-sociais/youtube.png"

export default function ContatosRedes() {
    return(
        <div className="content-nossos-contatos">
            <div>
                <h2>Nossas redes sociais</h2>
            </div>
            <div className="container-redes-sociais">
                <a href="https://www.instagram.com/limppay/" target="_blank"><img src={Instagram} alt="instagram"/></a>

                <a href="https://www.tiktok.com/@limppay?_r=1&_t=8mNAYb1j6xR&utm_campaign=avaliacoes_dos_clientes_part2&utm_medium=email&utm_source=RD+Station" target="_blank"><img src={TikTok} alt="tiktok"/></a>
                
                <a href="https://www.linkedin.com/company/limppay" alt="linkedin"><img src={Linkedin} alt="linkedin"/></a>

                <a href="http://www.youtube.com/@limppay2445" target="_blank"><img src={YouTube} alt="youtube"/></a>
            </div>
        </div>
    )
}
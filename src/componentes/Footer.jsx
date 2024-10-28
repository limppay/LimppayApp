import Instagram from "../assets/img/redes-sociais/instagram.png"
import TikTok from "../assets/img/redes-sociais/tiktok.png"
import Linkedin from "../assets/img/redes-sociais/linkedin.png"
import YouTube from "../assets/img/redes-sociais/youtube.png"

export default function Footer() {
    return(
        <footer id="contatos" className="text-ter p-3">
            <div className="flex lg:pt-10">
                <div className="flex lg:justify-around justify-between text-sm items-baseline">
                    <div className="flex flex-col w-4/12 flex-wrap">
                        <h3 className="text-ter font-semibold text-lg">Contato</h3>
                        <p>Telefone: (92) 9264 8251</p>
                        <p>Email: contato@limppay.com</p>
                        <div className="flex flex-col  items-center pt-5 ">
                            <div className="flex gap-4 items-center">
                                <a className=" md:w-3/12 lg:w-2/12" href="https://www.instagram.com/limppay/" target="_blank"><img src={Instagram} alt="instagram" /></a>

                                <a href="https://www.tiktok.com/@limppay?_r=1&_t=8mNAYb1j6xR&utm_campaign=avaliacoes_dos_clientes_part2&utm_medium=email&utm_source=RD+Station" target="_blank" className=" md:w-3/12 lg:w-2/12"><img src={TikTok} alt="tiktok"/></a>
                                
                                <a href="https://www.linkedin.com/company/limppay" alt="linkedin" className=" md:w-3/12 lg:w-2/12"><img src={Linkedin} alt="linkedin"/></a>

                                <a href="http://www.youtube.com/@limppay2445" target="_blank"><img src={YouTube} alt="youtube" className=" md:w-3/12 lg:w-2/12"/></a>
                            </div>
                        </div>
                    </div>
            
                    <div className="flex flex-col pl-20 ">
                        <h3 className="text-ter font-semibold text-lg">Endereço</h3>
                        <p>Avenida Rodrigo Otávio, nº 6488, Coroado</p>
                        <p>69080-005 Manaus-AM</p>
                    </div>
                </div>
            </div>
            <div className="text-end pt-20 lg:pt-10 pb-5">
                <p>&copy; Limppay 2024 – Todos os direitos reservados</p>
            </div>
        </footer>
    )
}
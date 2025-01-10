import Instagram from "../assets/img/redes-sociais/instagram.webp"
import TikTok from "../assets/img/redes-sociais/tiktok.webp"
import Linkedin from "../assets/img/redes-sociais/linkedin.webp"
import YouTube from "../assets/img/redes-sociais/youtube.webp"

export default function Footer() {
    return(
        <footer id="contatos" className="text-ter ">
            <div className="flex p-5  justify-between pt-0 2xl:p-10 pb-0">
                <div className="flex justify-between w-full  text-sm items-baseline">
                    <div className="flex flex-col w-4/12 flex-wrap">
                        <h3 className="text-ter font-semibold text-lg">Contato</h3>
                        <p>Telefone: (92) 9264 8251</p>
                        <p>Email: contato@limppay.com</p>
                        <div className="pt-5">
                            <div className="flex gap-4 items-center justify-start">
                                <a  href="https://www.instagram.com/limppay/" target="_blank">
                                    <img src={Instagram} alt="instagram" className="2xl:max-w-[5vh] sm:max-w-[5vh] "  />
                                </a>

                                <a href="https://www.tiktok.com/@limppay?_r=1&_t=8mNAYb1j6xR&utm_campaign=avaliacoes_dos_clientes_part2&utm_medium=email&utm_source=RD+Station" target="_blank" >
                                    <img src={TikTok} alt="tiktok" className="2xl:max-w-[5vh] sm:max-w-[5vh] "/>
                                </a>
                                
                                <a href="https://www.linkedin.com/company/limppay" alt="linkedin" >
                                    <img src={Linkedin} alt="linkedin" className="2xl:max-w-[5vh] sm:max-w-[5vh] "/>
                                </a>

                                <a href="http://www.youtube.com/@limppay2445" target="_blank">
                                    <img src={YouTube} alt="youtube" className="2xl:max-w-[5vh] sm:max-w-[5vh]  " />
                                </a>
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
            <div className="text-end p-5 pt-20 lg:pt-10 pb-5 2xl:p-10">
                <p>&copy; Limppay 2024 – Todos os direitos reservados</p>
            </div>
        </footer>
    )
}

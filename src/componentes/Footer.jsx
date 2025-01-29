import { useEffect, useState } from 'react';
import Instagram from "../assets/img/redes-sociais/instagram.webp";
import TikTok from "../assets/img/redes-sociais/tiktok.webp";
import Linkedin from "../assets/img/redes-sociais/linkedin.webp";
import YouTube from "../assets/img/redes-sociais/youtube.webp";

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetch('http://worldtimeapi.org/api/timezone/etc/utc')
      .then(response => response.json())
      .then(data => {
        const currentYear = new Date(data.datetime).getFullYear();
        setYear(currentYear);
      })
      .catch(error => {
        console.error('Erro ao buscar a data:', error);
      });
  }, []);

  return (
    <footer id="contatos" className="text-ter px-4 py-6 md:px-10 ">

      {/* Contato e Endereço */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-8">
        {/* Contato */}
        <div className="flex flex-col md:w-6/12">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Contato</h3>
          <p className="text-gray-700 text-sm">Telefone: (92) 9264 8251</p>
          <p className="text-gray-700 text-sm">Email: contato@limppay.com</p>
          <div className="flex gap-4 items-center justify-start mt-4">
            <a href="https://www.instagram.com/limppay/" target="_blank" rel="noreferrer">
              <img src={Instagram} alt="instagram" className="w-6 h-6 md:w-8 md:h-8" />
            </a>
            <a
              href="https://www.tiktok.com/@limppay?_r=1&_t=8mNAYb1j6xR&utm_campaign=avaliacoes_dos_clientes_part2&utm_medium=email&utm_source=RD+Station"
              target="_blank"
              rel="noreferrer"
            >
              <img src={TikTok} alt="tiktok" className="w-6 h-6 md:w-8 md:h-8" />
            </a>
            <a href="https://www.linkedin.com/company/limppay" target="_blank" rel="noreferrer">
              <img src={Linkedin} alt="linkedin" className="w-6 h-6 md:w-8 md:h-8" />
            </a>
            <a href="http://www.youtube.com/@limppay2445" target="_blank" rel="noreferrer">
              <img src={YouTube} alt="youtube" className="w-6 h-6 md:w-8 md:h-8" />
            </a>
          </div>
        </div>

        {/* Endereço */}
        <div className="flex flex-col md:text-end  md:w-6/12">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Endereço</h3>
          <p className="text-gray-700 text-sm">Avenida Rodrigo Otávio, nº 6488, Coroado</p>
          <p className="text-gray-700 text-sm">69080-005 Manaus-AM</p>
        </div>

      </div>

      {/* Direitos reservados */}
      <div className="text-center mt-6 pt-4">
        <p className="text-sm text-gray-600">&copy; Limppay {year} – Todos os direitos reservados</p>
      </div>

    </footer>
  );
}
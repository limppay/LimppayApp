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
    <footer id="contatos" className="bg-gray-50 text-gray-800 px-4 py-8 md:px-12 md:py-10">
      <div className="max-w-7xl mx-auto">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contato */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Contato</h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-700">Telefone: (92) 9264-8251</p>
              <p className="text-sm text-gray-700">Email: contato@limppay.com</p>
            </div>
            <div className="flex gap-4 mt-4">
              <a href="https://www.instagram.com/limppay/" target="_blank" rel="noreferrer" className="hover:opacity-80 transition">
                <img src={Instagram} alt="Instagram" className="w-6 h-6 md:w-7 md:h-7" />
              </a>
              <a
                href="https://www.tiktok.com/@limppay?_r=1&_t=8mNAYb1j6xR&utm_campaign=avaliacoes_dos_clientes_part2&utm_medium=email&utm_source=RD+Station"
                target="_blank"
                rel="noreferrer"
                className="hover:opacity-80 transition"
              >
                <img src={TikTok} alt="TikTok" className="w-6 h-6 md:w-7 md:h-7" />
              </a>
              <a href="https://www.linkedin.com/company/limppay" target="_blank" rel="noreferrer" className="hover:opacity-80 transition">
                <img src={Linkedin} alt="LinkedIn" className="w-6 h-6 md:w-7 md:h-7" />
              </a>
              <a href="http://www.youtube.com/@limppay2445" target="_blank" rel="noreferrer" className="hover:opacity-80 transition">
                <img src={YouTube} alt="YouTube" className="w-6 h-6 md:w-7 md:h-7" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3 md:flex md:flex-col md:items-center">
            <ul className="flex flex-col items-start space-y-1">
            <h3 className="text-lg font-semibold text-gray-800">Links úteis</h3>
              <li>
                <a
                  href="/seja-diarista"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Seja Diarista
                </a>
              </li>
              <li>
                <a
                  href="/contrate-online"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Contrate Online
                </a>
              </li>
              <li>
                <a
                  href="/delete-account"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Excluir Conta
                </a>
              </li>
              <li>
                <a
                  href="/politica-de-cookies"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Política de Cookies
                </a>
              </li>
            </ul>
          </div>

          {/* Endereço */}
          <div className="space-y-3 text-left md:text-right">
            <h3 className="text-lg font-semibold text-gray-800">Endereço</h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-700">Avenida Rodrigo Otávio, nº 6488, Coroado</p>
              <p className="text-sm text-gray-700">69080-005 Manaus-AM</p>
            </div>
          </div>
        </div>

        {/* Direitos reservados */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">© Limppay {year} – Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  );
}
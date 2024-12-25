import React from "react";
import WhatsAppIcon from "../assets/img/whatsappIcon.png"

const WhatsappButton = () => {
  return (
    <a
      href="https://api.whatsapp.com/send?phone=5592992648251&text=Ol%C3%A1,%20vim%20pelo%20seu%20site%20e%20gostaria%20de%20saber%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20servi%C3%A7o!%20%E2%9C%85"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-2 right-2 z-5  items-center space-x-1 group p-2 hidden sm:flex"
    >
      {/* Texto "Atendimento" */}
      <span className="bg-white rounded-xl opacity-0  shadow-2xl shadow-prim p-2 text-sec text-sm  group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300 ease-in-out">
        Atendimento
      </span>

      {/* Ícone do WhatsApp */}
      <div className="2xl:w-12 2xl:h-12 rounded-full bg-green-500 flex items-center justify-center shadow-sm shadow-prim  group hover:scale-110 transition-transform duration-300">
        <img
          src={WhatsAppIcon}
          alt="WhatsApp"
          className="w-[8h] h-[8vh] 2xl:w-12 2xl:h-12"
        />
      </div>
    </a>
  );
};

export default WhatsappButton;

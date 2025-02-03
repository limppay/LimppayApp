import { useState, useEffect } from "react";
import CookiePng from "../../assets/img/icons8-cookie-50.webp";
import { Button } from "@nextui-org/react";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookiesConsent");
    if (!consent) {
      setShowBanner(true);
      setTimeout(() => setIsVisible(true), 50); // Delay para ativar a animação
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesConsent", "accepted");
    enableNonEssentialCookies();
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 1000); // Tempo para finalizar a animação
  };

  const handleDecline = () => {
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 1000); // Tempo para finalizar a animação
  };

  const enableNonEssentialCookies = () => {
  };

  if (!showBanner) return null;

  return (
    <div
      className={`fixed bottom-4 w-full flex justify-center items-center transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-52"
      }`}
    >
      <div className="max-w-[40vh] left-5 right-5 bg-white  text-prim p-4 rounded-lg shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 sm:max-w-[100vh]  border-2 border-desSec">
        <div className="flex items-center gap-4">
          <img src={CookiePng} alt="Cookie" className="w-8 h-8" />
          <p className="text-sm leading-relaxed">
            Utilizamos cookies para melhorar sua experiência.{" "}
            <a href="/politica-de-cookies" className="font-semibold underline" target="_blank">
              Saiba mais
            </a>.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onPress={() => handleDecline()}
            auto
            flat
            className="text-prim border-bord border bg-white"
          >
            Recusar
          </Button>
          <Button
            onPress={() => handleAccept()}
            auto
            className="bg-desSec text-white"
          >
            Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;

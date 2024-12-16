import { useState, useEffect } from "react";
import CookiePng from "../../assets/img/icons8-cookie-50.png"
import { Button } from "@nextui-org/react";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("cookiesConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesConsent", "accepted");
    enableNonEssentialCookies();
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookiesConsent", "declined");
    setShowBanner(false);
  };

  const enableNonEssentialCookies = () => {
    console.log("Cookies não essenciais ativados!");
    // Exemplo: Ativar Google Analytics ou outros scripts
    // enableGoogleAnalytics();
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white  text-prim p-4 flex flex-col sm:flex-row items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-5">
            <img 
            src={CookiePng} 
            alt="Coookie"
            className="text-prim" 
            />
            <p className="mb-2 sm:mb-0 text-center sm:text-left">
                Este site utiliza cookies para melhorar sua experiência.{" "}
                <a href="/politica-de-cookies" className="text-blue-400 underline">
                Saiba mais.
                </a>
            </p>
        </div>
        <div className="flex space-x-4">
            <Button
            onClick={handleAccept}
            className="bg-white border border-sec text-sec "
            >
            Aceitar
            </Button>
            <Button
            onClick={handleDecline}
            className="bg-white border border-error text-error "
            >
            Recusar
            </Button>
        </div>
    </div>
  );
};

export default CookieBanner;

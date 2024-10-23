import ContrateOnline from "../../assets/img/1.webp";
import SejaDiarista from "../../assets/img/2.webp";

export default function Contrate() {
    return (
        <section className="py-10 bg-gray-100">
            <div className="container mx-auto px-4 flex flex-col md:flex-row gap-10">
                <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col items-center justify-center">
                    <div className="img-box flex flex-col items-center">
                        <img src={ContrateOnline} alt="contrate diarista" className="w-full h-64 object-cover" />
                        <div className="p-4 flex flex-col items-center">
                            <h3 className="text-xl font-semibold">Contrate diarista</h3>
                            <p className="text-gray-600 mt-2">
                                Com uma rotina tão agitada, é comum não ter tempo para tudo. A LimpPay te ajuda com isso. Temos pacotes de serviços de limpeza com base nas suas preferências específicas.
                            </p>
                        </div>
                    </div>
                    <div className="p-4">
                        <a href="#" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Contrate online</a>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
                    <div className="img-box">
                        <img src={SejaDiarista} alt="seja diarista" className="w-full h-64 object-cover" />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold">Seja diarista</h3>
                            <p className="text-gray-600 mt-2">
                                Se você tem experiência com limpeza, esta é a oportunidade de obter uma renda extra, já que estamos constantemente procurando por novas parcerias profissionais.
                            </p>
                        </div>
                    </div>
                    <div className="p-4">
                        <a href="http://localhost:5173/seja-diarista" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Seja diarista</a>
                    </div>
                </div>
            </div>
        </section>
    );
}

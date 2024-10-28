import ContrateOnline from "../../assets/img/1.webp";
import SejaDiarista from "../../assets/img/2.webp";

export default function Contrate() {
    return (
        <section className="pt-0 lg:p-24 lg:pb-0 lg:pt-0 ">
            <div className="container mx-auto px-4 flex flex-col md:flex-row gap-10">
                <div className="bg-white  rounded-lg overflow-hidden flex flex-col-reverse lg:flex-row items-center justify-center">
                    <div className="items-center justify-center">
                        <div className="p-4 flex flex-col">
                            <h3 className="text-xl font-semibold text-ter">Contrate diarista</h3>
                            <p className="text-prim mt-2">
                                Com uma rotina tão agitada, é comum não ter tempo para tudo. A LimpPay te ajuda com isso. Temos pacotes de serviços de limpeza com base nas suas preferências específicas.
                            </p>
                        </div>
                        <div className="p-4">
                            <a href="/contrate-online" className="bg-des text-white px-4 py-2 rounded hover:bg-blue-600 transition">Contrate online</a>
                        </div>
                    </div>
                    <img src={ContrateOnline} alt="contrate diarista" className=" lg:w-4/12 object-cover" />
                </div>
            </div>
            <div className="container mx-auto px-4 flex flex-col md:flex-row gap-10">
                <div className="bg-white  rounded-lg overflow-hidden flex flex-col lg:flex-row  items-center justify-center">
                    <img src={SejaDiarista} alt="contrate diarista" className="lg:w-4/12 object-cover" />
                    <div className="items-center justify-center">
                        <div className="p-4 flex flex-col">
                            <h3 className="text-xl font-semibold text-ter">Seja diarista</h3>
                            <p className="text-prim mt-2">
                                Se você tem experiência com limpeza, esta é a oportunidade de obter uma renda extra, já que estamos constantemente procurando por novas parcerias profissionais.
                            </p>
                        </div>
                        <div className="p-4">
                            <a href="/seja-diarista" className="bg-des text-white px-4 py-2 rounded hover:bg-blue-600 transition">Seja diarista</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

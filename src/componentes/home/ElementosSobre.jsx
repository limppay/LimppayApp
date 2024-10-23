import LocalServico from "../../assets/img/localeservico.png";
import DataHora from "../../assets/img/datehora.png";
import Profissional from "../../assets/img/profissional.png";
import SolicitarServico from "../../assets/img/localeservico.png";

export default function ElementosSobre() {
    return (
        <section className="py-12">
            <div className="container mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-4 text-desSec">Ter seus ambientes organizados<br/> e limpos nunca foi tão fácil.</h2>
                    <p className="text-lg text-prim">Com a LimpPay é rápido e completamente online.</p>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-baseline">
                    <div className="text-center">
                        <img src={LocalServico} alt="Local e serviço" className="mx-auto mb-4"/>
                        <h3 className="text-xl font-semibold mb-2">Local e serviços</h3>
                        <p>Casas, apartamentos, escritórios, consultórios e salas comerciais.</p>
                    </div>
                    <div className="text-center">
                        <img src={DataHora} alt="Data e Hora" className="mx-auto mb-4"/>
                        <h3 className="text-xl font-semibold mb-2">Data e hora</h3>
                        <p>Na hora e no momento mais conveniente para você.</p>
                    </div>
                    <div className="text-center">
                        <img src={Profissional} alt="Selecione profissional" className="mx-auto mb-4"/>
                        <h3 className="text-xl font-semibold mb-2">Selecione profissional</h3>
                        <p>Escolha o profissional da sua preferência</p>
                    </div>
                    <div className="text-center">
                        <img src={SolicitarServico} alt="Solicitação de serviço" className="mx-auto mb-4"/>
                        <h3 className="text-xl font-semibold mb-2">Solicitação de serviço</h3>
                        <p>Confirme, efetue o pagamento e aguarde no local marcado.</p>
                    </div>
                </section>
            </div>
        </section>
    );
}

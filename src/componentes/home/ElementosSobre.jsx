import LocalServico from "../../assets/img/localeservico.png"
import DataHora from "../../assets/img/datehora.png"
import Profissional from "../../assets/img/profissional.png"
import SolicitarServico from "../../assets/img/localeservico.png"


export default function ElementosSobre() {
    return (
        <section className="elementos-sobre">
            <div className="container-sobre">
                <div className="container-sobre-h2">
                    <h2>Ter seus ambientes organizados<br/> e limpos nunca foi tão fácil.</h2>
                </div>
                <div className="container-sobre-p">
                    <p>Com a LimpPay é rápido e completamente online.</p>
                </div>

                <section className="informações">
                    <div className="info">
                        <img src={LocalServico} alt="Local e serviço"/>
                        <h3>Local e serviços</h3>
                        <p>Casas, apartamentos, escritórios, consultórios e salas comerciais.</p>
                    </div>
                    <div className="info">
                        <img src={DataHora} alt="Data e Hora"/>
                        <h3>Data e hora</h3>
                        <p>Na hora e no momento mais conveniente para você.</p>
                    </div>
                    <div className="info">
                        <img src={Profissional} alt="Selecione profissional"/>
                        <h3>Selecione profissional</h3>
                        <p>Escolha o profissional da sua preferência</p>
                    </div>
                    <div className="info">
                        <img src={SolicitarServico} alt="Solicitação de serviço"/>
                        <h3>Solicitação de serviço</h3>
                        <p>Confirme, efetue o pagamento e aguarde no local marcado.</p>
                    </div>
                </section>
            </div>
        </section>

    )
}
export default function Servicos() {
    return (
        <section className="servicos" id="servicos">
            <div className="servicos-content">
                <div className="servicos-title">
                    <h2>Serviços</h2>
                </div>
                <section className="section-servicos-content">
                    <div className="servico">
                        <div className="servico-img-box">
                            <img src="src/assets/img/MG_9549.webp" alt="limpeza residencial" />
                            <div className="servico-img-box-content">
                                <h3>Limpeza residencial</h3>
                                <p>Casas e apartamentos mais limpos e organizados</p>
                            </div>
                        </div>
                        <div>
                            <a href="https://app.limppay.com/" className="contrate-online-btn">Contrate online</a>
                        </div>
                    </div>
                    <div className="servico">
                        <div className="servico-img-box">
                            <img src="src/assets/img/MG_9585.webp" alt="limpeza residencial" />
                            <div className="servico-img-box-content">
                                <h3>Roupas passadas</h3>
                                <p>Serviço profissional disponível por diária.</p>
                            </div>
                        </div>
                        <div>
                            <a href="https://app.limppay.com/" className="contrate-online-btn">Contrate online</a>
                        </div>
                    </div>
                    <div className="servico">
                        <div className="servico-img-box">
                            <img src="src/assets/img/MG_9567.webp" alt="limpeza residencial" />
                            <div className="servico-img-box-content">
                                <h3>Limpeza empresarial</h3>
                                <p>Ambientes profissionais, como consultórios e escritórios.</p>
                            </div>
                        </div>
                        <div>
                            <a href="https://app.limppay.com/" className="contrate-online-btn">Contrate online</a>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    )
}
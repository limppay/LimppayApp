export default function Contrate() {
    return (
        <section className="contrate">
            <div className="contrate-content">
                <div className="contrate-online">
                    <div className="img-box">
                        <img src="src/assets/img/1.webp" alt="contrate diarista" />
                        <div className="img-content-box">
                            <h3>Contrate diarista</h3>
                            <p>Com uma rotina tão agitada, é comum não ter tempo para tudo. A LimpPay te ajuda com isso. Temos pacotes de serviços de limpeza com base nas suas preferências específicas.</p>
                        </div>
                    </div>
                    <div>
                        <a href="#" className="contrate-online-btn">Contrate online</a>
                    </div>
                </div>

                <div className="seja-diarista">
                    <div className="img-box">
                        <img src="src/assets/img/2.webp" alt="seja diarista"/>
                        <div className="img-content-box">
                            <h3>Seja diarista</h3>
                            <p>Se você tem experiência com limpeza, esta é a oportunidade de obter uma renda extra, já que estamos constantemente procurando por novas parcerias profissionais.</p>
                        </div>
                    </div>
                    <div>
                        <a href="http://localhost:5173/seja-diarista" className="seja-diarista-btn">Seja diarista</a>
                    </div>
                </div>
            </div>
        </section>
    )
}
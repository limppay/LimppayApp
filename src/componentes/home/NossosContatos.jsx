import ContatosRedes from './ContatosRedes.jsx'
import ContatosForm from './ContatosForm.jsx'

export default function NossosContatos() {
    return (
        <section className="nossos-contatos" id="nossos-contatos">
            <div className="container-nossos-contatos">
                <div className="container-nossos-contatos-content">
                    <div className="content-nossos-contantos-title">
                        <h2>Entre em contato</h2>
                    </div>
                    <section className="section-contatos">
                        <div>
                            <ContatosRedes/>
                            <ContatosForm/>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    )
}
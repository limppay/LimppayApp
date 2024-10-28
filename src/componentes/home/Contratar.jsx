import ContratacaoRapida from "../../assets/img/contratacao-rapida.png"
import ValoresDife from "../../assets/img/valores.png"
import ProfiQuali from "../../assets/img/profissionais-qualificados.png"

export default function Contratar() {
    return (
        <section className="flex flex-col justify-center lg:flex-row">
            <div className="flex flex-col text-prim p-5 pb-16 gap-5 lg:flex-row">
                <div className="flex flex-col justify-center items-center text-justify">
                    <img src={ContratacaoRapida} alt="contração rápida"/>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-desSec text-center font-semibold text-lg" >Contração Rápida</h3>
                        <p className="text-sm">A plataforma é simples e intuitiva. Em apenas alguns passos você solicita o serviço e efetua o pagamento. Além disso, você escolhe o profissional e a forma de pagamento que deseja.</p>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center text-justify p-2">
                    <img src={ValoresDife} alt="valores diferenciados"/>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-desSec text-center font-semibold text-lg">Valores diferenciados</h3>
                        <p className="text-sm">Com a LimpPay o custo-benefício é o melhor do mercado, inclusive nos pacotes de limpeza: tanto para clientes finais que contratam para limpar a casa, quanto para empresas.</p>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center text-justify p-2">
                    <img src={ProfiQuali} alt="profissionais qualificados"/>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-desSec text-center font-semibold text-lg">Profissionais qualificados</h3>
                        <p className="text-sm">Profissionais treinados para higienizar todos os ambientes com base em necessidades específicas e seguindo o padrão de qualidade LimpPay.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
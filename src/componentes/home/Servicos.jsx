import LimpezaResi from "../../assets/img/MG_9549.webp"
import RoupasPassadas from "../../assets/img/MG_9585.webp"
import LimpezaPres from "../../assets/img/MG_9567.webp"
import React from 'react';
import { Button } from "@nextui-org/react";

export default function Servicos() {
    return (
        <section id="servicos" className="lg:pt-12 pt-10 ">
            <div className="grid md:grid-cols-3 justify-items-center   text-prim gap-10">
                <div className="flex flex-col justify-center text-center items-center gap-3">
                    <img src={LimpezaResi} alt="slide" className="w-6/12"/>
                    <div>
                        <h3 className="text-desSec text-lg">Limpeza residencial</h3>
                        <p>Casas e apartamentos mais limpos e organizados</p>
                    </div>
                    <div className="pt-2">
                        <a href="/contrate-online">
                            <Button className="bg-des text-white">
                                Contrate online

                            </Button>
                        </a>
                    </div>
                </div>
                <div className="flex flex-col justify-center text-center items-center gap-3" >
                    <div className="flex flex-col items-center">
                        <img src={RoupasPassadas} alt="limpeza residencial" className="lg:w-10/12 w-7/12" />
                        <div >
                            <h3 className="text-desSec text-lg">Roupas passadas</h3>
                            <p>Serviço profissional disponível por diária.</p>
                        </div>
                    </div>
                    <div className="pt-2">
                        <a href="/contrate-online">
                            <Button className="bg-des text-white">
                                Contrate online

                            </Button>
                        </a>
                    </div>
                </div>
                <div className="flex flex-col justify-center text-center items-center gap-3" >
                    <div className="flex flex-col items-center">
                        <img src={LimpezaPres} alt="limpeza empresarial" className="w-6/12" />
                        <div >
                            <h3 className="text-desSec text-lg">Limpeza empresarial</h3>
                            <p>Ambientes profissionais, como consultórios e escritórios.</p>
                        </div>
                    </div>
                    <div className="pt-2">
                        <a href="/contrate-online">
                            <Button className="bg-des text-white">
                                Contrate online
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
import LimpezaResi from "../../assets/img/MG_9549.webp"
import RoupasPassadas from "../../assets/img/MG_9585.webp"
import LimpezaPres from "../../assets/img/MG_9567.webp"
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

export default function Servicos() {
    return (
        <section id="servicos" className="lg:pt-12  pt-10 pb-5">
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={0} // Remove o espaçamento entre as imagens
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                className="lg:h-[70vh] md:h-[60vh] h-[150vh]"
            >
                <SwiperSlide>
                    <div className="lg:flex-row flex flex-col justify-around lg:items-end items-center text-prim gap-10">
                        <div className="flex flex-col justify-center text-center items-center gap-3">
                            <img src={LimpezaResi} alt="slide" className="w-6/12"/>
                            <div>
                                <h3 className="text-desSec text-lg">Limpeza residencial</h3>
                                <p>Casas e apartamentos mais limpos e organizados</p>
                            </div>
                            <div className="pt-2">
                                <a href="https://app.limppay.com/" className="p-2 rounded-md w-2/4 max-w-full text-center bg-des text-white transition-all hover:bg-sec hover:bg-opacity-75">Contrate online</a>
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
                                <a href="https://app.limppay.com/" className="p-2 rounded-md w-2/4 max-w-full text-center bg-des text-white transition-all hover:bg-sec hover:bg-opacity-75">Contrate online</a>
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
                                <a href="https://app.limppay.com/" className="p-2 rounded-md w-2/4 max-w-full text-center bg-des text-white transition-all hover:bg-sec hover:bg-opacity-75">Contrate online</a>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </section>
    )
}
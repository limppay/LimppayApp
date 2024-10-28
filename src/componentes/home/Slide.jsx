import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import SlideStepOne from '../../assets/img/slide/1920x700-01.webp';
import SlideStepTwo from '../../assets/img/slide/1920x700-02.webp';

const Slide = () => {
  return (
        <div>
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
            >
                <SwiperSlide>
                    <img src={SlideStepOne} alt="slide" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={SlideStepTwo} alt="slide" />
                </SwiperSlide>
            </Swiper>

        </div>
    );
};

export default Slide;

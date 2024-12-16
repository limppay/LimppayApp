import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import SlideStepOne from '../../assets/img/slide/1920x700-01.webp';
import SlideStepTwo from '../../assets/img/slide/1920x700-02.webp';

const Slide = () => {
  return (
    <section>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
      >
        <SwiperSlide className="flex justify-center items-center">
          <img src={SlideStepOne} alt="slide" className="w-full h-auto object-contain" />
        </SwiperSlide>
        <SwiperSlide className="flex justify-center items-center">
          <img src={SlideStepTwo} alt="slide" className="w-full h-auto object-contain" />
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default Slide;

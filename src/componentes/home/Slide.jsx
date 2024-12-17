import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import SlideStepOne from '../../assets/img/slide/1920x700-01.webp';
import SlideStepTwo from '../../assets/img/slide/1920x700-02.webp';

const Slide = () => {
  return (
    <section className='2xl:pt-0 md:pt-[2vh]'>
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
          <a href="https://api.whatsapp.com/send?phone=5592992648251&text=Ol%C3%A1,%20vim%20pelo%20seu%20site%20e%20gostaria%20de%20saber%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20servi%C3%A7o!%20%E2%9C%85" className='cursor-default'>
            <img src={SlideStepOne} alt="slide" className="w-full h-auto object-contain" />
          </a>
        </SwiperSlide>
        <SwiperSlide className="flex justify-center items-center">
          <a href="/contrate-online" className='cursor-default'>
            <img src={SlideStepTwo} alt="slide" className="w-full h-auto object-contain" />
          </a>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default Slide;

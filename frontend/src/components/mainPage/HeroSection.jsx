import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "../../styles/heroSection.css"; 
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import heroWelcome from "../../assets/hero_welcome.png";
import heroCollection from "../../assets/hero2.png";

const HeroSection = () => {
  return (
    <section className="relative w-full">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        pagination={{ clickable: true }}
        navigation={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-auto"
      >
        <SwiperSlide>
          <div
            className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] max-w-7xl mx-auto bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${heroWelcome})`,
              backgroundSize: "contain",
            }}
          />
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] max-w-7xl mx-auto bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${heroCollection})`,
              backgroundSize: "contain",
            }}
          />
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default HeroSection;

import React, { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Navigation,
  Pagination,
  EffectFade,
  Parallax,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/parallax";
import { motion, AnimatePresence } from "framer-motion";

import heroWelcome from "../../assets/hero_welcome.png";
import heroCollection from "../../assets/hero2.png";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const slides = [
    {
      image: heroWelcome,
      title: "Welcome to Chapter 0",
      subtitle: "Your Gateway to Literary Adventures",
      cta: "Start Your Journey",
    },
    {
      image: heroCollection,
      title: "Explore Our Collection",
      subtitle: "Discover Stories That Inspire",
      cta: "Browse Books",
    },
  ];

  const handleSlideChange = useCallback((swiper) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  return (
    <section
      className={`relative w-full transition-opacity duration-1000 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade, Parallax]}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} w-4 h-4 bg-white bg-opacity-50 rounded-full transition-all duration-300 hover:bg-opacity-100 hover:scale-125"></span>`;
          },
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        effect="fade"
        parallax={true}
        speed={1000}
        className="w-full h-auto"
        onSlideChange={handleSlideChange}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] max-w-full mx-auto overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-center bg-no-repeat bg-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: activeIndex === index ? 1 : 1.1 }}
                transition={{ duration: 10, ease: "linear" }}
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4 z-10">
                <AnimatePresence mode="wait">
                  {activeIndex === index && (
                    <motion.div
                      key={`content-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-center"
                    >
                      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-xl sm:text-2xl md:text-3xl mb-10 max-w-3xl mx-auto">
                        {slide.subtitle}
                      </p>
                      <button className="bg-white text-black py-3 px-8 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                        {slide.cta}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-button-prev !text-white !opacity-70 hover:!opacity-100 transition-opacity duration-300 !w-12 !h-12 !bg-black/30 rounded-full backdrop-blur-sm" />
      <div className="swiper-button-next !text-white !opacity-70 hover:!opacity-100 transition-opacity duration-300 !w-12 !h-12 !bg-black/30 rounded-full backdrop-blur-sm" />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <motion.div
            key={index}
            className={`w-12 h-1 rounded-full ${
              activeIndex === index ? "bg-white" : "bg-white/50"
            }`}
            initial={{ width: activeIndex === index ? 48 : 20 }}
            animate={{ width: activeIndex === index ? 48 : 20 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;

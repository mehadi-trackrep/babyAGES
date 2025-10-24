'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
  {
    image: '/images/hero-slider/slide1.jpg',
    title: 'Discover Our New Collection',
    description: 'Shop the latest trends in baby fashion.',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
  },
  {
    image: '/images/hero-slider/slide2.jpg',
    title: 'Safe & Fun Toys for Your Little One',
    description: 'Explore our wide range of educational and fun toys.',
    buttonText: 'Discover Toys',
    buttonLink: '/shop',
  },
  {
    image: '/images/hero-slider/slide3.jpg',
    title: 'Nourish Your Baby with Organic Products',
    description: 'Healthy and delicious options for your baby.',
    buttonText: 'Explore Foods',
    buttonLink: '/shop',
  },
];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="relative w-full h-screen">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
          <Image
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold">{slide.title}</h1>
              <p className="mt-4 text-lg md:text-2xl">{slide.description}</p>
              <Link href={slide.buttonLink} className="mt-8 inline-block bg-blue-500 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors">
                {slide.buttonText}
              </Link>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-gray-400'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;

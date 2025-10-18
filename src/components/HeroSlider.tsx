'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Helper function to convert Google Drive sharing URL to a direct image URL
const getGoogleDriveImageUrl = (url: string): string => {
  if (!url.includes('drive.google.com')) return url;
  
  // Different Google Drive URL patterns that we might encounter
  let fileId = '';
  
  // Pattern for /file/d/ URLs
  const filePattern = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const fileMatch = url.match(filePattern);
  if (fileMatch && fileMatch[1]) {
    fileId = fileMatch[1];
  } else {
    // Alternative pattern for other Google Drive formats
    const idPattern = /id=([a-zA-Z0-9_-]+)/;
    const idMatch = url.match(idPattern);
    if (idMatch && idMatch[1]) {
      fileId = idMatch[1];
    }
  }
  
  if (fileId) {
    // Use the direct image URL that works with publicly shared files
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  return url;
};

const HeroSlider = () => {
  const slides = [
    {
      id: 1,
      title: "Winter Collection",
      subtitle: "Up to 50% off on winter essentials",
      image: "https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH",
      cta: "Shop Now",
      link: "/shop"
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Discover our latest products",
      image: "https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH",
      cta: "Explore",
      link: "/shop"
    },
    {
      id: 3,
      title: "Exclusive Deals",
      subtitle: "Limited time offers you can't miss",
      image: "https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH",
      cta: "View Deals",
      link: "/shop"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="w-full h-full relative">
              <Image
                src={getGoogleDriveImageUrl(slide.image)}
                alt={slide.title}
                fill
                className="object-cover"
                onError={() => {
                  // Fallback to a local placeholder if the image fails to load
                  // Since Next.js Image doesn't allow changing src directly,
                  // you'd need to implement state to switch the image source
                  console.error(`Failed to load image: ${slide.image}`);
                }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
                priority={index === 0} // Prioritize loading the first slide
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                  <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>
                  <Link 
                    href={slide.link}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 inline-block text-center"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-800 rounded-full p-3 z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-800 rounded-full p-3 z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
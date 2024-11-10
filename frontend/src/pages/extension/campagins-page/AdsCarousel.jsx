import React, { useState, useEffect } from 'react';

// Example images with links
const slides = [
  { image: 'https://via.placeholder.com/1200x600', link: 'https://example.com/page1' },
  { image: 'https://via.placeholder.com/1200x600', link: 'https://example.com/page2' },
  { image: 'https://via.placeholder.com/1200x600', link: 'https://example.com/page3' },
];

const AdsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Move to the next slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Handle click to move to a specific slide
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '350px' }}>
      {/* Carousel Slides */}
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <a
            key={index}
            href={slide.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-full"
            style={{ height: '350px' }}
          >
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </a>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === index ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AdsCarousel;

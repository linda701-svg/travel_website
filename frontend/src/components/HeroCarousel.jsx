import Carousel from 'react-bootstrap/Carousel';
import "../Style/style.css";

import heroImg1 from '../Assets/hero.jpg';
import heroImg2 from '../Assets/hero1.jpg';
import heroImg3 from '../Assets/hero2.jpg';

const slides = [
  {
    id: 1,
    image: heroImg1,
    subtitle: 'Opera House in',
    title1: 'MODERN',
    title2: 'SYDNEY',
    days: '5 DAYS',
    price: '$950'
  },
  {
    id: 2,
    image: heroImg2,
    subtitle: 'Explore',
    title1: 'BEAUTIFUL',
    title2: 'SYDNEY',
    days: '7 DAYS',
    price: '$1200'
  },
  {
    id: 3,
    image: heroImg3,
    subtitle: 'Discover',
    title1: 'AMAZING',
    title2: 'SYDNEY',
    days: '10 DAYS',
    price: '$1800'
  }
];

const HeroCarousel = () => {
  return (
    <section className="hero-carousel">
      <Carousel controls={true} indicators={false} fade interval={5000} touch={false} pause={false}>

        {slides.map((slide) => (
          <Carousel.Item key={slide.id}>
            <img
              className="d-block w-100 hero-img"
              src={slide.image}
              alt="Sydney"
            />

            {/* Overlay */}
            <div className="hero-overlay"></div>

            {/* Content */}
            <div className="hero-content container">
              <div className="row align-items-center">

                {/* Left text */}
                <div className="col-lg-7">
                  <span className="hero-subtitle">{slide.subtitle}</span>
                  <h1 className="hero-title">
                    {slide.title1} <br /> {slide.title2}
                  </h1>
                </div>                

              </div>
            
              <div className="col-lg-8 d-none d-lg-flex justify-content-lg-end">
                  <div className="hero-card">
                    <div className="card-top">
                      <span className="location">📍 AUSTRALIA</span>
                    </div>

                    <div className="card-middle">
                      <span className="days">☀ {slide.days}</span>
                    </div>

                    <div className="card-bottom">
                      <span className="price">{slide.price}</span>
                      <button className="arrow-btn">→</button>
                    </div>
                  </div>
                </div>
            </div>
          </Carousel.Item>
        ))}

      </Carousel>
    </section>
  );
};

export default HeroCarousel;

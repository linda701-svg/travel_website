import React from 'react';
import "../Style/style.css";
import "../Style/Home.css";
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import HeroCarousel from '../components/HeroCarousel';

const Home = () => {

  const offers = [
    {
      id: 1,
      title: "Fabulous Dubai",
      img: "https://tourpress.b-cdn.net/wp-content/uploads/2017/11/dubai-featured-526x406.jpg",
      oldPrice: "$1,950",
      newPrice: "$1,450",
      days: 7,
      desc: "Dubai is situated on the Persian Gulf coast..."
    },
    {
      id: 2,
      title: "Paris Getaway",
      img: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg",
      oldPrice: "$2,200",
      newPrice: "$1,800",
      days: 5,
      desc: "Explore the city of love..."
    },
    {
      id: 3,
      title: "Maldives Trip",
      img: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg",
      oldPrice: "$3,000",
      newPrice: "$2,500",
      days: 6,
      desc: "Enjoy crystal clear beaches..."
    },
    {
      id: 4,
      title: "Thailand Tour",
      img: "https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg",
      oldPrice: "$1,800",
      newPrice: "$1,300",
      days: 6,
      desc: "Experience Thai culture..."
    },
    {
      id: 5,
      title: "Switzerland",
      img: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg",
      oldPrice: "$2,500",
      newPrice: "$2,000",
      days: 8,
      desc: "Snowy mountains and beauty..."
    },
    {
      id: 6,
      title: "Bali Escape",
      img: "https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg",
      oldPrice: "$2,000",
      newPrice: "$1,600",
      days: 5,
      desc: "Relax and enjoy nature..."
    }
  ];

  const moodDestinations = [
    { id: 1, image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/11/quino-al-404693-330x404.jpg", icon: "https://tourpress.b-cdn.net/wp-content/uploads/2017/11/adventure.png", title: "Adventure" },
    { id: 2, image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/cappadocia-08-330x404.jpg", icon: "https://tourpress.b-cdn.net/wp-content/uploads/2017/11/air-rides.png", title: "Air Rides" },
    { id: 3, image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/11/maldives-01-330x404.jpg", icon: "https://tourpress.b-cdn.net/wp-content/uploads/2017/11/beaches.png", title: "Beaches" },
    { id: 4, image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/11/sydney-1-330x404.jpg", icon: "https://tourpress.b-cdn.net/wp-content/uploads/2017/11/cruises.png", title: "Cruises" },
    { id: 5, image: "https://tourpress.b-cdn.net/wp-content/uploads/2018/07/tracking-bg-real-330x404.jpg", icon: "https://tourpress.b-cdn.net/wp-content/uploads/2017/11/trucking.png", title: "Tracking" },
    { id: 6, image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/11/sydney-04-330x404.jpg", icon: "https://tourpress.b-cdn.net/wp-content/uploads/2017/11/wildlife.png", title: "Wildlife" }
  ];

  const blogPosts = [
    { id: 1, title: "Try Living A Simple Life", desc: "Many people want a simple life away from all the...", img: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/patrick-hendry-720x560.jpg" },
    { id: 2, title: "Start Writing A Journal", desc: "Running improves your cardiovascular strength...", img: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/cathryn-lavery-67851-720x560.jpg" },
    { id: 3, title: "Make Running A Part of Life", desc: "The world is full of beautiful places to visit...", img: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/jenny-hill-720x560.jpg" }
  ];

  const testimonials = [
    { id: 1, name: "Jason Santa", role: "Web Developer", image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/testi-1-100x100.png", text: "We love California Adventure, but it would have been nice if they had longer hours when we were there. Loved all of the Christmas food, Santa visit and the rides as always." },
    { id: 2, name: "Marcus Webster", role: "Software Engineer", image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/test-2.png", text: "Catalina Island was a perfect day trip. Zip lining with two fun guides was definitely the highlight! Eating at a seaside restaurant was so relaxing afterward." }
  ];

  const destinations = [
    { id: 1, title: "AUSTRALIA", temp: "15° / 45°", image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/11/sydney-1-720x560.jpg" },
    { id: 2, title: "BRAZIL", temp: "7° / 38°", image: "https://tourpress.b-cdn.net/wp-content/uploads/2019/08/destination-rio-720x560.jpg" },
    { id: 3, title: "ITALY", temp: "8° / 40°", image: "https://tourpress.b-cdn.net/wp-content/uploads/2018/07/destination-italy-720x560.jpg" },
    { id: 4, title: "MALDIVES", temp: "15° / 48°", image: "https://tourpress.b-cdn.net/wp-content/uploads/2018/07/destination-maldives-720x560.jpg" },
    { id: 5, title: "SINGAPORE", temp: "8° / 30°", image: "https://tourpress.b-cdn.net/wp-content/uploads/2019/08/destination-singapore-720x560.jpg" },
    { id: 6, title: "TURKEY", temp: "13° / 38°", image: "https://tourpress.b-cdn.net/wp-content/uploads/2018/07/destinaion-turkey-720x560.jpg" },
    { id: 7, title: "UNITED ARAB EMIRATES", temp: "25° / 50°", image: "https://tourpress.b-cdn.net/wp-content/uploads/2018/07/destination-uae-720x560.jpg" },
    { id: 8, title: "UNITED KINGDOM", temp: "8° / 30°", image: "https://tourpress.b-cdn.net/wp-content/uploads/2018/07/destination-uk-720x560.jpg" }
  ];

  const features = [
    { icon: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/feature-1.png", title: "Unique Destinations", description: "Looking for a unique vacation destination? Then maybe a trip to one of the 10 most unique tourist destinations might." },
    { icon: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/feature-2.png", title: "Worth of Money", description: "There is not a better way to spend money, than spending money on travel. This is what we say, others and science." },
    { icon: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/feature-4.png", title: "Quick Booking", description: "Booking is quick as clicking a few clicks. We take care of all transportation and accommodations during your journey." },
    { icon: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/feature-5.png", title: "Backup Team", description: "We have staff to assist in all stages of your holiday, from travel advice & best prices to ground handling during your holiday." },
    { icon: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/feature-6.png", title: "Exciting Travel", description: "We have a wide range of expertise in our services. So we can provide you an exciting travel experience." },
    { icon: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/feature-3.png", title: "Wonderful Places", description: "We do our best to have you a wonderful experience by taking you to the wonderful and amazing places around the world." }
  ];

  const packages = [
    { id: 1, title: "Fabulous Dubai", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80", days: 7, rating: 5, oldPrice: 1950, price: 1450, discount: "25%", description: "Dubai is situated on the Persian Gulf coast of the United Arab Emirates and is..." },
    { id: 2, title: "Modern Sydney", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=400&q=80", days: 5, rating: 4, price: 950, description: "Sydney, capital of New South Wales and one of Australia's largest cities, is best known..." },
    { id: 3, title: "Magical Maldives", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=400&q=80", days: 6, rating: 5, price: 900, description: "The Maldives is a tropical nation in the Indian Ocean composed of 26 ring-shaped atolls,..." },
    { id: 4, title: "Modern Sydney", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=400&q=80", days: 5, rating: 4, price: 950, description: "Sydney, capital of New South Wales and one of Australia's largest cities, is best known..." },
    { id: 5, title: "Fabulous Dubai", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80", days: 7, rating: 5, oldPrice: 1950, price: 1450, discount: "25%", description: "Dubai is situated on the Persian Gulf coast of the United Arab Emirates and is..." }
  ];

  return (
    <div>
      <HeroCarousel />

      {/* Why Choose TourPress */}
      <section className="py-5" style={{ backgroundColor: '#f7f9fc' }}>
        <div className="container">
          <div className="home-section-heading mt-3">
            <h2>Why Choose TourPress</h2>
            <p>We offer most competitive rates and offers for wonderful and beautiful places.</p>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-4">
                <div className="home-feature-card">
                  <div className="home-feature-icon-wrap">
                    <img src={feature.icon} alt={feature.title} />
                  </div>
                  <h5 className="home-feature-title">{feature.title}</h5>
                  <p className="home-feature-desc">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="home-section-heading">
            <h2>Featured Packages</h2>
            <p>Our Featured Packages allow you to get away from routine, spend time with family and friends.</p>
          </div>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={28}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            className="pb-5"
          >
            {packages.map((pkg) => (
              <SwiperSlide key={pkg.id}>
                <div className="home-pkg-card">
                  <div className="home-pkg-img-wrap">
                    <img src={pkg.image} alt={pkg.title} />
                    <div className="home-days-badge">
                      <i className="fa fa-sun-o text-warning"></i> {pkg.days} Days
                    </div>
                    {pkg.discount && <div className="home-discount-badge">{pkg.discount} OFF</div>}
                  </div>
                  <div className="home-pkg-body">
                    <a href="#" className="home-pkg-title">{pkg.title}</a>
                    <div className="mb-2">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fa fa-star${i < pkg.rating ? ' text-warning' : ' text-muted'}`}></i>
                      ))}
                    </div>
                    <p className="home-pkg-desc">{pkg.description}</p>
                    <div className="home-pkg-footer">
                      <div>
                        {pkg.oldPrice && <span className="home-price-old">${pkg.oldPrice}</span>}
                        <span className="home-price-new">${pkg.price}</span>
                      </div>
                      <a href="#" className="home-view-btn">View More</a>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Travel Destinations */}
      <section className="py-5" style={{ backgroundColor: '#f7f9fc' }}>
        <div className="container-fluid px-3 px-md-4">
          <div className="home-section-heading">
            <h2>Travel Destinations</h2>
            <p>Check out the list of countries and places you can travel to by joining us.</p>
          </div>
          <div className="home-dest-grid">
            {destinations.map((item) => (
              <div className="home-dest-card" key={item.id}>
                <img src={item.image} alt={item.title} />
                <div className="home-dest-overlay">
                  <div className="home-dest-temp">{item.temp}</div>
                  <h3 className="home-dest-title">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="home-section-heading">
            <h2>Special Offers</h2>
            <p>From seasonal and holiday highlights to upcoming events and special offers.</p>
          </div>
          <div className="row g-4">
            {offers.map((offer) => (
              <div key={offer.id} className="col-12 col-lg-6">
                <div className="home-offer-card">
                  <div className="home-offer-img">
                    <img src={offer.img} alt={offer.title} />
                  </div>
                  <div className="home-offer-body">
                    <a href="#" className="home-offer-title">{offer.title}</a>
                    <div className="mb-3">
                      <span className="home-offer-price-old">{offer.oldPrice}</span>
                      <span className="home-offer-price-new">{offer.newPrice}</span>
                    </div>
                    <p className="home-offer-desc">{offer.desc}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="home-days-pill">
                        <i className="fa fa-sun-o text-warning"></i> {offer.days} Days
                      </span>
                      <a href="#" className="home-view-btn">Learn More</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destination by Mood */}
      <section className="home-mood-section" style={{ backgroundImage: "url(https://tourpress.b-cdn.net/wp-content/uploads/2020/04/mood-destination.jpg)" }}>
        <div className="container">
          <div className="home-section-heading">
            <h2>Select your Destination by Mood</h2>
            <p>In the mood to travel? You have to be more specific! Match your mood to your destination!</p>
          </div>
          <div className="row justify-content-center g-3 home-mood-row">
            {moodDestinations.map((item) => (
              <div key={item.id} className="col-6 col-md-4 col-lg-2 text-center">
                <div className="home-mood-item">
                  <img src={item.image} alt={item.title} className="mood-bg" />
                  <div className="home-mood-overlay">
                    <img src={item.icon} alt={item.title} />
                    <span>{item.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent from Blog */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="home-section-heading">
            <h2>Recent from Blog</h2>
            <p>Find out our latest news, promotions and professional tips.</p>
          </div>
          <div className="row g-4">
            {blogPosts.map((post) => (
              <div className="col-12 col-md-4" key={post.id}>
                <div className="home-blog-card">
                  <img src={post.img} alt={post.title} className="home-blog-img" />
                  <div className="home-blog-body">
                    <a href="#" className="home-blog-title">{post.title}</a>
                    <p className="home-blog-desc">{post.desc}</p>
                    <a href="#" className="home-read-more">Read More <i className="fa fa-arrow-right ms-1"></i></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5" style={{ backgroundColor: '#f7f9fc' }}>
        <div className="container">
          <div className="home-section-heading">
            <h2>Kind words from our Customers</h2>
            <p>Read reviews and opinions from our global travel community!</p>
          </div>
          <div className="row justify-content-center g-4">
            {testimonials.map((item) => (
              <div className="col-12 col-md-6" key={item.id}>
                <div className="home-testi-card">
                  <img src={item.image} alt={item.name} className="home-testi-img" />
                  <p className="home-testi-text">"{item.text}"</p>
                  <h4 className="home-testi-name">{item.name}</h4>
                  <span className="home-testi-role">{item.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore CTA */}
      <section className="home-cta-section" style={{
        backgroundImage: "url(https://tourpress.b-cdn.net/wp-content/uploads/2020/04/explore-bg.jpg)"
      }}>
        <div className="home-cta-overlay"></div>
        <div className="container">
          <div className="row justify-content-end">
            <div className="col-12 col-md-7 col-lg-6">
              <div className="home-cta-inner">
                <h2>Choose Your Adventure at one place with Ease</h2>
                <p>TourPress offers hundreds of tours and activities for travelers around the globe. Choose from sightseeing tours to spa escapes to interactive cultural programs and so much more.</p>
                <a href="/tours/" className="home-cta-btn">Explore Tours</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

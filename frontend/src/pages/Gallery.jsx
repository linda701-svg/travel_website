import React, { useState } from 'react';
import '../Style/style.css';
import '../Style/Gallery.css'; // Modern styles

const Gallery = () => {
  const allItems = [
    {
      id: 1,
      category: 'united-arab-emirates',
      imageUrl: 'https://tourpress.b-cdn.net/wp-content/uploads/2017/11/dubai-featured-720x560.jpg',
      title: 'Fabulous Dubai',
      link: 'https://tourpress.inspirythemes.com/blog/tour/fabulous-dubai/',
    },
    {
      id: 2,
      category: 'united-kingdom',
      imageUrl: 'https://tourpress.b-cdn.net/wp-content/uploads/2017/11/london-featured-720x560.jpg',
      title: 'Luxurious London',
      link: 'https://tourpress.inspirythemes.com/blog/tour/luxurious-london/',
    },
    {
      id: 3,
      category: 'australia',
      imageUrl: 'https://tourpress.b-cdn.net/wp-content/uploads/2017/11/sydney-featured-720x560.jpg',
      title: 'Modern Sydney',
      link: 'https://tourpress.inspirythemes.com/blog/tour/modern-sydney/',
    },
    {
      id: 4,
      category: 'brazil',
      imageUrl: 'https://tourpress.b-cdn.net/wp-content/uploads/2017/11/rio-featured-720x560.jpg',
      title: 'Rio De Janeiro',
      link: 'https://tourpress.inspirythemes.com/blog/tour/rio-de-janeiro/',
    },
    {
      id: 5,
      category: 'maldives',
      imageUrl: 'https://tourpress.b-cdn.net/wp-content/uploads/2017/11/maldives-featured-720x560.jpg',
      title: 'Magical Maldives',
      link: 'https://tourpress.inspirythemes.com/blog/tour/magical-maldives/',
    },
    {
      id: 6,
      category: 'turkey',
      imageUrl: 'https://tourpress.b-cdn.net/wp-content/uploads/2017/11/istanbul-featured-720x560.jpg',
      title: 'Historic Istanbul',
      link: 'https://tourpress.inspirythemes.com/blog/tour/historic-istanbul/',
    },
    {
      id: 7,
      category: 'singapore',
      imageUrl: 'https://tourpress.b-cdn.net/wp-content/uploads/2017/11/singapore-featured-720x560.jpg',
      title: 'Multicultural Singapore',
      link: 'https://tourpress.inspirythemes.com/blog/tour/multicultural-singapore/',
    },
    {
      id: 8,
      category: 'italy',
      imageUrl: 'https://tourpress.b-cdn.net/wp-content/uploads/2017/11/venice-featured-720x560.jpg',
      title: 'Venice The City of Water',
      link: 'https://tourpress.inspirythemes.com/blog/tour/venice-the-city-of-water/',
    },
    {
      id: 9,
      category: 'turkey',
      imageUrl: 'https://tourpress.b-cdn.net/wp-content/uploads/2017/10/cappadocia-featured-720x560.jpg',
      title: 'Mysterious Goreme',
      link: 'https://tourpress.inspirythemes.com/blog/tour/mysterious-goreme/',
    },
  ];

  const [filter, setFilter] = useState('*');

  const filteredItems = filter === '*' ? allItems : allItems.filter(item => item.category === filter);

  const filters = [
    { label: 'All', value: '*' },
    { label: 'Australia', value: 'australia' },
    { label: 'Brazil', value: 'brazil' },
    { label: 'Italy', value: 'italy' },
    { label: 'Maldives', value: 'maldives' },
    { label: 'Singapore', value: 'singapore' },
    { label: 'Turkey', value: 'turkey' },
  ];

  return (
    <div>
      <div id="site-banner" style={{ backgroundImage: "url(https://tourpress.b-cdn.net/wp-content/uploads/2020/04/optimised-banner.jpg)" }}>
        <div className="banner-content">
          <h1>Tours Gallery</h1>
        </div>
      </div>

      <div className="modern-gallery-wrapper">
        <div className="container">
          
          <div className="gallery-heading">
            <h2>Travel Destinations</h2>
            <p>Check out the list of beautiful countries and places you can travel to by joining us.</p>
          </div>

          <div className="modern-filter-nav">
            {filters.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`modern-filter-btn ${filter === f.value ? 'active' : ''}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="row g-4">
            {filteredItems.map(item => (
              <div className="col-12 col-md-6 col-lg-4" key={item.id}>
                <div className="modern-gallery-card">
                  <img src={item.imageUrl} alt={item.title} className="modern-gallery-img" />
                  <div className="modern-gallery-overlay">
                    <a href={item.link} className="modern-gallery-title">
                      {item.title} <i className="fa fa-arrow-right ms-2 fs-6"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredItems.length === 0 && (
               <div className="col-12 text-center py-5">
                 <h4 className="text-muted">No destinations found for this filters.</h4>
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Gallery;

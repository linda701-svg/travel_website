import React, { useState } from 'react';
import '../Style/style.css';
import '../Style/FAQs.css';

const FAQs = () => {
  const allFaqs = [
    {
      id: 1,
      question: "Do your tours include international airfare?",
      answer: "Travelers arrive from all over the world to begin our tours and it is not possible to include international airfare in our prices. We would be happy to help you arrange flights. Just ask for an air quote when making your booking.",
      categories: ["on-your-trip", "payment-information", "reservation"],
    },
    {
      id: 2,
      question: "What vaccinations are recommended for this adventure?",
      answer: "It’s important that you receive the most accurate and up-to-date travel health information for the region you will be visiting. The only one qualified to provide you with this advice is your family physician or a specialist from a Travel Health clinic.",
      categories: ["on-your-trip", "reservation", "weather"],
    },
    {
      id: 3,
      question: "Can you help arrange my travel visas?",
      answer: "Requirements for travel visas vary widely depending on your nationality and your destination. Although we are unable to arrange visas on your behalf. If you do require a visa you can arrange them yourself or use the services of a travel agent or visa processing company.",
      categories: ["on-your-trip", "reservation"],
    },
    {
      id: 4,
      question: "What clothing should I pack for one of your adventures?",
      answer: "We always recommend packing as light as possible however the specific requirements for your tour will vary widely depending on where and when you are traveling. Our ‘Trip Details’ document includes a suggested packing list and these can be downloaded from each individual trip summary page. The checklist is tour specific and based upon the experience of our ground staff.",
      categories: ["on-your-trip", "reservation", "weather"],
    },
    {
      id: 5,
      question: "What is the most appropriate type of luggage to bring?",
      answer: "We strongly recommend bringing a backpack or duffel bag, as suitcases can be cumbersome and difficult to store in buses, under seats, etc.. Keep in mind that you will normally have to carry your own luggage on and off buses and trains and up and down hotel staircases. Suitcases with wheels may not work well on dirt or cobblestone roads.",
      categories: ["on-your-trip", "reservation", "weather"],
    },
    {
        id: 6,
        question: "What type of ground transportation is used on your tours?",
        answer: "Trip specific information on transportation can be found on the trip summary page however in most cases we use public transportation. We’ve found that how you get there significantly influences the tone of your journey and public transportation allows face-to-face interaction with the local people. Some of our adventures, including our “Superior”, “Comfort Class” and most adventures in Africa, use private transportation.",
        categories: ["on-your-trip", "payment-information", "reservation"]
    },
    {
        id: 7,
        question: "How many people can join a tour?",
        answer: "We keep our group sizes low so you have the freedom to move around and get involved with your surroundings, as well as more personal attention from our local guides. This intimate size ensures that your group will not crowd your experience. You can expect up to 15 travelers on a trip but the average is 10. Check individual trip pages for maximum group sizes.",
        categories: ["on-your-trip"]
    },
    {
        id: 8,
        question: "Can I book extra nights of hotel accommodation before or after my tour?",
        answer: "Yes, in most cases we can arrange additional accommodation at our starting or ending hotels, excluding European tours. If we are unable to provide you with the extra nights we will give you the name of a hotel you can contact directly. Please also note that extra accommodations must be booked outside of 30 days of departure.",
        categories: ["payment-information", "reservation"]
    }
  ];

  const [openFaq, setOpenFaq] = useState(allFaqs[0].id);
  const [filter, setFilter] = useState('*');

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const filteredFaqs = filter === '*' ? allFaqs : allFaqs.filter(faq => faq.categories.includes(filter));

  const filters = [
    { name: "All", slug: "*" },
    { name: "On Your Trip", slug: "on-your-trip" },
    { name: "Payment Information", slug: "payment-information" },
    { name: "Reservation", slug: "reservation" },
    { name: "Weather", slug: "weather" },
  ];

  return (
    <>
      <div id="site-banner" style={{ backgroundImage: "url(https://tourpress.b-cdn.net/wp-content/uploads/2020/04/optimised-banner.jpg)" }}>
        <div className="banner-content">
          <h1>FAQs </h1>
          <ul id="inspiry_breadcrumbs" className="inspiry_breadcrumbs">
            <li className="breadcrumb-item"><a href="/" title="Home">Home</a></li>
            <li>&gt;</li>
            <li className="breadcrumb-item active item-current item-93"><span className="bread-current bread-93"> FAQs</span></li>
          </ul>
        </div>
      </div>

      <div className="modern-faq-wrapper">
        <div className="container">
          <div className="faq-header">
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to our most common questions below. Click on a question to expand the answer, or use the filters to narrow down by category.</p>
          </div>

          <ul className="faq-filters">
            {filters.map(f => (
              <li key={f.slug}>
                <button 
                  className={`faq-filter-btn ${filter === f.slug ? 'active' : ''}`}
                  onClick={() => setFilter(f.slug)}
                >
                  {f.name}
                </button>
              </li>
            ))}
          </ul>

          <div className="faq-list">
            {filteredFaqs.map(faq => {
              const isOpen = openFaq === faq.id;
              return (
                <div key={faq.id} className={`faq-card ${isOpen ? 'open' : ''}`}>
                  <button className="faq-question" onClick={() => toggleFaq(faq.id)}>
                    <h4>{faq.question}</h4>
                    <div className="faq-icon">
                      <i className={`fa fa-chevron-down`}></i>
                    </div>
                  </button>
                  <div className={`faq-answer-wrapper ${isOpen ? 'open' : ''}`}>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQs;

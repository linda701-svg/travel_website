import React from 'react';
import '../Style/style.css';
import '../Style/News.css';

const News = () => {
  const posts = [
    {
      id: 1,
      title: "Try Living A Simple Life",
      image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/patrick-hendry-720x560.jpg",
      date: "December 11, 2017",
      category: "Improve Life",
      author: "John Doe",
      excerpt: "Many people want a simple life away from all the...",
    },
    {
      id: 2,
      title: "Start Writing A Journal",
      image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/cathryn-lavery-67851-720x560.jpg",
      date: "December 10, 2017",
      category: "Improve Life",
      author: "John Doe",
      excerpt: "An ideal time to write, comfortable digs, a great...",
    },
    {
      id: 3,
      title: "Make Running A Part of Life",
      image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/jenny-hill-720x560.jpg",
      date: "December 9, 2017",
      category: "Improve Life",
      author: "John Doe",
      excerpt: "Running improves your cardiovascular strength, lowers bad cholesterol and...",
    },
    {
      id: 4,
      title: "Improve Your Productivity",
      image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/mia-baker-720x560.jpg",
      date: "October 28, 2017",
      category: "Improve Life",
      author: "John Doe",
      excerpt: "Every self-help program talks about the importance of taking...",
    },
    {
      id: 5,
      title: "Modify Your WordPress Theme",
      image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/fabian-grohs-720x560.jpg",
      date: "October 28, 2017",
      category: "Technology",
      author: "John Doe",
      excerpt: "Want to know the secret of having a custom...",
    },
    {
      id: 6,
      title: "Overcoming Your Failure",
      image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/andrew-neel-720x560.jpg",
      date: "October 28, 2017",
      category: "Improve Life",
      author: "John Doe",
      excerpt: "Failure is the most important step to reaching success,...",
    },
  ];

  const recentPosts = [
    {
      id: 1,
      title: "Try Living A Simple Life",
      date: "December 11, 2017",
      image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/patrick-hendry-150x150.jpg"
    },
    {
      id: 2,
      title: "Start Writing A Journal",
      date: "December 10, 2017",
      image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/cathryn-lavery-67851-150x150.jpg"
    },
    {
      id: 3,
      title: "Make Running A Part of Life",
      date: "December 9, 2017",
      image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/10/jenny-hill-150x150.jpg"
    }
  ];

  const categories = [
    "Improve Life",
    "Life",
    "Productivity",
    "Self Discipline",
    "Sport",
    "Technology",
    "Tools"
  ];

  const topRatedTours = [
    {
      id: 1,
      title: "Historic Istanbul",
      image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/11/istanbul-featured-150x150.jpg",
      oldPrice: "$1,200",
      price: "$990",
      rating: 5,
    },
    {
      id: 2,
      title: "Magical Maldives",
      image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/11/maldives-featured-150x150.jpg",
      oldPrice: null,
      price: "$900",
      rating: 5,
    },
    {
      id: 3,
      title: "Venice The City of Water",
      image: "https://tourpress.b-cdn.net/wp-content/uploads/2017/11/venice-featured-150x150.jpg",
      oldPrice: null,
      price: "$850",
      rating: 5,
    }
  ];

  const tags = [
    "Productivity", "Relax", "Self Discipline", "Software", "Sport",
    "Time Management", "Tools", "View", "Web", "Work"
  ];

  const Rating = ({ count }) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<i key={i} className={`fa fa-star ${i < count ? 'text-warning' : 'text-muted'}`}></i>);
    }
    return <span>{stars}</span>;
  };

  return (
    <>
      <div id="site-banner" style={{ backgroundImage: "url(https://tourpress.b-cdn.net/wp-content/uploads/2020/04/optimised-banner.jpg)" }}>
        <div className="banner-content">
          <h1>News</h1>
          <ul id="inspiry_breadcrumbs" className="inspiry_breadcrumbs">
            <li className="breadcrumb-item"><a href="/" title="Home">Home</a></li>
            <li>&gt;</li>
            <li className="breadcrumb-item active">News</li>
          </ul>
        </div>
      </div>
      
      <div className="modern-news-wrapper">
        <div className="container">
          <div className="row">
            
            <div className="col-12 col-lg-8">
              <div className="row g-4">
                {posts.map(post => (
                  <div key={post.id} className="col-12 col-md-6">
                    <div className="post-card">
                      <a href="#">
                        <img src={post.image} className="post-image" alt={post.title} />
                      </a>
                      <div className="post-content">
                        <div className="post-meta">
                          <span><i className="fa fa-folder-open"></i> {post.category}</span>
                          <span><i className="fa fa-calendar"></i> {post.date}</span>
                        </div>
                        <a href="#" className="post-title">{post.title}</a>
                        <p className="post-excerpt">{post.excerpt}</p>
                        <div className="post-footer">
                          <div className="author-info">
                            <i className="fa fa-user-circle me-2"></i> {post.author}
                          </div>
                          <a href="#" className="read-more-btn">Read More</a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modern Pagination */}
              <div className="modern-pagination">
                <a href="#" className="page-item active">1</a>
                <a href="#" className="page-item">2</a>
                <a href="#" className="page-item wide">Next</a>
              </div>
            </div>

            <div className="col-12 col-lg-4 sidebar">
              <div className="widget">
                <h2 className="widget-title">Recent Posts</h2>
                <ul className="sidebar-list">
                  {recentPosts.map(post => (
                    <li key={post.id} className="widget-item">
                      <a href="#">
                        <img src={post.image} className="widget-item-img" alt={post.title} />
                      </a>
                      <div className="widget-item-content">
                        <div className="widget-item-title"><a href="#">{post.title}</a></div>
                        <div className="widget-item-meta"><i className="fa fa-calendar-o me-1"></i> {post.date}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="widget">
                <h2 className="widget-title">Categories</h2>
                <ul className="sidebar-list">
                  {categories.map(category => (
                    <li key={category}>
                      <a href="#"><i className="fa fa-angle-right me-2 text-info"></i> {category}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="widget">
                <h2 className="widget-title">Top Rated Tours</h2>
                <ul className="sidebar-list">
                  {topRatedTours.map(tour => (
                    <li key={tour.id} className="widget-item">
                      <a href="#">
                        <img src={tour.image} className="widget-item-img" alt={tour.title} />
                      </a>
                      <div className="widget-item-content">
                        <div className="widget-item-title"><a href="#">{tour.title}</a></div>
                        <div className="mb-1"><Rating count={tour.rating} /></div>
                        <div className="widget-item-meta">
                          {tour.oldPrice && <span className="text-decoration-line-through me-2 text-muted">{tour.oldPrice}</span>}
                          <strong className="text-info">{tour.price}</strong>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="widget">
                <h2 className="widget-title">Tags</h2>
                <div className="tag-cloud">
                  {tags.map(tag => <a key={tag} href="#" className="tag-link">{tag}</a>)}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default News;

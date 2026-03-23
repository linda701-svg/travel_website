import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../Style/style.css';
import '../Style/Shop.css';
import { useCart } from '../context/CartContext';

const Shop = () => {
  const { addToCart, cartItems, removeFromCart, getCartTotal } = useCart();

  const initialProducts = [
    { id: 602, name: "Album", imageUrl: "https://tourpress.b-cdn.net/wp-content/uploads/2018/07/album-1-300x300.jpg", price: 15.00, currencySymbol: "£", category: "Music", link: "/product/album/", onSale: false, popularity: 80, rating: 4, date: '2023-01-01' },
    { id: 594, name: "Beanie", imageUrl: "https://tourpress.b-cdn.net/wp-content/uploads/2018/07/beanie-2-300x300.jpg", price: 18.00, originalPrice: 20.00, currencySymbol: "£", category: "Accessories", link: "/product/beanie/", onSale: true, popularity: 95, rating: 5, date: '2023-01-05' },
    { id: 611, name: "Beanie with Logo", imageUrl: "https://tourpress.b-cdn.net/wp-content/uploads/2018/07/beanie-with-logo-1-300x300.jpg", price: 18.00, originalPrice: 20.00, currencySymbol: "£", category: "Accessories", link: "/product/beanie-with-logo/", onSale: true, popularity: 70, rating: 4.5, date: '2023-01-10' },
    { id: 595, name: "Belt", imageUrl: "https://tourpress.b-cdn.net/wp-content/uploads/2018/07/belt-2-300x300.jpg", price: 55.00, originalPrice: 65.00, currencySymbol: "£", category: "Accessories", link: "/product/belt/", onSale: true, popularity: 60, rating: 4, date: '2023-01-15' },
    { id: 596, name: "Cap", imageUrl: "https://tourpress.b-cdn.net/wp-content/uploads/2018/07/cap-2-300x300.jpg", price: 16.00, originalPrice: 18.00, currencySymbol: "£", category: "Accessories", link: "/product/cap/", onSale: true, popularity: 85, rating: 4.2, date: '2023-01-20' },
    { id: 591, name: "Hoodie", imageUrl: "https://tourpress.b-cdn.net/wp-content/uploads/2018/07/hoodie-2-300x300.jpg", price: 42.00, originalPrice: 45.00, currencySymbol: "£", category: "Hoodies", link: "/product/hoodie/", onSale: true, popularity: 90, rating: 4.8, date: '2023-01-25' },
    { id: 592, name: "Hoodie with Logo", imageUrl: "https://tourpress.b-cdn.net/wp-content/uploads/2018/07/hoodie-with-logo-2-300x300.jpg", price: 45.00, currencySymbol: "£", category: "Hoodies", link: "/product/hoodie-with-logo/", onSale: false, popularity: 75, rating: 4.4, date: '2023-01-30' },
    { id: 599, name: "Hoodie with Zipper", imageUrl: "https://tourpress.b-cdn.net/wp-content/uploads/2018/07/hoodie-with-zipper-2-300x300.jpg", price: 45.00, currencySymbol: "£", category: "Hoodies", link: "/product/hoodie-with-zipper/", onSale: false, popularity: 65, rating: 4.3, date: '2023-02-01' },
    { id: 612, name: "Logo Collection", imageUrl: "https://tourpress.b-cdn.net/wp-content/uploads/2018/07/logo-1-300x300.jpg", price: 18.00, currencySymbol: "£", category: "Clothing", link: "/product/logo-collection/", onSale: true, popularity: 55, rating: 4.1, date: '2023-02-05' }
  ];

  const topRatedProducts = [
    { name: "Polo", price: 20.00, imageUrl: "https://tourpress.b-cdn.net/wp-content/uploads/2018/07/polo-2-300x300.jpg" },
    { name: "Single", price: 2.00, originalPrice: 3.00, imageUrl: "https://tourpress.b-cdn.net/wp-content/uploads/2018/07/single-1-300x300.jpg", onSale: true },
    { name: "Album", price: 15.00, imageUrl: "https://tourpress.b-cdn.net/wp-content/uploads/2018/07/album-1-300x300.jpg" },
    { name: "T-Shirt with Logo", price: 18.00, imageUrl: "https://tourpress.b-cdn.net/wp-content/uploads/2018/07/t-shirt-with-logo-1-300x300.jpg" }
  ];

  const [orderBy, setOrderBy] = useState('menu_order');
  const [minPrice, setMinPrice] = useState(10);
  const [maxPrice, setMaxPrice] = useState(60);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    let result = initialProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory || (selectedCategory === 'Clothing' && ['Accessories', 'Hoodies', 'Tshirts'].includes(p.category)));
    }
    switch (orderBy) {
      case 'popularity': result.sort((a, b) => b.popularity - a.popularity); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'date': result.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
      case 'price': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      default: break;
    }
    return result;
  }, [orderBy, minPrice, maxPrice, selectedCategory]);

  const categories = [
    { label: 'All', value: 'All' },
    { label: 'Clothing', value: 'Clothing', children: ['Accessories', 'Hoodies', 'Tshirts'] },
    { label: 'Decor', value: 'Decor' },
    { label: 'Music', value: 'Music' },
    { label: 'Uncategorized', value: 'Uncategorized' },
  ];

  return (
    <div>
      {/* Banner */}
      <div id="site-banner" style={{ backgroundImage: `url(https://tourpress.b-cdn.net/wp-content/uploads/2020/04/optimised-banner.jpg)` }}>
        <div className="banner-content">
          <h1>Shop</h1>
          <ul id="inspiry_breadcrumbs" className="inspiry_breadcrumbs">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li>&gt;</li>
            <li className="breadcrumb-item active"><span>Shop</span></li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="modern-shop-wrapper">
        <div className="container">
          <div className="row g-4">

            {/* Products Column */}
            <div className="col-12 col-lg-8">

              {/* Controls Bar */}
              <div className="shop-controls-bar">
                <p className="shop-result-count">
                  Showing <strong>1–{filteredProducts.length}</strong> of <strong>{initialProducts.length}</strong> results
                </p>
                <select
                  className="shop-sort-select"
                  value={orderBy}
                  onChange={(e) => setOrderBy(e.target.value)}
                >
                  <option value="menu_order">Default sorting</option>
                  <option value="popularity">Sort by popularity</option>
                  <option value="rating">Sort by average rating</option>
                  <option value="date">Sort by latest</option>
                  <option value="price">Sort by price: low to high</option>
                  <option value="price-desc">Sort by price: high to low</option>
                </select>
              </div>

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <div className="shop-product-grid">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="shop-product-card">
                      <div className="shop-product-img-wrap">
                        <Link to={product.link}>
                          <img src={product.imageUrl} alt={product.name} />
                        </Link>
                        {product.onSale && <span className="shop-sale-badge">Sale</span>}
                      </div>
                      <div className="shop-product-body">
                        <Link to={product.link} className="shop-product-name">{product.name}</Link>
                        <div className="shop-product-divider"></div>
                        <div className="shop-product-footer">
                          <div>
                            {product.onSale && product.originalPrice && (
                              <span className="shop-price-old">{product.currencySymbol}{product.originalPrice.toFixed(2)}</span>
                            )}
                            <span className="shop-price-now">{product.currencySymbol}{product.price.toFixed(2)}</span>
                          </div>
                          <button onClick={() => addToCart(product, false)} className="shop-add-btn">
                            Add to cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <h5 className="text-muted">No products found matching your criteria.</h5>
                </div>
              )}

              {/* Pagination */}
              <div className="shop-pagination">
                <span className="active">1</span>
                <a href="#">2</a>
                <a href="#" className="next-btn">Next</a>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="col-12 col-lg-4 shop-sidebar">

              {/* Cart Widget */}
              <div className="widget">
                <h3 className="shop-widget-title">Cart</h3>
                {cartItems.length === 0 ? (
                  <p className="shop-cart-empty">
                    <i className="fa fa-shopping-cart me-2 text-muted"></i>No products in the cart.
                  </p>
                ) : (
                  <>
                    <ul className="shop-cart-list">
                      {cartItems.map(item => (
                        <li key={item.id} className="shop-cart-item">
                          <Link to="#">
                            <img src={item.imageUrl} alt={item.name} />
                          </Link>
                          <div>
                            <Link className="shop-cart-item-title" to="#">{item.name}</Link>
                            <span className="shop-cart-item-qty">{item.quantity} × £{(item.price || 0).toFixed(2)}</span>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="shop-cart-remove" aria-label="Remove">×</button>
                        </li>
                      ))}
                    </ul>
                    <div className="shop-subtotal">
                      <span>Subtotal</span>
                      <span>£{getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="shop-cart-actions">
                      <Link to="/cart" className="shop-cart-link view">View Cart</Link>
                      <Link to="/checkout" className="shop-cart-link checkout">Checkout</Link>
                    </div>
                  </>
                )}
              </div>

              {/* Product Categories */}
              <div className="widget">
                <h3 className="shop-widget-title">Product Categories</h3>
                <ul className="shop-cat-list">
                  {categories.map(cat => (
                    <li key={cat.value} className={selectedCategory === cat.value ? 'active' : ''}>
                      <a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory(cat.value); }}>
                        {cat.label}
                      </a>
                      {cat.children && (
                        <ul className="shop-cat-children shop-cat-list">
                          {cat.children.map(child => (
                            <li key={child} className={selectedCategory === child ? 'active' : ''}>
                              <a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory(child); }}>{child}</a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter */}
              <div className="widget">
                <h3 className="shop-widget-title">Filter by Price</h3>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="price-range-inputs">
                    <input
                      type="number"
                      className="price-input"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      placeholder="Min"
                    />
                    <span className="price-sep">—</span>
                    <input
                      type="number"
                      className="price-input"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      placeholder="Max"
                    />
                    <button type="submit" className="price-filter-btn">Filter</button>
                  </div>
                  <p className="price-display-label">
                    Price: <strong>£{minPrice}</strong> — <strong>£{maxPrice}</strong>
                  </p>
                </form>
              </div>

              {/* Top Rated Products */}
              <div className="widget">
                <h3 className="shop-widget-title">Top Rated Products</h3>
                <ul className="shop-top-rated-list">
                  {topRatedProducts.map((p, idx) => (
                    <li key={idx}>
                      <img src={p.imageUrl} alt={p.name} className="shop-top-rated-img" />
                      <div className="shop-top-rated-info">
                        <Link to="#" className="shop-top-rated-name">{p.name}</Link>
                        <div>
                          {p.onSale && p.originalPrice && (
                            <span className="shop-top-rated-old">£{p.originalPrice.toFixed(2)}</span>
                          )}
                          <span className="shop-top-rated-price">£{p.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

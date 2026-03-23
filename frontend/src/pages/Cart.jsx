import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../Style/Cart.css'; // New CSS for the cart page

const Cart = () => {
  const { cartItems, removeFromCart, getCartTotal, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const subtotal = getCartTotal();
  const deliveryFee = cartItems.length > 0 ? 275 : 0; // Example delivery fee
  const total = subtotal + deliveryFee;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="cart-page-container container my-5">
      <div className="breadcrumb-container">
        <span>Home</span> / <span>My Account</span> / <span>Shopping Bag</span>
      </div>

      <div className="row">
        {/* Left Column: Shopping Bag Items */}
        <div className="col-lg-8">
          <div className="shopping-bag-header">
            <h1>SHOPPING Cart</h1>
            <div className="header-actions">
              <Link to="/shop" className="all-clothes-link">All products <i className="fa fa-angle-down"></i></Link>
              <button onClick={clearCart} className="remove-all-btn">Remove All</button>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart-message-main">
              <h3>Your Shopping Bag is Empty</h3>
              <p>Looks like you haven’t added anything to your bag yet.</p>
              <Link to="/shop" className="btn btn-dark">Shop Now</Link>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map(item => (
                <div className="cart-item-card" key={item.id}>
                  <div className="item-image">
                    <img src={item.imageUrl} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <p className="item-title">{item.name}</p>
                    <p className="item-size">Size: {item.size || 'M'}</p>
                    <p className="item-price">Price: {item.price.toFixed(2)} $</p>
                    <button onClick={() => removeFromCart(item.id)} className="remove-item-btn">Remove Item</button>
                  </div>
                  <div className="item-quantity-section">
                    <div className="quantity-selector">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div className="item-total-price">
                    <p>{(item.price * item.quantity).toFixed(2)} $</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Checkout & Coupon */}
        <div className="col-lg-4">
          <div className="checkout-summary-card">
            <h4>Checkout</h4>
            <div className="summary-line">
              <span>Number products</span>
              <span>{totalItems}</span>
            </div>
            <div className="summary-line">
              <span>Sub Total</span>
              <span>{subtotal.toFixed(2)} $</span>
            </div>
            <div className="summary-line">
              <span>Delivery Fee</span>
              <span>{deliveryFee.toFixed(2)} $</span>
            </div>
            <hr />
            <div className="summary-line total-line">
              <span>Total</span>
              <span>{total.toFixed(2)} $</span>
            </div>
            <button className="btn btn-dark btn-block make-payment-btn" onClick={handleCheckout}>
              Make Payment <i className="fa fa-arrow-right"></i>
            </button>
          </div>

          <div className="coupon-card">
            <h4>Add Coupon Code</h4>
            <input type="text" className="form-control" placeholder="Enter Coupon Code" />
            <button className="btn btn-secondary btn-block apply-coupon-btn">
              Apply Coupon <i className="fa fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


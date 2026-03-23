import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../Style/Checkout.css'; // Assuming you will create this CSS file

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        emailOrPhone: '',
        emailOffers: true,
        country: 'Bangladesh',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        phone: '',
        saveInfo: false,
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderMessage, setOrderMessage] = useState('');


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleContinueToPayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setOrderMessage('');

        // Basic validation for form data
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.city || !formData.zip || !formData.country) {
            setOrderMessage('Please fill in all delivery details.');
            setIsProcessing(false);
            return;
        }

        if (cartItems.length === 0) {
            setOrderMessage('Your cart is empty. Please add items before proceeding.');
            setIsProcessing(false);
            return;
        }

        const customerDetails = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
        };

        const shippingAddress = {
            address: formData.address,
            city: formData.city,
            zip: formData.zip,
            country: formData.country,
        };
        // Assuming billing address is same as shipping for now
        const billingAddress = shippingAddress;

        const subtotalAmount = getCartTotal();
        const deliveryFeeAmount = 275; // Assuming fixed delivery fee, get from Cart.jsx through location.state
        const totalAmount = subtotalAmount + deliveryFeeAmount;

        const cartItemsForBooking = cartItems.map(item => ({
            id: item.id, // tourId
            quantity: item.quantity,
            priceAtPurchase: item.price,
        }));

        try {
            // Placeholder for actual authentication token
            // const token = localStorage.getItem('token'); 
            const headers = { 'Content-Type': 'application/json' };
            // if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch('/api/v1/bookings', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    cartItems: cartItemsForBooking,
                    customerDetails,
                    shippingAddress,
                    billingAddress,
                    totalAmount,
                    deliveryFee: deliveryFeeAmount,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create booking.');
            }

            const bookingId = data.data._id;
            
            navigate('/payment', { 
                state: { 
                    total: totalAmount, 
                    bookingId: bookingId,
                    deliveryFee: deliveryFeeAmount // Pass delivery fee to Payment page if needed
                } 
            });

            clearCart(); // Clear cart after successful booking creation

        } catch (error) {
            console.error('Booking creation error:', error);
            setOrderMessage(error.message || 'An error occurred during booking. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="checkout-container empty-cart">
                <div className="container text-center">
                    <h2>Checkout</h2>
                    <p>Your cart is empty. Please add some items to proceed to checkout.</p>
                    <Link to="/shop" className="btn btn-primary">Return to Shop</Link>
                </div>
            </div>
        );
    }
    const subtotal = getCartTotal();
    const discount = 0; // Add logic for discount if any
    const total = subtotal - discount;


    return (
        <div className="checkout-container">
            <div className="container-fluid">
                <div className="row">
                    {/* Left Side - Form */}
                    <div className="col-lg-7 checkout-form-section">
                        <div className="form-wrapper">
                            <form>
                                <div className="form-section">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h4>Contact</h4>
                                        <p>
                                            Have an account? <Link to="/login">Sign In</Link>
                                        </p>
                                    </div>
                                    <input type="text" name="emailOrPhone" className="form-control" placeholder="Email or phone number" value={formData.emailOrPhone} onChange={handleInputChange} />
                                    <div className="form-check mt-2">
                                        <input className="form-check-input" type="checkbox" name="emailOffers" id="emailOffers" checked={formData.emailOffers} onChange={handleInputChange} />
                                        <label className="form-check-label" htmlFor="emailOffers">
                                            Email me with news and offers
                                        </label>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h4>Delivery</h4>
                                    <select name="country" className="form-control" value={formData.country} onChange={handleInputChange}>
                                        <option>Bangladesh</option>
                                        <option>United Kingdom</option>
                                        <option>United States</option>
                                    </select>
                                    <div className="row mt-3">
                                        <div className="col-md-6">
                                            <input type="text" name="firstName" className="form-control" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <input type="text" name="lastName" className="form-control" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <input type="text" name="address" className="form-control mt-3" placeholder="Detail full address/house, road, block etc" value={formData.address} onChange={handleInputChange} />
                                    <div className="row mt-3">
                                        <div className="col-md-6">
                                            <input type="text" name="city" className="form-control" placeholder="City/District" value={formData.city} onChange={handleInputChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <input type="text" name="postalCode" className="form-control" placeholder="Postal Code (optional)" value={formData.postalCode} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <input type="text" name="phone" className="form-control mt-3" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} />
                                    <div className="form-check mt-2">
                                        <input className="form-check-input" type="checkbox" name="saveInfo" id="saveInfo" checked={formData.saveInfo} onChange={handleInputChange} />
                                        <label className="form-check-label" htmlFor="saveInfo">
                                            Save this information for next time
                                        </label>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h4>Shipping Method</h4>
                                    <select className="form-control">
                                        <option>Standard Shipping (FREE)</option>
                                    </select>
                                </div>

                                <div className="form-section">
                                    <h4>Payment</h4>
                                    <p>All transactions are secure and encrypted.</p>
                                    <select className="form-control">
                                        <option>Cash on Delivery (COD)</option>
                                    </select>
                                </div>

                                <div className="form-section">
                                    <h4>Billing Address</h4>
                                    <div className="form-check billing-option">
                                        <input className="form-check-input" type="radio" name="billingAddress" id="sameAddress" value="same" defaultChecked />
                                        <label className="form-check-label" htmlFor="sameAddress">
                                            Same as shipping address
                                        </label>
                                    </div>
                                    <div className="form-check billing-option">
                                        <input className="form-check-input" type="radio" name="billingAddress" id="differentAddress" value="different" />
                                        <label className="form-check-label" htmlFor="differentAddress">
                                            Use a different billing address
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>


                    <div className="col-lg-5 checkout-summary-section">
                        <div className="summary-wrapper">
                            <h4>Shopping Cart</h4>
                            {cartItems.map(item => (
                                <div className="cart-item-summary" key={item.id}>
                                    <img src={item.imageUrl} alt={item.name} className="item-image" />
                                    <div className="item-details">
                                        <p className="item-name">{item.name}</p>
                                        <p className="item-info">Color: {item.color || 'N/A'}, Size: {item.size || 'N/A'}</p>
                                        <div className="quantity-selector">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                    </div>
                                    <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                                    <button className="remove-item" onClick={() => removeFromCart(item.id)}>🗑️</button>
                                </div>
                            ))}

                            <div className="order-summary-details">
                                <h4>Order Summary</h4>
                                {cartItems.map(item => (
                                    <div className="summary-line-item" key={item.id}>
                                        <span>{item.name} x{item.quantity}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <hr />
                                <div className="summary-line-item">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-line-item">
                                    <span>Discount</span>
                                    <span>-${discount.toFixed(2)}</span>
                                </div>
                                <div className="coupon-code">
                                    <input type="text" className="form-control" placeholder="Coupon Code" />
                                    <button className="btn">Apply</button>
                                </div>
                                <hr />
                                <div className="summary-line-item total">
                                    <span>TOTAL</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-dark btn-block btn-lg continue-payment" onClick={handleContinueToPayment} disabled={isProcessing}>
                                {isProcessing ? 'Processing Order...' : 'Continue to Payment'}
                            </button>
                            {orderMessage && <p className={`order-message mt-3 text-center ${orderMessage.includes('successfully') || orderMessage.includes('booking') ? 'text-success' : 'text-danger'}`}>{orderMessage}</p>}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
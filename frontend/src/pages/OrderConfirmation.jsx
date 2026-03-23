import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Style/OrderConfirmation.css';

const OrderConfirmation = () => {
    const location = useLocation();
    const orderPlaced = location.state?.orderPlaced;

    return (
        <div className="confirmation-container">
            <div className="confirmation-wrapper">
                {orderPlaced ? (
                    <>
                        <div className="success-icon">✓</div>
                        <h1 className="confirmation-title">Thank You For Your Order!</h1>
                        <p className="confirmation-message">Your payment has been processed successfully, and your booking is confirmed.</p>
                        <p>You will receive an email confirmation with your order details shortly.</p>
                    </>
                ) : (
                    <>
                        <div className="error-icon">✗</div>
                        <h1 className="confirmation-title">Something Went Wrong</h1>
                        <p className="confirmation-message">We couldn't confirm your order. Please contact our support team.</p>
                    </>
                )}
                <Link to="/shop" className="btn-back-to-shop">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmation;

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import '../Style/Payment.css';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { total, bookingId } = location.state || { total: 0, bookingId: null };

    const [paymentMethod, setPaymentMethod] = useState('Stripe');
    const [cardInfo, setCardInfo] = useState({
        cardholderName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvc: '',
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCardInfo({ ...cardInfo, [name]: value });
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsProcessing(true);

        const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage after login
        if (!userId) {
            setErrorMessage('User not logged in. Please log in to complete payment.');
            setIsProcessing(false);
            return;
        }

        const paymentData = {
            bookingId,
            amount: total,
            paymentMethod,
            userId, // Pass userId to backend
        };

        try {
            const token = localStorage.getItem('token'); 
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch('/api/v1/payments', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(paymentData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Payment failed');
            }
            
            navigate('/order-confirmation', { state: { orderPlaced: true } });

        } catch (error) {
            console.error('Payment processing error:', error);
            setErrorMessage(error.message || 'An error occurred during payment. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };
    
    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    description: "Tour Booking",
                    amount: {
                        currency_code: "USD",
                        value: total,
                    },
                },
            ],
        });
    };

    const onApprove = (data, actions) => {
        return actions.order.capture().then(details => {
            console.log("Payment successful", details);
            // Here you would call your backend to save the transaction
            navigate('/order-confirmation', { state: { orderPlaced: true } });
        });
    };

    const onError = (err) => {
        console.error("PayPal Checkout onError", err);
        setErrorMessage("An error occurred with your PayPal payment.");
    };


    return (
        <PayPalScriptProvider options={{ "client-id": "test", components: "buttons" }}>
            <div className="payment-container">
                <div className="payment-form-wrapper">
                    <h2 className="payment-title">Complete Your Payment</h2>
                    
                    <div className="order-total-summary">
                        <span>Order Total:</span>
                        <span className="total-amount">${total.toFixed(2)}</span>
                    </div>

                    <div className="payment-methods">
                        <div className="payment-method">
                            <input type="radio" id="stripe" name="paymentMethod" value="Stripe" checked={paymentMethod === 'Stripe'} onChange={handlePaymentMethodChange} />
                            <label htmlFor="stripe">Credit / Debit Card (Stripe)</label>
                        </div>
                        <div className="payment-method">
                            <input type="radio" id="paypal" name="paymentMethod" value="PayPal" checked={paymentMethod === 'PayPal'} onChange={handlePaymentMethodChange} />
                            <label htmlFor="paypal">PayPal</label>
                        </div>
                        <div className="payment-method">
                            <input type="radio" id="cod" name="paymentMethod" value="Cash on Delivery" checked={paymentMethod === 'Cash on Delivery'} onChange={handlePaymentMethodChange} />
                            <label htmlFor="cod">Cash on Delivery</label>
                        </div>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="payment-form">
                        {paymentMethod === 'Stripe' && (
                            <div id="stripe-form">
                                {/* Stripe form fields */}
                                <div className="form-group">
                                    <label htmlFor="cardholderName">Cardholder Name</label>
                                    <input type="text" id="cardholderName" name="cardholderName" className="form-control" placeholder="e.g. John Doe" value={cardInfo.cardholderName} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cardNumber">Card Number</label>
                                    <input type="text" id="cardNumber" name="cardNumber" className="form-control" placeholder="•••• •••• •••• ••••" maxLength="19" value={cardInfo.cardNumber.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()} onChange={handleInputChange} required />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <label htmlFor="expiryMonth">Expiry Month</label>
                                        <input type="text" id="expiryMonth" name="expiryMonth" className="form-control" placeholder="MM" maxLength="2" value={cardInfo.expiryMonth} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <label htmlFor="expiryYear">Expiry Year</label>
                                        <input type="text" id="expiryYear" name="expiryYear" className="form-control" placeholder="YYYY" maxLength="4" value={cardInfo.expiryYear} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cvc">CVC</label>
                                    <input type="text" id="cvc" name="cvc" className="form-control" placeholder="•••" maxLength="4" value={cardInfo.cvc} onChange={handleInputChange} required />
                                </div>
                            </div>
                        )}
                        
                        {paymentMethod === 'PayPal' && (
                            <div className="paypal-button-container">
                                <PayPalButtons
                                    style={{ layout: "vertical" }}
                                    createOrder={createOrder}
                                    onApprove={onApprove}
                                    onError={onError}
                                />
                            </div>
                        )}

                        {paymentMethod === 'Cash on Delivery' && (
                            <div className="payment-method-info">
                                <p>You will pay with cash upon delivery of your tickets/documents.</p>
                            </div>
                        )}

                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        
                        {paymentMethod !== 'PayPal' && (
                             <button type="submit" className="btn-pay-now" disabled={isProcessing}>
                                {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)} Now`}
                            </button>
                        )}
                    </form>
                    <div className="secure-payment-badge">
                        <p>🔒 All transactions are secure and encrypted.</p>
                    </div>
                </div>
            </div>
        </PayPalScriptProvider>
    );
};

export default Payment;

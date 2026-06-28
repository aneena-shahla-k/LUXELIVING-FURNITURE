import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutForm from '../Cart-One/CheckoutForm';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [stripePromise, setStripePromise] = useState(null);

  const orderData = location.state;

  useEffect(() => {
    const initStripe = async () => {
      try {
        const stripe = await loadStripe('pk_test_51TgxUYI6WJJhP7uwFS4lZYL5Lk6ekCPXTO0jhexmjLPRBVkCK6GtlfhqhqsVPhdclmsoJxAukCUn5uKZEBuGEysr00aOn6GxNu');
        setStripePromise(stripe);
      } catch (error) {
        console.error("Stripe initialization failed:", error);
      }
    };

    if (orderData) {
      initStripe();
    }
  }, [orderData]);

  if (!orderData) {
    return (
      <div className="text-center py-5" style={{ marginTop: '150px' }}>
        <h4 className="text-danger">No active checkout session found.</h4>
        <button onClick={() => navigate('/')} className="btn text-white mt-3" style={{ backgroundColor: '#3b5d50' }}>
          Go back to Shopping Bag
        </button>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="text-center py-5" style={{ marginTop: '150px' }}>
        <p className="text-muted">Securing payment gateway connection...</p>
      </div>
    );
  }

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ marginTop: '140px', minHeight: '60vh' }}>
      
      {/* Heading & Amount Area */}
      <div className="text-center mb-5">
        <h2 className="font-serif tracking-tight" style={{ color: '#2d4a3e', fontSize: '2rem', fontWeight: '500' }}>
          LuxeLiving Checkout
        </h2>
        <p className="text-muted small mt-2">
          Total Amount to Pay: <span className="fw-bold fs-5 text-dark" style={{ color: '#2d4a3e' }}>₹{orderData.totalAmount.toLocaleString('en-IN')}</span>
        </p>
      </div>

      {/* Stripe Wrapper with a beautiful premium card container */}
      <div className="w-100" style={{ maxWidth: '480px' }}>
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            totalAmount={orderData.totalAmount}
            cartItems={orderData.cartItems}
            shippingAddress={orderData.shippingAddress}
          />
        </Elements>
      </div>

    </div>
  );
};

export default PaymentPage;

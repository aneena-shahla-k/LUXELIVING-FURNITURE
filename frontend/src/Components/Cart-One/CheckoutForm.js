import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckoutForm = ({ totalAmount, cartItems, shippingAddress }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPaymentMessage('');

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post('http://localhost:5001/api/payment/create-payment-intent', {
        items: cartItems,
        totalAmount,
        shippingAddress
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const { clientSecret, orderId } = response.data;
      console.log("Order Created inside Database with ID:", orderId);

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (paymentResult.error) {
        setPaymentMessage(`❌ Error: ${paymentResult.error.message}`);
        setIsProcessing(false);
      } else {
        if (paymentResult.paymentIntent.status === 'succeeded') {
  try {
    const token = localStorage.getItem('token');
    
    await axios.delete('http://localhost:5001/api/cart/clear', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("Database: Cart cleared successfully.");
  } catch (cartError) {
    console.error("Failed to clear cart on database:", cartError);
  }

  setPaymentMessage('✅ Payment Successful! Order Placed.');
  setIsProcessing(false);

  setTimeout(() => {
    window.dispatchEvent(new Event('cartUpdated'));
  }, 300);

  setTimeout(() => {
    navigate('/order-success', { state: { orderId } });
  }, 1200);
}



      }
    } catch (error) {
      console.error("Frontend Payment Error:", error);
      setPaymentMessage('❌ Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}>
      <h5 className="mb-4 text-start font-serif" style={{ color: '#2d4a3e', fontWeight: '600' }}>Card Details</h5>
      
      {/* Stripe Element Container */}
      <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#2d4a3e',
              fontFamily: 'serif, sans-serif',
              '::placeholder': { color: '#adb5bd' },
            },
            invalid: { color: '#dc3545' },
          },
        }} />
      </div>

      {/* Premium Styled Pay Button */}
      <button
        disabled={!stripe || isProcessing}
        className="btn text-white w-100 py-2.5 fw-semibold transition-all"
        style={{ 
          backgroundColor: '#3b5d50', 
          borderRadius: '6px',
          fontSize: '1rem',
          letterSpacing: '0.5px'
        }}
      >
        {isProcessing ? (
          <div className="spinner-border spinner-border-sm text-light" role="status"></div>
        ) : (
          `Pay ₹${totalAmount.toLocaleString('en-IN')}`
        )}
      </button>

      {paymentMessage && (
        <div className={`mt-4 text-center small fw-bold ${paymentMessage.includes('❌') ? 'text-danger' : 'text-success'}`}>
          {paymentMessage}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;

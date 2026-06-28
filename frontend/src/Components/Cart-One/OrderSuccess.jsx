import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId || "N/A";

  return (
    <div className="container text-center d-flex flex-column align-items-center justify-content-center" style={{ marginTop: '160px', minHeight: '50vh' }}>
      <div className="card border-0 shadow-sm p-5 bg-white" style={{ borderRadius: '16px', maxWidth: '500px' }}>
        
        {/* Success Icon */}
        <div className="mb-4 d-flex align-items-center justify-content-center mx-auto" style={{ width: '70px', height: '70px', backgroundColor: '#e8f5e9', borderRadius: '50%' }}>
          <span className="fs-2 text-success">✓</span>
        </div>

        <h2 className="font-serif mb-3" style={{ color: '#2d4a3e', fontWeight: '500' }}>Thank You For Your Order!</h2>
        <p className="text-muted small mb-4">Your payment was processed successfully, and your luxury items are being prepared for shipment.</p>
        
        {/* Order Reference */}
        <div className="p-3 mb-4 rounded text-start" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
          <span className="text-muted d-block small fw-medium text-uppercase tracking-wider">Order Reference</span>
          <strong className="text-dark font-monospace" style={{ fontSize: '0.9rem' }}>{orderId}</strong>
        </div>

        {/* Buttons */}
        <div className="d-flex gap-3 justify-content-center">
          <button 
            onClick={() => navigate('/collection')} 
            className="btn text-white px-4 py-2.5 fw-semibold" 
            style={{ backgroundColor: '#3b5d50', borderRadius: '6px', fontSize: '0.9rem' }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

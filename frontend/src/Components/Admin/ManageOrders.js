import React, { useEffect, useState } from 'react';
import { API } from '../../api';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAllOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`$API.admin}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleStatusChange = async (orderId, currentStatus, type, newValue) => {
    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        orderStatus: type === 'order' ? newValue : currentStatus.orderStatus,
        paymentStatus: type === 'payment' ? newValue : currentStatus.paymentStatus
      };

      const response = await fetch(`${API.admin}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        setOrders(prevOrders => 
          prevOrders.map(o => o._id === orderId ? { ...o, orderStatus: payload.orderStatus, paymentStatus: payload.paymentStatus } : o)
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <style>{`
        .mo-title { font-size: 22px; font-weight: 700; color: #e8edf5; letter-spacing: -0.3px; margin-bottom: 20px; }
        .mo-card { background: #131929; border: 1px solid #1e2d47; border-radius: 14px; overflow: hidden; }
        .mo-table-wrapper { overflow-x: auto; }
        .mo-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13.5px; }
        .mo-table th { padding: 14px 20px; background: #0b0f1a; color: #7a8fae; font-weight: 600; border-bottom: 1px solid #1e2d47; }
        .mo-table td { padding: 14px 20px; border-bottom: 1px solid #1e2d47; color: #e8edf5; vertical-align: middle; }
        .mo-table tr:hover td { background: #172035; }
        
        .mo-select {
          background: #0b0f1a; color: #e8edf5;
          border: 1px solid #1e2d47; padding: 6px 10px;
          border-radius: 6px; font-size: 12.5px; font-weight: 500;
          cursor: pointer; outline: none; transition: border-color 0.2s;
        }
        .mo-select:focus { border-color: #3d7eff; }
      `}</style>

      <div>
        <div className="mo-title">Manage Store Orders</div>

        <div className="mo-card">
          <div className="mo-table-wrapper">
            <table className="mo-table">
              <thead>
                <tr>
                  <th>Client &amp; Address</th>
                  <th>Products</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#7a8fae' }}>Loading all orders...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#7a8fae' }}>No orders found in database.</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} style={{ opacity: updatingId === order._id ? 0.5 : 1 }}>
                      
                      <td>
                        <div style={{ fontWeight: 600 }}>{order.userId?.name || 'Guest User'}</div>
                        <div style={{ fontSize: 11, color: '#7a8fae', marginTop: 2 }}>{order.userId?.email || 'N/A'}</div>
                        {order.shippingAddress && (
                          <div style={{ fontSize: 11, color: '#6b82a8', marginTop: 6, maxWidth: '200px', width: 'max-content', fontStyle: 'italic' }}>
                            📍 {order.shippingAddress}
                          </div>
                        )}
                      </td>

                      <td>
                        {order.items?.map((item, idx) => (
                          <div key={idx} style={{ fontSize: 12.5, color: '#c0cfdf' }}>
                            {item.productName} <span style={{ color: '#7a8fae' }}>x{item.quantity}</span>
                          </div>
                        ))}
                      </td>

                      <td style={{ fontWeight: 600, color: '#20c97a' }}>
                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                      </td>

                      <td>
                        <select 
                          className="mo-select"
                          value={order.paymentStatus || 'Pending'}
                          onChange={(e) => handleStatusChange(order._id, order, 'payment', e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Failed">Failed</option>
                        </select>
                      </td>

                      <td>
                        <select 
                          className="mo-select"
                          value={order.orderStatus || 'Pending'}
                          onChange={(e) => handleStatusChange(order._id, order, 'order', e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td style={{ fontSize: 12, color: '#7a8fae' }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageOrders;

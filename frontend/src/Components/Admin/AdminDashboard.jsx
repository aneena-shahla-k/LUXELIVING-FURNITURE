import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, ShoppingBag, Palette, FileImage,
  Plus, Eye, 
  Clock, Layers, CheckCircle2,
  Users
} from 'lucide-react';


const SparkBar = ({ values = [], color = '#3d7eff' }) => {
  const max = Math.max(...values, 1);
  const w = 260, h = 56, gap = 4;
  const barW = (w - gap * (values.length - 1)) / values.length;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {values.map((v, i) => {
        const bh = Math.max(4, (v / max) * h);
        return (
          <rect
            key={i}
            x={i * (barW + gap)}
            y={h - bh}
            width={barW}
            height={bh}
            rx={3}
            fill={color}
            opacity={i === values.length - 1 ? 1 : 0.35}
          />
        );
      })}
    </svg>
  );
};

const SparkLine = ({ values = [], color = '#22d37c' }) => {
  const max = Math.max(...values, 1);
  const w = 260, h = 56;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - (v / max) * (h - 8);
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const AdminDashboard = () => {
  // 1. Initialize States
  const [stats, setStats] = useState({
    totalProducts: 0,
    shopTheLookItems: 0,
    decorCollections: 0,
    detailPages: 0,
    totalUsers: 0
  });
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);

  // 2. Single useEffect to fetch both Stats and Orders parallelly
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token'); // JWT Token from local storage

        // Parallel API calls using Promise.all Settled to ensure one failing doesn't break the other
        const [statsRes, ordersRes] = await Promise.all([
          fetch('http://localhost:5001/api/dashboard/stats'),
          fetch('http://localhost:5001/api/admin/orders', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success) {
            setStats({
              totalProducts: statsData.counts.totalProducts || 0,
              shopTheLookItems: statsData.counts.shopTheLookItems || 0,
              decorCollections: statsData.counts.decorCollections || 0,
              detailPages: statsData.counts.detailPages || 0,
              totalUsers: statsData.counts.totalUsers || 0
            });
          }
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          if (ordersData.success) {
            setOrders(ordersData.orders || []);
          }
        }
      } catch (error) {
        console.error("Error pulling dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 3. Layout Mapping configurations
  const kpiCards = [
    {
      label: 'Total Products',
      value: loading ? '...' : stats.totalProducts,
      change: null,
      icon: <Package size={20} />,
      color: '#3d7eff',
      spark: [10, 20, 15, stats.totalProducts || 5],
      type: 'bar',
      note: stats.totalProducts > 0 ? 'Live data' : 'No data yet'
    },
    {
      label: 'Shop The Look Items',
      value: loading ? '...' : stats.shopTheLookItems,
      change: null,
      icon: <ShoppingBag size={20} />,
      color: '#22d37c',
      spark: [5, 10, 8, stats.shopTheLookItems || 2],
      type: 'line',
      note: stats.shopTheLookItems > 0 ? 'Live data' : 'No data yet'
    },
    {
      label: 'Decor Collections',
      value: loading ? '...' : stats.decorCollections,
      change: null,
      icon: <Palette size={20} />,
      color: '#f59e0b',
      spark: [2, 6, 4, stats.decorCollections || 1],
      type: 'bar',
      note: stats.decorCollections > 0 ? 'Live data' : 'No data yet'
    },
    {
      label: 'Detail Pages',
      value: loading ? '...' : stats.detailPages,
      change: null,
      icon: <FileImage size={20} />,
      color: '#a78bfa',
      spark: [4, 9, 7, stats.detailPages || 3],
      type: 'line',
      note: stats.detailPages > 0 ? 'Live data' : 'No data yet'
    },
  ];

  const quickActions = [
    { title: 'Add Category Products', desc: 'Upload and manage your product catalog', addPath: '/admin/add-product', viewPath: '/admin/view-products', color: '#3d7eff', icon: <Package size={22} /> },
    { title: 'Shop The Look', desc: 'Create styled look collections', addPath: '/admin/shop-the-look', viewPath: '/admin/view-shop-the-look', color: '#22d37c', icon: <ShoppingBag size={22} /> },
    { title: 'Shop The Decor', desc: 'Manage decor product sections', addPath: '/admin/shop-the-decor', viewPath: '/admin/view-shop-the-decor', color: '#f59e0b', icon: <Palette size={22} /> },
    { title: 'Decor Detail Pages', desc: 'Edit individual decor detail pages', addPath: '/admin/decor-details', viewPath: '/admin/view-decor-details', color: '#a78bfa', icon: <FileImage size={22} /> },
  ];

  const statusItems = [
    { label: 'System Status', status: 'Operational', icon: <CheckCircle2 size={14} />, color: '#22d37c' },
    { label: 'Last Updated', status: 'Just now', icon: <Clock size={14} />, color: '#3d7eff' },
    { label: 'Total Clients', status: loading ? '...' : `${stats.totalUsers} Active`, icon: <Users size={14} />, color: '#f59e0b' },
    { label: 'Active Sections', status: `${(stats.totalProducts > 0 ? 1 : 0) + (stats.shopTheLookItems > 0 ? 1 : 0) + (stats.decorCollections > 0 ? 1 : 0) + (stats.detailPages > 0 ? 1 : 0)} Live`, icon: <Layers size={14} />, color: '#a78bfa' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .ad-root { font-family: 'Inter', sans-serif; }

        /* PAGE HEADER */
        .ad-page-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 28px; flex-wrap: wrap; gap: 14px;
        }
        .ad-page-title { font-size: 22px; font-weight: 700; color: #e8edf5; letter-spacing: -0.3px; }
        .ad-page-sub { font-size: 13px; color: #7a8fae; margin-top: 3px; }

        /* STATUS STRIP */
        .ad-status-strip {
          display: flex; gap: 1px; margin-bottom: 28px;
          background: #1e2d47; border-radius: 12px; overflow: hidden;
          border: 1px solid #1e2d47;
        }
        .ad-status-item {
          flex: 1; padding: 12px 16px;
          background: #131929; display: flex; align-items: center; gap: 8px;
        }
        .ad-status-item:hover { background: #172035; }
        .ad-status-dot { flex-shrink: 0; }
        .ad-status-label { font-size: 11px; color: #3f5370; font-weight: 500; }
        .ad-status-val { font-size: 12.5px; font-weight: 600; color: #e8edf5; }

        /* KPI GRID */
        .ad-kpi-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px; margin-bottom: 28px;
        }
        .ad-kpi-card {
          background: #131929; border: 1px solid #1e2d47;
          border-radius: 14px; padding: 20px;
          position: relative; overflow: hidden;
          transition: border-color 0.2s, transform 0.15s;
        }
        .ad-kpi-card:hover { border-color: #2a3d5e; transform: translateY(-1px); }
        .ad-kpi-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
        .ad-kpi-icon {
          width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .ad-kpi-badge {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 600; padding: 3px 8px;
          border-radius: 20px;
        }
        .ad-kpi-value { font-size: 28px; font-weight: 700; color: #e8edf5; letter-spacing: -1px; margin-bottom: 3px; }
        .ad-kpi-label { font-size: 12px; color: #7a8fae; font-weight: 500; margin-bottom: 14px; }
        .ad-kpi-spark { opacity: 0.7; }
        .ad-kpi-note { font-size: 11px; color: #3f5370; margin-top: 8px; }

        /* QUICK ACTIONS GRID */
        .ad-qa-title { font-size: 14.5px; font-weight: 600; color: #e8edf5; margin-bottom: 16px; }
        .ad-qa-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 10px;
        }
        .ad-qa-card {
          background: #131929; border: 1px solid #1e2d47;
          border-radius: 14px; padding: 20px;
          transition: border-color 0.2s, transform 0.15s;
        }
        .ad-qa-card:hover { border-color: #2a3d5e; transform: translateY(-1px); }
        .ad-qa-top { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .ad-qa-icon {
          width: 44px; height: 44px; border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ad-qa-name { font-size: 14.5px; font-weight: 600; color: #e8edf5; }
        .ad-qa-desc { font-size: 12.5px; color: #7a8fae; margin-bottom: 16px; line-height: 1.5; }
        .ad-qa-actions { display: flex; gap: 9px; }
        .ad-qa-btn-add {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 8px 12px; border-radius: 8px;
          font-size: 12.5px; font-weight: 600; text-decoration: none;
          border: none; cursor: pointer;
          transition: opacity 0.15s;
          color: #fff;
        }
        .ad-qa-btn-add:hover { opacity: 0.85; }
        .ad-qa-btn-view {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 8px 12px; border-radius: 8px;
          font-size: 12.5px; font-weight: 500; text-decoration: none;
          background: #0b0f1a; color: #7a8fae;
          border: 1px solid #1e2d47; cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .ad-qa-btn-view:hover { background: #172035; color: #e8edf5; }

        /* PREMIUM ORDERS TABLE STYLES */
        .ad-orders-section { margin-top: 32px; }
        .ad-table-card {
          background: #131929; border: 1px solid #1e2d47;
          border-radius: 14px; overflow: hidden; margin-bottom: 28px;
        }
        .ad-table-wrapper { overflow-x: auto; }
        .ad-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13.5px; }
        .ad-table th { padding: 14px 20px; background: #0b0f1a; color: #7a8fae; font-weight: 600; border-bottom: 1px solid #1e2d47; }
        .ad-table td { padding: 14px 20px; border-bottom: 1px solid #1e2d47; color: #e8edf5; vertical-align: middle; }
        .ad-table tr:last-child td { border-bottom: none; }
        .ad-table tr:hover td { background: #172035; }

        /* BADGES */
        .ad-badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; display: inline-block; text-align: center; }
        .ad-badge-success { background: rgba(32, 201, 122, 0.15); color: #20c97a; }
        .ad-badge-warning { background: rgba(245, 166, 35, 0.15); color: #f5a623; }
        .ad-badge-danger { background: rgba(240, 79, 114, 0.15); color: #f04f72; }
        .ad-badge-info { background: rgba(79, 126, 255, 0.15); color: #4f7eff; }

        /* DIVIDER */
        .ad-divider { height: 1px; background: #1e2d47; margin: 28px 0; }
      `}</style>

      <div className="ad-root">

        {/* PAGE HEADER */}
        <div className="ad-page-header">
          <div>
            <div className="ad-page-title">Dashboard</div>
            <div className="ad-page-sub">Welcome back, Admin. Your store overview is below.</div>
          </div>
        </div>

        {/* STATUS STRIP */}
        <div className="ad-status-strip">
          {statusItems.map((s, i) => (
            <div key={i} className="ad-status-item">
              <span className="ad-status-dot" style={{ color: s.color }}>{s.icon}</span>
              <div>
                <div className="ad-status-label">{s.label}</div>
                <div className="ad-status-val">{s.status}</div>
              </div>
            </div>
          ))}
        </div>

        {/* KPI CARDS */}
        <div className="ad-kpi-grid">
          {kpiCards.map((k, i) => (
            <div key={i} className="ad-kpi-card">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon"
                  style={{ background: `${k.color}18`, color: k.color }}>
                  {k.icon}
                </div>
                <span style={{ fontSize: 11, color: '#3f5370' }}>{k.note}</span>
              </div>
              <div className="ad-kpi-value">{k.value}</div>
              <div className="ad-kpi-label">{k.label}</div>
              <div className="ad-kpi-spark">
                {k.type === 'bar'
                  ? <SparkBar values={k.spark} color={k.color} />
                  : <SparkLine values={k.spark} color={k.color} />}
              </div>
            </div>
          ))}
        </div>

        

        <div className="ad-divider" />

        {/* QUICK ACTIONS */}
        <div className="ad-qa-title">Quick Actions</div>
        <div className="ad-qa-grid">
          {quickActions.map((q, i) => (
            <div key={i} className="ad-qa-card">
              <div className="ad-qa-top">
                <div className="ad-qa-icon" style={{ background: `${q.color}18`, color: q.color }}>
                  {q.icon}
                </div>
                <div className="ad-qa-name">{q.title}</div>
              </div>
              <div className="ad-qa-desc">{q.desc}</div>
              <div className="ad-qa-actions">
                <Link to={q.addPath} className="ad-qa-btn-add" style={{ background: q.color }}>
                  <Plus size={14} /> Add New
                </Link>
                <Link to={q.viewPath} className="ad-qa-btn-view">
                  <Eye size={14} /> View &amp; Edit
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* PREMIUM RECENT ORDERS TABLE */}
        <div className="ad-orders-section">
          <div className="ad-qa-title">Recent Orders</div>
          <div className="ad-table-card">
            <div className="ad-table-wrapper">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Items Placed</th>
                    <th>Total Amount</th>
                    <th>Payment Status</th>
                    <th>Order Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: '#7a8fae', padding: '30px' }}>
                        Loading orders...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: '#7a8fae', padding: '30px' }}>
                        No orders placed yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id}>
                        {/* Client details with elegant fallback */}
                        <td>
                          <div style={{ fontWeight: 600, color: '#e8edf5' }}>{order.userId?.name || 'Guest Client'}</div>
                          <div style={{ fontSize: 11, color: '#7a8fae', marginTop: 2 }}>{order.userId?.email || 'N/A'}</div>
                        </td>

                        {/* Items mapped inside order */}
                        <td>
                          {order.items && order.items.map((item, idx) => (
                            <div key={idx} style={{ fontSize: 12.5, color: '#c0cfdf' }}>
                              {item.productName} <span style={{ color: '#7a8fae', fontSize: 11 }}>x{item.quantity}</span>
                            </div>
                          ))}
                        </td>

                        {/* Total pricing localized */}
                        <td>
                          <div style={{ fontWeight: 600, color: '#20c97a' }}>
                            ₹{order.totalAmount ? order.totalAmount.toLocaleString('en-IN') : '0'}
                          </div>
                        </td>

                        {/* Dynamic Payment Status Badge */}
                        <td>
                          <span className={`ad-badge ${
                            order.paymentStatus === 'Paid' ? 'ad-badge-success' : 
                            order.paymentStatus === 'Pending' ? 'ad-badge-warning' : 'ad-badge-danger'
                          }`}>
                            {order.paymentStatus || 'Pending'}
                          </span>
                        </td>

                        {/* Dynamic Order Status Badge */}
                        <td>
                          <span className={`ad-badge ${
                            order.orderStatus === 'Delivered' ? 'ad-badge-success' : 
                            order.orderStatus === 'Pending' ? 'ad-badge-warning' : 'ad-badge-info'
                          }`}>
                            {order.orderStatus || 'Pending'}
                          </span>
                        </td>

                        {/* Formatted Order Date */}
                        <td style={{ fontSize: 12, color: '#7a8fae' }}>
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default AdminDashboard;

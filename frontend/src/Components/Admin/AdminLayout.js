import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Package, ShoppingBag, Palette, FileImage,
  LogOut, Bell, ChevronDown, ChevronUp,
  Settings, LayoutDashboard, Users,
  ShoppingCart, Menu, X
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const [isManageOpen, setIsManageOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkSize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const subNav = [
    { name: 'Products',          icon: <Package size={15} />,    path: '/admin/add-product' },
    { name: 'Shop The Look',     icon: <ShoppingBag size={15} />, path: '/admin/shop-the-look' },
    { name: 'Shop The Decor',    icon: <Palette size={15} />,    path: '/admin/shop-the-decor' },
    { name: 'Decor Details',     icon: <FileImage size={15} />,  path: '/admin/decor-details' },
  ];

  const isActive = (p) => location.pathname === p;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        :root{
          --bg:#080d18;
          --sidebar:#0a0f1e;
          --card:#0f1628;
          --card-h:#131d33;
          --border:#1a2540;
          --accent:#4f7eff;
          --accent-s:rgba(79,126,255,.13);
          --accent-g:rgba(79,126,255,.22);
          --text:#dde6f5;
          --sub:#6b82a8;
          --muted:#2c3d5c;
          --danger:#f04f72;
          --sw:248px;
          --sw-c:64px;
        }
        body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;}

        .al{display:flex;min-height:100vh;background:var(--bg);position:relative;}

        /* ── SIDEBAR CONTAINER ── */
        .al-sb{
          width:var(--sw);flex-shrink:0;
          background:var(--sidebar);
          border-right:1px solid var(--border);
          display:flex;flex-direction:column;
          position:sticky;top:0;height:100vh;
          overflow:hidden;
          transition:width .22s ease, transform .22s ease;
          z-index:100;
        }

        /* LOGO */
        .al-logo{
          display:flex;align-items:center;gap:11px;
          padding:18px 16px 16px;
          border-bottom:1px solid var(--border);
          flex-shrink:0;min-height:64px;
        }
        .al-logo-mark{
          width:36px;height:36px;flex-shrink:0;
          border-radius:10px;
          background:linear-gradient(135deg,#4f7eff 0%,#7c4fff 100%);
          display:flex;align-items:center;justify-content:center;
          box-shadow:0 0 18px var(--accent-g);
          position:relative;overflow:hidden;
        }
        .al-logo-mark svg{position:relative;z-index:1;}
        .al-logo-text{overflow:hidden;}
        .al-logo-name{
          font-size:15px;font-weight:800;letter-spacing:-.3px;
          background:linear-gradient(90deg,#dde6f5 60%,#4f7eff);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
          white-space:nowrap;
        }
        .al-logo-tag{font-size:10px;color:var(--muted);white-space:nowrap;letter-spacing:.06em;margin-top:1px;}

        /* NAVIGATION SCROLL AREA */
        .al-nav{
          flex:1;
          padding:12px 8px;
          display:flex;
          flex-direction:column;
          gap:1px;
          overflow-y:auto;
        }
        
        .al-nl{font-size:9.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;
          color:var(--muted);padding:8px 8px 4px;white-space:nowrap;}

        .al-link{
          display:flex;align-items:center;gap:10px;
          padding:9px 10px;border-radius:9px;
          color:var(--sub);font-size:13px;font-weight:500;
          text-decoration:none;transition:background .14s,color .14s;
          white-space:nowrap;position:relative;
        }
        .al-link:hover{background:var(--card-h);color:var(--text);}
        .al-link.on{background:var(--accent-s);color:var(--accent);}
        .al-link.on::before{
          content:'';position:absolute;left:0;top:22%;bottom:22%;
          width:3px;background:var(--accent);border-radius:0 3px 3px 0;
        }
        .al-link-icon{flex-shrink:0;display:flex;}

        .al-drop-hd{
          display:flex;align-items:center;justify-content:space-between;
          padding:9px 10px;border-radius:9px;
          color:var(--sub);font-size:13px;font-weight:500;
          cursor:pointer;transition:background .14s,color .14s;
        }
        .al-drop-hd:hover{background:var(--card-h);color:var(--text);}
        .al-drop-l{display:flex;align-items:center;gap:10px;}

        .al-subs{padding-left:14px;display:flex;flex-direction:column;gap:1px;margin-top:1px;}
        .al-subs .al-link{font-size:12.5px;padding:7px 10px;}
        .al-dot{width:5px;height:5px;border-radius:50%;background:var(--muted);flex-shrink:0;}
        .al-link.on .al-dot{background:var(--accent);}

        /* DESKTOP ONLY FOOTER styling */
        .al-foot{
          padding:12px 8px;
          border-top:1px solid var(--border);
          background:var(--sidebar);
          flex-shrink:0;
        }
        .al-out{
          display:flex;align-items:center;gap:10px;
          padding:9px 10px;border-radius:9px;
          color:var(--sub);font-size:13px;font-weight:500;
          text-decoration:none;white-space:nowrap;
          transition:background .14s,color .14s;cursor:pointer;
        }
        .al-out:hover{background:rgba(240,79,114,.1);color:var(--danger);}

        /* MOBILE FIXED LINKS BUTTON */
        .al-mobile-exit-wrapper {
          display: none;
        }

        /* ── MAIN LAYOUT VIEW ── */
        .al-main{flex:1;display:flex;flex-direction:column;min-width:0;}
        .al-hdr{
          position:sticky;top:0;z-index:20;
          display:flex;align-items:center;justify-content:space-between;
          padding:0 26px;height:73px;
          background:rgba(10,15,30,.88);
          backdrop-filter:blur(14px);
          border-bottom:1px solid var(--border);
        }
        .al-hdr-l{display:flex;align-items:center;gap:12px;}
        .al-toggle{
          width:34px;height:34px;border-radius:8px;
          border:1px solid var(--border);background:var(--card);
          color:var(--sub);cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          transition:background .14s,color .14s;
        }
        .al-toggle:hover{background:var(--card-h);color:var(--text);}
        .al-crumb{font-size:12.5px;color:var(--muted);}
        .al-crumb span{color:var(--sub);}

        .al-hdr-r{display:flex;align-items:center;gap:10px;}
        .al-icon-btn{
          width:36px;height:36px;border-radius:9px;
          border:1px solid var(--border);background:var(--card);
          color:var(--sub);cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          position:relative;transition:background .14s,color .14s;
        }
        .al-icon-btn:hover{background:var(--card-h);color:var(--text);}
        .al-ndot{
          position:absolute;top:7px;right:7px;
          width:7px;height:7px;border-radius:50%;
          background:var(--accent);border:2px solid var(--sidebar);
        }
        .al-avatar{
          width:34px;height:34px;border-radius:9px;cursor:pointer;
          background:linear-gradient(135deg,var(--accent),#7c4fff);
          display:flex;align-items:center;justify-content:center;
          font-size:13px;font-weight:700;color:#fff;
          box-shadow:0 0 12px var(--accent-g);
        }
        .al-body{flex:1;padding:28px;overflow-y:auto;}

        .al-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(4, 6, 12, 0.7);
          backdrop-filter: blur(4px);
          z-index: 90;
        }

        /* ── DESKTOP MINIFIED WIDTHS ── */
        @media (min-width: 769px) {
          .al-sb.col { width: var(--sw-c); }
          .al-sb.col .al-logo-text,
          .al-sb.col .al-nl,
          .al-sb.col .al-link span:not(.al-link-icon),
          .al-sb.col .al-drop-hd span,
          .al-sb.col .al-drop-hd svg:last-child,
          .al-sb.col .al-subs,
          .al-sb.col .al-out span {
            display: none !important;
          }
        }

        /* ── MOBILE MEDIA BREAKPOINTS ── */
        @media (max-width: 768px) {
          .al-sb {
            position: fixed;
            left: 0; top: 0; bottom: 0;
            width: var(--sw) !important;
            transform: translateX(-100%);
          }
          .al-sb.mobile-open {
            transform: translateX(0);
          }
          
          /* Hide bottom absolute layout completely on mobile viewport */
          .al-sb .al-foot {
            display: none !important;
          }

          /* Show alternative top fixed layout wrapper item on mobile menu */
          .al-mobile-exit-wrapper {
            display: block;
            border-bottom: 1px solid var(--border);
            padding-bottom: 8px;
            margin-bottom: 4px;
          }
          
          .al-sb.mobile-open .al-logo-text,
          .al-sb.mobile-open .al-nl,
          .al-sb.mobile-open .al-link span,
          .al-sb.mobile-open .al-drop-hd span,
          .al-sb.mobile-open .al-out span {
            display: inline-block !important;
          }
          
          .al-overlay.show { display: block; }
          .al-hdr { padding: 0 16px; }
          .al-body { padding: 16px; }
          .al-crumb { display: none; }
        }
      `}</style>

      <div className="al">
        <div 
          className={`al-overlay ${isSidebarOpen ? 'show' : ''}`} 
          onClick={() => setIsSidebarOpen(false)} 
        />

        {/* SIDEBAR */}
        <aside className={`al-sb ${isSidebarOpen ? 'mobile-open' : 'col'}`}>
          <div className="al-logo">
            <div className="al-logo-mark">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 14 L10 4 L17 14 Z" fill="white" fillOpacity=".9"/>
                <rect x="7" y="14" width="6" height="3" rx="1" fill="white" fillOpacity=".6"/>
              </svg>
            </div>
            <div className="al-logo-text">
              <div className="al-logo-name">LuxeLiving</div>
              <div className="al-logo-tag">ADMIN CONSOLE</div>
            </div>
          </div>

          <nav className="al-nav">
            {/* FIXED ON MOBILE: Directly below logo, easily reachable */}
            <div className="al-mobile-exit-wrapper">
              <a href="/" className="al-out">
                <span className="al-link-icon"><LogOut size={16} style={{ color: 'var(--danger)' }}/></span>
                <span style={{ color: 'var(--danger)' }}>Exit to Website</span>
              </a>
            </div>

            <div className="al-nl">Overview</div>
            <Link to="/admin" className={`al-link ${isActive('/admin') ? 'on' : ''}`}>
              <span className="al-link-icon"><LayoutDashboard size={16} /></span>
              <span>Dashboard</span>
            </Link>

            <div className="al-nl" style={{marginTop:8}}>Content</div>
            <div className="al-drop-hd" onClick={() => setIsManageOpen(v => !v)}>
              <div className="al-drop-l">
                <span className="al-link-icon"><Package size={16} /></span>
                <span>Manage Store</span>
              </div>
              {isManageOpen ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
            </div>
            
            {isManageOpen && (
              <div className="al-subs">
                {subNav.map((s, i) => (
                  <Link key={i} to={s.path} className={`al-link ${isActive(s.path) ? 'on' : ''}`}>
                    <span className="al-dot"/>
                    <span>{s.name}</span>
                  </Link>
                ))}
              </div>
            )}

            <div className="al-nl" style={{marginTop:12}}>Administration</div>
            <Link to="/admin/users" className={`al-link ${isActive('/admin/users') ? 'on' : ''}`}>
              <span className="al-link-icon"><Users size={16} /></span>
              <span>Manage Users</span>
            </Link>

            <div className="al-nl" style={{marginTop:12}}>Sales</div>
            <Link to="/admin/orders" className={`al-link ${isActive('/admin/orders') ? 'on' : ''}`}>
              <span className="al-link-icon"><ShoppingCart size={16} /></span>
              <span>Manage Orders</span>
            </Link>
          </nav>

          {/* DESKTOP FOOTER */}
          <div className="al-foot">
            <a href="/" className="al-out">
              <span className="al-link-icon"><LogOut size={16}/></span>
              <span>Exit to Website</span>
            </a>
          </div>
        </aside>

        {/* MAIN ROUTE CONTENT CONTAINER */}
        <div className="al-main">
          <header className="al-hdr">
            <div className="al-hdr-l">
              <button className="al-toggle" onClick={() => setIsSidebarOpen(prev => !prev)}>
                {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
              <div className="al-crumb" style={{ marginLeft: 12 }}>Admin <span>/ Dashboard</span></div>
            </div>
            <div className="al-hdr-r">
              <button className="al-icon-btn">
                <Bell size={15}/>
                <span className="al-ndot"/>
              </button>
              <button className="al-icon-btn"><Settings size={15}/></button>
              <div className="al-avatar">A</div>
            </div>
          </header>
          <main className="al-body">
            <Outlet/>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;

import React, { useState, useEffect } from 'react';
import { Users, Trash2, Shield, Mail } from 'lucide-react';
import { API } from '../../api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

    const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    const shortId = user._id ? user._id.substring(user._id.length - 6).toLowerCase() : '';
    
    return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        shortId.includes(query)
    );
    });


  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(API.users, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setUsers(data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API.users}/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          alert(data.message);
          fetchUsers();
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  return (
    <div className="ad-root">
      
      
      {/* ── HEADER SECTION ── */}
      <div style={{ marginBottom: '28px' }}>
        <h2 className="ad-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Users size={22} color="#4f7eff" /> User Management
        </h2>
        <div className="ad-page-sub">Review and manage registered administrative and client console profiles.</div>
      </div>

      {/* ── 🟢 SEARCH BAR ADDED ── */}
        <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
        <input 
            type="text"
            placeholder="Search by name, email or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: '8px',
            background: '#0f1628',
            border: '1px solid #1a2540',
            color: '#dde6f5',
            fontSize: '13.5px',
            outline: 'none',
            transition: 'border-color 0.15s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4f7eff'}
            onBlur={(e) => e.target.style.borderColor = '#1a2540'}
        />
        </div>


      {/* ── TABLE CONTAINER ── */}
      <div style={{ background: '#131929', border: '1px solid #1e2d47', borderRadius: '14px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlignment: 'center', color: '#7a8fae' }}>Loading records...</div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: '40px', textAlignment: 'center', color: '#7a8fae' }}>No user data profiles found.</div>
        ) : (
         <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
                <tr style={{ background: '#0a0f1e', borderBottom: '1px solid #1a2540', color: '#6b82a8' }}>
                {/* ── 🟢 USER ID HEADER ADDED ── */}
                <th style={{ padding: '14px', width: '110px' }}>User ID</th>
                <th style={{ padding: '14px' }}>Name</th>
                <th style={{ padding: '14px' }}>Email</th>
                <th style={{ padding: '14px' }}>Role</th>
                <th style={{ padding: '14px', width: '80px', textAlign: 'center' }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredUsers.map((user) => (
                <tr key={user._id} style={{ borderBottom: '1px solid #1a2540' }}>
                    
                    {/* ── 🟢 USER ID DATA CELL ADDED ── */}
                    <td style={{ padding: '14px', fontFamily: 'monospace', color: '#4f7eff', fontWeight: '600' }}>
                    #{user._id ? user._id.substring(user._id.length - 6).toUpperCase() : 'N/A'}
                    </td>

                    <td style={{ padding: '14px', fontWeight: '500', color: '#dde6f5' }}>{user.name}</td>
                    <td style={{ padding: '14px', color: '#6b82a8' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={14} opacity={0.5}/>{user.email}
                    </span>
                    </td>
                    <td style={{ padding: '14px' }}>
                    <span style={{ 
                        padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
                        background: user.role === 'admin' ? 'rgba(245,158,11,0.12)' : 'rgba(79,126,255,0.12)',
                        color: user.role === 'admin' ? '#c9a84c' : '#4f7eff',
                        display: 'inline-flex', alignItems: 'center', gap: '4px'
                    }}>
                        <Shield size={11}/> {user.role || 'user'}
                    </span>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                    <button 
                        onClick={() => handleDelete(user._id)}
                        disabled={user.role === 'admin'}
                        style={{ 
                        background: 'none', border: 'none', color: user.role === 'admin' ? '#1a2440' : '#f04f72', 
                        cursor: user.role === 'admin' ? 'not-allowed' : 'pointer'
                        }}
                    >
                        <Trash2 size={16} />
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>

        )}
      </div>
    </div>
  );
};

export default ManageUsers;

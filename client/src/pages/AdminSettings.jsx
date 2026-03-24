// import { useState } from 'react';

// export default function AdminSettings() {
//   const [siteName, setSiteName] = useState("SkillSphere");
//   const [maintenanceMode, setMaintenanceMode] = useState(false);
//   const [emailAlerts, setEmailAlerts] = useState(true);

//   return (
//     <div className="admin-page-layout">
//         <div className="admin-container">
//             <h1>Platform Settings</h1>
//             <p className="subtitle">Configure global platform preferences.</p>

//             {/* GENERAL SETTINGS */}
//             <div className="settings-section">
//                 <h3>General Configuration</h3>
//                 <div className="setting-row">
//                     <div className="setting-info">
//                         <label>Platform Name</label>
//                         <p>The visible name of the application.</p>
//                     </div>
//                     <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="input-field"/>
//                 </div>
                
//                 <div className="setting-row">
//                     <div className="setting-info">
//                         <label>Maintenance Mode</label>
//                         <p>Disable access for non-admin users.</p>
//                     </div>
//                     <label className="switch">
//                         <input type="checkbox" checked={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} />
//                         <span className="slider round"></span>
//                     </label>
//                 </div>
//             </div>

//             {/* NOTIFICATION SETTINGS */}
//             <div className="settings-section">
//                 <h3>Notifications</h3>
//                 <div className="setting-row">
//                     <div className="setting-info">
//                         <label>Email Alerts</label>
//                         <p>Receive email summaries of daily activity.</p>
//                     </div>
//                     <label className="switch">
//                         <input type="checkbox" checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
//                         <span className="slider round"></span>
//                     </label>
//                 </div>
//             </div>

//             <button className="save-btn">Save Changes</button>
//         </div>

//         <style>{`
//             .admin-page-layout { padding: 40px; background: #f8fafc; min-height: 100vh; display: flex; justify-content: center; }
//             .admin-container { width: 100%; max-width: 700px; }
//             h1 { font-size: 2rem; color: #1e293b; margin-bottom: 5px; }
//             .subtitle { color: #64748b; margin-bottom: 30px; }

//             .settings-section { background: white; border-radius: 12px; border: 1px solid #e2e8f0; padding: 25px; margin-bottom: 25px; }
//             .settings-section h3 { margin: 0 0 20px 0; color: #0f172a; font-size: 1.1rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }
            
//             .setting-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
//             .setting-info label { display: block; font-weight: 600; color: #334155; margin-bottom: 4px; }
//             .setting-info p { color: #94a3b8; font-size: 0.85rem; margin: 0; }
            
//             .input-field { padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; width: 250px; font-size: 0.9rem; }
            
//             .save-btn { background: #4f46e5; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; float: right; transition: 0.2s; }
//             .save-btn:hover { background: #4338ca; }

//             /* Toggle Switch */
//             .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
//             .switch input { opacity: 0; width: 0; height: 0; }
//             .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 34px; }
//             .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
//             input:checked + .slider { background-color: #4f46e5; }
//             input:checked + .slider:before { transform: translateX(20px); }
//         `}</style>
//     </div>
//   );
// }

import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

// --- FIXED API URL DETECTION ---
export const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://skill-0bu7.onrender.com/api'; // Your ACTUAL Render Backend ? 'http://localhost:5000' : `http://${window.location.hostname}:5000`;

const Icons = {
  Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Sessions: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><rect x="3" y="4" width="4" height="4" rx="1"/><rect x="3" y="10" width="4" height="4" rx="1"/><rect x="3" y="16" width="4" height="4" rx="1"/></svg>,
  Star: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Save: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  Globe: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Shield: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
};

export default function AdminSettings() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  const [siteName, setSiteName] = useState("SkillSphere");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [allowRegistrations, setAllowRegistrations] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    // Fetch settings from API
    axios.get(`${BASE_URL}/api/admin/settings`)
      .then(res => {
        if (res.data) {
          setSiteName(res.data.siteName || "SkillSphere");
          setMaintenanceMode(res.data.maintenanceMode || false);
          setEmailAlerts(res.data.emailAlerts !== false);
          setAllowRegistrations(res.data.allowRegistrations !== false);
          setTwoFactorAuth(res.data.twoFactorAuth || false);
        }
      })
      .catch(err => console.error("Failed to load settings:", err));
  }, [user, navigate]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        siteName,
        maintenanceMode,
        emailAlerts,
        allowRegistrations,
        twoFactorAuth
      };
      
      await axios.put(`${BASE_URL}/api/admin/settings`, payload);
      toast.success("Settings saved successfully!");
    } catch (err) {
      console.error("Failed to save settings:", err);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getAvatarUrl = (u) => {
    if (!u) return "";
    if (u.avatar && u.avatar.startsWith('http')) return u.avatar;
    if (u.avatar) return `${BASE_URL}${u.avatar}`;
    return `https://api.dicebear.com/7.x/initials/svg?seed=${u.name || 'Admin'}`;
  };

  return (
    <div className="admin-settings">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">S</div>
            <span className="logo-text">SkillSphere</span>
          </div>
        </div>
        
        <div className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Main</div>
            <Link to="/admin" className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}>
              <Icons.Dashboard />
              <span>Dashboard</span>
            </Link>
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">Management</div>
            <Link to="/admin/users" className={`nav-item ${location.pathname === '/admin/users' ? 'active' : ''}`}>
              <Icons.Users />
              <span>Users</span>
            </Link>
            <Link to="/admin/sessions" className={`nav-item ${location.pathname === '/admin/sessions' ? 'active' : ''}`}>
              <Icons.Sessions />
              <span>Sessions</span>
            </Link>
            <Link to="/admin/reviews" className={`nav-item ${location.pathname === '/admin/reviews' ? 'active' : ''}`}>
              <Icons.Star />
              <span>Reviews</span>
            </Link>
            <Link to="/admin/settings" className={`nav-item ${location.pathname === '/admin/settings' ? 'active' : ''}`}>
              <Icons.Settings />
              <span>Settings</span>
            </Link>
          </div>
        </div>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-item logout">
            <Icons.Logout />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <h1 className="page-title">Settings</h1>
            <div className="page-breadcrumb">
              <Link to="/admin">Home</Link>
              <span>/</span>
              <span className="active">Settings</span>
            </div>
          </div>
          
          <div className="header-right">
            <div className="profile-wrapper">
              <div className="profile-trigger">
                <img src={getAvatarUrl(user)} alt={user?.name} />
                <div className="profile-info">
                  <span className="profile-name">{user?.name}</span>
                  <span className="profile-role">Admin</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="content">
          {/* Page Header */}
          <div className="page-header">
            <div>
              <h2>Platform Settings</h2>
              <p>Configure your platform preferences and manage system settings</p>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="settings-grid">
            {/* General Settings */}
            <div className="settings-card">
              <div className="card-header">
                <div className="card-icon general">
                  <Icons.Globe />
                </div>
                <div>
                  <h3>General Configuration</h3>
                  <p>Basic platform settings</p>
                </div>
              </div>
              
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Platform Name</label>
                    <span className="setting-desc">The visible name of your application</span>
                  </div>
                  <input 
                    type="text" 
                    value={siteName} 
                    onChange={(e) => setSiteName(e.target.value)} 
                    className="setting-input"
                  />
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Allow Registrations</label>
                    <span className="setting-desc">Enable new user signups</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={allowRegistrations} 
                      onChange={() => setAllowRegistrations(!allowRegistrations)} 
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Maintenance Mode</label>
                    <span className="setting-desc">Disable access for non-admin users</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={maintenanceMode} 
                      onChange={() => setMaintenanceMode(!maintenanceMode)} 
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="settings-card">
              <div className="card-header">
                <div className="card-icon notifications">
                  <Icons.Bell />
                </div>
                <div>
                  <h3>Notifications</h3>
                  <p>Configure email and system alerts</p>
                </div>
              </div>
              
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Email Alerts</label>
                    <span className="setting-desc">Receive email summaries of daily activity</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={emailAlerts} 
                      onChange={() => setEmailAlerts(!emailAlerts)} 
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="settings-card">
              <div className="card-header">
                <div className="card-icon security">
                  <Icons.Shield />
                </div>
                <div>
                  <h3>Security</h3>
                  <p>Platform security preferences</p>
                </div>
              </div>
              
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Two-Factor Authentication</label>
                    <span className="setting-desc">Require 2FA for admin accounts</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={twoFactorAuth} 
                      onChange={() => setTwoFactorAuth(!twoFactorAuth)} 
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="save-section">
            <button 
              className="save-btn" 
              onClick={handleSave} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Icons.Save />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .admin-settings {
          display: flex;
          min-height: 100vh;
          background: #f5f7fb;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* SIDEBAR */
        .sidebar {
          width: 280px;
          background: #1a1f2e;
          color: #8b92a8;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 100;
        }

        .sidebar-header {
          padding: 24px 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          font-weight: 700;
          color: white;
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          letter-spacing: -0.5px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 24px 16px;
          overflow-y: auto;
        }

        .nav-section {
          margin-bottom: 28px;
        }

        .nav-section-title {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #5a617a;
          padding: 0 12px;
          margin-bottom: 12px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          margin: 4px 0;
          color: #8b92a8;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 10px;
          transition: all 0.2s;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .nav-item.active {
          background: rgba(99, 102, 241, 0.2);
          color: #a5b4fc;
          border-left: 3px solid #6366f1;
          border-radius: 10px 8px 8px 10px;
        }

        .sidebar-footer {
          padding: 20px 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .logout {
          color: #f87171;
        }

        .logout:hover {
          background: rgba(248, 113, 113, 0.1);
          color: #f87171;
        }

        /* MAIN CONTENT */
        .main-content {
          margin-left: 280px;
          flex: 1;
          min-height: 100vh;
        }

        /* HEADER */
        .header {
          background: white;
          padding: 16px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-left {
          display: flex;
          flex-direction: column;
        }

        .page-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .page-breadcrumb {
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: 4px;
        }

        .page-breadcrumb a {
          color: #6b7280;
          text-decoration: none;
        }

        .page-breadcrumb a:hover {
          color: #6366f1;
        }

        .page-breadcrumb .active {
          color: #6366f1;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .profile-wrapper {
          position: relative;
        }

        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px 8px;
          border-radius: 10px;
          cursor: pointer;
        }

        .profile-trigger:hover {
          background: #f9fafb;
        }

        .profile-trigger img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
        }

        .profile-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: #111827;
        }

        .profile-role {
          font-size: 0.7rem;
          color: #6b7280;
        }

        /* CONTENT */
        .content {
          padding: 32px;
          max-width: 1000px;
        }

        .page-header {
          margin-bottom: 32px;
        }

        .page-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }

        .page-header p {
          color: #6b7280;
          font-size: 0.95rem;
        }

        /* SETTINGS GRID */
        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .settings-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          transition: all 0.2s;
        }

        .settings-card:hover {
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
        }

        .card-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 14px;
          background: #fafbfc;
        }

        .card-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-icon.general {
          background: #eef2ff;
          color: #6366f1;
        }

        .card-icon.notifications {
          background: #dcfce7;
          color: #10b981;
        }

        .card-icon.security {
          background: #fee2e2;
          color: #ef4444;
        }

        .card-header h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 2px;
        }

        .card-header p {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .settings-list {
          padding: 8px 0;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid #f3f4f6;
        }

        .setting-item:last-child {
          border-bottom: none;
        }

        .setting-info label {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
        }

        .setting-desc {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .setting-input {
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.9rem;
          width: 220px;
          transition: all 0.2s;
        }

        .setting-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        /* Toggle Switch */
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e1;
          transition: .3s;
          border-radius: 24px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #6366f1;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }

        /* SAVE SECTION */
        .save-section {
          display: flex;
          justify-content: flex-end;
          padding-top: 8px;
        }

        .save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .save-btn:hover:not(:disabled) {
          background: #4f46e5;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner-small {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .main-content {
            margin-left: 0;
          }
          .content {
            padding: 20px;
          }
          .header {
            padding: 12px 20px;
          }
          .profile-info {
            display: none;
          }
          .setting-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .setting-input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
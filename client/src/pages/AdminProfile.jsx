// import { useState, useContext, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom'; // 🚨 Added useNavigate
// import { toast } from 'react-toastify'; 

// // --- FIXED API URL DETECTION ---

// export default function AdminProfile() {
//   const { user, updateUser } = useContext(AuthContext);
//   const navigate = useNavigate(); // 🚨 Hook for navigation
//   const fileInputRef = useRef(null);

//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     bio: ''
//   });

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || '',
//         bio: user.bio || ''
//       });
//     }
//   }, [user]);

//   const handleAvatarChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const uploadData = new FormData();
//     uploadData.append('userId', user.id || user._id);
//     uploadData.append('avatar', file);
//     uploadData.append('name', formData.name);
//     uploadData.append('bio', formData.bio);

//     try {
//         const res = await axios.put(`${BASE_URL}/api/users/profile`, uploadData, {
//             headers: { 'Content-Type': 'multipart/form-data' }
//         });
//         updateUser(res.data);
//         toast.success("Profile photo updated!");
//     } catch (err) {
//         console.error(err);
//         toast.error("Failed to update photo.");
//     }
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//         const updateData = new FormData();
//         updateData.append('userId', user.id || user._id);
//         updateData.append('name', formData.name);
//         updateData.append('bio', formData.bio);

//         const res = await axios.put(`${BASE_URL}/api/users/profile`, updateData, {
//             headers: { 'Content-Type': 'multipart/form-data' }
//         });
        
//         updateUser(res.data);
//         setIsEditing(false);
//         toast.success("Profile details updated.");
//     } catch (err) {
//         console.error(err);
//         toast.error("Failed to save changes.");
//     } finally {
//         setLoading(false);
//     }
//   };

//   const getAvatarUrl = (u) => {
//     if (!u) return "";
//     if (u.avatar && u.avatar.startsWith('http')) return u.avatar;
//     if (u.avatar) return `${BASE_URL}${u.avatar}`;
//     return `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`;
//   };

//   return (
//     <div className="admin-page-layout">
//         <div className="admin-container">
            
//             {/* 🚨 BACK BUTTON */}
//             <button className="btn-back" onClick={() => navigate('/admin')}>
//                 ← Back to Dashboard
//             </button>

//             {/* Header Section */}
//             <div className="page-header">
//                 <div>
//                     <h1>Admin Profile</h1>
//                     <p className="subtitle">Manage your account information and appearance.</p>
//                 </div>
//                 {!isEditing && (
//                     <button className="btn-edit" onClick={() => setIsEditing(true)}>
//                         ✎ Edit Details
//                     </button>
//                 )}
//             </div>

//             <div className="profile-card">
//                 {/* Banner */}
//                 <div className="card-banner"></div>
                
//                 <div className="card-content">
//                     {/* Avatar Section */}
//                     <div className="avatar-wrapper">
//                         <div className="avatar-frame">
//                             <img src={getAvatarUrl(user)} alt="Admin" />
//                             <div className="avatar-overlay" onClick={() => fileInputRef.current.click()}>
//                                 📷
//                             </div>
//                         </div>
//                         <input 
//                             type="file" 
//                             ref={fileInputRef} 
//                             style={{display:'none'}} 
//                             onChange={handleAvatarChange} 
//                             accept="image/*"
//                         />
//                     </div>

//                     {/* Form Section */}
//                     <div className="form-grid">
//                         <div className="form-group">
//                             <label>Full Name</label>
//                             <input 
//                                 type="text" 
//                                 value={formData.name} 
//                                 disabled={!isEditing}
//                                 onChange={(e) => setFormData({...formData, name: e.target.value})}
//                                 className={isEditing ? 'input-edit' : 'input-read'}
//                             />
//                         </div>

//                         <div className="form-group">
//                             <label>Email Address</label>
//                             <input 
//                                 type="email" 
//                                 value={user?.email} 
//                                 disabled 
//                                 className="input-locked"
//                                 title="Email cannot be changed"
//                             />
//                             <span className="lock-icon">🔒</span>
//                         </div>

//                         <div className="form-group full-width">
//                             <label>Bio / Role Description</label>
//                             <textarea 
//                                 rows="3"
//                                 value={formData.bio} 
//                                 disabled={!isEditing}
//                                 onChange={(e) => setFormData({...formData, bio: e.target.value})}
//                                 className={isEditing ? 'input-edit' : 'input-read'}
//                                 placeholder="Add a short bio..."
//                             />
//                         </div>

//                         <div className="form-group">
//                             <label>Role</label>
//                             <div className="role-display">
//                                 <span className="role-badge">SUPER ADMIN</span>
//                             </div>
//                         </div>

//                         {/* 🚨 USER ID REMOVED HERE */}
//                     </div>

//                     {/* Action Buttons */}
//                     {isEditing && (
//                         <div className="action-row">
//                             <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
//                             <button className="btn-save" onClick={handleSave} disabled={loading}>
//                                 {loading ? 'Saving...' : 'Save Changes'}
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>

//         <style>{`
//             :root {
//                 --primary: #4f46e5;
//                 --text-main: #1e293b;
//                 --text-light: #64748b;
//                 --bg-page: #f8fafc;
//                 --border: #e2e8f0;
//             }

//             .admin-page-layout { padding: 40px; background: var(--bg-page); min-height: 100vh; display: flex; justify-content: center; font-family: 'Inter', sans-serif; }
//             .admin-container { width: 100%; max-width: 800px; }
            
//             /* Back Button Style */
//             .btn-back { background: none; border: none; color: var(--text-light); cursor: pointer; font-size: 0.9rem; margin-bottom: 20px; display: flex; align-items: center; gap: 6px; font-weight: 500; transition: color 0.2s; }
//             .btn-back:hover { color: var(--primary); }

//             .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
//             h1 { font-size: 2rem; color: var(--text-main); margin: 0 0 5px 0; font-weight: 800; }
//             .subtitle { color: var(--text-light); margin: 0; font-size: 0.95rem; }
            
//             .btn-edit { background: white; border: 1px solid var(--border); padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; color: var(--text-main); transition: 0.2s; }
//             .btn-edit:hover { background: #f1f5f9; border-color: #cbd5e1; }

//             /* CARD STYLES */
//             .profile-card { background: white; border-radius: 20px; border: 1px solid var(--border); overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
//             .card-banner { height: 120px; background: linear-gradient(135deg, #6366f1, #a855f7); width: 100%; }
//             .card-content { padding: 0 40px 40px; position: relative; }

//             /* AVATAR */
//             .avatar-wrapper { margin-top: -60px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
//             .avatar-frame { width: 120px; height: 120px; border-radius: 50%; border: 5px solid white; position: relative; box-shadow: 0 4px 6px rgba(0,0,0,0.1); cursor: pointer; background: white; }
//             .avatar-frame img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
//             .avatar-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; opacity: 0; transition: 0.2s; color: white; }
//             .avatar-frame:hover .avatar-overlay { opacity: 1; }

//             /* FORM GRID */
//             .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
//             .form-group { display: flex; flex-direction: column; gap: 8px; position: relative; }
//             .full-width { grid-column: span 2; }
            
//             label { font-size: 0.85rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.05em; }
            
//             input, textarea { padding: 12px 16px; border-radius: 10px; font-size: 0.95rem; font-family: inherit; width: 100%; box-sizing: border-box; transition: 0.2s; }
            
//             .input-read { border: 1px solid transparent; background: transparent; padding-left: 0; color: var(--text-main); font-weight: 600; font-size: 1rem; }
//             .input-edit { border: 1px solid var(--border); background: white; color: var(--text-main); }
//             .input-edit:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
            
//             .input-locked { background: #f8fafc; border: 1px solid var(--border); color: #94a3b8; cursor: not-allowed; }
//             .lock-icon { position: absolute; right: 12px; top: 38px; font-size: 0.8rem; opacity: 0.5; }

//             .role-badge { background: #e0e7ff; color: #4338ca; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.05em; display: inline-block; }

//             /* ACTIONS */
//             .action-row { grid-column: span 2; display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; border-top: 1px solid var(--border); padding-top: 20px; }
//             .btn-cancel { background: white; border: 1px solid var(--border); padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; color: var(--text-light); }
//             .btn-save { background: var(--primary); border: none; padding: 10px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; color: white; transition: 0.2s; }
//             .btn-save:hover { background: #4338ca; }
//             .btn-save:disabled { opacity: 0.7; cursor: not-allowed; }

//             @media (max-width: 768px) {
//                 .form-grid { grid-template-columns: 1fr; }
//                 .full-width { grid-column: span 1; }
//                 .admin-page-layout { padding: 20px; }
//                 .card-content { padding: 0 20px 30px; }
//             }
//         `}</style>
//     </div>
//   );
// }

import { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify'; 

// --- FIXED API URL DETECTION ---
// --- FIXED API URL DETECTION ---
export const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://skill-0bu7.onrender.com/api'; // Your ACTUAL Render Backend

const Icons = {
  Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Sessions: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><rect x="3" y="4" width="4" height="4" rx="1"/><rect x="3" y="10" width="4" height="4" rx="1"/><rect x="3" y="16" width="4" height="4" rx="1"/></svg>,
  Star: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Analytics: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"/><path d="M7 10l3-3 3 3 4-4"/><path d="M17 4l4 4-4 4"/></svg>,
  ArrowLeft: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3l4 4-7 7-4 1 1-4 7-7z"/><path d="M14 7l-9 9-2 4 4-2 9-9"/></svg>,
  Camera: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

export default function AdminProfile() {
  const { user, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('userId', user.id || user._id);
    uploadData.append('avatar', file);
    uploadData.append('name', formData.name);
    uploadData.append('bio', formData.bio);

    try {
        const res = await axios.put(`${BASE_URL}/api/users/profile`, uploadData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        updateUser(res.data);
        toast.success("Profile photo updated!");
    } catch (err) {
        console.error(err);
        toast.error("Failed to update photo.");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
        const updateData = new FormData();
        updateData.append('userId', user.id || user._id);
        updateData.append('name', formData.name);
        updateData.append('bio', formData.bio);

        const res = await axios.put(`${BASE_URL}/api/users/profile`, updateData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        updateUser(res.data);
        setIsEditing(false);
        toast.success("Profile details updated.");
    } catch (err) {
        console.error(err);
        toast.error("Failed to save changes.");
    } finally {
        setLoading(false);
    }
  };

  const getAvatarUrl = (u) => {
    if (!u) return "";
    if (u.avatar && u.avatar.startsWith('http')) return u.avatar;
    if (u.avatar) return `${BASE_URL}${u.avatar}`;
    return `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-profile-page">
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
            <Link to="/admin" className="nav-item">
              <Icons.Dashboard />
              <span>Dashboard</span>
            </Link>
            <Link to="/admin/analytics" className="nav-item">
              <Icons.Analytics />
              <span>Analytics</span>
            </Link>
            <Link to="/admin/profile" className="nav-item active">
              <Icons.User />
              <span>Profile</span>
            </Link>
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">Management</div>
            <Link to="/admin/users" className="nav-item">
              <Icons.Users />
              <span>Users</span>
            </Link>
            <Link to="/admin/sessions" className="nav-item">
              <Icons.Sessions />
              <span>Sessions</span>
            </Link>
            <Link to="/admin/reviews" className="nav-item">
              <Icons.Star />
              <span>Reviews</span>
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
            <h1 className="page-title">Profile Settings</h1>
            <div className="page-breadcrumb">
              <Link to="/admin">Home</Link>
              <span>/</span>
              <span className="active">Profile</span>
            </div>
          </div>
          
          <div className="header-right">
            {!isEditing && (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <Icons.Edit />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </header>

        <div className="content">
          <div className="profile-card">
            {/* Banner */}
            <div className="profile-banner">
              <div className="banner-overlay"></div>
            </div>
            
            {/* Avatar Section */}
            <div className="avatar-section">
              <div className="avatar-container">
                <img src={getAvatarUrl(user)} alt={user?.name} className="avatar" />
                <button className="avatar-upload-btn" onClick={() => fileInputRef.current.click()}>
                  <Icons.Camera />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{display:'none'}} 
                  onChange={handleAvatarChange} 
                  accept="image/*"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="profile-info-section">
              <div className="info-grid">
                <div className="info-field full-width">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="form-input"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="info-value">
                      <span>{formData.name || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div className="info-field">
                  <label>Email Address</label>
                  <div className="info-value email-value">
                    <span>{user?.email}</span>
                    <span className="verified-badge">
                      <Icons.Check /> Verified
                    </span>
                  </div>
                </div>

                <div className="info-field">
                  <label>Role</label>
                  <div className="info-value">
                    <span className="role-badge">Administrator</span>
                  </div>
                </div>

                <div className="info-field full-width">
                  <label>Bio / About</label>
                  {isEditing ? (
                    <textarea 
                      rows="4"
                      value={formData.bio} 
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="form-textarea"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div className="info-value bio-value">
                      {formData.bio || 'No bio added yet. Click edit to add a description.'}
                    </div>
                  )}
                </div>

                <div className="info-field">
                  <label>Member Since</label>
                  <div className="info-value">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    }) : 'N/A'}
                  </div>
                </div>

                <div className="info-field">
                  <label>Last Active</label>
                  <div className="info-value">
                    {user?.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Today'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="action-buttons">
                  <button className="btn-cancel" onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      bio: user?.bio || ''
                    });
                  }}>
                    <Icons.X />
                    <span>Cancel</span>
                  </button>
                  <button className="btn-save" onClick={handleSave} disabled={loading}>
                    {loading ? 'Saving...' : (
                      <>
                        <Icons.Check />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="info-card">
            <h3>Account Security</h3>
            <p>Your account is protected with enterprise-grade security. Contact support for any security concerns.</p>
            <div className="security-badges">
              <div className="badge">
                <span className="badge-icon">🔒</span>
                <span>2FA Available</span>
              </div>
              <div className="badge">
                <span className="badge-icon">🛡️</span>
                <span>Encrypted Data</span>
              </div>
              <div className="badge">
                <span className="badge-icon">✓</span>
                <span>Verified Admin</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .admin-profile-page {
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
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
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

        .edit-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-btn:hover {
          background: #e5e7eb;
          border-color: #6366f1;
          color: #6366f1;
        }

        /* CONTENT */
        .content {
          padding: 32px;
          max-width: 1000px;
          margin: 0 auto;
        }

        /* PROFILE CARD */
        .profile-card {
          background: white;
          border-radius: 24px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .profile-banner {
          height: 150px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          position: relative;
        }

        .banner-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.1);
        }

        .avatar-section {
          display: flex;
          justify-content: center;
          margin-top: -60px;
          margin-bottom: 24px;
        }

        .avatar-container {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .avatar-upload-btn {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 32px;
          height: 32px;
          background: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: all 0.2s;
          color: #6366f1;
        }

        .avatar-upload-btn:hover {
          transform: scale(1.1);
          background: #f3f4f6;
        }

        .profile-info-section {
          padding: 0 32px 32px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .info-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .info-field.full-width {
          grid-column: span 2;
        }

        .info-field label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .info-value {
          font-size: 1rem;
          color: #111827;
          padding: 8px 0;
        }

        .email-value {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #dcfce7;
          color: #10b981;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .role-badge {
          background: #eef2ff;
          color: #6366f1;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-block;
        }

        .bio-value {
          line-height: 1.6;
          color: #6b7280;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-size: 0.95rem;
          font-family: inherit;
          transition: all 0.2s;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .btn-cancel {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          color: #6b7280;
        }

        .btn-cancel:hover {
          background: #f9fafb;
          border-color: #ef4444;
          color: #ef4444;
        }

        .btn-save {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          background: #6366f1;
          border: none;
          border-radius: 10px;
          font-weight: 500;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-save:hover:not(:disabled) {
          background: #4f46e5;
          transform: translateY(-1px);
        }

        .btn-save:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* INFO CARD */
        .info-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e5e7eb;
        }

        .info-card h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: #111827;
        }

        .info-card p {
          font-size: 0.85rem;
          color: #6b7280;
          margin-bottom: 16px;
        }

        .security-badges {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: #f3f4f6;
          border-radius: 30px;
          font-size: 0.8rem;
          color: #374151;
        }

        .badge-icon {
          font-size: 1rem;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .main-content {
            margin-left: 0;
          }
          .info-grid {
            grid-template-columns: 1fr;
          }
          .info-field.full-width {
            grid-column: span 1;
          }
          .content {
            padding: 20px;
          }
          .profile-info-section {
            padding: 0 20px 20px;
          }
          .header {
            padding: 12px 20px;
          }
          .edit-btn span {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
// import { useEffect, useState, useContext, useRef, useCallback } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';
// import { useSocket } from '../context/SocketContext';
// import { useNavigate, Link } from 'react-router-dom';
// import { toast } from 'react-toastify'; 

// const BASE_URL = window.location.hostname === 'localhost' 
//   ? 'http://localhost:5000' 
//   : `http://${window.location.hostname}:5000`;

// const Icons = {
//   Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
//   Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
//   Bag: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>,
//   Star: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
//   Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
//   Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
//   Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
//   ArrowRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>,
//   User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
//   Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
//   Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
//   Megaphone: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l18-5v12L3 13v-2z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>,
//   Send: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
//   Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
//   // 🚨 ADDED ALERT ICON
//   Alert: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
// };

// export default function AdminDashboard() {
//   const { user, logout, updateUser } = useContext(AuthContext);
//   const { socket } = useSocket() || {}; 
//   const navigate = useNavigate();
  
//   const [stats, setStats] = useState({ totalUsers: 0, totalSessions: 0, volume: 0 });
//   const [users, setUsers] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   // UI States
//   const [notifications, setNotifications] = useState([]);
//   const [showNotifDropdown, setShowNotifDropdown] = useState(false);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
  
//   // Modals
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [showSettingsModal, setShowSettingsModal] = useState(false);
//   const [showCommModal, setShowCommModal] = useState(false);
//   const [showBanModal, setShowBanModal] = useState(false); // 🚨 NEW
//   const [userToBan, setUserToBan] = useState(null);      // 🚨 NEW
  
//   // Profile Form
//   const [editName, setEditName] = useState('');
//   const [isUpdating, setIsUpdating] = useState(false);

//   // Settings Form
//   const [settings, setSettings] = useState({
//     siteName: 'SkillSphere',
//     maintenanceMode: false,
//     emailAlerts: true,
//     featuredSkills: ['React', 'Python', 'Design']
//   });
//   const [newSkill, setNewSkill] = useState('');
//   const [isSavingSettings, setIsSavingSettings] = useState(false);

//   // Communication Form
//   const [commData, setCommData] = useState({
//     type: 'announcement', 
//     target: 'all', 
//     subject: '',
//     message: ''
//   });
//   const [isSendingComm, setIsSendingComm] = useState(false);
  
//   const notifRef = useRef(null);
//   const profileRef = useRef(null);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     if (user && user.name) {
//         setEditName(user.name);
//     }
//   }, [user]);

//   // 1. DEFINE FETCH LOGIC OUTSIDE USEEFFECT SO WE CAN REUSE IT
//   const fetchAdminData = useCallback(async () => {
//     try {
//         const [statsRes, usersRes, reviewsRes] = await Promise.all([
//             axios.get(`${BASE_URL}/api/admin/stats`),
//             axios.get(`${BASE_URL}/api/admin/users`),
//             axios.get(`${BASE_URL}/api/admin/reviews`)
//         ]);
        
//         setStats(statsRes.data);
//         setUsers(usersRes.data);
//         setReviews(reviewsRes.data);
//         setLoading(false);
//     } catch (err) {
//         console.error("Fetch Error:", err);
//         setLoading(false);
//     }
//   }, []);

//   // 2. FETCH ON MOUNT
//   useEffect(() => {
//     if (user && user.role !== 'admin') {
//         navigate('/dashboard');
//         return;
//     }
//     fetchAdminData();
//   }, [user, navigate, fetchAdminData]);

//   // Fetch Settings
//   useEffect(() => {
//     if (showSettingsModal) {
//         axios.get(`${BASE_URL}/api/admin/settings`)
//             .then(res => { if(res.data) setSettings(res.data); })
//             .catch(err => console.error(err));
//     }
//   }, [showSettingsModal]);

//   // 3. LISTEN FOR SOCKET EVENTS (Real-Time Updates)
//   useEffect(() => {
//     if (!socket) return;

//     // Listen for admin notifications (comm)
//     const handleNotif = (data) => {
//         setNotifications(prev => [data, ...prev]);
//         const audio = new Audio('/notification.mp3'); 
//         audio.play().catch(() => {});
//         toast.info(data.text || "New Admin Notification");
//     };

//     // LISTEN FOR NEW USERS -> REFRESH TABLE
//     const handleNewUser = (userData) => {
//         toast.success(`🎉 New User Joined: ${userData.name}`);
//         fetchAdminData(); // Refresh the list without page reload
//     };

//     socket.on('receive_notification', handleNotif);
//     socket.on('new_user_registered', handleNewUser);

//     return () => {
//         socket.off('receive_notification', handleNotif);
//         socket.off('new_user_registered', handleNewUser);
//     };
//   }, [socket, fetchAdminData]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (notifRef.current && !notifRef.current.contains(event.target)) {
//         setShowNotifDropdown(false);
//       }
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setShowProfileMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // 🚨 1. INITIATE BAN ACTION (Open Modal)
//   const initiateBan = (user) => {
//     setUserToBan(user);
//     setShowBanModal(true);
//   };

//   // 🚨 2. CONFIRM BAN (Execute API)
//   const confirmBan = async () => {
//     if (!userToBan) return;
//     try {
//       const res = await axios.put(`${BASE_URL}/api/admin/ban/${userToBan._id}`);
//       setUsers(users.map(u => u._id === userToBan._id ? { ...u, isBanned: res.data.isBanned } : u));
//       toast.success(res.data.isBanned ? `User ${userToBan.name} Banned` : `User ${userToBan.name} Activated`);
//       setShowBanModal(false);
//       setUserToBan(null);
//     } catch (err) { 
//         toast.error("Failed to update status"); 
//     }
//   };

//   // --- PROFILE LOGIC ---
//   const handleProfileUpdate = async () => {
//     if (!editName.trim()) {
//         toast.error("Name cannot be empty");
//         return;
//     }
//     setIsUpdating(true);
//     try {
//         const payload = { userId: user.id || user._id, name: editName };
//         const res = await axios.put(`${BASE_URL}/api/users/profile`, payload);
//         if(res.data) {
//             updateUser({ ...user, name: editName });
//             toast.success("Profile updated successfully!");
//             setShowProfileModal(false);
//         }
//     } catch (err) {
//         toast.error("Failed to update profile.");
//     } finally {
//         setIsUpdating(false);
//     }
//   };

//   const handleAvatarChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setIsUpdating(true);
//     try {
//         const data = new FormData();
//         data.append('userId', user.id || user._id);
//         data.append('avatar', file);
//         data.append('name', editName); 
//         const res = await axios.put(`${BASE_URL}/api/users/profile`, data);
//         updateUser(res.data);
//         toast.success("Photo updated!");
//     } catch (err) {
//         toast.error("Failed to upload photo.");
//     } finally {
//         setIsUpdating(false);
//     }
//   };

//   // --- SETTINGS LOGIC ---
//   const handleSettingsSave = async () => {
//     setIsSavingSettings(true);
//     try {
//         const res = await axios.put(`${BASE_URL}/api/admin/settings`, settings);
//         setSettings(res.data);
//         toast.success("Platform settings saved!");
//         setShowSettingsModal(false);
//     } catch (err) { toast.error("Failed to save settings."); } finally { setIsSavingSettings(false); }
//   };

//   const addSkill = () => {
//     if(newSkill && !settings.featuredSkills.includes(newSkill)) {
//         setSettings({...settings, featuredSkills: [...settings.featuredSkills, newSkill]});
//         setNewSkill('');
//     }
//   };

//   const removeSkill = (skillToRemove) => {
//     setSettings({...settings, featuredSkills: settings.featuredSkills.filter(s => s !== skillToRemove)});
//   };

//   // --- COMMUNICATION LOGIC ---
//   const handleSendComm = async () => {
//     if(!commData.subject || !commData.message) return toast.error("Please fill all fields");
//     setIsSendingComm(true);
//     try {
//         await axios.post(`${BASE_URL}/api/admin/communicate`, commData);
//         toast.success(`Sent ${commData.type} successfully!`);
//         setShowCommModal(false);
//         setCommData({ type: 'announcement', target: 'all', subject: '', message: '' });
//     } catch(err) {
//         toast.error("Failed to send communication.");
//     } finally { setIsSendingComm(false); }
//   };

//   const formatNumber = (amount) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(amount);
//   const getAvatarUrl = (u) => {
//     if (!u) return "";
//     if (u.avatar && u.avatar.startsWith('http')) return u.avatar;
//     if (u.avatar) return `${BASE_URL}${u.avatar}`;
//     return `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`;
//   };
//   const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

//   return (
//     <div className="layout">
//       {/* SIDEBAR */}
//       <aside className="sidebar">
//         <div className="logo-area"><div className="logo-icon">S</div><span className="logo-text">SkillSphere</span></div>
//         <div className="nav-container">
//             <div className="nav-group">
//                 <span className="nav-label">OVERVIEW</span>
//                 <Link to="/admin" className="nav-item active"><Icons.Dashboard /> Dashboard</Link>
//                 {/* 🚨 REMOVED: Analytics Link */}
//             </div>
//             <div className="nav-group">
//                 <span className="nav-label">MANAGEMENT</span>
//                 <Link to="/admin/users" className="nav-item"><Icons.Users /> Users</Link>
//                 <Link to="/admin/sessions" className="nav-item"><Icons.Bag /> Sessions</Link>
//                 <Link to="/admin/reviews" className="nav-item"><Icons.Star /> Reviews <span className="badge">{reviews.length}</span></Link>
//             </div>
//             <div className="nav-group">
//                 <span className="nav-label">TOOLS</span>
//                 <button onClick={() => setShowCommModal(true)} className="nav-item">
//                     <Icons.Megaphone /> Communication
//                 </button>
//             </div>
//         </div>
//         <div className="sidebar-footer">
//             <button onClick={logout} className="nav-item logout"><Icons.Logout /> Logout</button>
//         </div>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className="main-content">
//         <header className="header">
//             <div className="search-bar"><Icons.Search /><input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/></div>
//             <div className="header-actions">
//                 <div className="notif-wrapper" ref={notifRef}>
//                     <button className="icon-btn" onClick={() => setShowNotifDropdown(!showNotifDropdown)}>
//                         <Icons.Bell />
//                         {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
//                     </button>
//                     {showNotifDropdown && (
//                         <div className="notif-dropdown">
//                             <div className="notif-header">Notifications</div>
//                             <div className="notif-list">{notifications.length === 0 ? <div className="notif-empty">No new notifications</div> : notifications.map((n, i) => (<div key={i} className="notif-item"><div className="notif-dot"></div><span>{n.text}</span></div>))}</div>
//                         </div>
//                     )}
//                 </div>
//                 <div className="admin-profile-wrapper" ref={profileRef}>
//                     <div className="admin-profile" onClick={() => setShowProfileMenu(!showProfileMenu)}>
//                         <img src={getAvatarUrl(user)} alt="Admin" />
//                         <div className="profile-text"><span className="name">{user?.name}</span><span className="role">{user?.role?.toUpperCase() || 'ADMIN'}</span></div>
//                     </div>
//                     {showProfileMenu && (
//                         <div className="profile-dropdown">
//                             <button className="profile-item" onClick={() => { setShowProfileModal(true); setShowProfileMenu(false); }}><Icons.User /> Admin Profile</button>
//                             <button className="profile-item" onClick={() => { setShowSettingsModal(true); setShowProfileMenu(false); }}><Icons.Settings /> Platform Settings</button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </header>

//         {loading ? <div className="loader-container"><div className="spinner"></div></div> : (
//             <div className="content-wrapper">
//                 <div className="welcome-banner">
//                     <div><h1>Dashboard Overview</h1><p>Welcome back, {user?.name.split(' ')[0]}.</p></div>
//                     <div className="date-badge">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
//                 </div>
//                 <div className="stats-row">
//                     <div className="widget-card"><div className="widget-icon blue">💰</div><div className="widget-info"><h3>{formatNumber(stats.volume)}</h3><p>Total Revenue</p></div></div>
//                     <div className="widget-card"><div className="widget-icon green">👥</div><div className="widget-info"><h3>{formatNumber(stats.totalUsers)}</h3><p>Total Users</p></div></div>
//                     <div className="widget-card"><div className="widget-icon orange">📅</div><div className="widget-info"><h3>{formatNumber(stats.totalSessions)}</h3><p>Sessions Held</p></div></div>
//                     <div className="widget-card"><div className="widget-icon purple">⭐</div><div className="widget-info"><h3>4.8</h3><p>Platform Rating</p></div></div>
//                 </div>
//                 <div className="panel table-panel">
//                     <div className="panel-header"><div className="panel-title"><h3>Recent User Activity</h3></div><Link to="/admin/users" className="btn-view-all">View All <Icons.ArrowRight /></Link></div>
//                     <div className="table-wrapper">
//                         <table className="admin-table">
//                             <thead><tr><th>User Profile</th><th>Role</th><th>Wallet</th><th>Status</th><th style={{textAlign: 'right'}}>Actions</th></tr></thead>
//                             <tbody>
//                                 {filteredUsers.slice(0, 8).map(u => (
//                                     <tr key={u._id}>
//                                         <td><div className="user-combo"><img src={getAvatarUrl(u)} alt="" /><div><div className="u-name">{u.name}</div><div className="u-email">{u.email}</div></div></div></td>
//                                         <td><span className={`pill ${u.role}`}>{u.role.toUpperCase()}</span></td>
//                                         <td className="font-mono">{formatNumber(u.walletBalance)}</td>
//                                         <td><span className={`status-badge ${u.isBanned ? 'banned' : 'active'}`}><span className="dot"></span>{u.isBanned ? 'Banned' : 'Active'}</span></td>
//                                         <td style={{textAlign: 'right'}}>
//                                             {/* 🚨 CHANGED: initiateBan instead of toggleBan */}
//                                             {u.role !== 'admin' && <button className={`action-btn ${u.isBanned ? 'btn-unban' : 'btn-ban'}`} onClick={() => initiateBan(u)}>{u.isBanned ? 'Unban' : 'Ban'}</button>}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         )}
//       </main>

//       {/* 🚨 BAN CONFIRMATION MODAL 🚨 */}
//       {showBanModal && userToBan && (
//         <div className="modal-overlay">
//             <div className="modal-content small-modal">
//                 <div className="modal-body center-text">
//                     <div className="alert-icon-wrapper"><Icons.Alert /></div>
//                     <h3>{userToBan.isBanned ? 'Activate User?' : 'Ban User?'}</h3>
//                     <p className="modal-text">
//                         Are you sure you want to {userToBan.isBanned ? 'activate' : 'ban'} <strong>{userToBan.name}</strong>?
//                         {userToBan.isBanned ? ' They will regain access immediately.' : ' They will lose access to the platform.'}
//                     </p>
//                     <div className="modal-actions-row">
//                         <button className="btn-cancel-flat" onClick={() => setShowBanModal(false)}>Cancel</button>
//                         <button className={`btn-confirm ${userToBan.isBanned ? 'confirm-green' : 'confirm-red'}`} onClick={confirmBan}>
//                             {userToBan.isBanned ? 'Activate User' : 'Ban User'}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//       )}

//       {/* PROFILE MODAL */}
//       {showProfileModal && (
//         <div className="modal-overlay">
//             <div className="modal-content">
//                 <div className="modal-header"><h3>Edit Profile</h3><button className="close-btn" onClick={() => setShowProfileModal(false)}><Icons.Close /></button></div>
//                 <div className="modal-body">
//                     <div className="modal-avatar-section">
//                         <img src={getAvatarUrl(user)} alt="Admin" className="modal-avatar" />
//                         <button className="change-photo-btn" onClick={() => fileInputRef.current.click()}>Change Photo</button>
//                         <input type="file" ref={fileInputRef} hidden onChange={handleAvatarChange} accept="image/*" />
//                     </div>
//                     <div className="form-group"><label>Full Name</label><input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="modal-input" /></div>
//                     <div className="form-group"><label>Email Address</label><input type="email" value={user?.email} disabled className="modal-input disabled" /></div>
//                     <div className="form-group"><label>Role</label><input type="text" value="Administrator" disabled className="modal-input disabled" /></div>
//                 </div>
//                 <div className="modal-footer">
//                     <button className="btn-cancel" onClick={() => setShowProfileModal(false)}>Cancel</button>
//                     <button className="btn-save" onClick={handleProfileUpdate} disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Save Changes'}</button>
//                 </div>
//             </div>
//         </div>
//       )}

//       {/* COMMUNICATION MODAL */}
//       {showCommModal && (
//         <div className="modal-overlay">
//             <div className="modal-content wide-modal">
//                 <div className="modal-header"><h3>Communication Center</h3><button className="close-btn" onClick={() => setShowCommModal(false)}><Icons.Close /></button></div>
//                 <div className="modal-body">
//                     <div className="form-grid-2">
//                         <div className="form-group">
//                             <label>Communication Type</label>
//                             <select className="modal-input" value={commData.type} onChange={e => setCommData({...commData, type: e.target.value})}>
//                                 <option value="announcement">📢 Announcement (All Users)</option>
//                                 <option value="email">📧 Email Blast</option>
//                                 <option value="update">🚀 Platform Update</option>
//                                 <option value="maintenance">⚠️ Maintenance Alert</option>
//                             </select>
//                         </div>
//                         <div className="form-group">
//                             <label>Target Audience</label>
//                             <select className="modal-input" value={commData.target} onChange={e => setCommData({...commData, target: e.target.value})}>
//                                 <option value="all">All Users</option>
//                                 <option value="active">Active Users (Last 30d)</option>
//                                 <option value="banned">Banned Users</option>
//                             </select>
//                         </div>
//                     </div>
//                     <div className="form-group">
//                         <label>Subject / Title</label>
//                         <input type="text" className="modal-input" placeholder="Enter subject line..." value={commData.subject} onChange={e => setCommData({...commData, subject: e.target.value})} />
//                     </div>
//                     <div className="form-group">
//                         <label>Message Content</label>
//                         <textarea rows="5" className="modal-input" placeholder="Type your message here..." value={commData.message} onChange={e => setCommData({...commData, message: e.target.value})}></textarea>
//                     </div>
//                 </div>
//                 <div className="modal-footer">
//                     <button className="btn-cancel" onClick={() => setShowCommModal(false)}>Cancel</button>
//                     <button className="btn-save" onClick={handleSendComm} disabled={isSendingComm}>
//                         {isSendingComm ? 'Sending...' : (
//                             <span style={{display:'flex', alignItems:'center', gap:'6px'}}>
//                                 <Icons.Send /> Send Broadcast
//                             </span>
//                         )}
//                     </button>
//                 </div>
//             </div>
//         </div>
//       )}

//       {/* SETTINGS MODAL */}
//       {showSettingsModal && (
//         <div className="modal-overlay">
//             <div className="modal-content">
//                 <div className="modal-header"><h3>Platform Settings</h3><button className="close-btn" onClick={() => setShowSettingsModal(false)}><Icons.Close /></button></div>
//                 <div className="modal-body">
//                     <div className="form-group">
//                         <label>Platform Name</label>
//                         <input type="text" value={settings.siteName} onChange={(e) => setSettings({...settings, siteName: e.target.value})} className="modal-input" />
//                     </div>
//                     <div className="setting-row">
//                         <div><label>Maintenance Mode</label><p className="sub-text">Disable access for non-admins</p></div>
//                         <label className="switch"><input type="checkbox" checked={settings.maintenanceMode} onChange={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})} /><span className="slider round"></span></label>
//                     </div>
//                     <div className="setting-row">
//                         <div><label>System Emails</label><p className="sub-text">Enable automated email alerts</p></div>
//                         <label className="switch"><input type="checkbox" checked={settings.emailAlerts} onChange={() => setSettings({...settings, emailAlerts: !settings.emailAlerts})} /><span className="slider round"></span></label>
//                     </div>
//                     <div className="form-group" style={{marginTop:'20px'}}>
//                         <label>Featured Skills</label>
//                         <div className="skills-input-row">
//                             <input type="text" placeholder="Add skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} className="modal-input" />
//                             <button className="btn-add" onClick={addSkill}><Icons.Bag /> Add</button>
//                         </div>
//                         <div className="skills-tags">
//                             {settings.featuredSkills.map(skill => (
//                                 <span key={skill} className="skill-tag">{skill} <button onClick={() => removeSkill(skill)}><Icons.Trash /></button></span>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//                 <div className="modal-footer">
//                     <button className="btn-cancel" onClick={() => setShowSettingsModal(false)}>Close</button>
//                     <button className="btn-save" onClick={handleSettingsSave} disabled={isSavingSettings}>{isSavingSettings ? 'Saving...' : 'Save Settings'}</button>
//                 </div>
//             </div>
//         </div>
//       )}

//       <style>{`
//         :root { --bg-body: #f8fafc; --bg-sidebar: #111827; --white: #ffffff; --text-main: #1f2937; --text-light: #6b7280; --primary: #4f46e5; --border: #e5e7eb; --danger: #ef4444; --success: #10b981; }
//         body { margin: 0; font-family: 'Inter', sans-serif; background: var(--bg-body); color: var(--text-main); }
//         .layout { display: flex; min-height: 100vh; }
//         .sidebar { width: 260px; background: var(--bg-sidebar); color: #9ca3af; display: flex; flex-direction: column; position: fixed; height: 100vh; z-index: 100; box-shadow: 4px 0 24px rgba(0,0,0,0.02); }
//         .logo-area { height: 70px; display: flex; align-items: center; padding: 0 24px; color: var(--white); font-weight: 800; font-size: 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.05); gap: 12px; }
//         .logo-icon { width: 32px; height: 32px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; }
//         .nav-container { flex: 1; padding: 24px 0; overflow-y: auto; }
//         .nav-group { margin-bottom: 32px; }
//         .nav-label { font-size: 0.7rem; font-weight: 700; color: #4b5563; padding: 0 24px; margin-bottom: 12px; display: block; letter-spacing: 0.08em; text-transform: uppercase; }
//         .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: inherit; text-decoration: none; font-weight: 500; font-size: 0.95rem; transition: all 0.2s; border-left: 3px solid transparent; width: 100%; text-align: left; background: none; border: none; cursor: pointer; }
//         .nav-item:hover { background: rgba(255,255,255,0.03); color: var(--white); }
//         .nav-item.active { background: rgba(79, 70, 229, 0.1); color: var(--white); border-left-color: var(--primary); }
//         .nav-item svg { width: 20px; height: 20px; opacity: 0.7; }
//         .nav-item.active svg { opacity: 1; color: var(--primary); }
//         .badge { background: var(--primary); color: white; font-size: 0.7rem; padding: 2px 8px; border-radius: 12px; margin-left: auto; font-weight: 700; }
//         .sidebar-footer { padding: 20px; border-top: 1px solid rgba(255,255,255,0.05); }
//         .logout { color: #ef4444; } .logout:hover { background: rgba(239, 68, 68, 0.1); border-left-color: #ef4444; }

//         .main-content { margin-left: 260px; flex: 1; width: calc(100% - 260px); display: flex; flex-direction: column; }
//         .header { height: 70px; background: var(--white); border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; padding: 0 32px; position: sticky; top: 0; z-index: 99; }
//         .search-bar { display: flex; align-items: center; background: #f9fafb; padding: 8px 16px; border-radius: 8px; width: 380px; border: 1px solid var(--border); color: var(--text-light); transition: border-color 0.2s; }
//         .search-bar:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
//         .search-bar input { border: none; background: transparent; outline: none; margin-left: 10px; width: 100%; font-size: 0.95rem; color: var(--text-main); }
//         .header-actions { display: flex; align-items: center; gap: 24px; }
        
//         .notif-wrapper { position: relative; }
//         .icon-btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: var(--text-light); cursor: pointer; transition: 0.2s; background: transparent; border: none; position: relative; }
//         .icon-btn:hover { background: #f3f4f6; color: var(--primary); }
//         .notif-badge { position: absolute; top: -2px; right: -2px; background: #ef4444; color: white; font-size: 0.65rem; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid var(--white); font-weight: 700; }
//         .notif-dropdown, .profile-dropdown { position: absolute; top: 50px; right: 0; width: 300px; background: white; border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); z-index: 1000; overflow: hidden; animation: fadeIn 0.2s ease-out; }
//         .profile-dropdown { width: 220px; top: 55px; }
//         .notif-header { padding: 12px 16px; font-weight: 700; font-size: 0.9rem; background: #f9fafb; border-bottom: 1px solid var(--border); }
//         .notif-list { max-height: 250px; overflow-y: auto; }
//         .notif-item { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.85rem; color: var(--text-main); display: flex; gap: 10px; }
//         .notif-item:hover { background: #f8fafc; }
//         .notif-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); margin-top: 5px; flex-shrink: 0; }
//         .notif-empty { padding: 20px; text-align: center; color: var(--text-light); font-size: 0.9rem; }
        
//         .profile-item { display: flex; align-items: center; gap: 10px; padding: 12px 16px; color: var(--text-main); text-decoration: none; font-size: 0.9rem; width: 100%; text-align: left; background: none; border: none; cursor: pointer; transition: background 0.2s; }
//         .profile-item:hover { background: #f8fafc; color: var(--primary); }
//         .profile-item svg { width: 18px; height: 18px; color: #9ca3af; }
//         .profile-item:hover svg { color: var(--primary); }

//         .admin-profile-wrapper { position: relative; }
//         .admin-profile { display: flex; align-items: center; gap: 12px; cursor: pointer; padding: 4px 8px; border-radius: 8px; transition: background 0.2s; }
//         .admin-profile:hover { background: #f9fafb; }
//         .admin-profile img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #e5e7eb; }
//         .profile-text { display: flex; flex-direction: column; }
//         .profile-text .name { font-weight: 700; font-size: 0.9rem; color: var(--text-main); }
//         .profile-text .role { font-size: 0.75rem; color: var(--text-light); }

//         .content-wrapper { padding: 32px; max-width: 1600px; margin: 0 auto; width: 100%; }
//         .welcome-banner { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
//         .welcome-banner h1 { font-size: 1.75rem; font-weight: 800; color: var(--text-main); margin: 0 0 6px 0; }
//         .welcome-banner p { color: var(--text-light); margin: 0; font-size: 0.95rem; }
//         .date-badge { background: var(--white); padding: 8px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; color: var(--text-main); border: 1px solid var(--border); }

//         .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 32px; }
//         .widget-card { background: var(--white); padding: 24px; border-radius: 16px; border: 1px solid var(--border); display: flex; align-items: center; gap: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
//         .widget-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; flex-shrink: 0; }
//         .blue { background: #eff6ff; color: #3b82f6; } .green { background: #f0fdf4; color: #16a34a; }
//         .orange { background: #fff7ed; color: #f97316; } .purple { background: #faf5ff; color: #9333ea; }
//         .widget-info h3 { font-size: 1.8rem; margin: 0; color: var(--text-main); font-weight: 800; }
//         .widget-info p { margin: 0; color: var(--text-light); font-size: 0.9rem; font-weight: 500; }

//         .panel { background: var(--white); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
//         .panel-header { padding: 24px 32px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: #ffffff; }
//         .panel-title h3 { margin: 0 0 4px 0; font-size: 1.15rem; color: var(--text-main); font-weight: 700; }
//         .panel-title p { margin: 0; color: var(--text-light); font-size: 0.85rem; }
//         .btn-view-all { display: flex; align-items: center; gap: 6px; color: var(--primary); font-weight: 600; font-size: 0.9rem; text-decoration: none; padding: 8px 16px; border-radius: 8px; transition: background 0.2s; }
//         .btn-view-all:hover { background: #e0e7ff; }
//         .btn-view-all svg { width: 16px; height: 16px; }

//         .table-wrapper { overflow-x: auto; }
//         .admin-table { width: 100%; border-collapse: collapse; min-width: 800px; }
//         .admin-table th { text-align: left; padding: 16px 32px; background: #f9fafb; font-size: 0.8rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--border); }
//         .admin-table td { padding: 16px 32px; border-bottom: 1px solid #f3f4f6; color: var(--text-main); font-size: 0.95rem; vertical-align: middle; }
//         .admin-table tr:last-child td { border-bottom: none; }
//         .admin-table tr:hover td { background: #fcfcfc; }
//         .user-combo { display: flex; align-items: center; gap: 16px; }
//         .user-combo img { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border); }
//         .u-name { font-weight: 700; font-size: 0.95rem; color: var(--text-main); }
//         .u-email { font-size: 0.85rem; color: var(--text-light); }
//         .pill { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
//         .pill.admin { background: #e0e7ff; color: #4338ca; }
//         .pill.user { background: #f3f4f6; color: #4b5563; }
//         .status-badge { display: inline-flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; padding: 6px 12px; border-radius: 20px; }
//         .status-badge.active { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
//         .status-badge.banned { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
//         .status-badge .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
//         .action-btn { border: none; font-size: 0.8rem; font-weight: 700; cursor: pointer; padding: 8px 16px; border-radius: 8px; transition: all 0.2s; }
//         .btn-ban { background: #fff1f2; color: #e11d48; } .btn-ban:hover { background: #ffe4e6; color: #be123c; }
//         .btn-unban { background: #ecfdf5; color: #059669; } .btn-unban:hover { background: #d1fae5; color: #047857; }

//         /* MODAL STYLES */
//         .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 2000; backdrop-filter: blur(4px); animation: fadeIn 0.2s; }
//         .modal-content { background: white; width: 450px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); overflow: hidden; }
//         .small-modal { width: 380px; }
//         .wide-modal { width: 600px; }
//         .modal-header { padding: 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: #f9fafb; }
//         .modal-header h3 { margin: 0; font-size: 1.1rem; color: var(--text-main); font-weight: 700; }
//         .close-btn { background: none; border: none; cursor: pointer; color: var(--text-light); padding: 4px; border-radius: 4px; }
//         .close-btn:hover { background: #e5e7eb; color: var(--text-main); }
//         .modal-body { padding: 24px; }
//         .center-text { text-align: center; }
        
//         /* 🚨 ALERT ICON FIX */
//         .alert-icon-wrapper { 
//             background: #fef2f2; 
//             width: 60px; 
//             height: 60px; 
//             border-radius: 50%; 
//             display: flex; 
//             align-items: center; 
//             justify-content: center; 
//             margin: 0 auto 16px; 
//             box-shadow: 0 0 0 6px #fef2f2; /* OUTER RING EFFECT */
//         }

//         .modal-text { color: #6b7280; margin-bottom: 24px; font-size: 0.95rem; line-height: 1.5; }
        
//         .modal-actions-row { display: flex; gap: 12px; justify-content: center; }
//         .btn-cancel-flat { background: transparent; border: 1px solid #e5e7eb; padding: 10px 20px; border-radius: 8px; font-weight: 600; color: #374151; cursor: pointer; transition: 0.2s; }
//         .btn-cancel-flat:hover { background: #f9fafb; }
//         .btn-confirm { padding: 10px 24px; border-radius: 8px; font-weight: 600; color: white; border: none; cursor: pointer; transition: 0.2s; }
//         .confirm-red { background: #ef4444; } .confirm-red:hover { background: #dc2626; }
//         .confirm-green { background: #10b981; } .confirm-green:hover { background: #059669; }

//         .modal-avatar-section { display: flex; flex-direction: column; align-items: center; margin-bottom: 24px; }
//         .modal-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 12px; border: 3px solid #e0e7ff; }
//         .change-photo-btn { font-size: 0.85rem; color: var(--primary); background: none; border: none; cursor: pointer; font-weight: 600; }
//         .form-group { margin-bottom: 16px; }
//         .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
//         .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-light); margin-bottom: 6px; }
//         .modal-input { width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 0.95rem; color: var(--text-main); outline: none; }
//         .modal-input.disabled { background: #f3f4f6; cursor: not-allowed; color: #9ca3af; }
//         .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 12px; background: #f9fafb; }
//         .btn-cancel { padding: 10px 20px; border: 1px solid var(--border); background: white; border-radius: 8px; font-weight: 600; cursor: pointer; color: var(--text-light); }
//         .btn-save { padding: 10px 20px; border: none; background: var(--primary); color: white; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; }
//         .btn-save:hover { background: #4338ca; }
//         .btn-save:disabled { opacity: 0.7; cursor: not-allowed; }
//         .btn-add { background: var(--primary); color: white; border: none; padding: 0 16px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; }

//         /* SETTINGS TOGGLE */
//         .setting-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
//         .sub-text { font-size: 0.8rem; color: #9ca3af; margin: 0; }
//         .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
//         .switch input { opacity: 0; width: 0; height: 0; }
//         .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .4s; border-radius: 34px; }
//         .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
//         input:checked + .slider { background-color: #4f46e5; }
//         input:checked + .slider:before { transform: translateX(20px); }
        
//         .skills-input-row { display: flex; gap: 10px; margin-bottom: 12px; }
//         .skills-tags { display: flex; flex-wrap: wrap; gap: 8px; }
//         .skill-tag { background: #f3f4f6; color: var(--text-main); padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; display: flex; align-items: center; gap: 6px; font-weight: 500; border: 1px solid var(--border); }
//         .skill-tag button { background: none; border: none; cursor: pointer; color: #9ca3af; display: flex; padding: 0; }
//         .skill-tag button:hover { color: var(--danger); }

//         @media (max-width: 1200px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
//         @media (max-width: 768px) { .sidebar { width: 0; padding: 0; overflow: hidden; } .main-content { margin-left: 0; width: 100%; } .stats-row { grid-template-columns: 1fr; } .header { padding: 0 20px; } .content-wrapper { padding: 20px; } }
//         .loader-container { height: 100vh; display: flex; justify-content: center; align-items: center; background: #f8fafc; }
//         .spinner { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid var(--primary); border-radius: 50%; animation: spin 1s linear infinite; }
//         @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
//       `}</style>
//     </div>
//   );
// }




import { useEffect, useState, useContext, useRef, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify'; 

const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : `http://${window.location.hostname}:5000`;

const Icons = {
  Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Sessions: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><rect x="3" y="4" width="4" height="4" rx="1"/><rect x="3" y="10" width="4" height="4" rx="1"/><rect x="3" y="16" width="4" height="4" rx="1"/></svg>,
  Star: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  ArrowRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Megaphone: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>,
  Send: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Alert: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Refresh: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  TrendUp: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8 10 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Warning: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4m0 4h.01M12 3L2 20h20L12 3z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

export default function AdminDashboard() {
  const { user, logout, updateUser } = useContext(AuthContext);
  const { socket } = useSocket() || {}; 
  const navigate = useNavigate();
  const location = useLocation();
  
  const [stats, setStats] = useState({ totalUsers: 0, totalSessions: 0, volume: 0 });
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // UI States
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCommModal, setShowCommModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [userToBan, setUserToBan] = useState(null);
  
  // Profile Form
  const [editName, setEditName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Communication Form - Simplified
  const [commData, setCommData] = useState({
    subject: '',
    message: ''
  });
  const [isSendingComm, setIsSendingComm] = useState(false);
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user && user.name) {
        setEditName(user.name);
    }
  }, [user]);

  const fetchAdminData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
        const [statsRes, usersRes, reviewsRes] = await Promise.all([
            axios.get(`${BASE_URL}/api/admin/stats`),
            axios.get(`${BASE_URL}/api/admin/users`),
            axios.get(`${BASE_URL}/api/admin/reviews`)
        ]);
        
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setReviews(reviewsRes.data);
    } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Failed to load dashboard data");
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  }, []);

  const refreshData = async () => {
    setRefreshing(true);
    await fetchAdminData(false);
    toast.success("Dashboard refreshed");
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
        navigate('/dashboard');
        return;
    }
    fetchAdminData();
  }, [user, navigate, fetchAdminData]);

  useEffect(() => {
    if (!socket) return;

    const handleNotif = (data) => {
        setNotifications(prev => [data, ...prev].slice(0, 20));
        const audio = new Audio('/notification.mp3'); 
        audio.play().catch(() => {});
        toast.info(data.text || "New Notification");
    };

    const handleNewUser = (userData) => {
        toast.success(`🎉 New User Joined: ${userData.name}`);
        fetchAdminData(false);
    };

    socket.on('receive_notification', handleNotif);
    socket.on('new_user_registered', handleNewUser);

    return () => {
        socket.off('receive_notification', handleNotif);
        socket.off('new_user_registered', handleNewUser);
    };
  }, [socket, fetchAdminData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initiateBan = (user) => {
    setUserToBan(user);
    setShowBanModal(true);
  };

  const confirmBan = async () => {
    if (!userToBan) return;
    try {
      const res = await axios.put(`${BASE_URL}/api/admin/ban/${userToBan._id}`);
      setUsers(users.map(u => u._id === userToBan._id ? { ...u, isBanned: res.data.isBanned } : u));
      toast.success(res.data.isBanned ? `User ${userToBan.name} banned` : `User ${userToBan.name} activated`);
      setShowBanModal(false);
      setUserToBan(null);
    } catch (err) { 
        toast.error("Failed to update user status"); 
    }
  };

  const handleProfileUpdate = async () => {
    if (!editName.trim()) {
        toast.error("Name cannot be empty");
        return;
    }
    setIsUpdating(true);
    try {
        const payload = { userId: user.id || user._id, name: editName };
        const res = await axios.put(`${BASE_URL}/api/users/profile`, payload);
        if(res.data) {
            updateUser({ ...user, name: editName });
            toast.success("Profile updated successfully!");
            setShowProfileModal(false);
        }
    } catch (err) {
        toast.error("Failed to update profile.");
    } finally {
        setIsUpdating(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUpdating(true);
    try {
        const data = new FormData();
        data.append('userId', user.id || user._id);
        data.append('avatar', file);
        data.append('name', editName); 
        const res = await axios.put(`${BASE_URL}/api/users/profile`, data);
        updateUser(res.data);
        toast.success("Photo updated!");
    } catch (err) {
        toast.error("Failed to upload photo.");
    } finally {
        setIsUpdating(false);
    }
  };

  // Simplified communication - sends to all users
  const handleSendComm = async () => {
    if(!commData.subject || !commData.message) return toast.error("Please fill all fields");
    setIsSendingComm(true);
    try {
        await axios.post(`${BASE_URL}/api/admin/communicate`, {
            subject: commData.subject,
            message: commData.message,
            type: 'announcement',
            target: 'all'
        });
        toast.success(`Message sent successfully to all users!`);
        setShowCommModal(false);
        setCommData({ subject: '', message: '' });
    } catch(err) {
        toast.error("Failed to send message.");
    } finally { 
        setIsSendingComm(false); 
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    toast.info("All notifications cleared");
  };

  const formatNumber = (amount) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(amount);
  const getAvatarUrl = (u) => {
    if (!u) return "";
    if (u.avatar && u.avatar.startsWith('http')) return u.avatar;
    if (u.avatar) return `${BASE_URL}${u.avatar}`;
    return `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`;
  };
  
  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeUsers = users.filter(u => !u.isBanned).length;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1) 
    : '4.8';

  return (
    <div className="admin-dashboard">
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
              <span className="badge">{stats.totalUsers}</span>
            </Link>
            <Link to="/admin/sessions" className={`nav-item ${location.pathname === '/admin/sessions' ? 'active' : ''}`}>
              <Icons.Sessions />
              <span>Sessions</span>
              <span className="badge">{stats.totalSessions}</span>
            </Link>
            <Link to="/admin/reviews" className={`nav-item ${location.pathname === '/admin/reviews' ? 'active' : ''}`}>
              <Icons.Star />
              <span>Reviews</span>
              <span className="badge">{reviews.length}</span>
            </Link>
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">Tools</div>
            <button onClick={() => setShowCommModal(true)} className="nav-item">
              <Icons.Megaphone />
              <span>Send Message</span>
            </button>
          </div>
        </div>
        
        <div className="sidebar-footer">
          <button onClick={logout} className="nav-item logout">
            <Icons.Logout />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <h1 className="page-title">Dashboard</h1>
            <div className="page-breadcrumb">
              <span>Home</span>
              <span>/</span>
              <span className="active">Dashboard</span>
            </div>
          </div>
          
          <div className="header-right">
            <div className="search-wrapper">
              <Icons.Search />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button className="icon-btn refresh-btn" onClick={refreshData} disabled={refreshing}>
              <Icons.Refresh />
            </button>
            
            <div className="notif-wrapper" ref={notifRef}>
              <button className="icon-btn" onClick={() => setShowNotifDropdown(!showNotifDropdown)}>
                <Icons.Bell />
                {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
              </button>
              {showNotifDropdown && (
                <div className="notif-dropdown">
                  <div className="notif-header">
                    <span>Notifications</span>
                    {notifications.length > 0 && (
                      <button className="clear-btn" onClick={clearNotifications}>Clear all</button>
                    )}
                  </div>
                  <div className="notif-list">
                    {notifications.length === 0 ? (
                      <div className="notif-empty">No new notifications</div>
                    ) : (
                      notifications.map((n, i) => (
                        <div key={i} className="notif-item">
                          <div className="notif-dot"></div>
                          <span>{n.text}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="profile-wrapper" ref={profileRef}>
              <div className="profile-trigger" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <img src={getAvatarUrl(user)} alt={user?.name} />
                <div className="profile-info">
                  <span className="profile-name">{user?.name}</span>
                  <span className="profile-role">Admin</span>
                </div>
              </div>
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <button className="dropdown-item" onClick={() => { setShowProfileModal(true); setShowProfileMenu(false); }}>
                    <Icons.User /> Edit Profile
                  </button>
                  {/* <div className="dropdown-divider"></div> */}
                  {/* <button className="dropdown-item logout-item" onClick={logout}>
                    <Icons.Logout /> Sign Out
                  </button> */}
                </div>
              )}
            </div>
          </div>
        </header>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <div className="content">
            <div className="welcome-section">
              <div>
                <h2>Welcome back, {user?.name?.split(' ')[0]}!</h2>
                <p>Here's what's happening with your platform today.</p>
              </div>
              <div className="date-badge">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card revenue">
                <div className="stat-icon"><span>💰</span></div>
                <div className="stat-content">
                  <span className="stat-label">Total Revenue</span>
                  <span className="stat-value">${formatNumber(stats.volume)}</span>
                  <span className="stat-change positive"><Icons.TrendUp /> +12.5%</span>
                </div>
              </div>
              
              <div className="stat-card users">
                <div className="stat-icon"><span>👥</span></div>
                <div className="stat-content">
                  <span className="stat-label">Total Users</span>
                  <span className="stat-value">{formatNumber(stats.totalUsers)}</span>
                  <span className="stat-sub">{activeUsers} active</span>
                </div>
              </div>
              
              <div className="stat-card sessions">
                <div className="stat-icon"><span>📅</span></div>
                <div className="stat-content">
                  <span className="stat-label">Sessions</span>
                  <span className="stat-value">{formatNumber(stats.totalSessions)}</span>
                  <span className="stat-sub">Total completed</span>
                </div>
              </div>
              
              <div className="stat-card rating">
                <div className="stat-icon"><span>⭐</span></div>
                <div className="stat-content">
                  <span className="stat-label">Avg. Rating</span>
                  <span className="stat-value">{avgRating}</span>
                  <span className="stat-sub">from {reviews.length} reviews</span>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="actions-grid">
                <button className="action-card" onClick={() => setShowCommModal(true)}>
                  <div className="action-icon">📢</div>
                  <div className="action-info">
                    <h4>Send Message</h4>
                    <p>Broadcast message to all users</p>
                  </div>
                </button>
                <button className="action-card" onClick={refreshData}>
                  <div className="action-icon">🔄</div>
                  <div className="action-info">
                    <h4>Refresh Data</h4>
                    <p>Update dashboard statistics</p>
                  </div>
                </button>
                <Link to="/admin/users" className="action-card">
                  <div className="action-icon">👥</div>
                  <div className="action-info">
                    <h4>Manage Users</h4>
                    <p>View and manage all users</p>
                  </div>
                </Link>
              </div>
            </div>

            <div className="table-card">
              <div className="table-header">
                <div>
                  <h3>Recent Users</h3>
                  <p>Latest users who joined your platform</p>
                </div>
                <Link to="/admin/users" className="view-all-btn">
                  View All <Icons.ArrowRight />
                </Link>
              </div>
              
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Wallet</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th></th>
                      </tr>
                    </thead>
                  <tbody>
                    {filteredUsers.slice(0, 8).map(u => (
                      <tr key={u._id}>
                        <td>
                          <div className="user-cell">
                            <img src={getAvatarUrl(u)} alt={u.name} />
                            <div>
                              <div className="user-name">{u.name}</div>
                              <div className="user-email">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`role-badge ${u.role}`}>
                            {u.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="wallet-cell">
                          <span className="wallet-badge">💰 {formatNumber(u.walletBalance)}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${u.isBanned ? 'banned' : 'active'}`}>
                            <span className="status-dot"></span>
                            {u.isBanned ? 'Banned' : 'Active'}
                          </span>
                        </td>
                        <td className="date-cell">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="actions-cell">
                          {u.role !== 'admin' && (
                            <button 
                              className={`ban-btn ${u.isBanned ? 'unban' : 'ban'}`}
                              onClick={() => initiateBan(u)}
                            >
                              {u.isBanned ? 'Unban' : 'Ban'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan="6" className="empty-state">
                          No users found matching "{searchTerm}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* IMPROVED BAN MODAL */}
      {showBanModal && userToBan && (
        <div className="modal-overlay" onClick={() => setShowBanModal(false)}>
          <div className="ban-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`ban-modal-icon ${userToBan.isBanned ? 'activate' : 'ban'}`}>
              {userToBan.isBanned ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) : (
                <Icons.Warning />
              )}
            </div>
            
            <h3 className="ban-modal-title">
              {userToBan.isBanned ? 'Activate User?' : 'Ban User?'}
            </h3>
            
            <p className="ban-modal-message">
              {userToBan.isBanned 
                ? `Are you sure you want to activate "${userToBan.name}"? They will regain full access to the platform.`
                : `Are you sure you want to ban "${userToBan.name}"? They will lose access to all platform features.`}
            </p>
            
            <div className="ban-modal-actions">
              <button 
                className="ban-modal-btn cancel"
                onClick={() => setShowBanModal(false)}
              >
                Cancel
              </button>
              <button 
                className={`ban-modal-btn confirm ${userToBan.isBanned ? 'activate' : 'ban'}`}
                onClick={confirmBan}
              >
                {userToBan.isBanned ? 'Activate User' : 'Ban User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button className="close-btn" onClick={() => setShowProfileModal(false)}><Icons.Close /></button>
            </div>
            <div className="modal-body">
              <div className="avatar-section">
                <img src={getAvatarUrl(user)} alt="Profile" className="profile-avatar" />
                <button className="change-photo" onClick={() => fileInputRef.current.click()}>Change Photo</button>
                <input type="file" ref={fileInputRef} hidden onChange={handleAvatarChange} accept="image/*" />
              </div>
              <div className="form-field">
                <label>Full Name</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input type="email" value={user?.email} disabled />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowProfileModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleProfileUpdate} disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIMPLIFIED COMMUNICATION MODAL */}
      {showCommModal && (
        <div className="modal-overlay" onClick={() => setShowCommModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Send Message to All Users</h3>
              <button className="close-btn" onClick={() => setShowCommModal(false)}><Icons.Close /></button>
            </div>
            <div className="modal-body">
              <div className="form-field">
                <label>Subject</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter message subject..." 
                  value={commData.subject} 
                  onChange={e => setCommData({...commData, subject: e.target.value})}
                />
              </div>
              <div className="form-field">
                <label>Message</label>
                <textarea 
                  rows="6" 
                  className="form-textarea" 
                  placeholder="Type your message here..." 
                  value={commData.message} 
                  onChange={e => setCommData({...commData, message: e.target.value})}
                />
              </div>
              <div className="info-note">
                <Icons.Megaphone />
                <span>This message will be sent to all registered users</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowCommModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSendComm} disabled={isSendingComm}>
                {isSendingComm ? 'Sending...' : (
                  <>
                    <Icons.Send /> Send Message
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .admin-dashboard {
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

        .badge {
          margin-left: auto;
          background: rgba(255,255,255,0.1);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
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

        .page-breadcrumb .active {
          color: #6366f1;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .search-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f9fafb;
          padding: 8px 14px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }

        .search-wrapper:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .search-wrapper input {
          border: none;
          background: transparent;
          outline: none;
          width: 240px;
          font-size: 0.9rem;
        }

        .icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          transition: all 0.2s;
        }

        .icon-btn:hover {
          background: #f9fafb;
          color: #6366f1;
          border-color: #6366f1;
        }

        .refresh-btn:active {
          transform: rotate(180deg);
        }

        /* NOTIFICATIONS */
        .notif-wrapper {
          position: relative;
        }

        .notif-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          font-size: 0.65rem;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .notif-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          width: 320px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          border: 1px solid #e5e7eb;
          overflow: hidden;
          animation: fadeIn 0.2s;
        }

        .notif-header {
          padding: 12px 16px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          font-weight: 600;
        }

        .clear-btn {
          background: none;
          border: none;
          color: #6366f1;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .notif-list {
          max-height: 350px;
          overflow-y: auto;
        }

        .notif-item {
          padding: 12px 16px;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          gap: 10px;
          font-size: 0.85rem;
        }

        .notif-dot {
          width: 8px;
          height: 8px;
          background: #6366f1;
          border-radius: 50%;
          margin-top: 4px;
        }

        .notif-empty {
          padding: 32px;
          text-align: center;
          color: #9ca3af;
        }

        /* PROFILE */
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

        .profile-dropdown {
          position: absolute;
          top: 55px;
          right: 0;
          width: 200px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          border: 1px solid #e5e7eb;
          overflow: hidden;
          animation: fadeIn 0.2s;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
          color: #374151;
        }

        .dropdown-item:hover {
          background: #f9fafb;
        }

        .dropdown-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 4px 0;
        }

        .logout-item {
          color: #ef4444;
        }

        /* CONTENT */
        .content {
          padding: 32px;
        }

        .welcome-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .welcome-section h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 4px;
        }

        .welcome-section p {
          color: #6b7280;
        }

        .date-badge {
          background: white;
          padding: 8px 20px;
          border-radius: 30px;
          border: 1px solid #e5e7eb;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
        }

        .revenue .stat-icon { background: #fef3c7; }
        .users .stat-icon { background: #e0f2fe; }
        .sessions .stat-icon { background: #dcfce7; }
        .rating .stat-icon { background: #fae8ff; }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #6b7280;
          display: block;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: #111827;
          display: block;
          line-height: 1.2;
        }

        .stat-change {
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 6px;
        }

        .stat-change.positive {
          color: #10b981;
        }

        .stat-sub {
          font-size: 0.7rem;
          color: #9ca3af;
          display: block;
          margin-top: 4px;
        }

        .quick-actions {
          margin-bottom: 32px;
        }

        .quick-actions h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 16px;
          color: #374151;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .action-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid #e5e7eb;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
          border-color: #6366f1;
        }

        .action-icon {
          width: 48px;
          height: 48px;
          background: #f3f4f6;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .action-info h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }

        .action-info p {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .table-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .table-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .table-header h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .table-header p {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .view-all-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6366f1;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .table-container {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .data-table th {
          text-align: left;
          padding: 12px 24px;
          background: #f9fafb;
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
        }

        .data-table td {
          padding: 16px 24px;
          border-bottom: 1px solid #f3f4f6;
          font-size: 0.9rem;
        }

        .data-table tr:last-child td {
          border-bottom: none;
        }

        .data-table tr:hover td {
          background: #fefefe;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-cell img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-name {
          font-weight: 600;
          color: #111827;
        }

        .user-email {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .role-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .role-badge.admin {
          background: #eef2ff;
          color: #6366f1;
        }

        .role-badge.user {
          background: #f3f4f6;
          color: #6b7280;
        }

        .wallet-badge {
          background: #f3f4f6;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.active {
          background: #dcfce7;
          color: #10b981;
        }

        .status-badge.banned {
          background: #fee2e2;
          color: #ef4444;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        .date-cell {
          color: #6b7280;
          font-size: 0.85rem;
        }

        .ban-btn {
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ban-btn.ban {
          background: #fee2e2;
          color: #ef4444;
        }

        .ban-btn.ban:hover {
          background: #ef4444;
          color: white;
        }

        .ban-btn.unban {
          background: #dcfce7;
          color: #10b981;
        }

        .ban-btn.unban:hover {
          background: #10b981;
          color: white;
        }

        .empty-state {
          text-align: center;
          padding: 48px;
          color: #9ca3af;
        }

        .loading-state {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* BAN MODAL - IMPROVED DESIGN */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        .ban-modal {
          background: white;
          border-radius: 24px;
          width: 450px;
          max-width: 90%;
          padding: 32px;
          text-align: center;
          animation: scaleIn 0.3s ease;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .ban-modal-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ban-modal-icon.ban {
          background: #fee2e2;
          color: #ef4444;
        }

        .ban-modal-icon.activate {
          background: #dcfce7;
          color: #10b981;
        }

        .ban-modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 12px;
        }

        .ban-modal-message {
          color: #6b7280;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 28px;
        }

        .ban-modal-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .ban-modal-btn {
          padding: 10px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .ban-modal-btn.cancel {
          background: #f3f4f6;
          color: #374151;
        }

        .ban-modal-btn.cancel:hover {
          background: #e5e7eb;
        }

        .ban-modal-btn.confirm.ban {
          background: #ef4444;
          color: white;
        }

        .ban-modal-btn.confirm.ban:hover {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .ban-modal-btn.confirm.activate {
          background: #10b981;
          color: white;
        }

        .ban-modal-btn.confirm.activate:hover {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        /* Regular Modal Styles */
        .modal-content {
          background: white;
          border-radius: 24px;
          width: 450px;
          max-width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          animation: scaleIn 0.3s ease;
        }

        .modal-content.wide {
          width: 550px;
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .close-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: #f3f4f6;
        }

        .modal-body {
          padding: 24px;
        }

        .form-field {
          margin-bottom: 20px;
        }

        .form-field label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.9rem;
          outline: none;
          font-family: inherit;
        }

        .form-input:focus, .form-textarea:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .info-note {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #f0fdf4;
          border-radius: 10px;
          color: #10b981;
          font-size: 0.8rem;
          margin-top: 16px;
        }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .avatar-section {
          text-align: center;
          margin-bottom: 24px;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 8px;
        }

        .change-photo {
          background: none;
          border: none;
          color: #6366f1;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .btn-primary {
          padding: 8px 20px;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary:hover:not(:disabled) {
          background: #4f46e5;
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          padding: 8px 20px;
          background: white;
          color: #374151;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-secondary:hover {
          background: #f9fafb;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 1200px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .actions-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .main-content { margin-left: 0; }
          .stats-grid { grid-template-columns: 1fr; }
          .actions-grid { grid-template-columns: 1fr; }
          .search-wrapper { display: none; }
          .profile-info { display: none; }
          .ban-modal { width: 90%; padding: 24px; }
          .ban-modal-title { font-size: 1.25rem; }
        }
      `}</style>
    </div>
  );
}
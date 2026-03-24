// import { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';
// import { useNavigate, Link, useLocation } from 'react-router-dom';
// import { toast } from 'react-toastify';


//   ? 'http://localhost:5000' 
//   : `http://${window.location.hostname}:5000`;

// // --- INLINE SVGs ---
// const Icons = {
//   Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
//   Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
//   Bag: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>,
//   Star: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
//   Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
//   Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
//   Filter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
//   // 🚨 UPDATED ALERT ICON (Clean Exclamation Mark Only)
//   Alert: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
// };

// export default function AdminUsers() {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterRole, setFilterRole] = useState('all');
//   const [filterStatus, setFilterStatus] = useState('all');
  
//   // Modal States
//   const [showBanModal, setShowBanModal] = useState(false);
//   const [userToBan, setUserToBan] = useState(null);

//   useEffect(() => {
//     if (user && user.role !== 'admin') {
//         navigate('/dashboard');
//         return;
//     }
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/admin/users`);
//         setUsers(res.data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Fetch Error:", err);
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [user, navigate]);

//   // Initiate Ban Action
//   const initiateBan = (user) => {
//     setUserToBan(user);
//     setShowBanModal(true);
//   };

//   // Confirm Ban Action
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

//   const formatNumber = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const formatDate = (d) => d ? new Date(d).toLocaleDateString() : 'N/A';

//   const filteredUsers = users.filter(u => {
//     const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesRole = filterRole === 'all' || u.role === filterRole;
//     const matchesStatus = filterStatus === 'all' || (filterStatus === 'banned' ? u.isBanned : !u.isBanned);
//     return matchesSearch && matchesRole && matchesStatus;
//   });

//   if (loading) return <div style={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center', background:'#f8f9fa', color: '#000'}}>Loading...</div>;

//   return (
//     <div className="layout">
//       {/* SIDEBAR */}
//       <aside className="sidebar">
//         <div className="logo">
//             <div className="logo-icon">S</div>
//             <span>SkillSphere</span>
//         </div>
//         <nav className="nav-menu">
//             <div className="nav-label">GENERAL</div>
//             <Link to="/admin" className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}><Icons.Dashboard /> Dashboard</Link>
//             <Link to="/admin/users" className={`nav-item ${location.pathname === '/admin/users' ? 'active' : ''}`}><Icons.Users /> Users</Link>
//             <Link to="/admin/sessions" className={`nav-item ${location.pathname === '/admin/sessions' ? 'active' : ''}`}><Icons.Bag /> Sessions</Link>
//             <Link to="/admin/reviews" className={`nav-item ${location.pathname === '/admin/reviews' ? 'active' : ''}`}><Icons.Star /> Reviews</Link>
//         </nav>
//         <div className="nav-footer">
//             <button onClick={logout} className="nav-item logout-btn"><Icons.Logout /> Logout</button>
//         </div>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className="main-content">
//         <header className="top-bar">
//             <div className="page-title">
//                 <h1>All Users</h1>
//                 <p>Manage access, monitor wallets, and track user status.</p>
//             </div>
//             <div className="user-profile">
//                 <div className="user-info">
//                     <span className="name">{user?.name}</span>
//                     <span className="role">Admin</span>
//                 </div>
//                 <img src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt="Profile" className="avatar" />
//             </div>
//         </header>

//         <div className="filters-bar">
//             <div className="search-wrapper">
//                 <Icons.Search />
//                 <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//             </div>
//             <div className="filter-group">
//                 <div className="select-wrapper">
//                     <Icons.Filter />
//                     <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
//                         <option value="all">All Roles</option>
//                         <option value="user">Users</option>
//                         <option value="admin">Admins</option>
//                     </select>
//                 </div>
//                 <div className="select-wrapper">
//                     <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
//                         <option value="all">All Status</option>
//                         <option value="active">Active</option>
//                         <option value="banned">Banned</option>
//                     </select>
//                 </div>
//             </div>
//         </div>

//         <div className="table-card">
//             <div className="table-responsive">
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>User Info</th>
//                             <th>Role</th>
//                             <th>Joined Date</th>
//                             <th>Wallet</th>
//                             <th>Status</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredUsers.length > 0 ? (
//                             filteredUsers.map(u => (
//                                 <tr key={u._id}>
//                                     <td>
//                                         <div className="user-cell">
//                                             <img src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`} alt="" />
//                                             <div>
//                                                 <span className="fw-600 block">{u.name}</span>
//                                                 <span className="text-muted text-sm">{u.email}</span>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td>
//                                         <span className={`pill ${u.role === 'admin' ? 'pill-purple' : 'pill-gray'}`}>
//                                             {u.role.toUpperCase()}
//                                         </span>
//                                     </td>
//                                     <td className="text-muted">{formatDate(u.createdAt)}</td>
//                                     <td className="fw-600 font-mono">{formatNumber(u.walletBalance)}</td>
//                                     <td>
//                                         <span className={`status-badge ${u.isBanned ? 'status-banned' : 'status-active'}`}>
//                                             <span className={`dot ${u.isBanned ? 'dot-red' : 'dot-green'}`}></span>
//                                             {u.isBanned ? 'Banned' : 'Active'}
//                                         </span>
//                                     </td>
//                                     <td>
//                                         {u.role !== 'admin' && (
//                                             <button 
//                                                 className={`action-btn ${u.isBanned ? 'btn-unban' : 'btn-ban'}`}
//                                                 onClick={() => initiateBan(u)}
//                                             >
//                                                 {u.isBanned ? 'Unban User' : 'Ban User'}
//                                             </button>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr><td colSpan="6" className="empty-state">No users found matching your filters.</td></tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//             <div className="pagination-footer">Showing {filteredUsers.length} users</div>
//         </div>
//       </main>

//       {/* 🚨 PROPER BAN MODAL UI 🚨 */}
//       {showBanModal && userToBan && (
//         <div className="modal-overlay">
//             <div className="modal-content small-modal">
//                 <div className="modal-body center-text">
//                     {/* 🚨 CHANGED: Cleaner Icon Wrapper */}
//                     <div className="alert-icon-wrapper">
//                         <Icons.Alert />
//                     </div>
//                     <h3>{userToBan.isBanned ? 'Activate User' : 'Ban User'}</h3>
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

//       <style>{`
//         :root {
//             --bg-dark: #0f172a; 
//             --bg-light: #f1f5f9; 
//             --white: #ffffff;
//             --primary: #10B981;
//             --text-main: #020617; 
//             --text-muted: #4b5563; 
//             --border: #e2e8f0;
//         }

//         body { margin: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: var(--bg-light); color: var(--text-main); }
//         .layout { display: flex; min-height: 100vh; }

//         .sidebar { width: 250px; background: var(--bg-dark); color: #94a3b8; padding: 24px; display: flex; flex-direction: column; position: fixed; height: 100%; z-index: 100; }
//         .logo { display: flex; align-items: center; gap: 12px; color: var(--white); font-size: 1.25rem; font-weight: 800; margin-bottom: 40px; }
//         .logo-icon { width: 32px; height: 32px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
//         .nav-menu { flex: 1; display: flex; flex-direction: column; gap: 8px; }
//         .nav-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; margin-bottom: 12px; margin-top: 24px; color: #64748b; }
//         .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; color: inherit; text-decoration: none; transition: 0.2s; font-weight: 500; cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-size: 0.95rem; }
//         .nav-item:hover, .nav-item.active { background: rgba(255,255,255,0.1); color: var(--white); }
//         .nav-item.active { border-left: 3px solid var(--primary); border-radius: 4px 8px 8px 4px; background: rgba(16, 185, 129, 0.1); }
//         .logout-btn { color: #ef4444; margin-top: auto; } .logout-btn:hover { background: rgba(239, 68, 68, 0.1); }

//         .main-content { margin-left: 250px; flex: 1; padding: 32px; max-width: 1600px; }

//         .top-bar { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
//         .page-title h1 { margin: 0; font-size: 1.8rem; font-weight: 800; color: var(--text-main); }
//         .page-title p { margin: 5px 0 0; color: var(--text-muted); font-size: 0.95rem; }
        
//         .user-profile { display: flex; align-items: center; gap: 12px; }
//         .user-info { text-align: right; }
//         .user-info .name { display: block; font-weight: 700; color: var(--text-main); font-size: 0.95rem; }
//         .user-info .role { display: block; font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
//         .avatar { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--white); box-shadow: 0 2px 5px rgba(0,0,0,0.1); object-fit: cover; }

//         .filters-bar { display: flex; justify-content: space-between; align-items: center; background: var(--white); padding: 16px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); border: 1px solid var(--border); }
//         .search-wrapper { display: flex; align-items: center; background: #f8fafc; padding: 10px 16px; border-radius: 8px; width: 350px; border: 1px solid var(--border); color: var(--text-main); }
//         .search-wrapper input { border: none; outline: none; margin-left: 10px; width: 100%; font-size: 0.95rem; background: transparent; color: var(--text-main); }
        
//         .filter-group { display: flex; gap: 16px; }
//         .select-wrapper { display: flex; align-items: center; gap: 8px; border: 1px solid var(--border); padding: 8px 12px; border-radius: 8px; background: #fff; }
//         .select-wrapper select { border: none; outline: none; font-size: 0.9rem; color: var(--text-main); cursor: pointer; background: transparent; font-weight: 500; }

//         .table-card { background: var(--white); border-radius: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid var(--border); }
//         .table-responsive { overflow-x: auto; }
//         table { width: 100%; border-collapse: collapse; min-width: 800px; }
//         th { text-align: left; padding: 16px 24px; color: var(--text-muted); font-size: 0.85rem; font-weight: 700; border-bottom: 1px solid var(--border); background: #f8fafc; text-transform: uppercase; letter-spacing: 0.05em; }
//         td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; color: var(--text-main); font-size: 0.95rem; vertical-align: middle; font-weight: 500; }
//         tr:last-child td { border: none; }
//         tr:hover { background: #f8fafc; }

//         .user-cell { display: flex; align-items: center; gap: 12px; }
//         .user-cell img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border); }
//         .fw-600 { font-weight: 700; color: var(--text-main); }
//         .block { display: block; }
//         .text-muted { color: var(--text-muted); }
//         .text-sm { font-size: 0.85rem; }
//         .font-mono { font-family: monospace; font-size: 1rem; color: var(--text-main); font-weight: 600; }

//         .pill { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
//         .pill-purple { background: #e0e7ff; color: #4338ca; }
//         .pill-gray { background: #f1f5f9; color: #475569; }

//         .status-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
//         .status-active { background: #d1fae5; color: #065f46; }
//         .status-banned { background: #fee2e2; color: #991b1b; }
//         .dot { width: 6px; height: 6px; border-radius: 50%; }
//         .dot-green { background: #059669; }
//         .dot-red { background: #dc2626; }

//         .action-btn { padding: 6px 12px; border: 1px solid; border-radius: 6px; font-weight: 600; font-size: 0.8rem; cursor: pointer; transition: 0.2s; background: white; }
//         .btn-ban { border-color: #fecaca; color: #dc2626; }
//         .btn-ban:hover { background: #fee2e2; }
//         .btn-unban { border-color: #a7f3d0; color: #059669; }
//         .btn-unban:hover { background: #d1fae5; }

//         .pagination-footer { padding: 16px 24px; border-top: 1px solid var(--border); color: var(--text-muted); font-size: 0.9rem; text-align: right; background: #f8fafc; font-weight: 500; }
//         .empty-state { text-align: center; padding: 40px; color: var(--text-muted); font-style: italic; }

//         /* --- 🚨 MODAL STYLES --- */
//         .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 2000; backdrop-filter: blur(4px); animation: fadeIn 0.2s; }
//         .modal-content { background: white; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); overflow: hidden; }
//         .small-modal { width: 380px; }
//         .modal-body { padding: 24px; }
//         .center-text { text-align: center; }
        
//         /* 🚨 IMPROVED ALERT ICON WRAPPER */
//         .alert-icon-wrapper { 
//             background: #fee2e2; 
//             color: #dc2626;
//             width: 50px; 
//             height: 50px; 
//             border-radius: 50%; 
//             display: flex; 
//             align-items: center; 
//             justify-content: center; 
//             margin: 0 auto 16px; 
//             box-shadow: 0 0 0 6px #fef2f2; /* Outer ring effect */
//         }

//         .modal-text { color: #6b7280; margin-bottom: 24px; font-size: 0.95rem; line-height: 1.5; }
        
//         .modal-actions-row { display: flex; gap: 12px; justify-content: center; }
//         .btn-cancel-flat { background: transparent; border: 1px solid #e5e7eb; padding: 10px 20px; border-radius: 8px; font-weight: 600; color: #374151; cursor: pointer; transition: 0.2s; }
//         .btn-cancel-flat:hover { background: #f9fafb; }
//         .btn-confirm { padding: 10px 24px; border-radius: 8px; font-weight: 600; color: white; border: none; cursor: pointer; transition: 0.2s; }
//         .confirm-red { background: #ef4444; } .confirm-red:hover { background: #dc2626; }
//         .confirm-green { background: #10b981; } .confirm-green:hover { background: #059669; }
        
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

//         @media (max-width: 768px) {
//             .sidebar { width: 70px; padding: 16px 8px; }
//             .logo span, .nav-label, .nav-item span, .badge-count, .nav-footer button span { display: none; }
//             .main-content { margin-left: 70px; padding: 20px; }
//             .filters-bar { flex-direction: column; align-items: stretch; gap: 16px; }
//             .search-wrapper { width: 100%; }
//         }
//       `}</style>
//     </div>
//   );
// }

import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

// --- FIXED API URL DETECTION ---
export const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://skill-0bu7.onrender.com/api'; // Your ACTUAL Render Backend

const Icons = {
  Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Sessions: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><rect x="3" y="4" width="4" height="4" rx="1"/><rect x="3" y="10" width="4" height="4" rx="1"/><rect x="3" y="16" width="4" height="4" rx="1"/></svg>,
  Star: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Filter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Alert: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Calendar: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Wallet: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>,
  Warning: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4m0 4h.01M12 3L2 20h20L12 3z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

export default function AdminUsers() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal States
  const [showBanModal, setShowBanModal] = useState(false);
  const [userToBan, setUserToBan] = useState(null);

  useEffect(() => {
    if (user && user.role !== 'admin') {
        navigate('/dashboard');
        return;
    }
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/users`);
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Failed to load users");
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

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

  const formatNumber = (amount) => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
  
  const getAvatarUrl = (u) => {
    if (!u) return "";
    if (u.avatar && u.avatar.startsWith('http')) return u.avatar;
    if (u.avatar) return `${BASE_URL}${u.avatar}`;
    return `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`;
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'banned' ? u.isBanned : !u.isBanned);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => !u.isBanned).length,
    banned: users.filter(u => u.isBanned).length,
    admins: users.filter(u => u.role === 'admin').length,
    usersCount: users.filter(u => u.role === 'user').length
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="admin-users">
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
            <h1 className="page-title">Users</h1>
            <div className="page-breadcrumb">
              <Link to="/admin">Home</Link>
              <span>/</span>
              <span className="active">Users</span>
            </div>
          </div>
        </header>

        <div className="content">
          {/* STATS CARDS */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">
                <Icons.Users />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Users</span>
                <span className="stat-value">{stats.total}</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon green">
                <span>✅</span>
              </div>
              <div className="stat-content">
                <span className="stat-label">Active Users</span>
                <span className="stat-value">{stats.active}</span>
                <span className="stat-sub">{((stats.active / stats.total) * 100 || 0).toFixed(1)}% of total</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon red">
                <span>⛔</span>
              </div>
              <div className="stat-content">
                <span className="stat-label">Banned Users</span>
                <span className="stat-value">{stats.banned}</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon blue">
                <span>👑</span>
              </div>
              <div className="stat-content">
                <span className="stat-label">Admins</span>
                <span className="stat-value">{stats.admins}</span>
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="filters-card">
            <div className="search-wrapper">
              <Icons.Search />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-group">
              <div className="filter-wrapper">
                <Icons.Filter />
                <select 
                  value={filterRole} 
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Users</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
              
              <div className="filter-wrapper">
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
            </div>
          </div>

          {/* USERS TABLE */}
          <div className="table-card">
            <div className="table-header">
              <div>
                <h3>All Users</h3>
                <p>Showing {filteredUsers.length} of {users.length} users</p>
              </div>
            </div>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Wallet</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        <span>👥</span>
                        <p>No users found</p>
                        <small>Try adjusting your search or filter</small>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => (
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
                        <td className="date-cell">
                          <div className="date-wrapper">
                            <Icons.Calendar />
                            <span>{formatDate(u.createdAt)}</span>
                          </div>
                        </td>
                        <td className="wallet-cell">
                          <span className="wallet-badge">
                            <Icons.Wallet />
                            {formatNumber(u.walletBalance)}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${u.isBanned ? 'banned' : 'active'}`}>
                            <span className="status-dot"></span>
                            {u.isBanned ? 'Banned' : 'Active'}
                          </span>
                        </td>
                        <td className="actions-cell">
                          {u.role !== 'admin' && (
                            <button 
                              className={`action-btn ${u.isBanned ? 'unban' : 'ban'}`}
                              onClick={() => initiateBan(u)}
                            >
                              {u.isBanned ? 'Unban' : 'Ban'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* BAN MODAL */}
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

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .admin-users {
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

        /* CONTENT */
        .content {
          padding: 32px;
        }

        /* STATS GRID */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
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
          font-size: 1.5rem;
        }

        .stat-icon.purple { background: #eef2ff; color: #6366f1; }
        .stat-icon.green { background: #dcfce7; color: #10b981; }
        .stat-icon.red { background: #fee2e2; color: #ef4444; }
        .stat-icon.blue { background: #e0f2fe; color: #3b82f6; }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
          display: block;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #111827;
          display: block;
          line-height: 1.2;
        }

        .stat-sub {
          font-size: 0.7rem;
          color: #9ca3af;
          display: block;
          margin-top: 4px;
        }

        /* FILTERS */
        .filters-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 24px;
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
          border: 1px solid #e5e7eb;
        }

        .search-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          transition: all 0.2s;
        }

        .search-wrapper:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .search-wrapper input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.9rem;
        }

        .filter-group {
          display: flex;
          gap: 12px;
        }

        .filter-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
        }

        .filter-select {
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.9rem;
          cursor: pointer;
        }

        /* TABLE */
        .table-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .table-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .table-header h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 4px;
          color: #111827;
        }

        .table-header p {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .table-container {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 900px;
        }

        .data-table th {
          text-align: left;
          padding: 12px 24px;
          background: #f9fafb;
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .data-table td {
          padding: 16px 24px;
          border-bottom: 1px solid #f3f4f6;
          font-size: 0.9rem;
          vertical-align: middle;
        }

        .data-table tr:last-child td {
          border-bottom: none;
        }

        .data-table tr:hover td {
          background: #fefefe;
        }

        /* USER CELL */
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
          margin-bottom: 2px;
        }

        .user-email {
          font-size: 0.75rem;
          color: #6b7280;
        }

        /* ROLE BADGE */
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

        /* DATE CELL */
        .date-cell {
          color: #6b7280;
        }

        .date-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* WALLET CELL */
        .wallet-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fef3c7;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 600;
          color: #d97706;
        }

        /* STATUS BADGE */
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

        /* ACTION BUTTONS */
        .actions-cell {
          text-align: right;
        }

        .action-btn {
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.ban {
          background: #fee2e2;
          color: #ef4444;
        }

        .action-btn.ban:hover {
          background: #ef4444;
          color: white;
        }

        .action-btn.unban {
          background: #dcfce7;
          color: #10b981;
        }

        .action-btn.unban:hover {
          background: #10b981;
          color: white;
        }

        /* EMPTY STATE */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #9ca3af;
        }

        .empty-state span {
          font-size: 3rem;
          display: block;
          margin-bottom: 12px;
        }

        .empty-state p {
          font-size: 1rem;
          margin-bottom: 4px;
        }

        .empty-state small {
          font-size: 0.85rem;
        }

        /* LOADER */
        .loader-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          background: #f5f7fb;
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

        /* BAN MODAL */
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

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* RESPONSIVE */
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .main-content {
            margin-left: 0;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .filters-card {
            flex-direction: column;
          }
          .filter-group {
            width: 100%;
            flex-direction: column;
          }
          .filter-wrapper {
            width: 100%;
          }
          .header {
            padding: 12px 20px;
          }
          .content {
            padding: 20px;
          }
          .ban-modal {
            width: 90%;
            padding: 24px;
          }
          .ban-modal-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
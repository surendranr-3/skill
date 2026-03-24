// import { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';
// import { useNavigate, Link, useLocation } from 'react-router-dom';



// const Icons = {
//   Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
//   Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
//   Bag: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>,
//   Star: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
//   Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
//   Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
//   Filter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
// };

// export default function AdminSessions() {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState('all');

//   useEffect(() => {
//     if (user && user.role !== 'admin') { navigate('/dashboard'); return; }
//     axios.get(`${BASE_URL}/api/admin/sessions`)
//       .then(res => { setSessions(res.data); setLoading(false); })
//       .catch(() => setLoading(false));
//   }, [user, navigate]);

//   const formatDate = (d) => d ? new Date(d).toLocaleDateString() + ' ' + new Date(d).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A';
//   const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

//   const filtered = sessions.filter(s => statusFilter === 'all' || s.status === statusFilter);

//   const getStatusColor = (status) => {
//     switch(status) {
//         case 'completed': return { bg: '#d1fae5', text: '#065f46' }; // Green
//         case 'scheduled': return { bg: '#e0f2fe', text: '#0369a1' }; // Blue
//         case 'cancelled': return { bg: '#fee2e2', text: '#991b1b' }; // Red
//         default: return { bg: '#f3f4f6', text: '#4b5563' };
//     }
//   };

//   if (loading) return <div style={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center', background:'#f8f9fa', color:'#000'}}>Loading...</div>;

//   return (
//     <div className="layout">
//       <aside className="sidebar">
//         <div className="logo"><div className="logo-icon">S</div><span>SkillSphere</span></div>
//         <nav className="nav-menu">
//             <div className="nav-label">GENERAL</div>
//             <Link to="/admin" className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}><Icons.Dashboard /> Dashboard</Link>
//             <Link to="/admin/users" className={`nav-item ${location.pathname === '/admin/users' ? 'active' : ''}`}><Icons.Users /> Users</Link>
//             <Link to="/admin/sessions" className={`nav-item ${location.pathname === '/admin/sessions' ? 'active' : ''}`}><Icons.Bag /> Sessions</Link>
//             <Link to="/admin/reviews" className={`nav-item ${location.pathname === '/admin/reviews' ? 'active' : ''}`}><Icons.Star /> Reviews</Link>
//         </nav>
//         <div className="nav-footer"><button onClick={logout} className="nav-item logout-btn"><Icons.Logout /> Logout</button></div>
//       </aside>

//       <main className="main-content">
//         <header className="top-bar">
//             <div className="page-title"><h1>Platform Sessions</h1><p>Track all scheduled, completed, and cancelled sessions.</p></div>
//             <div className="user-profile">
//                 <div className="user-info"><span className="name">{user?.name}</span><span className="role">Admin</span></div>
//                 <img src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt="Profile" className="avatar" />
//             </div>
//         </header>

//         <div className="filters-bar">
//             <div className="filter-group">
//                 <div className="select-wrapper" style={{width: '200px'}}>
//                     <Icons.Filter />
//                     <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
//                         <option value="all">All Statuses</option>
//                         <option value="scheduled">Scheduled</option>
//                         <option value="completed">Completed</option>
//                         <option value="cancelled">Cancelled</option>
//                     </select>
//                 </div>
//             </div>
//         </div>

//         <div className="table-card">
//             <div className="table-responsive">
//                 <table>
//                     <thead><tr><th>Learner</th><th>Mentor</th><th>Skill</th><th>Date & Time</th><th>Amount</th><th>Status</th></tr></thead>
//                     <tbody>
//                         {filtered.map(s => {
//                             const style = getStatusColor(s.status);
//                             return (
//                                 <tr key={s._id}>
//                                     <td className="fw-600 text-main">{s.learner?.name || 'Deleted User'}</td>
//                                     <td className="fw-600 text-main">{s.mentor?.name || 'Deleted User'}</td>
//                                     <td className="text-muted">{s.skill}</td>
//                                     <td className="text-muted">{formatDate(s.startTime)}</td>
//                                     <td className="fw-600 text-main">{formatNumber(s.cost)}</td>
//                                     <td>
//                                         <span className="status-badge" style={{background: style.bg, color: style.text, textTransform: 'uppercase', fontSize: '0.75rem'}}>
//                                             {s.status}
//                                         </span>
//                                     </td>
//                                 </tr>
//                             );
//                         })}
//                         {filtered.length === 0 && <tr><td colSpan="6" className="empty-state">No sessions found.</td></tr>}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//       </main>

//       <style>{`
//         /* Reuse CSS from AdminDashboard/AdminUsers */
//         :root { --bg-dark: #0f172a; --bg-light: #f1f5f9; --white: #ffffff; --primary: #10B981; --text-main: #020617; --text-muted: #4b5563; --border: #e2e8f0; }
//         body { margin: 0; font-family: 'Inter', sans-serif; background: var(--bg-light); color: var(--text-main); }
//         .layout { display: flex; min-height: 100vh; }
//         .sidebar { width: 250px; background: var(--bg-dark); color: #94a3b8; padding: 24px; display: flex; flex-direction: column; position: fixed; height: 100%; }
//         .logo { display: flex; align-items: center; gap: 12px; color: var(--white); font-size: 1.25rem; font-weight: 800; margin-bottom: 40px; }
//         .logo-icon { width: 32px; height: 32px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
//         .nav-menu { flex: 1; display: flex; flex-direction: column; gap: 8px; }
//         .nav-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; margin-bottom: 12px; margin-top: 24px; color: #64748b; }
//         .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; color: inherit; text-decoration: none; transition: 0.2s; font-weight: 500; cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-size: 0.95rem; }
//         .nav-item:hover, .nav-item.active { background: rgba(255,255,255,0.1); color: var(--white); }
//         .nav-item.active { border-left: 3px solid var(--primary); border-radius: 4px 8px 8px 4px; background: rgba(16, 185, 129, 0.1); }
//         .logout-btn { color: #ef4444; margin-top: auto; }
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
//         .select-wrapper { display: flex; align-items: center; gap: 8px; border: 1px solid var(--border); padding: 8px 12px; border-radius: 8px; background: #fff; }
//         .select-wrapper select { border: none; outline: none; font-size: 0.9rem; color: var(--text-main); cursor: pointer; background: transparent; font-weight: 500; width: 100%;}
//         .table-card { background: var(--white); border-radius: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid var(--border); }
//         .table-responsive { overflow-x: auto; }
//         table { width: 100%; border-collapse: collapse; min-width: 800px; }
//         th { text-align: left; padding: 16px 24px; color: var(--text-muted); font-size: 0.85rem; font-weight: 700; border-bottom: 1px solid var(--border); background: #f8fafc; text-transform: uppercase; letter-spacing: 0.05em; }
//         td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; color: var(--text-main); font-size: 0.95rem; vertical-align: middle; font-weight: 500; }
//         tr:last-child td { border: none; }
//         tr:hover { background: #f8fafc; }
//         .fw-600 { font-weight: 700; color: var(--text-main); }
//         .text-main { color: var(--text-main); }
//         .text-muted { color: var(--text-muted); }
//         .status-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
//         .empty-state { text-align: center; padding: 40px; color: var(--text-muted); font-style: italic; }
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
  : 'https://skill-0bu7.onrender.com/api'; // Your ACTUAL Render Backend ? 'http://localhost:5000' : `http://${window.location.hostname}:5000`;

const Icons = {
  Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Sessions: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><rect x="3" y="4" width="4" height="4" rx="1"/><rect x="3" y="10" width="4" height="4" rx="1"/><rect x="3" y="16" width="4" height="4" rx="1"/></svg>,
  Star: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Filter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Calendar: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Clock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  TrendingUp: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
};

export default function AdminSessions() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user && user.role !== 'admin') { 
      navigate('/dashboard'); 
      return; 
    }
    
    axios.get(`${BASE_URL}/api/admin/sessions`)
      .then(res => { 
        setSessions(res.data); 
        setLoading(false); 
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to load sessions");
        setLoading(false);
      });
  }, [user, navigate]);

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'completed': 
        return { bg: '#dcfce7', color: '#10b981', icon: '✅', label: 'Completed' };
      case 'scheduled': 
        return { bg: '#e0f2fe', color: '#3b82f6', icon: '📅', label: 'Scheduled' };
      case 'cancelled': 
        return { bg: '#fee2e2', color: '#ef4444', icon: '❌', label: 'Cancelled' };
      default: 
        return { bg: '#f3f4f6', color: '#6b7280', icon: '⏳', label: status };
    }
  };

  const getAvatarUrl = (u) => {
    if (!u) return "";
    if (u.avatar && u.avatar.startsWith('http')) return u.avatar;
    if (u.avatar) return `${BASE_URL}${u.avatar}`;
    return `https://api.dicebear.com/7.x/initials/svg?seed=${u.name || 'User'}`;
  };

  const filteredSessions = sessions.filter(s => {
    const matchesSearch = 
      s.learner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.mentor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.skill?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: sessions.length,
    completed: sessions.filter(s => s.status === 'completed').length,
    scheduled: sessions.filter(s => s.status === 'scheduled').length,
    cancelled: sessions.filter(s => s.status === 'cancelled').length,
    revenue: sessions.reduce((sum, s) => sum + (s.cost || 0), 0)
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Loading sessions data...</p>
      </div>
    );
  }

  return (
    <div className="admin-sessions">
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
            <h1 className="page-title">Sessions</h1>
            <div className="page-breadcrumb">
              <Link to="/admin">Home</Link>
              <span>/</span>
              <span className="active">Sessions</span>
            </div>
          </div>
        </header>

        <div className="content">
          {/* STATS CARDS */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">
                <Icons.Sessions />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Sessions</span>
                <span className="stat-value">{stats.total}</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon green">
                <span>✅</span>
              </div>
              <div className="stat-content">
                <span className="stat-label">Completed</span>
                <span className="stat-value">{stats.completed}</span>
                <span className="stat-sub">{((stats.completed / stats.total) * 100 || 0).toFixed(1)}% of total</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon blue">
                <span>📅</span>
              </div>
              <div className="stat-content">
                <span className="stat-label">Scheduled</span>
                <span className="stat-value">{stats.scheduled}</span>
                <span className="stat-sub">Upcoming sessions</span>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon orange">
                <Icons.TrendingUp />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Revenue</span>
                <span className="stat-value">{formatNumber(stats.revenue)}</span>
                <span className="stat-sub">From completed sessions</span>
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="filters-card">
            <div className="search-wrapper">
              <Icons.Search />
              <input 
                type="text" 
                placeholder="Search by learner, mentor, or skill..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-wrapper">
              <Icons.Filter />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* SESSIONS TABLE */}
          <div className="table-card">
            <div className="table-header">
              <div>
                <h3>Session History</h3>
                <p>Showing {filteredSessions.length} of {sessions.length} sessions</p>
              </div>
            </div>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Learner</th>
                    <th>Mentor</th>
                    <th>Skill</th>
                    <th>Date & Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        <span>📅</span>
                        <p>No sessions found</p>
                        <small>Try adjusting your search or filter</small>
                      </td>
                    </tr>
                  ) : (
                    filteredSessions.map((session) => {
                      const statusStyle = getStatusStyle(session.status);
                      return (
                        <tr key={session._id}>
                          <td>
                            <div className="user-cell">
                              <img src={getAvatarUrl(session.learner)} alt={session.learner?.name} />
                              <div>
                                <div className="user-name">{session.learner?.name || 'Deleted User'}</div>
                                <div className="user-email">{session.learner?.email || 'No email'}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="user-cell">
                              <img src={getAvatarUrl(session.mentor)} alt={session.mentor?.name} />
                              <div>
                                <div className="user-name">{session.mentor?.name || 'Deleted User'}</div>
                                <div className="user-email">{session.mentor?.email || 'No email'}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="skill-badge">{session.skill}</span>
                          </td>
                          <td>
                            <div className="datetime-cell">
                              <div className="date">
                                <Icons.Calendar />
                                <span>{formatDate(session.startTime)}</span>
                              </div>
                              <div className="time">
                                <Icons.Clock />
                                <span>{formatTime(session.startTime)}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="amount-badge">💰 {formatNumber(session.cost)}</span>
                          </td>
                          <td>
                            <span className={`status-badge ${session.status}`}>
                              <span className="status-icon">{statusStyle.icon}</span>
                              <span>{statusStyle.label}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
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

        .admin-sessions {
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
        .stat-icon.blue { background: #e0f2fe; color: #3b82f6; }
        .stat-icon.orange { background: #fef3c7; color: #f59e0b; }

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

        .filter-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
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

        /* SKILL BADGE */
        .skill-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #f3f4f6;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #374151;
        }

        /* DATETIME CELL */
        .datetime-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .datetime-cell .date, .datetime-cell .time {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: #6b7280;
        }

        /* AMOUNT BADGE */
        .amount-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #fef3c7;
          border-radius: 20px;
          font-weight: 600;
          color: #d97706;
        }

        /* STATUS BADGE */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-badge.completed {
          background: #dcfce7;
          color: #10b981;
        }

        .status-badge.scheduled {
          background: #e0f2fe;
          color: #3b82f6;
        }

        .status-badge.cancelled {
          background: #fee2e2;
          color: #ef4444;
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
          .search-wrapper, .filter-wrapper {
            width: 100%;
          }
          .header {
            padding: 12px 20px;
          }
          .content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
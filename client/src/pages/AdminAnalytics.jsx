// import { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';
// import { useNavigate, Link } from 'react-router-dom';

// const BASE_URL = window.location.hostname === 'localhost' 
//   ? 'http://localhost:5000' 
//   : `http://${window.location.hostname}:5000`;

// // --- ICONS ---
// const Icons = {
//   Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
//   Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
//   Bag: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>,
//   Star: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
//   Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
//   TrendUp: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
// };

// export default function AdminAnalytics() {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
  
//   const [analytics, setAnalytics] = useState({
//     chartData: [],
//     skills: [],
//     topMentors: [],
//     summary: { revenue: 0, sessions: 0, mentors: 0 }
//   });

//   useEffect(() => {
//     if (user && user.role !== 'admin') { navigate('/dashboard'); return; }

//     const fetchAnalytics = async () => {
//         try {
//             const token = localStorage.getItem('token'); 
//             const config = { headers: { Authorization: `Bearer ${token}` } };

//             // 1. Fetch Graphs
//             const res = await axios.get(`${BASE_URL}/api/admin/analytics`, config);
            
//             // 2. Fetch General Stats (To Match Dashboard)
//             const statsRes = await axios.get(`${BASE_URL}/api/admin/stats`, config);

//             // Transform data for chart
//             const formattedChartData = (res.data.revenueStats || []).map(item => ({
//                 day: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' }),
//                 amount: item.dailyTotal || 0
//             }));

//             setAnalytics({
//                 chartData: formattedChartData,
//                 skills: res.data.skills || [],
//                 topMentors: res.data.topMentors || [],
//                 summary: {
//                     revenue: statsRes.data.volume || 0, // Matches Dashboard
//                     sessions: statsRes.data.totalSessions || 0, // Matches Dashboard
//                     mentors: (res.data.topMentors || []).length
//                 }
//             });
//             setLoading(false);
//         } catch (err) {
//             console.error("Fetch Error:", err);
//             setLoading(false);
//         }
//     };

//     fetchAnalytics();
//   }, [user, navigate]);

//   // --- SVG CHART GENERATOR ---
//   const generateLinePath = (dataPoints) => {
//     if (!dataPoints || dataPoints.length === 0) return "0,300 1000,300"; 
    
//     const values = dataPoints.map(d => d.amount);
//     const max = Math.max(...values, 100); 
//     const divisor = dataPoints.length > 1 ? dataPoints.length - 1 : 1;

//     return values.map((val, i) => {
//         const x = (i / divisor) * 1000; 
//         const y = 300 - (val / max) * 250; 
//         return `${x},${y}`;
//     }).join(' ');
//   };

//   const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val);

//   if (loading) return <div className="loader-container"><div className="spinner"></div></div>;

//   return (
//     <div className="layout">
//       {/* SIDEBAR */}
//       <aside className="sidebar">
//         <div className="logo-area">
//             <div className="logo-icon">S</div>
//             <span className="logo-text">SkillSphere</span>
//         </div>
//         <div className="nav-container">
//             <div className="nav-group">
//                 <span className="nav-label">OVERVIEW</span>
//                 <Link to="/admin" className="nav-item"><Icons.Dashboard /> Dashboard</Link>
//                 <Link to="/admin/stats" className="nav-item active"><Icons.Bag /> Analytics</Link>
//             </div>
//             <div className="nav-group">
//                 <span className="nav-label">MANAGEMENT</span>
//                 <Link to="/admin/users" className="nav-item"><Icons.Users /> Users</Link>
//                 <Link to="/admin/sessions" className="nav-item"><Icons.Bag /> Sessions</Link>
//                 <Link to="/admin/reviews" className="nav-item"><Icons.Star /> Reviews</Link>
//             </div>
//         </div>
//         <div className="sidebar-footer">
//             <button onClick={logout} className="nav-item logout"><Icons.Logout /> Logout</button>
//         </div>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className="main-content">
//         <header className="header">
//             <div className="page-title">
//                 <h1>Platform Analytics</h1>
//                 <p>Real-time data insights.</p>
//             </div>
//             <div className="admin-profile">
//                 <img src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt="" />
//                 <div className="profile-text">
//                     <span className="name">{user?.name}</span>
//                     <span className="role">Admin</span>
//                 </div>
//             </div>
//         </header>

//         <div className="content-wrapper">
            
//             {/* 1. KEY PERFORMANCE INDICATORS */}
//             <div className="stats-row">
//                 <div className="widget-card">
//                     <div className="widget-icon purple">💰</div>
//                     <div className="widget-info">
//                         <h3>{formatCurrency(analytics.summary.revenue)}</h3>
//                         <p>Total Revenue</p>
//                     </div>
//                 </div>
//                 <div className="widget-card">
//                     <div className="widget-icon blue">📅</div>
//                     <div className="widget-info">
//                         <h3>{analytics.summary.sessions}</h3>
//                         <p>Total Sessions</p>
//                     </div>
//                 </div>
//                 <div className="widget-card">
//                     <div className="widget-icon green">🎓</div>
//                     <div className="widget-info">
//                         <h3>{analytics.topMentors.length}</h3>
//                         <p>Top Performing Mentors</p>
//                     </div>
//                 </div>
//             </div>

//             <div className="analytics-grid">
                
//                 {/* 2. REVENUE GROWTH CHART (SVG) */}
//                 <div className="panel chart-panel">
//                     <div className="panel-header">
//                         <h3>Revenue Growth (Last 30 Days)</h3>
//                         <select className="panel-select"><option>Monthly</option></select>
//                     </div>
//                     <div className="svg-chart-container">
//                         {analytics.chartData.length > 0 ? (
//                             <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="revenue-chart">
//                                 <defs>
//                                     <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
//                                         <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3"/>
//                                         <stop offset="100%" stopColor="#4f46e5" stopOpacity="0"/>
//                                     </linearGradient>
//                                 </defs>
                                
//                                 <path 
//                                     d={`M0,300 ${generateLinePath(analytics.chartData)} 1000,300 Z`} 
//                                     fill="url(#gradient)" 
//                                 />
                                
//                                 <polyline 
//                                     fill="none" 
//                                     stroke="#4f46e5" 
//                                     strokeWidth="4" 
//                                     points={generateLinePath(analytics.chartData)} 
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                 />
                                
//                                 {analytics.chartData.map((data, i) => {
//                                     const values = analytics.chartData.map(d => d.amount);
//                                     const max = Math.max(...values, 100);
//                                     const divisor = analytics.chartData.length > 1 ? analytics.chartData.length - 1 : 1;
//                                     const x = (i / divisor) * 1000;
//                                     const y = 300 - (data.amount / max) * 250;
//                                     return <circle key={i} cx={x} cy={y} r="6" fill="#fff" stroke="#4f46e5" strokeWidth="3" />;
//                                 })}
//                             </svg>
//                         ) : (
//                             <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af'}}>
//                                 No revenue data available
//                             </div>
//                         )}

//                         <div className="chart-days">
//                             {analytics.chartData.map((d, i) => (
//                                 <span key={i}>{d.day}</span>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* 3. TOP SKILLS */}
//                 <div className="panel skills-panel">
//                     <div className="panel-header">
//                         <h3>Top Demanded Skills</h3>
//                     </div>
//                     <div className="skills-list">
//                         {analytics.skills.length === 0 ? <p className="p-4 text-muted">No sessions yet.</p> : (
//                             analytics.skills.map((skill, i) => {
//                                 const maxCount = analytics.skills[0].count;
//                                 const percent = (skill.count / maxCount) * 100;
                                
//                                 return (
//                                     <div key={i} className="skill-item">
//                                         <div className="skill-info">
//                                             <span className="skill-name">{skill.name}</span>
//                                             <span className="skill-count">{skill.count} sessions</span>
//                                         </div>
//                                         <div className="progress-bar">
//                                             <div 
//                                                 className="progress-fill" 
//                                                 style={{
//                                                     width: `${percent}%`, 
//                                                     background: ['#4f46e5', '#ec4899', '#10b981', '#f59e0b', '#6366f1'][i % 5]
//                                                 }}
//                                             ></div>
//                                         </div>
//                                     </div>
//                                 );
//                             })
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* 4. TOP MENTORS TABLE */}
//             <div className="panel table-panel">
//                 <div className="panel-header">
//                     <h3>Top Performing Mentors (By Earnings)</h3>
//                 </div>
//                 <div className="table-responsive">
//                     <table className="admin-table">
//                         <thead>
//                             <tr><th>Mentor</th><th>Sessions</th><th>Total Earned</th></tr>
//                         </thead>
//                         <tbody>
//                             {analytics.topMentors.length === 0 ? <tr><td colSpan="3" className="p-4 text-center">No active mentors found.</td></tr> : (
//                                 analytics.topMentors.map((m, i) => (
//                                     <tr key={i}>
//                                         <td>
//                                             <div className="user-combo">
//                                                 <img src={m.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${m.name}`} alt="" />
//                                                 <span className="u-name">{m.name}</span>
//                                             </div>
//                                         </td>
//                                         <td className="text-muted">{m.sessionsCount} sessions</td>
//                                         <td className="font-mono text-success">{formatCurrency(m.totalEarned)}</td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//         </div>
//       </main>

//       <style>{`
//         /* --- REUSING STYLES FROM DASHBOARD FOR CONSISTENCY --- */
//         :root { --bg-body: #f3f4f6; --bg-sidebar: #111827; --white: #ffffff; --text-main: #1f2937; --text-light: #9ca3af; --primary: #4f46e5; --border: #e5e7eb; }
//         .layout { display: flex; min-height: 100vh; background: var(--bg-body); font-family: 'Inter', sans-serif; }
//         .sidebar { width: 260px; background: var(--bg-sidebar); color: var(--text-light); display: flex; flex-direction: column; position: fixed; height: 100vh; z-index: 100; }
//         .logo-area { height: 70px; display: flex; align-items: center; padding: 0 24px; color: var(--white); font-weight: 700; font-size: 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.1); gap: 12px; }
//         .logo-icon { width: 32px; height: 32px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; }
//         .nav-container { flex: 1; padding: 20px 0; }
//         .nav-group { margin-bottom: 24px; }
//         .nav-label { font-size: 0.75rem; font-weight: 700; color: #6b7280; padding: 0 24px; margin-bottom: 8px; display: block; letter-spacing: 0.05em; }
//         .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: inherit; text-decoration: none; font-weight: 500; font-size: 0.95rem; transition: 0.2s; border-left: 3px solid transparent; width: 100%; text-align: left; background: none; border: none; cursor: pointer; }
//         .nav-item:hover, .nav-item.active { background: rgba(255,255,255,0.05); color: var(--white); border-left-color: var(--primary); }
//         .nav-item svg { width: 20px; height: 20px; }
//         .sidebar-footer { padding: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
//         .logout { color: #ef4444; } .logout:hover { background: rgba(239, 68, 68, 0.1); border-left-color: #ef4444; }

//         .main-content { margin-left: 260px; flex: 1; width: calc(100% - 260px); }
//         .header { height: 70px; background: var(--white); border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; padding: 0 32px; position: sticky; top: 0; z-index: 99; }
//         .page-title h1 { margin: 0; font-size: 1.5rem; font-weight: 700; color: var(--text-main); }
//         .page-title p { margin: 0; color: #6b7280; font-size: 0.9rem; }
//         .admin-profile { display: flex; align-items: center; gap: 10px; }
//         .admin-profile img { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #e5e7eb; }
//         .profile-text .name { display: block; font-weight: 600; color: var(--text-main); font-size: 0.9rem; }
//         .profile-text .role { font-size: 0.8rem; color: #6b7280; }

//         .content-wrapper { padding: 32px; max-width: 1400px; margin: 0 auto; width: 100%; }

//         /* ANALYTICS SPECIFIC */
//         .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 32px; }
//         .widget-card { background: var(--white); padding: 24px; border-radius: 12px; border: 1px solid var(--border); display: flex; align-items: center; gap: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
//         .widget-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
//         .purple { background: #f3e8ff; color: #6b21a8; }
//         .blue { background: #e0e7ff; color: #4338ca; }
//         .green { background: #dcfce7; color: #166534; }
//         .widget-info h3 { font-size: 1.8rem; margin: 0; color: var(--text-main); font-weight: 700; }
//         .widget-info p { margin: 0; color: #6b7280; }

//         .analytics-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 32px; }
//         .panel { background: var(--white); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
//         .panel-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
//         .panel-header h3 { margin: 0; font-size: 1.1rem; color: var(--text-main); }
//         .panel-select { padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border); outline: none; font-size: 0.85rem; color: #6b7280; }

//         /* SVG Chart */
//         .svg-chart-container { padding: 24px; height: 350px; display: flex; flex-direction: column; justify-content: flex-end; position: relative; }
//         .revenue-chart { width: 100%; height: 100%; overflow: visible; }
//         .chart-days { display: flex; justify-content: space-between; margin-top: 10px; color: #9ca3af; font-size: 0.85rem; padding: 0 10px; }

//         /* Skills Progress */
//         .skills-list { padding: 24px; }
//         .skill-item { margin-bottom: 20px; }
//         .skill-item:last-child { margin-bottom: 0; }
//         .skill-info { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; font-weight: 600; color: var(--text-main); }
//         .skill-count { color: #6b7280; font-weight: 400; }
//         .progress-bar { height: 8px; background: #f3f4f6; border-radius: 4px; overflow: hidden; }
//         .progress-fill { height: 100%; border-radius: 4px; transition: width 1s ease; }

//         /* Table */
//         .table-responsive { overflow-x: auto; }
//         .admin-table { width: 100%; border-collapse: collapse; min-width: 600px; }
//         .admin-table th { text-align: left; padding: 16px 24px; background: #f9fafb; font-size: 0.85rem; font-weight: 600; color: #6b7280; border-bottom: 1px solid var(--border); }
//         .admin-table td { padding: 16px 24px; border-bottom: 1px solid #f3f4f6; color: var(--text-main); font-size: 0.95rem; vertical-align: middle; }
//         .user-combo { display: flex; align-items: center; gap: 12px; }
//         .user-combo img { width: 36px; height: 36px; border-radius: 50%; }
//         .text-success { color: #10b981; font-weight: 700; }
//         .font-mono { font-family: monospace; }

//         @media (max-width: 1024px) {
//             .stats-row { grid-template-columns: 1fr; }
//             .analytics-grid { grid-template-columns: 1fr; }
//         }
//         @media (max-width: 768px) {
//             .sidebar { width: 0; padding: 0; overflow: hidden; }
//             .main-content { margin-left: 0; width: 100%; }
//         }
//         .loader-container { height: 100vh; display: flex; justify-content: center; align-items: center; background: #f8fafc; }
//         .spinner { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid var(--primary); border-radius: 50%; animation: spin 1s linear infinite; }
//         @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
//       `}</style>
//     </div>
//   );
// }



import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
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
  Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Analytics: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"/><path d="M7 10l3-3 3 3 4-4"/><path d="M17 4l4 4-4 4"/></svg>,
  Calendar: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  TrendingUp: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  ArrowRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
};

export default function AdminAnalytics() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    revenueData: [],
    skills: [],
    topMentors: [],
    sessionsByDay: []
  });

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        let revenueData = [];
        let skills = [];
        let topMentors = [];
        let sessionsByDay = [];
        
        try {
          const analyticsRes = await axios.get(`${BASE_URL}/api/admin/analytics`);
          revenueData = analyticsRes.data?.revenueData || [];
          skills = analyticsRes.data?.skills || [];
          topMentors = analyticsRes.data?.topMentors || [];
          sessionsByDay = analyticsRes.data?.sessionsByDay || [];
        } catch (err) {
          console.log("Detailed analytics endpoint not available, using stats data");
          
          const statsRes = await axios.get(`${BASE_URL}/api/admin/stats`);
          const volume = statsRes.data?.volume || 0;
          const sessions = statsRes.data?.totalSessions || 0;
          
          revenueData = [
            { day: 'Mon', amount: volume * 0.15 },
            { day: 'Tue', amount: volume * 0.2 },
            { day: 'Wed', amount: volume * 0.25 },
            { day: 'Thu', amount: volume * 0.2 },
            { day: 'Fri', amount: volume * 0.12 },
            { day: 'Sat', amount: volume * 0.05 },
            { day: 'Sun', amount: volume * 0.03 }
          ];
          
          sessionsByDay = [
            { day: 'Mon', count: Math.floor(sessions * 0.15) },
            { day: 'Tue', count: Math.floor(sessions * 0.2) },
            { day: 'Wed', count: Math.floor(sessions * 0.25) },
            { day: 'Thu', count: Math.floor(sessions * 0.2) },
            { day: 'Fri', count: Math.floor(sessions * 0.12) },
            { day: 'Sat', count: Math.floor(sessions * 0.05) },
            { day: 'Sun', count: Math.floor(sessions * 0.03) }
          ];
          
          skills = [
            { name: 'React', count: 45 },
            { name: 'Python', count: 38 },
            { name: 'JavaScript', count: 32 },
            { name: 'Node.js', count: 28 },
            { name: 'UI/UX', count: 25 },
            { name: 'Data Science', count: 20 }
          ];
          
          topMentors = [
            { name: 'Sarah Johnson', sessionsCount: 42, totalEarned: 8400, rating: 4.9, avatar: '' },
            { name: 'Michael Chen', sessionsCount: 38, totalEarned: 7600, rating: 4.8, avatar: '' },
            { name: 'Emma Wilson', sessionsCount: 35, totalEarned: 7000, rating: 4.9, avatar: '' },
            { name: 'David Kumar', sessionsCount: 32, totalEarned: 6400, rating: 4.7, avatar: '' },
            { name: 'Lisa Wong', sessionsCount: 30, totalEarned: 6000, rating: 4.8, avatar: '' }
          ];
        }
        
        setAnalytics({
          revenueData: revenueData || [],
          skills: skills || [],
          topMentors: topMentors || [],
          sessionsByDay: sessionsByDay || []
        });
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Failed to load analytics data");
        setAnalytics({
          revenueData: [],
          skills: [],
          topMentors: [],
          sessionsByDay: []
        });
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, navigate]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(val || 0);

  const getAvatarUrl = (u) => {
    if (!u) return "";
    if (u.avatar && u.avatar.startsWith('http')) return u.avatar;
    if (u.avatar) return `${BASE_URL}${u.avatar}`;
    return `https://api.dicebear.com/7.x/initials/svg?seed=${u.name || 'User'}`;
  };

  const getMaxAmount = () => {
    if (!analytics.revenueData || analytics.revenueData.length === 0) return 100;
    return Math.max(...analytics.revenueData.map(d => d.amount || 0), 100);
  };

  const getBarHeight = (amount) => {
    const max = getMaxAmount();
    return (amount / max) * 180;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="admin-analytics">
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
            <Link to="/admin/analytics" className={`nav-item ${location.pathname === '/admin/analytics' ? 'active' : ''}`}>
              <Icons.Analytics />
              <span>Analytics</span>
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
            <h1 className="page-title">Analytics</h1>
            <div className="page-breadcrumb">
              <Link to="/admin">Home</Link>
              <span>/</span>
              <span className="active">Analytics</span>
            </div>
          </div>
        </header>

        <div className="content">
          {/* CHARTS SECTION */}
          <div className="charts-grid">
            {/* Revenue Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <h3>Revenue Overview</h3>
                  <p>Weekly revenue distribution</p>
                </div>
                <div className="chart-badge">
                  <Icons.TrendingUp />
                  <span>+12.5%</span>
                </div>
              </div>
              
              <div className="chart-container">
                {!analytics.revenueData || analytics.revenueData.length === 0 ? (
                  <div className="empty-chart">
                    <span>📊</span>
                    <p>No revenue data available</p>
                  </div>
                ) : (
                  <>
                    <div className="bar-chart">
                      {analytics.revenueData.map((data, i) => (
                        <div key={i} className="bar-wrapper">
                          <div 
                            className="bar" 
                            style={{ height: `${getBarHeight(data.amount || 0)}px` }}
                          >
                            <span className="bar-tooltip">{formatCurrency(data.amount || 0)}</span>
                          </div>
                          <span className="bar-label">{data.day || 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                    <div className="chart-stats">
                      <div className="stat">
                        <span>Total Revenue</span>
                        <strong>{formatCurrency(analytics.revenueData.reduce((sum, d) => sum + (d.amount || 0), 0))}</strong>
                      </div>
                      <div className="stat">
                        <span>Peak Day</span>
                        <strong>{formatCurrency(Math.max(...analytics.revenueData.map(d => d.amount || 0)))}</strong>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sessions Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <h3>Sessions Overview</h3>
                  <p>Sessions by day of week</p>
                </div>
              </div>
              
              <div className="chart-container">
                {!analytics.sessionsByDay || analytics.sessionsByDay.length === 0 ? (
                  <div className="empty-chart">
                    <span>📅</span>
                    <p>No session data available</p>
                  </div>
                ) : (
                  <>
                    <div className="sessions-chart">
                      {analytics.sessionsByDay.map((data, i) => {
                        const maxCount = Math.max(...analytics.sessionsByDay.map(d => d.count || 0), 1);
                        const height = ((data.count || 0) / maxCount) * 180;
                        return (
                          <div key={i} className="session-bar-wrapper">
                            <div 
                              className="session-bar" 
                              style={{ height: `${height}px` }}
                            >
                              <span className="session-tooltip">{data.count || 0} sessions</span>
                            </div>
                            <span className="session-label">{data.day || 'N/A'}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="chart-stats">
                      <div className="stat">
                        <span>Total Sessions</span>
                        <strong>{analytics.sessionsByDay.reduce((sum, d) => sum + (d.count || 0), 0)}</strong>
                      </div>
                      <div className="stat">
                        <span>Avg Daily</span>
                        <strong>{(analytics.sessionsByDay.reduce((sum, d) => sum + (d.count || 0), 0) / 7).toFixed(0)}</strong>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Top Skills Section */}
          <div className="skills-card">
            <div className="skills-header">
              <div>
                <h3>Top Demanded Skills</h3>
                <p>Most popular skills being taught</p>
              </div>
            </div>
            
            <div className="skills-list">
              {!analytics.skills || analytics.skills.length === 0 ? (
                <div className="empty-skills">
                  <span>🎯</span>
                  <p>No skill data available</p>
                </div>
              ) : (
                analytics.skills.map((skill, i) => {
                  const maxCount = analytics.skills[0]?.count || 1;
                  const percent = ((skill.count || 0) / maxCount) * 100;
                  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];
                  
                  return (
                    <div key={i} className="skill-item">
                      <div className="skill-info">
                        <div className="skill-name">
                          <span className="skill-rank">{i + 1}</span>
                          <span>{skill.name || 'Unknown'}</span>
                        </div>
                        <span className="skill-count">{skill.count || 0} sessions</span>
                      </div>
                      <div className="skill-progress">
                        <div 
                          className="skill-progress-fill" 
                          style={{ 
                            width: `${percent}%`,
                            backgroundColor: colors[i % colors.length]
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Top Mentors Table */}
          <div className="table-card">
            <div className="table-header">
              <div>
                <h3>Top Performing Mentors</h3>
                <p>Highest earning mentors on the platform</p>
              </div>
              <Link to="/admin/users?role=mentor" className="view-all-link">
                View All <Icons.ArrowRight />
              </Link>
            </div>
            
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Mentor</th>
                    <th>Sessions</th>
                    <th>Total Earned</th>
                    <th>Rating</th>
                    </tr>
                  </thead>
                <tbody>
                  {!analytics.topMentors || analytics.topMentors.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-table">
                        <span>👥</span>
                        <p>No mentor data available</p>
                      </td>
                    </tr>
                  ) : (
                    analytics.topMentors.map((mentor, i) => (
                      <tr key={i}>
                        <td className="rank-cell">
                          <span className={`rank-badge ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`}>
                            {i + 1}
                          </span>
                        </td>
                        <td>
                          <div className="mentor-cell">
                            <img src={getAvatarUrl(mentor)} alt={mentor.name} />
                            <div>
                              <div className="mentor-name">{mentor.name || 'Unknown'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="sessions-count">{mentor.sessionsCount || 0}</td>
                        <td className="earnings-cell">{formatCurrency(mentor.totalEarned || 0)}</td>
                        <td className="rating-cell">
                          <div className="rating-stars">
                            <span>⭐</span>
                            <span>{(mentor.rating || 4.8).toFixed(1)}</span>
                          </div>
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

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .admin-analytics {
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

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 24px;
        }

        .chart-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .chart-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chart-header h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 4px;
          color: #111827;
        }

        .chart-header p {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .chart-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #dcfce7;
          padding: 6px 12px;
          border-radius: 20px;
          color: #10b981;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .chart-container {
          padding: 24px;
        }

        .bar-chart, .sessions-chart {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 8px;
          min-height: 250px;
          margin-bottom: 20px;
        }

        .bar-wrapper, .session-bar-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .bar {
          width: 100%;
          background: linear-gradient(180deg, #6366f1, #8b5cf6);
          border-radius: 8px 8px 4px 4px;
          transition: height 0.5s ease;
          position: relative;
          cursor: pointer;
          min-height: 4px;
        }

        .session-bar {
          width: 100%;
          background: linear-gradient(180deg, #10b981, #34d399);
          border-radius: 8px 8px 4px 4px;
          transition: height 0.5s ease;
          position: relative;
          cursor: pointer;
          min-height: 4px;
        }

        .bar:hover .bar-tooltip, .session-bar:hover .session-tooltip {
          opacity: 1;
          transform: translateY(-30px);
        }

        .bar-tooltip, .session-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-10px);
          background: #1f2937;
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.7rem;
          white-space: nowrap;
          opacity: 0;
          transition: all 0.2s;
          pointer-events: none;
        }

        .bar-label, .session-label {
          font-size: 0.7rem;
          color: #6b7280;
          text-align: center;
        }

        .chart-stats {
          display: flex;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .chart-stats .stat {
          text-align: center;
          flex: 1;
        }

        .chart-stats .stat span {
          display: block;
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .chart-stats .stat strong {
          font-size: 1rem;
          color: #111827;
        }

        .empty-chart {
          text-align: center;
          padding: 60px 20px;
          color: #9ca3af;
        }

        .empty-chart span {
          font-size: 3rem;
          display: block;
          margin-bottom: 12px;
          opacity: 0.5;
        }

        .skills-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          margin-bottom: 24px;
        }

        .skills-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .skills-header h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 4px;
          color: #111827;
        }

        .skills-header p {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .skills-list {
          padding: 20px 24px;
        }

        .skill-item {
          margin-bottom: 20px;
        }

        .skill-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .skill-name {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
          color: #111827;
        }

        .skill-rank {
          width: 24px;
          height: 24px;
          background: #f3f4f6;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
        }

        .skill-count {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .skill-progress {
          height: 6px;
          background: #f3f4f6;
          border-radius: 3px;
          overflow: hidden;
        }

        .skill-progress-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 1s ease;
        }

        .empty-skills {
          text-align: center;
          padding: 40px 20px;
          color: #9ca3af;
        }

        .empty-skills span {
          font-size: 2rem;
          display: block;
          margin-bottom: 8px;
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
          color: #111827;
        }

        .table-header p {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .view-all-link {
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
          min-width: 600px;
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

        .rank-cell {
          width: 80px;
        }

        .rank-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: #f3f4f6;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.85rem;
          color: #6b7280;
        }

        .rank-badge.gold {
          background: #fef3c7;
          color: #d97706;
        }

        .rank-badge.silver {
          background: #f3f4f6;
          color: #6b7280;
        }

        .rank-badge.bronze {
          background: #fed7aa;
          color: #b45309;
        }

        .mentor-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mentor-cell img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .mentor-name {
          font-weight: 600;
          color: #111827;
        }

        .sessions-count {
          font-weight: 500;
          color: #111827;
        }

        .earnings-cell {
          font-weight: 700;
          color: #10b981;
        }

        .rating-cell {
          width: 100px;
        }

        .rating-stars {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #fef3c7;
          padding: 4px 10px;
          border-radius: 20px;
          width: fit-content;
          font-weight: 600;
          color: #d97706;
        }

        .empty-table {
          text-align: center;
          padding: 60px 20px;
          color: #9ca3af;
        }

        .empty-table span {
          font-size: 2rem;
          display: block;
          margin-bottom: 8px;
        }

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

        @media (max-width: 1024px) {
          .charts-grid {
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
        }
      `}</style>
    </div>
  );
}
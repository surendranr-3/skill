// import { useContext, useState, useEffect, useRef } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { useSocket } from '../context/SocketContext';
// import { toast } from 'react-toastify';

// export default function Navbar() {
//   // --- HOOKS - ALL HOOKS MUST BE CALLED FIRST, BEFORE ANY CONDITIONS ---
//   const { user, logout } = useContext(AuthContext);
//   const { notifications = [], clearNotifications, socket } = useSocket() || {};
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [localNotifications, setLocalNotifications] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   const dropdownRef = useRef(null);
//   const audioRef = useRef(null);

//   // --- PUBLIC ROUTES WHERE NAVBAR SHOULD BE HIDDEN ---
//   const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
//   const isPublicRoute = publicRoutes.includes(location.pathname);

//   // Initialize audio
//   useEffect(() => {
//     audioRef.current = new Audio('/notification.mp3');
//     audioRef.current.volume = 0.5;
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const handleNotificationClick = () => {
//     setShowDropdown(!showDropdown);
//   };

//   const handleItemClick = (notification) => {
//     // Mark as read when clicked
//     if (!notification.isRead) {
//       setUnreadCount(prev => Math.max(0, prev - 1));
//     }
    
//     // Handle different notification types
//     if (notification.type === 'booking' && notification.bookingId) {
//       // If booking notification, go to dashboard with booking details
//       navigate(`/dashboard?booking=${notification.bookingId}`);
//     } else if (notification.type === 'message' && notification.chatId) {
//       // If message notification, go to messages with specific chat
//       navigate(`/messages?chat=${notification.chatId}`);
//     } else {
//       // Default to dashboard
//       navigate('/dashboard');
//     }
    
//     setShowDropdown(false);
//   };

//   const handleMarkAllRead = (e) => {
//     e.stopPropagation();
//     clearNotifications();
//     setLocalNotifications([]);
//     setUnreadCount(0);
//     toast.info('All notifications marked as read');
//   };

//   // --- CLICK OUTSIDE DROPDOWN ---
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // --- SOCKET NOTIFICATIONS ---
//   useEffect(() => {
//     if (!socket) return;

//     const handleNotif = (data) => {
//       console.log("New Notification:", data);

//       // Add timestamp and unique ID
//       const notification = {
//         ...data,
//         id: Date.now() + Math.random(),
//         timestamp: new Date().toISOString(),
//         isRead: false
//       };

//       setLocalNotifications(prev => [notification, ...prev]);
//       setUnreadCount(prev => prev + 1);

//       // Play sound
//       if (audioRef.current) {
//         audioRef.current.play().catch(e => console.log('Audio play failed:', e));
//       }

//       // Show toast based on type
//       const toastConfig = {
//         position: "bottom-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       };

//       switch(data.type) {
//         case 'system':
//           toast.info(data.text || '📢 New announcement', toastConfig);
//           break;
//         case 'booking':
//           toast.success(data.text || '📅 New booking alert', toastConfig);
//           break;
//         case 'message':
//           toast.info(data.text || '💬 New message', toastConfig);
//           break;
//         case 'payment':
//           toast.success(data.text || '💰 Payment received', toastConfig);
//           break;
//         default:
//           toast.info(data.text || '🔔 New notification', toastConfig);
//       }
//     };

//     socket.on('receive_notification', handleNotif);

//     return () => {
//       socket.off('receive_notification', handleNotif);
//     };
//   }, [socket]);

//   // Update unread count when notifications change
//   useEffect(() => {
//     const unread = [...localNotifications, ...notifications].filter(n => !n.isRead).length;
//     setUnreadCount(unread);
//   }, [localNotifications, notifications]);

//   // --- HELPERS ---
//   const allNotifications = [...localNotifications, ...notifications]
//     .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
//     .slice(0, 20);

//   const getWalletStyle = (amount) => {
//     if (amount > 80) return { background: '#dcfce7', color: '#166534', border: '1px solid #86efac' };
//     if (amount > 40) return { background: '#fef9c3', color: '#854d0e', border: '1px solid #fde047' };
//     return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' };
//   };

//   const getIcon = (type) => {
//     switch(type) {
//       case 'system': return '📢';
//       case 'booking': return '📅';
//       case 'message': return '💬';
//       case 'payment': return '💰';
//       case 'success': return '✅';
//       case 'warning': return '⚠️';
//       case 'error': return '❌';
//       default: return '🔔';
//     }
//   };

//   const getIconColor = (type) => {
//     switch(type) {
//       case 'system': return '#3b82f6';
//       case 'booking': return '#10b981';
//       case 'message': return '#8b5cf6';
//       case 'payment': return '#f59e0b';
//       case 'success': return '#10b981';
//       case 'warning': return '#f59e0b';
//       case 'error': return '#ef4444';
//       default: return '#6b7280';
//     }
//   };

//   const formatTime = (timestamp) => {
//     if (!timestamp) return '';
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diffMs = now - date;
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffMins < 1) return 'Just now';
//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays === 1) return 'Yesterday';
//     if (diffDays < 7) return `${diffDays}d ago`;
//     return date.toLocaleDateString();
//   };

//   // --- EARLY RETURNS MUST COME AFTER ALL HOOKS ---
  
//   // --- ADMIN NAVBAR DISABLED ---
//   if (location.pathname.startsWith('/admin')) {
//     return null;
//   }

//   // --- PUBLIC ROUTES WHERE NAVBAR SHOULD BE HIDDEN ---
//   if (isPublicRoute) {
//     return null;
//   }

//   return (
//     <nav className="navbar">
//       <Link to="/" className="logo">
//         <span className="logo-icon">S</span>
//         <span className="logo-text">SkillSphere</span>
//       </Link>

//       <div className="nav-links">
//         {user ? (
//           <>
//             {user.role === 'admin' ? (
//               <>
//                 <Link to="/admin" className="admin-link">
//                   <span>🛡️</span>
//                   Admin Panel
//                 </Link>
//                 <button onClick={handleLogout} className="logout-btn">
//                   <span>🚪</span>
//                   <span>Logout</span>
//                 </button>
//               </>
//             ) : (
//               user.isOnboarded ? (
//                 <>
//                   {/* Navigation Items with Redesigned Icons */}
//                   <Link to="/marketplace" className="nav-item">
//                     <span className="nav-icon">
//                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
//                         <path d="M12 22V12" />
//                         <path d="M3.3 7L12 12L20.7 7" />
//                         <path d="M7.5 9.5L16.5 4.5" />
//                       </svg>
//                     </span>
//                     <span className="nav-label">Marketplace</span>
//                   </Link>
                  
//                   <Link to="/messages" className="nav-item">
//                     <span className="nav-icon">
//                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//                         <path d="M8 10h.01" />
//                         <path d="M12 10h.01" />
//                         <path d="M16 10h.01" />
//                       </svg>
//                     </span>
//                     <span className="nav-label">Messages</span>
//                   </Link>
                  
//                   <Link to="/dashboard" className="nav-item">
//                     <span className="nav-icon">
//                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <rect x="3" y="3" width="7" height="9" rx="1" />
//                         <rect x="14" y="3" width="7" height="5" rx="1" />
//                         <rect x="14" y="12" width="7" height="9" rx="1" />
//                         <rect x="3" y="16" width="7" height="5" rx="1" />
//                       </svg>
//                     </span>
//                     <span className="nav-label">Dashboard</span>
//                   </Link>
                  
//                   <Link to="/profile" className="nav-item">
//                     <span className="nav-icon">
//                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//                         <circle cx="12" cy="7" r="4" />
//                       </svg>
//                     </span>
//                     <span className="nav-label">Profile</span>
//                   </Link>

//                   {/* Notification Bell with Count */}
//                   <div className="notification-wrapper" ref={dropdownRef}>
//                     <button 
//                       className={`notification-bell ${showDropdown ? 'active' : ''} ${unreadCount > 0 ? 'has-unread' : ''}`}
//                       onClick={handleNotificationClick}
//                       aria-label="Notifications"
//                     >
//                       <svg className="bell-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M12 3C10.8954 3 10 3.89543 10 5V5.2967C7.91906 6.13723 6.5 8.18183 6.5 10.5V15.5L5 17V18H19V17L17.5 15.5V10.5C17.5 8.18183 16.0809 6.13723 14 5.2967V5C14 3.89543 13.1046 3 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                         <path d="M9 18C9 19.6569 10.3431 21 12 21C13.6569 21 15 19.6569 15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//                       </svg>
                      
//                       {unreadCount > 0 && (
//                         <>
//                           <span className="badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
//                           <span className="ring"></span>
//                         </>
//                       )}
//                     </button>

//                     {showDropdown && (
//                       <div className="notifications-dropdown">
//                         <div className="dropdown-header">
//                           <div className="header-title">
//                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                               <path d="M18 8C18 4.68629 15.3137 2 12 2C8.68629 2 6 4.68629 6 8V11.1C6 12.4 5.5 13.6 4.7 14.5L4.5 14.7C3.5 15.9 4.2 17.6 5.8 17.9C10.4 18.7 13.6 18.7 18.2 17.9C19.8 17.6 20.5 15.9 19.5 14.7L19.3 14.5C18.5 13.6 18 12.3 18 11.1V8Z" />
//                               <path d="M9 19C9.3978 20.1646 10.3352 21.0824 11.5178 21.4755C12.7004 21.8686 14.0084 21.693 15 20" />
//                             </svg>
//                             <span>Notifications</span>
//                             {unreadCount > 0 && (
//                               <span className="header-count">{unreadCount} new</span>
//                             )}
//                           </div>
                          
//                           {allNotifications.length > 0 && (
//                             <button className="mark-all-read" onClick={handleMarkAllRead} title="Mark all as read">
//                               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                                 <path d="M20 6L9 17L4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                               </svg>
//                               <span>Mark all read</span>
//                             </button>
//                           )}
//                         </div>

//                         <div className="dropdown-body">
//                           {allNotifications.length === 0 ? (
//                             <div className="empty-state">
//                               <div className="empty-icon">🔔</div>
//                               <div className="empty-title">No notifications</div>
//                               <div className="empty-text">We'll notify you when something arrives</div>
//                             </div>
//                           ) : (
//                             allNotifications.map((n, i) => (
//                               <div
//                                 key={n.id || i}
//                                 onClick={() => handleItemClick(n)}
//                                 className={`notification-item ${!n.isRead ? 'unread' : ''}`}
//                               >
//                                 <div className="item-icon" style={{ backgroundColor: `${getIconColor(n.type)}15` }}>
//                                   <span style={{ color: getIconColor(n.type) }}>{getIcon(n.type)}</span>
//                                 </div>

//                                 <div className="item-content">
//                                   <div className="item-header">
//                                     <span className="item-title">{n.title || 'Notification'}</span>
//                                     <span className="item-time">{formatTime(n.timestamp)}</span>
//                                   </div>
//                                   <div className="item-message">{n.text}</div>
//                                 </div>

//                                 {!n.isRead && <div className="unread-indicator" />}
//                               </div>
//                             ))
//                           )}
//                         </div>

//                         {allNotifications.length > 0 && (
//                           <div className="dropdown-footer">
//                             <span className="footer-text">
//                               Showing {allNotifications.length} recent notification{allNotifications.length !== 1 ? 's' : ''}
//                               {unreadCount > 0 && ` • ${unreadCount} unread`}
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   {/* User Actions - Wallet & Logout */}
//                   <div className="user-actions">
//                     <div className="wallet" style={getWalletStyle(user.balance)}>
//                       <span className="wallet-icon">💰</span>
//                       <span className="wallet-amount">{user.balance}</span>
//                     </div>

//                     <button onClick={handleLogout} className="logout-btn">
//                       <span className="logout-icon">
//                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                           <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//                           <polyline points="16 17 21 12 16 7" />
//                           <line x1="21" y1="12" x2="9" y2="12" />
//                         </svg>
//                       </span>
//                       <span>Logout</span>
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <div className="user-actions">
//                   <span className="muted">Setup in progress...</span>
//                   <button onClick={handleLogout} className="logout-btn">Logout</button>
//                 </div>
//               )
//             )}
//           </>
//         ) : (
//           !isPublicRoute && <Link to="/login" className="login-btn">Login</Link>
//         )}
//       </div>

//       <style>{`
//         .navbar {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 12px 32px;
//           background: rgba(255,255,255,0.95);
//           backdrop-filter: blur(10px);
//           border-bottom: 1px solid #e2e8f0;
//           position: sticky;
//           top: 0;
//           z-index: 1000;
//           font-family: 'Inter', sans-serif;
//         }

//         /* Logo Styles */
//         .logo {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           text-decoration: none;
//           transition: transform 0.2s;
//         }

//         .logo:hover {
//           transform: scale(1.02);
//         }

//         .logo-icon {
//           width: 36px;
//           height: 36px;
//           background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
//           color: white;
//           border-radius: 10px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 700;
//           font-size: 1.2rem;
//           box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
//         }

//         .logo-text {
//           font-size: 1.4rem;
//           font-weight: 700;
//           color: #1e293b;
//           letter-spacing: -0.5px;
//         }

//         .nav-links {
//           display: flex;
//           align-items: center;
//           gap: 20px;
//         }

//         /* Navigation Items with SVG Icons */
//         .nav-item {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 8px 12px;
//           color: #475569;
//           font-weight: 500;
//           text-decoration: none;
//           border-radius: 8px;
//           transition: all 0.2s;
//           position: relative;
//         }

//         .nav-item:hover {
//           background: #f1f5f9;
//           color: #4f46e5;
//         }

//         .nav-icon {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: #64748b;
//           transition: color 0.2s;
//         }

//         .nav-item:hover .nav-icon {
//           color: #4f46e5;
//         }

//         .nav-label {
//           font-size: 0.95rem;
//         }

//         .admin-link {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 8px 12px;
//           color: #ef4444;
//           font-weight: 600;
//           text-decoration: none;
//           border-radius: 8px;
//           transition: all 0.2s;
//         }

//         .admin-link:hover {
//           background: #fef2f2;
//         }

//         /* Notification Bell Styles */
//         .notification-wrapper {
//           position: relative;
//         }

//         .notification-bell {
//           width: 40px;
//           height: 40px;
//           border-radius: 8px;
//           border: none;
//           background: #f8fafc;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           position: relative;
//           transition: all 0.2s;
//           color: #64748b;
//         }

//         .notification-bell:hover {
//           background: #f1f5f9;
//           color: #4f46e5;
//         }

//         .notification-bell.active {
//           background: #eef2ff;
//           color: #4f46e5;
//         }

//         .bell-icon {
//           width: 20px;
//           height: 20px;
//         }

//         /* Notification Count Badge */
//         .badge {
//           position: absolute;
//           top: -4px;
//           right: -4px;
//           background: #ef4444;
//           color: white;
//           font-size: 0.65rem;
//           font-weight: 700;
//           min-width: 18px;
//           height: 18px;
//           border-radius: 9px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 0 4px;
//           box-shadow: 0 2px 5px rgba(239, 68, 68, 0.3);
//           border: 2px solid white;
//           z-index: 2;
//         }

//         .ring {
//           position: absolute;
//           top: -4px;
//           right: -4px;
//           width: 18px;
//           height: 18px;
//           border-radius: 50%;
//           background: #ef4444;
//           animation: ripple 1.5s infinite;
//           opacity: 0.4;
//           z-index: 1;
//         }

//         @keyframes ripple {
//           0% { transform: scale(1); opacity: 0.4; }
//           100% { transform: scale(2); opacity: 0; }
//         }

//         /* Dropdown Styles */
//         .notifications-dropdown {
//           position: absolute;
//           right: -10px;
//           top: 48px;
//           width: 360px;
//           background: white;
//           border-radius: 12px;
//           box-shadow: 0 20px 40px rgba(0,0,0,0.15);
//           border: 1px solid #e2e8f0;
//           overflow: hidden;
//           animation: slideDown 0.25s ease;
//         }

//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .dropdown-header {
//           padding: 14px 16px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           border-bottom: 1px solid #e2e8f0;
//           background: #f8fafc;
//         }

//         .header-title {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           font-weight: 600;
//           color: #1e293b;
//         }

//         .header-title svg {
//           color: #4f46e5;
//         }

//         .header-count {
//           font-size: 0.65rem;
//           background: #4f46e5;
//           color: white;
//           padding: 2px 6px;
//           border-radius: 10px;
//           margin-left: 4px;
//         }

//         .mark-all-read {
//           display: flex;
//           align-items: center;
//           gap: 4px;
//           padding: 4px 8px;
//           background: transparent;
//           border: none;
//           border-radius: 6px;
//           font-size: 0.75rem;
//           color: #4f46e5;
//           font-weight: 500;
//           cursor: pointer;
//           transition: all 0.2s;
//         }

//         .mark-all-read:hover {
//           background: #eef2ff;
//         }

//         .dropdown-body {
//           max-height: 360px;
//           overflow-y: auto;
//         }

//         .notification-item {
//           display: flex;
//           align-items: flex-start;
//           gap: 12px;
//           padding: 14px 16px;
//           cursor: pointer;
//           border-bottom: 1px solid #f1f5f9;
//           transition: all 0.2s;
//           position: relative;
//         }

//         .notification-item:hover {
//           background: #f8fafc;
//         }

//         .notification-item.unread {
//           background: #f0f9ff;
//         }

//         .item-icon {
//           width: 36px;
//           height: 36px;
//           border-radius: 8px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 1.1rem;
//           flex-shrink: 0;
//         }

//         .item-content {
//           flex: 1;
//           min-width: 0;
//         }

//         .item-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 4px;
//         }

//         .item-title {
//           font-size: 0.85rem;
//           font-weight: 600;
//           color: #1e293b;
//         }

//         .item-time {
//           font-size: 0.65rem;
//           color: #94a3b8;
//           font-weight: 500;
//         }

//         .item-message {
//           font-size: 0.8rem;
//           color: #64748b;
//           line-height: 1.4;
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }

//         .unread-indicator {
//           width: 6px;
//           height: 6px;
//           background: #4f46e5;
//           border-radius: 50%;
//           align-self: center;
//           flex-shrink: 0;
//         }

//         .dropdown-footer {
//           padding: 12px 16px;
//           border-top: 1px solid #e2e8f0;
//           background: #f8fafc;
//           text-align: center;
//         }

//         .footer-text {
//           font-size: 0.75rem;
//           color: #64748b;
//         }

//         /* Empty State */
//         .empty-state {
//           padding: 32px 20px;
//           text-align: center;
//         }

//         .empty-icon {
//           font-size: 2.5rem;
//           margin-bottom: 8px;
//           opacity: 0.5;
//         }

//         .empty-title {
//           font-size: 0.9rem;
//           font-weight: 600;
//           color: #64748b;
//           margin-bottom: 4px;
//         }

//         .empty-text {
//           font-size: 0.8rem;
//           color: #94a3b8;
//         }

//         /* Wallet Styles */
//         .wallet {
//           padding: 6px 14px;
//           border-radius: 30px;
//           font-weight: 600;
//           font-size: 0.9rem;
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           transition: all 0.2s;
//           cursor: default;
//           background: #f8fafc;
//           border: 1px solid #e2e8f0;
//         }

//         .wallet:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(0,0,0,0.05);
//         }

//         .wallet-icon {
//           font-size: 1rem;
//         }

//         .wallet-amount {
//           font-weight: 700;
//         }

//         .user-actions {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           margin-left: 8px;
//         }

//         /* Logout Button with SVG */
//         .logout-btn {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           padding: 6px 14px;
//           background: #f1f5f9;
//           color: #475569;
//           border: 1px solid #e2e8f0;
//           border-radius: 8px;
//           cursor: pointer;
//           font-weight: 500;
//           font-size: 0.9rem;
//           transition: all 0.2s;
//         }

//         .logout-btn:hover {
//           background: #fee2e2;
//           color: #ef4444;
//           border-color: #fecaca;
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
//         }

//         .logout-icon {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .login-btn {
//           background: #4f46e5;
//           color: white;
//           padding: 8px 20px;
//           border-radius: 8px;
//           text-decoration: none;
//           font-weight: 600;
//           font-size: 0.9rem;
//           transition: all 0.2s;
//         }

//         .login-btn:hover {
//           background: #4338ca;
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
//         }

//         .muted {
//           color: #94a3b8;
//           font-size: 0.9rem;
//         }

//         /* Scrollbar */
//         .dropdown-body::-webkit-scrollbar {
//           width: 4px;
//         }

//         .dropdown-body::-webkit-scrollbar-track {
//           background: #f1f5f9;
//         }

//         .dropdown-body::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 2px;
//         }

//         .dropdown-body::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }

//         /* Responsive */
//         @media (max-width: 1024px) {
//           .navbar {
//             padding: 10px 20px;
//           }
//         }

//         @media (max-width: 768px) {
//           .nav-links {
//             gap: 8px;
//           }

//           .nav-label {
//             display: none;
//           }

//           .nav-item {
//             padding: 8px;
//           }

//           .nav-icon svg {
//             width: 22px;
//             height: 22px;
//           }

//           .notifications-dropdown {
//             width: 320px;
//             right: -5px;
//           }

//           .wallet span:last-child {
//             display: none;
//           }

//           .wallet {
//             padding: 8px;
//           }

//           .logout-btn span:last-child {
//             display: none;
//           }

//           .logout-btn {
//             padding: 8px;
//           }
//         }

//         @media (max-width: 480px) {
//           .logo-text {
//             display: none;
//           }

//           .notifications-dropdown {
//             width: 280px;
//             right: -50px;
//           }
//         }
//       `}</style>
//     </nav>
//   );
// }


import { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';

export default function Navbar() {
  // --- HOOKS - ALL HOOKS MUST BE CALLED FIRST, BEFORE ANY CONDITIONS ---
  const { user, logout } = useContext(AuthContext);
  const { notifications = [], clearNotifications, socket } = useSocket() || {};
  const navigate = useNavigate();
  const location = useLocation();

  const [localNotifications, setLocalNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef(null);
  const audioRef = useRef(null);

  // --- PUBLIC ROUTES WHERE NAVBAR SHOULD BE HIDDEN ---
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
    audioRef.current.volume = 0.5;
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = () => {
    setShowDropdown(!showDropdown);
  };

  // SIMPLE HANDLER - Just based on notification type
  const handleItemClick = (notification) => {
    // Mark as read when clicked
    if (!notification.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    
    // Simple routing based on notification type
    if (notification.type === 'message') {
      navigate('/messages');  // Go to messages page
    } 
    else if (notification.type === 'booking') {
      navigate('/dashboard');  // Go to dashboard
    }
    else {
      navigate('/dashboard');  // Default to dashboard
    }
    
    setShowDropdown(false);
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    clearNotifications();
    setLocalNotifications([]);
    setUnreadCount(0);
    toast.info('All notifications marked as read');
  };

  // --- CLICK OUTSIDE DROPDOWN ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- SOCKET NOTIFICATIONS ---
  useEffect(() => {
    if (!socket) return;

    const handleNotif = (data) => {
      console.log("New Notification:", data);

      // Add timestamp and unique ID
      const notification = {
        ...data,
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        isRead: false
      };

      setLocalNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Play sound
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }

      // Show toast based on type
      const toastConfig = {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      };

      switch(data.type) {
        case 'system':
          toast.info(data.text || '📢 New announcement', toastConfig);
          break;
        case 'booking':
          toast.success(data.text || '📅 New booking alert', toastConfig);
          break;
        case 'message':
          toast.info(data.text || '💬 New message', toastConfig);
          break;
        case 'payment':
          toast.success(data.text || '💰 Payment received', toastConfig);
          break;
        default:
          toast.info(data.text || '🔔 New notification', toastConfig);
      }
    };

    socket.on('receive_notification', handleNotif);

    return () => {
      socket.off('receive_notification', handleNotif);
    };
  }, [socket]);

  // Update unread count when notifications change
  useEffect(() => {
    const unread = [...localNotifications, ...notifications].filter(n => !n.isRead).length;
    setUnreadCount(unread);
  }, [localNotifications, notifications]);

  // --- HELPERS ---
  const allNotifications = [...localNotifications, ...notifications]
    .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
    .slice(0, 20);

  const getWalletStyle = (amount) => {
    if (amount > 80) return { background: '#dcfce7', color: '#166534', border: '1px solid #86efac' };
    if (amount > 40) return { background: '#fef9c3', color: '#854d0e', border: '1px solid #fde047' };
    return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' };
  };

  const getIcon = (type) => {
    switch(type) {
      case 'system': return '📢';
      case 'booking': return '📅';
      case 'message': return '💬';
      case 'payment': return '💰';
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '🔔';
    }
  };

  const getIconColor = (type) => {
    switch(type) {
      case 'system': return '#3b82f6';
      case 'booking': return '#10b981';
      case 'message': return '#8b5cf6';
      case 'payment': return '#f59e0b';
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // --- EARLY RETURNS MUST COME AFTER ALL HOOKS ---
  
  // --- ADMIN NAVBAR DISABLED ---
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  // --- PUBLIC ROUTES WHERE NAVBAR SHOULD BE HIDDEN ---
  if (isPublicRoute) {
    return null;
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="logo-icon">S</span>
        <span className="logo-text">SkillSphere</span>
      </Link>

      <div className="nav-links">
        {user ? (
          <>
            {user.role === 'admin' ? (
              <>
                <Link to="/admin" className="admin-link">
                  <span>🛡️</span>
                  Admin Panel
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              user.isOnboarded ? (
                <>
                  {/* Navigation Items */}
                  <Link to="/marketplace" className="nav-item">
                    <span className="nav-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <path d="M12 22V12" />
                        <path d="M3.3 7L12 12L20.7 7" />
                        <path d="M7.5 9.5L16.5 4.5" />
                      </svg>
                    </span>
                    <span className="nav-label">Marketplace</span>
                  </Link>
                  
                  <Link to="/messages" className="nav-item">
                    <span className="nav-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        <path d="M8 10h.01" />
                        <path d="M12 10h.01" />
                        <path d="M16 10h.01" />
                      </svg>
                    </span>
                    <span className="nav-label">Messages</span>
                  </Link>
                  
                  <Link to="/dashboard" className="nav-item">
                    <span className="nav-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="9" rx="1" />
                        <rect x="14" y="3" width="7" height="5" rx="1" />
                        <rect x="14" y="12" width="7" height="9" rx="1" />
                        <rect x="3" y="16" width="7" height="5" rx="1" />
                      </svg>
                    </span>
                    <span className="nav-label">Dashboard</span>
                  </Link>
                  
                  <Link to="/profile" className="nav-item">
                    <span className="nav-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <span className="nav-label">Profile</span>
                  </Link>

                  {/* Notification Bell */}
                  <div className="notification-wrapper" ref={dropdownRef}>
                    <button 
                      className={`notification-bell ${showDropdown ? 'active' : ''} ${unreadCount > 0 ? 'has-unread' : ''}`}
                      onClick={handleNotificationClick}
                      aria-label="Notifications"
                    >
                      <svg className="bell-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3C10.8954 3 10 3.89543 10 5V5.2967C7.91906 6.13723 6.5 8.18183 6.5 10.5V15.5L5 17V18H19V17L17.5 15.5V10.5C17.5 8.18183 16.0809 6.13723 14 5.2967V5C14 3.89543 13.1046 3 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 18C9 19.6569 10.3431 21 12 21C13.6569 21 15 19.6569 15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      
                      {unreadCount > 0 && (
                        <>
                          <span className="badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                          <span className="ring"></span>
                        </>
                      )}
                    </button>

                    {showDropdown && (
                      <div className="notifications-dropdown">
                        <div className="dropdown-header">
                          <div className="header-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M18 8C18 4.68629 15.3137 2 12 2C8.68629 2 6 4.68629 6 8V11.1C6 12.4 5.5 13.6 4.7 14.5L4.5 14.7C3.5 15.9 4.2 17.6 5.8 17.9C10.4 18.7 13.6 18.7 18.2 17.9C19.8 17.6 20.5 15.9 19.5 14.7L19.3 14.5C18.5 13.6 18 12.3 18 11.1V8Z" />
                              <path d="M9 19C9.3978 20.1646 10.3352 21.0824 11.5178 21.4755C12.7004 21.8686 14.0084 21.693 15 20" />
                            </svg>
                            <span>Notifications</span>
                            {unreadCount > 0 && (
                              <span className="header-count">{unreadCount} new</span>
                            )}
                          </div>
                          
                          {allNotifications.length > 0 && (
                            <button className="mark-all-read" onClick={handleMarkAllRead} title="Mark all as read">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M20 6L9 17L4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span>Mark all read</span>
                            </button>
                          )}
                        </div>

                        <div className="dropdown-body">
                          {allNotifications.length === 0 ? (
                            <div className="empty-state">
                              <div className="empty-icon">🔔</div>
                              <div className="empty-title">No notifications</div>
                              <div className="empty-text">We'll notify you when something arrives</div>
                            </div>
                          ) : (
                            allNotifications.map((n, i) => (
                              <div
                                key={n.id || i}
                                onClick={() => handleItemClick(n)}
                                className={`notification-item ${!n.isRead ? 'unread' : ''}`}
                              >
                                <div className="item-icon" style={{ backgroundColor: `${getIconColor(n.type)}15` }}>
                                  <span style={{ color: getIconColor(n.type) }}>{getIcon(n.type)}</span>
                                </div>

                                <div className="item-content">
                                  <div className="item-header">
                                    <span className="item-title">{n.title || 'Notification'}</span>
                                    <span className="item-time">{formatTime(n.timestamp)}</span>
                                  </div>
                                  <div className="item-message">{n.text}</div>
                                </div>

                                {!n.isRead && <div className="unread-indicator" />}
                              </div>
                            ))
                          )}
                        </div>

                        {allNotifications.length > 0 && (
                          <div className="dropdown-footer">
                            <span className="footer-text">
                              Showing {allNotifications.length} recent notification{allNotifications.length !== 1 ? 's' : ''}
                              {unreadCount > 0 && ` • ${unreadCount} unread`}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* User Actions */}
                  <div className="user-actions">
                    <div className="wallet" style={getWalletStyle(user.balance)}>
                      <span className="wallet-icon">💰</span>
                      <span className="wallet-amount">{user.balance}</span>
                    </div>

                    <button onClick={handleLogout} className="logout-btn">
                      <span className="logout-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                      </span>
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="user-actions">
                  <span className="muted">Setup in progress...</span>
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
              )
            )}
          </>
        ) : (
          !isPublicRoute && <Link to="/login" className="login-btn">Login</Link>
        )}
      </div>

      <style>{`
        /* Your existing styles remain exactly the same */
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 32px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: 'Inter', sans-serif;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          transition: transform 0.2s;
        }

        .logo:hover {
          transform: scale(1.02);
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.2rem;
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
        }

        .logo-text {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.5px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          color: #475569;
          font-weight: 500;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s;
          position: relative;
        }

        .nav-item:hover {
          background: #f1f5f9;
          color: #4f46e5;
        }

        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          transition: color 0.2s;
        }

        .nav-item:hover .nav-icon {
          color: #4f46e5;
        }

        .nav-label {
          font-size: 0.95rem;
        }

        .admin-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          color: #ef4444;
          font-weight: 600;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .admin-link:hover {
          background: #fef2f2;
        }

        .notification-wrapper {
          position: relative;
        }

        .notification-bell {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: none;
          background: #f8fafc;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.2s;
          color: #64748b;
        }

        .notification-bell:hover {
          background: #f1f5f9;
          color: #4f46e5;
        }

        .notification-bell.active {
          background: #eef2ff;
          color: #4f46e5;
        }

        .bell-icon {
          width: 20px;
          height: 20px;
        }

        .badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          box-shadow: 0 2px 5px rgba(239, 68, 68, 0.3);
          border: 2px solid white;
          z-index: 2;
        }

        .ring {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ef4444;
          animation: ripple 1.5s infinite;
          opacity: 0.4;
          z-index: 1;
        }

        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2); opacity: 0; }
        }

        .notifications-dropdown {
          position: absolute;
          right: -10px;
          top: 48px;
          width: 360px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          border: 1px solid #e2e8f0;
          overflow: hidden;
          animation: slideDown 0.25s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-header {
          padding: 14px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #1e293b;
        }

        .header-title svg {
          color: #4f46e5;
        }

        .header-count {
          font-size: 0.65rem;
          background: #4f46e5;
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          margin-left: 4px;
        }

        .mark-all-read {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: transparent;
          border: none;
          border-radius: 6px;
          font-size: 0.75rem;
          color: #4f46e5;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mark-all-read:hover {
          background: #eef2ff;
        }

        .dropdown-body {
          max-height: 360px;
          overflow-y: auto;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          cursor: pointer;
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.2s;
          position: relative;
        }

        .notification-item:hover {
          background: #f8fafc;
        }

        .notification-item.unread {
          background: #f0f9ff;
        }

        .item-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .item-content {
          flex: 1;
          min-width: 0;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .item-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #1e293b;
        }

        .item-time {
          font-size: 0.65rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .item-message {
          font-size: 0.8rem;
          color: #64748b;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .unread-indicator {
          width: 6px;
          height: 6px;
          background: #4f46e5;
          border-radius: 50%;
          align-self: center;
          flex-shrink: 0;
        }

        .dropdown-footer {
          padding: 12px 16px;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
          text-align: center;
        }

        .footer-text {
          font-size: 0.75rem;
          color: #64748b;
        }

        .empty-state {
          padding: 32px 20px;
          text-align: center;
        }

        .empty-icon {
          font-size: 2.5rem;
          margin-bottom: 8px;
          opacity: 0.5;
        }

        .empty-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 4px;
        }

        .empty-text {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .wallet {
          padding: 6px 14px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
          cursor: default;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .wallet:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .wallet-icon {
          font-size: 1rem;
        }

        .wallet-amount {
          font-weight: 700;
        }

        .user-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: 8px;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: #fee2e2;
          color: #ef4444;
          border-color: #fecaca;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
        }

        .logout-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-btn {
          background: #4f46e5;
          color: white;
          padding: 8px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .login-btn:hover {
          background: #4338ca;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .muted {
          color: #94a3b8;
          font-size: 0.9rem;
        }

        .dropdown-body::-webkit-scrollbar {
          width: 4px;
        }

        .dropdown-body::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .dropdown-body::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }

        .dropdown-body::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @media (max-width: 1024px) {
          .navbar {
            padding: 10px 20px;
          }
        }

        @media (max-width: 768px) {
          .nav-links {
            gap: 8px;
          }

          .nav-label {
            display: none;
          }

          .nav-item {
            padding: 8px;
          }

          .nav-icon svg {
            width: 22px;
            height: 22px;
          }

          .notifications-dropdown {
            width: 320px;
            right: -5px;
          }

          .wallet span:last-child {
            display: none;
          }

          .wallet {
            padding: 8px;
          }

          .logout-btn span:last-child {
            display: none;
          }

          .logout-btn {
            padding: 8px;
          }
        }

        @media (max-width: 480px) {
          .logo-text {
            display: none;
          }

          .notifications-dropdown {
            width: 280px;
            right: -50px;
          }
        }
      `}</style>
    </nav>
  );
}
// import { useContext } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Dashboard from './pages/Dashboard';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Profile from './pages/Profile';
// import Marketplace from './pages/Marketplace';
// import AdminAnalytics from './pages/AdminAnalytics';
// import Messages from './pages/Messages';
// import VideoRoom from './pages/VideoRoom';
// import Onboarding from './pages/Onboarding';
// import AdminDashboard from './pages/AdminDashboard';
// import AdminUsers from './pages/AdminUsers';
// import AdminSessions from './pages/AdminSessions';
// import AdminReviews from './pages/AdminReviews';
// import AdminProfile from './pages/AdminProfile';
// import AdminSettings from './pages/AdminSettings';
// import ResetPassword from './pages/ResetPassword';

// import { AuthContext } from './context/AuthContext';

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import './App.css';

// function PrivateRoute({ children }) {
//   const { user, loading } = useContext(AuthContext);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-100">
//         <div className="flex flex-col items-center gap-3">
//           <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
//           <p className="text-gray-600 text-sm">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return user ? children : <Navigate to="/login" />;
// }

// function App() {
//   const showToast = (msg, type) => toast(msg, { type });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
//       {/* Top Navigation */}
//       <Navbar />

//       {/* Toast Notifications */}
//       <ToastContainer position="bottom-right" />

//       {/* Main Page Content */}
//       <div className="max-w-[1400px] mx-auto px-4 py-6">
//         <Routes>

//           {/* Public Routes */}
//           <Route path="/login" element={<Login showToast={showToast} />} />
//           <Route path="/register" element={<Register showToast={showToast} />} />

//           {/* Password Reset */}
//           <Route path="/reset-password/:token" element={<ResetPassword />} />

//           {/* Protected Routes */}
//           <Route
//             path="/onboarding"
//             element={
//               <PrivateRoute>
//                 <Onboarding />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/dashboard"
//             element={
//               <PrivateRoute>
//                 <Dashboard showToast={showToast} />
//               </PrivateRoute>
//             }
//           />

//           <Route path="/" element={<Navigate to="/dashboard" replace />} />

//           <Route
//             path="/profile"
//             element={
//               <PrivateRoute>
//                 <Profile showToast={showToast} />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/marketplace"
//             element={
//               <PrivateRoute>
//                 <Marketplace showToast={showToast} />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/messages"
//             element={
//               <PrivateRoute>
//                 <Messages />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/room/:roomId"
//             element={
//               <PrivateRoute>
//                 <VideoRoom />
//               </PrivateRoute>
//             }
//           />

//           {/* ADMIN ROUTES */}
//           <Route
//             path="/admin"
//             element={
//               <PrivateRoute>
//                 <AdminDashboard />
//               </PrivateRoute>
//             }
//           />

//           {/* Changed from /admin/stats to /admin/analytics */}
//           <Route
//             path="/admin/analytics"
//             element={
//               <PrivateRoute>
//                 <AdminAnalytics />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/admin/users"
//             element={
//               <PrivateRoute>
//                 <AdminUsers />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/admin/sessions"
//             element={
//               <PrivateRoute>
//                 <AdminSessions />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/admin/reviews"
//             element={
//               <PrivateRoute>
//                 <AdminReviews />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/admin/profile"
//             element={
//               <PrivateRoute>
//                 <AdminProfile />
//               </PrivateRoute>
//             }
//           />

//           <Route
//             path="/admin/settings"
//             element={
//               <PrivateRoute>
//                 <AdminSettings />
//               </PrivateRoute>
//             }
//           />

//         </Routes>
//       </div>
//     </div>
//   );
// }

// export default App;

import { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; // added useLocation
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Marketplace from './pages/Marketplace';
import AdminAnalytics from './pages/AdminAnalytics';
import Messages from './pages/Messages';
import VideoRoom from './pages/VideoRoom';
import Onboarding from './pages/Onboarding';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminSessions from './pages/AdminSessions';
import AdminReviews from './pages/AdminReviews';
import AdminProfile from './pages/AdminProfile';
import AdminSettings from './pages/AdminSettings';
import ResetPassword from './pages/ResetPassword';

import { AuthContext } from './context/AuthContext';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}

function App() {
  const location = useLocation();
  const isVideoRoom = location.pathname.startsWith('/room'); // hide navbar on video pages
  const showToast = (msg, type) => toast(msg, { type });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Only render Navbar if not in video room */}
      {!isVideoRoom && <Navbar />}

      {/* Toast Notifications */}
      <ToastContainer position="bottom-right" />

      {/* Main Page Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={<Login showToast={showToast} />} />
          <Route path="/register" element={<Register showToast={showToast} />} />

          {/* Password Reset */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/onboarding"
            element={
              <PrivateRoute>
                <Onboarding />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard showToast={showToast} />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile showToast={showToast} />
              </PrivateRoute>
            }
          />

          <Route
            path="/marketplace"
            element={
              <PrivateRoute>
                <Marketplace showToast={showToast} />
              </PrivateRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <Messages />
              </PrivateRoute>
            }
          />

          <Route
            path="/room/:roomId"
            element={
              <PrivateRoute>
                <VideoRoom />
              </PrivateRoute>
            }
          />

          {/* ADMIN ROUTES */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Changed from /admin/stats to /admin/analytics */}
          <Route
            path="/admin/analytics"
            element={
              <PrivateRoute>
                <AdminAnalytics />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <PrivateRoute>
                <AdminUsers />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/sessions"
            element={
              <PrivateRoute>
                <AdminSessions />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/reviews"
            element={
              <PrivateRoute>
                <AdminReviews />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/profile"
            element={
              <PrivateRoute>
                <AdminProfile />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <PrivateRoute>
                <AdminSettings />
              </PrivateRoute>
            }
          />

        </Routes>
      </div>
    </div>
  );
}

export default App;
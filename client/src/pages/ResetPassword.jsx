// import { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// // Ensure this matches your running backend port


// export default function ResetPassword() {
//   const { token } = useParams();
//   const navigate = useNavigate();
  
//   const [password, setPassword] = useState('');
//   const [confirm, setConfirm] = useState('');
//   const [msg, setMsg] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (password !== confirm) return setError("Passwords do not match");
//     if (password.length < 6) return setError("Password must be at least 6 characters");

//     setLoading(true);
    
//     try {
//       await axios.post(`${BASE_URL}/api/auth/reset-password`, { token, newPassword: password });
//       setMsg("Password updated successfully! Redirecting to login...");
//       setTimeout(() => navigate('/login'), 3000);
//     } catch (err) {
//       setError(err.response?.data?.error || "Token invalid or expired. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-wrapper">
//       <div className="card auth-card">
//         <div className="auth-header">
//           <h2>New Password</h2>
//           <p>Create a strong password to secure your account</p>
//         </div>

//         {error && <div className="alert error">{error}</div>}
//         {msg && <div className="alert success">{msg}</div>}

//         {!msg && (
//           <form onSubmit={handleSubmit}>
//             <div style={{ marginBottom: '15px' }}>
//               <label>New Password</label>
//               {/* 🚨 Fixed: changed 'class' to 'className' */}
//               <input 
//                 type="password" 
//                 className="input" 
//                 onChange={e => setPassword(e.target.value)} 
//                 required 
//                 placeholder="••••••••"
//               />
//             </div>
//             <div style={{ marginBottom: '25px' }}>
//               <label>Confirm Password</label>
//               <input 
//                 type="password" 
//                 className="input" 
//                 onChange={e => setConfirm(e.target.value)} 
//                 required 
//                 placeholder="••••••••"
//               />
//             </div>
//             <button type="submit" className="btn btn-primary full-width" disabled={loading}>
//               {loading ? 'Updating...' : 'Update Password'}
//             </button>
//           </form>
//         )}
//       </div>

//       <style>{`
//         /* --- Page Layout --- */
//         .auth-wrapper {
//           min-height: 100vh;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background-color: #f8fafc;
//           font-family: 'Inter', sans-serif;
//           padding: 20px;
//         }

//         /* --- Card Styles --- */
//         .card {
//           background: white;
//           border-radius: 12px;
//           box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
//           padding: 30px;
//           width: 100%;
//           max-width: 400px;
//         }

//         .auth-header {
//           text-align: center;
//           margin-bottom: 25px;
//         }
//         .auth-header h2 {
//           margin: 0 0 10px 0;
//           color: #1e293b;
//           font-size: 1.5rem;
//           font-weight: 700;
//         }
//         .auth-header p {
//           margin: 0;
//           color: #64748b;
//           font-size: 0.9rem;
//         }

//         /* --- Form Elements --- */
//         label {
//           display: block;
//           margin-bottom: 8px;
//           font-weight: 500;
//           font-size: 0.9rem;
//           color: #334155;
//         }

//         .input {
//           width: 100%;
//           padding: 10px 12px;
//           border: 1px solid #e2e8f0;
//           border-radius: 6px;
//           font-size: 0.95rem;
//           outline: none;
//           transition: border-color 0.2s;
//           box-sizing: border-box; /* Critical for layout */
//         }
//         .input:focus {
//           border-color: #3b82f6;
//           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//         }

//         .btn {
//           padding: 12px;
//           border: none;
//           border-radius: 6px;
//           font-weight: 600;
//           cursor: pointer;
//           font-size: 0.95rem;
//           transition: background 0.2s;
//         }
//         .btn-primary {
//           background: #3b82f6;
//           color: white;
//         }
//         .btn-primary:hover {
//           background: #2563eb;
//         }
//         .btn:disabled {
//           background: #94a3b8;
//           cursor: not-allowed;
//         }
//         .full-width {
//           width: 100%;
//         }

//         /* --- Alerts --- */
//         .alert {
//           padding: 12px;
//           border-radius: 8px;
//           font-size: 0.9rem;
//           margin-bottom: 20px;
//           text-align: center;
//         }
//         .alert.error {
//           background: #fee2e2;
//           color: #991b1b;
//           border: 1px solid #fecaca;
//         }
//         .alert.success {
//           background: #dcfce7;
//           color: #166534;
//           border: 1px solid #bbf7d0;
//         }
//       `}</style>
//     </div>
//   );
// }



import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// --- FIXED API URL DETECTION ---
// --- FIXED API URL DETECTION ---
export const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://skill-0bu7.onrender.com/api'; // Your ACTUAL Render Backend

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthLabel = () => {
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return labels[passwordStrength];
  };

  const getPasswordStrengthColor = () => {
    const colors = ['#ef4444', '#ef4444', '#f59e0b', '#f59e0b', '#10b981', '#10b981'];
    return colors[passwordStrength];
  };

  const getPasswordStrengthWidth = () => {
    return `${(passwordStrength / 5) * 100}%`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError("Passwords do not match");
    if (password.length < 6) return setError("Password must be at least 6 characters");

    setLoading(true);
    
    try {
      await axios.post(`${BASE_URL}/api/auth/reset-password`, { token, newPassword: password });
      setMsg("Password updated successfully! Redirecting to login...");
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Token invalid or expired. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      {/* Animated Background */}
      <div className="reset-bg">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      {/* Main Content */}
      <div className="reset-wrapper">
        <div className="reset-card">
          <div className="card-header">
            <div className="header-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2>Reset Password</h2>
            <p>Create a new password for your account</p>
          </div>

          {error && (
            <div className="alert error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {msg && (
            <div className="alert success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {msg}
            </div>
          )}

          {!msg && (
            <form onSubmit={handleSubmit} className="reset-form">
              <div className="form-group">
                <label>New Password</label>
                <div className="password-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-input"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      calculatePasswordStrength(e.target.value);
                    }} 
                    required 
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                {password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{ 
                          width: getPasswordStrengthWidth(),
                          backgroundColor: getPasswordStrengthColor()
                        }}
                      />
                    </div>
                    <span className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                      {getPasswordStrengthLabel()}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="password-wrapper">
                  <input 
                    type={showConfirm ? "text" : "password"} 
                    className="form-input"
                    onChange={(e) => setConfirm(e.target.value)} 
                    required 
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="password-requirements">
                <div className={`requirement ${password.length >= 8 ? 'met' : ''}`}>
                  <span>{password.length >= 8 ? '✓' : '○'}</span>
                  At least 8 characters
                </div>
                <div className={`requirement ${/[a-z]/.test(password) ? 'met' : ''}`}>
                  <span>{/[a-z]/.test(password) ? '✓' : '○'}</span>
                  One lowercase letter
                </div>
                <div className={`requirement ${/[A-Z]/.test(password) ? 'met' : ''}`}>
                  <span>{/[A-Z]/.test(password) ? '✓' : '○'}</span>
                  One uppercase letter
                </div>
                <div className={`requirement ${/[0-9]/.test(password) ? 'met' : ''}`}>
                  <span>{/[0-9]/.test(password) ? '✓' : '○'}</span>
                  One number
                </div>
                <div className={`requirement ${/[!@#$%^&*]/.test(password) ? 'met' : ''}`}>
                  <span>{/[!@#$%^&*]/.test(password) ? '✓' : '○'}</span>
                  One special character
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>

              <div className="form-footer">
                <Link to="/login">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .reset-container {
          min-height: 100vh;
          width: 100%;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          position: relative;
          overflow: hidden;
          background: #f5f7fb;
        }

        /* Animated Background */
        .reset-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }

        .bg-shape {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          opacity: 0.05;
          animation: float 20s infinite;
        }

        .shape-1 {
          width: 400px;
          height: 400px;
          top: -200px;
          right: -200px;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 300px;
          height: 300px;
          bottom: -150px;
          left: -150px;
          animation-delay: 5s;
        }

        .shape-3 {
          width: 200px;
          height: 200px;
          top: 50%;
          left: 20%;
          animation-delay: 10s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }

        /* Main Wrapper */
        .reset-wrapper {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        /* Card Styles */
        .reset-card {
          width: 100%;
          max-width: 450px;
          background: white;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Header */
        .card-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #6366f1;
        }

        .card-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }

        .card-header p {
          color: #6b7280;
          font-size: 0.95rem;
        }

        /* Form Elements */
        .reset-form {
          margin-top: 8px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .password-wrapper {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s;
          background: #f9fafb;
          outline: none;
        }

        .form-input:focus {
          border-color: #6366f1;
          background: white;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          font-size: 0.85rem;
          font-weight: 500;
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .password-toggle:hover {
          background: #f3f4f6;
          color: #374151;
        }

        /* Password Strength */
        .password-strength {
          margin-top: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .strength-bar {
          flex: 1;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
        }

        .strength-fill {
          height: 100%;
          transition: width 0.3s ease, background-color 0.3s ease;
        }

        .strength-text {
          font-size: 0.75rem;
          font-weight: 600;
          min-width: 70px;
        }

        /* Password Requirements */
        .password-requirements {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin: 16px 0 24px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .requirement {
          font-size: 0.75rem;
          color: #9ca3af;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.2s;
        }

        .requirement.met {
          color: #10b981;
        }

        .requirement span {
          font-size: 0.9rem;
          font-weight: 600;
        }

        /* Submit Button */
        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Form Footer */
        .form-footer {
          text-align: center;
          padding-top: 8px;
        }

        .form-footer a {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #6366f1;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .form-footer a:hover {
          gap: 10px;
          color: #4f46e5;
        }

        /* Alerts */
        .alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 12px;
          font-size: 0.9rem;
          margin-bottom: 24px;
          animation: slideDown 0.3s ease-out;
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

        .alert.error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .alert.success {
          background: #dcfce7;
          color: #10b981;
          border: 1px solid #bbf7d0;
        }

        .alert svg {
          flex-shrink: 0;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .reset-card {
            padding: 32px 24px;
          }

          .password-requirements {
            grid-template-columns: 1fr;
          }

          .card-header h2 {
            font-size: 1.5rem;
          }

          .header-icon {
            width: 56px;
            height: 56px;
          }
        }
      `}</style>
    </div>
  );
}
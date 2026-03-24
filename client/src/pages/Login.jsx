// import { useState, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios'; 

// // --- FIXED API URL DETECTION ---


// export default function Login() {
//   const [view, setView] = useState('login'); 
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [resetEmail, setResetEmail] = useState('');
//   const [error, setError] = useState('');
//   const [successMsg, setSuccessMsg] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
  
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       const res = await axios.post(`${BASE_URL}/api/auth/login`, {
//           email: form.email, 
//           password: form.password
//       });
//       if (res.data && res.data.token) {
//           login(res.data.user, res.data.token);
//           if (res.data.user.role === 'admin') navigate('/admin');
//           else if (res.data.user.isOnboarded) navigate('/dashboard');
//           else navigate('/onboarding');
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || 'Invalid credentials');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgotSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMsg('');
//     setLoading(true);
//     try {
//       await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email: resetEmail });
//       setSuccessMsg(`Reset link sent to ${resetEmail}`);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Could not send link');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <div className="brand-logo">
//             <div className="logo-icon">S</div>
//             <span>SkillSphere</span>
//         </div>

//         {view === 'login' ? (
//           <>
//             <div className="header-text">
//                 <h1>Welcome Back!</h1>
//                 <p>Login to continue your journey</p>
//             </div>

//             {error && <div className="alert error">{error}</div>}

//             <form onSubmit={handleLoginSubmit}>
//               <div className="input-group">
//                 <label>Email Address</label>
//                 <input 
//                   type="email" name="email" 
//                   placeholder="name@example.com" 
//                   onChange={handleChange} required 
//                 />
//               </div>

//               <div className="input-group">
//                 <label>Password</label>
//                 <div className="password-field">
//                     <input 
//                       type={showPassword ? "text" : "password"} 
//                       name="password" 
//                       placeholder="••••••••" 
//                       onChange={handleChange} 
//                       required 
//                     />
//                     <button type="button" className="eye-toggle" onClick={() => setShowPassword(!showPassword)}>
//                         {showPassword ? (
//                             <svg width="20" height="20" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
//                         ) : (
//                             <svg width="20" height="20" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
//                         )}
//                     </button>
//                 </div>
//               </div>

//               <div className="actions">
//                 <span className="forgot-link" onClick={() => setView('forgot')}>Forgot Password?</span>
//               </div>

//               <button type="submit" className="btn-primary" disabled={loading}>
//                 {loading ? <span className="spinner"></span> : 'Login'}
//               </button>
//             </form>

//             <div className="footer-text">
//                 Don't have an account? <Link to="/register">Create Account</Link>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="header-text">
//                 <h1>Reset Password</h1>
//                 <p>We'll send you a link to reset it.</p>
//             </div>

//             {error && <div className="alert error">{error}</div>}
//             {successMsg && <div className="alert success">{successMsg}</div>}

//             {!successMsg && (
//               <form onSubmit={handleForgotSubmit}>
//                 <div className="input-group">
//                   <label>Email Address</label>
//                   <input 
//                     type="email" 
//                     placeholder="Enter your email" 
//                     value={resetEmail}
//                     onChange={(e) => setResetEmail(e.target.value)} 
//                     required 
//                   />
//                 </div>
//                 <button type="submit" className="btn-primary" disabled={loading}>
//                   {loading ? 'Sending...' : 'Send Reset Link'}
//                 </button>
//               </form>
//             )}

//             <div className="footer-text">
//                 <span className="back-link" onClick={() => { setView('login'); setError(''); }}>← Back to Login</span>
//             </div>
//           </>
//         )}
//       </div>

//       <style>{`
//         /* VIBRANT & COLORFUL CSS */
//         .auth-container {
//             min-height: 100vh;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             /* 🌈 Vibrant Gradient Background */
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             font-family: 'Inter', sans-serif;
//             padding: 20px;
//         }
        
//         .auth-card {
//             background: rgba(255, 255, 255, 0.95);
//             backdrop-filter: blur(10px);
//             width: 100%;
//             max-width: 420px;
//             padding: 40px;
//             border-radius: 20px;
//             box-shadow: 0 20px 50px rgba(0,0,0,0.2);
//             border: 1px solid rgba(255,255,255,0.5);
//         }

//         .brand-logo {
//             display: flex;
//             align-items: center;
//             gap: 12px;
//             font-weight: 800;
//             font-size: 1.4rem;
//             color: #4f46e5;
//             margin-bottom: 30px;
//             justify-content: center;
//         }
//         .logo-icon {
//             width: 36px; height: 36px;
//             /* 🌈 Gradient Logo */
//             background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
//             color: white;
//             border-radius: 10px;
//             display: flex; align-items: center; justify-content: center;
//             box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
//         }

//         .header-text { text-align: center; margin-bottom: 30px; }
//         .header-text h1 { font-size: 1.8rem; font-weight: 800; color: #1e293b; margin: 0 0 5px 0; }
//         .header-text p { color: #64748b; margin: 0; font-size: 0.95rem; font-weight: 500; }

//         .input-group { margin-bottom: 20px; }
//         .input-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 8px; }
//         .input-group input {
//             width: 100%;
//             padding: 12px 16px;
//             border: 2px solid #e2e8f0;
//             border-radius: 12px;
//             font-size: 0.95rem;
//             color: #334155;
//             outline: none;
//             transition: all 0.2s;
//             box-sizing: border-box;
//             background: #f8fafc;
//         }
//         /* 🌈 Colored Focus State */
//         .input-group input:focus { 
//             border-color: #6366f1; 
//             background: white; 
//             box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); 
//         }

//         .password-field { position: relative; }
//         .password-field input { padding-right: 45px; }
//         .eye-toggle {
//             position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
//             background: none; border: none; cursor: pointer; padding: 4px;
//             display: flex; align-items: center; transition: opacity 0.2s;
//         }
//         .eye-toggle:hover { opacity: 0.7; }

//         .actions { display: flex; justify-content: flex-end; margin-bottom: 24px; }
//         .forgot-link, .back-link { font-size: 0.9rem; color: #6366f1; font-weight: 600; cursor: pointer; transition: color 0.2s; }
//         .forgot-link:hover, .back-link:hover { color: #4f46e5; text-decoration: underline; }

//         .btn-primary {
//             width: 100%;
//             padding: 14px;
//             /* 🌈 Vibrant Gradient Button */
//             background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
//             color: white;
//             border: none;
//             border-radius: 12px;
//             font-size: 1rem;
//             font-weight: 700;
//             cursor: pointer;
//             transition: transform 0.1s, box-shadow 0.2s;
//             box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
//         }
//         .btn-primary:hover { 
//             transform: translateY(-2px); 
//             box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35); 
//         }
//         .btn-primary:active { transform: scale(0.98); }
//         .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

//         .footer-text { text-align: center; margin-top: 24px; font-size: 0.95rem; color: #64748b; }
//         .footer-text a { color: #6366f1; text-decoration: none; font-weight: 700; }
//         .footer-text a:hover { color: #4f46e5; text-decoration: underline; }

//         .alert { padding: 12px; border-radius: 10px; font-size: 0.9rem; text-align: center; margin-bottom: 20px; font-weight: 600; }
//         .error { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }
//         .success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }

//         .spinner {
//             display: inline-block; width: 20px; height: 20px; 
//             border: 3px solid rgba(255,255,255,0.3); 
//             border-radius: 50%; border-top-color: #fff; 
//             animation: spin 1s ease-in-out infinite;
//         }
//         @keyframes spin { to { transform: rotate(360deg); } }
//       `}</style>
//     </div>
//   );
// }



import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// --- FIXED API URL DETECTION ---
export const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://skill-0bu7.onrender.com/api'; // Your ACTUAL Render Backend

export default function Login() {

  const [view, setView] = useState('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: form.email,
        password: form.password
      });

      if (res.data && res.data.token) {
        login(res.data.user, res.data.token);
        if (res.data.user.role === 'admin') navigate('/admin');
        else if (res.data.user.isOnboarded) navigate('/dashboard');
        else navigate('/onboarding');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email: resetEmail });
      setSuccessMsg(`Reset link sent to ${resetEmail}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not send reset link');
    } finally {
      setLoading(false);
    }
  };

  const getFieldClass = (fieldName) => {
    if (touched[fieldName]) {
      return form[fieldName] ? 'input-valid' : 'input-error';
    }
    return '';
  };

  return (
    <div className="login-container">
      {/* Clean Background */}
      <div className="background">
        <div className="gradient-orb or-1"></div>
        <div className="gradient-orb or-2"></div>
      </div>

      {/* Main Content */}
      <div className="login-wrapper">
        {/* Left Side - Brand */}
        <div className="brand-section">
          <div className="brand-content">
            <div className="brand-logo">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <h1>Welcome Back</h1>
            <p className="brand-tagline">
              Continue your learning journey with SkillSphere
            </p>

            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">📚</div>
                <h3>Learn</h3>
                <p>Access personalized mentorship</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">💡</div>
                <h3>Teach</h3>
                <p>Share your expertise</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🤝</div>
                <h3>Connect</h3>
                <p>Build your network</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="form-section">
          <div className="form-card">
            {view === 'login' ? (
              <>
                <div className="form-header">
                  <h2>Sign in</h2>
                  <p>Welcome back! Please enter your details</p>
                </div>

                {error && (
                  <div className="alert-error">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                      <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/>
                      <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/>
                    </svg>
                    {error}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit}>
                  <div className="form-group">
                    <label>Email address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getFieldClass('email')}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <div className="password-field">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getFieldClass('password')}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <div className="form-links">
                    <span
                      className="forgot-link"
                      onClick={() => setView('forgot')}
                    >
                      Forgot password?
                    </span>
                  </div>

                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </form>

                <div className="form-footer">
                  <span>Don't have an account?</span>
                  <Link to="/register">Create account</Link>
                </div>
              </>
            ) : (
              <>
                <div className="form-header">
                  <h2>Reset password</h2>
                  <p>Enter your email to receive a reset link</p>
                </div>

                {error && (
                  <div className="alert-error">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                      <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/>
                      <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/>
                    </svg>
                    {error}
                  </div>
                )}

                {successMsg && (
                  <div className="alert-success">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                      <path d="M8 12L11 15L16 9" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    {successMsg}
                  </div>
                )}

                {!successMsg && (
                  <form onSubmit={handleForgotSubmit}>
                    <div className="form-group">
                      <label>Email address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                      {loading ? 'Sending...' : 'Send reset link'}
                    </button>
                  </form>
                )}

                <div className="form-footer">
                  <span
                    className="back-link"
                    onClick={() => {
                      setView('login');
                      setError('');
                      setSuccessMsg('');
                    }}
                  >
                    ← Back to sign in
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-container {
          min-height: 100vh;
          width: 100%;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          position: relative;
          background: #f8fafc;
        }

        /* Background */
        .background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
        }

        .or-1 {
          width: 600px;
          height: 600px;
          background: rgba(99, 102, 241, 0.08);
          top: -300px;
          right: -300px;
        }

        .or-2 {
          width: 500px;
          height: 500px;
          background: rgba(139, 92, 246, 0.08);
          bottom: -250px;
          left: -250px;
        }

        /* Main wrapper */
        .login-wrapper {
          position: relative;
          min-height: 100vh;
          display: flex;
          z-index: 1;
        }

        /* Left brand section */
        .brand-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        }

        .brand-content {
          max-width: 480px;
          text-align: center;
          color: white;
        }

        .brand-logo {
          margin-bottom: 2rem;
        }

        .brand-logo svg {
          stroke: white;
          width: 64px;
          height: 64px;
        }

        .brand-section h1 {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .brand-tagline {
          font-size: 1.2rem;
          line-height: 1.6;
          opacity: 0.9;
          margin-bottom: 3rem;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem 1rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.2s;
        }

        .feature-card:hover {
          transform: translateY(-4px);
        }

        .feature-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .feature-card p {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        /* Right form section */
        .form-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: white;
        }

        .form-card {
          width: 100%;
          max-width: 400px;
        }

        .form-header {
          margin-bottom: 2rem;
        }

        .form-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #111;
          margin-bottom: 0.5rem;
        }

        .form-header p {
          color: #666;
          font-size: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s;
          background: white;
        }

        .form-group input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }

        .form-group input.input-error {
          border-color: #ef4444;
        }

        .form-group input.input-valid {
          border-color: #10b981;
        }

        .password-field {
          position: relative;
        }

        .password-field input {
          padding-right: 5rem;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          font-size: 0.9rem;
          font-weight: 500;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .password-toggle:hover {
          background: #f0f0f0;
          color: #111;
        }

        .form-links {
          text-align: right;
          margin-bottom: 1.5rem;
        }

        .forgot-link {
          color: #4f46e5;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #4338ca;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .alert-error {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 12px;
          color: #ef4444;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .alert-success {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #dcfce7;
          border: 1px solid #86efac;
          border-radius: 12px;
          color: #166534;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-right: 0.5rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .form-footer {
          margin-top: 2rem;
          text-align: center;
          color: #666;
          font-size: 1rem;
        }

        .form-footer a {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 600;
          margin-left: 0.5rem;
        }

        .form-footer a:hover {
          text-decoration: underline;
        }

        .back-link {
          color: #4f46e5;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-link:hover {
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 968px) {
          .login-wrapper {
            flex-direction: column;
          }

          .brand-section {
            padding: 3rem 2rem;
          }

          .feature-grid {
            max-width: 500px;
            margin: 0 auto;
          }
        }

        @media (max-width: 480px) {
          .brand-section h1 {
            font-size: 2.5rem;
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
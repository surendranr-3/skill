// import { useState } from 'react'; 
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios'; 



// export default function Register({ showToast }) {
//   const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState(0);
  
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
    
//     // Real-time validation
//     validateField(name, value);
    
//     // Check password strength for password field
//     if (name === 'password') {
//       calculatePasswordStrength(value);
//     }
//   };

//   const handleBlur = (e) => {
//     const { name } = e.target;
//     setTouched({ ...touched, [name]: true });
//     validateField(name, form[name]);
//   };

//   const calculatePasswordStrength = (password) => {
//     let strength = 0;
    
//     if (password.length >= 6) strength += 1;
//     if (password.length >= 8) strength += 1;
//     if (/[A-Z]/.test(password)) strength += 1;
//     if (/[0-9]/.test(password)) strength += 1;
//     if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
//     setPasswordStrength(strength);
//   };

//   const validateField = (name, value) => {
//     let error = '';
    
//     switch(name) {
//       case 'name':
//         if (!value.trim()) {
//           error = 'Full name is required';
//         } else if (value.trim().length < 2) {
//           error = 'Name must be at least 2 characters';
//         } else if (value.trim().length > 50) {
//           error = 'Name must be less than 50 characters';
//         } else if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
//           error = 'Name can only contain letters, spaces, hyphens and apostrophes';
//         }
//         break;
        
//       case 'email':
//         if (!value) {
//           error = 'Email is required';
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//           error = 'Please enter a valid email address';
//         } else if (value.length > 100) {
//           error = 'Email must be less than 100 characters';
//         }
//         break;
        
//       case 'password':
//         if (!value) {
//           error = 'Password is required';
//         } else if (value.length < 6) {
//           error = 'Password must be at least 6 characters';
//         } else if (value.length > 50) {
//           error = 'Password must be less than 50 characters';
//         } else if (!/(?=.*[A-Z])/.test(value)) {
//           error = 'Password must contain at least one uppercase letter';
//         } else if (!/(?=.*[0-9])/.test(value)) {
//           error = 'Password must contain at least one number';
//         } else if (!/(?=.*[!@#$%^&*])/.test(value)) {
//           error = 'Password must contain at least one special character (!@#$%^&*)';
//         }
//         break;
        
//       case 'confirmPassword':
//         if (!value) {
//           error = 'Please confirm your password';
//         } else if (value !== form.password) {
//           error = 'Passwords do not match';
//         }
//         break;
        
//       default:
//         break;
//     }
    
//     setErrors(prev => ({ ...prev, [name]: error }));
//     return error;
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     // Validate all fields
//     if (!form.name.trim()) newErrors.name = 'Full name is required';
//     else if (form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
//     else if (!/^[a-zA-Z\s'-]+$/.test(form.name.trim())) newErrors.name = 'Name can only contain letters, spaces, hyphens and apostrophes';
    
//     if (!form.email) newErrors.email = 'Email is required';
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Please enter a valid email address';
    
//     if (!form.password) newErrors.password = 'Password is required';
//     else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
//     else if (!/(?=.*[A-Z])/.test(form.password)) newErrors.password = 'Password must contain at least one uppercase letter';
//     else if (!/(?=.*[0-9])/.test(form.password)) newErrors.password = 'Password must contain at least one number';
//     else if (!/(?=.*[!@#$%^&*])/.test(form.password)) newErrors.password = 'Password must contain at least one special character (!@#$%^&*)';
    
//     if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
//     else if (form.confirmPassword !== form.password) newErrors.confirmPassword = 'Passwords do not match';
    
//     setErrors(newErrors);
//     setTouched({
//       name: true,
//       email: true,
//       password: true,
//       confirmPassword: true
//     });
    
//     return Object.keys(newErrors).length === 0;
//   };

//   const getPasswordStrengthLabel = () => {
//     const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
//     return labels[passwordStrength];
//   };

//   const getPasswordStrengthColor = () => {
//     const colors = [
//       '#ef4444', // Very Weak - Red
//       '#ef4444', // Weak - Red
//       '#f59e0b', // Fair - Orange
//       '#f59e0b', // Good - Orange
//       '#10b981', // Strong - Green
//       '#10b981'  // Very Strong - Green
//     ];
//     return colors[passwordStrength];
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       // Scroll to first error
//       const firstError = document.querySelector('.error-message');
//       if (firstError) {
//         firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       }
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.post(`${BASE_URL}/api/auth/register`, {
//         name: form.name.trim(),
//         email: form.email.toLowerCase().trim(),
//         password: form.password
//       });
      
//       if (showToast) showToast('Account created successfully! Please check your email to verify.', 'success');
//       navigate('/login');
//     } catch (err) {
//       const errorMsg = err.response?.data?.error || 'Registration failed. Please try again.';
      
//       if (err.response?.status === 409) {
//         setErrors({ email: 'Email already registered. Please use a different email or login.' });
//       } else if (err.response?.data?.field) {
//         setErrors({ [err.response.data.field]: err.response.data.error });
//       } else {
//         setErrors({ general: errorMsg });
//       }
      
//       if (showToast) showToast(errorMsg, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getFieldClass = (fieldName) => {
//     if (touched[fieldName]) {
//       return errors[fieldName] ? 'input-error' : 'input-valid';
//     }
//     return '';
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <div className="brand-logo">
//             <div className="logo-icon">S</div>
//             <span>SkillSphere</span>
//         </div>

//         <div className="header-text">
//             <h1>Create Account</h1>
//             <p>Join our global community today.</p>
//         </div>

//         {errors.general && <div className="alert error">{errors.general}</div>}

//         <form onSubmit={handleSubmit} noValidate>
//           {/* Full Name Field */}
//           <div className="input-group">
//             <label>Full Name</label>
//             <input 
//               type="text" 
//               name="name" 
//               placeholder="e.g. John Doe" 
//               value={form.name}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className={getFieldClass('name')}
//               maxLength="50"
//               required 
//             />
//             {touched.name && errors.name && (
//               <div className="error-message">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <circle cx="12" cy="12" r="10" />
//                   <line x1="12" y1="8" x2="12" y2="12" />
//                   <line x1="12" y1="16" x2="12.01" y2="16" />
//                 </svg>
//                 {errors.name}
//               </div>
//             )}
//             {touched.name && !errors.name && form.name && (
//               <div className="success-message">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <polyline points="20 6 9 17 4 12" />
//                 </svg>
//                 Valid name
//               </div>
//             )}
//           </div>

//           {/* Email Field */}
//           <div className="input-group">
//             <label>Email Address</label>
//             <input 
//               type="email" 
//               name="email" 
//               placeholder="name@example.com" 
//               value={form.email}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className={getFieldClass('email')}
//               maxLength="100"
//               required 
//             />
//             {touched.email && errors.email && (
//               <div className="error-message">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <circle cx="12" cy="12" r="10" />
//                   <line x1="12" y1="8" x2="12" y2="12" />
//                   <line x1="12" y1="16" x2="12.01" y2="16" />
//                 </svg>
//                 {errors.email}
//               </div>
//             )}
//             {touched.email && !errors.email && form.email && (
//               <div className="success-message">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <polyline points="20 6 9 17 4 12" />
//                 </svg>
//                 Valid email
//               </div>
//             )}
//           </div>

//           {/* Password Field */}
//           <div className="input-group">
//             <label>Password</label>
//             <div className="password-field">
//                 <input 
//                   type={showPassword ? "text" : "password"} 
//                   name="password" 
//                   placeholder="Create a strong password" 
//                   value={form.password}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={getFieldClass('password')}
//                   maxLength="50"
//                   required 
//                 />
//                 <button type="button" className="eye-toggle" onClick={() => setShowPassword(!showPassword)}>
//                     {showPassword ? (
//                         <svg width="20" height="20" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24">
//                           <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
//                           <line x1="1" y1="1" x2="23" y2="23"></line>
//                         </svg>
//                     ) : (
//                         <svg width="20" height="20" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24">
//                           <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
//                           <circle cx="12" cy="12" r="3"></circle>
//                         </svg>
//                     )}
//                 </button>
//             </div>
            
//             {/* Password Strength Indicator */}
//             {form.password && (
//               <div className="password-strength">
//                 <div className="strength-bars">
//                   {[...Array(5)].map((_, i) => (
//                     <div 
//                       key={i}
//                       className={`strength-bar ${i < passwordStrength ? 'active' : ''}`}
//                       style={{ backgroundColor: i < passwordStrength ? getPasswordStrengthColor() : '#e2e8f0' }}
//                     ></div>
//                   ))}
//                 </div>
//                 <span className="strength-label" style={{ color: getPasswordStrengthColor() }}>
//                   {getPasswordStrengthLabel()}
//                 </span>
//               </div>
//             )}
            
//             {/* Password Requirements */}
//             {touched.password && (
//               <div className="password-requirements">
//                 <p className="requirements-title">Password must contain:</p>
//                 <ul>
//                   <li className={form.password.length >= 6 ? 'met' : ''}>
//                     <span className="requirement-icon">
//                       {form.password.length >= 6 ? '✓' : '○'}
//                     </span>
//                     At least 6 characters
//                   </li>
//                   <li className={/[A-Z]/.test(form.password) ? 'met' : ''}>
//                     <span className="requirement-icon">
//                       {/[A-Z]/.test(form.password) ? '✓' : '○'}
//                     </span>
//                     One uppercase letter
//                   </li>
//                   <li className={/[0-9]/.test(form.password) ? 'met' : ''}>
//                     <span className="requirement-icon">
//                       {/[0-9]/.test(form.password) ? '✓' : '○'}
//                     </span>
//                     One number
//                   </li>
//                   <li className={/[!@#$%^&*]/.test(form.password) ? 'met' : ''}>
//                     <span className="requirement-icon">
//                       {/[!@#$%^&*]/.test(form.password) ? '✓' : '○'}
//                     </span>
//                     One special character (!@#$%^&*)
//                   </li>
//                 </ul>
//               </div>
//             )}
            
//             {touched.password && errors.password && (
//               <div className="error-message">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <circle cx="12" cy="12" r="10" />
//                   <line x1="12" y1="8" x2="12" y2="12" />
//                   <line x1="12" y1="16" x2="12.01" y2="16" />
//                 </svg>
//                 {errors.password}
//               </div>
//             )}
//           </div>

//           {/* Confirm Password Field */}
//           <div className="input-group">
//             <label>Confirm Password</label>
//             <div className="password-field">
//                 <input 
//                   type={showConfirm ? "text" : "password"} 
//                   name="confirmPassword" 
//                   placeholder="Re-enter password" 
//                   value={form.confirmPassword}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={getFieldClass('confirmPassword')}
//                   required 
//                 />
//                 <button type="button" className="eye-toggle" onClick={() => setShowConfirm(!showConfirm)}>
//                     {showConfirm ? (
//                         <svg width="20" height="20" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24">
//                           <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
//                           <line x1="1" y1="1" x2="23" y2="23"></line>
//                         </svg>
//                     ) : (
//                         <svg width="20" height="20" fill="none" stroke="#6366f1" strokeWidth="2" viewBox="0 0 24 24">
//                           <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
//                           <circle cx="12" cy="12" r="3"></circle>
//                         </svg>
//                     )}
//                 </button>
//             </div>
            
//             {touched.confirmPassword && errors.confirmPassword && (
//               <div className="error-message">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <circle cx="12" cy="12" r="10" />
//                   <line x1="12" y1="8" x2="12" y2="12" />
//                   <line x1="12" y1="16" x2="12.01" y2="16" />
//                 </svg>
//                 {errors.confirmPassword}
//               </div>
//             )}
            
//             {touched.confirmPassword && !errors.confirmPassword && form.confirmPassword && (
//               <div className="success-message">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <polyline points="20 6 9 17 4 12" />
//                 </svg>
//                 Passwords match
//               </div>
//             )}
//           </div>

//           <button type="submit" className="btn-primary" disabled={loading || Object.keys(errors).some(key => key !== 'general' && errors[key])}>
//             {loading ? <span className="spinner"></span> : 'Create Account'}
//           </button>
//         </form>

//         <div className="footer-text">
//             Already have an account? <Link to="/login">Sign in</Link>
//         </div>
//       </div>

//       <style>{`
//         .auth-container {
//             min-height: 100vh;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             font-family: 'Inter', sans-serif;
//             padding: 20px;
//         }
        
//         .auth-card {
//             background: rgba(255, 255, 255, 0.95);
//             backdrop-filter: blur(10px);
//             width: 100%;
//             max-width: 480px;
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
//             background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
//             color: white;
//             border-radius: 10px;
//             display: flex; align-items: center; justify-content: center;
//             box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
//         }

//         .header-text { text-align: center; margin-bottom: 30px; }
//         .header-text h1 { font-size: 1.8rem; font-weight: 800; color: #1e293b; margin: 0 0 5px 0; }
//         .header-text p { color: #64748b; margin: 0; font-size: 0.95rem; font-weight: 500; }

//         .input-group { margin-bottom: 24px; }
//         .input-group label { 
//             display: block; 
//             font-size: 0.85rem; 
//             font-weight: 600; 
//             color: #475569; 
//             margin-bottom: 8px; 
//         }
        
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
        
//         .input-group input:focus { 
//             border-color: #6366f1; 
//             background: white; 
//             box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); 
//         }
        
//         .input-group input.input-error {
//             border-color: #ef4444;
//             background: #fef2f2;
//         }
        
//         .input-group input.input-valid {
//             border-color: #10b981;
//             background: #f0fdf4;
//         }

//         .password-field { position: relative; }
//         .password-field input { padding-right: 45px; }
        
//         .eye-toggle {
//             position: absolute; 
//             right: 12px; 
//             top: 50%; 
//             transform: translateY(-50%);
//             background: none; 
//             border: none; 
//             cursor: pointer; 
//             padding: 4px;
//             display: flex; 
//             align-items: center; 
//             transition: opacity 0.2s;
//         }
        
//         .eye-toggle:hover { opacity: 0.7; }

//         /* Error and Success Messages */
//         .error-message {
//             display: flex;
//             align-items: center;
//             gap: 6px;
//             margin-top: 8px;
//             font-size: 0.8rem;
//             color: #ef4444;
//             font-weight: 500;
//         }
        
//         .success-message {
//             display: flex;
//             align-items: center;
//             gap: 6px;
//             margin-top: 8px;
//             font-size: 0.8rem;
//             color: #10b981;
//             font-weight: 500;
//         }

//         /* Password Strength Indicator */
//         .password-strength {
//             display: flex;
//             align-items: center;
//             gap: 12px;
//             margin-top: 8px;
//         }
        
//         .strength-bars {
//             display: flex;
//             gap: 4px;
//             flex: 1;
//         }
        
//         .strength-bar {
//             height: 4px;
//             flex: 1;
//             border-radius: 2px;
//             transition: background-color 0.3s;
//         }
        
//         .strength-bar.active {
//             transition: background-color 0.3s;
//         }
        
//         .strength-label {
//             font-size: 0.75rem;
//             font-weight: 600;
//             min-width: 70px;
//         }

//         /* Password Requirements */
//         .password-requirements {
//             margin-top: 12px;
//             padding: 12px;
//             background: #f8fafc;
//             border-radius: 8px;
//             border: 1px solid #e2e8f0;
//         }
        
//         .requirements-title {
//             font-size: 0.75rem;
//             font-weight: 600;
//             color: #475569;
//             margin-bottom: 8px;
//         }
        
//         .password-requirements ul {
//             list-style: none;
//             padding: 0;
//             margin: 0;
//         }
        
//         .password-requirements li {
//             font-size: 0.75rem;
//             color: #94a3b8;
//             margin-bottom: 4px;
//             display: flex;
//             align-items: center;
//             gap: 6px;
//         }
        
//         .password-requirements li.met {
//             color: #10b981;
//         }
        
//         .requirement-icon {
//             display: inline-block;
//             width: 16px;
//             text-align: center;
//         }

//         .btn-primary {
//             width: 100%;
//             padding: 14px;
//             background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
//             color: white;
//             border: none;
//             border-radius: 12px;
//             font-size: 1rem;
//             font-weight: 700;
//             cursor: pointer;
//             transition: transform 0.1s, box-shadow 0.2s;
//             box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
//             margin-top: 10px;
//         }
        
//         .btn-primary:hover:not(:disabled) { 
//             transform: translateY(-2px); 
//             box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35); 
//         }
        
//         .btn-primary:active:not(:disabled) { transform: scale(0.98); }
        
//         .btn-primary:disabled { 
//             opacity: 0.5; 
//             cursor: not-allowed;
//             transform: none;
//             box-shadow: none;
//         }

//         .footer-text { 
//             text-align: center; 
//             margin-top: 24px; 
//             font-size: 0.95rem; 
//             color: #64748b; 
//         }
        
//         .footer-text a { 
//             color: #6366f1; 
//             text-decoration: none; 
//             font-weight: 700; 
//         }
        
//         .footer-text a:hover { 
//             color: #4f46e5; 
//             text-decoration: underline; 
//         }

//         .alert { 
//             padding: 12px; 
//             border-radius: 10px; 
//             font-size: 0.9rem; 
//             text-align: center; 
//             margin-bottom: 20px; 
//             font-weight: 600; 
//         }
        
//         .error { 
//             background: #fee2e2; 
//             color: #dc2626; 
//             border: 1px solid #fecaca; 
//         }
        
//         .spinner { 
//             display: inline-block; 
//             width: 20px; 
//             height: 20px; 
//             border: 3px solid rgba(255,255,255,0.3); 
//             border-radius: 50%; 
//             border-top-color: #fff; 
//             animation: spin 1s ease-in-out infinite; 
//         }
        
//         @keyframes spin { 
//             to { transform: rotate(360deg); } 
//         }

//         /* Responsive */
//         @media (max-width: 640px) {
//             .auth-card {
//                 padding: 30px 20px;
//             }
            
//             .password-strength {
//                 flex-direction: column;
//                 align-items: flex-start;
//                 gap: 4px;
//             }
            
//             .strength-bars {
//                 width: 100%;
//             }
//         }
//       `}</style>
//     </div>
//   );
// }



import { useState } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; 

// --- FIXED API URL DETECTION ---
export const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://skill-0bu7.onrender.com'; // Your ACTUAL Render Backend

export default function Register({ showToast }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    validateField(name, value);
    
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, form[name]);
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'name':
        if (!value.trim()) error = 'Full name is required';
        else if (value.trim().length < 3) error = 'Name must be at least 3 characters';
        else if (!/^[A-Za-z\s]+$/.test(value.trim())) error = 'Only letters and spaces allowed';
        break;
        
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email';
        break;
        
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 8) error = 'Password must be at least 8 characters';
        else if (!/(?=.*[A-Z])/.test(value)) error = 'Need at least one uppercase letter';
        else if (!/(?=.*[a-z])/.test(value)) error = 'Need at least one lowercase letter';
        else if (!/(?=.*[0-9])/.test(value)) error = 'Need at least one number';
        // Fixed: Added comprehensive special character set including dot/period
        else if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(value)) error = 'Need at least one special character (!@#$%^&*(),.? etc.)';
        break;
        
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password';
        else if (value !== form.password) error = 'Passwords do not match';
        break;
        
      default: break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    else if (form.name.trim().length < 3) newErrors.name = 'Name must be at least 3 characters';
    else if (!/^[A-Za-z\s]+$/.test(form.name.trim())) newErrors.name = 'Only letters and spaces allowed';
    
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Please enter a valid email';
    
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[A-Z])/.test(form.password)) newErrors.password = 'Need at least one uppercase letter';
    else if (!/(?=.*[a-z])/.test(form.password)) newErrors.password = 'Need at least one lowercase letter';
    else if (!/(?=.*[0-9])/.test(form.password)) newErrors.password = 'Need at least one number';
    // Fixed: Added comprehensive special character set including dot/period
    else if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(form.password)) newErrors.password = 'Need at least one special character';
    
    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (form.confirmPassword !== form.password) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrengthLabel = () => {
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return labels[passwordStrength];
  };

  const getPasswordStrengthColor = () => {
    const colors = ['#ef4444', '#ef4444', '#f59e0b', '#f59e0b', '#10b981', '#10b981'];
    return colors[passwordStrength];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/auth/register`, {
        name: form.name.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password
      });
      
      if (showToast) showToast('Account created successfully!', 'success');
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed.';
      setErrors({ general: errorMsg });
      if (showToast) showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getFieldClass = (fieldName) => {
    if (touched[fieldName]) {
      return errors[fieldName] ? 'input-error' : 'input-valid';
    }
    return '';
  };

  return (
    <div className="register-container">
      {/* Clean Background */}
      <div className="background">
        <div className="gradient-orb or-1"></div>
        <div className="gradient-orb or-2"></div>
      </div>

      {/* Main Content */}
      <div className="register-wrapper">
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
            
            <h1>SkillSphere</h1>
            <p className="brand-tagline">
              Connect, learn, and grow with a global community of experts.
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
            <div className="form-header">
              <h2>Create account</h2>
              <p>Get started in seconds</p>
            </div>

            {errors.general && (
              <div className="alert-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                  <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/>
                  <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/>
                </svg>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getFieldClass('name')}
                />
                {touched.name && errors.name && (
                  <div className="error-text">{errors.name}</div>
                )}
              </div>

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
                />
                {touched.email && errors.email && (
                  <div className="error-text">{errors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getFieldClass('password')}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                {form.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{ 
                          width: `${(passwordStrength / 5) * 100}%`,
                          backgroundColor: getPasswordStrengthColor()
                        }}
                      />
                    </div>
                    <span className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                      {getPasswordStrengthLabel()}
                    </span>
                  </div>
                )}
                
                {touched.password && errors.password && (
                  <div className="error-text">{errors.password}</div>
                )}
              </div>

              <div className="form-group">
                <label>Confirm password</label>
                <div className="password-field">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getFieldClass('confirmPassword')}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="error-text">{errors.confirmPassword}</div>
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            <div className="form-footer">
              <span>Already have an account?</span>
              <Link to="/login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .register-container {
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
        .register-wrapper {
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

        .error-text {
          font-size: 0.8rem;
          color: #ef4444;
          margin-top: 0.5rem;
        }

        .password-strength {
          margin-top: 0.75rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .strength-bar {
          flex: 1;
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
        }

        .strength-fill {
          height: 100%;
          transition: all 0.3s;
        }

        .strength-text {
          font-size: 0.85rem;
          font-weight: 500;
          min-width: 80px;
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
          margin-top: 1rem;
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

        /* Responsive */
        @media (max-width: 968px) {
          .register-wrapper {
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

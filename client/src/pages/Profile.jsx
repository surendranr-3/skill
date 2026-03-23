// import { useState, useEffect, useContext, useRef } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';

// const BASE_URL = window.location.hostname === 'localhost'
//   ? 'http://localhost:5000'
//   : `http://${window.location.hostname}:5000`;

// export default function Profile({ showToast }) {
//   const { user, updateUser } = useContext(AuthContext);
  
//   const fileInputRef = useRef(null);
//   const saveTimeoutRef = useRef(null); // 🚨 Ref for auto-save debounce

//   // Profile State
//   const [profile, setProfile] = useState({
//     bio: '',
//     hourlyRate: 20,
//     skills: [],
//     learningInterests: []
//   });

//   const [file, setFile] = useState(null); 
//   const [avatarLoading, setAvatarLoading] = useState(false);
  
//   // New Skill/Interest inputs
//   const [newTeachSkill, setNewTeachSkill] = useState({ name: '', level: 'Beginner' });
//   const [newLearnInterest, setNewLearnInterest] = useState("");
  
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false); // 🚨 Saving Indicator

//   // 1. Fetch Initial Data
//   useEffect(() => {
//     if (!user || !user.id) return;

//     const fetchData = async () => {
//       try {
//         const txRes = await axios.get(`${BASE_URL}/api/wallet/history/${user.id}`);
//         setTransactions(txRes.data);

//         const mentorsRes = await axios.get(`${BASE_URL}/api/users/mentors`);
//         const currentUser = mentorsRes.data.find(u => u._id === user.id);

//         if (currentUser) {
//           setProfile({
//             bio: currentUser.bio || '',
//             hourlyRate: currentUser.hourlyRate || 20,
//             skills: currentUser.skills || [],
//             learningInterests: currentUser.learningInterests || []
//           });
//         }
//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [user]);

//   // 🚨 2. AUTO-SAVE TEXT DATA LOGIC 🚨
//   // This effect runs whenever 'profile' changes
//   useEffect(() => {
//     // Skip auto-save on initial load
//     if (loading) return;

//     // Clear existing timeout to debounce
//     if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

//     setIsSaving(true);

//     // Set new timeout (wait 1.5s after last change)
//     saveTimeoutRef.current = setTimeout(async () => {
//         try {
//             const data = new FormData();
//             data.append('userId', user.id);
//             data.append('bio', profile.bio || ""); 
//             data.append('hourlyRate', profile.hourlyRate || 20);
//             data.append('skills', JSON.stringify(profile.skills || []));
//             data.append('learningInterests', JSON.stringify(profile.learningInterests || []));
            
//             // Note: We don't send file here, file handles its own upload immediately
            
//             const res = await axios.put(`${BASE_URL}/api/users/profile`, data, {
//                 headers: { 'Content-Type': 'multipart/form-data' }
//             });

//             updateUser(res.data); 
//             // Optional: minimal toast or just the indicator
//             // if (showToast) showToast('Auto-saved', 'success'); 
            
//         } catch (err) {
//             console.error("Auto-save failed", err);
//         } finally {
//             setIsSaving(false);
//         }
//     }, 1500); // 1.5 seconds delay

//     return () => clearTimeout(saveTimeoutRef.current);
//   }, [profile]); // Dependency array: triggers on any profile change

//   // 3. Avatar Auto-Save (Immediate)
//   const handleAvatarChange = async (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) return;

//     setFile(selectedFile);
//     setAvatarLoading(true);

//     try {
//         const data = new FormData();
//         data.append('userId', user.id);
//         data.append('bio', profile.bio || ""); 
//         data.append('hourlyRate', profile.hourlyRate || 20);
//         data.append('skills', JSON.stringify(profile.skills || []));
//         data.append('learningInterests', JSON.stringify(profile.learningInterests || []));
//         data.append('avatar', selectedFile);

//         const res = await axios.put(`${BASE_URL}/api/users/profile`, data, {
//             headers: { 'Content-Type': 'multipart/form-data' }
//         });

//         updateUser(res.data);
//         if (showToast) showToast('Photo updated!', 'success');
//         setFile(null); 

//     } catch (err) {
//         console.error("Avatar upload failed:", err);
//         if (showToast) showToast('Failed to update photo', 'error');
//     } finally {
//         setAvatarLoading(false);
//     }
//   };

//   // 4. Update Profile State Helper (Triggers Auto-Save Effect)
//   const handleAddTeachSkill = () => {
//     if (!newTeachSkill.name) return;
//     setProfile(prev => ({ ...prev, skills: [...prev.skills, newTeachSkill] }));
//     setNewTeachSkill({ name: '', level: 'Beginner' });
//   };

//   const removeTeachSkill = (index) => {
//     setProfile(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
//   };

//   const handleAddLearnInterest = () => {
//     if (!newLearnInterest) return;
//     setProfile(prev => ({ ...prev, learningInterests: [...prev.learningInterests, newLearnInterest] }));
//     setNewLearnInterest("");
//   };

//   const removeLearnInterest = (index) => {
//     setProfile(prev => ({ ...prev, learningInterests: prev.learningInterests.filter((_, i) => i !== index) }));
//   };

//   const triggerFileSelect = () => {
//     fileInputRef.current.click();
//   };

//   if (!user || loading) return (
//     <div className="loader-container">
//         <div className="spinner"></div>
//     </div>
//   );

//   return (
//     <div className="profile-container">
      
//       {/* BACKGROUND BANNER */}
//       <div className="profile-banner"></div>

//       <div className="profile-content">
        
//         {/* LEFT CARD: IDENTITY & WALLET */}
//         <div className="profile-sidebar">
//             <div className="identity-card fade-in-up">
//                 <div className="avatar-container" onClick={triggerFileSelect}>
//                     <img 
//                         src={file ? URL.createObjectURL(file) : (user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`)} 
//                         alt="Profile" 
//                         className="profile-avatar"
//                         style={avatarLoading ? { opacity: 0.5 } : {}}
//                     />
//                     {avatarLoading && (
//                         <div className="avatar-loading-overlay">
//                             <div className="spinner-small"></div>
//                         </div>
//                     )}
//                     <div className="avatar-overlay">
//                         <span>📷 Change Photo</span>
//                     </div>
//                 </div>
//                 <input 
//                     type="file" 
//                     ref={fileInputRef} 
//                     style={{display:'none'}} 
//                     onChange={handleAvatarChange} 
//                     accept="image/*"
//                 />
                
//                 <h2 className="user-name">{user.name}</h2>
//                 <p className="user-email">{user.email}</p>
//                 <div className="role-badge">{user.role}</div>

//                 <div className="divider"></div>

//                 <div className="wallet-summary">
//                     <span className="wallet-label">Wallet Balance</span>
//                     <span className="wallet-amount">💰 {user.balance}</span>
//                 </div>

//                 {/* 🚨 SAVING INDICATOR */}
//                 <div className="save-status">
//                     {isSaving ? (
//                         <span className="saving-text">Saving changes...</span>
//                     ) : (
//                         <span className="saved-text">All changes saved ✅</span>
//                     )}
//                 </div>
//             </div>

//             <div className="wallet-card fade-in-up delay-1">
//                 <h3>Transaction History</h3>
//                 <div className="transaction-list">
//                     {transactions.length === 0 ? (
//                         <p className="empty-text">No transactions yet.</p>
//                     ) : (
//                         transactions.map(tx => (
//                             <div key={tx._id} className="transaction-item">
//                                 <div className="tx-info">
//                                     <span className="tx-desc">{tx.description}</span>
//                                     <span className="tx-date">{new Date(tx.date).toLocaleDateString()}</span>
//                                 </div>
//                                 <span className={`tx-amount ${tx.amount > 0 ? 'green' : 'red'}`}>
//                                     {tx.amount > 0 ? '+' : ''}{tx.amount}
//                                 </span>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </div>
//         </div>

//         {/* RIGHT CARD: DETAILS & SKILLS */}
//         <div className="profile-main">
            
//             <div className="section-card fade-in-up delay-2">
//                 <h3>About Me</h3>
//                 <div className="input-group">
//                     <label>Professional Bio</label>
//                     <textarea 
//                         className="custom-input textarea" 
//                         rows="4" 
//                         placeholder="Share your experience..."
//                         value={profile.bio}
//                         onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
//                     />
//                 </div>
//                 <div className="input-group">
//                     <label>Hourly Rate (Tokens)</label>
//                     <input 
//                         type="number" 
//                         className="custom-input"
//                         value={profile.hourlyRate}
//                         onChange={(e) => setProfile({ ...profile, hourlyRate: e.target.value })}
//                     />
//                 </div>
//             </div>

//             <div className="section-card fade-in-up delay-3">
//                 <h3>Skills I Teach</h3>
//                 <div className="add-row">
//                     <input 
//                         className="custom-input" 
//                         placeholder="Add a skill (e.g. React)" 
//                         value={newTeachSkill.name}
//                         onChange={(e) => setNewTeachSkill({ ...newTeachSkill, name: e.target.value })}
//                     />
//                     <select 
//                         className="custom-select"
//                         value={newTeachSkill.level}
//                         onChange={(e) => setNewTeachSkill({ ...newTeachSkill, level: e.target.value })}
//                     >
//                         <option>Beginner</option>
//                         <option>Intermediate</option>
//                         <option>Expert</option>
//                     </select>
//                     <button className="add-btn" onClick={handleAddTeachSkill}>+</button>
//                 </div>
//                 <div className="tags-wrapper">
//                     {profile.skills.map((s, i) => (
//                         <div key={i} className="skill-tag">
//                             <span className="tag-name">{s.name}</span>
//                             <span className={`tag-level ${s.level.toLowerCase()}`}>{s.level}</span>
//                             <button onClick={() => removeTeachSkill(i)}>×</button>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <div className="section-card fade-in-up delay-4">
//                 <h3>Learning Interests</h3>
//                 <div className="add-row">
//                     <input 
//                         className="custom-input full" 
//                         placeholder="What do you want to learn?" 
//                         value={newLearnInterest}
//                         onChange={(e) => setNewLearnInterest(e.target.value)}
//                     />
//                     <button className="add-btn secondary" onClick={handleAddLearnInterest}>+</button>
//                 </div>
//                 <div className="tags-wrapper">
//                     {profile.learningInterests.map((item, idx) => (
//                         <div key={idx} className="interest-tag">
//                             <span>{item}</span>
//                             <button onClick={() => removeLearnInterest(idx)}>×</button>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//         </div>
//       </div>

//       <style>{`
//         /* --- ANIMATIONS --- */
//         @keyframes gradientFlow {
//             0% { background-position: 0% 50%; }
//             50% { background-position: 100% 50%; }
//             100% { background-position: 0% 50%; }
//         }
//         @keyframes fadeInUp {
//             from { opacity: 0; transform: translateY(20px); }
//             to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

//         .fade-in-up { opacity: 0; animation: fadeInUp 0.6s ease-out forwards; }
//         .delay-1 { animation-delay: 0.1s; }
//         .delay-2 { animation-delay: 0.2s; }
//         .delay-3 { animation-delay: 0.3s; }
//         .delay-4 { animation-delay: 0.4s; }

//         /* --- LAYOUT & BACKGROUND --- */
//         .profile-container {
//             background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
//             background-size: 400% 400%;
//             animation: gradientFlow 15s ease infinite;
//             min-height: 100vh;
//             padding-bottom: 40px;
//             font-family: 'Inter', sans-serif;
//             position: relative;
//         }
        
//         .profile-container::before {
//             content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
//             background: rgba(255, 255, 255, 0.85);
//             backdrop-filter: blur(10px);
//             z-index: 0;
//         }

//         .profile-banner {
//             height: 220px;
//             background: linear-gradient(45deg, #4f46e5, #9333ea, #db2777);
//             background-size: 200% 200%;
//             animation: gradientFlow 10s ease infinite;
//             width: 100%;
//             position: relative;
//             z-index: 1;
//             box-shadow: 0 4px 30px rgba(0,0,0,0.1);
//         }

//         .profile-content {
//             max-width: 1100px; margin: -100px auto 0; padding: 0 20px;
//             display: grid; grid-template-columns: 350px 1fr; gap: 30px;
//             position: relative; z-index: 2;
//         }
        
//         /* --- CARDS --- */
//         .identity-card, .wallet-card, .section-card {
//             background: rgba(255, 255, 255, 0.95);
//             border-radius: 20px;
//             padding: 30px;
//             box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);
//             margin-bottom: 25px;
//             border: 1px solid rgba(255, 255, 255, 0.5);
//             backdrop-filter: blur(5px);
//         }
//         .identity-card { text-align: center; }
        
//         /* --- AVATAR --- */
//         .avatar-container {
//             width: 140px; height: 140px; margin: 0 auto 15px; position: relative;
//             cursor: pointer; border-radius: 50%; border: 6px solid rgba(255, 255, 255, 0.8);
//             box-shadow: 0 8px 25px rgba(0,0,0,0.15); overflow: hidden; transition: transform 0.3s;
//         }
//         .avatar-container:hover { transform: scale(1.05); }
//         .profile-avatar { width: 100%; height: 100%; object-fit: cover; }
        
//         .avatar-overlay {
//             position: absolute; top: 0; left: 0; width: 100%; height: 100%;
//             background: rgba(0,0,0,0.5); color: white;
//             display: flex; align-items: center; justify-content: center;
//             opacity: 0; transition: opacity 0.3s; font-weight: 600;
//         }
//         .avatar-container:hover .avatar-overlay { opacity: 1; }

//         .avatar-loading-overlay {
//             position: absolute; top: 0; left: 0; width: 100%; height: 100%;
//             background: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center;
//             z-index: 10;
//         }
//         .spinner-small {
//             width: 30px; height: 30px; border: 3px solid #e2e8f0; border-top: 3px solid #4f46e5;
//             border-radius: 50%; animation: spin 1s linear infinite;
//         }

//         .user-name { margin: 0; color: #1e293b; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px; }
//         .user-email { color: #64748b; margin: 5px 0 15px; font-size: 0.9rem; font-weight: 500; }
        
//         .role-badge { 
//             display: inline-block; background: linear-gradient(135deg, #3b82f6, #2563eb);
//             color: white; padding: 6px 18px; border-radius: 20px; font-size: 0.75rem; 
//             font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
//             box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
//         }
        
//         .divider { height: 1px; background: #e2e8f0; margin: 25px 0; }
        
//         .wallet-summary { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
//         .wallet-label { font-weight: 600; color: #64748b; }
//         .wallet-amount { font-size: 1.3rem; font-weight: 800; color: #0f172a; }

//         /* Save Status Indicator */
//         .save-status { margin-top: 20px; font-size: 0.9rem; min-height: 24px; }
//         .saving-text { color: #f59e0b; font-weight: 600; font-style: italic; }
//         .saved-text { color: #10b981; font-weight: 600; }

//         /* --- WALLET LIST --- */
//         .transaction-list { max-height: 250px; overflow-y: auto; }
//         .transaction-item {
//             display: flex; justify-content: space-between; align-items: center;
//             padding: 14px 0; border-bottom: 1px solid #f1f5f9;
//         }
//         .transaction-item:last-child { border-bottom: none; }
//         .tx-info { display: flex; flex-direction: column; }
//         .tx-desc { font-weight: 600; font-size: 0.95rem; color: #334155; }
//         .tx-date { font-size: 0.75rem; color: #94a3b8; }
//         .tx-amount { font-weight: 700; font-size: 1rem; }
//         .tx-amount.green { color: #16a34a; }
//         .tx-amount.red { color: #ef4444; }

//         /* --- MAIN CONTENT (RIGHT) --- */
//         .section-card h3 { margin: 0 0 20px; font-size: 1.2rem; color: #0f172a; font-weight: 700; }
//         .input-group { margin-bottom: 25px; }
//         .input-group label { display: block; margin-bottom: 10px; font-weight: 600; color: #475569; font-size: 0.9rem; }
        
//         .custom-input, .custom-select {
//             width: 100%; padding: 14px 18px; border: 2px solid #f1f5f9;
//             border-radius: 12px; font-size: 0.95rem; outline: none; background: #f8fafc;
//             transition: all 0.2s; color: #334155;
//         }
//         .custom-input:focus, .custom-select:focus {
//             border-color: #6366f1; background: white; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
//         }
//         .custom-input.textarea { resize: vertical; min-height: 120px; font-family: inherit; }

//         .add-row { display: flex; gap: 12px; margin-bottom: 20px; }
//         .add-btn {
//             width: 50px; flex-shrink: 0; border: none; background: #6366f1; color: white;
//             border-radius: 12px; font-size: 1.6rem; cursor: pointer; display: flex;
//             align-items: center; justify-content: center; transition: all 0.2s;
//             box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
//         }
//         .add-btn.secondary { background: #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
//         .add-btn:hover { transform: translateY(-2px); filter: brightness(110%); }

//         /* --- TAGS --- */
//         .tags-wrapper { display: flex; flex-wrap: wrap; gap: 10px; }
        
//         .skill-tag {
//             display: flex; align-items: center; background: white; border: 1px solid #e2e8f0;
//             padding: 8px 8px 8px 16px; border-radius: 50px; font-size: 0.9rem; font-weight: 600;
//             color: #334155; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: transform 0.2s;
//         }
//         .skill-tag:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        
//         .tag-level {
//             font-size: 0.7rem; text-transform: uppercase; padding: 4px 8px; border-radius: 12px;
//             margin: 0 10px; font-weight: 700; letter-spacing: 0.5px;
//         }
//         .tag-level.beginner { background: #dbeafe; color: #1e40af; }
//         .tag-level.intermediate { background: #fef3c7; color: #92400e; }
//         .tag-level.expert { background: #fee2e2; color: #991b1b; }

//         .skill-tag button, .interest-tag button {
//             background: #f1f5f9; border: none; width: 28px; height: 28px; border-radius: 50%;
//             cursor: pointer; color: #64748b; display: flex; align-items: center; justify-content: center;
//             font-size: 1.1rem; transition: all 0.2s;
//         }
//         .skill-tag button:hover, .interest-tag button:hover {
//             background: #ef4444; color: white; transform: rotate(90deg);
//         }

//         .interest-tag {
//             background: #f0fdf4; color: #15803d; border: 1px solid #dcfce7;
//             padding: 8px 16px; border-radius: 30px; display: flex; align-items: center;
//             gap: 12px; font-weight: 600; box-shadow: 0 2px 8px rgba(22, 163, 74, 0.1);
//         }

//         /* Responsive */
//         @media (max-width: 900px) {
//             .profile-content { grid-template-columns: 1fr; margin-top: -80px; }
//             .profile-banner { height: 180px; }
//         }
        
//         .loader-container { height: 100vh; display:flex; justify-content:center; align-items:center; color: #94a3b8; background: #f8fafc; }
//         .spinner { width: 50px; height: 50px; border: 5px solid #e2e8f0; border-top: 5px solid #4f46e5; border-radius: 50%; animation: spin 1s linear infinite; }
//       `}</style>
//     </div>
//   );
// }



import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : `http://${window.location.hostname}:5000`;

export default function Profile({ showToast }) {
  const { user, updateUser } = useContext(AuthContext);
  
  const fileInputRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Profile State
  const [profile, setProfile] = useState({
    bio: '',
    hourlyRate: 20,
    skills: [],
    learningInterests: []
  });

  const [file, setFile] = useState(null); 
  const [avatarLoading, setAvatarLoading] = useState(false);
  
  // New Skill/Interest inputs
  const [newTeachSkill, setNewTeachSkill] = useState({ name: '', level: 'Beginner' });
  const [newLearnInterest, setNewLearnInterest] = useState("");
  
  // Validation states
  const [skillError, setSkillError] = useState('');
  const [interestError, setInterestError] = useState('');
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Constants for max entries
  const MAX_SKILLS = 8;
  const MAX_INTERESTS = 8;
  
  // Required skills and interests (these cannot be removed)
  const REQUIRED_SKILL = "Communication";
  const REQUIRED_INTEREST = "Professional Development";

  // 1. Fetch Initial Data
  useEffect(() => {
    if (!user || !user.id) return;

    const fetchData = async () => {
      try {
        const txRes = await axios.get(`${BASE_URL}/api/wallet/history/${user.id}`);
        setTransactions(txRes.data);

        const mentorsRes = await axios.get(`${BASE_URL}/api/users/mentors`);
        const currentUser = mentorsRes.data.find(u => u._id === user.id);

        if (currentUser) {
          // Ensure required skill and interest exist
          let updatedSkills = currentUser.skills || [];
          let updatedInterests = currentUser.learningInterests || [];
          
          // Check if required skill exists, if not add it
          const hasRequiredSkill = updatedSkills.some(
            skill => skill.name.toLowerCase() === REQUIRED_SKILL.toLowerCase()
          );
          
          if (!hasRequiredSkill) {
            updatedSkills = [
              { name: REQUIRED_SKILL, level: 'Intermediate' },
              ...updatedSkills
            ];
          }
          
          // Check if required interest exists, if not add it
          const hasRequiredInterest = updatedInterests.some(
            interest => interest.toLowerCase() === REQUIRED_INTEREST.toLowerCase()
          );
          
          if (!hasRequiredInterest) {
            updatedInterests = [REQUIRED_INTEREST, ...updatedInterests];
          }

          setProfile({
            bio: currentUser.bio || '',
            hourlyRate: currentUser.hourlyRate || 20,
            skills: updatedSkills,
            learningInterests: updatedInterests
          });
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // 2. AUTO-SAVE TEXT DATA LOGIC
  useEffect(() => {
    if (loading) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    setIsSaving(true);

    saveTimeoutRef.current = setTimeout(async () => {
        try {
            const data = new FormData();
            data.append('userId', user.id);
            data.append('bio', profile.bio || ""); 
            data.append('hourlyRate', profile.hourlyRate || 20);
            data.append('skills', JSON.stringify(profile.skills || []));
            data.append('learningInterests', JSON.stringify(profile.learningInterests || []));
            
            const res = await axios.put(`${BASE_URL}/api/users/profile`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            updateUser(res.data);
            
        } catch (err) {
            console.error("Auto-save failed", err);
        } finally {
            setIsSaving(false);
        }
    }, 1500);

    return () => clearTimeout(saveTimeoutRef.current);
  }, [profile]);

  // 3. Avatar Auto-Save (Immediate)
  const handleAvatarChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setAvatarLoading(true);

    try {
        const data = new FormData();
        data.append('userId', user.id);
        data.append('bio', profile.bio || ""); 
        data.append('hourlyRate', profile.hourlyRate || 20);
        data.append('skills', JSON.stringify(profile.skills || []));
        data.append('learningInterests', JSON.stringify(profile.learningInterests || []));
        data.append('avatar', selectedFile);

        const res = await axios.put(`${BASE_URL}/api/users/profile`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        updateUser(res.data);
        if (showToast) showToast('Photo updated!', 'success');
        setFile(null); 

    } catch (err) {
        console.error("Avatar upload failed:", err);
        if (showToast) showToast('Failed to update photo', 'error');
    } finally {
        setAvatarLoading(false);
    }
  };

  // Helper function to capitalize first letter of each word
  const capitalizeWords = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Check if skill is required (cannot be removed)
  const isRequiredSkill = (skillName) => {
    return skillName.toLowerCase() === REQUIRED_SKILL.toLowerCase();
  };

  // Check if interest is required (cannot be removed)
  const isRequiredInterest = (interest) => {
    return interest.toLowerCase() === REQUIRED_INTEREST.toLowerCase();
  };

  // 4. Update Profile State Helper with validation
  const handleAddTeachSkill = () => {
    setSkillError('');
    
    if (!newTeachSkill.name.trim()) {
      setSkillError('Please enter a skill name');
      return;
    }

    // Check max limit
    if (profile.skills.length >= MAX_SKILLS) {
      setSkillError(`You can only add up to ${MAX_SKILLS} skills`);
      return;
    }

    const capitalizedSkillName = capitalizeWords(newTeachSkill.name.trim());
    
    // Check for duplicates (case insensitive)
    const isDuplicate = profile.skills.some(
      skill => skill.name.toLowerCase() === capitalizedSkillName.toLowerCase()
    );

    if (isDuplicate) {
      setSkillError('This skill has already been added');
      return;
    }

    setProfile(prev => ({ 
      ...prev, 
      skills: [...prev.skills, { 
        name: capitalizedSkillName, 
        level: newTeachSkill.level 
      }] 
    }));
    setNewTeachSkill({ name: '', level: 'Beginner' });
  };

  const removeTeachSkill = (index) => {
    const skillToRemove = profile.skills[index];
    
    // Prevent removal of required skill
    if (isRequiredSkill(skillToRemove.name)) {
      setSkillError('The required skill cannot be removed');
      return;
    }

    setProfile(prev => ({ 
      ...prev, 
      skills: prev.skills.filter((_, i) => i !== index) 
    }));
    setSkillError('');
  };

  const handleAddLearnInterest = () => {
    setInterestError('');
    
    if (!newLearnInterest.trim()) {
      setInterestError('Please enter a learning interest');
      return;
    }

    // Check max limit
    if (profile.learningInterests.length >= MAX_INTERESTS) {
      setInterestError(`You can only add up to ${MAX_INTERESTS} interests`);
      return;
    }

    const capitalizedInterest = capitalizeWords(newLearnInterest.trim());
    
    // Check for duplicates (case insensitive)
    const isDuplicate = profile.learningInterests.some(
      interest => interest.toLowerCase() === capitalizedInterest.toLowerCase()
    );

    if (isDuplicate) {
      setInterestError('This interest has already been added');
      return;
    }

    setProfile(prev => ({ 
      ...prev, 
      learningInterests: [...prev.learningInterests, capitalizedInterest] 
    }));
    setNewLearnInterest("");
  };

  const removeLearnInterest = (index) => {
    const interestToRemove = profile.learningInterests[index];
    
    // Prevent removal of required interest
    if (isRequiredInterest(interestToRemove)) {
      setInterestError('The required interest cannot be removed');
      return;
    }

    setProfile(prev => ({ 
      ...prev, 
      learningInterests: prev.learningInterests.filter((_, i) => i !== index) 
    }));
    setInterestError('');
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  if (!user || loading) return (
    <div className="loader-container">
        <div className="spinner"></div>
    </div>
  );

  return (
    <div className="profile-container">
      
      {/* MODERN HEADER */}
      <div className="profile-header">
        <div className="header-content">
          <h1 className="header-title">Profile Settings</h1>
          <p className="header-subtitle">Manage your personal information and preferences</p>
        </div>
        <div className="header-actions">
          <div className={`save-indicator ${isSaving ? 'saving' : 'saved'}`}>
            {isSaving ? (
              <>
                <span className="saving-spinner"></span>
                <span>Saving changes...</span>
              </>
            ) : (
              <>
                <span className="saved-check">✓</span>
                <span>All changes saved</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="tab-icon">👤</span>
          Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          <span className="tab-icon">⚡</span>
          Skills & Interests
        </button>
        <button 
          className={`tab-btn ${activeTab === 'wallet' ? 'active' : ''}`}
          onClick={() => setActiveTab('wallet')}
        >
          <span className="tab-icon">💰</span>
          Wallet
        </button>
      </div>

      <div className="profile-content">
        
        {/* LEFT SIDEBAR - Always visible */}
        <div className="profile-sidebar">
          <div className="profile-card">
            <div className="avatar-section">
              <div className="avatar-wrapper" onClick={triggerFileSelect}>
                <img 
                  src={file ? URL.createObjectURL(file) : (user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`)} 
                  alt={user.name} 
                  className="avatar"
                />
                <div className="avatar-overlay">
                  <span className="overlay-icon">📷</span>
                  <span>Change Photo</span>
                </div>
                {avatarLoading && (
                  <div className="avatar-spinner">
                    <div className="spinner"></div>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{display:'none'}} 
                onChange={handleAvatarChange} 
                accept="image/*"
              />
              
              <div className="user-info">
                <h2 className="user-name">{user.name}</h2>
                <p className="user-email">{user.email}</p>
                <span className="user-badge">{user.role}</span>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-label">Member since</span>
                <span className="stat-value">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Hourly rate</span>
                <span className="stat-value highlight">{profile.hourlyRate} tokens</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="stats-card">
            <h3 className="stats-title">Quick Stats</h3>
            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-box-value">{profile.skills.length}/{MAX_SKILLS}</span>
                <span className="stat-box-label">Skills</span>
              </div>
              <div className="stat-box">
                <span className="stat-box-value">{profile.learningInterests.length}/{MAX_INTERESTS}</span>
                <span className="stat-box-label">Interests</span>
              </div>
              <div className="stat-box">
                <span className="stat-box-value">{transactions.length}</span>
                <span className="stat-box-label">Transactions</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT - Tab based */}
        <div className="profile-main">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="content-card fade-in">
              <h3 className="card-title">About Me</h3>
              <div className="form-group">
                <label className="form-label">Professional Bio</label>
                <textarea 
                  className="form-textarea" 
                  rows="5"
                  placeholder="Tell us about your experience, expertise, and what makes you unique..."
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  maxLength="500"
                />
                <span className="input-hint">{profile.bio.length}/500 characters</span>
              </div>

              <div className="form-group">
                <label className="form-label">Hourly Rate (Tokens)</label>
                <div className="input-wrapper">
                  <span className="input-icon">💰</span>
                  <input 
                    type="number" 
                    className="form-input with-icon"
                    value={profile.hourlyRate}
                    onChange={(e) => setProfile({ ...profile, hourlyRate: parseInt(e.target.value) || 0 })}
                    min="0"
                    step="5"
                  />
                </div>
                <span className="input-hint">Set your hourly rate in tokens (minimum: 0)</span>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <>
              <div className="content-card fade-in">
                <div className="card-header">
                  <div>
                    <h3 className="card-title">Skills I Teach</h3>
                    <p className="card-subtitle">Add skills you can teach others (max {MAX_SKILLS})</p>
                  </div>
                  <div className="progress-badge">
                    {profile.skills.length}/{MAX_SKILLS}
                  </div>
                </div>
                
                <div className="info-message">
                  <span className="info-icon">ℹ️</span>
                  <span className="info-text">
                    <strong>{REQUIRED_SKILL}</strong> is a required skill and cannot be removed
                  </span>
                </div>
                
                <div className="add-skill-form">
                  <div className="form-row">
                    <input 
                      className="form-input" 
                      placeholder="Skill name (e.g. React)" 
                      value={newTeachSkill.name}
                      onChange={(e) => {
                        setNewTeachSkill({ ...newTeachSkill, name: e.target.value });
                        setSkillError('');
                      }}
                      disabled={profile.skills.length >= MAX_SKILLS}
                    />
                    <select 
                      className="form-select"
                      value={newTeachSkill.level}
                      onChange={(e) => setNewTeachSkill({ ...newTeachSkill, level: e.target.value })}
                      disabled={profile.skills.length >= MAX_SKILLS}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <button 
                      className="btn-add" 
                      onClick={handleAddTeachSkill}
                      disabled={profile.skills.length >= MAX_SKILLS}
                    >
                      <span>+</span> Add
                    </button>
                  </div>
                  {skillError && <span className="error-message">{skillError}</span>}
                </div>

                <div className="skills-grid">
                  {profile.skills.map((skill, index) => {
                    const isRequired = isRequiredSkill(skill.name);
                    return (
                      <div key={index} className={`skill-card ${isRequired ? 'required' : ''}`}>
                        <div className="skill-info">
                          <span className="skill-name">
                            {skill.name}
                            {isRequired && <span className="required-badge">Required</span>}
                          </span>
                          <span className={`skill-level ${skill.level.toLowerCase()}`}>
                            {skill.level}
                          </span>
                        </div>
                        <button 
                          className="skill-remove"
                          onClick={() => removeTeachSkill(index)}
                          disabled={isRequired}
                          title={isRequired ? "Required skill cannot be removed" : "Remove skill"}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                  {profile.skills.length === 0 && (
                    <p className="empty-state">No skills added yet. Add your first skill above!</p>
                  )}
                </div>
              </div>

              <div className="content-card fade-in">
                <div className="card-header">
                  <div>
                    <h3 className="card-title">Learning Interests</h3>
                    <p className="card-subtitle">What would you like to learn? (max {MAX_INTERESTS})</p>
                  </div>
                  <div className="progress-badge">
                    {profile.learningInterests.length}/{MAX_INTERESTS}
                  </div>
                </div>
                
                <div className="info-message">
                  <span className="info-icon">ℹ️</span>
                  <span className="info-text">
                    <strong>{REQUIRED_INTEREST}</strong> is a required interest and cannot be removed
                  </span>
                </div>
                
                <div className="add-interest-form">
                  <div className="form-row">
                    <input 
                      className="form-input" 
                      placeholder="e.g. Machine Learning" 
                      value={newLearnInterest}
                      onChange={(e) => {
                        setNewLearnInterest(e.target.value);
                        setInterestError('');
                      }}
                      disabled={profile.learningInterests.length >= MAX_INTERESTS}
                    />
                    <button 
                      className="btn-add secondary" 
                      onClick={handleAddLearnInterest}
                      disabled={profile.learningInterests.length >= MAX_INTERESTS}
                    >
                      <span>+</span> Add
                    </button>
                  </div>
                  {interestError && <span className="error-message">{interestError}</span>}
                </div>

                <div className="interests-cloud">
                  {profile.learningInterests.map((interest, index) => {
                    const isRequired = isRequiredInterest(interest);
                    return (
                      <div key={index} className={`interest-tag ${isRequired ? 'required' : ''}`}>
                        <span>
                          {interest}
                          {isRequired && <span className="required-badge-small">Required</span>}
                        </span>
                        <button 
                          className="tag-remove"
                          onClick={() => removeLearnInterest(index)}
                          disabled={isRequired}
                          title={isRequired ? "Required interest cannot be removed" : "Remove interest"}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                  {profile.learningInterests.length === 0 && (
                    <p className="empty-state">No interests added yet. What do you want to learn?</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
            <div className="content-card fade-in">
              <div className="wallet-header">
                <div>
                  <h3 className="card-title">Transaction History</h3>
                  <p className="card-subtitle">Your recent wallet activity</p>
                </div>
                <div className="current-balance">
                  <span className="balance-label">Current Balance</span>
                  <span className="balance-amount">{user.balance} tokens</span>
                </div>
              </div>

              <div className="transactions-list">
                {transactions.length === 0 ? (
                  <div className="empty-transactions">
                    <span className="empty-icon">💰</span>
                    <p>No transactions yet</p>
                    <span className="empty-hint">Your transaction history will appear here</span>
                  </div>
                ) : (
                  transactions.map(tx => (
                    <div key={tx._id} className="transaction-item">
                      <div className="transaction-info">
                        <div className="transaction-icon">
                          {tx.amount > 0 ? '📥' : '📤'}
                        </div>
                        <div className="transaction-details">
                          <span className="transaction-desc">{tx.description}</span>
                          <span className="transaction-date">
                            {new Date(tx.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      <span className={`transaction-amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount} tokens
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .profile-container {
          font-family: 'Inter', sans-serif;
          background: #f8fafc;
          min-height: 100vh;
        }

        /* Header */
        .profile-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 2rem 2.5rem;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        .header-title {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 0.25rem;
        }

        .header-subtitle {
          color: #64748b;
          font-size: 0.95rem;
        }

        .header-actions {
          max-width: 1400px;
          margin: 1rem auto 0;
        }

        /* Save Indicator */
        .save-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s;
        }

        .save-indicator.saving {
          background: #fef3c7;
          color: #92400e;
        }

        .save-indicator.saved {
          background: #d1fae5;
          color: #065f46;
        }

        .saving-spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid #fbbf24;
          border-top-color: #92400e;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        .saved-check {
          font-weight: 700;
        }

        /* Tabs */
        .profile-tabs {
          max-width: 1400px;
          margin: 1.5rem auto 0;
          padding: 0 2.5rem;
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: #64748b;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          color: #4f46e5;
        }

        .tab-btn.active {
          color: #4f46e5;
          border-bottom-color: #4f46e5;
        }

        .tab-icon {
          font-size: 1.2rem;
        }

        /* Main Content Layout */
        .profile-content {
          max-width: 1400px;
          margin: 2rem auto;
          padding: 0 2.5rem;
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 2rem;
        }

        /* Sidebar Cards */
        .profile-card, .stats-card {
          background: white;
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          margin-bottom: 1.5rem;
        }

        .avatar-section {
          text-align: center;
        }

        .avatar-wrapper {
          width: 140px;
          height: 140px;
          margin: 0 auto 1.5rem;
          position: relative;
          cursor: pointer;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
        }

        .avatar-wrapper:hover {
          transform: scale(1.05);
        }

        .avatar-wrapper:hover .avatar-overlay {
          opacity: 1;
        }

        .avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          opacity: 0;
          transition: opacity 0.3s;
          gap: 0.25rem;
        }

        .overlay-icon {
          font-size: 1.5rem;
        }

        .avatar-spinner {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-info {
          margin-bottom: 1.5rem;
        }

        .user-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .user-email {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
        }

        .user-badge {
          display: inline-block;
          padding: 0.25rem 1rem;
          background: linear-gradient(135deg, #4f46e5, #818cf8);
          color: white;
          border-radius: 2rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .profile-stats {
          border-top: 1px solid #e2e8f0;
          padding-top: 1.5rem;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.9rem;
        }

        .stat-value {
          font-weight: 600;
          color: #0f172a;
        }

        .stat-value.highlight {
          color: #4f46e5;
          font-weight: 700;
        }

        /* Stats Card */
        .stats-title {
          font-size: 1rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .stat-box {
          text-align: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 1rem;
        }

        .stat-box-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #4f46e5;
          margin-bottom: 0.25rem;
        }

        .stat-box-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
        }

        /* Info Message */
        .info-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #e0f2fe;
          border-radius: 1rem;
          margin-bottom: 1.5rem;
          border: 1px solid #bae6fd;
        }

        .info-icon {
          font-size: 1.2rem;
        }

        .info-text {
          color: #0369a1;
          font-size: 0.9rem;
        }

        /* Main Content Cards */
        .content-card {
          background: white;
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          margin-bottom: 1.5rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .progress-badge {
          background: #e0e7ff;
          color: #4f46e5;
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .card-subtitle {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 0;
        }

        /* Form Elements */
        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #334155;
          font-size: 0.9rem;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          font-size: 0.95rem;
          transition: all 0.2s;
          background: #f8fafc;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: #4f46e5;
          background: white;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }

        .form-input:disabled, .form-select:disabled {
          background: #f1f5f9;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
          font-family: inherit;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
        }

        .form-input.with-icon {
          padding-left: 3rem;
        }

        .input-hint {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .error-message {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.85rem;
          color: #ef4444;
          font-weight: 500;
        }

        /* Form Rows */
        .form-row {
          display: flex;
          gap: 1rem;
        }

        .form-row .form-input,
        .form-row .form-select {
          flex: 1;
        }

        /* Buttons */
        .btn-add {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-add.secondary {
          background: #10b981;
        }

        .btn-add:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .btn-add.secondary:hover:not(:disabled) {
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .btn-add:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Skills Grid */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .skill-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }

        .skill-card.required {
          background: #eef2ff;
          border-color: #4f46e5;
        }

        .skill-card:hover {
          border-color: #4f46e5;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .skill-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .skill-name {
          font-weight: 600;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .required-badge {
          font-size: 0.6rem;
          padding: 0.2rem 0.5rem;
          background: #4f46e5;
          color: white;
          border-radius: 1rem;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .skill-level {
          font-size: 0.7rem;
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
          display: inline-block;
          width: fit-content;
        }

        .skill-level.beginner {
          background: #dbeafe;
          color: #1e40af;
        }

        .skill-level.intermediate {
          background: #fef3c7;
          color: #92400e;
        }

        .skill-level.expert {
          background: #fee2e2;
          color: #991b1b;
        }

        .skill-remove {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: none;
          background: white;
          color: #94a3b8;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .skill-remove:hover:not(:disabled) {
          background: #ef4444;
          color: white;
          transform: rotate(90deg);
        }

        .skill-remove:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Interests Cloud */
        .interests-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .interest-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f0fdf4;
          border: 1px solid #dcfce7;
          border-radius: 2rem;
          color: #166534;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .interest-tag.required {
          background: #eef2ff;
          border-color: #4f46e5;
          color: #1e40af;
        }

        .interest-tag:hover {
          transform: translateY(-1px);
        }

        .required-badge-small {
          font-size: 0.6rem;
          padding: 0.1rem 0.4rem;
          background: #4f46e5;
          color: white;
          border-radius: 1rem;
          margin-left: 0.5rem;
          font-weight: 500;
        }

        .tag-remove {
          background: transparent;
          border: none;
          color: #16a34a;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .interest-tag.required .tag-remove {
          color: #4f46e5;
        }

        .tag-remove:hover:not(:disabled) {
          background: #ef4444;
          color: white;
        }

        .tag-remove:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Wallet */
        .wallet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .current-balance {
          text-align: right;
        }

        .balance-label {
          display: block;
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .balance-amount {
          font-size: 1.5rem;
          font-weight: 800;
          color: #4f46e5;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .transaction-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 1rem;
          transition: all 0.2s;
        }

        .transaction-item:hover {
          background: #f1f5f9;
        }

        .transaction-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .transaction-icon {
          font-size: 1.5rem;
        }

        .transaction-details {
          display: flex;
          flex-direction: column;
        }

        .transaction-desc {
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        .transaction-date {
          font-size: 0.8rem;
          color: #64748b;
        }

        .transaction-amount {
          font-weight: 700;
        }

        .transaction-amount.positive {
          color: #16a34a;
        }

        .transaction-amount.negative {
          color: #ef4444;
        }

        /* Empty States */
        .empty-state {
          color: #94a3b8;
          font-style: italic;
          padding: 2rem;
          text-align: center;
          background: #f8fafc;
          border-radius: 1rem;
          grid-column: 1 / -1;
        }

        .empty-transactions {
          text-align: center;
          padding: 3rem;
          color: #94a3b8;
        }

        .empty-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
        }

        .empty-hint {
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        /* Loading */
        .loader-container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f8fafc;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top-color: #4f46e5;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .profile-content {
            grid-template-columns: 1fr;
          }

          .profile-tabs {
            padding: 0 1.5rem;
          }

          .profile-content {
            padding: 0 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .profile-header {
            padding: 1.5rem;
          }

          .header-title {
            font-size: 1.5rem;
          }

          .profile-tabs {
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }

          .form-row {
            flex-direction: column;
          }

          .wallet-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
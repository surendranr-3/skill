// import { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';
// import { toast } from 'react-toastify';

// const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : `http://${window.location.hostname}:5000`;

// export default function Onboarding() {
//   const { user, updateUser } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // --- STATES ---
//   const [skills, setSkills] = useState([]);
//   const [newTeachSkill, setNewTeachSkill] = useState({ name: '', level: 'Beginner' });

//   const [learningInterests, setLearningInterests] = useState([]);
//   const [newLearnInterest, setNewLearnInterest] = useState("");

//   // --- HANDLERS ---
//   const handleAddTeachSkill = () => {
//     if (!newTeachSkill.name.trim()) return;
//     setSkills([...skills, newTeachSkill]);
//     setNewTeachSkill({ name: '', level: 'Beginner' });
//   };

//   const removeTeachSkill = (index) => {
//     setSkills(skills.filter((_, i) => i !== index));
//   };

//   const handleAddLearnInterest = () => {
//     if (!newLearnInterest.trim()) return;
//     setLearningInterests([...learningInterests, newLearnInterest]);
//     setNewLearnInterest("");
//   };

//   const removeLearnInterest = (index) => {
//     setLearningInterests(learningInterests.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async () => {
//     if (skills.length === 0) {
//         toast.error("🎓 Please add at least one skill you can teach.");
//         return;
//     }
//     if (learningInterests.length === 0) {
//         toast.error("🚀 Please add at least one topic you want to learn.");
//         return;
//     }

//     try {
//       await axios.post(`${BASE_URL}/api/users/onboard`, {
//         userId: user.id,
//         skills,
//         learningInterests
//       });

//       updateUser({ ...user, isOnboarded: true });
//       toast.success("Profile setup complete! Welcome aboard. 🎉");
//       navigate('/dashboard');
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to save profile. Please try again.");
//     }
//   };

//   return (
//     <div className="container" style={{paddingTop:'40px', maxWidth:'800px', paddingBottom:'40px'}}>
      
//       {/* HEADER */}
//       <div style={{textAlign:'center', marginBottom:'40px'}}>
//         <h2>Welcome, {user?.name}! 👋</h2>
//         <p className="text-muted">Let's set up your profile to find the best matches.</p>
//       </div>

//       <div className="flex-col gap-20">

//         {/* SECTION 1: What I Will Teach */}
//         <div className="card">
//           <h3 className="mb-20" style={{color: 'var(--primary)'}}>🎓 What I Will Teach</h3>
//           <p className="text-muted mb-20" style={{fontSize:'0.9rem'}}>Add skills you are an expert in and want to mentor others.</p>
          
//           <div className="flex gap-10 mb-20">
//             <input type="text" className="input" style={{marginBottom:0}} placeholder="Skill (e.g. React)"
//               value={newTeachSkill.name} onChange={(e) => setNewTeachSkill({...newTeachSkill, name: e.target.value})} 
//               onKeyPress={(e) => e.key === 'Enter' && handleAddTeachSkill()}
//             />
//             <select className="input" style={{marginBottom:0, width:'140px'}}
//               value={newTeachSkill.level} onChange={(e) => setNewTeachSkill({...newTeachSkill, level: e.target.value})}>
//               <option>Beginner</option><option>Intermediate</option><option>Expert</option>
//             </select>
//             <button onClick={handleAddTeachSkill} className="btn btn-primary">+</button>
//           </div>

//           <div className="flex" style={{flexWrap:'wrap', gap:'10px'}}>
//             {skills.map((s, i) => (
//               <div key={i} className="skill-tag" style={{background:'#eef2ff', border:'1px solid #c7d2fe', padding:'5px 10px', borderRadius:'20px'}}>
//                 <span style={{fontWeight:'bold', color:'var(--primary)'}}>{s.name}</span>
//                 <span style={{fontSize:'0.8rem', color:'#666', marginLeft:'5px'}}>({s.level})</span>
//                 <span onClick={() => removeTeachSkill(i)} style={{cursor:'pointer', marginLeft:'10px', color:'red', fontWeight:'bold'}}>×</span>
//               </div>
//             ))}
//             {skills.length === 0 && <span className="text-muted">No teaching skills added.</span>}
//           </div>
//         </div>

//         {/* SECTION 2: What I Want to Learn */}
//         <div className="card">
//           <h3 className="mb-20" style={{color: '#d946ef'}}>🚀 What I Want to Learn</h3>
//           <p className="text-muted mb-20" style={{fontSize:'0.9rem'}}>List topics you are interested in learning from other mentors.</p>
          
//           <div className="flex gap-10 mb-20">
//             <input type="text" className="input" style={{marginBottom:0}} placeholder="Interest (e.g. Piano, Python)"
//               value={newLearnInterest} onChange={(e) => setNewLearnInterest(e.target.value)} 
//               onKeyPress={(e) => e.key === 'Enter' && handleAddLearnInterest()}
//             />
//             <button onClick={handleAddLearnInterest} className="btn btn-secondary" style={{borderColor:'#d946ef', color:'#d946ef'}}>+</button>
//           </div>

//           <div className="flex" style={{flexWrap:'wrap', gap:'10px'}}>
//             {learningInterests.map((interest, i) => (
//               <div key={i} className="skill-tag" style={{background:'#fdf4ff', border:'1px solid #f0abfc', padding:'5px 10px', borderRadius:'20px'}}>
//                 <span style={{fontWeight:'bold', color:'#c026d3'}}>{interest}</span>
//                 <span onClick={() => removeLearnInterest(i)} style={{cursor:'pointer', marginLeft:'10px', color:'red', fontWeight:'bold'}}>×</span>
//               </div>
//             ))}
//             {learningInterests.length === 0 && <span className="text-muted">No learning interests added.</span>}
//           </div>
//         </div>

//         {/* SUBMIT BUTTON */}
//         <button onClick={handleSubmit} className="btn btn-primary" style={{width:'100%', marginTop:'20px', padding:'15px', fontSize:'1.1rem'}}>
//             Complete Setup & Go to Dashboard 🚀
//         </button>

//       </div>

//     </div>
//   );
// }

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : `http://${window.location.hostname}:5000`;

export default function Onboarding() {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- STATES with pre-populated required items ---
  const [skills, setSkills] = useState([
    { name: 'Communication', level: 'Intermediate' }
  ]);
  const [newTeachSkill, setNewTeachSkill] = useState({ name: '', level: 'Beginner' });

  const [learningInterests, setLearningInterests] = useState([
    'Professional Development'
  ]);
  const [newLearnInterest, setNewLearnInterest] = useState("");

  // Validation states
  const [skillError, setSkillError] = useState('');
  const [interestError, setInterestError] = useState('');

  // Constants
  const MAX_SKILLS = 8;
  const MAX_INTERESTS = 8;
  const REQUIRED_SKILL = "Communication";
  const REQUIRED_INTEREST = "Professional Development";

  // Helper function to capitalize words
  const capitalizeWords = (str) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Check if item is required
  const isRequiredSkill = (skillName) => {
    return skillName.toLowerCase() === REQUIRED_SKILL.toLowerCase();
  };

  const isRequiredInterest = (interest) => {
    return interest.toLowerCase() === REQUIRED_INTEREST.toLowerCase();
  };

  // Add skill with validation
  const handleAddTeachSkill = () => {
    setSkillError('');
    
    if (!newTeachSkill.name.trim()) {
      setSkillError('Please enter a skill name');
      return;
    }

    if (skills.length >= MAX_SKILLS) {
      setSkillError(`You can only add up to ${MAX_SKILLS} skills`);
      return;
    }

    const capitalizedSkillName = capitalizeWords(newTeachSkill.name.trim());
    
    const isDuplicate = skills.some(
      skill => skill.name.toLowerCase() === capitalizedSkillName.toLowerCase()
    );

    if (isDuplicate) {
      setSkillError('This skill has already been added');
      return;
    }

    setSkills([...skills, { 
      name: capitalizedSkillName, 
      level: newTeachSkill.level 
    }]);
    setNewTeachSkill({ name: '', level: 'Beginner' });
  };

  // Remove skill (but not required one)
  const removeTeachSkill = (index) => {
    const skillToRemove = skills[index];
    
    if (isRequiredSkill(skillToRemove.name)) {
      toast.info('✨ Communication is a core skill that helps everyone. Keep it!', {
        icon: '🌟'
      });
      return;
    }

    setSkills(skills.filter((_, i) => i !== index));
  };

  // Add interest with validation
  const handleAddLearnInterest = () => {
    setInterestError('');
    
    if (!newLearnInterest.trim()) {
      setInterestError('Please enter a learning interest');
      return;
    }

    if (learningInterests.length >= MAX_INTERESTS) {
      setInterestError(`You can only add up to ${MAX_INTERESTS} interests`);
      return;
    }

    const capitalizedInterest = capitalizeWords(newLearnInterest.trim());
    
    const isDuplicate = learningInterests.some(
      interest => interest.toLowerCase() === capitalizedInterest.toLowerCase()
    );

    if (isDuplicate) {
      setInterestError('This interest has already been added');
      return;
    }

    setLearningInterests([...learningInterests, capitalizedInterest]);
    setNewLearnInterest("");
  };

  // Remove interest (but not required one)
  const removeLearnInterest = (index) => {
    const interestToRemove = learningInterests[index];
    
    if (isRequiredInterest(interestToRemove)) {
      toast.info('🌱 Professional Development is your growth compass. Keep it!', {
        icon: '🎯'
      });
      return;
    }

    setLearningInterests(learningInterests.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}/api/users/onboard`, {
        userId: user.id,
        skills,
        learningInterests
      });

      updateUser({ ...user, isOnboarded: true });
      toast.success("🎉 Amazing! Your profile is ready. Let's start your journey!");
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="onboarding-container">
      {/* Decorative Background */}
      <div className="onboarding-bg">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
      </div>

      <div className="onboarding-content">
        {/* HEADER */}
        <div className="onboarding-header">
          <div className="welcome-badge">✨ Quick Setup</div>
          <h1 className="onboarding-title">Welcome, {user?.name?.split(' ')[0] || 'Friend'}!</h1>
          <p className="onboarding-subtitle">
            We've added a couple of essentials to get you started. Add more to customize your experience!
          </p>
        </div>

        <div className="onboarding-cards">
          {/* SECTION 1: Skills I Teach */}
          <div className="onboarding-card teach-card">
            <div className="card-header">
              <div className="card-icon">🎓</div>
              <div>
                <h2 className="card-title">Skills I Teach</h2>
                <p className="card-subtitle">Add more skills (max {MAX_SKILLS})</p>
              </div>
              <div className="progress-badge">
                {skills.length}/{MAX_SKILLS}
              </div>
            </div>

            {/* Friendly welcome message */}
            <div className="welcome-message">
              <span className="message-icon">💡</span>
              <span className="message-text">
                <strong>Communication</strong> is pre-added - it's valued by every mentor!
              </span>
            </div>
            
            <div className="add-form">
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. React, Python, Design" 
                  value={newTeachSkill.name}
                  onChange={(e) => {
                    setNewTeachSkill({...newTeachSkill, name: e.target.value});
                    setSkillError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTeachSkill()}
                  disabled={skills.length >= MAX_SKILLS}
                />
                <select 
                  className="form-select"
                  value={newTeachSkill.level}
                  onChange={(e) => setNewTeachSkill({...newTeachSkill, level: e.target.value})}
                  disabled={skills.length >= MAX_SKILLS}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
                <button 
                  onClick={handleAddTeachSkill} 
                  className="add-button"
                  disabled={skills.length >= MAX_SKILLS}
                >
                  + Add
                </button>
              </div>
              {skillError && <span className="error-message">{skillError}</span>}
            </div>

            <div className="skills-grid">
              {skills.map((skill, index) => {
                const isRequired = isRequiredSkill(skill.name);
                return (
                  <div key={index} className={`skill-item ${isRequired ? 'required' : ''}`}>
                    <div className="skill-info">
                      <span className="skill-name">
                        {skill.name}
                        {isRequired && (
                          <span className="essential-badge">Essential</span>
                        )}
                      </span>
                      <span className={`skill-level ${skill.level.toLowerCase()}`}>
                        {skill.level}
                      </span>
                    </div>
                    <button 
                      className="remove-button"
                      onClick={() => removeTeachSkill(index)}
                      disabled={isRequired}
                      title={isRequired ? "Essential skill for all mentors" : "Remove skill"}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: Learning Interests */}
          <div className="onboarding-card learn-card">
            <div className="card-header">
              <div className="card-icon">🚀</div>
              <div>
                <h2 className="card-title">Learning Interests</h2>
                <p className="card-subtitle">Add more interests (max {MAX_INTERESTS})</p>
              </div>
              <div className="progress-badge">
                {learningInterests.length}/{MAX_INTERESTS}
              </div>
            </div>

            <div className="welcome-message">
              <span className="message-icon">🌟</span>
              <span className="message-text">
                <strong>Professional Development</strong> is pre-added - every great journey starts here!
              </span>
            </div>
            
            <div className="add-form">
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Machine Learning, Piano, Photography" 
                  value={newLearnInterest}
                  onChange={(e) => {
                    setNewLearnInterest(e.target.value);
                    setInterestError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLearnInterest()}
                  disabled={learningInterests.length >= MAX_INTERESTS}
                />
                <button 
                  onClick={handleAddLearnInterest} 
                  className="add-button learn-button"
                  disabled={learningInterests.length >= MAX_INTERESTS}
                >
                  + Add
                </button>
              </div>
              {interestError && <span className="error-message">{interestError}</span>}
            </div>

            <div className="interests-cloud">
              {learningInterests.map((interest, index) => {
                const isRequired = isRequiredInterest(interest);
                return (
                  <div key={index} className={`interest-item ${isRequired ? 'required' : ''}`}>
                    <span className="interest-name">
                      {interest}
                      {isRequired && (
                        <span className="essential-badge-small">Essential</span>
                      )}
                    </span>
                    <button 
                      className="remove-button-small"
                      onClick={() => removeLearnInterest(index)}
                      disabled={isRequired}
                      title={isRequired ? "Essential for growth" : "Remove interest"}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="submit-section">
            <button onClick={handleSubmit} className="submit-button">
              <span>Start My Journey</span>
              <span className="button-icon">✨</span>
            </button>
            <p className="submit-hint">
              You can always add more skills and interests later in your profile
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .onboarding-container {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        /* Animated Background */
        .onboarding-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 20s infinite;
        }

        .circle-1 {
          width: 300px;
          height: 300px;
          top: -100px;
          right: -100px;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 400px;
          height: 400px;
          bottom: -150px;
          left: -150px;
          animation-delay: 5s;
        }

        .circle-3 {
          width: 200px;
          height: 200px;
          bottom: 50%;
          right: 20%;
          animation-delay: 10s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }

        .onboarding-content {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* Header Styles */
        .onboarding-header {
          text-align: center;
          margin-bottom: 3rem;
          color: white;
        }

        .welcome-badge {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 2rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .onboarding-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .onboarding-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Cards Container */
        .onboarding-cards {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* Card Styles */
        .onboarding-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 2rem;
          padding: 2rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s ease;
        }

        .onboarding-card:hover {
          transform: translateY(-5px);
        }

        .teach-card {
          border-left: 5px solid #4f46e5;
        }

        .learn-card {
          border-left: 5px solid #d946ef;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .card-icon {
          font-size: 2.5rem;
          background: #f8fafc;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .card-subtitle {
          color: #64748b;
          font-size: 0.9rem;
        }

        .progress-badge {
          margin-left: auto;
          background: #e0e7ff;
          color: #4f46e5;
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-weight: 600;
          font-size: 0.9rem;
        }

        /* Welcome Message */
        .welcome-message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 1rem;
          margin-bottom: 1.5rem;
          border: 1px solid #bae6fd;
        }

        .message-icon {
          font-size: 1.5rem;
        }

        .message-text {
          color: #0369a1;
          font-size: 0.95rem;
          line-height: 1.4;
        }

        /* Add Form */
        .add-form {
          margin-bottom: 1.5rem;
        }

        .input-group {
          display: flex;
          gap: 1rem;
        }

        .form-input {
          flex: 2;
          padding: 1rem 1.2rem;
          border: 2px solid #e2e8f0;
          border-radius: 1rem;
          font-size: 1rem;
          transition: all 0.2s;
          background: #f8fafc;
        }

        .form-input:focus {
          outline: none;
          border-color: #4f46e5;
          background: white;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }

        .form-input:disabled {
          background: #f1f5f9;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .form-select {
          flex: 1;
          padding: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 1rem;
          font-size: 1rem;
          background: #f8fafc;
          cursor: pointer;
        }

        .form-select:focus {
          outline: none;
          border-color: #4f46e5;
        }

        .form-select:disabled {
          background: #f1f5f9;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .add-button {
          padding: 1rem 2rem;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .add-button.learn-button {
          background: #d946ef;
        }

        .add-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .add-button.learn-button:hover:not(:disabled) {
          box-shadow: 0 4px 12px rgba(217, 70, 239, 0.3);
        }

        .add-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-message {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.85rem;
          color: #ef4444;
          font-weight: 500;
        }

        /* Skills Grid */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .skill-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }

        .skill-item.required {
          background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
          border-color: #4f46e5;
        }

        .skill-item:hover {
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
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .essential-badge {
          font-size: 0.6rem;
          padding: 0.2rem 0.5rem;
          background: #10b981;
          color: white;
          border-radius: 1rem;
          font-weight: 500;
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

        .remove-button {
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

        .remove-button:hover:not(:disabled) {
          background: #ef4444;
          color: white;
          transform: rotate(90deg);
        }

        .remove-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .remove-button:disabled:hover {
          background: white;
          transform: none;
        }

        /* Interests Cloud */
        .interests-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .interest-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f0fdf4;
          border: 1px solid #dcfce7;
          border-radius: 2rem;
          color: #166534;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .interest-item.required {
          background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
          border-color: #4f46e5;
          color: #1e40af;
        }

        .interest-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .interest-name {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .essential-badge-small {
          font-size: 0.6rem;
          padding: 0.15rem 0.4rem;
          background: #10b981;
          color: white;
          border-radius: 1rem;
          font-weight: 500;
        }

        .remove-button-small {
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

        .interest-item.required .remove-button-small {
          color: #4f46e5;
        }

        .remove-button-small:hover:not(:disabled) {
          background: #ef4444;
          color: white;
        }

        .remove-button-small:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .remove-button-small:disabled:hover {
          background: transparent;
          transform: none;
        }

        /* Submit Section */
        .submit-section {
          text-align: center;
          margin-top: 1rem;
        }

        .submit-button {
          background: white;
          color: #4f46e5;
          border: none;
          padding: 1.2rem 3rem;
          border-radius: 3rem;
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .submit-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }

        .button-icon {
          font-size: 1.4rem;
          transition: transform 0.3s;
        }

        .submit-button:hover .button-icon {
          transform: translateX(5px);
        }

        .submit-hint {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          margin-top: 1rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .onboarding-container {
            padding: 1rem;
          }

          .onboarding-title {
            font-size: 1.8rem;
          }

          .card-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .progress-badge {
            margin-left: 0;
          }

          .input-group {
            flex-direction: column;
          }

          .form-select {
            width: 100%;
          }

          .add-button {
            width: 100%;
          }

          .skills-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
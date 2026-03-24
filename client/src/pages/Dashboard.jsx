import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

// --- FIXED API URL DETECTION ---
// --- FIXED API URL DETECTION ---
export const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://skill-0bu7.onrender.com/api'; // Your ACTUAL Render Backend

export default function Dashboard({ showToast }) {

  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { socket } = useSocket();

  const [mentors, setMentors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [bookingModal, setBookingModal] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingHour, setBookingHour] = useState("09");
  const [bookingMinute, setBookingMinute] = useState("00");
  const [bookingPeriod, setBookingPeriod] = useState("AM");

  const [selectedSession, setSelectedSession] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const [waitingRooms, setWaitingRooms] = useState(new Set());

  const [, setTick] = useState(0);

  const hoursList = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );

  const minutesList = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0')
  );

  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    try {

      const mentorRes = await axios.get(`${BASE_URL}/api/users/mentors`);
      const sessionRes = await axios.get(`${BASE_URL}/api/sessions/${user.id}`);

      setMentors(mentorRes.data);
      setSessions(sessionRes.data);

      if (location.state?.reviewRoomId) {

        const sessionToReview = sessionRes.data.find(
          s => s.roomId === location.state.reviewRoomId
        );

        if (
          sessionToReview &&
          sessionToReview.learner._id === user.id &&
          sessionToReview.status !== 'completed'
        ) {
          setSelectedSession(sessionToReview);
          window.history.replaceState({}, document.title);
        }
      }

      const myProfile = mentorRes.data.find(u => u._id === user.id);

      if (myProfile && myProfile.walletBalance !== user.balance) {
        updateUser({ balance: myProfile.walletBalance });
      }

    } catch (error) {
      console.error(error);
    }

  }, [user, location.state, updateUser]);


  useEffect(() => {

    fetchData();

    if (location.state?.message) {
      showToast(location.state.message, location.state.type || 'info');
      window.history.replaceState(
        { ...location.state, message: null },
        document.title
      );
    }

    if (socket && user?.id) {

      socket.emit('join_chat', user.id);

      socket.on('session_update', () => fetchData());

      socket.on('partner_active', ({ roomId }) => {

        console.log(`Partner waiting in: ${roomId}`);

        setWaitingRooms(prev => new Set(prev).add(roomId));

        showToast(
          "Your partner is waiting in the video room!",
          "success"
        );

      });

      socket.on('partner_inactive', ({ roomId }) => {

        console.log(`Partner left: ${roomId}`);

        setWaitingRooms(prev => {

          const newSet = new Set(prev);
          newSet.delete(roomId);

          return newSet;

        });

      });

      return () => {
        socket.off('session_update');
        socket.off('partner_active');
        socket.off('partner_inactive');
      };
    }

    const onFocus = () => fetchData();

    window.addEventListener("focus", onFocus);

    const timer = setInterval(
      () => setTick(t => t + 1),
      30000
    );

    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(timer);
    };

  }, [fetchData, location.state, showToast, socket, user]);


  const getSessionStatus = (session) => {

    if (session.status === 'completed') return 'completed';

    if (session.status === 'missed') return 'expired';

    if (session.status === 'cancelled') return 'cancelled';

    const now = new Date();

    const startTime = new Date(session.startTime);

    const endTime = new Date(startTime.getTime() + (60 * 60 * 1000));

    if (now > endTime) return 'expired';

    const diffMs = startTime - now;

    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins > 1) return 'upcoming';

    return 'ready';

  };


  const openBookingModal = (mentor) => {

    setBookingModal(mentor);

    setBookingDate("");

    setBookingHour("09");

    setBookingMinute("00");

    setBookingPeriod("AM");

  };


  const confirmBooking = async () => {

    if (!bookingDate) return showToast("Select a Date", "error");

    let hour24 = parseInt(bookingHour);

    if (bookingPeriod === "PM" && hour24 !== 12) hour24 += 12;

    if (bookingPeriod === "AM" && hour24 === 12) hour24 = 0;

    const time24 = `${hour24.toString().padStart(2, '0')}:${bookingMinute}:00`;

    const scheduleDateTime = new Date(`${bookingDate}T${time24}`);

    if (scheduleDateTime < new Date())
      return showToast("Cannot book past time!", "error");

    const cost = bookingModal.hourlyRate || 20;

    if (user.balance < cost)
      return showToast(`Insufficient funds! Need ${cost}`, 'error');

    try {

      await axios.post(`${BASE_URL}/api/sessions/book`, {

        learnerId: user.id,

        mentorId: bookingModal._id,

        skill: bookingModal.skills[0]?.name || "General",

        duration: 60,

        startTime: scheduleDateTime

      });

      updateUser({ balance: user.balance - cost });

      showToast('Session Booked!', 'success');

      setBookingModal(null);

    } catch (err) {

      showToast(err.response?.data?.error || "Booking failed", 'error');

    }

  };


  const submitReview = async () => {

    if (!selectedSession) return;

    if (rating === 0)
      return showToast("Please select a star rating", "error");

    try {

      await axios.post(`${BASE_URL}/api/sessions/review`, {

        sessionId: selectedSession._id,

        rating: parseInt(rating),

        comment: reviewComment

      });

      showToast("Review Submitted!", 'success');

      setSelectedSession(null);

      setReviewComment("");

      setRating(0);

      fetchData();

    } catch (err) {

      console.error(err);

      showToast(
        err.response?.data?.error || "Failed",
        "error"
      );

    }

  };


  const filteredMentors = mentors.filter(

    m =>
      m._id !== user.id &&
      (
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.skills.some(
          s =>
            s.name.toLowerCase().includes(
              searchQuery.toLowerCase()
            )
        )
      )

  );
// ... (all imports and logic remain EXACTLY the same until the return statement)

return (
    <div className="dashboard">

      {/* BACKGROUND ELEMENTS */}
      <div className="bg-grid"></div>
      <div className="bg-glow"></div>

      <div className="dashboard-wrapper">

        {/* PROFILE SIDEBAR */}
        <aside className="profile-sidebar">
          <div className="profile-card">
            <div className="avatar-container">
              <div className="avatar-ring">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                  className="avatar"
                />
              </div>
              <span className="status-dot"></span>
            </div>

            <h2 className="user-name">{user.name}</h2>
            <span className="user-role">{user.role}</span>

            <div className="wallet-card">
              <div className="wallet-header">
                <span className="wallet-icon">💰</span>
                <span className="wallet-label">Wallet Balance</span>
              </div>
              <div className="wallet-amount">
                <span className="amount">{user.balance}</span>
                <span className="currency">Tokens</span>
              </div>
            </div>

            <div className="quick-stats">
              <div className="stat">
                <span className="stat-value">{sessions.length}</span>
                <span className="stat-label">Sessions</span>
              </div>
              <div className="stat">
                <span className="stat-value">{mentors.length}</span>
                <span className="stat-label">Mentors</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">

          {/* SESSIONS SECTION */}
          <section className="content-card">
            <div className="card-header">
              <h2>
                <span className="header-icon">📅</span>
                Your Schedule
              </h2>
            </div>

            {sessions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <p className="empty-title">No sessions scheduled</p>
                <p className="empty-desc">Book a mentor to get started</p>
              </div>
            ) : (
              <div className="sessions-grid">
                {[...sessions].reverse().map(s => {
                  const status = getSessionStatus(s);
                  const isLearner = s.learner._id === user.id;
                  const isPartnerWaiting = waitingRooms.has(s.roomId);

                  return (
                    <div key={s._id} className={`session-card ${status}`}>
                      <div className="session-header">
                        <span className="session-skill">{s.skill}</span>
                        <span className={`session-status ${status}`}>
                          {status === 'ready' && 'Ready'}
                          {status === 'upcoming' && 'Scheduled'}
                          {status === 'completed' && 'Completed'}
                          {status === 'expired' && 'Missed'}
                          {status === 'cancelled' && 'Cancelled'}
                        </span>
                      </div>

                      <div className="session-datetime">
                        <span className="date">
                          {new Date(s.startTime).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="time">
                          {new Date(s.startTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </div>

                      <div className="session-participant">
                        <span className="participant-label">
                          {isLearner ? 'Mentor' : 'Student'}:
                        </span>
                        <span className="participant-name">
                          {isLearner ? s.mentor.name : s.learner.name}
                        </span>
                      </div>

                      {status === 'ready' && (
                        <button
                          onClick={() => navigate(`/room/${s.roomId}`, {
                            state: { sessionId: s._id, isLearner }
                          })}
                          className={`btn-join ${isPartnerWaiting ? 'waiting' : ''}`}
                        >
                          {isPartnerWaiting ? (
                            <>
                              <span className="btn-icon">👥</span>
                              <span>Partner Ready</span>
                            </>
                          ) : (
                            <>
                              <span className="btn-icon">🚀</span>
                              <span>Join Session</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* MENTORS SECTION - RESTORED & IMPROVED */}
          <section className="content-card">
            <div className="card-header">
              <h2>
                <span className="header-icon">🌟</span>
                Find a Mentor
              </h2>
              <div className="search-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search mentors or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>

            <div className="mentors-grid">
              {filteredMentors.map(mentor => (
                <div key={mentor._id} className="mentor-card">
                  <div className="mentor-avatar-wrapper">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${mentor.name}`}
                      alt={mentor.name}
                      className="mentor-avatar"
                    />
                  </div>
                  
                  <div className="mentor-info">
                    <h3 className="mentor-name">{mentor.name}</h3>
                    <div className="mentor-skills">
                      {mentor.skills?.slice(0, 2).map((skill, idx) => (
                        <span key={idx} className="skill-chip">{skill.name}</span>
                      ))}
                      {mentor.skills?.length > 2 && (
                        <span className="skill-chip more">+{mentor.skills.length - 2}</span>
                      )}
                    </div>
                    <div className="mentor-rate">
                      <span className="rate-icon">⚡</span>
                      <span className="rate-value">{mentor.hourlyRate || 20}</span>
                      <span className="rate-label">/hr</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openBookingModal(mentor)}
                    className="btn-book"
                  >
                    Book Session
                  </button>
                </div>
              ))}

              {filteredMentors.length === 0 && (
                <div className="no-mentors">
                  <p>No mentors found</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* BOOKING MODAL */}
      {bookingModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={() => setBookingModal(null)}>×</button>
            
            <div className="modal-header">
              <div className="modal-mentor">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${bookingModal.name}`}
                  alt={bookingModal.name}
                  className="modal-avatar"
                />
                <div>
                  <h3>Book with</h3>
                  <h2>{bookingModal.name}</h2>
                </div>
              </div>
              <div className="modal-cost">
                <span className="cost-icon">⚡</span>
                <span className="cost-value">{bookingModal.hourlyRate || 20}</span>
                <span className="cost-label">/hr</span>
              </div>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Select Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={bookingDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={e => setBookingDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Select Time</label>
                <div className="time-picker">
                  <select className="time-select" value={bookingHour} onChange={e => setBookingHour(e.target.value)}>
                    {hoursList.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span className="time-sep">:</span>
                  <select className="time-select" value={bookingMinute} onChange={e => setBookingMinute(e.target.value)}>
                    {minutesList.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select className="time-select period" value={bookingPeriod} onChange={e => setBookingPeriod(e.target.value)}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div className="balance-info">
                <span>Your balance:</span>
                <span className="balance-amount">{user.balance} ⚡</span>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setBookingModal(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={confirmBooking} className="btn btn-primary">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {selectedSession && (
        <div className="modal-overlay">
          <div className="modal review-modal">
            <div className="modal-header">
              <h2>🎉 Session Complete!</h2>
              <p>How was your experience?</p>
            </div>

            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`star ${rating >= star ? 'active' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="review-input"
              rows="3"
              placeholder="Share your feedback..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />

            <button onClick={submitReview} className="btn btn-primary full-width">
              Submit Review
            </button>
          </div>
        </div>
      )}

      <style>{`
        /* ===== DESIGN SYSTEM ===== */
        :root {
          --primary: #6366f1;
          --primary-light: #818cf8;
          --primary-dark: #4f46e5;
          --primary-soft: #e0e7ff;
          --secondary: #10b981;
          --secondary-light: #34d399;
          --secondary-soft: #d1fae5;
          --accent: #8b5cf6;
          --background: #f8fafc;
          --surface: #ffffff;
          --text: #0f172a;
          --text-light: #475569;
          --text-lighter: #94a3b8;
          --border: #e2e8f0;
          --shadow-sm: 0 2px 8px rgba(0,0,0,0.02);
          --shadow-md: 0 4px 12px rgba(0,0,0,0.04);
          --shadow-lg: 0 8px 20px rgba(0,0,0,0.06);
          --shadow-xl: 0 12px 28px rgba(0,0,0,0.08);
          --radius-sm: 6px;
          --radius-md: 10px;
          --radius-lg: 14px;
          --radius-xl: 20px;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: var(--background);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--text);
          line-height: 1.5;
        }

        /* ===== BACKGROUND ===== */
        .dashboard {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .bg-grid {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(var(--border) 0.5px, transparent 0.5px),
            linear-gradient(90deg, var(--border) 0.5px, transparent 0.5px);
          background-size: 40px 40px;
          opacity: 0.25;
          pointer-events: none;
        }

        .bg-glow {
          position: fixed;
          top: -50%;
          left: -20%;
          width: 140%;
          height: 200%;
          background: radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.06), transparent 50%);
          filter: blur(60px);
          pointer-events: none;
        }

        /* ===== LAYOUT ===== */
        .dashboard-wrapper {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ===== PROFILE SIDEBAR ===== */
        .profile-sidebar {
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .profile-card {
          background: var(--surface);
          border-radius: var(--radius-xl);
          padding: 2rem;
          box-shadow: var(--shadow-lg);
          border: 1px solid rgba(255,255,255,0.5);
          transition: all 0.3s ease;
        }

        .profile-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
        }

        .avatar-container {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto 1.5rem;
        }

        .avatar-ring {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(135deg, var(--primary), var(--accent));
        }

        .avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid white;
        }

        .status-dot {
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 14px;
          height: 14px;
          background: var(--secondary);
          border: 2px solid white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .user-name {
          text-align: center;
          font-size: 1.35rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 0.25rem;
        }

        .user-role {
          display: block;
          text-align: center;
          color: var(--text-light);
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .wallet-card {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          color: white;
        }

        .wallet-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          opacity: 0.9;
        }

        .wallet-icon {
          font-size: 1.1rem;
        }

        .wallet-label {
          font-size: 0.85rem;
        }

        .wallet-amount {
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
        }

        .amount {
          font-size: 1.8rem;
          font-weight: 700;
        }

        .currency {
          font-size: 0.85rem;
          opacity: 0.9;
        }

        .quick-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          text-align: center;
        }

        .stat {
          padding: 0.6rem;
          background: var(--background);
          border-radius: var(--radius-md);
        }

        .stat-value {
          display: block;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--primary);
        }

        .stat-label {
          font-size: 0.7rem;
          color: var(--text-light);
        }

        /* ===== MAIN CONTENT ===== */
        .main-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .content-card {
          background: var(--surface);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          box-shadow: var(--shadow-lg);
          border: 1px solid rgba(255,255,255,0.5);
          transition: all 0.3s ease;
        }

        .content-card:hover {
          box-shadow: var(--shadow-xl);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .card-header h2 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text);
        }

        .header-icon {
          font-size: 1.3rem;
        }

        /* ===== SEARCH ===== */
        .search-wrapper {
          position: relative;
          min-width: 260px;
        }

        .search-input {
          width: 100%;
          padding: 0.6rem 1rem 0.6rem 2.5rem;
          border: 1px solid var(--border);
          border-radius: 30px;
          font-size: 0.85rem;
          transition: all 0.2s ease;
          background: var(--background);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 0.9rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-lighter);
          font-size: 0.9rem;
        }

        /* ===== SESSIONS GRID ===== */
        .sessions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .session-card {
          background: var(--background);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          transition: all 0.2s ease;
          border: 1px solid var(--border);
        }

        .session-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary-light);
        }

        .session-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .session-skill {
          font-weight: 600;
          color: var(--text);
          font-size: 0.95rem;
        }

        .session-status {
          font-size: 0.7rem;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-weight: 500;
        }

        .session-status.ready {
          background: #dbeafe;
          color: #1e40af;
        }

        .session-status.upcoming {
          background: #fef3c7;
          color: #92400e;
        }

        .session-status.completed {
          background: #d1fae5;
          color: #065f46;
        }

        .session-status.expired {
          background: #fee2e2;
          color: #991b1b;
        }

        .session-status.cancelled {
          background: #f3f4f6;
          color: #4b5563;
        }

        .session-datetime {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          font-size: 0.85rem;
        }

        .date {
          color: var(--text-light);
        }

        .time {
          font-weight: 500;
          color: var(--primary);
        }

        .session-participant {
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }

        .participant-label {
          color: var(--text-light);
          margin-right: 0.25rem;
        }

        .participant-name {
          font-weight: 500;
          color: var(--text);
        }

        .btn-join {
          width: 100%;
          padding: 0.6rem;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          transition: all 0.2s ease;
          background: var(--primary);
          color: white;
        }

        .btn-join:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
        }

        .btn-join.waiting {
          background: var(--secondary);
        }

        .btn-join.waiting:hover {
          background: #0d9488;
        }

        .btn-icon {
          font-size: 0.9rem;
        }

        /* ===== MENTORS GRID - RESTORED & IMPROVED ===== */
        .mentors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
        }

        .mentor-card {
          background: var(--background);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          transition: all 0.2s ease;
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .mentor-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary-light);
        }

        .mentor-avatar-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          margin-bottom: 0.75rem;
          overflow: hidden;
          border: 2px solid white;
          box-shadow: var(--shadow-sm);
        }

        .mentor-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mentor-info {
          flex: 1;
        }

        .mentor-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 0.5rem;
        }

        .mentor-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 0.75rem;
        }

        .skill-chip {
          padding: 0.2rem 0.6rem;
          background: white;
          border-radius: 20px;
          font-size: 0.65rem;
          color: var(--primary);
          border: 1px solid var(--primary-light);
          font-weight: 500;
        }

        .skill-chip.more {
          background: var(--primary-light);
          color: white;
          border: none;
        }

        .mentor-rate {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.85rem;
          background: var(--primary-soft);
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          width: fit-content;
        }

        .rate-icon {
          color: #f59e0b;
          font-size: 0.8rem;
        }

        .rate-value {
          font-weight: 600;
          color: var(--primary-dark);
        }

        .rate-label {
          color: var(--text-light);
          font-size: 0.7rem;
        }

        .btn-book {
          margin-top: 1rem;
          padding: 0.6rem;
          border: 1px solid var(--primary);
          border-radius: var(--radius-md);
          background: transparent;
          color: var(--primary);
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-book:hover {
          background: var(--primary);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.2);
        }

        .no-mentors {
          grid-column: 1 / -1;
          text-align: center;
          padding: 2rem;
          color: var(--text-lighter);
          font-size: 0.9rem;
        }

        /* ===== EMPTY STATE ===== */
        .empty-state {
          text-align: center;
          padding: 2.5rem 1rem;
        }

        .empty-icon {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
          opacity: 0.5;
        }

        .empty-title {
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-light);
          margin-bottom: 0.25rem;
        }

        .empty-desc {
          font-size: 0.85rem;
          color: var(--text-lighter);
        }

        /* ===== MODALS ===== */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          animation: overlayFade 0.2s ease;
        }

        @keyframes overlayFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal {
          background: var(--surface);
          border-radius: var(--radius-xl);
          max-width: 480px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: modalSlide 0.3s ease;
          box-shadow: var(--shadow-xl);
        }

        @keyframes modalSlide {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 2rem;
          height: 2rem;
          border: none;
          background: var(--background);
          border-radius: 50%;
          font-size: 1.3rem;
          color: var(--text-light);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .modal-close:hover {
          background: var(--border);
          transform: rotate(90deg);
        }

        .modal-header {
          padding: 1.5rem 1.5rem 1rem;
        }

        .modal-mentor {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .modal-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: var(--shadow-sm);
        }

        .modal-mentor h3 {
          font-size: 0.8rem;
          color: var(--text-light);
          margin-bottom: 0.2rem;
        }

        .modal-mentor h2 {
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--text);
        }

        .modal-cost {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          padding: 0.4rem 0.8rem;
          background: var(--background);
          border-radius: 20px;
        }

        .cost-icon {
          color: #f59e0b;
          font-size: 0.9rem;
        }

        .cost-value {
          font-weight: 600;
          color: var(--text);
          font-size: 0.95rem;
        }

        .cost-label {
          font-size: 0.7rem;
          color: var(--text-light);
        }

        .modal-body {
          padding: 1rem 1.5rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.4rem;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text);
        }

        .form-input {
          width: 100%;
          padding: 0.6rem 0.8rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .time-picker {
          display: flex;
          gap: 0.4rem;
          align-items: center;
        }

        .time-select {
          flex: 1;
          padding: 0.6rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          background: white;
          cursor: pointer;
        }

        .time-select:focus {
          outline: none;
          border-color: var(--primary);
        }

        .time-select.period {
          flex: 1.5;
        }

        .time-sep {
          color: var(--text-light);
          font-weight: 500;
        }

        .balance-info {
          display: flex;
          justify-content: space-between;
          padding: 0.6rem 0.8rem;
          background: var(--background);
          border-radius: var(--radius-md);
          font-size: 0.85rem;
        }

        .balance-amount {
          font-weight: 600;
          color: var(--primary);
        }

        .modal-footer {
          padding: 1rem 1.5rem 1.5rem;
          display: flex;
          gap: 0.8rem;
        }

        .btn {
          flex: 1;
          padding: 0.7rem;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: var(--primary);
          color: white;
        }

        .btn-primary:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
        }

        .btn-secondary {
          background: var(--background);
          color: var(--text);
        }

        .btn-secondary:hover {
          background: var(--border);
        }

        .full-width {
          width: 100%;
        }

        /* REVIEW MODAL */
        .review-modal {
          text-align: center;
        }

        .review-modal .modal-header {
          padding-bottom: 0;
        }

        .review-modal .modal-header p {
          color: var(--text-light);
          margin-top: 0.25rem;
          font-size: 0.9rem;
        }

        .rating {
          display: flex;
          gap: 0.4rem;
          justify-content: center;
          margin: 1.25rem 0;
        }

        .star {
          background: none;
          border: none;
          font-size: 1.8rem;
          color: var(--text-lighter);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .star:hover {
          transform: scale(1.2);
          color: #fbbf24;
        }

        .star.active {
          color: #fbbf24;
        }

        .review-input {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          margin-bottom: 1.25rem;
          resize: vertical;
          font-family: inherit;
          font-size: 0.85rem;
        }

        .review-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .dashboard-wrapper {
            grid-template-columns: 260px 1fr;
            padding: 1.5rem;
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .dashboard-wrapper {
            grid-template-columns: 1fr;
          }

          .profile-sidebar {
            position: static;
          }

          .profile-card {
            max-width: 380px;
            margin: 0 auto;
          }

          .card-header {
            flex-direction: column;
            align-items: stretch;
          }

          .search-wrapper {
            min-width: auto;
          }

          .sessions-grid,
          .mentors-grid {
            grid-template-columns: 1fr;
          }

          .modal-footer {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .dashboard-wrapper {
            padding: 1rem;
          }

          .profile-card,
          .content-card {
            padding: 1.25rem;
          }

          .modal-header,
          .modal-body,
          .modal-footer {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
          }

          .time-picker {
            flex-wrap: wrap;
          }

          .time-select {
            min-width: calc(33.333% - 0.25rem);
          }
        }
      `}</style>
    </div>
  );
}


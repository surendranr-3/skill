// import { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const BASE_URL = window.location.hostname === 'localhost' 
//   ? 'http://localhost:5000' 
//   : `http://${window.location.hostname}:5000`;

// export default function Marketplace({ showToast }) {
//   const { user, updateUser } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [mentors, setMentors] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
  
//   // --- BOOKING STATES ---
//   const [bookingModal, setBookingModal] = useState(null);
//   const [bookingDate, setBookingDate] = useState("");
  
//   // 🚨 NEW: Granular Time State 🚨
//   const [bookingHour, setBookingHour] = useState("09");
//   const [bookingMinute, setBookingMinute] = useState("00");
//   const [bookingPeriod, setBookingPeriod] = useState("AM");

//   // --- DATA GENERATION (00-59 Minutes) ---
//   const hoursList = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')); 
//   const minutesList = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));     

//   useEffect(() => {
//     const fetchMentors = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/users/mentors`);
//         setMentors(res.data);
//       } catch (err) { console.error(err); }
//     };
//     fetchMentors();
//   }, []);

//   const openBookingModal = (mentor) => {
//     setBookingModal(mentor);
//     setBookingDate("");
//     // Default to 9:00 AM
//     setBookingHour("09");
//     setBookingMinute("00");
//     setBookingPeriod("AM");
//   };

//   const handleMessage = (mentor) => {
//     navigate('/messages', { state: { contact: mentor } });
//   };

//   const confirmBooking = async () => {
//     if (!bookingDate) return showToast("Select a Date", "error");

//     // 🚨 LOGIC: Convert 12-Hour to 24-Hour for Backend 🚨
//     let hour24 = parseInt(bookingHour);
//     if (bookingPeriod === "PM" && hour24 !== 12) hour24 += 12;
//     if (bookingPeriod === "AM" && hour24 === 12) hour24 = 0;
    
//     const time24 = `${hour24.toString().padStart(2, '0')}:${bookingMinute}`;
//     const scheduleDateTime = new Date(`${bookingDate}T${time24}`);

//     if (scheduleDateTime < new Date()) return showToast("Invalid Date (Past)", "error");

//     const cost = bookingModal.hourlyRate || 20;
//     if (user.balance < cost) return showToast(`Insufficient funds! Need ${cost}`, 'error');

//     try {
//       await axios.post(`${BASE_URL}/api/sessions/book`, {
//         learnerId: user.id,
//         mentorId: bookingModal._id,
//         skill: bookingModal.skills[0]?.name || "General",
//         duration: 60,
//         startTime: scheduleDateTime
//       });
      
//       updateUser({ balance: user.balance - cost });
//       showToast('Session Booked!', 'success');
//       setBookingModal(null);
//     } catch (err) { showToast("Booking Failed", 'error'); }
//   };

//   const filteredMentors = mentors.filter(m => m._id !== user.id && (
//     m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     m.skills.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
//   ));

//   return (
//     <div className="container">
//       <div className="flex justify-between mb-20" style={{alignItems:'center', flexWrap:'wrap', gap:'10px'}}>
//         <h2>🛍 Mentor Marketplace</h2>
//         <input type="text" className="input" placeholder="Search..." style={{width:'300px', marginBottom:0}} 
//           value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
//       </div>

//       <div className="mentor-grid">
//         {filteredMentors.map(mentor => (
//           <div key={mentor._id} className="mentor-card flex-col">
//             <div className="flex gap-10 mb-10">
//               <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${mentor.name}`} alt="av" className="avatar-circle" style={{width:'50px', height:'50px', fontSize:'1.2rem'}} />
//               <div>
//                 <div style={{fontWeight:'bold'}}>{mentor.name}</div>
//                 <div style={{color:'var(--success)', fontWeight:'bold', fontSize:'0.9rem'}}>{mentor.hourlyRate || 20} Tokens/hr</div>
//               </div>
//             </div>
            
//             <div style={{marginBottom:'15px'}}>
//               {mentor.skills.map((s, i) => <span key={i} className="badge" style={{marginRight:'5px'}}>{s.name}</span>)}
//             </div>
            
//             {/* BUTTONS CONTAINER */}
//             <div className="flex gap-10" style={{marginTop:'auto'}}>
//                 <button onClick={() => handleMessage(mentor)} className="btn btn-outline" style={{flex:1}}>Message</button>
//                 <button onClick={() => openBookingModal(mentor)} className="btn btn-primary" style={{flex:1}}>Book</button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* --- POPUP MODAL --- */}
//       {bookingModal && (
//         <div className="modal-overlay">
//           <div className="card" style={{width:'350px', position:'relative', animation:'fadeIn 0.3s'}}>
//             <h3 className="mb-10">Book {bookingModal.name}</h3>
//             <p className="text-muted mb-20">Cost: {bookingModal.hourlyRate || 20} Tokens</p>
            
//             <label style={{fontSize:'0.8rem', fontWeight:'bold', display:'block', marginBottom:'5px'}}>Date</label>
//             <input type="date" className="input" value={bookingDate} min={new Date().toISOString().split("T")[0]} onChange={e => setBookingDate(e.target.value)} />
            
//             <label style={{fontSize:'0.8rem', fontWeight:'bold', display:'block', marginBottom:'5px'}}>Time</label>
            
//             {/* 🚨 12-HOUR DROPDOWNS 🚨 */}
//             <div style={{display:'flex', gap:'10px'}}>
//                {/* HOUR */}
//                <select className="input" style={{flex:1, minWidth:'60px'}} value={bookingHour} onChange={e => setBookingHour(e.target.value)}>
//                    {hoursList.map(h => <option key={h} value={h}>{h}</option>)}
//                </select>
               
//                <span style={{alignSelf:'center', fontWeight:'bold'}}>:</span>

//                {/* MINUTE */}
//                <select className="input" style={{flex:1, minWidth:'60px'}} value={bookingMinute} onChange={e => setBookingMinute(e.target.value)}>
//                    {minutesList.map(m => <option key={m} value={m}>{m}</option>)}
//                </select>

//                {/* AM/PM */}
//                <select className="input" style={{flex:1, minWidth:'60px'}} value={bookingPeriod} onChange={e => setBookingPeriod(e.target.value)}>
//                    <option value="AM">AM</option>
//                    <option value="PM">PM</option>
//                </select>
//             </div>

//             <div className="flex justify-between mt-20">
//               <button onClick={() => setBookingModal(null)} className="btn btn-secondary">Cancel</button>
//               <button onClick={confirmBooking} className="btn btn-primary">Confirm</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : `http://${window.location.hostname}:5000`;

export default function Marketplace({ showToast }) {

  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mentors, setMentors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [bookingModal, setBookingModal] = useState(null);
  const [bookingDate, setBookingDate] = useState("");

  const [bookingHour, setBookingHour] = useState("09");
  const [bookingMinute, setBookingMinute] = useState("00");
  const [bookingPeriod, setBookingPeriod] = useState("AM");

  const hoursList = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );

  const minutesList = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0')
  );

  useEffect(() => {

    const fetchMentors = async () => {

      try {

        const res = await axios.get(`${BASE_URL}/api/users/mentors`);
        setMentors(res.data);

      } catch (err) {
        console.error(err);
      }

    };

    fetchMentors();

  }, []);


  const openBookingModal = (mentor) => {

    setBookingModal(mentor);
    setBookingDate("");
    setBookingHour("09");
    setBookingMinute("00");
    setBookingPeriod("AM");

  };


  const handleMessage = (mentor) => {

    navigate('/messages', { state: { contact: mentor } });

  };


  const confirmBooking = async () => {

    if (!bookingDate)
      return showToast("Select a Date", "error");

    let hour24 = parseInt(bookingHour);

    if (bookingPeriod === "PM" && hour24 !== 12)
      hour24 += 12;

    if (bookingPeriod === "AM" && hour24 === 12)
      hour24 = 0;

    const time24 = `${hour24.toString().padStart(2, '0')}:${bookingMinute}`;

    const scheduleDateTime = new Date(`${bookingDate}T${time24}`);

    if (scheduleDateTime < new Date())
      return showToast("Invalid Date (Past)", "error");

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

    } catch {

      showToast("Booking Failed", 'error');

    }

  };


  const filteredMentors = mentors.filter(m =>
    m._id !== user.id &&
    (
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.skills.some(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  );


  return (

    <div className="market-wrapper">

      <div className="market-hero">

        <h1>Find Expert Mentors</h1>

        <p>Learn directly from professionals and accelerate your growth</p>

        <input
          type="text"
          placeholder="Search mentors or skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

      </div>


      <div className="mentor-grid">

        {filteredMentors.map((mentor) => (

          <div key={mentor._id} className="mentor-card">

            <div className="mentor-header">

              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${mentor.name}`}
                alt="mentor"
                className="mentor-avatar"
              />

              <div>

                <h3 className="mentor-name">

                  {mentor.name}

                  <span className="verified">✔</span>

                </h3>

                <div className="mentor-meta">

                  {mentor.rating ? (
                    <>
                      ⭐ {mentor.rating.toFixed(1)}
                      {mentor.totalSessions && (
                        <> • {mentor.totalSessions} sessions</>
                      )}
                    </>
                  ) : null}

                </div>

              </div>

            </div>


            {mentor.bio && (
              <p className="mentor-bio">
                {mentor.bio}
              </p>
            )}


            <div className="skills">

              {mentor.skills.map((s, i) => (
                <span key={i}>{s.name}</span>
              ))}

            </div>


            <div className="mentor-footer">

              <div className="mentor-price">

                <span className="price">
                  {mentor.hourlyRate || 20}
                </span>

                <span className="price-label">
                  Tokens / session
                </span>

              </div>


              <div className="mentor-buttons">

                <button
                  onClick={() => handleMessage(mentor)}
                  className="btn btn-outline"
                >
                  Message
                </button>

                <button
                  onClick={() => openBookingModal(mentor)}
                  className="btn btn-primary"
                >
                  Book Session
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>


      {filteredMentors.length === 0 && (

        <div className="empty">

          No mentors found. Try another skill.

        </div>

      )}


      {bookingModal && (

        <div className="modal-overlay">

          <div className="card booking-card">

            <h3>Book {bookingModal.name}</h3>

            <p className="text-muted mb-20">

              Cost: {bookingModal.hourlyRate || 20} Tokens

            </p>

            <input
              type="date"
              className="input"
              value={bookingDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setBookingDate(e.target.value)}
            />

            <div className="flex gap-10">

              <select
                className="input"
                value={bookingHour}
                onChange={(e) => setBookingHour(e.target.value)}
              >
                {hoursList.map(h => <option key={h}>{h}</option>)}
              </select>

              <select
                className="input"
                value={bookingMinute}
                onChange={(e) => setBookingMinute(e.target.value)}
              >
                {minutesList.map(m => <option key={m}>{m}</option>)}
              </select>

              <select
                className="input"
                value={bookingPeriod}
                onChange={(e) => setBookingPeriod(e.target.value)}
              >
                <option>AM</option>
                <option>PM</option>
              </select>

            </div>

            <div className="flex justify-between mt-20">

              <button
                onClick={() => setBookingModal(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>

              <button
                onClick={confirmBooking}
                className="btn btn-primary"
              >
                Confirm Booking
              </button>

            </div>

          </div>

        </div>

      )}


      <style>{`

      .market-wrapper{
        padding:50px 30px;
        max-width:1200px;
        margin:auto;
      }

      .market-hero{
        text-align:center;
        margin-bottom:50px;
      }

      .market-hero h1{
        font-size:40px;
        font-weight:800;
      }

      .market-hero p{
        color:#64748b;
      }

      .market-hero input{
        width:420px;
        padding:16px;
        border-radius:14px;
        border:1px solid #e2e8f0;
        margin-top:20px;
      }

      .mentor-grid{
        display:grid;
        grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
        gap:28px;
      }

      .mentor-card{
        background:white;
        border:1px solid #e2e8f0;
        border-radius:20px;
        padding:26px;
        display:flex;
        flex-direction:column;
        gap:16px;
        transition:all .3s;
      }

      .mentor-card:hover{
        transform:translateY(-8px);
        box-shadow:0 25px 50px rgba(0,0,0,0.1);
      }

      .mentor-header{
        display:flex;
        align-items:center;
        gap:16px;
      }

      .mentor-avatar{
        width:60px;
        height:60px;
        border-radius:50%;
      }

      .mentor-name{
        font-size:18px;
        font-weight:700;
      }

      .verified{
        color:#22c55e;
        font-size:12px;
        margin-left:6px;
      }

      .mentor-meta{
        font-size:13px;
        color:#64748b;
      }

      .mentor-bio{
        font-size:13px;
        color:#64748b;
        line-height:1.5;
      }

      .skills{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
      }

      .skills span{
        background:#eef2ff;
        color:#4f46e5;
        font-size:12px;
        padding:6px 12px;
        border-radius:30px;
      }

      .mentor-footer{
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-top:auto;
      }

      .mentor-price{
        display:flex;
        flex-direction:column;
      }

      .price{
        font-size:20px;
        font-weight:700;
      }

      .price-label{
        font-size:11px;
        color:#64748b;
      }

      .mentor-buttons{
        display:flex;
        gap:10px;
      }

      .empty{
        text-align:center;
        margin-top:50px;
        color:#64748b;
      }

      `}</style>

    </div>

  );

}


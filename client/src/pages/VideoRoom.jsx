// import { useEffect, useRef, useState, useContext } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import Peer from 'simple-peer';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';
// import { useSocket } from '../context/SocketContext'; 

// // 🚨 Polyfill to prevent "global is not defined" error with simple-peer
// if (typeof global === 'undefined') {
//     window.global = window;
// }

// // Dynamic URL
;

// const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

// export default function VideoRoom() {
//   const { roomId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation(); 
//   const { user } = useContext(AuthContext);
//   const { socket } = useSocket(); 
  
//   const sessionId = location.state?.sessionId;
//   const isLearner = location.state?.isLearner; 

//   const [stream, setStream] = useState(null);
//   const [userStream, setUserStream] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [inLobby, setInLobby] = useState(true);
  
//   const [callEndedState, setCallEndedState] = useState(false);
//   const [showFeedback, setShowFeedback] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(false);
//   const [isScreenSharing, setIsScreenSharing] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(3600); 

//   const myVideo = useRef();
//   const userVideo = useRef();
//   const connectionRef = useRef();
//   const partnerRef = useRef(null);
//   const streamRef = useRef(null);
  
//   const hasEndedRef = useRef(false);

//   const stopMedia = () => {
//     if (streamRef.current) {
//         streamRef.current.getTracks().forEach(track => { track.stop(); track.enabled = false; });
//         streamRef.current = null;
//     }
//     setStream(null);
//   };

//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then((currentStream) => {
//         setStream(currentStream);
//         streamRef.current = currentStream; 
//         if (myVideo.current) myVideo.current.srcObject = currentStream;
        
//         // 🚨 CRITICAL: Trigger the "Partner Waiting" signal 🚨
//         if(socket && user) {
//             socket.emit('user_entered_room', { roomId, userId: user.id });
//         }
//       })
//       .catch(err => console.error("Camera Error:", err));

//     return () => {
//         if (!hasEndedRef.current) endCallSequence(false);
//     };
//   }, [socket, user, roomId]); 

//   useEffect(() => {
//     if (myVideo.current && stream) myVideo.current.srcObject = stream;
//     if (userVideo.current && userStream) userVideo.current.srcObject = userStream;
//   }, [inLobby, stream, userStream]);

//   const endCallSequence = (shouldNavigate = true) => {
//       if (hasEndedRef.current) return;
//       hasEndedRef.current = true;

//       stopMedia();
//       setIsConnected(false);
//       setUserStream(null);
//       if (connectionRef.current) connectionRef.current.destroy();
//       if (socket) socket.emit('end_call', { roomId });

//       setCallEndedState(true);

//       if (isLearner) {
//           if (sessionId) {
//               setShowFeedback(true);
//           } else {
//               if (shouldNavigate) navigate('/dashboard', { state: { reviewRoomId: roomId } });
//           }
//       } else {
//           if (shouldNavigate) navigate('/dashboard');
//       }
//   };

//   useEffect(() => {
//     if (!socket || inLobby) return; 

//     socket.on("user_joined", (id) => { if(id !== socket.id) { partnerRef.current = id; callPartner(id); } });
//     socket.on("active_user_exist", (data) => { partnerRef.current = data.from; });
//     socket.on("callUser", (data) => { partnerRef.current = data.from; answerCall(data.signal); });
//     socket.on("callAccepted", (signal) => { if (connectionRef.current) connectionRef.current.signal(signal); });
//     socket.on("callEnded", () => { endCallSequence(true); });

//     return () => { socket.off("user_joined"); socket.off("callUser"); socket.off("callAccepted"); socket.off("callEnded"); };
//   }, [socket, inLobby]); 

//   const callPartner = (partnerId) => {
//       if (!streamRef.current) return;
//       if (connectionRef.current) connectionRef.current.destroy();
//       const peer = new Peer({ initiator: true, trickle: false, config: { iceServers: ICE_SERVERS }, stream: streamRef.current });
//       peer.on("signal", (data) => socket.emit("callUser", { userToCall: partnerId, signalData: data, from: socket.id, name: user.name }));
//       peer.on("stream", (remoteStream) => { setUserStream(remoteStream); setIsConnected(true); });
//       connectionRef.current = peer;
//   };

//   const answerCall = (incomingSignal) => {
//       if (!streamRef.current) return;
//       if (connectionRef.current) connectionRef.current.destroy();
//       const peer = new Peer({ initiator: false, trickle: false, config: { iceServers: ICE_SERVERS }, stream: streamRef.current });
//       peer.on("signal", (data) => socket.emit("answerCall", { signal: data, to: partnerRef.current }));
//       peer.on("stream", (remoteStream) => { setUserStream(remoteStream); setIsConnected(true); });
//       peer.signal(incomingSignal);
//       connectionRef.current = peer;
//   };

//   const joinSession = () => {
//     if (!socket || !streamRef.current) return;
//     setInLobby(false); 
//     socket.emit('join_room', roomId);
//   };

//   const handleExit = () => endCallSequence(true);
//   const toggleMute = () => { if (streamRef.current) { const t = streamRef.current.getAudioTracks()[0]; if(t) { t.enabled = !t.enabled; setIsMuted(!t.enabled); } } };
//   const toggleVideo = () => { if (streamRef.current) { const t = streamRef.current.getVideoTracks()[0]; if(t) { t.enabled = !t.enabled; setIsVideoOff(!t.enabled); } } };
//   const toggleScreenShare = () => {}; 

//   const submitReview = async () => {
//       if (!sessionId) {
//           navigate('/dashboard', { state: { reviewRoomId: roomId } });
//           return;
//       }
      
//       if (rating === 0) return alert("Please select a star rating!");

//       setIsSubmitting(true);
//       try {
//           await axios.post(`${BASE_URL}/api/sessions/review`, { sessionId, rating, comment });
//           navigate('/dashboard'); 
//       } catch (err) {
//           console.error("Review Error:", err);
//           navigate('/dashboard', { state: { reviewRoomId: roomId } });
//       }
//   };

//   const formatTime = (s) => `${Math.floor(s / 60)}:${s % 60 < 10 ? '0' : ''}${s % 60}`;
//   useEffect(() => {
//     let timer;
//     if (isConnected) {
//         timer = setInterval(() => {
//             setTimeLeft((prev) => {
//                 if (prev <= 1) { clearInterval(timer); endCallSequence(true); return 0; }
//                 return prev - 1;
//             });
//         }, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [isConnected]);

//   return (
//     <div className="container" style={{height:'90vh', display:'flex', flexDirection:'column'}}>
//       <div className="flex justify-between mb-20 align-center">
//         <h2>🎥 Session {isConnected && <span className="timer-badge">⏱ {formatTime(timeLeft)}</span>}</h2>
//         {inLobby && <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">Cancel</button>}
//       </div>

//       <div className="video-grid" style={{display:'flex', gap:'20px', flex:1, position:'relative'}}>
//         <div style={{width:'100%', background:'#f3f4f6', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', boxShadow:'inset 0 0 50px rgba(0,0,0,0.05)', position:'relative', overflow:'hidden'}}>
          
//           {showFeedback && isLearner && (
//               <div className="feedback-card">
//                   <h2 style={{color:'#1e293b'}}>Session Completed! 🎉</h2>
//                   <p className="text-muted">How was your experience?</p>
//                   <div className="star-rating">
//                       {[1, 2, 3, 4, 5].map((star) => (
//                           <span key={star} onClick={() => setRating(star)} style={{color: star <= rating ? '#f59e0b' : '#cbd5e1', cursor:'pointer', fontSize:'2.5rem', transition:'0.2s'}}>★</span>
//                       ))}
//                   </div>
//                   <textarea placeholder="Write a brief review..." value={comment} onChange={(e) => setComment(e.target.value)} className="review-input" />
//                   <div className="flex gap-10 mt-20 justify-center">
//                       <button onClick={submitReview} className="btn btn-primary" disabled={isSubmitting} style={{width:'100%'}}>
//                           {isSubmitting ? 'Submitting...' : 'Submit Review'}
//                       </button>
//                   </div>
//               </div>
//           )}

//           {callEndedState && !showFeedback && <div className="call-ended-card"><h1>📞</h1><h2>Call Ended</h2><p>Please wait...</p></div>}

//           {inLobby && !callEndedState && !showFeedback && (
//             <div className="lobby-card">
//                  <div className="preview-container"><video playsInline muted ref={myVideo} autoPlay className="preview-video" />{isVideoOff && <div className="camera-off-msg">Camera Off</div>}</div>
//                  <h3>Ready to join?</h3>
//                  <div className="flex justify-center gap-15 mb-20">
//                      <button onClick={toggleMute} className={`icon-btn ${isMuted ? 'btn-danger' : 'btn-outline'}`}>{isMuted ? '🔇' : '🎤'}</button>
//                      <button onClick={toggleVideo} className={`icon-btn ${isVideoOff ? 'btn-danger' : 'btn-outline'}`}>{isVideoOff ? '🚫' : '📷'}</button>
//                  </div>
//                  <button onClick={joinSession} className="btn btn-primary join-btn">Join Session</button>
//             </div>
//           )}

//           {!inLobby && !callEndedState && !showFeedback && (
//             <>
//                 {!isConnected && <div className="waiting-overlay"><div className="spinner mb-20" style={{borderTopColor:'white'}}></div><h2 style={{color:'white'}}>Waiting for partner...</h2></div>}
//                 <div style={{width:'100%', height:'100%', position:'relative', display: 'flex', gap:'20px', padding:'20px'}}>
//                      <div className="video-frame"><video playsInline muted ref={myVideo} autoPlay className={`video-feed ${isScreenSharing ? 'no-mirror' : ''}`} /><span className="name-tag">You</span>{isMuted && <div className="mute-icon">🔇</div>}</div>
//                      <div className="video-frame">{userStream ? <video playsInline ref={userVideo} autoPlay className="video-feed" /> : <div className="placeholder"></div>}</div>
//                      <div className="video-controls-bar">
//                         <button onClick={toggleMute} className={`control-btn ${isMuted ? 'btn-danger' : 'btn-glass'}`}>{isMuted ? '🔇' : '🎤'}</button>
//                         <button onClick={toggleVideo} className={`control-btn ${isVideoOff ? 'btn-danger' : 'btn-glass'}`}>{isVideoOff ? '🚫' : '📷'}</button>
//                         <button onClick={toggleScreenShare} className={`control-btn ${isScreenSharing ? 'btn-active' : 'btn-glass'}`}>{isScreenSharing ? 'Stop' : '🖥'}</button>
//                         <div className="divider"></div>
//                         <button onClick={handleExit} className="control-btn btn-terminate">📞</button>
//                      </div>
//                 </div>
//             </>
//           )}
//         </div>
//       </div>
//       <style>{`.waiting-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 50; color: white; backdrop-filter: blur(5px); } .feedback-card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.15); text-align: center; width: 450px; max-width: 90%; animation: popIn 0.3s ease-out; z-index: 20; } .review-input { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; margin-top: 15px; min-height: 80px; resize: vertical; } .lobby-card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); text-align: center; width: 400px; max-width: 90%; } .preview-container { width: 100%; height: 220px; background: black; border-radius: 12px; overflow: hidden; margin-bottom: 20px; position: relative; } .preview-video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); } .camera-off-msg { position: absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:white; background: #1e293b; } .video-frame { flex: 1; background: black; border-radius: 15px; overflow: hidden; position: relative; box-shadow: 0 10px 20px rgba(0,0,0,0.2); } .video-feed { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); } .video-feed.no-mirror { transform: none; } .name-tag { position: absolute; bottom: 15px; left: 15px; color: white; background: rgba(0,0,0,0.6); padding: 5px 12px; border-radius: 8px; backdrop-filter: blur(4px); } .video-controls-bar { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); background: rgba(255, 255, 255, 0.9); padding: 10px 25px; border-radius: 50px; display: flex; align-items: center; gap: 15px; backdrop-filter: blur(12px); box-shadow: 0 15px 35px rgba(0,0,0,0.2); z-index: 10; } .icon-btn { width: 50px; height: 50px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; transition: 0.2s; border: none; } .btn-outline { background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; } .join-btn { width: 100%; padding: 12px; font-size: 1.1rem; border-radius: 30px; } .control-btn { width: 50px; height: 50px; border-radius: 50%; border: none; font-size: 1.4rem; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; } .control-btn:hover { transform: scale(1.15); } .btn-glass { background: #f1f5f9; color: #334155; } .btn-active { background: #3b82f6; color: white; } .btn-terminate { background: #ef4444; color: white; } .divider { width: 1px; height: 30px; background: rgba(0,0,0,0.2); margin: 0 5px; } .timer-badge { background: #2563eb; color: white; padding: 5px 12px; border-radius: 20px; font-weight: bold; } .spinner { border: 4px solid rgba(0,0,0,0.1); border-top: 4px solid #3b82f6; width: 40px; height: 40px; border-radius: 50%; margin: 0 auto 20px; animation: spin 0.8s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } .star-rating { margin: 10px 0; }`}</style>
//     </div>
//   );
// }

// import { useEffect, useRef, useState, useContext } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import Peer from 'simple-peer';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';
// import { useSocket } from '../context/SocketContext'; 

// // 🚨 Polyfill to prevent "global is not defined" error with simple-peer
// if (typeof global === 'undefined') {
//     window.global = window;
// }

// // --- FIXED API URL DETECTION ---


// const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

// export default function VideoRoom() {
//   const { roomId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation(); 
//   const { user } = useContext(AuthContext);
//   const { socket } = useSocket(); 
  
//   const sessionId = location.state?.sessionId;
//   const isLearner = location.state?.isLearner; 

//   const [stream, setStream] = useState(null);
//   const [userStream, setUserStream] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [inLobby, setInLobby] = useState(true);
  
//   const [callEndedState, setCallEndedState] = useState(false);
//   const [showFeedback, setShowFeedback] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(false);
//   const [isScreenSharing, setIsScreenSharing] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(3600); 

//   const myVideo = useRef();
//   const userVideo = useRef();
//   const connectionRef = useRef();
//   const partnerRef = useRef(null);
//   const streamRef = useRef(null);
//   const screenTrackRef = useRef(null);
  
//   const hasEndedRef = useRef(false);

//   // --- 1. MEDIA ACCESS & SECURITY CHECK ---
//   useEffect(() => {
//     // 🚨 FIX: Check if browser supports mediaDevices (requires HTTPS or Localhost)
//     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//         console.error("Media API not found. Ensure you use HTTPS or localhost.");
//         alert("Camera/Mic access is blocked because this connection is not secure. Please use localhost or an HTTPS connection.");
//         navigate('/dashboard');
//         return;
//     }

//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then((currentStream) => {
//         setStream(currentStream);
//         streamRef.current = currentStream; 
//         if (myVideo.current) myVideo.current.srcObject = currentStream;
        
//         if(socket && user) {
//             socket.emit('user_entered_room', { roomId, userId: user.id });
//         }
//       })
//       .catch(err => {
//           console.error("Camera Error:", err);
//           alert("Could not access camera/mic. Please check your browser permissions.");
//           navigate('/dashboard');
//       });

//     return () => {
//         if (!hasEndedRef.current) endCallSequence(false);
//     };
//   }, [socket, user, roomId, navigate]); 

//   useEffect(() => {
//     if (myVideo.current && stream) myVideo.current.srcObject = stream;
//     if (userVideo.current && userStream) userVideo.current.srcObject = userStream;
//   }, [inLobby, stream, userStream]);

//   // --- 2. SIGNALING LOGIC ---
//   useEffect(() => {
//     if (!socket || inLobby) return; 

//     socket.on("user_joined", (id) => { 
//         if(id !== socket.id) { 
//             partnerRef.current = id; 
//             callPartner(id); 
//         } 
//     });
//     socket.on("active_user_exist", (data) => { partnerRef.current = data.from; });
//     socket.on("callUser", (data) => { partnerRef.current = data.from; answerCall(data.signal); });
//     socket.on("callAccepted", (signal) => { if (connectionRef.current) connectionRef.current.signal(signal); });
//     socket.on("callEnded", () => { endCallSequence(true); });

//     return () => { 
//         socket.off("user_joined"); 
//         socket.off("callUser"); 
//         socket.off("callAccepted"); 
//         socket.off("callEnded"); 
//     };
//   }, [socket, inLobby]); 

//   const callPartner = (partnerId) => {
//       if (!streamRef.current) return;
//       const peer = new Peer({ initiator: true, trickle: false, config: { iceServers: ICE_SERVERS }, stream: streamRef.current });
//       peer.on("signal", (data) => socket.emit("callUser", { userToCall: partnerId, signalData: data, from: socket.id, name: user.name }));
//       peer.on("stream", (remoteStream) => { setUserStream(remoteStream); setIsConnected(true); });
//       connectionRef.current = peer;
//   };

//   const answerCall = (incomingSignal) => {
//       if (!streamRef.current) return;
//       const peer = new Peer({ initiator: false, trickle: false, config: { iceServers: ICE_SERVERS }, stream: streamRef.current });
//       peer.on("signal", (data) => socket.emit("answerCall", { signal: data, to: partnerRef.current }));
//       peer.on("stream", (remoteStream) => { setUserStream(remoteStream); setIsConnected(true); });
//       peer.signal(incomingSignal);
//       connectionRef.current = peer;
//   };

//   // --- 3. UI CONTROLS ---
//   const joinSession = () => {
//     if (!socket || !streamRef.current) return;
//     setInLobby(false); 
//     socket.emit('join_room', roomId);
//   };

//   const toggleMute = () => { 
//     if (streamRef.current) { 
//         const t = streamRef.current.getAudioTracks()[0]; 
//         if(t) { t.enabled = !t.enabled; setIsMuted(!t.enabled); } 
//     } 
//   };

//   const toggleVideo = () => { 
//     if (streamRef.current) { 
//         const t = streamRef.current.getVideoTracks()[0]; 
//         if(t) { t.enabled = !t.enabled; setIsVideoOff(!t.enabled); } 
//     } 
//   };

//   const toggleScreenShare = async () => {
//     if (!isScreenSharing) {
//         try {
//             const screenStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
//             const screenTrack = screenStream.getTracks()[0];
            
//             if (connectionRef.current) {
//                 connectionRef.current.replaceTrack(
//                     streamRef.current.getVideoTracks()[0],
//                     screenTrack,
//                     streamRef.current
//                 );
//             }
            
//             myVideo.current.srcObject = screenStream;
//             screenTrackRef.current = screenTrack;
//             setIsScreenSharing(true);

//             screenTrack.onended = () => {
//                 stopScreenShare();
//             };
//         } catch (err) { console.error(err); }
//     } else {
//         stopScreenShare();
//     }
//   };

//   const stopScreenShare = () => {
//     if (screenTrackRef.current) {
//         screenTrackRef.current.stop();
//         if (connectionRef.current) {
//             connectionRef.current.replaceTrack(
//                 screenTrackRef.current,
//                 streamRef.current.getVideoTracks()[0],
//                 streamRef.current
//             );
//         }
//         myVideo.current.srcObject = streamRef.current;
//         setIsScreenSharing(false);
//     }
//   };

//   const endCallSequence = (shouldNavigate = true) => {
//       if (hasEndedRef.current) return;
//       hasEndedRef.current = true;

//       if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
//       if (screenTrackRef.current) screenTrackRef.current.stop();
      
//       setIsConnected(false);
//       if (connectionRef.current) connectionRef.current.destroy();
//       if (socket) socket.emit('end_call', { roomId });

//       setCallEndedState(true);

//       if (isLearner && sessionId) {
//           setShowFeedback(true);
//       } else if (shouldNavigate) {
//           navigate('/dashboard');
//       }
//   };

//   const submitReview = async () => {
//       if (rating === 0) return alert("Please select a star rating!");
//       setIsSubmitting(true);
//       try {
//           await axios.post(`${BASE_URL}/api/sessions/review`, { sessionId, rating, comment });
//           navigate('/dashboard'); 
//       } catch (err) {
//           navigate('/dashboard', { state: { reviewRoomId: roomId } });
//       }
//   };

//   const formatTime = (s) => `${Math.floor(s / 60)}:${s % 60 < 10 ? '0' : ''}${s % 60}`;
  
//   useEffect(() => {
//     let timer;
//     if (isConnected) {
//         timer = setInterval(() => {
//             setTimeLeft((prev) => {
//                 if (prev <= 1) { clearInterval(timer); endCallSequence(true); return 0; }
//                 return prev - 1;
//             });
//         }, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [isConnected]);

//   return (
//     <div className="container" style={{height:'90vh', display:'flex', flexDirection:'column', padding: '20px'}}>
//       <div className="flex justify-between mb-20 align-center">
//         <h2 style={{margin:0}}>🎥 Session {isConnected && <span className="timer-badge">⏱ {formatTime(timeLeft)}</span>}</h2>
//         {inLobby && <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">Cancel</button>}
//       </div>

//       <div className="video-grid" style={{display:'flex', gap:'20px', flex:1, position:'relative', minHeight: '400px'}}>
//         <div style={{width:'100%', background:'#1e293b', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden'}}>
          
//           {showFeedback && isLearner && (
//               <div className="feedback-card">
//                   <h2 style={{color:'#1e293b'}}>Session Completed! 🎉</h2>
//                   <p className="text-muted">How was your experience?</p>
//                   <div className="star-rating">
//                       {[1, 2, 3, 4, 5].map((star) => (
//                           <span key={star} onClick={() => setRating(star)} style={{color: star <= rating ? '#f59e0b' : '#cbd5e1', cursor:'pointer', fontSize:'2.5rem'}}>★</span>
//                       ))}
//                   </div>
//                   <textarea placeholder="Write a brief review..." value={comment} onChange={(e) => setComment(e.target.value)} className="review-input" />
//                   <button onClick={submitReview} className="btn btn-primary mt-20" disabled={isSubmitting} style={{width:'100%'}}>
//                       {isSubmitting ? 'Submitting...' : 'Submit Review'}
//                   </button>
//               </div>
//           )}

//           {callEndedState && !showFeedback && <div className="call-ended-card"><h1>📞</h1><h2>Call Ended</h2><p>Returning to dashboard...</p></div>}

//           {inLobby && !callEndedState && !showFeedback && (
//             <div className="lobby-card">
//                  <div className="preview-container">
//                     <video playsInline muted ref={myVideo} autoPlay className="preview-video" />
//                     {isVideoOff && <div className="camera-off-msg">Camera Off</div>}
//                  </div>
//                  <h3>Ready to join?</h3>
//                  <div className="flex justify-center gap-15 mb-20">
//                      <button onClick={toggleMute} className={`icon-btn ${isMuted ? 'btn-danger' : 'btn-outline'}`}>{isMuted ? '🔇' : '🎤'}</button>
//                      <button onClick={toggleVideo} className={`icon-btn ${isVideoOff ? 'btn-danger' : 'btn-outline'}`}>{isVideoOff ? '🚫' : '📷'}</button>
//                  </div>
//                  <button onClick={joinSession} className="btn btn-primary join-btn">Join Session</button>
//             </div>
//           )}

//           {!inLobby && !callEndedState && !showFeedback && (
//             <>
//                 {!isConnected && <div className="waiting-overlay"><div className="spinner mb-20" style={{borderTopColor:'white'}}></div><h2>Waiting for partner...</h2></div>}
//                 <div style={{width:'100%', height:'100%', position:'relative', display: 'flex', gap:'20px', padding:'20px'}}>
//                      <div className="video-frame">
//                         <video playsInline muted ref={myVideo} autoPlay className={`video-feed ${isScreenSharing ? 'no-mirror' : ''}`} />
//                         <span className="name-tag">You</span>
//                         {isMuted && <div className="mute-icon">🔇</div>}
//                      </div>
//                      <div className="video-frame">
//                         {userStream ? <video playsInline ref={userVideo} autoPlay className="video-feed" /> : <div className="placeholder">Partner Camera Off</div>}
//                      </div>
//                      <div className="video-controls-bar">
//                         <button onClick={toggleMute} className={`control-btn ${isMuted ? 'btn-danger' : 'btn-glass'}`}>{isMuted ? '🔇' : '🎤'}</button>
//                         <button onClick={toggleVideo} className={`control-btn ${isVideoOff ? 'btn-danger' : 'btn-glass'}`}>{isVideoOff ? '🚫' : '📷'}</button>
//                         <button onClick={toggleScreenShare} className={`control-btn ${isScreenSharing ? 'btn-active' : 'btn-glass'}`}>{isScreenSharing ? 'Stop Share' : '🖥️'}</button>
//                         <div className="divider"></div>
//                         <button onClick={() => endCallSequence(true)} className="control-btn btn-terminate">📞</button>
//                      </div>
//                 </div>
//             </>
//           )}
//         </div>
//       </div>
//       <style>{`
//         .waiting-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.9); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 50; color: white; backdrop-filter: blur(8px); }
//         .feedback-card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); text-align: center; width: 450px; z-index: 20; }
//         .review-input { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 12px; margin-top: 15px; min-height: 100px; resize: none; font-family: inherit; }
//         .lobby-card { background: white; padding: 30px; border-radius: 24px; text-align: center; width: 400px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
//         .preview-container { width: 100%; height: 240px; background: #000; border-radius: 16px; overflow: hidden; margin-bottom: 20px; position: relative; }
//         .preview-video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
//         .camera-off-msg { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; background: #334155; font-weight: 600; }
//         .video-frame { flex: 1; background: #0f172a; border-radius: 20px; overflow: hidden; position: relative; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
//         .video-feed { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
//         .video-feed.no-mirror { transform: none; }
//         .name-tag { position: absolute; bottom: 20px; left: 20px; color: white; background: rgba(15, 23, 42, 0.7); padding: 6px 14px; border-radius: 10px; backdrop-filter: blur(4px); font-size: 0.9rem; font-weight: 600; }
//         .video-controls-bar { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(255, 255, 255, 0.15); padding: 10px 20px; border-radius: 24px; display: flex; align-items: center; gap: 12px; backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.2); z-index: 10; }
//         .control-btn { width: 48px; height: 48px; border-radius: 16px; border: none; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
//         .btn-glass { background: rgba(255,255,255,0.2); color: white; }
//         .btn-glass:hover { background: rgba(255,255,255,0.3); }
//         .btn-active { background: #3b82f6; color: white; }
//         .btn-terminate { background: #ef4444; color: white; }
//         .btn-terminate:hover { background: #dc2626; transform: scale(1.05); }
//         .divider { width: 1px; height: 32px; background: rgba(255,255,255,0.2); margin: 0 4px; }
//         .timer-badge { background: #ef4444; color: white; padding: 4px 12px; border-radius: 12px; font-weight: 800; font-size: 1rem; margin-left: 10px; }
//         .spinner { border: 4px solid rgba(255,255,255,0.2); border-top: 4px solid #3b82f6; width: 40px; height: 40px; border-radius: 50%; animation: spin 1s linear infinite; }
//         @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
//         .placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #64748b; font-weight: 600; }
//       `}</style>
//     </div>
//   );
// }


import { useEffect, useRef, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Peer from 'simple-peer';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext'; 

// 🚨 Polyfill to prevent "global is not defined" error with simple-peer
if (typeof global === 'undefined') {
    window.global = window;
}

// --- FIXED API URL DETECTION ---
export const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://skill-0bu7.onrender.com/api'; // Your ACTUAL Render Backend

const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

export default function VideoRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  const { user } = useContext(AuthContext);
  const { socket } = useSocket(); 
  
  const sessionId = location.state?.sessionId;
  const isLearner = location.state?.isLearner; 

  const [stream, setStream] = useState(null);
  const [userStream, setUserStream] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [inLobby, setInLobby] = useState(true);
  
  const [callEndedState, setCallEndedState] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(500); // 1 hour default session time

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const partnerRef = useRef(null);
  const streamRef = useRef(null);
  const screenTrackRef = useRef(null);
  
  const hasEndedRef = useRef(false);

  // --- 1. MEDIA ACCESS & SECURITY CHECK ---
  useEffect(() => {
    // 🚨 FIX: Check if browser supports mediaDevices (requires HTTPS or Localhost)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("Media API not found. Ensure you use HTTPS or localhost.");
        alert("Camera/Mic access is blocked because this connection is not secure. Please use localhost or an HTTPS connection.");
        navigate('/dashboard');
        return;
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        streamRef.current = currentStream; 
        if (myVideo.current) myVideo.current.srcObject = currentStream;
        
        if(socket && user) {
            socket.emit('user_entered_room', { roomId, userId: user.id });
        }
      })
      .catch(err => {
          console.error("Camera Error:", err);
          alert("Could not access camera/mic. Please check your browser permissions.");
          navigate('/dashboard');
      });

    return () => {
        if (!hasEndedRef.current) endCallSequence(false);
    };
  }, [socket, user, roomId, navigate]); 

  useEffect(() => {
    if (myVideo.current && stream) myVideo.current.srcObject = stream;
    if (userVideo.current && userStream) userVideo.current.srcObject = userStream;
  }, [inLobby, stream, userStream]);

  // --- 2. SIGNALING LOGIC ---
  useEffect(() => {
    if (!socket || inLobby) return; 

    socket.on("user_joined", (id) => { 
        if(id !== socket.id) { 
            partnerRef.current = id; 
            callPartner(id); 
        } 
    });
    socket.on("active_user_exist", (data) => { partnerRef.current = data.from; });
    socket.on("callUser", (data) => { partnerRef.current = data.from; answerCall(data.signal); });
    socket.on("callAccepted", (signal) => { if (connectionRef.current) connectionRef.current.signal(signal); });
    socket.on("callEnded", () => { endCallSequence(true); });

    return () => { 
        socket.off("user_joined"); 
        socket.off("callUser"); 
        socket.off("callAccepted"); 
        socket.off("callEnded"); 
    };
  }, [socket, inLobby]); 

  const callPartner = (partnerId) => {
      if (!streamRef.current) return;
      const peer = new Peer({ initiator: true, trickle: false, config: { iceServers: ICE_SERVERS }, stream: streamRef.current });
      peer.on("signal", (data) => socket.emit("callUser", { userToCall: partnerId, signalData: data, from: socket.id, name: user.name }));
      peer.on("stream", (remoteStream) => { setUserStream(remoteStream); setIsConnected(true); });
      connectionRef.current = peer;
  };

  const answerCall = (incomingSignal) => {
      if (!streamRef.current) return;
      const peer = new Peer({ initiator: false, trickle: false, config: { iceServers: ICE_SERVERS }, stream: streamRef.current });
      peer.on("signal", (data) => socket.emit("answerCall", { signal: data, to: partnerRef.current }));
      peer.on("stream", (remoteStream) => { setUserStream(remoteStream); setIsConnected(true); });
      peer.signal(incomingSignal);
      connectionRef.current = peer;
  };

  // --- 3. UI CONTROLS ---
  const joinSession = () => {
    if (!socket || !streamRef.current) return;
    setInLobby(false); 
    socket.emit('join_room', roomId);
  };

  const toggleMute = () => { 
    if (streamRef.current) { 
        const t = streamRef.current.getAudioTracks()[0]; 
        if(t) { t.enabled = !t.enabled; setIsMuted(!t.enabled); } 
    } 
  };

  const toggleVideo = () => { 
    if (streamRef.current) { 
        const t = streamRef.current.getVideoTracks()[0]; 
        if(t) { t.enabled = !t.enabled; setIsVideoOff(!t.enabled); } 
    } 
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
            const screenTrack = screenStream.getTracks()[0];
            
            if (connectionRef.current) {
                connectionRef.current.replaceTrack(
                    streamRef.current.getVideoTracks()[0],
                    screenTrack,
                    streamRef.current
                );
            }
            
            myVideo.current.srcObject = screenStream;
            screenTrackRef.current = screenTrack;
            setIsScreenSharing(true);

            screenTrack.onended = () => {
                stopScreenShare();
            };
        } catch (err) { console.error(err); }
    } else {
        stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        if (connectionRef.current) {
            connectionRef.current.replaceTrack(
                screenTrackRef.current,
                streamRef.current.getVideoTracks()[0],
                streamRef.current
            );
        }
        myVideo.current.srcObject = streamRef.current;
        setIsScreenSharing(false);
    }
  };

  const endCallSequence = (shouldNavigate = true) => {
      if (hasEndedRef.current) return;
      hasEndedRef.current = true;

      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (screenTrackRef.current) screenTrackRef.current.stop();
      
      setIsConnected(false);
      if (connectionRef.current) connectionRef.current.destroy();
      if (socket) socket.emit('end_call', { roomId });

      setCallEndedState(true);

      if (isLearner && sessionId) {
          setShowFeedback(true);
      } else if (shouldNavigate) {
          navigate('/dashboard');
      }
  };

  const submitReview = async () => {
      if (rating === 0) return alert("Please select a star rating!");
      setIsSubmitting(true);
      try {
          await axios.post(`${BASE_URL}/api/sessions/review`, { sessionId, rating, comment });
          navigate('/dashboard'); 
      } catch (err) {
          navigate('/dashboard', { state: { reviewRoomId: roomId } });
      }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${s % 60 < 10 ? '0' : ''}${s % 60}`;
  
  useEffect(() => {
    let timer;
    if (isConnected) {
        timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) { clearInterval(timer); endCallSequence(true); return 0; }
                return prev - 1;
            });
        }, 1000);
    }
    return () => clearInterval(timer);
  }, [isConnected]);

  return (
    <div className="video-room-container">
      {/* Header */}
      <div className="video-header">
        <div className="header-left">
          <div className="session-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span>Video Session</span>
          </div>
          {isConnected && (
            <div className="timer-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
        {inLobby && (
          <button onClick={() => navigate('/dashboard')} className="cancel-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Cancel
          </button>
        )}
      </div>

      {/* Main Video Area */}
      <div className="video-main">
        {showFeedback && isLearner && (
          <div className="feedback-modal">
            <div className="feedback-card">
              <div className="feedback-icon">🎉</div>
              <h2>Session Completed!</h2>
              <p>How was your experience with the mentor?</p>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`star-btn ${star <= rating ? 'active' : ''}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Write a brief review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="review-textarea"
              />
              <button onClick={submitReview} className="submit-review-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-small"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </div>
        )}

        {callEndedState && !showFeedback && (
          <div className="call-ended-card">
            <div className="call-ended-icon">📞</div>
            <h2>Call Ended</h2>
            <p>Redirecting to dashboard...</p>
          </div>
        )}

        {inLobby && !callEndedState && !showFeedback && (
          <div className="lobby-card">
            <div className="preview-section">
              <div className="video-preview">
                <video playsInline muted ref={myVideo} autoPlay className="preview-video" />
                {isVideoOff && <div className="video-off-overlay">Camera Off</div>}
              </div>
              <div className="preview-controls">
                <button onClick={toggleMute} className={`control-circle ${isMuted ? 'danger' : ''}`}>
                  {isMuted ? '🔇' : '🎤'}
                </button>
                <button onClick={toggleVideo} className={`control-circle ${isVideoOff ? 'danger' : ''}`}>
                  {isVideoOff ? '🚫' : '📷'}
                </button>
              </div>
            </div>
            <h3>Ready to join?</h3>
            <p>Your camera and microphone are ready</p>
            <button onClick={joinSession} className="join-btn">
              <span>Join Session</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>
          </div>
        )}

        {!inLobby && !callEndedState && !showFeedback && (
          <div className="active-call-container">
            {!isConnected && (
              <div className="waiting-overlay">
                <div className="waiting-spinner"></div>
                <h3>Waiting for partner...</h3>
                <p>Please wait while we connect you</p>
              </div>
            )}
            <div className="video-grid">
              <div className="video-card">
                <video playsInline muted ref={myVideo} autoPlay className={`video-feed ${isScreenSharing ? 'no-mirror' : ''}`} />
                <div className="video-label">You</div>
                {isMuted && <div className="mute-badge">🔇</div>}
                {isVideoOff && <div className="video-off-badge">Camera Off</div>}
              </div>
              <div className="video-card">
                {userStream ? (
                  <>
                    <video playsInline ref={userVideo} autoPlay className="video-feed" />
                    <div className="video-label">Mentor</div>
                  </>
                ) : (
                  <div className="no-video-placeholder">
                    <div className="placeholder-icon">👤</div>
                    <p>Waiting for video...</p>
                  </div>
                )}
              </div>
            </div>
            <div className="call-controls">
              <button onClick={toggleMute} className={`control-btn ${isMuted ? 'danger' : ''}`}>
                {isMuted ? '🔇' : '🎤'}
                <span>{isMuted ? 'Unmute' : 'Mute'}</span>
              </button>
              <button onClick={toggleVideo} className={`control-btn ${isVideoOff ? 'danger' : ''}`}>
                {isVideoOff ? '🚫' : '📷'}
                <span>{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
              </button>
              <button onClick={toggleScreenShare} className={`control-btn ${isScreenSharing ? 'active' : ''}`}>
                🖥️
                <span>{isScreenSharing ? 'Stop Share' : 'Share Screen'}</span>
              </button>
              <button onClick={() => endCallSequence(true)} className="control-btn end-call">
                📞
                <span>End Call</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .video-room-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          padding: 20px;
        }

        /* Header */
        .video-header {
          max-width: 1400px;
          margin: 0 auto 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .session-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 30px;
          color: white;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .timer-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: rgba(239, 68, 68, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 30px;
          color: #f87171;
          font-weight: 600;
        }

        .cancel-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 30px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
        }

        /* Main Area */
        .video-main {
          max-width: 1400px;
          margin: 0 auto;
          height: calc(100vh - 100px);
          position: relative;
        }

        /* Lobby Card */
        .lobby-card {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 480px;
          background: white;
          border-radius: 32px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -40%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        .preview-section {
          margin-bottom: 24px;
        }

        .video-preview {
          width: 100%;
          height: 280px;
          background: #0f172a;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          margin-bottom: 20px;
        }

        .preview-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
        }

        .video-off-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1e293b;
          color: #94a3b8;
          font-weight: 500;
        }

        .preview-controls {
          display: flex;
          justify-content: center;
          gap: 16px;
        }

        .control-circle {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: none;
          background: #f1f5f9;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .control-circle:hover {
          transform: scale(1.1);
        }

        .control-circle.danger {
          background: #fee2e2;
          color: #ef4444;
        }

        .lobby-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .lobby-card p {
          color: #64748b;
          margin-bottom: 24px;
        }

        .join-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .join-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
        }

        /* Active Call */
        .active-call-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .waiting-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
          border-radius: 32px;
        }

        .waiting-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .waiting-overlay h3 {
          color: white;
          font-size: 1.5rem;
          margin-bottom: 8px;
        }

        .waiting-overlay p {
          color: #94a3b8;
        }

        .video-grid {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
          min-height: 0;
        }

        .video-card {
          background: #0f172a;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }

        .video-feed {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
        }

        .video-feed.no-mirror {
          transform: none;
        }

        .video-label {
          position: absolute;
          bottom: 16px;
          left: 16px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          padding: 4px 12px;
          border-radius: 20px;
          color: white;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .mute-badge, .video-off-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          padding: 6px;
          border-radius: 50%;
          font-size: 1rem;
        }

        .no-video-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: #94a3b8;
        }

        .placeholder-icon {
          font-size: 3rem;
          margin-bottom: 12px;
          opacity: 0.5;
        }

        .call-controls {
          display: flex;
          justify-content: center;
          gap: 16px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 80px;
          margin-top: auto;
        }

        .control-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 40px;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .control-btn span {
          font-size: 0.7rem;
        }

        .control-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .control-btn.danger {
          background: rgba(239, 68, 68, 0.8);
        }

        .control-btn.active {
          background: #3b82f6;
        }

        .control-btn.end-call {
          background: #ef4444;
        }

        .control-btn.end-call:hover {
          background: #dc2626;
        }

        /* Feedback Modal */
        .feedback-modal {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
          border-radius: 32px;
        }

        .feedback-card {
          background: white;
          border-radius: 32px;
          padding: 40px;
          width: 450px;
          text-align: center;
          animation: scaleIn 0.3s ease;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .feedback-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .feedback-card h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .feedback-card p {
          color: #64748b;
          margin-bottom: 24px;
        }

        .star-rating {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .star-btn {
          font-size: 2.5rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #cbd5e1;
          transition: all 0.2s;
        }

        .star-btn:hover {
          transform: scale(1.1);
        }

        .star-btn.active {
          color: #f59e0b;
        }

        .review-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          font-size: 0.9rem;
          font-family: inherit;
          resize: vertical;
          min-height: 100px;
          margin-bottom: 24px;
        }

        .review-textarea:focus {
          outline: none;
          border-color: #6366f1;
        }

        .submit-review-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-review-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
        }

        .submit-review-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* Call Ended Card */
        .call-ended-card {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 32px;
          padding: 48px;
          text-align: center;
          animation: slideUp 0.4s ease;
        }

        .call-ended-icon {
          font-size: 4rem;
          margin-bottom: 16px;
        }

        .call-ended-card h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .call-ended-card p {
          color: #64748b;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .video-grid {
            grid-template-columns: 1fr;
          }

          .lobby-card {
            width: 90%;
            padding: 24px;
          }

          .feedback-card {
            width: 90%;
            padding: 24px;
          }

          .call-controls {
            flex-wrap: wrap;
            border-radius: 24px;
          }

          .control-btn {
            flex: 1;
            min-width: 70px;
          }
        }
      `}</style>
    </div>
  );
}
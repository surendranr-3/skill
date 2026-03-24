// import { useState, useEffect, useContext, useRef } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';
// import { useSocket } from '../context/SocketContext'; // 🚨 Use shared socket
// import { useLocation } from 'react-router-dom';

// // Smart URL Detection

//   : `http://${window.location.hostname}:5000`;

// export default function Messages() {
//   const { user } = useContext(AuthContext);
  
//   // 🚨 ACCESS SHARED SOCKET 🚨
//   const { socket } = useSocket(); 
  
//   const location = useLocation();
  
//   const [contacts, setContacts] = useState([]);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const scrollRef = useRef();

//   // --- HELPER: Fetch Contacts ---
//   const fetchContacts = async () => {
//     if (!user || !user.id) return;

//     try {
//       const res = await axios.get(`${BASE_URL}/api/messages/contacts/${user.id}`);
//       setContacts(res.data);
//     } catch (err) {
//       console.error("Failed to load contacts.", err);
//     }
//   };

//   // --- 1. Initial Setup & Socket Listeners ---
//   useEffect(() => {
//     if(!user || !socket) return;

//     // Note: 'join_chat' is likely handled in SocketContext, but ensuring it here is safe.
//     socket.emit('join_chat', user.id);
//     fetchContacts();

//     const handleReceiveMessage = async (msg) => {
//       // If the message belongs to the open chat, append it
//       if (selectedContact && (msg.sender === selectedContact._id || msg.sender === user.id)) {
//         setMessages(prev => [...prev, msg]);
//       }
      
//       // Refresh contacts list to show new sender at top
//       if (msg.sender !== user.id) {
//          fetchContacts();
//       }
//     };

//     // Attach Listener
//     socket.on('receive_chat', handleReceiveMessage);
    
//     // Cleanup Listener (Critical to prevent duplicates)
//     return () => socket.off('receive_chat', handleReceiveMessage);
//   }, [user, selectedContact, contacts, socket]);

//   // --- 2. Handle "Jump to Chat" from Marketplace ---
//   useEffect(() => {
//     if (location.state?.contact) {
//       const incomingContact = location.state.contact;
//       setSelectedContact(incomingContact);
//       setContacts(prev => {
//         const exists = prev.find(c => c._id === incomingContact._id);
//         if (!exists) return [incomingContact, ...prev];
//         return prev;
//       });
//       // Clear state so refresh doesn't reset it
//       window.history.replaceState({}, document.title);
//     }
//   }, [location.state]);

//   // --- 3. Load Chat History ---
//   useEffect(() => {
//     if (selectedContact) {
//       axios.get(`${BASE_URL}/api/messages/${user.id}/${selectedContact._id}`)
//         .then(res => setMessages(res.data))
//         .catch(err => console.error(err));
//     }
//   }, [selectedContact, user.id]);

//   // --- 4. Auto-scroll ---
//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!newMessage.trim() || !selectedContact) return;

//     const msgData = {
//       sender: user.id,
//       receiver: selectedContact._id,
//       text: newMessage
//     };

//     // Optimistic UI update
//     setMessages(prev => [...prev, msgData]);
//     setNewMessage("");

//     try {
//       await axios.post(`${BASE_URL}/api/messages`, msgData);
//       // We don't need to manually emit socket here; 
//       // The SERVER emits 'receive_chat' to the recipient after saving DB.
      
//       fetchContacts();
//     } catch (err) {
//       console.error("Send failed", err);
//     }
//   };

//   return (
//     <div className="container chat-container">
//       {/* Sidebar */}
//       <div className="chat-sidebar card" style={{padding:0}}>
//         <h3 style={{padding:'15px', borderBottom:'1px solid #eee'}}>Messages</h3>
        
//         <div style={{overflowY: 'auto', height: 'calc(100% - 60px)'}}>
//           {contacts.length > 0 ? (
//             contacts.map(c => (
//               <div key={c._id} 
//                    onClick={() => setSelectedContact(c)} 
//                    className={`chat-contact ${selectedContact?._id === c._id ? 'active' : ''}`}>
//                 <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`} style={{width:'40px', borderRadius:'50%'}} alt="" />
//                 <span>{c.name}</span>
//               </div>
//             ))
//           ) : (
//             <p style={{padding:'20px', color:'#888', textAlign:'center'}}>
//               No contacts found.<br/>
//               <small>Book a session or click "Message" in Marketplace to start!</small>
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Chat Window */}
//       {selectedContact ? (
//         <div className="chat-window">
//           <div style={{padding:'15px', borderBottom:'1px solid #eee', fontWeight:'bold', background:'#f9fafb', borderRadius:'12px 12px 0 0'}}>
//             Chat with {selectedContact.name}
//           </div>
//           <div className="chat-history">
//             {messages.length === 0 && <p className="text-muted text-center">Say hello! 👋</p>}
//             {messages.map((m, i) => (
//               <div key={i} ref={scrollRef} className={`chat-bubble ${m.sender === user.id ? 'chat-sent' : 'chat-received'}`}>
//                 {m.text}
//               </div>
//             ))}
//           </div>
//           <div className="chat-input">
//             <input type="text" className="input" style={{marginBottom:0}} placeholder="Type a message..."
//               value={newMessage} onChange={e => setNewMessage(e.target.value)} 
//               onKeyPress={e => e.key === 'Enter' && sendMessage()} />
//             <button onClick={sendMessage} className="btn btn-primary">Send</button>
//           </div>
//         </div>
//       ) : (
//         <div className="chat-window flex justify-center" style={{color:'#888', alignItems:'center'}}>
//           Select a contact to chat
//         </div>
//       )}
//     </div>
//   );
// }




// import { useState, useEffect, useContext, useRef } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';
// import { useSocket } from '../context/SocketContext';
// import { useLocation } from 'react-router-dom';



// axios.interceptors.request.use(
//   config => {
//     const token = sessionStorage.getItem('token');
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   error => Promise.reject(error)
// );

// export default function Messages() {

// const { user } = useContext(AuthContext);
// const { socket } = useSocket();
// const location = useLocation();

// const [contacts,setContacts]=useState([]);
// const [selectedContact,setSelectedContact]=useState(null);
// const [messages,setMessages]=useState([]);
// const [newMessage,setNewMessage]=useState("");
// const [attachmentPreview,setAttachmentPreview]=useState(null);
// const [isUploading,setIsUploading]=useState(false);

// const [onlineUsers,setOnlineUsers]=useState([]);
// const [unread,setUnread]=useState({});

// const scrollRef=useRef();
// const fileInputRef=useRef();

// const fetchContacts=async()=>{
// if(!user||!user.id)return;

// try{
// const res=await axios.get(`${BASE_URL}/api/messages/contacts/${user.id}`);
// setContacts(res.data);
// }catch(err){
// console.error(err);
// }
// };

// useEffect(()=>{

// if(!user||!socket)return;

// socket.emit('join_chat',user.id);
// fetchContacts();

// socket.on("online_users",users=>{
// setOnlineUsers(users);
// });

// const handleReceiveMessage=(msg)=>{

// if(selectedContact && (
// msg.sender===selectedContact._id ||
// msg.sender?._id===selectedContact._id ||
// msg.receiver===user.id
// )){

// setMessages(prev=>{
// const exists=prev.some(m=>m._id===msg._id);
// if(exists)return prev;
// return [...prev,msg];
// });

// }else{

// setUnread(prev=>{
// const count=prev[msg.sender]||0;
// return {...prev,[msg.sender]:count+1};
// });

// }

// fetchContacts();

// };

// socket.on('receive_chat',handleReceiveMessage);

// return()=>{
// socket.off('receive_chat',handleReceiveMessage);
// };

// },[user,selectedContact,socket]);

// useEffect(()=>{

// if(location.state?.contact){

// const incomingContact=location.state.contact;

// setSelectedContact(incomingContact);

// setContacts(prev=>{
// const exists=prev.find(c=>c._id===incomingContact._id);
// if(!exists)return [incomingContact,...prev];
// return prev;
// });

// window.history.replaceState({},document.title);

// }

// },[location.state]);

// useEffect(()=>{

// if(selectedContact){

// axios
// .get(`${BASE_URL}/api/messages/${user.id}/${selectedContact._id}`)
// .then(res=>setMessages(res.data))
// .catch(console.error);

// setUnread(prev=>({...prev,[selectedContact._id]:0}));

// }

// },[selectedContact,user.id]);

// useEffect(()=>{
// scrollRef.current?.scrollIntoView({behavior:"smooth"});
// },[messages]);

// const uploadFile=async(file)=>{

// const formData=new FormData();
// formData.append('file',file);

// try{
// setIsUploading(true);

// const res=await axios.post(`${BASE_URL}/api/messages/upload`,formData,{
// headers:{'Content-Type':'multipart/form-data'}
// });

// return res.data;

// }catch(err){
// alert("Upload failed");
// throw err;
// }finally{
// setIsUploading(false);
// }

// };

// const sendMessage=async()=>{

// if((!newMessage.trim()&&!attachmentPreview)||!selectedContact||isUploading)return;

// let fileData=null;
// let messageText=newMessage||"";

// if(attachmentPreview){

// try{
// fileData=await uploadFile(attachmentPreview.file);
// messageText=messageText||"[attachment]";
// }catch{
// return;
// }

// }

// const msgData={
// sender:user.id,
// receiver:selectedContact._id,
// text:messageText
// };

// if(fileData&&fileData.url){

// msgData.attachment={
// url:fileData.url,
// name:fileData.name||attachmentPreview.file.name,
// type:fileData.type||attachmentPreview.file.type
// };

// }

// const tempId=Date.now().toString();

// const optimisticMsg={
// ...msgData,
// _id:tempId,
// createdAt:new Date().toISOString(),
// sender:{_id:user.id,name:user.name}
// };

// setMessages(prev=>[...prev,optimisticMsg]);

// setNewMessage("");
// setAttachmentPreview(null);
// if(fileInputRef.current)fileInputRef.current.value="";

// try{

// const response=await axios.post(`${BASE_URL}/api/messages`,msgData);

// setMessages(prev=>prev.map(msg=>msg._id===tempId?response.data:msg));

// fetchContacts();

// }catch{

// setMessages(prev=>prev.filter(msg=>msg._id!==tempId));
// alert("Failed to send message");

// }

// };

// const handleAttachment=(e)=>{
// const file=e.target.files[0];
// if(!file)return;
// const preview=URL.createObjectURL(file);
// setAttachmentPreview({file,preview});
// };

// const renderMessage=(msg)=>{

// const isOwnMessage=msg.sender===user.id || msg.sender?._id===user.id;

// return(

// <div key={msg._id} className={`message-row ${isOwnMessage?'own':''}`}>

// <div className="chat-bubble">

// <div className="message-text">{msg.text}</div>

// <div className="message-time">
// {new Date(msg.createdAt).toLocaleTimeString([],{
// hour:'2-digit',
// minute:'2-digit'
// })}
// </div>

// </div>

// </div>

// );

// };

// return(

// <div className="chat-wrapper">

// <div className="chat-sidebar">

// <div className="sidebar-header">
// Messages
// </div>

// <div className="contacts-list">

// {contacts.map(c=>{

// const isOnline=onlineUsers.includes(c._id);

// return(

// <div
// key={c._id}
// onClick={()=>setSelectedContact(c)}
// className={`contact-item ${selectedContact?._id===c._id?'active':''}`}
// >

// <div className="avatar-wrapper">

// <img
// src={c.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`}
// className="contact-avatar"
// />

// {isOnline && <div className="online-dot"></div>}

// </div>

// <div className="contact-name">{c.name}</div>

// {unread[c._id] > 0 &&
// <div className="unread-badge">{unread[c._id]}</div>
// }

// </div>

// )

// })}

// </div>
// </div>

// {selectedContact ?

// <div className="chat-window">

// <div className="chat-header">

// <img
// src={selectedContact.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedContact.name}`}
// className="chat-avatar"
// />

// <div className="chat-name">{selectedContact.name}</div>

// </div>

// <div className="chat-history">

// {messages.map((msg,i)=>(
// <div key={msg._id||i} ref={i===messages.length-1?scrollRef:null}>
// {renderMessage(msg)}
// </div>
// ))}

// <div className="typing-indicator">
// <span></span>
// <span></span>
// <span></span>
// </div>

// </div>

// <div className="chat-input-bar">

// <button
// className="attach-btn"
// onClick={()=>fileInputRef.current.click()}
// >
// +
// </button>

// <input
// type="file"
// ref={fileInputRef}
// style={{display:"none"}}
// onChange={handleAttachment}
// />

// <input
// type="text"
// placeholder="Type a message..."
// value={newMessage}
// onChange={e=>setNewMessage(e.target.value)}
// onKeyPress={e=>e.key==='Enter' && sendMessage()}
// />

// <button className="send-btn" onClick={sendMessage}>
// Send
// </button>

// </div>

// </div>

// :

// <div className="chat-empty">
// Select a conversation to start messaging
// </div>

// }

// <style>{`

// .chat-wrapper{
// display:flex;
// height:88vh;
// gap:22px;
// background:linear-gradient(180deg,#f8fafc,#eef2f7);
// padding:12px;
// }

// .chat-sidebar{
// width:320px;
// background:white;
// border-radius:16px;
// box-shadow:0 20px 60px rgba(0,0,0,.08);
// border:1px solid #e5e7eb;
// overflow:hidden;
// }

// .sidebar-header{
// padding:18px;
// font-weight:700;
// font-size:18px;
// border-bottom:1px solid #eee;
// }

// .contact-item{
// display:flex;
// align-items:center;
// gap:12px;
// padding:14px;
// cursor:pointer;
// transition:.25s;
// border-radius:10px;
// margin:6px;
// }

// .contact-item:hover{
// background:#f1f5f9;
// transform:translateX(4px);
// }

// .contact-item.active{
// background:#e2e8f0;
// }

// .contact-avatar{
// width:40px;
// height:40px;
// border-radius:50%;
// }

// .avatar-wrapper{
// position:relative;
// }

// .online-dot{
// position:absolute;
// bottom:0;
// right:0;
// width:10px;
// height:10px;
// background:#22c55e;
// border-radius:50%;
// border:2px solid white;
// }

// .unread-badge{
// margin-left:auto;
// background:#ef4444;
// color:white;
// font-size:11px;
// padding:3px 7px;
// border-radius:999px;
// }

// .chat-window{
// flex:1;
// background:white;
// border-radius:16px;
// display:flex;
// flex-direction:column;
// border:1px solid #e5e7eb;
// box-shadow:0 30px 70px rgba(0,0,0,.08);
// }

// .chat-header{
// display:flex;
// align-items:center;
// gap:12px;
// padding:18px;
// border-bottom:1px solid #eee;
// }

// .chat-avatar{
// width:36px;
// height:36px;
// border-radius:50%;
// }

// .chat-history{
// flex:1;
// overflow-y:auto;
// padding:24px;
// display:flex;
// flex-direction:column;
// gap:12px;
// }

// .message-row{
// display:flex;
// }

// .message-row.own{
// justify-content:flex-end;
// }

// .chat-bubble{
// padding:12px 16px;
// border-radius:14px;
// background:#f1f5f9;
// max-width:60%;
// box-shadow:0 4px 10px rgba(0,0,0,.05);
// }

// .message-row.own .chat-bubble{
// background:#111827;
// color:white;
// }

// .message-time{
// font-size:10px;
// opacity:.6;
// margin-top:5px;
// }

// .chat-input-bar{
// display:flex;
// gap:10px;
// padding:14px;
// border-top:1px solid #eee;
// }

// .chat-input-bar input{
// flex:1;
// padding:12px;
// border-radius:10px;
// border:1px solid #e2e8f0;
// }

// .attach-btn{
// background:#f1f5f9;
// border:none;
// border-radius:10px;
// padding:0 12px;
// cursor:pointer;
// }

// .send-btn{
// background:#111827;
// color:white;
// border:none;
// padding:0 20px;
// border-radius:10px;
// cursor:pointer;
// }

// .typing-indicator{
// display:flex;
// gap:6px;
// padding-left:6px;
// }

// .typing-indicator span{
// width:6px;
// height:6px;
// background:#94a3b8;
// border-radius:50%;
// animation:typing 1.4s infinite;
// }

// .typing-indicator span:nth-child(2){
// animation-delay:.2s;
// }

// .typing-indicator span:nth-child(3){
// animation-delay:.4s;
// }

// @keyframes typing{
// 0%{opacity:.3}
// 50%{opacity:1}
// 100%{opacity:.3}
// }

// `}</style>

// </div>

// );

// }


import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useLocation } from 'react-router-dom';

// --- FIXED API URL DETECTION ---
export const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://skill-0bu7.onrender.com/api'; // Your ACTUAL Render Backend

axios.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

export default function Messages() {

const { user } = useContext(AuthContext);
const { socket } = useSocket();
const location = useLocation();

const [contacts,setContacts]=useState([]);
const [selectedContact,setSelectedContact]=useState(null);
const [messages,setMessages]=useState([]);
const [newMessage,setNewMessage]=useState("");
const [attachmentPreview,setAttachmentPreview]=useState(null);
const [isUploading,setIsUploading]=useState(false);

const [onlineUsers,setOnlineUsers]=useState([]);
const [unread,setUnread]=useState({});

const scrollRef=useRef();
const fileInputRef=useRef();

const fetchContacts=async()=>{
if(!user||!user.id)return;

try{
const res=await axios.get(`${BASE_URL}/api/messages/contacts/${user.id}`);
setContacts(res.data);
}catch(err){
console.error(err);
}
};

useEffect(()=>{

if(!user||!socket)return;

socket.emit('join_chat',user.id);
fetchContacts();

socket.on("online_users",users=>{
setOnlineUsers(users);
});

const handleReceiveMessage=(msg)=>{

if(selectedContact && (
msg.sender===selectedContact._id ||
msg.sender?._id===selectedContact._id ||
msg.receiver===user.id
)){

setMessages(prev=>{
const exists=prev.some(m=>m._id===msg._id);
if(exists)return prev;
return [...prev,msg];
});

}else{

setUnread(prev=>{
const count=prev[msg.sender]||0;
return {...prev,[msg.sender]:count+1};
});

}

fetchContacts();

};

socket.on('receive_chat',handleReceiveMessage);

return()=>{
socket.off('receive_chat',handleReceiveMessage);
};

},[user,selectedContact,socket]);

useEffect(()=>{

if(location.state?.contact){

const incomingContact=location.state.contact;

setSelectedContact(incomingContact);

setContacts(prev=>{
const exists=prev.find(c=>c._id===incomingContact._id);
if(!exists)return [incomingContact,...prev];
return prev;
});

window.history.replaceState({},document.title);

}

},[location.state]);

useEffect(()=>{

if(selectedContact){

axios
.get(`${BASE_URL}/api/messages/${user.id}/${selectedContact._id}`)
.then(res=>setMessages(res.data))
.catch(console.error);

setUnread(prev=>({...prev,[selectedContact._id]:0}));

}

},[selectedContact,user.id]);

useEffect(()=>{
scrollRef.current?.scrollIntoView({behavior:"smooth"});
},[messages]);

const uploadFile=async(file)=>{

const formData=new FormData();
formData.append('file',file);

try{
setIsUploading(true);

const res=await axios.post(`${BASE_URL}/api/messages/upload`,formData,{
headers:{'Content-Type':'multipart/form-data'}
});

return res.data;

}catch(err){
alert("Upload failed");
throw err;
}finally{
setIsUploading(false);
}

};

const sendMessage=async()=>{

if((!newMessage.trim()&&!attachmentPreview)||!selectedContact||isUploading)return;

let fileData=null;
let messageText=newMessage||"";

if(attachmentPreview){

try{
fileData=await uploadFile(attachmentPreview.file);
messageText=messageText||"[attachment]";
}catch{
return;
}

}

const msgData={
sender:user.id,
receiver:selectedContact._id,
text:messageText
};

if(fileData&&fileData.url){

msgData.attachment={
url:fileData.url,
name:fileData.name||attachmentPreview.file.name,
type:fileData.type||attachmentPreview.file.type
};

}

const tempId=Date.now().toString();

const optimisticMsg={
...msgData,
_id:tempId,
createdAt:new Date().toISOString(),
sender:{_id:user.id,name:user.name}
};

setMessages(prev=>[...prev,optimisticMsg]);

setNewMessage("");
setAttachmentPreview(null);
if(fileInputRef.current)fileInputRef.current.value="";

try{

const response=await axios.post(`${BASE_URL}/api/messages`,msgData);

setMessages(prev=>prev.map(msg=>msg._id===tempId?response.data:msg));

fetchContacts();

}catch{

setMessages(prev=>prev.filter(msg=>msg._id!==tempId));
alert("Failed to send message");

}

};

const handleAttachment=(e)=>{
const file=e.target.files[0];
if(!file)return;
const preview=URL.createObjectURL(file);
setAttachmentPreview({file,preview});
};

const renderMessage = (msg) => {
  const isOwnMessage = msg.sender === user.id || msg.sender?._id === user.id;
  
  // Check if message has attachment
  const hasAttachment = msg.attachment && msg.attachment.url;
  const isImage = hasAttachment && (
    msg.attachment.type?.startsWith('image/') || 
    msg.attachment.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  );

  return (
    <div key={msg._id} className={`message-row ${isOwnMessage ? 'own' : ''}`}>
      <div className="chat-bubble">
        {/* Show text if it exists and not just the attachment placeholder */}
        {msg.text && msg.text !== "[attachment]" && (
          <div className="message-text">{msg.text}</div>
        )}
        
        {/* Show attachment if it exists */}
        {hasAttachment && (
          <div className="message-attachment">
            {isImage ? (
              <img 
                src={msg.attachment.url} 
                alt={msg.attachment.name || 'attachment'}
                className="attachment-image"
                onClick={() => window.open(msg.attachment.url, '_blank')}
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '200px', 
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginTop: msg.text ? '8px' : '0'
                }}
                onError={(e) => {
                  console.error('Image failed to load:', msg.attachment.url);
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <a href="${msg.attachment.url}" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:8px 12px; background:#f1f5f9; border-radius:8px; text-decoration:none; color:#333;">
                      📎 ${msg.attachment.name || 'View attachment'}
                    </a>
                  `;
                }}
              />
            ) : (
              <a 
                href={msg.attachment.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  background: '#f1f5f9',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#333',
                  marginTop: msg.text ? '8px' : '0'
                }}
              >
                📎 {msg.attachment.name || 'Download file'}
              </a>
            )}
          </div>
        )}
        
        {/* Show attachment placeholder for old messages */}
        {!hasAttachment && msg.text === "[attachment]" && (
          <div className="attachment-placeholder">📎 Attachment</div>
        )}
        
        <div className="message-time">
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
};

return(

<div className="chat-wrapper">

<div className="chat-sidebar">

<div className="sidebar-header">
Messages
</div>

<div className="contacts-list">

{contacts.map(c=>{

const isOnline=onlineUsers.includes(c._id);

return(

<div
key={c._id}
onClick={()=>setSelectedContact(c)}
className={`contact-item ${selectedContact?._id===c._id?'active':''}`}
>

<div className="avatar-wrapper">

<img
src={c.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`}
className="contact-avatar"
/>

{isOnline && <div className="online-dot"></div>}

</div>

<div className="contact-name">{c.name}</div>

{unread[c._id] > 0 &&
<div className="unread-badge">{unread[c._id]}</div>
}

</div>

)

})}

</div>
</div>

{selectedContact ?

<div className="chat-window">

<div className="chat-header">

<img
src={selectedContact.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedContact.name}`}
className="chat-avatar"
/>

<div className="chat-name">{selectedContact.name}</div>

</div>

<div className="chat-history">

{messages.map((msg,i)=>(
<div key={msg._id||i} ref={i===messages.length-1?scrollRef:null}>
{renderMessage(msg)}
</div>
))}

</div>

{/* Attachment Preview */}
{attachmentPreview && (
  <div className="attachment-preview-container">
    <div className="attachment-preview">
      {attachmentPreview.file.type.startsWith('image/') ? (
        <img 
          src={attachmentPreview.preview} 
          alt="preview" 
          className="preview-image"
        />
      ) : (
        <div className="file-preview">
          📎 {attachmentPreview.file.name}
        </div>
      )}
      <button 
        className="remove-attachment"
        onClick={() => {
          setAttachmentPreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }}
      >
        ✕
      </button>
    </div>
  </div>
)}

<div className="chat-input-bar">

<button
className="attach-btn"
onClick={() => fileInputRef.current.click()}
disabled={isUploading}
>
{isUploading ? '⏳' : '+'}
</button>

<input
type="file"
ref={fileInputRef}
style={{display:"none"}}
onChange={handleAttachment}
accept="image/*,.pdf,.txt"
/>

<input
type="text"
placeholder="Type a message..."
value={newMessage}
onChange={e=>setNewMessage(e.target.value)}
onKeyPress={e=>e.key==='Enter' && sendMessage()}
disabled={isUploading}
/>

<button 
className="send-btn" 
onClick={sendMessage}
disabled={isUploading || (!newMessage.trim() && !attachmentPreview)}
>
{isUploading ? 'Uploading...' : 'Send'}
</button>

</div>

</div>

:

<div className="chat-empty">

<div className="empty-icon">💬</div>

<div className="empty-title">
Start a Conversation
</div>

<div className="empty-text">
Select a contact from the sidebar to start messaging
</div>

</div>

}

<style>{`

.chat-wrapper{
display:flex;
height:88vh;
gap:22px;
background:linear-gradient(180deg,#f8fafc,#eef2f7);
padding:12px;
}

.message-attachment {
  margin-top: 4px;
}

.attachment-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.attachment-image:hover {
  transform: scale(1.05);
}

.message-row.own .attachment-image {
  border: 2px solid rgba(255,255,255,0.2);
}

.message-row.own a {
  background: rgba(255,255,255,0.2) !important;
  color: white !important;
}

.attachment-placeholder {
  color: #666;
  font-style: italic;
  padding: 4px 0;
}

.message-row.own .attachment-placeholder {
  color: rgba(255,255,255,0.8);
}

.attachment-preview-container {
  padding: 10px 14px;
  border-top: 1px solid #eee;
  background: #f9fafb;
}

.attachment-preview {
  position: relative;
  display: inline-block;
}

.preview-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #e2e8f0;
}

.file-preview {
  padding: 8px 12px;
  background: #f1f5f9;
  border-radius: 8px;
  font-size: 13px;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-attachment {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.remove-attachment:hover {
  background: #dc2626;
}

.chat-sidebar{
width:320px;
background:white;
border-radius:16px;
box-shadow:0 20px 60px rgba(0,0,0,.08);
border:1px solid #e5e7eb;
overflow:hidden;
display:flex;
flex-direction:column;
}

.sidebar-header{
padding:18px;
font-weight:700;
font-size:18px;
border-bottom:1px solid #eee;
}

.contacts-list{
overflow-y:auto;
flex:1;
}

.contact-item{
display:flex;
align-items:center;
gap:12px;
padding:14px;
cursor:pointer;
transition:.25s;
border-radius:10px;
margin:6px;
}

.contact-item:hover{
background:#f1f5f9;
transform:translateX(4px);
}

.contact-item.active{
background:#e2e8f0;
}

.contact-avatar{
width:40px;
height:40px;
border-radius:50%;
}

.avatar-wrapper{
position:relative;
}

.online-dot{
position:absolute;
bottom:0;
right:0;
width:10px;
height:10px;
background:#22c55e;
border-radius:50%;
border:2px solid white;
}

.unread-badge{
margin-left:auto;
background:#ef4444;
color:white;
font-size:11px;
padding:3px 7px;
border-radius:999px;
}

.chat-window{
flex:1;
background:white;
border-radius:16px;
display:flex;
flex-direction:column;
border:1px solid #e5e7eb;
box-shadow:0 30px 70px rgba(0,0,0,.08);
}

.chat-header{
display:flex;
align-items:center;
gap:12px;
padding:18px;
border-bottom:1px solid #eee;
}

.chat-avatar{
width:36px;
height:36px;
border-radius:50%;
}

.chat-history{
flex:1;
overflow-y:auto;
padding:24px;
display:flex;
flex-direction:column;
gap:14px;
}

.message-row{
display:flex;
}

.message-row.own{
justify-content:flex-end;
}

.chat-bubble{
padding:12px 16px;
border-radius:14px;
background:#f1f5f9;
max-width:60%;
box-shadow:0 4px 10px rgba(0,0,0,.05);
}

.message-row.own .chat-bubble{
background:#111827;
color:white;
}

.message-time{
font-size:10px;
opacity:.6;
margin-top:5px;
}

.chat-input-bar{
display:flex;
gap:10px;
padding:14px;
border-top:1px solid #eee;
}

.chat-input-bar input{
flex:1;
padding:12px;
border-radius:10px;
border:1px solid #e2e8f0;
}

.attach-btn{
background:#f1f5f9;
border:none;
border-radius:10px;
padding:0 12px;
cursor:pointer;
}

.send-btn{
background:#111827;
color:white;
border:none;
padding:0 20px;
border-radius:10px;
cursor:pointer;
}

.chat-empty{
flex:1;
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
text-align:center;
color:#64748b;
}

.empty-icon{
font-size:60px;
margin-bottom:10px;
}

.empty-title{
font-size:22px;
font-weight:600;
margin-bottom:6px;
color:#334155;
}

.empty-text{
font-size:14px;
}

`}</style>

</div>

);

}
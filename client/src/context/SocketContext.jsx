import { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const SocketContext = createContext();

// --- SMART URL DETECTION ---
const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : `http://${window.location.hostname}:5000`;

// --- CREATE THE SOCKET ---
const socket = io(BASE_URL, {
    transports: ['websocket'],
    autoConnect: true
}); 

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  
  // 🚨 REMOVED: incomingCall state (We don't want global popups anymore)

  useEffect(() => {
    if (user && user.id) {
      socket.emit('join_chat', user.id);
      // We join a room with our own ID so people can message us
      socket.emit('join_room', user.id);
    }

    // Listen for Messages
    const handleReceiveChat = (msg) => {
      if (msg.sender !== user?.id) {
        setNotifications((prev) => [...prev, { type: 'message', ...msg }]);
      }
    };

    // 🚨 REMOVED: Global 'callUser' listener. 
    // The VideoRoom component now handles this event locally.

    socket.on('receive_chat', handleReceiveChat);

    return () => {
      socket.off('receive_chat', handleReceiveChat);
    };
  }, [user]);

  const clearNotifications = () => setNotifications([]);

  return (
    <SocketContext.Provider value={{ socket, notifications, clearNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);


import { createContext, useState, useEffect } from "react";
import axios from 'axios';

export const AuthContext = createContext();

const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : `http://${window.location.hostname}:5000`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🚨 1. SETUP INTERCEPTOR FOR BANNED USERS 🚨
    // This runs on every response to check if the user was just banned
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Check for 403 Forbidden with specific Ban message
        if (error.response && error.response.status === 403) {
          if (error.response.data.error === "You are banned. Contact Admin.") {
            
            // Force Logout Logic (Replica of logout function)
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            
            alert("🚫 Your account has been banned by the administrator.");
            window.location.href = '/login'; 
          }
        }
        return Promise.reject(error);
      }
    );

    // 🚨 2. CHECK LOGIN STATUS ON LOAD 🚨
    const checkUserLoggedIn = async () => {
      // Use sessionStorage as requested
      const token = sessionStorage.getItem("token");

      if (token) {
        try {
          // VERIFY TOKEN WITH SERVER & GET FRESH DATA (Wallet/ID)
          const res = await axios.get(`${BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setUser(res.data);
          // Set axios default so we don't have to attach token every time
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
          console.error("Session invalid:", error);
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false); // Stop loading regardless of success/fail
    };

    checkUserLoggedIn();

    // Cleanup interceptor on unmount
    return () => {
        axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = (userData, token) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/login'; 
  };

  const updateUser = (newData) => {
    setUser(prev => {
        const updated = { ...prev, ...newData };
        sessionStorage.setItem("user", JSON.stringify(updated));
        return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {loading ? (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h3>Loading Profile...</h3> 
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// import { useEffect } from 'react';

// export default function Toast({ message, type, onClose }) {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, 3000); 
//     return () => clearTimeout(timer);
//   }, [onClose, message]);

//   if (!message) return null;

//   return (
//     <div className="toast-container">
//       <div className={`toast-msg ${type === 'error' ? 'bg-error' : 'bg-success'}`}>
//         {message}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';

export default function Toast({ message, type, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation after 2.7 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2700);

    // Actually remove toast after animation completes (3 seconds total)
    const removeTimer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [onClose, message]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for exit animation
  };

  if (!message) return null;

  // Icons based on toast type
  const getIcon = () => {
    switch(type) {
      case 'success':
        return (
          <svg className="toast-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="toast-icon error" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="toast-icon warning" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="toast-icon info" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Background color based on type
  const getBgColor = () => {
    switch(type) {
      case 'success': return 'bg-success';
      case 'error': return 'bg-error';
      case 'warning': return 'bg-warning';
      case 'info': return 'bg-info';
      default: return 'bg-info';
    }
  };

  return (
    <div className="toast-wrapper">
      <div 
        className={`toast-container ${isExiting ? 'exit' : ''}`}
        onClick={handleClose}
      >
        <div className={`toast-content ${getBgColor()}`}>
          <div className="toast-icon-wrapper">
            {getIcon()}
          </div>
          <div className="toast-message">{message}</div>
          <button className="toast-close-btn" onClick={handleClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className={`toast-progress ${type}`} style={{ animation: `shrink 3s linear forwards` }} />
      </div>

      <style>{`
        .toast-wrapper {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 100%;
          pointer-events: none;
        }

        .toast-container {
          pointer-events: auto;
          min-width: 320px;
          max-width: 450px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 3px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          animation: slideIn 0.3s ease forwards;
          position: relative;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .toast-container:hover {
          transform: translateX(-5px);
        }

        .toast-container.exit {
          animation: slideOut 0.3s ease forwards;
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
        }

        .toast-icon-wrapper {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toast-icon {
          width: 24px;
          height: 24px;
        }

        .toast-icon.success {
          color: #10b981;
        }

        .toast-icon.error {
          color: #ef4444;
        }

        .toast-icon.warning {
          color: #f59e0b;
        }

        .toast-icon.info {
          color: #3b82f6;
        }

        .toast-message {
          flex: 1;
          font-size: 0.95rem;
          font-weight: 500;
          color: #1e293b;
          line-height: 1.4;
          word-break: break-word;
        }

        .toast-close-btn {
          flex-shrink: 0;
          background: transparent;
          border: none;
          padding: 4px;
          cursor: pointer;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          color: #64748b;
        }

        .toast-close-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .toast-close-btn svg {
          width: 18px;
          height: 18px;
        }

        .toast-progress {
          height: 4px;
          width: 100%;
          background: rgba(255, 255, 255, 0.3);
        }

        .toast-progress.success {
          background: #10b981;
        }

        .toast-progress.error {
          background: #ef4444;
        }

        .toast-progress.warning {
          background: #f59e0b;
        }

        .toast-progress.info {
          background: #3b82f6;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        /* Background colors */
        .bg-success {
          background: #f0fdf4;
          border-left: 4px solid #10b981;
        }

        .bg-error {
          background: #fef2f2;
          border-left: 4px solid #ef4444;
        }

        .bg-warning {
          background: #fffbeb;
          border-left: 4px solid #f59e0b;
        }

        .bg-info {
          background: #eff6ff;
          border-left: 4px solid #3b82f6;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .toast-wrapper {
            left: 20px;
            right: 20px;
          }

          .toast-container {
            min-width: auto;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
import React, { useState, useEffect } from 'react';

const ToastNotification = ({ message, duration = 2000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow time for fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast-notification ${isVisible ? 'show' : 'hide'}`}>
      {message}
    </div>
  );
};

export default ToastNotification; 
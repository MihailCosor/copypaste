import React, { useState, useCallback } from 'react';
import ToastNotification from './ToastNotification';

const ToastManager = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, duration = 2000) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  return {
    toastContainerJSX: (
      <div className="toast-container">
        {toasts.map(toast => (
          <ToastNotification
            key={toast.id}
            message={toast.message}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    ),
    showToast
  };
};

export default ToastManager; 
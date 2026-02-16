import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useToast from '../hooks/useToast';
import './Styles/Toast.css';

const iconMap = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className={`toast toast--${t.type}`}
            role="alert"
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="material-symbols-rounded toast-icon" aria-hidden="true">
              {iconMap[t.type]}
            </span>
            <span className="toast-msg">{t.message}</span>
            <button
              className="toast-close"
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss notification"
            >
              <span className="material-symbols-rounded" aria-hidden="true">close</span>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

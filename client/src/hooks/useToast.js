import React, { createContext, useContext, useReducer, useCallback } from 'react';

const ToastContext = createContext(null);

let nextId = 0;

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.toast];
    case 'REMOVE':
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(reducer, []);

  const addToast = useCallback((message, options = {}) => {
    const id = ++nextId;
    const toast = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration ?? 4000,
    };
    dispatch({ type: 'ADD', toast });

    if (toast.duration > 0) {
      setTimeout(() => dispatch({ type: 'REMOVE', id }), toast.duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export default function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

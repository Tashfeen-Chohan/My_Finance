"use client";

import * as React from "react";

const ToastContext = React.createContext(undefined);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const dismiss = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(({ title, description, variant = "default", duration = 4000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, variant, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration !== Infinity) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

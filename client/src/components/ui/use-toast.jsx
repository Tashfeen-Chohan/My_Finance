"use client";

import * as React from "react";

const ToastContext = React.createContext(undefined);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const dismiss = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (options) => {
      const opts = typeof options === "string" ? { title: options } : options;
      const rawVariant = opts.variant || "default";
      const normalizedVariant = rawVariant === "destructive" ? "error" : rawVariant;

      const isError = normalizedVariant === "error";
      const defaultDuration = isError ? Infinity : 5000;
      const duration = opts.duration !== undefined ? opts.duration : defaultDuration;

      const id = Math.random().toString(36).substring(2, 9);
      const newToast = { id, title: opts.title, description: opts.description, variant: normalizedVariant, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration !== Infinity) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

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

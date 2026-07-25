"use client";

import React, { useState, useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

export function ErrorBoundary({ children, fallback }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleGlobalError = (event) => {
      console.error("Unhandled UI error:", event.error);
      setError(event.error || new Error(event.message || "An error occurred"));
    };

    window.addEventListener("error", handleGlobalError);
    return () => window.removeEventListener("error", handleGlobalError);
  }, []);

  const handleReset = () => {
    setError(null);
  };

  if (error) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <ErrorState
        title="Application Exception"
        message="An unhandled UI component error occurred."
        error={error}
        onRetry={handleReset}
      />
    );
  }

  return <>{children}</>;
}

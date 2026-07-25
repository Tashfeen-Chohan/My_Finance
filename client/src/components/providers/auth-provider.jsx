"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/stores/use-auth-store";

export function AuthProvider({ children }) {
  const checkAuthSession = useAuthStore((state) => state.checkAuthSession);

  useEffect(() => {
    checkAuthSession();
  }, [checkAuthSession]);

  return <>{children}</>;
}

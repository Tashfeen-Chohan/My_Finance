"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldCheck, Smartphone, WifiOff } from "lucide-react";

export default function LoginPage() {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isInitialized, router]);

  return (
    <div className="bg-background relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="border-border bg-card flex h-16 w-16 items-center justify-center rounded-2xl border p-2 shadow-xs">
            <Image
              src="/icons/icon-192x192.png"
              alt="MyFinance Logo"
              width={56}
              height={56}
              className="h-full w-full rounded-xl object-cover"
              priority
            />
          </div>

          <div className="space-y-1">
            <h1 className="text-foreground text-2xl font-bold tracking-tight">MyFinance</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Vehicle expense, fuel, and maintenance ledger
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="p-1">
          <CardHeader className="space-y-1.5 text-center pb-3">
            <CardTitle className="text-lg font-semibold tracking-tight">Sign in</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Continue with your Google account to sync your vehicles and logs.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-1 pb-5">
            <GoogleLoginButton />
          </CardContent>
        </Card>

        {/* Subtle Feature Row */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-muted-foreground">
          <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-2 py-2.5">
            <Smartphone className="h-3.5 w-3.5 text-primary" />
            <span>Installable</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-2 py-2.5">
            <WifiOff className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span>Offline Ready</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-2 py-2.5">
            <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}

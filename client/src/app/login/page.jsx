"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Wallet, ShieldCheck, Smartphone, Zap, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isInitialized, router]);

  return (
    <div className="from-background via-background to-primary/5 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="space-y-2 text-center">
          <div className="bg-primary text-primary-foreground shadow-primary/25 mb-2 inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg">
            <Wallet className="h-7 w-7" />
          </div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">MyFinance PWA</h1>
          <p className="text-muted-foreground text-sm">
            Personal Finance Manager • Offline-First & Secured with Google OAuth 2.0
          </p>
        </div>

        {/* Login Card */}
        <Card className="glass-panel border-border p-2 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mb-1 flex justify-center">
              <Badge variant="outline" className="gap-1 font-mono text-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Google OAuth 2.0 Only
              </Badge>
            </div>
            <CardTitle className="text-xl">Sign in to your account</CardTitle>
            <CardDescription className="text-xs">
              Authenticate securely using your Google ID Token & HttpOnly sessions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2 pb-6">
            <GoogleLoginButton />
            <div className="pt-2 border-t border-border text-center">
              <Link
                href="/test-db"
                className="inline-flex items-center justify-center gap-2 w-full text-xs font-medium text-indigo-400 hover:text-indigo-300 py-2.5 px-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all"
              >
                <Database className="w-4 h-4 text-indigo-400" />
                <span>Test Public API & DB Connection (No Login)</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features Summary */}
        <div className="text-muted-foreground grid grid-cols-2 gap-3 pt-2 text-center text-xs">
          <div className="border-border bg-card/60 flex items-center justify-center gap-2 rounded-xl border p-3">
            <Smartphone className="text-primary h-4 w-4" />
            <span>Mobile PWA Ready</span>
          </div>
          <div className="border-border bg-card/60 flex items-center justify-center gap-2 rounded-xl border p-3">
            <Zap className="h-4 w-4 text-emerald-500" />
            <span>Auto Token Refresh</span>
          </div>
        </div>
      </div>
    </div>
  );
}

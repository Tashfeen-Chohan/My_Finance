"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldCheck, Smartphone, Zap, Lock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AmbientBackground } from "@/components/layout/ambient-background";

export default function LoginPage() {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isInitialized, router]);

  return (
    <div className="bg-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 sm:p-6">
      <AmbientBackground />

      {/* Ambient Lighting & Glow Orbs */}
      <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-primary/15 blur-[140px] animate-pulse" />
      <div className="pointer-events-none absolute h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-3 text-center">
          {/* Logo Badge Container with Pulsing Halo */}
          <div className="group relative flex items-center justify-center">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-primary/30 via-emerald-500/25 to-amber-500/30 blur-xl opacity-80 animate-pulse" />
            <div className="border-border/80 bg-card/90 relative flex h-20 w-20 items-center justify-center rounded-3xl border p-2 shadow-2xl backdrop-blur-2xl transition-transform duration-500 group-hover:scale-105">
              <Image
                src="/icons/icon-192x192.png"
                alt="MyFinance Logo"
                width={72}
                height={72}
                className="h-full w-full rounded-2xl object-cover shadow-sm"
                priority
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-foreground text-3xl font-extrabold tracking-tight">MyFinance</h1>
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary font-mono text-[10px] tracking-wider uppercase">
                PWA
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs font-medium max-w-xs mx-auto leading-relaxed">
              Mobile-First Personal Finance & Expense Manager
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="glass-panel border-border/80 relative rounded-3xl p-2 shadow-2xl backdrop-blur-2xl">
          <CardHeader className="space-y-2 text-center pb-2">
            <div className="flex justify-center">
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500 gap-1.5 px-3 py-1 font-mono text-[11px] font-semibold shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Google OAuth 2.0 Direct Session</span>
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold tracking-tight">Sign in to your account</CardTitle>
            <CardDescription className="text-xs text-muted-foreground leading-relaxed px-4">
              Securely access your offline expense ledger & vehicle metrics.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-2 pb-6">
            <GoogleLoginButton />
          </CardContent>
        </Card>

        {/* Capability Cards Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-1 text-center text-xs">
          <div className="border-border/60 bg-card/60 flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 shadow-sm backdrop-blur-md transition-all hover:bg-card/90">
            <Smartphone className="text-primary h-4 w-4" />
            <span className="font-semibold text-[11px]">Installable PWA</span>
          </div>

          <div className="border-border/60 bg-card/60 flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 shadow-sm backdrop-blur-md transition-all hover:bg-card/90">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="font-semibold text-[11px]">Offline Support</span>
          </div>
        </div>

        {/* Security Footer Notice */}
        <div className="flex items-center justify-center gap-2 text-center text-[11px] text-muted-foreground/80 font-mono">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span>Encrypted Session • Zero Data Exposure</span>
        </div>
      </div>
    </div>
  );
}

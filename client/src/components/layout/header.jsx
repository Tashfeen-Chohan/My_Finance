"use client";

import React from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { useAuthStore } from "@/stores/use-auth-store";
import { User, Wallet, Bell, LogOut, ShieldCheck, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export function Header() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
    toast({
      title: "Logged Out",
      description: "Signed out successfully",
      variant: "info",
    });
    router.push("/login");
  };

  const formattedEmail = user?.email ? user.email.toLowerCase() : "";

  return (
    <header className="border-border/60 bg-card/75 sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b px-4 backdrop-blur-xl md:px-6">
      {/* Mobile Brand / Page Title */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg shadow-sm">
          <Wallet className="h-4 w-4" />
        </div>
        <span className="text-sm font-bold tracking-tight">MyFinance</span>
      </div>

      {/* Desktop Subtitle */}
      <div className="text-muted-foreground hidden items-center gap-3 text-sm md:flex">
        <span className="text-foreground font-semibold">Personal Finance Tracker</span>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2.5">
        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-accent/80" title="Notifications">
          <Bell className="text-muted-foreground h-4 w-4" />
        </Button>
        <ThemeToggle />

        {/* User Profile Avatar & Enhanced Dropdown */}
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="group border-border/60 hover:border-primary/40 focus:ring-primary/20 ml-1.5 flex cursor-pointer items-center gap-2.5 rounded-full border bg-card/60 p-1 pr-2.5 transition-all hover:bg-accent/60 focus:outline-none focus:ring-2">
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.name || "User Avatar"}
                      width={32}
                      height={32}
                      className="border-primary/20 h-8 w-8 rounded-full border object-cover shadow-sm transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="bg-primary/10 text-primary border-primary/20 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold shadow-sm">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                  {/* Active Green Dot */}
                  <span className="border-background absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 bg-emerald-500 shadow-sm" />
                </div>

                <span className="text-foreground max-w-[120px] truncate text-xs font-semibold hidden sm:inline-block">
                  {user.name}
                </span>
                <ChevronDown className="text-muted-foreground group-hover:text-foreground h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="glass-panel border-border/80 w-64 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
              {/* User Profile Header */}
              <DropdownMenuLabel className="font-normal p-2">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={user.name || "User"}
                        width={40}
                        height={40}
                        className="border-primary/20 h-10 w-10 rounded-full border object-cover shadow-sm"
                      />
                    ) : (
                      <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 space-y-0.5">
                    <p className="text-foreground truncate text-sm font-bold leading-tight">{user.name}</p>
                    <p className="text-muted-foreground truncate text-xs font-mono lowercase">{formattedEmail}</p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-border/60 my-1" />

              {/* Settings Page Navigation Link */}
              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="hover:bg-accent text-foreground flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium transition-colors"
              >
                <Settings className="text-primary h-4 w-4" />
                <div className="flex flex-col">
                  <span>Settings & Preferences</span>
                  <span className="text-muted-foreground text-[10px]">Manage app profile & configuration</span>
                </div>
              </DropdownMenuItem>

              {/* Session Security Indicator */}
              <DropdownMenuItem className="text-muted-foreground flex cursor-default items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="truncate">Google OAuth Session</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-border/60 my-1" />

              {/* Logout Option */}
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button size="sm" variant="outline" onClick={() => router.push("/login")} className="rounded-xl">
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}

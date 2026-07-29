"use client";

import React from "react";
import Image from "next/image";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { useAuthStore } from "@/stores/use-auth-store";
import { User, Wallet, Bell, LogOut, ShieldCheck } from "lucide-react";
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

  return (
    <header className="border-border bg-card/80 sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b px-4 backdrop-blur-md md:px-6">
      {/* Mobile Brand / Page Title */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
          <Wallet className="h-4 w-4" />
        </div>
        <span className="text-sm font-bold">MyFinance</span>
      </div>

      {/* Desktop Subtitle */}
      <div className="text-muted-foreground hidden items-center gap-3 text-sm md:flex">
        <span className="text-foreground font-medium">Personal Finance Tracker</span>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full" title="Notifications">
          <Bell className="text-muted-foreground h-4 w-4" />
        </Button>
        <ThemeToggle />

        {/* User Profile Avatar & Dropdown */}
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="border-border ml-1 flex cursor-pointer items-center gap-2 border-l pl-2 outline-none">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="border-border h-8 w-8 rounded-full border object-cover"
                  />
                ) : (
                  <div className="bg-secondary text-secondary-foreground flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-semibold">{user.name}</p>
                  <p className="text-muted-foreground text-xs leading-none">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-muted-foreground gap-2 text-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Google OAuth Session</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive gap-2 font-medium cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button size="sm" variant="outline" onClick={() => router.push("/login")}>
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}

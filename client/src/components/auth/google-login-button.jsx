"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/stores/use-auth-store";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { LogIn, Sparkles } from "lucide-react";

export function GoogleLoginButton() {
  const { loginWithGoogleCredential, loginWithMockUser, isLoading } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState(null);

  const clientId = env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) {
      toast({
        title: "Google Sign-In Failed",
        description: "No Google ID token credential returned",
        variant: "error",
      });
      return;
    }

    setErrorMsg(null);
    const result = await loginWithGoogleCredential(credentialResponse.credential);

    if (result.success) {
      toast({
        title: "Authenticated Successfully",
        description: "Welcome to MyFinance!",
        variant: "success",
      });
      router.push("/");
    } else {
      setErrorMsg(result.error || "Login failed");
      toast({
        title: "Authentication Failed",
        description: result.error || "Backend verification failed",
        variant: "error",
      });
    }
  };

  const handleMockLogin = async () => {
    setErrorMsg(null);
    const result = await loginWithMockUser();
    if (result.success) {
      toast({
        title: "Dev Session Initialized",
        description: "Logged in with Google test profile",
        variant: "success",
      });
      router.push("/");
    } else {
      setErrorMsg(result.error || "Dev login failed");
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Official Google OAuth Provider & Sign In Button */}
      {clientId && clientId !== "mock-google-client-id-development" ? (
        <GoogleOAuthProvider clientId={clientId}>
          <div className="flex w-full justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                toast({
                  title: "Google Sign-In Canceled",
                  description: "Unable to complete Google OAuth authentication",
                  variant: "error",
                });
              }}
              useOneTap
              theme="filled_blue"
              shape="pill"
              size="large"
              width="320"
            />
          </div>
        </GoogleOAuthProvider>
      ) : (
        <div className="space-y-3">
          <Button
            onClick={handleMockLogin}
            isLoading={isLoading}
            variant="default"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-base font-semibold shadow-md"
            leftIcon={<LogIn className="h-5 w-5" />}
          >
            Sign in (Dev Mock Login)
          </Button>
          <div className="text-muted-foreground flex flex-col items-center justify-center gap-1 text-center text-xs">
            <div className="flex items-center gap-1.5 font-medium text-amber-500">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Dev Mode Active (Mock Client ID)</span>
            </div>
            <span className="text-[11px] opacity-80">
              Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local to open real Google modal
            </span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-lg border p-3 text-center text-xs font-medium">
          {errorMsg}
        </div>
      )}
    </div>
  );
}

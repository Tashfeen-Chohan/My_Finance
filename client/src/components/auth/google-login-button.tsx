"use client";

import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuthStore } from "@/stores/use-auth-store";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { LogIn, Sparkles } from "lucide-react";

export function GoogleLoginButton() {
  const { loginWithGoogleCredential, loginWithMockUser, isLoading } = useAuthStore();
  const { toast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const clientId = env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
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
            Sign in with Google OAuth 2.0
          </Button>
          <div className="text-muted-foreground flex items-center justify-center gap-1.5 text-xs">
            <Sparkles className="text-primary h-3.5 w-3.5" />
            <span>Dev Mode: Connects to backend `/api/auth/google` with ID Token</span>
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

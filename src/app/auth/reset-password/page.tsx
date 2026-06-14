"use client";

import { useState, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { LiquidButton } from "@/components/ui/liquid-button";
import { LiquidInput } from "@/components/ui/liquid-input";
import Link from "next/link";
import { toast } from "sonner";
import { Lock, Mail } from "lucide-react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  if (token) {
    return <NewPasswordForm token={token} />;
  }

  return <RequestResetForm />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function RequestResetForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        
        if (res.ok) {
          setSubmitted(true);
        } else {
          toast.error("Failed to send reset link.");
        }
      } catch {
        toast.error("Something went wrong.");
      }
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <LiquidGlass className="w-full max-w-md p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground text-sm">
            If an account exists for {email}, we&apos;ve sent instructions to reset your password.
          </p>
          <Link href="/api/auth/signin" className="block mt-4">
            <LiquidButton className="w-full">Return to sign in</LiquidButton>
          </Link>
        </LiquidGlass>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LiquidGlass className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground text-sm">
            Enter your email to receive a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Email Address</label>
            <LiquidInput
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </div>

          <LiquidButton
            type="submit"
            className="w-full"
            disabled={isPending || !email}
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </LiquidButton>
        </form>
      </LiquidGlass>
    </div>
  );
}

function NewPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/update-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        });
        
        const data = await res.json();
        
        if (res.ok) {
          setSuccess(true);
        } else {
          setError(data.error || "Failed to update password");
        }
      } catch {
        setError("Something went wrong");
      }
    });
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <LiquidGlass className="w-full max-w-md p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Password Updated</h1>
          <p className="text-muted-foreground text-sm">
            Your password has been successfully reset.
          </p>
          <Link href="/api/auth/signin" className="block mt-4">
            <LiquidButton className="w-full">Sign in with new password</LiquidButton>
          </Link>
        </LiquidGlass>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LiquidGlass className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Create new password</h1>
          <p className="text-muted-foreground text-sm">
            Password must be at least 12 characters, with uppercase, lowercase, numbers, and symbols.
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">New Password</label>
            <LiquidInput
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Confirm Password</label>
            <LiquidInput
              type="password"
              required
              placeholder="••••••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={isPending}
            />
          </div>

          <LiquidButton
            type="submit"
            className="w-full"
            disabled={isPending || !password || !confirm}
          >
            {isPending ? "Updating..." : "Update Password"}
          </LiquidButton>
        </form>
      </LiquidGlass>
    </div>
  );
}

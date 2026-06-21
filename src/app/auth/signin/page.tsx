"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Navbar } from "@/components/layout/navbar";

type Mode = "signin" | "signup";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        // Register user first
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Registration failed.");
          setLoading(false);
          return;
        }
      }

      // Sign in
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      router.push("/calculator");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "100%",
            maxWidth: "420px",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c8ff00"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginBottom: "20px" }}
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
            <h1 className="text-headline" style={{ marginBottom: "8px" }}>
              {mode === "signin" ? "Welcome back" : "Create account"}
            </h1>
            <p style={{ fontSize: "0.9375rem", color: "#666" }}>
              {mode === "signin"
                ? "Sign in to track your carbon footprint"
                : "Join CarbonTrack and start reducing your impact"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={{ marginBottom: "20px" }}
              >
                <label
                  style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#666",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    background: "transparent",
                    border: "1px solid #222",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "0.9375rem",
                    outline: "none",
                    transition: "border-color 0.3s ease",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#555")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#222")}
                />
              </motion.div>
            )}

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#666",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  background: "transparent",
                  border: "1px solid #222",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "0.9375rem",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#555")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#222")}
              />
            </div>

            <div style={{ marginBottom: "8px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#666",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "Min 12 chars, upper, lower, number, special" : "••••••••••••"}
                required
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  background: "transparent",
                  border: "1px solid #222",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "0.9375rem",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#555")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#222")}
              />
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  color: "#ff4444",
                  fontSize: "0.8125rem",
                  marginTop: "12px",
                  marginBottom: "12px",
                }}
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "24px",
                padding: "16px",
                background: loading ? "#444" : "#fff",
                color: "#000",
                fontSize: "0.9375rem",
                fontWeight: 600,
                borderRadius: "12px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = "#c8ff00";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = "#fff";
              }}
            >
              {loading
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              margin: "32px 0",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#1a1a1a" }} />
            <span style={{ fontSize: "0.75rem", color: "#444" }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "#1a1a1a" }} />
          </div>

          {/* OAuth buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              type="button"
              onClick={() => signIn("github", { callbackUrl: "/calculator" })}
              style={{
                width: "100%",
                padding: "14px",
                background: "transparent",
                border: "1px solid #222",
                borderRadius: "12px",
                color: "#999",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "all 0.3s ease",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#555";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#222";
                e.currentTarget.style.color = "#999";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/calculator" })}
              style={{
                width: "100%",
                padding: "14px",
                background: "transparent",
                border: "1px solid #222",
                borderRadius: "12px",
                color: "#999",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "all 0.3s ease",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#555";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#222";
                e.currentTarget.style.color = "#999";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Toggle mode */}
          <p style={{ textAlign: "center", marginTop: "32px", fontSize: "0.875rem", color: "#666" }}>
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
              }}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                fontFamily: "inherit",
                fontSize: "inherit",
              }}
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>

          {/* Back link */}
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Link
              href="/"
              style={{
                fontSize: "0.8125rem",
                color: "#444",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#999")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
            >
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}

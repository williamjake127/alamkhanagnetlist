"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { user, login, isDemoMode } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/admin-panel");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      router.push("/admin-panel");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setEmail("admin@betbuzz365.com");
    setPassword("admin123");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-light_black p-6 sm:p-8 rounded-[12px] border border-white/10 shadow-2xl space-y-6">
        {/* Header with Logo */}
        <div className="text-center space-y-2">
          <div className="relative w-48 h-14 mx-auto">
            <Image
              src="/images/logo.png"
              alt="Betbuzz365 Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-white font-hind">Admin Portal Login</h2>
          <p className="text-xs text-gray font-hind">
            Sign in to access management dashboard & agent controls
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-[8px] bg-error/15 border border-error/30 text-error text-xs font-hind flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-primary text-xs font-hind block mb-1 font-medium">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@betbuzz365.com"
                required
                className="w-full py-2.5 pl-9 pr-3 rounded-[8px] bg-deep_black outline-none text-white text-sm border border-white/10 focus:border-primary transition-colors font-sans"
              />
            </div>
          </div>

          <div>
            <label className="text-primary text-xs font-hind block mb-1 font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full py-2.5 pl-9 pr-3 rounded-[8px] bg-deep_black outline-none text-white text-sm border border-white/10 focus:border-primary transition-colors font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-[8px] bg-primary text-deep_black font-bold text-sm font-hind hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{submitting ? "Signing in..." : "Sign In to Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Development Helper */}
        {isDemoMode && (
          <div className="pt-4 border-t border-white/10 text-center space-y-2">
            <p className="text-[11px] text-gray font-hind">
              Development Quick Login:
            </p>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-xs text-primary underline font-hind hover:opacity-80"
            >
              Fill Demo Admin Credentials
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginUser } from "@/lib/api/auth";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginUser(formData.email, formData.password);

      if (result.success) {
        login(result.user, result.profile);
        router.push("/dashboard");
      } else {
        setError(
          result.message || "Login failed. Please check your credentials.",
        );
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 lg:flex-row">
      {/* Left column: login form */}
      <section className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            {/* Logo */}
            <div className="animate-element glass flex h-12 w-12 items-center justify-center rounded-3xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 stroke-violet-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.071-7.071l-1.414 1.414M6.343 17.657l-1.414 1.414m0-14.142l1.414 1.414m11.314 11.314l1.414 1.414" />
              </svg>
            </div>

            {/* Heading */}
            <div className="animate-element animate-delay-100">
              <h1 className="mb-2 text-4xl font-light tracking-tighter text-white md:text-5xl">
                Welcome back
              </h1>
              <p className="text-zinc-400">
                Access your account and continue your journey with us
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="animate-element animate-delay-200 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-red-400">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="animate-element animate-delay-300">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="animate-element animate-delay-400">
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Password
                </label>
                <div className="glass-input relative rounded-2xl">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full bg-transparent pr-12 text-zinc-100 placeholder-zinc-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="custom-checkbox"
                  />
                  <span className="text-zinc-300">Keep me signed in</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-violet-400 transition-colors hover:underline"
                >
                  Reset password
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={loading}
                className="animate-element animate-delay-600"
              >
                {loading ? "Signing you in..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="animate-element animate-delay-700 relative flex items-center justify-center">
              <span className="w-24 border-t border-zinc-800"></span>
              <span className="px-4 text-sm text-zinc-500">
                Or continue with
              </span>
              <span className="w-24 border-t border-zinc-800"></span>
            </div>

            {/* Google sign in */}
            <Button
              variant="glass"
              size="lg"
              fullWidth
              className="animate-element animate-delay-800"
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <p className="animate-element animate-delay-900 text-center text-sm text-zinc-500">
              New to our platform?{" "}
              <Link
                href="/register"
                className="text-violet-400 transition-colors hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Right column: hero image + testimonials */}
      <section className="relative hidden flex-1 lg:block">
        <div className="animate-slide-right animate-delay-300 absolute inset-0 m-4 rounded-3xl bg-[url('https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80')] bg-cover"></div>

        {/* Testimonials */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-4 px-8">
          {/* Card 1 */}
          <div className="animate-testimonial animate-delay-1000 glass-card flex w-64 items-start gap-3 rounded-3xl p-5">
            <img
              src="https://randomuser.me/api/portraits/women/57.jpg"
              className="h-10 w-10 rounded-2xl object-cover"
              alt="avatar"
            />
            <div className="text-sm leading-snug">
              <p className="flex items-center gap-1 font-medium text-zinc-100">
                Sarah Chen
              </p>
              <p className="text-zinc-400">@sarahdigital</p>
              <p className="mt-1 text-zinc-300">
                Amazing platform! The user experience is seamless and the
                features are exactly what I needed.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="animate-testimonial animate-delay-1200 glass-card hidden w-64 items-start gap-3 rounded-3xl p-5 xl:flex">
            <img
              src="https://randomuser.me/api/portraits/men/64.jpg"
              className="h-10 w-10 rounded-2xl object-cover"
              alt="avatar"
            />
            <div className="text-sm leading-snug">
              <p className="flex items-center gap-1 font-medium text-zinc-100">
                Marcus Johnson
              </p>
              <p className="text-zinc-400">@marcustech</p>
              <p className="mt-1 text-zinc-300">
                This service has transformed how I work. Clean design, powerful
                features, and excellent support.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="animate-testimonial animate-delay-1400 glass-card hidden w-64 items-start gap-3 rounded-3xl p-5 2xl:flex">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              className="h-10 w-10 rounded-2xl object-cover"
              alt="avatar"
            />
            <div className="text-sm leading-snug">
              <p className="flex items-center gap-1 font-medium text-zinc-100">
                David Martinez
              </p>
              <p className="text-zinc-400">@davidcreates</p>
              <p className="mt-1 text-zinc-300">
                I've tried many platforms, but this one stands out. Intuitive,
                reliable, and genuinely helpful for productivity.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

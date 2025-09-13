"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createUserAccount } from "@/lib/api/auth";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Eye, EyeOff, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "backer",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (error) setError("");

    // Check password strength
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 8) {
      setPasswordStrength("weak");
    } else if (password.length >= 8 && /[0-9]/.test(password)) {
      setPasswordStrength("strong");
    } else {
      setPasswordStrength("medium");
    }
  };

  const validateForm = () => {
    if (!formData.fullName || formData.fullName.length < 2) {
      setError("Name must be at least 2 characters long");
      return false;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.password || formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError("Password must contain at least one number");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms of Service");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      // Generate username from email
      const username = formData.email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

      const result = await createUserAccount(
        formData.email,
        formData.password,
        formData.fullName,
        username,
        formData.userType,
      );

      if (result.success) {
        login(result.user, result.profile);
        router.push("/dashboard");
      } else {
        setError(result.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "strong":
        return "text-green-400";
      default:
        return "text-zinc-500";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case "weak":
        return "Weak";
      case "medium":
        return "Medium";
      case "strong":
        return "Strong";
      default:
        return "";
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 lg:flex-row">
      {/* Left column: registration form */}
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
                Join our community
              </h1>
              <p className="text-zinc-400">
                Create your account and start funding innovative projects
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
                  label="Full Name"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="animate-element animate-delay-400">
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

              <div className="animate-element animate-delay-500">
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
                {formData.password && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-sm ${getPasswordStrengthColor()}`}>
                      {getPasswordStrengthText()}
                    </span>
                    {passwordStrength === "strong" && (
                      <Check className="h-4 w-4 text-green-400" />
                    )}
                  </div>
                )}
              </div>

              <div className="animate-element animate-delay-600">
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Confirm Password
                </label>
                <div className="glass-input relative rounded-2xl">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="w-full bg-transparent pr-12 text-zinc-100 placeholder-zinc-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="animate-element animate-delay-700">
                <label className="mb-3 block text-sm font-medium text-zinc-400">
                  I am a:
                </label>
                <div className="flex gap-4">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="userType"
                      value="creator"
                      checked={formData.userType === "creator"}
                      onChange={handleInputChange}
                      className="h-4 w-4 border-white/20 bg-transparent text-violet-500 focus:ring-violet-400/50"
                    />
                    <span className="text-zinc-300">Creator</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="userType"
                      value="backer"
                      checked={formData.userType === "backer"}
                      onChange={handleInputChange}
                      className="h-4 w-4 border-white/20 bg-transparent text-violet-500 focus:ring-violet-400/50"
                    />
                    <span className="text-zinc-300">Backer</span>
                  </label>
                </div>
              </div>

              <div className="animate-element animate-delay-800">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="custom-checkbox"
                  />
                  <span className="text-sm text-zinc-300">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-violet-400 hover:underline"
                    >
                      Terms of Service
                    </Link>
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={loading}
                className="animate-element animate-delay-900"
              >
                {loading ? "Creating your account..." : "Create Account"}
              </Button>
            </form>

            <p className="animate-element animate-delay-1000 text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-violet-400 transition-colors hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Right column: hero image + testimonials */}
      <section className="relative hidden flex-1 lg:block">
        <div className="animate-slide-right animate-delay-300 absolute inset-0 m-4 rounded-3xl bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692?w=2160&q=80')] bg-cover"></div>

        {/* Testimonials */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-4 px-8">
          {/* Card 1 */}
          <div className="animate-testimonial animate-delay-1000 glass-card flex w-64 items-start gap-3 rounded-3xl p-5">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              className="h-10 w-10 rounded-2xl object-cover"
              alt="avatar"
            />
            <div className="text-sm leading-snug">
              <p className="flex items-center gap-1 font-medium text-zinc-100">
                Emma Rodriguez
              </p>
              <p className="text-zinc-400">@emmacreates</p>
              <p className="mt-1 text-zinc-300">
                The best platform for technical creators. Clean interface and
                amazing community support.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="animate-testimonial animate-delay-1200 glass-card hidden w-64 items-start gap-3 rounded-3xl p-5 xl:flex">
            <img
              src="https://randomuser.me/api/portraits/men/22.jpg"
              className="h-10 w-10 rounded-2xl object-cover"
              alt="avatar"
            />
            <div className="text-sm leading-snug">
              <p className="flex items-center gap-1 font-medium text-zinc-100">
                Alex Thompson
              </p>
              <p className="text-zinc-400">@alextech</p>
              <p className="mt-1 text-zinc-300">
                Found incredible projects here. The milestone system gives me
                confidence in backing.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="animate-testimonial animate-delay-1400 glass-card hidden w-64 items-start gap-3 rounded-3xl p-5 2xl:flex">
            <img
              src="https://randomuser.me/api/portraits/women/68.jpg"
              className="h-10 w-10 rounded-2xl object-cover"
              alt="avatar"
            />
            <div className="text-sm leading-snug">
              <p className="flex items-center gap-1 font-medium text-zinc-100">
                Lisa Park
              </p>
              <p className="text-zinc-400">@lisainnovates</p>
              <p className="mt-1 text-zinc-300">
                Perfect for technical projects. The transparency and community
                features are outstanding.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

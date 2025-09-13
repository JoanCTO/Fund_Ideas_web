"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/lib/contexts/AuthContext";
import { updateUserPassword } from "@/lib/api/auth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Lock, Bell, Shield, Trash2, Save, X, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  console.log("Profile on settings page:", profile);
  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    projectUpdates: true,
    milestoneNotifications: true,
    newBackers: true,
    marketingEmails: false,
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const validatePasswordForm = () => {
    if (!passwordForm.currentPassword) {
      setError("Current password is required");
      return false;
    }
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return false;
    }
    if (!/[0-9]/.test(passwordForm.newPassword)) {
      setError("New password must contain at least one number");
      return false;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return false;
    }
    return true;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await updateUserPassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      );

      if (result.success) {
        setSuccess("Password updated successfully!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(result.message || "Failed to update password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    // In a real app, this would show a confirmation modal
    alert(
      "Account deletion feature would be implemented here with proper confirmation.",
    );
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-950">
        {/* Header */}
        <div className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
          <div className="mx-auto max-w-4xl px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-light tracking-tighter text-white">
                  Account Settings
                </h1>
                <p className="text-zinc-400">
                  Manage your account preferences and security settings
                </p>
              </div>
              <Button variant="ghost" onClick={() => router.back()}>
                <X className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 py-8">
          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 rounded-2xl border border-green-400/20 bg-green-400/10 p-4 text-green-400">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-8">
            {/* Change Password */}
            <Card variant="glass" className="animate-element">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-400">
                      Current Password
                    </label>
                    <div className="glass-input relative rounded-2xl">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter your current password"
                        className="w-full bg-transparent pr-12 text-zinc-100 placeholder-zinc-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
                        className="absolute inset-y-0 right-3 flex items-center text-zinc-500 transition-colors hover:text-zinc-300"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-400">
                      New Password
                    </label>
                    <div className="glass-input relative rounded-2xl">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter your new password"
                        className="w-full bg-transparent pr-12 text-zinc-100 placeholder-zinc-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                        className="absolute inset-y-0 right-3 flex items-center text-zinc-500 transition-colors hover:text-zinc-300"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-400">
                      Confirm New Password
                    </label>
                    <div className="glass-input relative rounded-2xl">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm your new password"
                        className="w-full bg-transparent pr-12 text-zinc-100 placeholder-zinc-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                        className="absolute inset-y-0 right-3 flex items-center text-zinc-500 transition-colors hover:text-zinc-300"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="group"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card variant="glass" className="animate-element animate-delay-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <label className="flex cursor-pointer items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-100">
                        Project Updates
                      </p>
                      <p className="text-xs text-zinc-400">
                        Get notified when your projects receive updates
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="projectUpdates"
                      checked={notifications.projectUpdates}
                      onChange={handleNotificationChange}
                      className="custom-checkbox"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-100">
                        Milestone Notifications
                      </p>
                      <p className="text-xs text-zinc-400">
                        Receive alerts when milestones are completed
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="milestoneNotifications"
                      checked={notifications.milestoneNotifications}
                      onChange={handleNotificationChange}
                      className="custom-checkbox"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-100">
                        New Backers
                      </p>
                      <p className="text-xs text-zinc-400">
                        Get notified when someone backs your project
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="newBackers"
                      checked={notifications.newBackers}
                      onChange={handleNotificationChange}
                      className="custom-checkbox"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-100">
                        Marketing Emails
                      </p>
                      <p className="text-xs text-zinc-400">
                        Receive promotional content and platform updates
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="marketingEmails"
                      checked={notifications.marketingEmails}
                      onChange={handleNotificationChange}
                      className="custom-checkbox"
                    />
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card variant="glass" className="animate-element animate-delay-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
                  <h3 className="mb-2 text-sm font-medium text-red-400">
                    Danger Zone
                  </h3>
                  <p className="mb-4 text-sm text-zinc-400">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteAccount}
                    className="text-red-400 hover:bg-red-400/10 hover:text-red-300"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

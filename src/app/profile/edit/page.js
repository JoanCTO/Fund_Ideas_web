"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/lib/contexts/AuthContext";
import { updateUserProfile } from "@/lib/api/users";
import { AuthGuard } from "@/components/auth/AuthGuard";
import {
  Upload,
  Save,
  X,
  Github,
  Linkedin,
  Globe,
  User,
  FileText,
  Link as LinkIcon,
} from "lucide-react";

export default function ProfileEditPage() {
  const router = useRouter();
  const { profile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    profilePictureUrl: "",
    socialLinks: {
      github: "",
      linkedin: "",
      website: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        bio: profile.bio || "",
        profilePictureUrl: profile.profilePictureUrl || "",
        socialLinks: profile.socialLinks
          ? JSON.parse(profile.socialLinks)
          : {
              github: "",
              linkedin: "",
              website: "",
            },
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const updateData = {
        fullName: formData.fullName,
        bio: formData.bio,
        profilePictureUrl: formData.profilePictureUrl,
        socialLinks: JSON.stringify(formData.socialLinks),
      };

      const result = await updateUserProfile(profile.$id, updateData);

      if (result.success) {
        updateProfile(result.data);
        setSuccess("Profile updated successfully!");
        setTimeout(() => {
          router.push(`/profile/${profile.username}`);
        }, 1500);
      } else {
        setError(result.message || "Failed to update profile");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/profile/${profile.username}`);
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
                  Edit Profile
                </h1>
                <p className="text-zinc-400">
                  Update your profile information and social links
                </p>
              </div>
              <Button variant="ghost" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
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

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture Section */}
            <Card variant="glass" className="animate-element">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-zinc-800">
                    {formData.profilePictureUrl ? (
                      <img
                        src={formData.profilePictureUrl}
                        alt="Profile"
                        className="h-full w-full rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-violet-500">
                        <span className="text-xl font-semibold text-white">
                          {formData.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      label="Profile Picture URL"
                      type="url"
                      name="profilePictureUrl"
                      value={formData.profilePictureUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/your-photo.jpg"
                      helperText="Enter a URL to your profile picture"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card variant="glass" className="animate-element animate-delay-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-400">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    className="glass-input w-full resize-none rounded-2xl bg-transparent px-4 py-4 text-zinc-100 placeholder-zinc-500"
                    rows={4}
                    maxLength={500}
                  />
                  <div className="mt-2 flex justify-between">
                    <p className="text-sm text-zinc-500">
                      Brief description of yourself and your interests
                    </p>
                    <p className="text-sm text-zinc-500">
                      {formData.bio.length}/500
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card variant="glass" className="animate-element animate-delay-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-400">
                      GitHub
                    </label>
                    <div className="glass-input flex items-center rounded-2xl">
                      <Github className="mr-3 ml-4 h-5 w-5 text-zinc-400" />
                      <input
                        type="url"
                        value={formData.socialLinks.github}
                        onChange={(e) =>
                          handleSocialLinkChange("github", e.target.value)
                        }
                        placeholder="https://github.com/yourusername"
                        className="flex-1 bg-transparent py-4 text-zinc-100 placeholder-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-400">
                      LinkedIn
                    </label>
                    <div className="glass-input flex items-center rounded-2xl">
                      <Linkedin className="mr-3 ml-4 h-5 w-5 text-zinc-400" />
                      <input
                        type="url"
                        value={formData.socialLinks.linkedin}
                        onChange={(e) =>
                          handleSocialLinkChange("linkedin", e.target.value)
                        }
                        placeholder="https://linkedin.com/in/yourusername"
                        className="flex-1 bg-transparent py-4 text-zinc-100 placeholder-zinc-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-400">
                      Website
                    </label>
                    <div className="glass-input flex items-center rounded-2xl">
                      <Globe className="mr-3 ml-4 h-5 w-5 text-zinc-400" />
                      <input
                        type="url"
                        value={formData.socialLinks.website}
                        onChange={(e) =>
                          handleSocialLinkChange("website", e.target.value)
                        }
                        placeholder="https://yourwebsite.com"
                        className="flex-1 bg-transparent py-4 text-zinc-100 placeholder-zinc-500"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="animate-element animate-delay-300 flex items-center gap-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="group"
              >
                <Save className="mr-2 h-5 w-5" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}

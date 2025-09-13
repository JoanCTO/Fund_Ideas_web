"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, getUserSession, logoutUser } from "@/lib/api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const sessionResult = await getUserSession();

      console.log("Session result:", sessionResult);
      if (sessionResult.success && sessionResult.isAuthenticated) {
        const userResult = await getCurrentUser();
        if (userResult.success) {
          setUser(userResult.user);
          setProfile(userResult.profile);
          setIsAuthenticated(true);
        } else {
          clearAuth();
        }
      } else {
        clearAuth();
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const clearAuth = () => {
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
  };

  const login = (userData, profileData) => {
    setUser(userData);
    setProfile(profileData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      console.log("Logging out");
      await logoutUser();
      clearAuth();
      return { success: true };
    } catch (error) {
      console.error("Error logging out:", error);
      return { success: false, error: error.message };
    }
  };

  const updateProfile = (profileData) => {
    setProfile(profileData);
  };

  const value = {
    user,
    profile,
    loading,
    isAuthenticated,
    login,
    logout,
    updateProfile,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

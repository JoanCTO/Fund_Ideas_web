/**
 * Central API exports for the crowdfunding platform
 * This file provides a single entry point for all API functions
 */

// Authentication API
export * from "./auth.js";

// User Profile API
export * from "./users.js";

// Project Management API
export * from "./projects.js";

// Reward Tier API
export * from "./rewardTiers.js";

// Backing API
export * from "./backings.js";

// Milestone API
export * from "./milestones.js";

// Storage API
export * from "./storage.js";

// Database setup utility
export { setupDatabase } from "../database-setup.js";

// Validation utilities
export * from "../validation.js";

// Error handling utilities
export * from "../errorHandler.js";

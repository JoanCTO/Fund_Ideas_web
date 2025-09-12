import {
  databases,
  storage,
  DATABASE_ID,
  USERS_COLLECTION_ID,
  PROJECTS_COLLECTION_ID,
  REWARD_TIERS_COLLECTION_ID,
  BACKINGS_COLLECTION_ID,
  MILESTONES_COLLECTION_ID,
  PROJECT_IMAGES_BUCKET_ID,
  PROFILE_PICTURES_BUCKET_ID,
  MILESTONE_EVIDENCE_BUCKET_ID,
  Permission,
  Role,
} from "./appwrite.js";

/**
 * Database setup utility for creating collections and storage buckets
 * Run this once to set up the database schema
 */

export async function setupDatabase() {
  try {
    console.log("Setting up database collections and storage buckets...");

    // Create storage buckets first
    await setupStorageBuckets();

    // Create collections
    await setupUsersCollection();
    await setupProjectsCollection();
    await setupRewardTiersCollection();
    await setupBackingsCollection();
    await setupMilestonesCollection();

    console.log("Database setup completed successfully!");
    return { success: true };
  } catch (error) {
    console.error("Database setup failed:", error);
    return { success: false, error: error.message };
  }
}

async function setupStorageBuckets() {
  try {
    // Create project images bucket
    await storage.createBucket(
      PROJECT_IMAGES_BUCKET_ID,
      "Project Images",
      ["jpg", "jpeg", "png", "gif", "webp"],
      10 * 1024 * 1024, // 10MB
      true, // fileSecurity
      false, // enabled
      false, // encryption
    );
    console.log("Created project images bucket");
  } catch (error) {
    if (error.code !== 409) {
      // Bucket already exists
      throw error;
    }
  }

  try {
    // Create profile pictures bucket
    await storage.createBucket(
      PROFILE_PICTURES_BUCKET_ID,
      "Profile Pictures",
      ["jpg", "jpeg", "png", "gif", "webp"],
      5 * 1024 * 1024, // 5MB
      true, // fileSecurity
      false, // enabled
      false, // encryption
    );
    console.log("Created profile pictures bucket");
  } catch (error) {
    if (error.code !== 409) {
      // Bucket already exists
      throw error;
    }
  }

  try {
    // Create milestone evidence bucket
    await storage.createBucket(
      MILESTONE_EVIDENCE_BUCKET_ID,
      "Milestone Evidence",
      ["jpg", "jpeg", "png", "gif", "webp", "pdf", "mp4", "mov"],
      50 * 1024 * 1024, // 50MB
      true, // fileSecurity
      false, // enabled
      false, // encryption
    );
    console.log("Created milestone evidence bucket");
  } catch (error) {
    if (error.code !== 409) {
      // Bucket already exists
      throw error;
    }
  }
}

async function setupUsersCollection() {
  try {
    await databases.createCollection(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "Users",
      [
        // User ID (string, required) - Appwrite Auth user ID
        {
          key: "userId",
          type: "string",
          size: 255,
          required: true,
          array: false,
          default: null,
        },
        // Username (string, required, unique) - URL-friendly username
        {
          key: "username",
          type: "string",
          size: 50,
          required: true,
          array: false,
          default: null,
        },
        // Full name (string, required, max 100 chars)
        {
          key: "fullName",
          type: "string",
          size: 100,
          required: true,
          array: false,
          default: null,
        },
        // Email (email, required, unique) - from Appwrite Auth
        {
          key: "email",
          type: "string",
          size: 255,
          required: true,
          array: false,
          default: null,
        },
        // User type (enum: creator, backer, required)
        {
          key: "userType",
          type: "enum",
          elements: ["creator", "backer"],
          required: true,
          array: false,
          default: "backer",
        },
        // Bio (text, optional, max 500 chars)
        {
          key: "bio",
          type: "string",
          size: 500,
          required: false,
          array: false,
          default: null,
        },
        // Profile picture URL (url, optional)
        {
          key: "profilePictureUrl",
          type: "string",
          size: 500,
          required: false,
          array: false,
          default: null,
        },
        // Social links (JSON object: {github, linkedin, website})
        {
          key: "socialLinks",
          type: "string",
          size: 1000,
          required: false,
          array: false,
          default: "{}",
        },
        // Is verified (boolean, default false)
        {
          key: "isVerified",
          type: "boolean",
          required: false,
          array: false,
          default: false,
        },
        // Is active (boolean, default true)
        {
          key: "isActive",
          type: "boolean",
          required: false,
          array: false,
          default: true,
        },
      ],
      [
        // Read: authenticated users can read public profile data
        Permission.read(Role.users()),
        // Write: users can only update their own profile
        Permission.update(Role.users()),
        // Create: public (handled by registration flow)
        Permission.create(Role.any()),
        // Delete: admin only or user self-deletion
        Permission.delete(Role.users()),
      ],
    );

    // Create indexes for Users collection
    await databases.createIndex(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "username_index",
      "key",
      ["username"],
      ["ASC"],
      ["unique"],
    );

    await databases.createIndex(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "email_index",
      "key",
      ["email"],
      ["ASC"],
      ["unique"],
    );

    await databases.createIndex(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "user_type_index",
      "key",
      ["userType"],
      ["ASC"],
    );

    await databases.createIndex(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "created_at_index",
      "key",
      ["$createdAt"],
      ["ASC"],
    );

    console.log("Created users collection with indexes");
  } catch (error) {
    if (error.code !== 409) {
      // Collection already exists
      throw error;
    }
  }
}

async function setupProjectsCollection() {
  try {
    await databases.createCollection(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "Projects",
      [
        // Creator ID (string, required) - foreign key to users
        {
          key: "creatorId",
          type: "string",
          size: 255,
          required: true,
          array: false,
          default: null,
        },
        // Title (string, required, max 80 chars)
        {
          key: "title",
          type: "string",
          size: 80,
          required: true,
          array: false,
          default: null,
        },
        // Short description (string, required, max 120 chars)
        {
          key: "shortDescription",
          type: "string",
          size: 120,
          required: true,
          array: false,
          default: null,
        },
        // Full description (text, required, max 5000 chars)
        {
          key: "fullDescription",
          type: "string",
          size: 5000,
          required: true,
          array: false,
          default: null,
        },
        // Category (enum: web_app, mobile_app, desktop, dev_tools, saas, course, api, other)
        {
          key: "category",
          type: "enum",
          elements: [
            "web_app",
            "mobile_app",
            "desktop",
            "dev_tools",
            "saas",
            "course",
            "api",
            "other",
          ],
          required: true,
          array: false,
          default: "other",
        },
        // Funding goal (integer, required) - amount in cents
        {
          key: "fundingGoal",
          type: "integer",
          required: true,
          array: false,
          default: null,
        },
        // Current funding (integer, default 0) - amount in cents
        {
          key: "currentFunding",
          type: "integer",
          required: false,
          array: false,
          default: 0,
        },
        // Currency (string, default "USD")
        {
          key: "currency",
          type: "string",
          size: 3,
          required: false,
          array: false,
          default: "USD",
        },
        // Funding duration (integer, required) - days
        {
          key: "fundingDuration",
          type: "integer",
          required: true,
          array: false,
          default: null,
        },
        // Project status (enum: draft, live, funded, completed, cancelled)
        {
          key: "projectStatus",
          type: "enum",
          elements: ["draft", "live", "funded", "completed", "cancelled"],
          required: false,
          array: false,
          default: "draft",
        },
        // Main image URL (url, required)
        {
          key: "mainImageUrl",
          type: "string",
          size: 500,
          required: true,
          array: false,
          default: null,
        },
        // Additional images (array of URLs, max 5)
        {
          key: "additionalImages",
          type: "string",
          size: 500,
          required: false,
          array: true,
          default: null,
        },
        // Video URL (url, optional)
        {
          key: "videoUrl",
          type: "string",
          size: 500,
          required: false,
          array: false,
          default: null,
        },
        // Development stage (enum: concept, development)
        {
          key: "developmentStage",
          type: "enum",
          elements: ["concept", "development"],
          required: false,
          array: false,
          default: "concept",
        },
        // Backer count (integer, default 0)
        {
          key: "backerCount",
          type: "integer",
          required: false,
          array: false,
          default: 0,
        },
        // Published at (datetime, nullable)
        {
          key: "publishedAt",
          type: "datetime",
          required: false,
          array: false,
          default: null,
        },
        // Deadline (datetime, calculated)
        {
          key: "deadline",
          type: "datetime",
          required: false,
          array: false,
          default: null,
        },
        // Completed at (datetime, nullable)
        {
          key: "completedAt",
          type: "datetime",
          required: false,
          array: false,
          default: null,
        },
      ],
      [
        // Read: public for live projects, private for drafts
        Permission.read(Role.any()),
        // Write: creator can update their projects
        Permission.update(Role.users()),
        // Create: authenticated users can create projects
        Permission.create(Role.users()),
        // Delete: creator can delete their projects
        Permission.delete(Role.users()),
      ],
    );

    // Create indexes for Projects collection
    await databases.createIndex(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "creator_id_index",
      "key",
      ["creatorId"],
      ["ASC"],
    );

    await databases.createIndex(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "category_index",
      "key",
      ["category"],
      ["ASC"],
    );

    await databases.createIndex(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "project_status_index",
      "key",
      ["projectStatus"],
      ["ASC"],
    );

    await databases.createIndex(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "published_at_index",
      "key",
      ["publishedAt"],
      ["ASC"],
    );

    await databases.createIndex(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "status_published_index",
      "key",
      ["projectStatus", "publishedAt"],
      ["ASC", "ASC"],
    );

    console.log("Created projects collection with indexes");
  } catch (error) {
    if (error.code !== 409) {
      // Collection already exists
      throw error;
    }
  }
}

async function setupRewardTiersCollection() {
  try {
    await databases.createCollection(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      "Reward Tiers",
      [
        // Project ID (string, required) - foreign key to projects
        {
          key: "projectId",
          type: "string",
          size: 255,
          required: true,
          array: false,
          default: null,
        },
        // Tier title (string, required, max 50 chars)
        {
          key: "tierTitle",
          type: "string",
          size: 50,
          required: true,
          array: false,
          default: null,
        },
        // Tier description (text, required, max 500 chars)
        {
          key: "tierDescription",
          type: "string",
          size: 500,
          required: true,
          array: false,
          default: null,
        },
        // Pledge amount (integer, required) - amount in cents
        {
          key: "pledgeAmount",
          type: "integer",
          required: true,
          array: false,
          default: null,
        },
        // Estimated delivery (date, required)
        {
          key: "estimatedDelivery",
          type: "datetime",
          required: true,
          array: false,
          default: null,
        },
        // Is limited (boolean, default false)
        {
          key: "isLimited",
          type: "boolean",
          required: false,
          array: false,
          default: false,
        },
        // Quantity limit (integer, nullable)
        {
          key: "quantityLimit",
          type: "integer",
          required: false,
          array: false,
          default: null,
        },
        // Claimed count (integer, default 0)
        {
          key: "claimedCount",
          type: "integer",
          required: false,
          array: false,
          default: 0,
        },
        // Is digital (boolean, default false)
        {
          key: "isDigital",
          type: "boolean",
          required: false,
          array: false,
          default: false,
        },
        // Tier order (integer, required) - for sorting
        {
          key: "tierOrder",
          type: "integer",
          required: true,
          array: false,
          default: null,
        },
      ],
      [
        // Read: public for live projects
        Permission.read(Role.any()),
        // Write: project creator can update tiers
        Permission.update(Role.users()),
        // Create: project creator can create tiers
        Permission.create(Role.users()),
        // Delete: project creator can delete tiers
        Permission.delete(Role.users()),
      ],
    );

    // Create indexes for Reward Tiers collection
    await databases.createIndex(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      "project_id_index",
      "key",
      ["projectId"],
      ["ASC"],
    );

    await databases.createIndex(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      "tier_order_index",
      "key",
      ["tierOrder"],
      ["ASC"],
    );

    await databases.createIndex(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      "project_tier_order_index",
      "key",
      ["projectId", "tierOrder"],
      ["ASC", "ASC"],
    );

    console.log("Created reward tiers collection with indexes");
  } catch (error) {
    if (error.code !== 409) {
      // Collection already exists
      throw error;
    }
  }
}

async function setupBackingsCollection() {
  try {
    await databases.createCollection(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "Backings",
      [
        // Project ID (string, required) - foreign key to projects
        {
          key: "projectId",
          type: "string",
          size: 255,
          required: true,
          array: false,
          default: null,
        },
        // Backer ID (string, required) - foreign key to users
        {
          key: "backerId",
          type: "string",
          size: 255,
          required: true,
          array: false,
          default: null,
        },
        // Reward tier ID (string, nullable) - foreign key to reward tiers
        {
          key: "rewardTierId",
          type: "string",
          size: 255,
          required: false,
          array: false,
          default: null,
        },
        // Pledge amount (integer, required) - amount in cents
        {
          key: "pledgeAmount",
          type: "integer",
          required: true,
          array: false,
          default: null,
        },
        // Extra support (integer, default 0) - additional amount in cents
        {
          key: "extraSupport",
          type: "integer",
          required: false,
          array: false,
          default: 0,
        },
        // Total amount (integer, required) - total pledge in cents
        {
          key: "totalAmount",
          type: "integer",
          required: true,
          array: false,
          default: null,
        },
        // Backer name (string, required) - for display purposes
        {
          key: "backerName",
          type: "string",
          size: 100,
          required: true,
          array: false,
          default: null,
        },
        // Backer email (email, required) - for communications
        {
          key: "backerEmail",
          type: "string",
          size: 255,
          required: true,
          array: false,
          default: null,
        },
        // Shipping address (JSON object, nullable) - for physical rewards
        {
          key: "shippingAddress",
          type: "string",
          size: 1000,
          required: false,
          array: false,
          default: null,
        },
        // Special instructions (text, optional, max 500 chars)
        {
          key: "specialInstructions",
          type: "string",
          size: 500,
          required: false,
          array: false,
          default: null,
        },
        // Backing status (enum: pending, confirmed, fulfilled, cancelled)
        {
          key: "backingStatus",
          type: "enum",
          elements: ["pending", "confirmed", "fulfilled", "cancelled"],
          required: false,
          array: false,
          default: "pending",
        },
        // Is anonymous (boolean, default false)
        {
          key: "isAnonymous",
          type: "boolean",
          required: false,
          array: false,
          default: false,
        },
      ],
      [
        // Read: backer can read their own backings, creator can read project backings
        Permission.read(Role.users()),
        // Write: backer can update their backings
        Permission.update(Role.users()),
        // Create: authenticated users can create backings
        Permission.create(Role.users()),
        // Delete: backer can delete their backings
        Permission.delete(Role.users()),
      ],
    );

    // Create indexes for Backings collection
    await databases.createIndex(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "project_id_index",
      "key",
      ["projectId"],
      ["ASC"],
    );

    await databases.createIndex(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "backer_id_index",
      "key",
      ["backerId"],
      ["ASC"],
    );

    await databases.createIndex(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "backing_status_index",
      "key",
      ["backingStatus"],
      ["ASC"],
    );

    await databases.createIndex(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "project_backed_at_index",
      "key",
      ["projectId", "$createdAt"],
      ["ASC", "ASC"],
    );

    console.log("Created backings collection with indexes");
  } catch (error) {
    if (error.code !== 409) {
      // Collection already exists
      throw error;
    }
  }
}

async function setupMilestonesCollection() {
  try {
    await databases.createCollection(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "Milestones",
      [
        // Project ID (string, required) - foreign key to projects
        {
          key: "projectId",
          type: "string",
          size: 255,
          required: true,
          array: false,
          default: null,
        },
        // Milestone title (string, required, max 100 chars)
        {
          key: "milestoneTitle",
          type: "string",
          size: 100,
          required: true,
          array: false,
          default: null,
        },
        // Milestone description (text, required, max 1000 chars)
        {
          key: "milestoneDescription",
          type: "string",
          size: 1000,
          required: true,
          array: false,
          default: null,
        },
        // Milestone order (integer, required) - for sequencing
        {
          key: "milestoneOrder",
          type: "integer",
          required: true,
          array: false,
          default: null,
        },
        // Target date (date, required)
        {
          key: "targetDate",
          type: "datetime",
          required: true,
          array: false,
          default: null,
        },
        // Completion date (date, nullable)
        {
          key: "completionDate",
          type: "datetime",
          required: false,
          array: false,
          default: null,
        },
        // Funding percentage (integer, required) - percentage of total funding
        {
          key: "fundingPercentage",
          type: "integer",
          required: true,
          array: false,
          default: null,
        },
        // Deliverables (JSON array, required) - list of deliverable items
        {
          key: "deliverables",
          type: "string",
          size: 2000,
          required: true,
          array: false,
          default: "[]",
        },
        // Success criteria (text, required, max 500 chars)
        {
          key: "successCriteria",
          type: "string",
          size: 500,
          required: true,
          array: false,
          default: null,
        },
        // Milestone status (enum: pending, in_progress, review, completed, overdue)
        {
          key: "milestoneStatus",
          type: "enum",
          elements: [
            "pending",
            "in_progress",
            "review",
            "completed",
            "overdue",
          ],
          required: false,
          array: false,
          default: "pending",
        },
        // Completion evidence (text, nullable) - links and proof of completion
        {
          key: "completionEvidence",
          type: "string",
          size: 1000,
          required: false,
          array: false,
          default: null,
        },
        // Backer feedback score (float, nullable) - average rating from backers
        {
          key: "backerFeedbackScore",
          type: "double",
          required: false,
          array: false,
          default: null,
        },
      ],
      [
        // Read: public for live projects
        Permission.read(Role.any()),
        // Write: project creator can update milestones
        Permission.update(Role.users()),
        // Create: project creator can create milestones
        Permission.create(Role.users()),
        // Delete: project creator can delete milestones
        Permission.delete(Role.users()),
      ],
    );

    // Create indexes for Milestones collection
    await databases.createIndex(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "project_id_index",
      "key",
      ["projectId"],
      ["ASC"],
    );

    await databases.createIndex(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "milestone_order_index",
      "key",
      ["milestoneOrder"],
      ["ASC"],
    );

    await databases.createIndex(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "milestone_status_index",
      "key",
      ["milestoneStatus"],
      ["ASC"],
    );

    await databases.createIndex(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "target_date_index",
      "key",
      ["targetDate"],
      ["ASC"],
    );

    console.log("Created milestones collection with indexes");
  } catch (error) {
    if (error.code !== 409) {
      // Collection already exists
      throw error;
    }
  }
}

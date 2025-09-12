#!/usr/bin/env node

/**
 * Database Setup Script using Appwrite Server SDK
 * This script creates all necessary collections and storage buckets for the crowdfunding platform
 */

const {
  Client,
  Databases,
  Storage,
  ID,
  Permission,
  Role,
  IndexType,
} = require("node-appwrite");
require("dotenv").config({ path: ".env.local" });

// Initialize Appwrite Server Client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.NEXT_PUBLIC_APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

// Database and Collection IDs
const DATABASE_ID = "68c31270000cb406e7b2";
const USERS_COLLECTION_ID = "users";
const PROJECTS_COLLECTION_ID = "projects";
const REWARD_TIERS_COLLECTION_ID = "reward_tiers";
const BACKINGS_COLLECTION_ID = "backings";
const MILESTONES_COLLECTION_ID = "milestones";

// Storage Bucket IDs
const PROJECT_IMAGES_BUCKET_ID = "project_images";
const PROFILE_PICTURES_BUCKET_ID = "profile_pictures";
const MILESTONE_EVIDENCE_BUCKET_ID = "milestone_evidence";

/**
 * Main setup function
 */
async function setupDatabase() {
  try {
    console.log("🚀 Starting database setup with Appwrite Server SDK...");
    console.log(`📊 Database ID: ${DATABASE_ID}`);
    console.log(`🔗 Endpoint: ${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}`);
    console.log(
      `🆔 Project ID: ${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
    );
    console.log("");

    // Create collections and their attributes
    // await setupUsersCollection();
    // await setupProjectsCollection();
    await setupRewardTiersCollection();
    await setupBackingsCollection();
    await setupMilestonesCollection();

    console.log("");
    console.log("✅ Database setup completed successfully!");
    console.log("🎉 Your crowdfunding platform is ready to use!");

    return { success: true };
  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    console.error("Stack trace:", error.stack);
    return { success: false, error: error.message };
  }
}

/**
 * Create database
 */
async function createDatabase() {
  console.log("🗄️ Setting up database...");

  try {
    await databases.create(
      DATABASE_ID,
      "Crowdfunding MVP Database",
      true, // enabled
    );
    console.log("   ✅ Created database");
  } catch (error) {
    if (error.code !== 409) {
      // Database already exists
      throw error;
    }
    console.log("   ⚠️  Database already exists");
  }
}

/**
 * Create storage buckets
 */
async function setupStorageBuckets() {
  console.log("📁 Setting up storage buckets...");

  try {
    // Create project images bucket
    await storage.createBucket(
      PROJECT_IMAGES_BUCKET_ID, // bucketId
      "Project Images", // name
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ], // permissions
      true, // fileSecurity
      true, // enabled
      10 * 1024 * 1024, // maximumFileSize (10MB)
      ["jpg", "jpeg", "png", "gif", "webp"], // allowedFileExtensions
      "gzip", // compression
      false, // encryption
      true, // antivirus
    );
    console.log("   ✅ Created project images bucket");
  } catch (error) {
    if (error.code !== 409) {
      // Bucket already exists
      throw error;
    }
    console.log("   ⚠️  Project images bucket already exists");
  }

  try {
    // Create profile pictures bucket
    await storage.createBucket(
      PROFILE_PICTURES_BUCKET_ID, // bucketId
      "Profile Pictures", // name
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ], // permissions
      true, // fileSecurity
      true, // enabled
      5 * 1024 * 1024, // maximumFileSize (5MB)
      ["jpg", "jpeg", "png", "gif", "webp"], // allowedFileExtensions
      "gzip", // compression
      false, // encryption
      true, // antivirus
    );
    console.log("   ✅ Created profile pictures bucket");
  } catch (error) {
    if (error.code !== 409) {
      // Bucket already exists
      throw error;
    }
    console.log("   ⚠️  Profile pictures bucket already exists");
  }

  try {
    // Create milestone evidence bucket
    await storage.createBucket(
      MILESTONE_EVIDENCE_BUCKET_ID, // bucketId
      "Milestone Evidence", // name
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ], // permissions
      true, // fileSecurity
      true, // enabled
      30 * 1024 * 1024, // maximumFileSize (30MB - max allowed)
      ["jpg", "jpeg", "png", "gif", "webp", "pdf", "mp4", "mov"], // allowedFileExtensions
      "gzip", // compression
      false, // encryption
      true, // antivirus
    );
    console.log("   ✅ Created milestone evidence bucket");
  } catch (error) {
    if (error.code !== 409) {
      // Bucket already exists
      throw error;
    }
    console.log("   ⚠️  Milestone evidence bucket already exists");
  }
}

/**
 * Create Users collection
 */
async function setupUsersCollection() {
  console.log("👥 Setting up Users collection...");

  try {
    // Create collection first
    await databases.createCollection(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "Users",
      [
        Permission.read(Role.users()),
        Permission.create(Role.any()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
      false, // documentSecurity
      true, // enabled
    );

    // Add attributes
    await databases.createStringAttribute(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "userId",
      255,
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "username",
      50,
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "fullName",
      100,
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "email",
      255,
      true,
    );

    await databases.createEnumAttribute(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "userType",
      ["creator", "backer"],
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "bio",
      500,
      false,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "profilePictureUrl",
      500,
      false,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "socialLinks",
      1000,
      false,
      "{}",
    );

    await databases.createBooleanAttribute(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "isVerified",
      false,
      false,
    );

    await databases.createBooleanAttribute(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "isActive",
      false,
      true,
    );

    // Create indexes
    await databases.createIndex(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "username_index",
      IndexType.Unique,
      ["username"],
    );

    await databases.createIndex(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "email_index",
      IndexType.Unique,
      ["email"],
    );

    await databases.createIndex(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      "user_type_index",
      IndexType.Key,
      ["userType"],
    );

    console.log("   ✅ Created users collection with attributes and indexes");
  } catch (error) {
    if (error.code !== 409) {
      // Collection already exists
      throw error;
    }
    console.log("   ⚠️  Users collection already exists");
  }
}

/**
 * Create Projects collection
 */
async function setupProjectsCollection() {
  console.log("🚀 Setting up Projects collection...");

  try {
    // Create collection
    await databases.createCollection(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "Projects",
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
      false, // documentSecurity
      true, // enabled
    );

    // Add attributes
    await databases.createStringAttribute(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "creatorId",
      255,
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "title",
      80,
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "shortDescription",
      120,
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "fullDescription",
      5000,
      true,
    );

    await databases.createEnumAttribute(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "category",
      [
        "web_app",
        "mobile_app",
        "desktop",
        "dev_tools",
        "saas",
        "course",
        "api",
        "other",
      ],
      true,
    );

    await databases.createIntegerAttribute(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "fundingGoal",
      true,
    );

    await databases.createIntegerAttribute(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "currentFunding",
      false,
      undefined,
      undefined,
      0,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "currency",
      3,
      false,
      "USD",
    );

    await databases.createIntegerAttribute(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "fundingDuration",
      true,
    );

    await databases.createEnumAttribute(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "projectStatus",
      ["draft", "live", "funded", "completed", "cancelled"],
      false,
      "draft",
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "mainImageUrl",
      500,
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "additionalImages",
      500,
      false,
      undefined,
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "videoUrl",
      500,
      false,
    );

    await databases.createEnumAttribute(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "developmentStage",
      ["concept", "development"],
      false,
      "concept",
    );

    await databases.createIntegerAttribute(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "backerCount",
      false,
      undefined,
      undefined,
      0,
    );

    await databases.createDatetimeAttribute(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "publishedAt",
      false,
    );

    await databases.createDatetimeAttribute(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "deadline",
      false,
    );

    await databases.createDatetimeAttribute(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "completedAt",
      false,
    );

    // Create indexes
    await databases.createIndex(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "creator_id_index",
      IndexType.Key,
      ["creatorId"],
    );

    await databases.createIndex(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "category_index",
      IndexType.Key,
      ["category"],
    );

    await databases.createIndex(
      DATABASE_ID,
      PROJECTS_COLLECTION_ID,
      "project_status_index",
      IndexType.Key,
      ["projectStatus"],
    );

    console.log(
      "   ✅ Created projects collection with attributes and indexes",
    );
  } catch (error) {
    if (error.code !== 409) {
      throw error;
    }
    console.log("   ⚠️  Projects collection already exists");
  }
}

/**
 * Create Reward Tiers collection
 */
async function setupRewardTiersCollection() {
  console.log("🎁 Setting up Reward Tiers collection...");

  try {
    // Create collection
    await databases.createCollection(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      "Reward Tiers",
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
      false, // documentSecurity
      true, // enabled
    );

    // Add attributes
    await databases.createStringAttribute(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      "projectId",
      255,
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      "tierTitle",
      50,
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      "tierDescription",
      500,
      true,
    );

    await databases.createIntegerAttribute(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      "pledgeAmount",
      true,
    );

    await databases.createDatetimeAttribute(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      "estimatedDelivery",
      true,
    );

    await databases.createBooleanAttribute(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      "isLimited",
      false,
      false,
    );

    await databases.createIntegerAttribute(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      "quantityLimit",
      false,
    );

    await databases.createIntegerAttribute(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      "claimedCount",
      false,
      undefined,
      undefined,
      0,
    );

    await databases.createBooleanAttribute(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      "isDigital",
      false,
      false,
    );

    await databases.createIntegerAttribute(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      "tierOrder",
      true,
    );

    // Create indexes
    await databases.createIndex(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      "project_id_index",
      IndexType.Key,
      ["projectId"],
    );

    await databases.createIndex(
      DATABASE_ID,
      REWARD_TIERS_COLLECTION_ID,
      "tier_order_index",
      IndexType.Key,
      ["tierOrder"],
    );

    console.log(
      "   ✅ Created reward tiers collection with attributes and indexes",
    );
  } catch (error) {
    if (error.code !== 409) {
      throw error;
    }
    console.log("   ⚠️  Reward tiers collection already exists");
  }
}

/**
 * Create Backings collection
 */
async function setupBackingsCollection() {
  console.log("💰 Setting up Backings collection...");

  try {
    // Create collection
    await databases.createCollection(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "Backings",
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
      false, // documentSecurity
      true, // enabled
    );

    // Add attributes
    await databases.createStringAttribute(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "projectId",
      255,
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "backerId",
      255,
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "rewardTierId",
      255,
      false,
    );

    await databases.createIntegerAttribute(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "pledgeAmount",
      true,
    );

    await databases.createIntegerAttribute(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "extraSupport",
      false,
      undefined,
      undefined,
      0,
    );

    await databases.createIntegerAttribute(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "totalAmount",
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "backerName",
      100,
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "backerEmail",
      255,
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "shippingAddress",
      1000,
      false,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "specialInstructions",
      500,
      false,
    );

    await databases.createEnumAttribute(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "backingStatus",
      ["pending", "confirmed", "fulfilled", "cancelled"],
      false,
      "pending",
    );

    await databases.createBooleanAttribute(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "isAnonymous",
      false,
      false,
    );

    // Create indexes
    await databases.createIndex(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "project_id_index",
      IndexType.Key,
      ["projectId"],
    );

    await databases.createIndex(
      DATABASE_ID,
      BACKINGS_COLLECTION_ID,
      "backer_id_index",
      IndexType.Key,
      ["backerId"],
    );

    console.log(
      "   ✅ Created backings collection with attributes and indexes",
    );
  } catch (error) {
    if (error.code !== 409) {
      throw error;
    }
    console.log("   ⚠️  Backings collection already exists");
  }
}

/**
 * Create Milestones collection
 */
async function setupMilestonesCollection() {
  console.log("🎯 Setting up Milestones collection...");

  try {
    // Create collection
    await databases.createCollection(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "Milestones",
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
      false, // documentSecurity
      true, // enabled
    );

    // Add attributes
    await databases.createStringAttribute(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "projectId",
      255,
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "milestoneTitle",
      100,
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "milestoneDescription",
      1000,
      true,
    );

    await databases.createIntegerAttribute(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "milestoneOrder",
      true,
    );

    await databases.createDatetimeAttribute(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "targetDate",
      true,
    );

    await databases.createDatetimeAttribute(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "completionDate",
      false,
    );

    await databases.createIntegerAttribute(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "fundingPercentage",
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "deliverables",
      5000,
      true,
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "successCriteria",
      500,
      true,
    );

    await databases.createEnumAttribute(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "milestoneStatus",
      ["pending", "in_progress", "review", "completed", "overdue"],
      false,
      "pending",
    );

    await databases.createStringAttribute(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "completionEvidence",
      1000,
      false,
    );

    await databases.createFloatAttribute(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "backerFeedbackScore",
      false,
    );

    // Create indexes
    await databases.createIndex(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "project_id_index",
      IndexType.Key,
      ["projectId"],
    );

    await databases.createIndex(
      DATABASE_ID,
      MILESTONES_COLLECTION_ID,
      "milestone_order_index",
      IndexType.Key,
      ["milestoneOrder"],
    );

    console.log(
      "   ✅ Created milestones collection with attributes and indexes",
    );
  } catch (error) {
    if (error.code !== 409) {
      throw error;
    }
    console.log("   ⚠️  Milestones collection already exists");
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then((result) => {
      if (result.success) {
        console.log("\n🎉 Setup completed successfully!");
        process.exit(0);
      } else {
        console.log("\n❌ Setup failed!");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("\n💥 Setup error:", error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };

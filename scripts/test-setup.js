#!/usr/bin/env node

/**
 * Test script to verify database setup
 * This script checks if all collections and buckets exist
 */

const { Client, Databases, Storage } = require("node-appwrite");
require("dotenv").config({ path: ".env.local" });

// Initialize Appwrite Server Client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.NEXT_PUBLIC_APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "crowdfunding_mvp";

const COLLECTIONS = [
  "users",
  "projects",
  "reward_tiers",
  "backings",
  "milestones",
];

const BUCKETS = ["project_images", "profile_pictures", "milestone_evidence"];

async function testSetup() {
  console.log("🧪 Testing database setup...\n");

  let allGood = true;

  // Test collections
  console.log("📊 Checking collections:");
  for (const collectionId of COLLECTIONS) {
    try {
      const collection = await databases.getCollection(
        DATABASE_ID,
        collectionId,
      );
      console.log(`   ✅ ${collectionId} - ${collection.name}`);
    } catch (error) {
      console.log(`   ❌ ${collectionId} - Not found`);
      allGood = false;
    }
  }

  console.log("\n📁 Checking storage buckets:");
  for (const bucketId of BUCKETS) {
    try {
      const bucket = await storage.getBucket(bucketId);
      console.log(`   ✅ ${bucketId} - ${bucket.name}`);
    } catch (error) {
      console.log(`   ❌ ${bucketId} - Not found`);
      allGood = false;
    }
  }

  console.log("\n" + "=".repeat(50));
  if (allGood) {
    console.log("🎉 All collections and buckets are properly set up!");
    console.log("✅ Your database is ready to use.");
  } else {
    console.log("❌ Some collections or buckets are missing.");
    console.log("💡 Run `npm run setup` to create them.");
  }

  return allGood;
}

// Run the test if this file is executed directly
if (require.main === module) {
  testSetup()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("💥 Test error:", error.message);
      process.exit(1);
    });
}

module.exports = { testSetup };

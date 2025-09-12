/**
 * Database setup script
 * Run this script to initialize the database with all collections and storage buckets
 */

import { setupDatabase } from "./database-setup.js";

/**
 * Main setup function
 */
async function main() {
  console.log("🚀 Starting database setup...");

  try {
    const result = await setupDatabase();

    if (result.success) {
      console.log("✅ Database setup completed successfully!");
      console.log("📊 Collections created:");
      console.log("   - users");
      console.log("   - projects");
      console.log("   - reward_tiers");
      console.log("   - backings");
      console.log("   - milestones");
      console.log("📁 Storage buckets created:");
      console.log("   - project_images");
      console.log("   - profile_pictures");
      console.log("   - milestone_evidence");
      console.log("");
      console.log("🎉 Your crowdfunding platform is ready to use!");
    } else {
      console.error("❌ Database setup failed:", result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Setup error:", error);
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as runSetup };

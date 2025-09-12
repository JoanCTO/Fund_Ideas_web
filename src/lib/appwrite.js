import {
  Client,
  Account,
  Databases,
  Storage,
  Query,
  ID,
  Permission,
  Role,
} from "appwrite";

// Client for client-side operations
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

// Server client with API key for server-side operations
const serverClient = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

// Client-side services
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Server-side services with API key
const serverDatabases = new Databases(serverClient);
const serverStorage = new Storage(serverClient);

// Database and Collection IDs
export const DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "crowdfunding_mvp";
export const USERS_COLLECTION_ID = "users";
export const PROJECTS_COLLECTION_ID = "projects";
export const REWARD_TIERS_COLLECTION_ID = "reward_tiers";
export const BACKINGS_COLLECTION_ID = "backings";
export const MILESTONES_COLLECTION_ID = "milestones";

// Storage Bucket IDs
export const PROJECT_IMAGES_BUCKET_ID = "project_images";
export const PROFILE_PICTURES_BUCKET_ID = "profile_pictures";
export const MILESTONE_EVIDENCE_BUCKET_ID = "milestone_evidence";

export {
  client,
  serverClient,
  account,
  databases,
  storage,
  serverDatabases,
  serverStorage,
  Query,
  ID,
  Permission,
  Role,
};

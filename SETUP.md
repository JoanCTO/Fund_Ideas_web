# Database Setup Guide

This guide will help you set up the database for your crowdfunding platform using Appwrite's Server SDK.

## Prerequisites

1. **Appwrite Project**: You need an active Appwrite project
2. **API Key**: Generate an API key with full permissions from the Appwrite Console
3. **Node.js**: Ensure Node.js is installed on your system

## Environment Setup

1. **Create Environment File**: Copy `.env.example` to `.env.local` and fill in your values:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=crowdfunding_mvp
NEXT_PUBLIC_APPWRITE_API_KEY=your_api_key_with_full_permissions_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

2. **Get Your Project ID**:

   - Go to [Appwrite Console](https://cloud.appwrite.io/console)
   - Select your project
   - Copy the Project ID from the overview page

3. **Generate API Key**:
   - In the Appwrite Console, go to **Settings** → **API Keys**
   - Click **Create API Key**
   - Give it a name (e.g., "Database Setup")
   - Select **Full Access** for permissions
   - Copy the generated API key

## Installation

Install the required dependencies:

```bash
npm install
```

## Database Setup

Run the database setup script:

```bash
npm run setup
```

Or alternatively:

```bash
npm run setup:db
```

## What the Setup Script Does

The setup script will create:

### 📊 **Database Collections**

- **Users** - User profiles and authentication data
- **Projects** - Project information and funding data
- **Reward Tiers** - Reward tier information for projects
- **Backings** - User backing/investment data
- **Milestones** - Project milestone tracking

### 📁 **Storage Buckets**

- **Project Images** - For project media (10MB limit)
- **Profile Pictures** - For user avatars (5MB limit)
- **Milestone Evidence** - For milestone completion proof (50MB limit)

### 🔍 **Database Indexes**

- Optimized indexes for fast queries
- Unique constraints for data integrity
- Compound indexes for complex queries

### 🔐 **Permissions**

- Proper access control for each collection
- Public read access for live projects
- User-specific write permissions
- Secure data access patterns

## Expected Output

When you run the setup script, you should see:

```
🚀 Starting database setup with Appwrite Server SDK...
📊 Database ID: crowdfunding_mvp
🔗 Endpoint: https://cloud.appwrite.io/v1
🆔 Project ID: your_project_id

📁 Setting up storage buckets...
   ✅ Created project images bucket
   ✅ Created profile pictures bucket
   ✅ Created milestone evidence bucket

👥 Setting up Users collection...
   ✅ Created users collection with indexes

🚀 Setting up Projects collection...
   ✅ Created projects collection with indexes

🎁 Setting up Reward Tiers collection...
   ✅ Created reward tiers collection with indexes

💰 Setting up Backings collection...
   ✅ Created backings collection with indexes

🎯 Setting up Milestones collection...
   ✅ Created milestones collection with indexes

✅ Database setup completed successfully!
🎉 Your crowdfunding platform is ready to use!
```

## Troubleshooting

### Common Issues

1. **"Collection already exists" warnings**:

   - These are normal if you've run the setup before
   - The script will skip existing collections

2. **API Key permissions error**:

   - Ensure your API key has **Full Access** permissions
   - Regenerate the API key if needed

3. **Project ID not found**:

   - Verify your Project ID is correct
   - Ensure the project exists in your Appwrite Console

4. **Network connection issues**:
   - Check your internet connection
   - Verify the Appwrite endpoint URL is correct

### Verification

After setup, verify in the Appwrite Console:

1. Go to **Databases** → **crowdfunding_mvp**
2. Check that all 5 collections are created
3. Go to **Storage** and verify the 3 buckets are created
4. Check that indexes are properly configured

## Next Steps

Once the database is set up:

1. **Start Development**: Run `npm run dev`
2. **Test API Functions**: Use the API functions in your components
3. **Create Test Data**: Add some sample projects and users
4. **Build Features**: Implement your crowdfunding platform features

## Support

If you encounter issues:

1. Check the [Appwrite Documentation](https://appwrite.io/docs)
2. Verify your environment variables
3. Ensure your API key has proper permissions
4. Check the console output for specific error messages

Happy coding! 🚀

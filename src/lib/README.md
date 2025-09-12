# Data Architecture Implementation

This directory contains the complete data architecture implementation for the crowdfunding platform MVP, including database setup, API functions, validation, and error handling.

## 📁 Directory Structure

```
src/lib/
├── api/                    # API functions organized by feature
│   ├── auth.js            # Authentication API functions
│   ├── users.js           # User profile API functions
│   ├── projects.js        # Project management API functions
│   ├── rewardTiers.js     # Reward tier API functions
│   ├── backings.js        # Backing API functions
│   ├── milestones.js      # Milestone API functions
│   ├── storage.js         # File upload and storage API functions
│   └── index.js           # Central API exports
├── appwrite.js            # Appwrite configuration and clients
├── database-setup.js      # Database schema and collection setup
├── setup.js               # Database initialization script
├── validation.js          # Data validation utilities
├── errorHandler.js        # Error handling and response utilities
└── utils.js               # General utility functions
```

## 🚀 Quick Start

### 1. Environment Setup

Ensure your `.env.local` file contains the required Appwrite configuration:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=crowdfunding_mvp
NEXT_PUBLIC_APPWRITE_API_KEY=your_api_key_with_full_permissions
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Database Initialization

Run the database setup script to create all collections and storage buckets:

```javascript
import { runSetup } from "./src/lib/setup.js";

// Run the setup
await runSetup();
```

Or run it directly:

```bash
node src/lib/setup.js
```

### 3. Using the API

Import and use the API functions in your components:

```javascript
import {
  createUserAccount,
  createProject,
  getProjects,
  validateEmail,
} from "./src/lib/api";

// Create a new user
const userResult = await createUserAccount(
  "user@example.com",
  "password123",
  "John Doe",
  "johndoe",
  "creator",
);

// Create a project
const projectResult = await createProject({
  creatorId: userResult.data.user.$id,
  title: "My Awesome Project",
  shortDescription: "A brief description",
  fullDescription: "Detailed project description...",
  category: "web_app",
  fundingGoal: 10000, // $100.00 in cents
  fundingDuration: 30, // 30 days
  mainImageUrl: "https://example.com/image.jpg",
});

// Get projects
const projectsResult = await getProjects({
  category: "web_app",
  status: "live",
});
```

## 📊 Database Schema

### Collections

#### Users Collection

- **Purpose**: Store user profiles and authentication data
- **Key Fields**: `userId`, `username`, `fullName`, `email`, `userType`, `bio`, `profilePictureUrl`
- **Indexes**: username, email, userType, createdAt

#### Projects Collection

- **Purpose**: Store project information and funding data
- **Key Fields**: `creatorId`, `title`, `shortDescription`, `fullDescription`, `category`, `fundingGoal`, `currentFunding`
- **Indexes**: creatorId, category, projectStatus, publishedAt

#### Reward Tiers Collection

- **Purpose**: Store reward tier information for projects
- **Key Fields**: `projectId`, `tierTitle`, `tierDescription`, `pledgeAmount`, `estimatedDelivery`
- **Indexes**: projectId, tierOrder

#### Backings Collection

- **Purpose**: Store user backing information
- **Key Fields**: `projectId`, `backerId`, `rewardTierId`, `pledgeAmount`, `totalAmount`
- **Indexes**: projectId, backerId, backingStatus

#### Milestones Collection

- **Purpose**: Store project milestone information
- **Key Fields**: `projectId`, `milestoneTitle`, `milestoneDescription`, `targetDate`, `completionDate`
- **Indexes**: projectId, milestoneOrder, milestoneStatus

### Storage Buckets

#### Project Images

- **Purpose**: Store project images and media
- **File Types**: jpg, jpeg, png, gif, webp
- **Size Limit**: 10MB

#### Profile Pictures

- **Purpose**: Store user profile pictures
- **File Types**: jpg, jpeg, png, gif, webp
- **Size Limit**: 5MB

#### Milestone Evidence

- **Purpose**: Store milestone completion evidence
- **File Types**: jpg, jpeg, png, gif, webp, pdf, mp4, mov
- **Size Limit**: 50MB

## 🔧 API Functions

### Authentication (`auth.js`)

- `createUserAccount()` - Register new user
- `loginUser()` - User login
- `logoutUser()` - User logout
- `getCurrentUser()` - Get current user
- `updateUserPassword()` - Change password
- `resetUserPassword()` - Send password reset
- `verifyEmail()` - Verify email address

### User Management (`users.js`)

- `getUserProfile()` - Get user profile
- `updateUserProfile()` - Update profile
- `uploadProfilePicture()` - Upload profile picture
- `getUserByUsername()` - Find user by username
- `getUserStats()` - Get user statistics
- `getUserProjects()` - Get user's projects
- `getUserBackings()` - Get user's backings

### Project Management (`projects.js`)

- `createProject()` - Create new project
- `getProject()` - Get single project
- `updateProject()` - Update project
- `deleteProject()` - Delete project
- `publishProject()` - Publish project
- `getProjects()` - Get filtered projects
- `searchProjects()` - Search projects
- `getFeaturedProjects()` - Get featured projects
- `getTrendingProjects()` - Get trending projects

### Reward Tiers (`rewardTiers.js`)

- `createRewardTier()` - Create reward tier
- `getRewardTiers()` - Get project reward tiers
- `updateRewardTier()` - Update reward tier
- `deleteRewardTier()` - Delete reward tier
- `checkTierAvailability()` - Check tier availability
- `claimRewardTier()` - Claim reward tier

### Backings (`backings.js`)

- `createBacking()` - Create project backing
- `getBacking()` - Get backing details
- `updateBacking()` - Update backing
- `cancelBacking()` - Cancel backing
- `getProjectBackings()` - Get project backings
- `getUserBackings()` - Get user backings
- `validateBackingAmount()` - Validate backing amount

### Milestones (`milestones.js`)

- `createMilestone()` - Create milestone
- `getMilestones()` - Get project milestones
- `updateMilestone()` - Update milestone
- `deleteMilestone()` - Delete milestone
- `markMilestoneComplete()` - Mark milestone complete
- `getMilestoneProgress()` - Get milestone progress
- `getOverdueMilestones()` - Get overdue milestones

### Storage (`storage.js`)

- `uploadProjectImage()` - Upload project image
- `uploadProfilePicture()` - Upload profile picture
- `uploadMilestoneEvidence()` - Upload milestone evidence
- `deleteFile()` - Delete file
- `getFileUrl()` - Get file URL
- `resizeImage()` - Resize image
- `validateFile()` - Validate file

## ✅ Validation

The validation system provides comprehensive input validation:

### Form Validation

- Email format and length validation
- Password strength requirements
- Username format validation
- Project title and description validation
- Funding amount validation
- Date range validation

### File Validation

- File type validation
- File size limits
- Image dimension validation
- Aspect ratio validation

### Business Logic Validation

- Milestone percentage validation
- Reward tier pricing validation
- Backing amount validation
- Project date validation

## 🚨 Error Handling

Comprehensive error handling system with:

### Error Classification

- Authentication errors
- Validation errors
- Resource errors
- Permission errors
- Network errors
- Server errors

### User-Friendly Messages

- Clear, actionable error messages
- Context-specific error details
- Retry mechanisms for transient failures
- Error logging and monitoring

### Error Response Format

```javascript
{
  success: false,
  error: {
    message: "User-friendly error message",
    code: "ERROR_CODE",
    details: { /* additional context */ },
    timestamp: "2024-01-01T00:00:00.000Z"
  }
}
```

## 🔒 Security Features

### Data Security

- Input sanitization
- XSS prevention
- SQL injection prevention (handled by Appwrite)
- File upload validation
- Rate limiting support

### Authentication Security

- Secure password hashing (handled by Appwrite)
- Session management
- Email verification
- Password reset flow

### Privacy Protection

- Anonymous backing options
- Profile visibility controls
- Data export functionality
- GDPR compliance considerations

## 📈 Performance Optimizations

### Database Optimization

- Proper indexing strategy
- Efficient query patterns
- Pagination support
- Compound indexes for complex queries

### Caching Strategy

- Client-side caching recommendations
- Query result caching
- Static content caching
- Optimistic updates

### File Handling

- Image optimization
- Thumbnail generation
- Progressive loading
- CDN integration ready

## 🧪 Testing

### Manual Testing Checklist

- [ ] All API functions work correctly
- [ ] Error handling works as expected
- [ ] File uploads work properly
- [ ] Validation prevents invalid data
- [ ] Authentication flow works end-to-end

### Error Testing

- [ ] Network failure handling
- [ ] Invalid input handling
- [ ] Permission error handling
- [ ] File upload error handling
- [ ] Database error handling

## 🚀 Deployment

### Environment Variables

Ensure all required environment variables are set in production:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=crowdfunding_mvp
NEXT_PUBLIC_APPWRITE_API_KEY=your_production_api_key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Database Setup

Run the setup script in production to create all collections and storage buckets.

### Monitoring

Set up error monitoring and logging for production use.

## 📚 Usage Examples

### Complete User Registration Flow

```javascript
import {
  createUserAccount,
  uploadProfilePicture,
  updateUserProfile,
} from "./src/lib/api";

// 1. Create user account
const userResult = await createUserAccount(
  "user@example.com",
  "SecurePass123!",
  "John Doe",
  "johndoe",
  "creator",
);

if (userResult.success) {
  // 2. Upload profile picture
  const profilePicResult = await uploadProfilePicture(
    userResult.data.user.$id,
    profilePictureFile,
  );

  // 3. Update profile with additional info
  const updateResult = await updateUserProfile(userResult.data.user.$id, {
    bio: "Passionate developer and entrepreneur",
    socialLinks: {
      github: "https://github.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
    },
  });
}
```

### Complete Project Creation Flow

```javascript
import {
  createProject,
  createRewardTier,
  createMilestone,
  uploadProjectImage,
} from "./src/lib/api";

// 1. Upload project image
const imageResult = await uploadProjectImage(
  "temp_project_id",
  projectImageFile,
  "main",
);

// 2. Create project
const projectResult = await createProject({
  creatorId: userId,
  title: "My Awesome Web App",
  shortDescription: "A revolutionary web application",
  fullDescription: "Detailed description...",
  category: "web_app",
  fundingGoal: 50000, // $500.00
  fundingDuration: 45,
  mainImageUrl: imageResult.data.fileUrl,
});

// 3. Create reward tiers
const tier1Result = await createRewardTier(projectResult.data.$id, {
  tierTitle: "Early Bird",
  tierDescription: "Get early access",
  pledgeAmount: 2500, // $25.00
  estimatedDelivery: "2024-06-01",
  tierOrder: 1,
});

// 4. Create milestones
const milestone1Result = await createMilestone(projectResult.data.$id, {
  milestoneTitle: "MVP Development",
  milestoneDescription: "Complete MVP features",
  milestoneOrder: 1,
  targetDate: "2024-04-01",
  fundingPercentage: 50,
  deliverables: ["User authentication", "Core features"],
  successCriteria: "All MVP features working and tested",
});
```

This implementation provides a solid foundation for your crowdfunding platform MVP with comprehensive data management, validation, and error handling capabilities.

import {
  storage,
  PROJECT_IMAGES_BUCKET_ID,
  PROFILE_PICTURES_BUCKET_ID,
  MILESTONE_EVIDENCE_BUCKET_ID,
  ID,
} from "../appwrite.js";

/**
 * File Upload & Storage Management API functions
 */

/**
 * Upload project image
 * @param {string} projectId - Project ID
 * @param {File} file - Image file
 * @param {string} imageType - Type of image (main, additional)
 * @returns {Promise<Object>} Upload result
 */
export async function uploadProjectImage(
  projectId,
  file,
  imageType = "additional",
) {
  try {
    // Validate file
    const validation = await validateFile(file, {
      allowedTypes: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ],
      maxSize: 10 * 1024 * 1024, // 10MB
      minWidth: 300,
      minHeight: 200,
    });

    if (!validation.success) {
      return validation;
    }

    // Generate unique file ID
    const fileId = ID.unique();
    const fileName = `${projectId}_${imageType}_${fileId}`;

    // Upload file
    const uploadedFile = await storage.createFile(
      PROJECT_IMAGES_BUCKET_ID,
      fileId,
      file,
    );

    // Get file URL
    const fileUrl = storage.getFileView(PROJECT_IMAGES_BUCKET_ID, fileId);

    return {
      success: true,
      data: {
        fileId,
        fileName,
        fileUrl,
        size: file.size,
        type: file.type,
      },
      message: "Project image uploaded successfully",
    };
  } catch (error) {
    console.error("Error uploading project image:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to upload project image",
    };
  }
}

/**
 * Upload user profile picture
 * @param {string} userId - User ID
 * @param {File} file - Image file
 * @returns {Promise<Object>} Upload result
 */
export async function uploadProfilePicture(userId, file) {
  try {
    // Validate file
    const validation = await validateFile(file, {
      allowedTypes: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ],
      maxSize: 5 * 1024 * 1024, // 5MB
      minWidth: 100,
      minHeight: 100,
      aspectRatio: 1, // Square image
    });

    if (!validation.success) {
      return validation;
    }

    // Generate unique file ID
    const fileId = ID.unique();
    const fileName = `profile_${userId}_${fileId}`;

    // Upload file
    const uploadedFile = await storage.createFile(
      PROFILE_PICTURES_BUCKET_ID,
      fileId,
      file,
    );

    // Get file URL
    const fileUrl = storage.getFileView(PROFILE_PICTURES_BUCKET_ID, fileId);

    return {
      success: true,
      data: {
        fileId,
        fileName,
        fileUrl,
        size: file.size,
        type: file.type,
      },
      message: "Profile picture uploaded successfully",
    };
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to upload profile picture",
    };
  }
}

/**
 * Upload milestone evidence
 * @param {string} milestoneId - Milestone ID
 * @param {File|File[]} files - File or array of files
 * @returns {Promise<Object>} Upload result
 */
export async function uploadMilestoneEvidence(milestoneId, files) {
  try {
    const fileArray = Array.isArray(files) ? files : [files];
    const uploadResults = [];

    for (const file of fileArray) {
      // Validate file
      const validation = await validateFile(file, {
        allowedTypes: [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
          "application/pdf",
          "video/mp4",
          "video/quicktime",
        ],
        maxSize: 50 * 1024 * 1024, // 50MB
        minWidth: file.type.startsWith("image/") ? 100 : undefined,
        minHeight: file.type.startsWith("image/") ? 100 : undefined,
      });

      if (!validation.success) {
        return validation;
      }

      // Generate unique file ID
      const fileId = ID.unique();
      const fileName = `milestone_${milestoneId}_${fileId}`;

      // Upload file
      const uploadedFile = await storage.createFile(
        MILESTONE_EVIDENCE_BUCKET_ID,
        fileId,
        file,
      );

      // Get file URL
      const fileUrl = storage.getFileView(MILESTONE_EVIDENCE_BUCKET_ID, fileId);

      uploadResults.push({
        fileId,
        fileName,
        fileUrl,
        size: file.size,
        type: file.type,
      });
    }

    return {
      success: true,
      data: uploadResults,
      message: "Milestone evidence uploaded successfully",
    };
  } catch (error) {
    console.error("Error uploading milestone evidence:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to upload milestone evidence",
    };
  }
}

/**
 * Delete uploaded file
 * @param {string} fileId - File ID
 * @param {string} bucketId - Bucket ID
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteFile(fileId, bucketId) {
  try {
    await storage.deleteFile(bucketId, fileId);

    return {
      success: true,
      message: "File deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting file:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to delete file",
    };
  }
}

/**
 * Get public URL for file
 * @param {string} fileId - File ID
 * @param {string} bucketId - Bucket ID
 * @returns {string} File URL
 */
export function getFileUrl(fileId, bucketId) {
  return storage.getFileView(bucketId, fileId);
}

/**
 * Resize image on client side
 * @param {File} file - Image file
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @param {number} quality - Image quality (0-1)
 * @returns {Promise<File>} Resized image file
 */
export async function resizeImage(file, maxWidth, maxHeight, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and resize image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            reject(new Error("Failed to resize image"));
          }
        },
        file.type,
        quality,
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Generate thumbnail for image
 * @param {File} file - Image file
 * @param {number} size - Thumbnail size (square)
 * @returns {Promise<File>} Thumbnail file
 */
export async function generateThumbnail(file, size = 150) {
  return resizeImage(file, size, size, 0.7);
}

/**
 * Optimize image for web
 * @param {File} file - Image file
 * @param {number} quality - Image quality (0-1)
 * @returns {Promise<File>} Optimized image file
 */
export async function optimizeImage(file, quality = 0.8) {
  return resizeImage(file, 1920, 1080, quality);
}

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Promise<Object>} Validation result
 */
export async function validateFile(file, options = {}) {
  const {
    allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
    maxSize = 10 * 1024 * 1024, // 10MB
    minWidth,
    minHeight,
    aspectRatio,
  } = options;

  try {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type",
        message: `File type must be one of: ${allowedTypes.join(", ")}`,
      };
    }

    // Check file size
    if (file.size > maxSize) {
      return {
        success: false,
        error: "File too large",
        message: `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`,
      };
    }

    // Check image dimensions if specified
    if (
      file.type.startsWith("image/") &&
      (minWidth || minHeight || aspectRatio)
    ) {
      const dimensions = await getImageDimensions(file);

      if (minWidth && dimensions.width < minWidth) {
        return {
          success: false,
          error: "Image too small",
          message: `Image width must be at least ${minWidth}px`,
        };
      }

      if (minHeight && dimensions.height < minHeight) {
        return {
          success: false,
          error: "Image too small",
          message: `Image height must be at least ${minHeight}px`,
        };
      }

      if (aspectRatio) {
        const ratio = dimensions.width / dimensions.height;
        const tolerance = 0.1;

        if (Math.abs(ratio - aspectRatio) > tolerance) {
          return {
            success: false,
            error: "Invalid aspect ratio",
            message: `Image aspect ratio must be ${aspectRatio}:1`,
          };
        }
      }
    }

    return {
      success: true,
      message: "File validation passed",
    };
  } catch (error) {
    console.error("Error validating file:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to validate file",
    };
  }
}

/**
 * Get image dimensions
 * @param {File} file - Image file
 * @returns {Promise<Object>} Image dimensions
 */
export function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Get file information
 * @param {string} fileId - File ID
 * @param {string} bucketId - Bucket ID
 * @returns {Promise<Object>} File information
 */
export async function getFileInfo(fileId, bucketId) {
  try {
    const file = await storage.getFile(bucketId, fileId);

    return {
      success: true,
      data: file,
      message: "File information retrieved successfully",
    };
  } catch (error) {
    console.error("Error getting file info:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to get file information",
    };
  }
}

/**
 * List files in bucket
 * @param {string} bucketId - Bucket ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Files list
 */
export async function listFiles(bucketId, options = {}) {
  try {
    const { limit = 25, offset = 0, search } = options;

    const queries = [];
    if (search) {
      queries.push(Query.search("name", search));
    }
    queries.push(Query.limit(limit));
    queries.push(Query.offset(offset));

    const result = await storage.listFiles(bucketId, queries);

    return {
      success: true,
      data: result.files,
      total: result.total,
      message: "Files retrieved successfully",
    };
  } catch (error) {
    console.error("Error listing files:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to list files",
    };
  }
}

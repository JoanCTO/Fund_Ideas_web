export const IMAGE_DICTIONARY = {
  // Project Images - Using high-quality tech/development focused images
  projects: {
    aiCodeReview: {
      id: "ai-code-review-main",
      url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800&h=400&auto=format&fit=crop&ixlib=rb-4.1.0",
      description:
        "AI-powered code review tool main interface - developer workspace with multiple monitors",
      category: "project_main",
      dimensions: "800x400",
      alt: "AI Code Review Tool Interface",
    },
    aiCodeReviewThumb: {
      id: "ai-code-review-thumb",
      url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=400&h=300&auto=format&fit=crop&ixlib=rb-4.1.0",
      description:
        "Code on screen with syntax highlighting - perfect for AI code review thumbnail",
      category: "project_thumbnail",
      dimensions: "400x300",
      alt: "AI Code Review Tool",
    },
    aiCodeReviewScreenshot1: {
      id: "ai-code-review-screenshot-1",
      url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&h=300&auto=format&fit=crop&ixlib=rb-4.1.0",
      description:
        "Security-focused code analysis interface showing vulnerability detection",
      category: "project_screenshot",
      dimensions: "400x300",
      alt: "AI Code Review Screenshot 1",
    },
    aiCodeReviewScreenshot2: {
      id: "ai-code-review-screenshot-2",
      url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=400&h=300&auto=format&fit=crop&ixlib=rb-4.1.0",
      description:
        "Performance monitoring dashboard showing code analysis metrics",
      category: "project_screenshot",
      dimensions: "400x300",
      alt: "AI Code Review Screenshot 2",
    },
    decentralizedIdentity: {
      id: "decentralized-identity-main",
      url: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=400&h=300&auto=format&fit=crop&ixlib=rb-4.1.0",
      description:
        "Decentralized blockchain network visualization with connected nodes",
      category: "project_main",
      dimensions: "400x300",
      alt: "Decentralized Identity Platform",
    },
    quantumSimulator: {
      id: "quantum-simulator-main",
      url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400&h=300&auto=format&fit=crop&ixlib=rb-4.1.0",
      description:
        "Quantum computing visualization with glowing circuit patterns",
      category: "project_main",
      dimensions: "400x300",
      alt: "Quantum Computing Simulator",
    },
    mlApiPlatform: {
      id: "ml-api-platform",
      url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=300&h=200&auto=format&fit=crop&ixlib=rb-4.1.0",
      description: "Machine learning dashboard with charts and AI analytics",
      category: "project_thumbnail",
      dimensions: "300x200",
      alt: "ML API Platform",
    },
    blockchainVoting: {
      id: "blockchain-voting",
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&h=200&auto=format&fit=crop&ixlib=rb-4.1.0",
      description: "Digital voting interface with blockchain security elements",
      category: "project_thumbnail",
      dimensions: "300x200",
      alt: "Blockchain Voting System",
    },
  },

  // User Profile Images - Using DiceBear API (reliable, consistent, and SVG-based)
  users: {
    emmaRodriguez: {
      id: "user-emma-rodriguez",
      url: "https://api.dicebear.com/7.x/lorelei/svg?seed=emma-rodriguez&backgroundColor=b6e3f4,c0aede,d1d4f9",
      description: "Emma Rodriguez profile picture - generated avatar",
      category: "user_avatar",
      dimensions: "128x128",
      alt: "Emma Rodriguez",
    },
    alexThompson: {
      id: "user-alex-thompson",
      url: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex-thompson&backgroundColor=b6e3f4,c0aede,d1d4f9",
      description: "Alex Thompson profile picture - generated avatar",
      category: "user_avatar",
      dimensions: "128x128",
      alt: "Alex Thompson",
    },
    lisaPark: {
      id: "user-lisa-park",
      url: "https://api.dicebear.com/7.x/lorelei/svg?seed=lisa-park&backgroundColor=ffd5dc,ffdfba,c0aede",
      description: "Lisa Park profile picture - generated avatar",
      category: "user_avatar",
      dimensions: "128x128",
      alt: "Lisa Park",
    },
    sarahChen: {
      id: "user-sarah-chen",
      url: "https://api.dicebear.com/7.x/personas/svg?seed=sarah-chen&backgroundColor=d1d4f9,ffd5dc,ffdfba",
      description: "Sarah Chen profile picture - generated avatar",
      category: "user_avatar",
      dimensions: "128x128",
      alt: "Sarah Chen",
    },
    marcusJohnson: {
      id: "user-marcus-johnson",
      url: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus-johnson&backgroundColor=b6e3f4,c0aede,d1d4f9",
      description: "Marcus Johnson profile picture - generated avatar",
      category: "user_avatar",
      dimensions: "128x128",
      alt: "Marcus Johnson",
    },
    davidMartinez: {
      id: "user-david-martinez",
      url: "https://api.dicebear.com/7.x/big-smile/svg?seed=david-martinez&backgroundColor=ffdfba,ffd5dc,c0aede",
      description: "David Martinez profile picture - generated avatar",
      category: "user_avatar",
      dimensions: "128x128",
      alt: "David Martinez",
    },
  },

  // Team Member Images - Using UI Avatars API for professional initials-based avatars
  team: {
    sarahChenCeo: {
      id: "team-sarah-chen-ceo",
      url: "https://ui-avatars.com/api/?name=Sarah+Chen&size=200&background=4f46e5&color=ffffff&font-size=0.6&rounded=true&bold=true",
      description: "Sarah Chen CEO and Co-Founder professional avatar",
      category: "team_member",
      dimensions: "200x200",
      alt: "Sarah Chen - CEO & Co-Founder",
    },
    marcusRodriguezCto: {
      id: "team-marcus-rodriguez-cto",
      url: "https://ui-avatars.com/api/?name=Marcus+Rodriguez&size=200&background=059669&color=ffffff&font-size=0.6&rounded=true&bold=true",
      description: "Marcus Rodriguez CTO and Co-Founder professional avatar",
      category: "team_member",
      dimensions: "200x200",
      alt: "Marcus Rodriguez - CTO & Co-Founder",
    },
    emilyWatsonCommunity: {
      id: "team-emily-watson-community",
      url: "https://ui-avatars.com/api/?name=Emily+Watson&size=200&background=dc2626&color=ffffff&font-size=0.6&rounded=true&bold=true",
      description: "Dr. Emily Watson Head of Community professional avatar",
      category: "team_member",
      dimensions: "200x200",
      alt: "Dr. Emily Watson - Head of Community",
    },
  },

  // Background Images - Using high-quality workspace and tech images from Unsplash
  backgrounds: {
    registerHero: {
      id: "bg-register-hero",
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=2160&q=80&auto=format&fit=crop&ixlib=rb-4.1.0",
      description:
        "Modern minimalist workspace with laptop - perfect for registration page hero",
      category: "background_hero",
      dimensions: "2160x1440",
      alt: "Modern workspace background",
    },
    loginHero: {
      id: "bg-login-hero",
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=2160&q=80&auto=format&fit=crop&ixlib=rb-4.1.0",
      description:
        "Professional tech workspace with multiple monitors - ideal for login background",
      category: "background_hero",
      dimensions: "2160x1440",
      alt: "Professional tech workspace background",
    },
  },

  // Alternative reliable avatar services (for backup or different styles)
  avatarServices: {
    dicebear: {
      baseUrl: "https://api.dicebear.com/7.x/",
      styles: [
        "avataaars",
        "lorelei",
        "personas",
        "big-smile",
        "identicon",
        "initials",
      ],
      description:
        "DiceBear provides consistent, SVG-based avatars with multiple styles",
      documentation: "https://www.dicebear.com/",
    },
    uiAvatars: {
      baseUrl: "https://ui-avatars.com/api/",
      description:
        "UI Avatars generates initials-based avatars, perfect for professional use",
      documentation: "https://ui-avatars.com/",
    },
    pravatar: {
      baseUrl: "https://pravatar.cc/",
      description:
        "Pravatar provides random real person photos under CC0 license",
      documentation: "https://pravatar.cc/",
    },
    robohash: {
      baseUrl: "https://robohash.org/",
      description:
        "RoboHash generates unique robot/character avatars from any text",
      documentation: "https://robohash.org/",
    },
  },

  // Alternative stock photo sources for future use
  stockPhotoSources: {
    pexels: {
      baseUrl: "https://www.pexels.com/",
      apiUrl: "https://api.pexels.com/v1/",
      description: "High-quality, royalty-free stock photos and videos",
      license: "Free for commercial use, no attribution required",
    },
    pixabay: {
      baseUrl: "https://pixabay.com/",
      apiUrl: "https://pixabay.com/api/",
      description: "Over 2.6 million free images, videos, and vectors",
      license: "Free for commercial use, no attribution required",
    },
    unsplash: {
      baseUrl: "https://unsplash.com/",
      apiUrl: "https://api.unsplash.com/",
      description:
        "Beautiful, high-resolution photos from talented photographers",
      license: "Free for commercial use, attribution appreciated",
    },
    burst: {
      baseUrl: "https://burst.shopify.com/",
      description: "Free stock photos by Shopify, optimized for e-commerce",
      license: "Free for commercial use, no attribution required",
    },
  },
};

// Helper functions for generating dynamic URLs
export const generateAvatarUrl = (service, options = {}) => {
  const services = IMAGE_DICTIONARY.avatarServices;

  switch (service) {
    case "dicebear":
      const style = options.style || "avataaars";
      const seeed = options.seed || "default";
      const backgroundColor = options.backgroundColor || "b6e3f4,c0aede,d1d4f9";
      return `${services.dicebear.baseUrl}${style}/svg?seed=${seeed}&backgroundColor=${backgroundColor}`;

    case "uiAvatars":
      const name = options.name || "User";
      const size = options.size || 128;
      const background = options.background || "4f46e5";
      const color = options.color || "ffffff";
      return `${services.uiAvatars.baseUrl}?name=${encodeURIComponent(name)}&size=${size}&background=${background}&color=${color}&rounded=true&bold=true`;

    case "pravatar":
      const pravaSize = options.size || 128;
      const seed = options.seed || Math.floor(Math.random() * 1000);
      return `${services.pravatar.baseUrl}${pravaSize}?img=${seed}`;

    case "robohash":
      const text = options.text || "default";
      const roboSize = options.size || "128x128";
      return `${services.robohash.baseUrl}${text}?size=${roboSize}`;

    default:
      return services.dicebear.baseUrl + "avataaars/svg?seed=default";
  }
};

// Function to get image by category
export const getImagesByCategory = (category) => {
  const allImages = [];

  Object.values(IMAGE_DICTIONARY).forEach((section) => {
    if (typeof section === "object" && !section.baseUrl) {
      Object.values(section).forEach((image) => {
        if (image.category === category) {
          allImages.push(image);
        }
      });
    }
  });

  return allImages;
};

// Function to get image by ID
export const getImageById = (id) => {
  for (const section of Object.values(IMAGE_DICTIONARY)) {
    if (typeof section === "object" && !section.baseUrl) {
      for (const image of Object.values(section)) {
        if (image.id === id) {
          return image;
        }
      }
    }
  }
  return null;
};

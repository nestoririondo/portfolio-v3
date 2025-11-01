import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import contentfulManagementPkg from "contentful-management";
import * as contentfulPkg from "contentful";
import unsplashPkg from "unsplash-js";
import fetch from "node-fetch";

import { blogPromptTemplate } from "./blog-prompt-template.js";
import { validateAndCleanContent } from "./content-validator.js";
import { createLock, removeLock } from "./blog-lock.js";

const { createClient } = contentfulManagementPkg;
const { createClient: createContentfulClient } = contentfulPkg;
const { createApi } = unsplashPkg;

// Validate required environment variables
const requiredEnvVars = [
  "CLAUDE_API_KEY",
  "CONTENTFUL_MANAGEMENT_TOKEN",
  "CONTENTFUL_SPACE_ID",
  "CONTENTFUL_ACCESS_TOKEN",
  "UNSPLASH_ACCESS_KEY",
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(
    "❌ Missing required environment variables:",
    missingVars.join(", ")
  );
  console.error(
    "Please ensure all secrets are properly configured in GitHub Actions."
  );
  process.exit(1);
}

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const contentfulManagement = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const contentful = createContentfulClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  fetch,
});

const topics = [
  // Web Development & Performance
  "Website speed optimization for Berlin restaurants",
  "Progressive Web Apps: The future of mobile experiences",
  "Core Web Vitals optimization strategies for 2025",
  "Server-side rendering vs client-side rendering performance",
  "Image optimization techniques for faster websites",
  "CDN implementation for European businesses",
  "Database query optimization for web applications",
  "Lazy loading best practices for modern websites",

  // Frontend Development & Design
  "Mobile-first design trends in 2025",
  "CSS Grid vs Flexbox: When to use which layout system",
  "Modern JavaScript frameworks comparison: React vs Vue vs Svelte",
  "Micro-interactions that boost user engagement",
  "Dark mode implementation best practices",
  "Responsive typography for better readability",
  "Animation performance optimization techniques",
  "Component-driven development workflows",

  // Backend & Infrastructure
  "API design patterns for scalable applications",
  "Microservices architecture for growing startups",
  "Docker containerization for web developers",
  "Cloud deployment strategies: AWS vs Vercel vs Netlify",
  "Database selection guide: SQL vs NoSQL for web apps",
  "Serverless functions for cost-effective scaling",
  "Real-time features with WebSockets and SSE",
  "GraphQL vs REST API design decisions",

  // Business & Marketing
  "Local SEO strategies for Berlin companies",
  "E-commerce conversion optimization",
  "Digital marketing automation for small businesses",
  "Content marketing strategies for tech companies",
  "Social media integration for business websites",
  "Email marketing best practices for SaaS products",
  "Customer retention through web personalization",
  "Landing page optimization for higher conversions",

  // Security & Compliance
  "GDPR compliance for German small businesses",
  "Website accessibility requirements in Germany",
  "Cybersecurity essentials for business websites",
  "SSL certificate implementation and management",
  "Data privacy regulations across European markets",
  "Authentication strategies: JWT vs OAuth vs Sessions",
  "Password security best practices for web apps",
  "XSS and CSRF protection techniques",

  // E-commerce & Online Business
  "Headless commerce architecture advantages",
  "Payment gateway integration for European markets",
  "Multi-currency support for international sales",
  "Inventory management system integration",
  "Customer reviews and rating system implementation",
  "Abandoned cart recovery automation strategies",
  "Cross-border e-commerce compliance in EU",
  "Subscription billing model implementation",

  // Technology & Innovation
  "AI integration in modern web applications",
  "Machine learning for personalized user experiences",
  "Blockchain integration for web developers",
  "Voice interface development for websites",
  "Augmented reality features for e-commerce sites",
  "IoT device integration with web platforms",
  "Edge computing for faster web applications",
  "5G impact on web development strategies",

  // Content Management & Workflow
  "Content management system selection guide",
  "Headless CMS vs traditional CMS comparison",
  "JAMstack architecture for content-heavy sites",
  "Version control workflows for design teams",
  "Automated testing strategies for web projects",
  "CI/CD pipelines for frontend deployments",
  "Code review best practices for development teams",
  "Documentation strategies for growing codebases",

  // Analytics & Optimization
  "Web analytics setup for business insights",
  "A/B testing implementation without third-party tools",
  "Heatmap analysis for user behavior optimization",
  "Conversion funnel optimization techniques",
  "Performance monitoring and alerting systems",
  "User feedback collection and implementation",
  "Data-driven design decision making",
  "Growth hacking techniques for web platforms",

  // Freelancing & Business Development
  "Client onboarding processes for web agencies",
  "Project management tools for remote development teams",
  "Pricing strategies for web development services",
  "Building long-term client relationships in tech",
  "Portfolio optimization for attracting ideal clients",
  "Networking strategies for Berlin tech professionals",
  "Time tracking and productivity tools for developers",
  "Legal considerations for freelance web developers",

  // Emerging Trends & Future Technologies
  "Web3 development fundamentals for traditional developers",
  "No-code platforms: Threat or opportunity for developers",
  "Sustainable web development practices for climate impact",
  "Accessibility-first design methodology",
  "Cross-platform development with web technologies",
  "WebAssembly applications in modern web development",
  "Quantum computing implications for web security",
  "Metaverse development opportunities for web developers",
];

// Function to fetch trending topics from multiple sources
async function fetchTrendingTopics() {
  const trendingTopics = [];

  try {
    // Try to fetch trending topics from multiple sources
    const sources = [
      fetchHackerNewsTopics(),
      fetchDevToTopics(),
      fetchGitHubTrendingTopics(),
    ];

    const results = await Promise.allSettled(sources);

    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value.length > 0) {
        trendingTopics.push(...result.value);
      }
    });

    // If we got trending topics, filter and format them for web development context
    if (trendingTopics.length > 0) {
      const webDevTopics = trendingTopics
        .filter((topic) => isWebDevRelevant(topic))
        .map((topic) => formatTopicForBusiness(topic))
        .slice(0, 20); // Limit to top 20 trending topics

      console.log(
        `🔥 Found ${webDevTopics.length} trending web development topics`
      );
      return webDevTopics;
    }
  } catch (error) {
    console.log("⚠️ Could not fetch trending topics, using curated list");
  }

  // Fallback to curated topics if trending fetch fails
  return topics;
}

// Check if a topic is relevant to web development/business
function isWebDevRelevant(topic) {
  const webDevKeywords = [
    "web",
    "javascript",
    "react",
    "vue",
    "angular",
    "node",
    "api",
    "css",
    "html",
    "frontend",
    "backend",
    "fullstack",
    "database",
    "security",
    "performance",
    "seo",
    "ui",
    "ux",
    "design",
    "mobile",
    "responsive",
    "ecommerce",
    "cms",
    "framework",
    "library",
    "typescript",
    "next",
    "nuxt",
    "svelte",
    "server",
    "cloud",
    "aws",
    "vercel",
    "netlify",
    "deployment",
    "docker",
    "ci/cd",
  ];

  return webDevKeywords.some((keyword) =>
    topic.toLowerCase().includes(keyword)
  );
}

// Format trending topic for business context
function formatTopicForBusiness(topic) {
  // Clean and shorten the topic first
  const cleanTopic = topic
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim()
    .substring(0, 25); // Shorter length for better titles

  // Create concise business-focused topics
  const businessFormats = [
    `${cleanTopic} for Berlin businesses`,
    `${cleanTopic} ROI optimization`,
    `${cleanTopic} business growth`,
    `${cleanTopic} web strategies`,
    `${cleanTopic} digital advantage`,
  ];

  const formatted =
    businessFormats[Math.floor(Math.random() * businessFormats.length)];

  // Return the shorter version to ensure titles don't get truncated
  return formatted.length > 40 ? cleanTopic : formatted;
}

// Fetch trending topics from Hacker News
async function fetchHackerNewsTopics() {
  try {
    const response = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    const storyIds = await response.json();

    const topStories = await Promise.all(
      storyIds.slice(0, 10).map(async (id) => {
        const storyResponse = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        return await storyResponse.json();
      })
    );

    return topStories
      .filter((story) => story.title && story.score > 100)
      .map((story) => story.title)
      .slice(0, 5);
  } catch (error) {
    console.log("Could not fetch from Hacker News:", error.message);
    return [];
  }
}

// Fetch trending topics from Dev.to
async function fetchDevToTopics() {
  try {
    const response = await fetch("https://dev.to/api/articles?top=7");
    const articles = await response.json();

    return articles
      .filter((article) => article.positive_reactions_count > 50)
      .map((article) => article.title)
      .slice(0, 5);
  } catch (error) {
    console.log("Could not fetch from Dev.to:", error.message);
    return [];
  }
}

// Fetch trending repos from GitHub (tech topics)
async function fetchGitHubTrendingTopics() {
  try {
    const response = await fetch(
      "https://api.github.com/search/repositories?q=language:javascript+language:typescript&sort=stars&order=desc&per_page=10"
    );
    const data = await response.json();

    return data.items
      .filter((repo) => repo.stargazers_count > 1000)
      .map((repo) => repo.description || repo.name)
      .filter((desc) => desc && desc.length > 10)
      .slice(0, 5);
  } catch (error) {
    console.log("Could not fetch from GitHub:", error.message);
    return [];
  }
}

async function generateBlogPost(maxRetries = 3) {
  // Check for concurrent execution
  if (!createLock()) {
    return {
      title: "Concurrent execution prevented",
      status: "skipped",
      reason: "Another blog generation already running",
    };
  }

  try {
    // Always fetch existing posts for duplicate checking and image selection
    console.log("🔍 Fetching existing posts to check for duplicates...");
    const existingPosts = await fetchExistingPosts();

    // Check for recent posts to prevent duplicate runs (3 days for twice-weekly posting)
    const recentPosts = existingPosts.filter((post) => {
      const postDate = new Date(post.publishedDate || post.createdAt);
      const now = new Date();
      const diffHours = (now - postDate) / (1000 * 60 * 60);
      return diffHours < 72; // Posts created in last 3 days (72 hours)
    });

    if (recentPosts.length > 0) {
      console.log(
        `⏰ Found ${recentPosts.length} recent posts (last 3 days). Checking for duplicates...`
      );
      for (const recent of recentPosts) {
        console.log(
          `   - "${recent.title}" (${new Date(
            recent.publishedDate || recent.createdAt
          ).toISOString()})`
        );
      }
    }

    // Check for forced topic first (only if actually provided and not empty)
    const forceTopic = process.env.FORCE_TOPIC?.trim();
    let topic;

    if (
      forceTopic &&
      forceTopic.length > 0 &&
      forceTopic !== "undefined" &&
      forceTopic !== "null"
    ) {
      console.log(`🎯 Using forced topic: "${forceTopic}"`);

      // Check if we already have a recent post about this topic
      const topicKeywords = forceTopic.toLowerCase().split(/[\s-_]+/)
        .filter(keyword => keyword.length > 3)
        .filter(keyword => !['business', 'website', 'berlin', 'german', 'companies'].includes(keyword)); // Exclude common words
      
      const duplicateByTopic = recentPosts.find((post) => {
        const titleLower = post.title.toLowerCase();
        const matchingKeywords = topicKeywords.filter(keyword => titleLower.includes(keyword));
        // Require at least 2 specific keywords to match, or 1 very specific keyword
        return matchingKeywords.length >= 2 || 
               (matchingKeywords.length === 1 && matchingKeywords[0].length > 8);
      });

      if (duplicateByTopic) {
        console.log(
          `⚠️ Recent post about "${forceTopic}" already exists: "${duplicateByTopic.title}"`
        );
        console.log("🚫 Skipping to avoid duplicate content");
        return {
          title: duplicateByTopic.title,
          status: "skipped",
          reason: "Recent duplicate topic found",
        };
      }

      topic = forceTopic;
    } else {
      // No forced topic, select from available topics to avoid duplicates
      console.log(
        "🔍 No forced topic provided, selecting from available topics..."
      );
      const availableTopics = await getAvailableTopics(existingPosts);

      if (availableTopics.length === 0) {
        console.log("⚠️ No available topics found that aren't duplicates");
        return null;
      }

      topic =
        availableTopics[Math.floor(Math.random() * availableTopics.length)];
    }
    console.log(`📝 Selected topic: "${topic}"`);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}: Generating content for "${topic}"`);

        // Analyze recent content structures to ensure variety
        const recentStructures = analyzeContentStructures(existingPosts);
        console.log(`📊 Recent structures: ${recentStructures.map(s => s.structure).join(', ')}`);

        const promptContent = await blogPromptTemplate(topic, recentStructures);

        const response = await anthropic.messages.create({
          model: "claude-3-haiku-20240307",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: promptContent,
            },
          ],
        });

        const rawContent = response.content[0].text;
        const validation = validateAndCleanContent(rawContent);

        if (validation.isValid) {
          // Final duplicate check on generated title
          const isDuplicate = await checkTitleSimilarity(
            validation.title,
            existingPosts
          );
          if (isDuplicate) {
            console.log(
              `❌ Generated title too similar to existing post: "${validation.title}"`
            );
            if (attempt === maxRetries) {
              console.log("⚠️ Max retries reached, skipping this generation");
              return null;
            }
            continue;
          }

          console.log("✅ Content validation passed");

          // Content is ready (contextual images removed to prevent display issues)
          const enhancedContent = validation.content;
          const enhancedValidation = {
            ...validation,
            content: enhancedContent,
          };

          await publishToContentful(enhancedValidation, topic, existingPosts);
          return enhancedValidation;
        } else {
          console.log(
            `❌ Attempt ${attempt} failed validation:`,
            validation.errors
          );

          if (attempt === maxRetries) {
            // Last attempt - publish anyway with fixes
            console.log("⚠️ Publishing with automatic fixes");
            const fixed = applyAutomaticFixes(validation);

            // Content is ready (contextual images removed to prevent display issues)  
            const enhancedContent = fixed.content;
            const enhancedFixed = { ...fixed, content: enhancedContent };

            await publishToContentful(enhancedFixed, topic, existingPosts);
            return enhancedFixed;
          }
        }
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);

        if (attempt === maxRetries) {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error("❌ Blog generation failed:", error);
    throw error;
  } finally {
    // Always remove lock when function exits
    removeLock();
  }
}

function applyAutomaticFixes(validation) {
  let { title, excerpt, content } = validation;

  // Ensure title exists - NO length restrictions
  if (!title) {
    title = "Professional Web Development Services for Berlin";
  }

  // Clean up title but keep full length
  title = title.trim();

  // Keep excerpt as generated by AI - do not truncate
  if (!excerpt) {
    // Only create fallback if excerpt is completely missing
    excerpt =
      "Discover how Berlin businesses boost revenue and conversions through professional web development and strategic optimization.";
  } else {
    // Clean up the excerpt but keep it complete
    excerpt = excerpt.trim();
  }

  // Ensure minimum H2 sections
  const h2Count = (content.match(/^## /gm) || []).length;
  if (h2Count < 3) {
    content +=
      "\n\n## Next Steps\n\nReady to improve your website? Contact us for a free consultation.";
  }

  return {
    ...validation,
    title,
    excerpt,
    content,
    isValid: true,
    errors: [],
  };
}

function convertToRichText(markdown) {
  const content = [];
  const lines = markdown.split("\n");
  let bulletPoints = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (!trimmed) continue;

    if (trimmed.startsWith("## ")) {
      // H2 heading
      content.push({
        nodeType: "heading-2",
        data: {},
        content: [
          {
            nodeType: "text",
            value: trimmed.replace("## ", ""),
            marks: [],
            data: {},
          },
        ],
      });
    } else if (trimmed.startsWith("- **") && trimmed.endsWith("**")) {
      // Collect bullet points
      const text = trimmed.replace("- **", "").replace("**", "");
      bulletPoints.push({
        nodeType: "list-item",
        data: {},
        content: [
          {
            nodeType: "paragraph",
            data: {},
            content: [
              {
                nodeType: "text",
                value: text,
                marks: [{ type: "bold" }],
                data: {},
              },
            ],
          },
        ],
      });

      // Check if next line is also a bullet point
      const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : "";
      if (!nextLine.startsWith("- **")) {
        // End of bullet list, add it to content
        content.push({
          nodeType: "unordered-list",
          data: {},
          content: bulletPoints,
        });
        bulletPoints = [];
      }
    } else if (
      trimmed.length > 0 &&
      !trimmed.startsWith("[") &&
      !trimmed.endsWith("]")
    ) {
      // Regular paragraph - handle bold text, skip placeholder brackets
      const paragraphContent = parseTextWithBold(trimmed);

      content.push({
        nodeType: "paragraph",
        data: {},
        content: paragraphContent,
      });
    }
  }

  return {
    nodeType: "document",
    data: {},
    content: content,
  };
}

function parseTextWithBold(text) {
  const content = [];
  let currentText = text;

  while (currentText.includes("**")) {
    const beforeBold = currentText.substring(0, currentText.indexOf("**"));
    if (beforeBold) {
      content.push({
        nodeType: "text",
        value: beforeBold,
        marks: [],
        data: {},
      });
    }

    currentText = currentText.substring(currentText.indexOf("**") + 2);
    const boldEnd = currentText.indexOf("**");
    if (boldEnd !== -1) {
      const boldText = currentText.substring(0, boldEnd);
      content.push({
        nodeType: "text",
        value: boldText,
        marks: [{ type: "bold" }],
        data: {},
      });
      currentText = currentText.substring(boldEnd + 2);
    }
  }

  if (currentText) {
    content.push({
      nodeType: "text",
      value: currentText,
      marks: [],
      data: {},
    });
  }

  return content;
}

async function fetchUnsplashImage(topic, existingPosts = []) {
  try {
    // Extract keywords from topic for search
    const keywords =
      topic
        .toLowerCase()
        .replace(/\b(for|berlin|german|germany|website|web|development)\b/g, "")
        .trim()
        .split(/\s+/)
        .slice(0, 3)
        .join(" ") || "business technology";

    console.log(`🖼️ Searching Unsplash for: "${keywords}"`);

    const result = await unsplash.search.getPhotos({
      query: keywords,
      page: 1,
      perPage: 20, // Get more results to avoid duplicates
      orientation: "landscape",
    });

    if (result.errors) {
      console.error("❌ Unsplash search error:", result.errors);
      return null;
    }

    const photos = result.response?.results;
    if (!photos || photos.length === 0) {
      console.log("⚠️ No photos found, using fallback search");
      return await fetchFallbackImage(existingPosts);
    }

    // Get list of used image URLs
    const usedImageUrls = existingPosts
      .map((post) => post.featuredImageUrl)
      .filter(Boolean)
      .map((url) => url.replace("https:", ""));

    console.log(`🔍 Checking against ${usedImageUrls.length} existing images`);

    // Find an unused photo
    for (const photo of photos) {
      const photoUrl = photo.urls.regular;
      const isUsed = usedImageUrls.some(
        (usedUrl) => usedUrl.includes(photo.id) || photoUrl.includes(photo.id)
      );

      if (!isUsed) {
        console.log(
          `✅ Found unique image: ${photo.alt_description || "Untitled"}`
        );
        return {
          url: photoUrl,
          alt: photo.alt_description || `Image related to ${topic}`,
          credit: `Photo by ${photo.user.name} on Unsplash`,
          downloadUrl: photo.links.download,
        };
      }
    }

    // If all images from this search are used, try fallback
    console.log("⚠️ All images from search appear to be used, trying fallback");
    return await fetchFallbackImage(existingPosts);
  } catch (error) {
    console.error("❌ Error fetching image:", error);
    return await fetchFallbackImage(existingPosts);
  }
}

async function fetchFallbackImage(existingPosts = []) {
  try {
    const fallbackQueries = [
      "business office computer",
      "modern workspace",
      "digital technology",
      "office desk laptop",
      "business meeting",
    ];

    const usedImageUrls = existingPosts
      .map((post) => post.featuredImageUrl)
      .filter(Boolean)
      .map((url) => url.replace("https:", ""));

    for (const query of fallbackQueries) {
      console.log(`🔄 Trying fallback search: "${query}"`);

      const result = await unsplash.search.getPhotos({
        query,
        page: 1,
        perPage: 10,
        orientation: "landscape",
      });

      const photos = result.response?.results;
      if (photos && photos.length > 0) {
        // Find an unused photo from this fallback search
        for (const photo of photos) {
          const isUsed = usedImageUrls.some(
            (usedUrl) =>
              usedUrl.includes(photo.id) ||
              photo.urls.regular.includes(photo.id)
          );

          if (!isUsed) {
            console.log(
              `✅ Found unique fallback image: ${
                photo.alt_description || "Untitled"
              }`
            );
            return {
              url: photo.urls.regular,
              alt: photo.alt_description || "Business technology image",
              credit: `Photo by ${photo.user.name} on Unsplash`,
              downloadUrl: photo.links.download,
            };
          }
        }
      }
    }

    console.log("⚠️ Could not find any unique fallback images");
  } catch (error) {
    console.error("❌ Fallback image error:", error);
  }
  return null;
}

async function uploadImageToContentful(imageData) {
  try {
    const space = await contentfulManagement.getSpace(
      process.env.CONTENTFUL_SPACE_ID
    );
    const environment = await space.getEnvironment("master");

    // Download the image
    const response = await fetch(imageData.url);
    const imageBuffer = await response.arrayBuffer();

    // First, create an upload
    const upload = await environment.createUpload({
      file: imageBuffer,
      contentType: "image/jpeg",
    });

    console.log("📤 File uploaded, creating asset...");

    // Create asset with upload reference
    const asset = await environment.createAsset({
      fields: {
        title: {
          "en-US": imageData.alt,
        },
        description: {
          "en-US": imageData.credit,
        },
        file: {
          "en-US": {
            contentType: "image/jpeg",
            fileName: `blog-${Date.now()}.jpg`,
            uploadFrom: {
              sys: {
                type: "Link",
                linkType: "Upload",
                id: upload.sys.id,
              },
            },
          },
        },
      },
    });

    console.log("🔄 Processing asset...");

    // Process the asset
    await asset.processForAllLocales();

    // Wait for processing to complete
    let processedAsset = asset;
    let attempts = 0;
    while (attempts < 10) {
      processedAsset = await environment.getAsset(asset.sys.id);
      if (processedAsset.fields.file?.["en-US"]?.url) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      attempts++;
    }

    if (!processedAsset.fields.file?.["en-US"]?.url) {
      throw new Error("Asset processing timed out");
    }

    await processedAsset.publish();
    console.log(`✅ Image uploaded and published: ${imageData.alt}`);

    return processedAsset;
  } catch (error) {
    console.error("❌ Error uploading image to Contentful:", error);
    console.error("Error details:", error.message);
    return null;
  }
}


async function publishToContentful(blogData, topic, existingPosts = []) {
  try {
    const space = await contentfulManagement.getSpace(
      process.env.CONTENTFUL_SPACE_ID
    );
    const environment = await space.getEnvironment("master");

    // Fetch and upload featured image
    let featuredImageRef = null;
    console.log("🖼️ Fetching featured image...");
    const imageData = await fetchUnsplashImage(topic, existingPosts);

    if (imageData) {
      const uploadedImage = await uploadImageToContentful(imageData);
      if (uploadedImage) {
        featuredImageRef = {
          "en-US": {
            sys: {
              type: "Link",
              linkType: "Asset",
              id: uploadedImage.sys.id,
            },
          },
        };
      }
    }

    const entryFields = {
      title: { "en-US": blogData.title },
      slug: { "en-US": blogData.slug },
      subtitle: { "en-US": blogData.excerpt },
      content: { "en-US": convertToRichText(blogData.content) },
      publishedDate: { "en-US": new Date().toISOString() },
    };

    // Add featured image if available
    if (featuredImageRef) {
      entryFields.featuredImage = featuredImageRef;
    }

    const entry = await environment.createEntry("blogPost", {
      fields: entryFields,
    });

    await entry.publish();
    console.log(`✅ Published: "${blogData.title}"`);
  } catch (error) {
    console.error("❌ Failed to publish to Contentful:", error);
    throw error;
  }
}

// Run if called directly
if (process.env.NODE_ENV !== "test") {
  generateBlogPost()
    .then((result) => {
      console.log("🎉 Blog post generated successfully:", result.title);
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Failed to generate blog post:", error);
      process.exit(1);
    });
}

async function fetchExistingPosts() {
  try {
    console.log("🔍 Fetching existing blog posts to check for duplicates...");
    const entries = await contentful.getEntries({
      content_type: "blogPost",
      limit: 100, // Get recent posts
      order: "-fields.publishedDate",
    });

    return entries.items.map((item) => ({
      title: item.fields.title,
      slug: item.fields.slug,
      publishedDate: item.fields.publishedDate,
      featuredImageUrl: item.fields.featuredImage?.fields?.file?.url || null,
      content: item.fields.content, // Include content for structure analysis
    }));
  } catch (error) {
    console.error("❌ Error fetching existing posts:", error);
    return [];
  }
}

async function getAvailableTopics(existingPosts) {
  const usedKeywords = extractKeywordsFromTitles(existingPosts);

  // Fetch trending topics (fallback to curated if needed)
  console.log("🔍 Fetching trending web development topics...");
  const currentTopics = await fetchTrendingTopics();

  return currentTopics.filter((topic) => {
    const topicKeywords = extractKeywords(topic);

    // Check if any keyword from the topic is already heavily used
    const isOverused = topicKeywords.some((keyword) => {
      const usageCount = usedKeywords.filter(
        (used) =>
          used.includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(used)
      ).length;
      return usageCount >= 2; // Topic considered overused if used 2+ times
    });

    return !isOverused;
  });
}

function extractKeywordsFromTitles(posts) {
  const allKeywords = [];

  posts.forEach((post) => {
    const keywords = extractKeywords(post.title);
    allKeywords.push(...keywords);
  });

  return allKeywords;
}

function extractKeywords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 3 &&
        ![
          "website",
          "berlin",
          "business",
          "company",
          "guide",
          "tips",
          "strategies",
        ].includes(word)
    );
}

function analyzeContentStructures(existingPosts) {
  const recentStructures = [];
  
  // Analyze last 10 posts for structure patterns
  const recentPosts = existingPosts.slice(0, 10);
  
  recentPosts.forEach(post => {
    if (!post.content) return;
    
    // Convert Contentful rich text to plain text for analysis
    const textContent = extractTextFromRichText(post.content);
    const structure = detectContentStructure(textContent);
    
    if (structure) {
      recentStructures.push({
        title: post.title,
        structure: structure.type,
        patterns: structure.patterns,
        publishedDate: post.publishedDate
      });
    }
  });
  
  return recentStructures;
}

function extractTextFromRichText(richTextContent) {
  if (typeof richTextContent === 'string') return richTextContent;
  
  // Handle Contentful rich text format
  if (richTextContent && richTextContent.content) {
    return richTextContent.content
      .map(node => extractTextFromNode(node))
      .join('\n');
  }
  
  return '';
}

function extractTextFromNode(node) {
  if (node.nodeType === 'text') {
    return node.value || '';
  }
  
  if (node.nodeType === 'heading-2') {
    const text = node.content?.map(child => extractTextFromNode(child)).join('') || '';
    return `## ${text}`;
  }
  
  if (node.nodeType === 'paragraph') {
    return node.content?.map(child => extractTextFromNode(child)).join('') || '';
  }
  
  if (node.content) {
    return node.content.map(child => extractTextFromNode(child)).join('');
  }
  
  return '';
}

function detectContentStructure(textContent) {
  const headings = textContent.match(/^## (.+)$/gm) || [];
  if (headings.length < 2) return null;
  
  const headingTexts = headings.map(h => h.replace('## ', '').toLowerCase());
  
  // Detect structure patterns
  if (headingTexts.some(h => h.includes('problem') || h.includes('challenge'))) {
    return { type: 'problem-solution', patterns: headingTexts };
  }
  
  if (headingTexts.some(h => h.includes('step') || h.includes('phase'))) {
    return { type: 'step-by-step', patterns: headingTexts };
  }
  
  if (headingTexts.some(h => h.includes('vs') || h.includes('comparison') || h.includes('option'))) {
    return { type: 'comparison', patterns: headingTexts };
  }
  
  if (headingTexts.some(h => h.includes('myth') || h.includes('truth') || h.includes('misconception'))) {
    return { type: 'myth-busting', patterns: headingTexts };
  }
  
  if (headingTexts.some(h => h.includes('trend') || h.includes('future') || h.includes('emerging'))) {
    return { type: 'trend-analysis', patterns: headingTexts };
  }
  
  if (headingTexts.some(h => h.includes('case') || h.includes('study') || h.includes('result'))) {
    return { type: 'case-study', patterns: headingTexts };
  }
  
  return { type: 'traditional', patterns: headingTexts };
}

async function checkTitleSimilarity(newTitle, existingPosts) {
  const newKeywords = extractKeywords(newTitle);

  for (const post of existingPosts) {
    const existingKeywords = extractKeywords(post.title);

    // Calculate similarity score
    const commonKeywords = newKeywords.filter((keyword) =>
      existingKeywords.some(
        (existing) => existing.includes(keyword) || keyword.includes(existing)
      )
    );

    const similarityScore =
      commonKeywords.length /
      Math.max(newKeywords.length, existingKeywords.length);

    // If more than 50% similarity, consider it a duplicate
    if (similarityScore > 0.5) {
      console.log(
        `⚠️ Title similarity detected: "${newTitle}" vs "${
          post.title
        }" (${Math.round(similarityScore * 100)}% similar)`
      );
      return true;
    }
  }

  return false;
}

export { generateBlogPost };

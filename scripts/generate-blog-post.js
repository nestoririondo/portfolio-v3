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
  "Website speed optimization for Berlin restaurants",
  "GDPR compliance for German small businesses",
  "Mobile-first design trends in 2025",
  "Local SEO strategies for Berlin companies",
  "E-commerce conversion optimization",
  "Website accessibility requirements in Germany",
  "Social media integration for business websites",
  "Content management system selection guide",
];

async function generateBlogPost(maxRetries = 3) {
  // Check for concurrent execution
  if (!createLock()) {
    return { 
      title: 'Concurrent execution prevented', 
      status: 'skipped',
      reason: 'Another blog generation already running'
    };
  }
  
  try {
    // Always fetch existing posts for duplicate checking and image selection
    console.log("🔍 Fetching existing posts to check for duplicates...");
    const existingPosts = await fetchExistingPosts();
  
  // Check for recent posts to prevent duplicate runs
  const recentPosts = existingPosts.filter(post => {
    const postDate = new Date(post.publishedDate || post.createdAt);
    const now = new Date();
    const diffMinutes = (now - postDate) / (1000 * 60);
    return diffMinutes < 30; // Posts created in last 30 minutes
  });
  
  if (recentPosts.length > 0) {
    console.log(`⏰ Found ${recentPosts.length} recent posts (last 30 minutes). Checking for duplicates...`);
    for (const recent of recentPosts) {
      console.log(`   - "${recent.title}" (${new Date(recent.publishedDate || recent.createdAt).toISOString()})`);
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
    const topicKeywords = forceTopic.toLowerCase().split(/[\s-_]+/);
    const duplicateByTopic = recentPosts.find(post => {
      const titleLower = post.title.toLowerCase();
      return topicKeywords.some(keyword => 
        keyword.length > 3 && titleLower.includes(keyword)
      );
    });
    
    if (duplicateByTopic) {
      console.log(`⚠️ Recent post about "${forceTopic}" already exists: "${duplicateByTopic.title}"`);
      console.log('🚫 Skipping to avoid duplicate content');
      return { 
        title: duplicateByTopic.title, 
        status: 'skipped',
        reason: 'Recent duplicate topic found'
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

    topic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
  }
  console.log(`📝 Selected topic: "${topic}"`);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Generating content for "${topic}"`);

      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: blogPromptTemplate(topic),
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
        await publishToContentful(validation, topic, existingPosts);
        return validation;
      } else {
        console.log(
          `❌ Attempt ${attempt} failed validation:`,
          validation.errors
        );

        if (attempt === maxRetries) {
          // Last attempt - publish anyway with fixes
          console.log("⚠️ Publishing with automatic fixes");
          const fixed = applyAutomaticFixes(validation);
          await publishToContentful(fixed, topic, existingPosts);
          return fixed;
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
    console.error('❌ Blog generation failed:', error);
    throw error;
  } finally {
    // Always remove lock when function exits
    removeLock();
  }
}

function applyAutomaticFixes(validation) {
  let { title, excerpt, content } = validation;

  // Fix title length
  if (title.length > 65) {
    title = title.substring(0, 65);
  }

  // Fix excerpt length - but try to end at complete words or sentences
  if (excerpt.length > 140) {
    // First try to cut at last period before 140 chars
    let cutPoint = excerpt.lastIndexOf(".", 135);
    if (cutPoint > 120) {
      excerpt = excerpt.substring(0, cutPoint + 1);
    } else {
      // If no period, try to cut at last complete word before 137 chars
      cutPoint = excerpt.lastIndexOf(" ", 137);
      if (cutPoint < 120) cutPoint = 137; // Fallback if no good word break
      excerpt = excerpt.substring(0, cutPoint) + ".";
    }
  } else if (excerpt.length < 120) {
    excerpt += " Learn more about improving your business website.";
    if (excerpt.length > 140) {
      // First try to cut at last period
      let cutPoint = excerpt.lastIndexOf(".", 135);
      if (cutPoint > 120) {
        excerpt = excerpt.substring(0, cutPoint + 1);
      } else {
        cutPoint = excerpt.lastIndexOf(" ", 137);
        if (cutPoint < 120) cutPoint = 137;
        excerpt = excerpt.substring(0, cutPoint) + ".";
      }
    }
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
    }));
  } catch (error) {
    console.error("❌ Error fetching existing posts:", error);
    return [];
  }
}

async function getAvailableTopics(existingPosts) {
  const usedKeywords = extractKeywordsFromTitles(existingPosts);

  return topics.filter((topic) => {
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

import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import contentfulManagementPkg from "contentful-management";
import * as contentfulPkg from "contentful";
import { createClient as createPexelsClient } from 'pexels';
import fetch from "node-fetch";

import { blogPromptTemplate } from "./blog-prompt-template.js";
import { validateAndCleanContent } from "./content-validator.js";
import { createLock, removeLock } from "./blog-lock.js";

const { createClient } = contentfulManagementPkg;
const { createClient: createContentfulClient } = contentfulPkg;

// Validate required environment variables
const requiredEnvVars = [
  "CLAUDE_API_KEY",
  "CONTENTFUL_MANAGEMENT_TOKEN",
  "CONTENTFUL_SPACE_ID",
  "CONTENTFUL_ACCESS_TOKEN",
  "PEXELS_API_KEY",
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

const pexels = createPexelsClient(process.env.PEXELS_API_KEY);

const topics = [
  // Business Growth & Digital Strategy
  "How a faster website can increase your Berlin restaurant's revenue by 30%",
  "Why your Berlin business needs a mobile-friendly website in 2025",
  "5 website improvements that boost customer trust for Berlin companies",
  "How online booking systems increase appointments for Berlin service businesses",
  "Why Berlin businesses lose customers with slow websites (and how to fix it)",
  "The complete guide to getting more customers through your website",
  "How to turn your Berlin business website into a sales machine",
  "Why professional photos on your website increase Berlin business sales",

  // Local Berlin Business Success
  "How Berlin cafes use their websites to build customer loyalty",
  "Digital marketing strategies that work for Berlin small businesses",
  "How to attract more local Berlin customers with smart web design",
  "Why Berlin businesses need professional email addresses (not Gmail)",
  "5 website features every Berlin restaurant must have in 2025",
  "How Berlin retail stores compete with Amazon using smart websites",
  "Local SEO secrets: Get your Berlin business found on Google",
  "How Berlin service providers get more bookings through their websites",

  // Customer Experience & Sales
  "Why customers abandon Berlin business websites (and how to stop it)",
  "How to make Berlin customers trust your business website instantly",
  "The psychology of website design: What makes Berlin customers buy",
  "How appointment booking systems save Berlin businesses time and money",
  "Why Berlin businesses need customer reviews on their websites",
  "Contact forms that actually get responses for Berlin companies",
  "How to showcase your Berlin business expertise through your website",
  "Website accessibility: Serving all Berlin customers better",

  // Online Sales & E-commerce
  "How Berlin businesses start selling online successfully",
  "Online payment solutions German customers actually use",
  "Why Berlin shops need websites that work on smartphones", 
  "How to sell products online: A guide for Berlin businesses",
  "Website security that protects your Berlin customers' data",
  "Email marketing that works for Berlin small businesses",
  "How Berlin businesses get customer reviews and testimonials",
  "Building customer trust: Essential website features for Berlin companies",

  // Legal & Compliance (Business-Friendly)
  "GDPR made simple: What Berlin businesses need to know",
  "Website legal requirements every Berlin business must follow",
  "Protecting customer data: Essential security for Berlin websites",
  "Cookie policies explained for Berlin business owners",
  "Accessibility laws: Making your Berlin website welcoming to everyone",
  "Business insurance for websites: Protecting your Berlin company online",
  "Terms of service and privacy policies for Berlin businesses",
  "Copyright and image rights for Berlin business websites",

  // Digital Marketing & Customer Acquisition  
  "Google Ads vs Facebook Ads: What works best for Berlin businesses",
  "Social media integration that brings customers to Berlin businesses",
  "Content marketing: How Berlin businesses become local authorities",
  "Email newsletters that Berlin customers actually read",
  "Online reputation management for Berlin companies",
  "How to get featured in Berlin business directories and guides",
  "Seasonal marketing: Timing promotions for Berlin businesses",
  "Customer referral programs that grow Berlin businesses",

  // Technology Made Simple (Business Benefits)
  "AI tools that help Berlin businesses work smarter, not harder",
  "Chatbots: How Berlin businesses provide 24/7 customer service",
  "Cloud storage solutions that protect Berlin business data",
  "Automation tools that save Berlin businesses time and money",
  "Voice search: How Berlin customers find businesses differently now",
  "Virtual reality marketing: The future for Berlin tourism businesses",
  "Smart analytics: Understanding your Berlin customers better",
  "Mobile apps vs websites: What Berlin businesses actually need",

  // Business Operations & Efficiency
  "How Berlin businesses manage their content without technical skills",
  "Backup strategies: Protecting your Berlin business website",
  "Domain names and hosting: Simple guide for Berlin business owners",
  "Website maintenance: Keeping your Berlin business site running smoothly",
  "Integration solutions: Connecting your website to business tools",
  "Customer management through your Berlin business website",
  "Inventory systems for Berlin retail businesses",
  "Appointment scheduling that works for Berlin service providers",

  // Measurement & Growth
  "Google Analytics explained for Berlin business owners",
  "Testing what works: Simple A/B testing for Berlin websites",
  "Understanding customer behavior on your Berlin business website",
  "Conversion tracking: Know which marketing brings in customers",
  "Website performance: Why speed matters for Berlin businesses",
  "Customer feedback tools for Berlin business improvement",
  "Making decisions based on data: Analytics for Berlin entrepreneurs",
  "Growth strategies using your website data for Berlin companies",

  // Business Development & Partnerships
  "Finding the right web developer for your Berlin business",
  "Project planning: Website redesign timeline for Berlin companies",
  "Budget planning: Website costs for Berlin small businesses",
  "Maintenance plans: Long-term website care for Berlin businesses",
  "Training staff on your new Berlin business website",
  "Partnerships with Berlin web agencies: What to expect",
  "Scaling your website as your Berlin business grows",
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

  // Modern Web Development & Frameworks (2025)
  "Next.js 15 vs Vite: Choosing the right framework for Berlin startups",
  "TypeScript adoption strategy for legacy JavaScript projects",
  "Server-side rendering performance optimization for e-commerce sites",
  "Progressive Web Apps implementation for Berlin retail businesses",
  "Headless CMS architecture for content-driven websites",
  "Micro-frontends: Breaking down monolithic web applications",
  "Edge computing benefits for Berlin-based web applications",
  "JAMstack deployment strategies for static site generation",

  // Performance & Optimization
  "Core Web Vitals optimization for better search rankings",
  "Image optimization techniques that reduce loading times by 60%",
  "Database query optimization for high-traffic web applications",
  "CDN implementation strategies for global content delivery",
  "Bundle splitting and code optimization for faster page loads",
  "Memory leak detection and prevention in JavaScript applications",
  "Browser caching strategies for improved user experience",
  "Lighthouse scoring optimization for professional websites",

  // Security & Best Practices
  "Modern authentication patterns: OAuth 2.0 vs WebAuthn",
  "API security best practices for client-facing applications",
  "Cross-site scripting (XSS) prevention in React applications",
  "Content Security Policy implementation for production websites",
  "HTTPS migration strategies for existing web applications",
  "Input validation and sanitization techniques",
  "Secure cookie handling and session management",
  "Vulnerability scanning integration in CI/CD pipelines",

  // Developer Experience & Tooling
  "VS Code extensions that boost web development productivity",
  "Git workflow optimization for solo developers and teams",
  "ESLint and Prettier configuration for consistent code quality",
  "Docker containerization for web development environments",
  "GitHub Actions automation for deployment and testing",
  "Package manager comparison: npm vs yarn vs pnpm",
  "Hot module replacement optimization for faster development",
  "Debugging techniques for complex React component trees",

  // API Development & Integration
  "RESTful API design principles for scalable web services",
  "GraphQL implementation benefits for data-heavy applications",
  "WebSocket integration for real-time web applications",
  "Third-party API integration best practices and error handling",
  "Rate limiting and throttling for API protection",
  "API documentation automation with OpenAPI/Swagger",
  "Webhook implementation for event-driven architectures",
  "Microservices communication patterns for web applications",

  // Testing & Quality Assurance
  "Test-driven development workflow for React components",
  "End-to-end testing automation with Playwright and Cypress",
  "Visual regression testing for design system consistency",
  "Performance testing strategies for web application optimization",
  "Accessibility testing automation in development workflows",
  "Unit testing patterns for JavaScript utility functions",
  "Integration testing for API endpoints and databases",
  "Cross-browser compatibility testing in modern workflows",

  // Freelance & Business Development
  "Client communication strategies for web development projects",
  "Project scoping and estimation techniques for freelance developers",
  "Portfolio optimization strategies that attract high-value clients",
  "Pricing strategies for web development services in 2025",
  "Contract templates and legal considerations for freelance work",
  "Time tracking and productivity tools for remote developers",
  "Building long-term client relationships through value delivery",
  "Technical debt communication strategies for non-technical stakeholders"
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

      // Check if we already have a recent post about this topic (more lenient)
      const topicKeywords = forceTopic.toLowerCase().split(/[\s-_]+/)
        .filter(keyword => keyword.length > 4)
        .filter(keyword => !['business', 'website', 'berlin', 'german', 'companies', 'guide', 'strategies'].includes(keyword)); // Exclude common words
      
      const duplicateByTopic = recentPosts.find((post) => {
        const titleLower = post.title.toLowerCase();
        const matchingKeywords = topicKeywords.filter(keyword => titleLower.includes(keyword));
        // Require at least 3 specific keywords to match, or 1 very specific keyword (10+ chars)
        return matchingKeywords.length >= 3 || 
               (matchingKeywords.length === 1 && matchingKeywords[0].length > 10);
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

          // Use content as-is without link enhancement
          const enhancedValidation = {
            ...validation,
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

            // Use fixed content as-is without link enhancement
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
    } else if (trimmed.length > 0) {
      // Regular paragraph - handle bold text and links
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

async function findUniqueImageFromResults(photos, usedImageUrls, topic) {
  if (!photos || photos.length === 0) return null;

  for (const photo of photos) {
    const photoId = photo.id.toString();
    // Check if this photo ID appears in any existing blog file names
    // (Contentful stores them as blog-{timestamp}.jpg containing the pexels ID)
    const isUsed = usedImageUrls.some((usedUrl) => usedUrl.includes(photoId));

    if (!isUsed) {
      console.log(`✅ Found unique image: ${photo.alt || "Professional image"}`);
      return {
        url: photo.src.large,
        alt: photo.alt || `Professional image related to ${topic}`,
        credit: `Photo by ${photo.photographer} on Pexels`,
        downloadUrl: photo.src.original,
        pexelsId: photo.id,
      };
    }
  }
  return null;
}

async function generateSmartSearchTerms(topic) {
  try {

    const prompt = `Given this blog post topic: "${topic}"

Generate 3 specific, visual image search terms that would find relevant professional stock photos on Pexels. Focus on CONCRETE VISUAL ELEMENTS:

CRITICAL REQUIREMENTS:
- PRIORITIZE THE MOST VISUALLY DISTINCTIVE ELEMENT first (coffee shop > blockchain, restaurant > analytics, etc.)
- Use SPECIFIC object combinations (laptop + screen + data, coffee + tablet + ordering)
- Include the EXACT TOOL/PLATFORM name when mentioned (Google Analytics, Docker, React, etc.)
- Focus on SCREENS, INTERFACES, and DEVICES showing the actual technology IN CONTEXT
- For business-specific topics, include the business environment (coffee shop, restaurant, office)

VISUAL PATTERNS THAT WORK:
- "coffee shop tablet ordering system"
- "restaurant pos system screen"
- "hair salon appointment booking tablet"
- "bakery point of sale system screen"
- "law firm office computer workspace"
- "art gallery digital exhibition screen"
- "fashion boutique online store laptop"
- "analytics dashboard laptop screen"  
- "google analytics interface computer"
- "docker terminal coding laptop"
- "blockchain cryptocurrency mobile app"

PRIORITIZATION RULES:
- Physical business (hair salon, bakery, restaurant, art gallery, law firm, fashion store) beats abstract tech (blockchain, AI, analytics)
- Specific tools/platforms (Google Analytics, Docker) beat generic terms (dashboard, interface)
- Industry context (beauty, legal, fashion, food, art, retail, fintech, healthcare, e-commerce) adds visual relevance
- Design/development topics MUST show screens, computers, coding, or workspace setups

CRITICAL FOR WEB/DESIGN TOPICS:
- "website design" → "web designer laptop mockups", "website wireframe computer screen"
- "website redesign" → "web development workspace laptop", "website design process computer"
- "web development" → "coding laptop screen programming", "web developer workspace setup"
- "digital agency" → "creative agency office workspace", "designers collaborating computers"

CRITICAL FOR DEVOPS/AUTOMATION TOPICS:
- "GitHub Actions" → "github code repository laptop screen", "ci cd pipeline dashboard computer"
- "deployment automation" → "deployment pipeline laptop interface", "server monitoring dashboard screen"
- "CI/CD pipeline" → "continuous integration laptop dashboard", "devops workflow computer screen"
- "Docker containerization" → "docker terminal laptop programming", "containerization development screen"
- "API testing" → "api testing laptop interface", "software testing computer dashboard"

CRITICAL FOR LEGAL/POLICY TOPICS:
- "cookie policies" → "website privacy settings screen", "gdpr compliance laptop interface"
- "privacy policy" → "website legal compliance laptop", "privacy settings computer screen"
- "GDPR compliance" → "data protection laptop dashboard", "privacy compliance computer interface"
- "terms of service" → "website legal terms laptop screen", "business compliance computer"

CRITICAL FOR SPECIFIC BUSINESS TYPES:
- "hair salon" → "hair salon interior workspace", "hairstylist client consultation", "salon appointment booking tablet"
- "bakery" → "bakery counter display case", "bakery point of sale system", "artisan bakery workspace"
- "law firm" → "law firm office workspace", "lawyer computer desktop", "legal documents laptop screen"
- "art gallery" → "art gallery exhibition space", "gallery digital display screen", "art collection computer interface"
- "fashion boutique" → "clothing store interior display", "fashion retail point of sale", "boutique online shopping laptop"
- "späti convenience store" → "convenience store interior shelves", "small shop counter workspace", "local store point of sale"
- "advertising agency" → "creative agency office workspace", "ad campaign laptop design", "marketing team collaboration"
- "real estate" → "real estate office laptop", "property listing computer screen", "realtor workspace setup"
- "fitness center" → "gym equipment digital interface", "fitness app smartphone screen", "health club workspace"
- "dental practice" → "dental office computer system", "medical appointment booking tablet", "healthcare workspace setup"

VISUAL PATTERNS TO AVOID:
- "person analyzing data" (too vague)
- "business meeting analytics" (generic)
- "professional dashboard review" (no specific tool)
- "mobile app interface" (too generic)
- "people on sofa" or "family photos" (completely irrelevant)
- "timeline" without context (leads to random calendar/family photos)

Examples:
Topic: "Google Analytics for businesses" → "google analytics dashboard screen", "website analytics laptop interface", "data charts computer monitor"
Topic: "Blockchain loyalty programs for coffee shops" → "coffee shop digital loyalty tablet", "cafe pos system blockchain", "coffee ordering app smartphone"
Topic: "Docker for fintech" → "docker terminal fintech development", "fintech application containers laptop", "financial software development screen"
Topic: "Website redesign timeline" → "web designer laptop wireframes", "website mockup computer screen", "web development workspace setup"
Topic: "Web development process" → "coding laptop programming screen", "web developer workspace computer", "website design laptop mockups"
Topic: "Cookie policies for businesses" → "website privacy settings screen", "gdpr compliance laptop interface", "privacy policy computer dashboard"
Topic: "GitHub Actions automation" → "github repository laptop screen", "ci cd pipeline dashboard interface", "deployment automation computer terminal"
Topic: "API testing strategies" → "api testing laptop dashboard", "software testing computer screen", "testing automation development interface"
Topic: "Instagram marketing for hair salons" → "hair salon interior workspace", "hairstylist client consultation tablet", "salon social media laptop screen"
Topic: "Online booking for Berlin spätis" → "convenience store point of sale", "small shop counter workspace", "local store digital interface"
Topic: "Portfolio websites for law firms" → "law firm office workspace", "lawyer computer desktop", "legal services laptop interface"
Topic: "Digital exhibitions for art galleries" → "art gallery exhibition space", "gallery digital display screen", "art collection computer interface"
Topic: "E-commerce for fashion boutiques" → "clothing store interior display", "fashion retail laptop interface", "boutique online shopping screen"
Topic: "Creative agency portfolio design" → "creative agency office workspace", "ad campaign laptop design", "marketing team collaboration computer"

Return only the 3 search terms, separated by commas, no explanations.`;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 150,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const searchTerms = response.content[0].text.trim().split(',');
    
    // Return the first search term, cleaned up
    const primaryTerm = searchTerms[0]?.trim() || topic;
    console.log(`🤖 AI-generated search terms: ${searchTerms.join(', ')}`);
    console.log(`🎯 Using primary term: "${primaryTerm}"`);
    
    return primaryTerm;
  } catch (error) {
    console.log(`⚠️ AI search term generation failed: ${error.message}`);
    
    // Enhanced fallback: specific tool/platform detection
    const lowercaseTopic = topic.toLowerCase();
    
    // Specific platform/tool detection
    if (lowercaseTopic.includes('google analytics')) {
      return "google analytics dashboard computer screen";
    }
    if (lowercaseTopic.includes('analytics')) {
      return "analytics dashboard laptop interface";
    }
    if (lowercaseTopic.includes('docker')) {
      return "docker terminal laptop development";
    }
    if (lowercaseTopic.includes('react')) {
      return "react code editor programming screen";
    }
    if (lowercaseTopic.includes('vue')) {
      return "vue framework development laptop";
    }
    if (lowercaseTopic.includes('typescript')) {
      return "typescript code editor laptop screen";
    }
    if (lowercaseTopic.includes('javascript')) {
      return "javascript programming laptop screen";
    }
    if (lowercaseTopic.includes('email') && lowercaseTopic.includes('marketing')) {
      return "email marketing dashboard laptop screen";
    }
    if (lowercaseTopic.includes('booking') || lowercaseTopic.includes('appointment')) {
      return "appointment booking app smartphone screen";
    }
    if (lowercaseTopic.includes('payment')) {
      return "payment processing laptop interface";
    }
    if (lowercaseTopic.includes('security')) {
      return "cybersecurity dashboard computer screen";
    }
    if (lowercaseTopic.includes('seo')) {
      return "seo analytics dashboard laptop";
    }
    
    // Generic tech/business fallback
    const words = topic.toLowerCase().split(/\s+/);
    const techTerms = words.filter(word => 
      ['development', 'programming', 'coding', 'website', 'app', 'mobile', 
       'digital', 'online', 'automation', 'ai', 'database'].includes(word)
    );
    
    if (techTerms.length > 0) {
      return `${techTerms[0]} laptop screen interface`;
    }
    
    return "laptop computer screen interface";
  }
}

async function fetchPexelsImage(topic, existingPosts = []) {
  try {
    // Get list of used image URLs once
    const usedImageUrls = existingPosts
      .map((post) => post.featuredImageUrl)
      .filter(Boolean)
      .map((url) => url.replace("https:", ""));

    console.log(`🔍 Checking against ${usedImageUrls.length} existing images`);

    // Strategy 1: AI-powered smart topic-to-image mapping
    const smartKeywords = await generateSmartSearchTerms(topic);
    console.log(`🖼️ Strategy 1 - Searching Pexels for: "${smartKeywords}"`);

    let result = await pexels.photos.search({
      query: smartKeywords,
      page: 1,
      per_page: 20,
      orientation: 'landscape',
      size: 'large'
    });

    let uniqueImage = await findUniqueImageFromResults(result.photos, usedImageUrls, topic);
    if (uniqueImage) return uniqueImage;

    // Strategy 2: Topic-specific alternatives (avoid generic business terms)
    const alternativeKeywords = [
      `${smartKeywords.split(' ')[0]} workspace setup`, // First word + workspace
      `computer screen ${smartKeywords.split(' ').pop()}`, // Computer screen + last word  
      `digital ${smartKeywords.replace(/business|meeting|office/g, 'technology')}`, // Replace generic terms
      `creative ${smartKeywords.replace(/professional|business/g, 'workspace')}`, // More creative approach
      `modern ${smartKeywords.split(' ').slice(-2).join(' ')}`  // Modern + last 2 words
    ];

    for (const altKeyword of alternativeKeywords) {
      console.log(`🔄 Strategy 2 - Trying alternative: "${altKeyword}"`);
      
      result = await pexels.photos.search({
        query: altKeyword,
        page: Math.floor(Math.random() * 3) + 1, // Random page
        per_page: 15,
        orientation: 'landscape',
        size: 'large'
      });

      uniqueImage = await findUniqueImageFromResults(result.photos, usedImageUrls, topic);
      if (uniqueImage) return uniqueImage;
    }

    // Strategy 3: Visual concept categories (avoid handshake/meeting images)
    const categoryTerms = [
      "laptop screen website design",
      "smartphone app interface",
      "computer dashboard analytics",
      "tablet digital workspace", 
      "keyboard coding development",
      "monitor web development",
      "phone digital marketing",
      "workspace creative setup"
    ];

    for (const category of categoryTerms) {
      console.log(`🎯 Strategy 3 - Trying category: "${category}"`);
      
      result = await pexels.photos.search({
        query: category,
        page: Math.floor(Math.random() * 5) + 1, // Random page 1-5
        per_page: 15,
        orientation: 'landscape',
        size: 'large'
      });

      uniqueImage = await findUniqueImageFromResults(result.photos, usedImageUrls, topic);
      if (uniqueImage) return uniqueImage;
    }

    // If all strategies fail, use fallback
    console.log("⚠️ All search strategies exhausted, trying fallback");
    return await fetchFallbackImage(existingPosts);
  } catch (error) {
    console.error("❌ Error fetching image:", error);
    return await fetchFallbackImage(existingPosts);
  }
}

async function fetchFallbackImage(existingPosts = []) {
  try {
    const fallbackQueries = [
      "laptop computer screen code",
      "website design interface",
      "digital device workspace",
      "computer programming setup",
      "technology workspace minimal",
      "web development screen",
      "mobile app development",
      "creative workspace setup"
    ];

    const usedImageUrls = existingPosts
      .map((post) => post.featuredImageUrl)
      .filter(Boolean)
      .map((url) => url.replace("https:", ""));

    for (const query of fallbackQueries) {
      console.log(`🔄 Trying fallback search: "${query}"`);

      const result = await pexels.photos.search({
        query,
        page: 1,
        per_page: 10,
        orientation: 'landscape',
        size: 'large'
      });

      const photos = result.photos;
      if (photos && photos.length > 0) {
        // Find an unused photo from this fallback search
        for (const photo of photos) {
          const isUsed = usedImageUrls.some(
            (usedUrl) =>
              usedUrl.includes(photo.id) ||
              photo.src.large.includes(photo.id)
          );

          if (!isUsed) {
            console.log(
              `✅ Found unique fallback image: ${
                photo.alt || "Professional image"
              }`
            );
            return {
              url: photo.src.large,
              alt: photo.alt || "Business technology image",
              credit: `Photo by ${photo.photographer} on Pexels`,
              downloadUrl: photo.src.original,
              pexelsId: photo.id,
            };
          }
        }
      }
    }

    console.log("⚠️ Could not find any unique fallback images, trying more creative searches...");
    
    // Try more creative, specific searches with random elements
    const creativeQueries = [
      "abstract technology pattern",
      "minimalist office setup",
      "coding screen dark theme",
      "futuristic digital interface",
      "professional workspace setup",
      "team collaboration meeting",
      "startup office environment",
      "creative workspace design",
      "tech innovation concept",
      "digital transformation visual"
    ];
    
    // Shuffle the array and try a few random ones
    const shuffledQueries = creativeQueries.sort(() => Math.random() - 0.5).slice(0, 5);
    
    for (const query of shuffledQueries) {
      console.log(`🎨 Trying creative search: "${query}"`);
      
      const result = await pexels.photos.search({
        query,
        page: Math.floor(Math.random() * 3) + 1, // Random page 1-3
        per_page: 15,
        orientation: 'landscape',
        size: 'large'
      });

      if (result.photos && result.photos.length > 0) {
        // Try to find any unused image, be less strict
        for (const photo of result.photos) {
          const photoId = photo.id.toString();
          const isStrictlyUsed = usedImageUrls.some(usedUrl => usedUrl.includes(photoId));
          
          if (!isStrictlyUsed) {
            console.log(`✅ Found creative unique image: ${photo.alt || "Creative professional image"}`);
            return {
              url: photo.src.large,
              alt: photo.alt || "Professional creative image",
              credit: `Photo by ${photo.photographer} on Pexels`,
              downloadUrl: photo.src.original,
              pexelsId: photo.id,
            };
          }
        }
      }
    }
    
    console.log("⚠️ Still no unique images found, using guaranteed fallback...");
    
    // Final guaranteed fallback - use a very specific search that's unlikely to be used
    const guaranteedResult = await pexels.photos.search({
      query: `abstract gradient ${Math.random().toString(36).substring(7)}`, // Random search
      page: 1,
      per_page: 5,
      orientation: 'landscape',
      size: 'large'
    });
    
    if (guaranteedResult.photos && guaranteedResult.photos.length > 0) {
      const photo = guaranteedResult.photos[0];
      console.log(`✅ Using guaranteed fallback image: ${photo.alt || "Abstract professional image"}`);
      return {
        url: photo.src.large,
        alt: photo.alt || "Professional abstract image",
        credit: `Photo by ${photo.photographer} on Pexels`,
        downloadUrl: photo.src.original,
        pexelsId: photo.id,
      };
    }
    
  } catch (error) {
    console.error("❌ Fallback image error:", error);
  }
  
  // Absolute final fallback - return null and let the system handle it
  console.log("❌ All image searches failed");
  return null;
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
            fileName: `blog-pexels-${imageData.pexelsId}-${Date.now()}.jpg`,
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
    const imageData = await fetchPexelsImage(topic, existingPosts);

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
      if (result === null) {
        console.log("⚠️ No blog post generated - all topics are duplicates or unavailable");
        process.exit(0);
      } else {
        console.log("🎉 Blog post generated successfully:", result.title);
        process.exit(0);
      }
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

  // Use curated business-focused topics instead of technical trending topics
  console.log("🔍 Selecting from business-focused topic list...");
  const currentTopics = topics; // Use our curated business topics

  return currentTopics.filter((topic) => {
    const topicKeywords = extractKeywords(topic);

    // Check if any keyword from the topic is already heavily used (more lenient)
    const isOverused = topicKeywords.some((keyword) => {
      const usageCount = usedKeywords.filter(
        (used) =>
          used.includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(used)
      ).length;
      return usageCount >= 4; // Topic considered overused if used 4+ times (was 2+)
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
        word.length > 4 &&
        ![
          "website",
          "berlin",
          "business",
          "company",
          "guide",
          "tips",
          "strategies",
          "unlock",
          "power",
          "your",
          "with",
          "2025"
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

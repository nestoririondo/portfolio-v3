import { trendsFetcher } from "./fetch-current-trends.js";

/**
 * Automatically selects trending topics for blog generation
 */
class TrendingTopicSelector {
  constructor() {
    this.usedTopics = new Set();
    this.topicHistory = [];
  }

  /**
   * Check if a topic is a duplicate based on existing posts
   */
  isTopicDuplicate(topic, existingPosts = []) {
    if (!existingPosts || existingPosts.length === 0) return false;

    const topicLower = topic.toLowerCase();
    const isSeasonalTopic = 
      topicLower.includes("black friday") ||
      topicLower.includes("christmas") ||
      topicLower.includes("holiday") ||
      topicLower.includes("new year") ||
      topicLower.includes("valentine") ||
      topicLower.includes("easter") ||
      topicLower.includes("summer") ||
      topicLower.includes("winter");

    // Check recent posts (last 7 days for seasonal topics to be more strict)
    const daysToCheck = isSeasonalTopic ? 7 : 3;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToCheck);

    const recentPosts = existingPosts.filter((post) => {
      const postDate = new Date(post.publishedDate || post.createdAt);
      return postDate > cutoffDate;
    });

    if (recentPosts.length === 0) return false;

    if (isSeasonalTopic) {
      // For seasonal topics, check for exact phrase matches
      const seasonalKeywords = [];
      if (topicLower.includes("black friday")) seasonalKeywords.push("black friday");
      if (topicLower.includes("christmas")) seasonalKeywords.push("christmas");
      if (topicLower.includes("holiday")) seasonalKeywords.push("holiday");
      if (topicLower.includes("new year")) seasonalKeywords.push("new year");
      if (topicLower.includes("valentine")) seasonalKeywords.push("valentine");
      if (topicLower.includes("easter")) seasonalKeywords.push("easter");
      if (topicLower.includes("summer")) seasonalKeywords.push("summer");
      if (topicLower.includes("winter")) seasonalKeywords.push("winter");

      return recentPosts.some((post) => {
        const titleLower = post.title.toLowerCase();
        return seasonalKeywords.some(keyword => titleLower.includes(keyword));
      });
    }

    // For non-seasonal topics, use keyword matching
    const topicKeywords = topicLower
      .split(/[\s-_]+/)
      .filter((keyword) => keyword.length > 4)
      .filter(
        (keyword) =>
          ![
            "business",
            "website",
            "berlin",
            "german",
            "companies",
            "guide",
            "strategies",
          ].includes(keyword)
      );

    return recentPosts.some((post) => {
      const titleLower = post.title.toLowerCase();
      const matchingKeywords = topicKeywords.filter((keyword) =>
        titleLower.includes(keyword)
      );
      return (
        matchingKeywords.length >= 3 ||
        (matchingKeywords.length === 1 && matchingKeywords[0].length > 10)
      );
    });
  }

  /**
   * Detect seasonal events and special dates
   * @param {Array} existingPosts - Array of existing blog posts to check for duplicates
   */
  detectSeasonalEvent(existingPosts = []) {
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const dayOfMonth = now.getDate();

    // New Year period (January 1-15)
    if (month === 'January' && dayOfMonth <= 15) {
      const newYearTopics = [
        'New Year website resolutions for Berlin businesses',
        'Q1 digital transformation strategies for German companies',
        'Website refresh planning for the new year',
        'Setting digital goals for Berlin startups in 2025'
      ];
      const topicIndex = dayOfMonth % newYearTopics.length;
      
      return {
        topic: newYearTopics[topicIndex],
        priority: 50,
        category: 'seasonal'
      };
    }

    // Valentine's Day period (February 10-20)
    if (month === 'February' && dayOfMonth >= 10 && dayOfMonth <= 20) {
      return {
        topic: 'Valentine\'s Day marketing strategies for Berlin retailers',
        priority: 45,
        category: 'seasonal'
      };
    }

    // Spring period (March-April)
    if (month === 'March' || month === 'April') {
      return {
        topic: 'Spring website refresh for Berlin businesses',
        priority: 40,
        category: 'seasonal'
      };
    }

    // GDPR Anniversary (May 20-30)
    if (month === 'May' && dayOfMonth >= 20 && dayOfMonth <= 30) {
      return {
        topic: 'GDPR compliance updates for German businesses',
        priority: 55,
        category: 'seasonal'
      };
    }

    // Summer preparation (June-July)
    if (month === 'June' || month === 'July') {
      return {
        topic: 'Summer mobile optimization for Berlin tourism businesses',
        priority: 40,
        category: 'seasonal'
      };
    }

    // Back to school/business (August-September)
    if (month === 'August' || month === 'September') {
      return {
        topic: 'Back-to-business website strategies for Berlin companies',
        priority: 42,
        category: 'seasonal'
      };
    }

    // Black Friday preparation (October-November)
    if (month === 'October' || month === 'November') {
      // Rotate through different Black Friday topics to avoid duplicates
      const blackFridayTopics = [
        'E-commerce optimization for Black Friday in Germany',
        'Payment gateway setup for Black Friday sales surge',
        'Website loading speed crucial for holiday shopping',
        'Customer service automation during Black Friday rush',
        'GDPR compliance for Black Friday email campaigns',
        'Analytics tracking for holiday season performance'
      ];
      
      // Filter out topics that are already used in recent posts
      const availableTopics = blackFridayTopics.filter(topic => 
        !this.isTopicDuplicate(topic, existingPosts)
      );

      if (availableTopics.length === 0) {
        // All Black Friday topics are duplicates, return null to skip seasonal
        console.log('⚠️ All Black Friday topics already used recently, skipping seasonal topic');
        return null;
      }

      // Use day of month to select from available topics
      const topicIndex = dayOfMonth % availableTopics.length;
      
      return {
        topic: availableTopics[topicIndex],
        priority: 50,
        category: 'seasonal'
      };
    }

    // Holiday season (December)
    if (month === 'December') {
      const holidayTopics = [
        'Holiday season website performance for Berlin retailers',
        'Christmas e-commerce optimization for German businesses',
        'End-of-year website security checkup for Berlin companies',
        'Holiday traffic management for online stores',
        'Year-end analytics review for German websites'
      ];
      
      // Filter out topics that are already used in recent posts
      const availableTopics = holidayTopics.filter(topic => 
        !this.isTopicDuplicate(topic, existingPosts)
      );

      if (availableTopics.length === 0) {
        // All holiday topics are duplicates, return null to skip seasonal
        console.log('⚠️ All holiday topics already used recently, skipping seasonal topic');
        return null;
      }

      const topicIndex = dayOfMonth % availableTopics.length;
      
      return {
        topic: availableTopics[topicIndex],
        priority: 48,
        category: 'seasonal'
      };
    }

    return null;
  }

  /**
   * Get current trending topics from tech landscape
   */
  getCurrentTrendingTopics() {
    
    const trendingTopics = [
      { topic: 'AI integration for Berlin business websites', priority: 45 },
      { topic: 'Sustainable web development practices in Germany', priority: 40 },
      { topic: 'Web3 and blockchain for German startups', priority: 35 },
      { topic: 'Progressive Web Apps for Berlin retailers', priority: 42 },
      { topic: 'Voice search optimization for German businesses', priority: 38 },
      { topic: 'Core Web Vitals optimization for e-commerce', priority: 44 },
      { topic: 'Headless CMS adoption in German market', priority: 36 },
      { topic: 'WebAssembly performance benefits for business apps', priority: 33 },
    ];

    // Return random trending topic
    const randomIndex = Math.floor(Math.random() * trendingTopics.length);
    return {
      ...trendingTopics[randomIndex],
      category: 'trending'
    };
  }

  /**
   * Extract actionable blog topics from trends
   */
  async extractBlogTopics() {
    const trends = await trendsFetcher.getAllTrends();

    const blogTopics = [];

    // Process technology trends
    const techTrends = trends.filter((t) => t.type === "tech");
    techTrends.forEach((trend) => {
      const topicIdeas = this.generateTopicVariations(trend.trend, "tech");
      blogTopics.push(...topicIdeas);
    });

    // Process content trends from dev.to
    const contentTrends = trends.filter((t) => t.type === "content");
    contentTrends.forEach((trend) => {
      const topicIdeas = this.generateTopicVariations(trend.trend, "content");
      blogTopics.push(...topicIdeas);
    });

    // Process business trends
    const businessTrends = trends.filter((t) => t.type === "business");
    businessTrends.forEach((trend) => {
      const topicIdeas = this.generateTopicVariations(trend.trend, "business");
      blogTopics.push(...topicIdeas);
    });

    // Process local SEO trends (high-intent keywords)
    const localSeoTrends = trends.filter((t) => t.type === "local_seo");
    localSeoTrends.forEach((trend) => {
      const topicIdeas = this.generateTopicVariations(trend.trend, "local_seo");
      blogTopics.push(...topicIdeas);
    });

    return blogTopics;
  }

  /**
   * Generate blog topic variations from a trend
   */
  generateTopicVariations(trendText, category) {
    const variations = [];
    const currentYear = new Date().getFullYear();

    // Clean up the trend text
    const cleanTrend = trendText
      .replace(/[^\w\s-]/g, "")
      .toLowerCase()
      .trim();

    // Define diverse topic patterns based on category
    const patterns = {
      tech: [
        // Original business-focused patterns
        `implementing ${cleanTrend} for business growth`,
        `${cleanTrend} best practices for Berlin businesses`,
        `how ${cleanTrend} improves website performance`,
        `${cleanTrend} integration strategies`,
        `why ${cleanTrend} matters in ${currentYear}`,
        `${cleanTrend} for small business websites`,
        `${cleanTrend} ROI and business impact`,
        `getting started with ${cleanTrend}`,
        
        // NEW: Problem-solving patterns
        `the ${cleanTrend} mistake costing German businesses money`,
        `why most Berlin websites fail at ${cleanTrend}`,
        `common ${cleanTrend} problems and how to fix them`,
        `avoiding ${cleanTrend} pitfalls in German market`,
        
        // NEW: Comparison patterns
        `${cleanTrend} vs traditional approaches: Berlin case study`,
        `${cleanTrend} alternatives for budget-conscious businesses`,
        `when to choose ${cleanTrend} over competitors`,
        
        // NEW: Success story patterns
        `how Berlin startup used ${cleanTrend} to scale globally`,
        `real results: ${cleanTrend} increases revenue for local company`,
        `Berlin business transforms with ${cleanTrend} implementation`,
        
        // NEW: Compliance and local patterns
        `${cleanTrend} GDPR compliance for German businesses`,
        `${cleanTrend} requirements in German market`,
        `${cleanTrend} localization for European customers`,
      ],
      content: [
        // Original patterns
        `business applications of ${cleanTrend}`,
        `${cleanTrend} for Berlin companies`,
        `implementing ${cleanTrend} strategies`,
        `${cleanTrend} best practices guide`,
        `${cleanTrend} case studies and results`,
        
        // NEW: Educational patterns
        `complete ${cleanTrend} guide for German businesses`,
        `${cleanTrend} explained: what Berlin business owners need to know`,
        `${cleanTrend} trends shaping German digital landscape`,
        
        // NEW: Action-oriented patterns
        `5 ways Berlin businesses can leverage ${cleanTrend}`,
        `step-by-step ${cleanTrend} implementation for SMEs`,
        `${cleanTrend} checklist for German market entry`,
      ],
      business: [
        // Original patterns
        `${cleanTrend} implementation guide`,
        `${cleanTrend} for website optimization`,
        `${cleanTrend} strategy development`,
        `${cleanTrend} cost-benefit analysis`,
        `${cleanTrend} checklist for businesses`,
        
        // NEW: Strategic patterns
        `${cleanTrend} competitive advantage in Berlin market`,
        `future-proofing your business with ${cleanTrend}`,
        `${cleanTrend} investment priorities for German SMEs`,
        
        // NEW: Practical patterns
        `${cleanTrend} tools every Berlin business needs`,
        `measuring ${cleanTrend} success: KPIs that matter`,
        `${cleanTrend} budget planning for growing companies`,
      ],
      local_seo: [
        // Direct keyword targeting patterns
        `complete guide to ${cleanTrend}`,
        `${cleanTrend}: what you need to know`,
        `choosing the right ${cleanTrend.replace(/cost|rates|pricing/g, 'service')}`,
        `${cleanTrend.replace(/\d{4}/g, '')} explained for business owners`,
        
        // Problem-solving patterns
        `avoiding common mistakes with ${cleanTrend.replace(/cost|rates|pricing/g, 'selection')}`,
        `how to find reliable ${cleanTrend.replace(/cost|rates|pricing|Berlin|Germany/g, '').trim()}`,
        
        // Comparison patterns  
        `${cleanTrend.replace(/cost|rates|pricing/g, 'options')} compared`,
        `freelance vs agency ${cleanTrend.replace(/cost|rates|pricing|Berlin|Germany/g, '').trim()}`,
        
        // Local market patterns
        `Berlin market insights for ${cleanTrend.replace(/Berlin|Germany|\d{4}/g, '').trim()}`,
        `German compliance requirements for ${cleanTrend.replace(/cost|rates|pricing|Berlin|Germany/g, '').trim()}`,
      ],
    };

    // Generate variations for this category
    const categoryPatterns = patterns[category] || patterns.tech;

    categoryPatterns.forEach((pattern) => {
      variations.push({
        topic: pattern,
        category,
        source: trendText,
        priority: this.calculateTopicPriority(pattern, category),
      });
    });

    return variations;
  }

  /**
   * Calculate priority score for topic selection
   */
  calculateTopicPriority(topic, category) {
    let score = 0;

    // Higher priority keywords
    const highPriorityKeywords = [
      "ai",
      "artificial intelligence",
      "mobile",
      "seo",
      "performance",
      "security",
      "accessibility",
      "gdpr",
      "optimization",
      "automation",
      "pwa",
      "progressive web",
      "core web vitals",
      "voice search",
    ];

    // Medium priority keywords
    const mediumPriorityKeywords = [
      "javascript",
      "typescript",
      "react",
      "vue",
      "angular",
      "nextjs",
      "hosting",
      "cms",
      "e-commerce",
      "analytics",
      "conversion",
    ];

    // Check for high priority keywords
    highPriorityKeywords.forEach((keyword) => {
      if (topic.toLowerCase().includes(keyword)) {
        score += 10;
      }
    });

    // Check for medium priority keywords
    mediumPriorityKeywords.forEach((keyword) => {
      if (topic.toLowerCase().includes(keyword)) {
        score += 5;
      }
    });

    // Category bonuses
    if (category === "local_seo") score += 8; // Highest priority for local keywords
    if (category === "tech") score += 3;
    if (category === "business") score += 2;
    if (category === "content") score += 1;

    // Berlin business relevance
    if (
      topic.includes("berlin") ||
      topic.includes("business") ||
      topic.includes("website")
    ) {
      score += 5;
    }

    // Penalize if already used recently
    if (this.usedTopics.has(topic)) {
      score -= 20;
    }

    return score;
  }

  /**
   * Select the best trending topic for blog generation
   * Now includes seasonal event detection and priority handling
   * @param {Object} options - Options including forceTopic, useTrending, and existingPosts
   */
  async selectTrendingTopic(options = {}) {
    console.log("🔍 Analyzing current trends for blog topics...");

    // Check for forced topic (from GitHub Actions or manual override)
    if (options.forceTopic) {
      console.log(`🎯 Using forced topic: ${options.forceTopic}`);
      return {
        topic: options.forceTopic,
        metadata: {
          source: 'manual-override',
          category: 'forced',
          priority: 100,
          trendBased: false,
        },
      };
    }

    // Check for seasonal events first (highest priority)
    // Pass existing posts to check for duplicates
    const seasonalEvent = this.detectSeasonalEvent(options.existingPosts || []);
    if (seasonalEvent && !this.usedTopics.has(seasonalEvent.topic)) {
      // Check if we've already used a seasonal topic today
      const today = new Date().toDateString();
      const todaysSeasonalTopics = this.topicHistory.filter(entry => {
        const entryDate = new Date(entry.timestamp).toDateString();
        return entryDate === today && entry.source === 'seasonal-detection';
      });

      // Limit seasonal topics to 1 per day to avoid overwhelming seasonal content
      if (todaysSeasonalTopics.length === 0) {
        console.log(`🎉 Using seasonal event topic: ${seasonalEvent.topic}`);
        
        this.usedTopics.add(seasonalEvent.topic);
        this.topicHistory.push({
          topic: seasonalEvent.topic,
          timestamp: new Date().toISOString(),
          source: 'seasonal-detection',
          category: seasonalEvent.category,
          priority: seasonalEvent.priority,
        });

        return {
          topic: seasonalEvent.topic,
          metadata: {
            source: 'seasonal-detection',
            category: seasonalEvent.category,
            priority: seasonalEvent.priority,
            trendBased: false,
          },
        };
      } else {
        console.log(`⏭️ Already used seasonal topic today, trying trending instead`);
      }
    }

    // Check trending topics (second priority)
    if (options.useTrending !== false && Math.random() > 0.3) {
      const trendingTopic = this.getCurrentTrendingTopics();
      if (!this.usedTopics.has(trendingTopic.topic)) {
        console.log(`🔥 Using trending topic: ${trendingTopic.topic}`);
        
        this.usedTopics.add(trendingTopic.topic);
        this.topicHistory.push({
          topic: trendingTopic.topic,
          timestamp: new Date().toISOString(),
          source: 'trending-detection',
          category: trendingTopic.category,
          priority: trendingTopic.priority,
        });

        return {
          topic: trendingTopic.topic,
          metadata: {
            source: 'trending-detection',
            category: trendingTopic.category,
            priority: trendingTopic.priority,
            trendBased: true,
          },
        };
      }
    }

    // Use regular topic extraction (third priority)
    const blogTopics = await this.extractBlogTopics();

    // Sort by priority and filter out recent topics
    const sortedTopics = blogTopics
      .sort((a, b) => b.priority - a.priority)
      .filter((topic) => !this.usedTopics.has(topic.topic));

    if (sortedTopics.length === 0) {
      console.log("⚠️ No new trending topics found, using fallback");
      return this.getFallbackTopic();
    }

    const selectedTopic = sortedTopics[0];

    // Mark as used
    this.usedTopics.add(selectedTopic.topic);
    this.topicHistory.push({
      topic: selectedTopic.topic,
      timestamp: new Date().toISOString(),
      source: selectedTopic.source,
      category: selectedTopic.category,
      priority: selectedTopic.priority,
    });

    // Keep history manageable (last 50 topics)
    if (this.topicHistory.length > 50) {
      this.topicHistory = this.topicHistory.slice(-50);
      // Clear used topics older than 30 days
      this.clearOldUsedTopics();
    }

    console.log(`✅ Selected trending topic: "${selectedTopic.topic}"`);
    console.log(
      `📊 Priority score: ${selectedTopic.priority}, Source: "${selectedTopic.source}"`
    );

    return {
      topic: selectedTopic.topic,
      metadata: {
        source: selectedTopic.source,
        category: selectedTopic.category,
        priority: selectedTopic.priority,
        trendBased: true,
      },
    };
  }

  /**
   * Get fallback topics when no trends are available
   */
  getFallbackTopic() {
    const fallbackTopics = [
      "website performance optimization for Berlin businesses",
      "mobile-first design implementation strategies",
      "GDPR compliance for business websites",
      "SEO best practices for local businesses",
      "e-commerce conversion rate optimization",
      "website accessibility compliance guide",
      "progressive web app development benefits",
      "website security best practices",
      "content management system selection",
      "digital marketing integration strategies",
    ];

    // Select a fallback topic not recently used
    const availableTopics = fallbackTopics.filter(
      (topic) => !this.usedTopics.has(topic)
    );

    if (availableTopics.length === 0) {
      // If all fallback topics used, clear the set and use first topic
      this.usedTopics.clear();
      return {
        topic: fallbackTopics[0],
        metadata: {
          source: "fallback",
          category: "business",
          priority: 1,
          trendBased: false,
        },
      };
    }

    const selectedTopic =
      availableTopics[Math.floor(Math.random() * availableTopics.length)];
    this.usedTopics.add(selectedTopic);

    return {
      topic: selectedTopic,
      metadata: {
        source: "fallback",
        category: "business",
        priority: 1,
        trendBased: false,
      },
    };
  }

  /**
   * Clear topics older than 30 days from used set
   */
  clearOldUsedTopics() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    this.topicHistory = this.topicHistory.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      const keepEntry = entryDate > thirtyDaysAgo;

      if (!keepEntry) {
        this.usedTopics.delete(entry.topic);
      }

      return keepEntry;
    });
  }

  /**
   * Get topic selection statistics
   */
  getStats() {
    const recentHistory = this.topicHistory.slice(-10);
    const trendBasedCount = recentHistory.filter(
      (t) => t.metadata?.trendBased
    ).length;

    return {
      totalTopicsUsed: this.topicHistory.length,
      recentTrendBased: trendBasedCount,
      recentFallback: recentHistory.length - trendBasedCount,
      lastTopics: recentHistory.map((t) => ({
        topic: t.topic,
        category: t.category,
        timestamp: t.timestamp,
      })),
    };
  }
}

// Export singleton instance
const trendingTopicSelector = new TrendingTopicSelector();
export { trendingTopicSelector };

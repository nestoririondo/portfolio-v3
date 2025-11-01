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

    // Define topic patterns based on category
    const patterns = {
      tech: [
        `implementing ${cleanTrend} for business growth`,
        `${cleanTrend} best practices for Berlin businesses`,
        `how ${cleanTrend} improves website performance`,
        `${cleanTrend} integration strategies`,
        `why ${cleanTrend} matters in ${currentYear}`,
        `${cleanTrend} for small business websites`,
        `${cleanTrend} ROI and business impact`,
        `getting started with ${cleanTrend}`,
      ],
      content: [
        `business applications of ${cleanTrend}`,
        `${cleanTrend} for Berlin companies`,
        `implementing ${cleanTrend} strategies`,
        `${cleanTrend} best practices guide`,
        `${cleanTrend} case studies and results`,
      ],
      business: [
        `${cleanTrend} implementation guide`,
        `${cleanTrend} for website optimization`,
        `${cleanTrend} strategy development`,
        `${cleanTrend} cost-benefit analysis`,
        `${cleanTrend} checklist for businesses`,
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
   */
  async selectTrendingTopic() {
    console.log("🔍 Analyzing current trends for blog topics...");

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

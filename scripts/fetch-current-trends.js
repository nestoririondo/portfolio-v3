import https from "https";

/**
 * Fetches current web development and business trends from multiple sources
 */
class TrendsFetcher {
  constructor() {
    this.trends = [];
    this.lastFetched = null;
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  /**
   * Fetch trends from GitHub trending repositories
   */
  async fetchGitHubTrends() {
    try {
      const data = await this.httpsRequest(
        "https://api.github.com/search/repositories",
        {
          q: "web development javascript typescript react vue angular nextjs",
          sort: "stars",
          order: "desc",
          per_page: 10,
        }
      );

      const repos = JSON.parse(data);
      return (
        repos.items?.slice(0, 5).map((repo) => ({
          type: "tech",
          trend: `${repo.name} - ${repo.description?.substring(0, 100)}`,
          source: "GitHub",
        })) || []
      );
    } catch (error) {
      console.warn("Failed to fetch GitHub trends:", error.message);
      return [];
    }
  }

  /**
   * Fetch web development trends from dev.to API
   */
  async fetchDevToTrends() {
    try {
      const data = await this.httpsRequest("https://dev.to/api/articles", {
        tag: "webdev",
        top: 7, // last week
        per_page: 10,
      });

      const articles = JSON.parse(data);
      return (
        articles?.slice(0, 5).map((article) => ({
          type: "content",
          trend: article.title,
          source: "dev.to",
        })) || []
      );
    } catch (error) {
      console.warn("Failed to fetch dev.to trends:", error.message);
      return [];
    }
  }

  /**
   * Get current technology trends (fallback data)
   */
  getCurrentTechTrends() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Base trends that are always relevant
    const baseTrends = [
      "AI integration in web development and business automation",
      "Progressive Web Apps (PWAs) and modern JavaScript frameworks",
      "Core Web Vitals and mobile-first indexing for SEO",
      "Privacy regulations (GDPR) and data security compliance",
      "Sustainable web practices and green hosting solutions",
      "Voice search optimization and accessibility compliance",
      "E-commerce growth and digital transformation",
      "Local SEO and Google Business Profile optimization",
      "Video content and interactive user experiences",
      "Serverless architecture and edge computing",
    ];

    // Add seasonal/monthly trends
    const seasonalTrends = [];

    // Q4 trends (Oct-Dec)
    if (currentMonth >= 9) {
      seasonalTrends.push(
        "Black Friday and holiday e-commerce optimization",
        "Year-end website performance audits",
        "Planning for next year's digital strategy"
      );
    }

    // Q1 trends (Jan-Mar)
    if (currentMonth <= 2) {
      seasonalTrends.push(
        "New Year website redesigns and rebranding",
        "GDPR compliance reviews and updates",
        "Mobile-first design implementation"
      );
    }

    // Q2-Q3 trends (Apr-Sep)
    if (currentMonth >= 3 && currentMonth <= 8) {
      seasonalTrends.push(
        "Summer marketing campaign optimizations",
        "Website performance improvements for peak traffic",
        "Social media integration enhancements"
      );
    }

    return [...baseTrends, ...seasonalTrends].map((trend) => ({
      type: "tech",
      trend,
      source: "curated",
    }));
  }

  /**
   * Get current business trends for Berlin market
   */
  getBerlinBusinessTrends() {
    return [
      "Berlin startup ecosystem growth and digital innovation",
      "Remote work solutions and digital collaboration tools",
      "Sustainability focus in Berlin business operations",
      "Multi-language website support for international markets",
      "GDPR-compliant data handling for EU businesses",
      "Local business directory optimization for Berlin searches",
      "Integration with German payment systems and banking",
      "Accessibility compliance with German digital standards",
    ].map((trend) => ({
      type: "business",
      trend,
      source: "berlin-focused",
    }));
  }

  /**
   * Get high-intent local search keywords that Berlin businesses actually search for
   */
  getBerlinSpecificKeywords() {
    const currentYear = new Date().getFullYear();
    
    return [
      // Developer services searches
      `WordPress developer Berlin Mitte cost ${currentYear}`,
      `React developer Berlin hiring freelance`,
      `Next.js developer Berlin rates hourly`,
      `TypeScript developer Berlin remote work`,
      
      // Business website searches  
      `website development Berlin small business`,
      `e-commerce website Berlin startup costs`,
      `business website design Berlin Kreuzberg`,
      `website maintenance Berlin monthly pricing`,
      
      // Compliance and local requirements
      `GDPR compliant website development Germany`,
      `German privacy law website requirements`,
      `Berlin business website legal compliance`,
      `EU cookie consent implementation Germany`,
      
      // Payment and technical integration
      `German payment system integration Shopify`,
      `SEPA payment gateway website development`,
      `Klarna payment integration Berlin business`,
      `German banking API website integration`,
      
      // Localization and multi-language
      `website translation German English business`,
      `multilingual website development Berlin`,
      `German SEO optimization Berlin companies`,
      `Berlin local SEO website optimization`,
      
      // Industry-specific searches
      `restaurant website development Berlin`,
      `Berlin tech startup website design`,
      `medical practice website Germany GDPR`,
      `Berlin consulting firm website development`,
      
      // Performance and technical
      `website speed optimization Berlin business`,
      `mobile website development Germany`,
      `Berlin website hosting GDPR compliant`,
      `website security audit Berlin companies`,
      
      // Cost and pricing related
      `website development cost Berlin ${currentYear}`,
      `freelance web developer Berlin prices`,
      `Berlin website redesign budget planning`,
      `German market website development rates`,
    ].map((keyword) => ({
      type: "local_seo",
      trend: keyword,
      source: "local-search-intent",
    }));
  }

  /**
   * Make HTTPS request with query parameters
   */
  httpsRequest(url, params = {}) {
    return new Promise((resolve, reject) => {
      const queryString = Object.keys(params)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        )
        .join("&");

      const fullUrl = queryString ? `${url}?${queryString}` : url;
      const parsedUrl = new URL(fullUrl);

      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: "GET",
        headers: {
          "User-Agent": "BlogTrendsFetcher/1.0",
          Accept: "application/json",
        },
        timeout: 5000,
      };

      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          }
        });
      });

      req.on("error", reject);
      req.on("timeout", () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });

      req.end();
    });
  }

  /**
   * Fetch all trends with caching
   */
  async getAllTrends() {
    // Check cache
    if (
      this.lastFetched &&
      Date.now() - this.lastFetched < this.cacheTimeout &&
      this.trends.length > 0
    ) {
      return this.trends;
    }

    console.log("🔄 Fetching current trends...");

    try {
      // Fetch from multiple sources in parallel
      const [githubTrends, devtoTrends] = await Promise.allSettled([
        this.fetchGitHubTrends(),
        this.fetchDevToTrends(),
      ]);

      // Combine trends with balanced selection
      const githubResults = githubTrends.status === "fulfilled" ? githubTrends.value : [];
      const devtoResults = devtoTrends.status === "fulfilled" ? devtoTrends.value : [];
      const techTrends = this.getCurrentTechTrends().slice(0, 6); // Limit tech trends
      const businessTrends = this.getBerlinBusinessTrends().slice(0, 4); // Limit business trends  
      const localSeoTrends = this.getBerlinSpecificKeywords().slice(0, 8); // Include local SEO

      const allTrends = [
        ...githubResults,
        ...devtoResults,
        ...techTrends,
        ...businessTrends,
        ...localSeoTrends, // Ensure local SEO is included
      ];

      // Remove duplicates and limit
      const uniqueTrends = allTrends
        .filter(
          (trend, index, self) =>
            index === self.findIndex((t) => t.trend === trend.trend)
        )
        .slice(0, 25); // Increased to accommodate all types

      this.trends = uniqueTrends;
      this.lastFetched = Date.now();

      console.log(`✅ Fetched ${uniqueTrends.length} current trends`);
      return uniqueTrends;
    } catch (error) {
      console.warn(
        "Failed to fetch live trends, using fallback:",
        error.message
      );

      // Fallback to curated trends including local keywords
      this.trends = [
        ...this.getCurrentTechTrends().slice(0, 6),
        ...this.getBerlinBusinessTrends().slice(0, 4),
        ...this.getBerlinSpecificKeywords().slice(0, 8),
      ];

      this.lastFetched = Date.now();
      return this.trends;
    }
  }

  /**
   * Get formatted trends string for prompt
   */
  async getFormattedTrends() {
    const trends = await this.getAllTrends();

    const techTrends = trends.filter((t) => t.type === "tech").slice(0, 5);
    const businessTrends = trends
      .filter((t) => t.type === "business")
      .slice(0, 4);
    const contentTrends = trends
      .filter((t) => t.type === "content")
      .slice(0, 3);
    const localSeoTrends = trends
      .filter((t) => t.type === "local_seo")
      .slice(0, 5);

    let formatted = "";

    if (techTrends.length > 0) {
      formatted += "Current Technology Trends:\n";
      techTrends.forEach((trend) => {
        formatted += `- ${trend.trend}\n`;
      });
      formatted += "\n";
    }

    if (businessTrends.length > 0) {
      formatted += "Berlin Business Focus Areas:\n";
      businessTrends.forEach((trend) => {
        formatted += `- ${trend.trend}\n`;
      });
      formatted += "\n";
    }

    if (localSeoTrends.length > 0) {
      formatted += "High-Intent Berlin Search Keywords:\n";
      localSeoTrends.forEach((trend) => {
        formatted += `- ${trend.trend}\n`;
      });
      formatted += "\n";
    }

    if (contentTrends.length > 0) {
      formatted += "Popular Content Topics:\n";
      contentTrends.forEach((trend) => {
        formatted += `- ${trend.trend}\n`;
      });
    }

    return formatted.trim();
  }
}

// Export singleton instance
const trendsFetcher = new TrendsFetcher();
export { trendsFetcher };

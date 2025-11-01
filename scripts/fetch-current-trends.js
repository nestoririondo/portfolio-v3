import https from 'https';

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
      const data = await this.httpsRequest('https://api.github.com/search/repositories', {
        q: 'web development javascript typescript react vue angular nextjs',
        sort: 'stars',
        order: 'desc',
        per_page: 10
      });

      const repos = JSON.parse(data);
      return repos.items?.slice(0, 5).map(repo => ({
        type: 'tech',
        trend: `${repo.name} - ${repo.description?.substring(0, 100)}`,
        source: 'GitHub'
      })) || [];
    } catch (error) {
      console.warn('Failed to fetch GitHub trends:', error.message);
      return [];
    }
  }

  /**
   * Fetch web development trends from dev.to API
   */
  async fetchDevToTrends() {
    try {
      const data = await this.httpsRequest('https://dev.to/api/articles', {
        tag: 'webdev',
        top: 7, // last week
        per_page: 10
      });

      const articles = JSON.parse(data);
      return articles?.slice(0, 5).map(article => ({
        type: 'content',
        trend: article.title,
        source: 'dev.to'
      })) || [];
    } catch (error) {
      console.warn('Failed to fetch dev.to trends:', error.message);
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
      'AI integration in web development and business automation',
      'Progressive Web Apps (PWAs) and modern JavaScript frameworks',
      'Core Web Vitals and mobile-first indexing for SEO',
      'Privacy regulations (GDPR) and data security compliance',
      'Sustainable web practices and green hosting solutions',
      'Voice search optimization and accessibility compliance',
      'E-commerce growth and digital transformation',
      'Local SEO and Google Business Profile optimization',
      'Video content and interactive user experiences',
      'Serverless architecture and edge computing'
    ];

    // Add seasonal/monthly trends
    const seasonalTrends = [];
    
    // Q4 trends (Oct-Dec)
    if (currentMonth >= 9) {
      seasonalTrends.push(
        'Black Friday and holiday e-commerce optimization',
        'Year-end website performance audits',
        'Planning for next year\'s digital strategy'
      );
    }
    
    // Q1 trends (Jan-Mar)
    if (currentMonth <= 2) {
      seasonalTrends.push(
        'New Year website redesigns and rebranding',
        'GDPR compliance reviews and updates',
        'Mobile-first design implementation'
      );
    }

    // Q2-Q3 trends (Apr-Sep)
    if (currentMonth >= 3 && currentMonth <= 8) {
      seasonalTrends.push(
        'Summer marketing campaign optimizations',
        'Website performance improvements for peak traffic',
        'Social media integration enhancements'
      );
    }

    return [...baseTrends, ...seasonalTrends].map(trend => ({
      type: 'tech',
      trend,
      source: 'curated'
    }));
  }

  /**
   * Get current business trends for Berlin market
   */
  getBerlinBusinessTrends() {
    return [
      'Berlin startup ecosystem growth and digital innovation',
      'Remote work solutions and digital collaboration tools',
      'Sustainability focus in Berlin business operations',
      'Multi-language website support for international markets',
      'GDPR-compliant data handling for EU businesses',
      'Local business directory optimization for Berlin searches',
      'Integration with German payment systems and banking',
      'Accessibility compliance with German digital standards'
    ].map(trend => ({
      type: 'business',
      trend,
      source: 'berlin-focused'
    }));
  }

  /**
   * Make HTTPS request with query parameters
   */
  httpsRequest(url, params = {}) {
    return new Promise((resolve, reject) => {
      const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
      
      const fullUrl = queryString ? `${url}?${queryString}` : url;
      const parsedUrl = new URL(fullUrl);

      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'User-Agent': 'BlogTrendsFetcher/1.0',
          'Accept': 'application/json'
        },
        timeout: 5000
      };

      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  /**
   * Fetch all trends with caching
   */
  async getAllTrends() {
    // Check cache
    if (this.lastFetched && 
        (Date.now() - this.lastFetched) < this.cacheTimeout && 
        this.trends.length > 0) {
      return this.trends;
    }

    console.log('🔄 Fetching current trends...');

    try {
      // Fetch from multiple sources in parallel
      const [githubTrends, devtoTrends] = await Promise.allSettled([
        this.fetchGitHubTrends(),
        this.fetchDevToTrends()
      ]);

      // Combine all trends
      const allTrends = [
        ...(githubTrends.status === 'fulfilled' ? githubTrends.value : []),
        ...(devtoTrends.status === 'fulfilled' ? devtoTrends.value : []),
        ...this.getCurrentTechTrends(),
        ...this.getBerlinBusinessTrends()
      ];

      // Remove duplicates and limit
      const uniqueTrends = allTrends
        .filter((trend, index, self) => 
          index === self.findIndex(t => t.trend === trend.trend))
        .slice(0, 15);

      this.trends = uniqueTrends;
      this.lastFetched = Date.now();

      console.log(`✅ Fetched ${uniqueTrends.length} current trends`);
      return uniqueTrends;

    } catch (error) {
      console.warn('Failed to fetch live trends, using fallback:', error.message);
      
      // Fallback to curated trends
      this.trends = [
        ...this.getCurrentTechTrends(),
        ...this.getBerlinBusinessTrends()
      ].slice(0, 12);
      
      this.lastFetched = Date.now();
      return this.trends;
    }
  }

  /**
   * Get formatted trends string for prompt
   */
  async getFormattedTrends() {
    const trends = await this.getAllTrends();
    
    const techTrends = trends.filter(t => t.type === 'tech').slice(0, 6);
    const businessTrends = trends.filter(t => t.type === 'business').slice(0, 4);
    const contentTrends = trends.filter(t => t.type === 'content').slice(0, 3);

    let formatted = '';
    
    if (techTrends.length > 0) {
      formatted += 'Current Technology Trends:\n';
      techTrends.forEach(trend => {
        formatted += `- ${trend.trend}\n`;
      });
      formatted += '\n';
    }

    if (businessTrends.length > 0) {
      formatted += 'Berlin Business Focus Areas:\n';
      businessTrends.forEach(trend => {
        formatted += `- ${trend.trend}\n`;
      });
      formatted += '\n';
    }

    if (contentTrends.length > 0) {
      formatted += 'Popular Content Topics:\n';
      contentTrends.forEach(trend => {
        formatted += `- ${trend.trend}\n`;
      });
    }

    return formatted.trim();
  }
}

// Export singleton instance
const trendsFetcher = new TrendsFetcher();
export { trendsFetcher };
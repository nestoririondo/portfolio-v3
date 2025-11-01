/**
 * Content Link Enhancer
 * Automatically adds relevant links to mentioned organizations, standards, tools, etc.
 */

class ContentLinkEnhancer {
  constructor() {
    // Define mappings for common entities that should be linked
    this.linkMappings = {
      // Web Standards and Organizations
      'WCAG': 'https://www.w3.org/WAI/WCAG21/quickref/',
      'Web Content Accessibility Guidelines': 'https://www.w3.org/WAI/WCAG21/quickref/',
      'W3C': 'https://www.w3.org/',
      'Web Accessibility Initiative': 'https://www.w3.org/WAI/',
      'WAI': 'https://www.w3.org/WAI/',
      'Web Accessibility Directive': 'https://digital-strategy.ec.europa.eu/en/policies/web-accessibility',
      'WAD': 'https://digital-strategy.ec.europa.eu/en/policies/web-accessibility',
      'GDPR': 'https://gdpr.eu/',
      'General Data Protection Regulation': 'https://gdpr.eu/',
      'Core Web Vitals': 'https://web.dev/vitals/',
      'Google PageSpeed Insights': 'https://pagespeed.web.dev/',
      'Lighthouse': 'https://developer.chrome.com/docs/lighthouse/',
      
      // Technology & Frameworks
      'React': 'https://react.dev/',
      'Vue.js': 'https://vuejs.org/',
      'Vue': 'https://vuejs.org/',
      'Angular': 'https://angular.io/',
      'Next.js': 'https://nextjs.org/',
      'TypeScript': 'https://www.typescriptlang.org/',
      'Node.js': 'https://nodejs.org/',
      'Express.js': 'https://expressjs.com/',
      'Svelte': 'https://svelte.dev/',
      'Webpack': 'https://webpack.js.org/',
      'Vite': 'https://vitejs.dev/',
      'Docker': 'https://www.docker.com/',
      'Progressive Web Apps': 'https://web.dev/progressive-web-apps/',
      'PWA': 'https://web.dev/progressive-web-apps/',
      'WebAssembly': 'https://webassembly.org/',
      'GraphQL': 'https://graphql.org/',
      'REST API': 'https://restfulapi.net/',
      
      // Cloud Platforms & Hosting
      'AWS': 'https://aws.amazon.com/',
      'Amazon Web Services': 'https://aws.amazon.com/',
      'Vercel': 'https://vercel.com/',
      'Netlify': 'https://www.netlify.com/',
      'Google Cloud': 'https://cloud.google.com/',
      'Microsoft Azure': 'https://azure.microsoft.com/',
      'Cloudflare': 'https://www.cloudflare.com/',
      'GitHub Actions': 'https://github.com/features/actions',
      'GitHub Pages': 'https://pages.github.com/',
      
      // SEO & Analytics
      'Google Analytics': 'https://analytics.google.com/',
      'Google Search Console': 'https://search.google.com/search-console',
      'Bing Webmaster Tools': 'https://www.bing.com/webmasters',
      'Schema.org': 'https://schema.org/',
      'Open Graph': 'https://ogp.me/',
      'JSON-LD': 'https://json-ld.org/',
      
      // Content Management
      'WordPress': 'https://wordpress.org/',
      'Contentful': 'https://www.contentful.com/',
      'Strapi': 'https://strapi.io/',
      'Sanity': 'https://www.sanity.io/',
      'Ghost': 'https://ghost.org/',
      'Drupal': 'https://www.drupal.org/',
      'Joomla': 'https://www.joomla.org/',
      
      // E-commerce
      'Shopify': 'https://www.shopify.com/',
      'WooCommerce': 'https://woocommerce.com/',
      'Magento': 'https://magento.com/',
      'BigCommerce': 'https://www.bigcommerce.com/',
      'Stripe': 'https://stripe.com/',
      'PayPal': 'https://www.paypal.com/',
      'Square': 'https://squareup.com/',
      
      // German/EU Specific
      'SEPA': 'https://www.ecb.europa.eu/paym/integration/retail/sepa/html/index.en.html',
      'PCI DSS': 'https://www.pcisecuritystandards.org/',
      'ISO 27001': 'https://www.iso.org/isoiec-27001-information-security.html',
      'European Digital Single Market': 'https://digital-strategy.ec.europa.eu/',
      'Digital Services Act': 'https://digital-strategy.ec.europa.eu/en/policies/digital-services-act-package',
      'DSA': 'https://digital-strategy.ec.europa.eu/en/policies/digital-services-act-package',
      
      // Development Tools
      'VS Code': 'https://code.visualstudio.com/',
      'Visual Studio Code': 'https://code.visualstudio.com/',
      'Figma': 'https://www.figma.com/',
      'Adobe XD': 'https://helpx.adobe.com/xd/get-started.html',
      'Sketch': 'https://www.sketch.com/',
      'Git': 'https://git-scm.com/',
      'NPM': 'https://www.npmjs.com/',
      'Yarn': 'https://yarnpkg.com/',
      'ESLint': 'https://eslint.org/',
      'Prettier': 'https://prettier.io/',
      'Jest': 'https://jestjs.io/',
      'Cypress': 'https://www.cypress.io/',
      'Playwright': 'https://playwright.dev/',
      
      // Browser Testing
      'BrowserStack': 'https://www.browserstack.com/',
      'Sauce Labs': 'https://saucelabs.com/',
      'CrossBrowserTesting': 'https://crossbrowsertesting.com/',
      
      // Performance & Monitoring
      'New Relic': 'https://newrelic.com/',
      'Datadog': 'https://www.datadoghq.com/',
      'Sentry': 'https://sentry.io/',
      'LogRocket': 'https://logrocket.com/',
      'Hotjar': 'https://www.hotjar.com/',
      'Crazy Egg': 'https://www.crazyegg.com/',
      
      // Berlin/German Tech Scene
      'Berlin Startup Ecosystem': 'https://www.berlin.de/sen/web/en/business/startup-ecosystem/',
      'GTEC Berlin': 'https://gtec.berlin/',
      'Rocket Internet': 'https://www.rocket-internet.com/',
      'Factory Berlin': 'https://factoryberlin.com/',
    };
    
    // Patterns that should NOT be linked (too generic)
    this.excludePatterns = [
      /^(the|a|an)\s+/i,
      /^(web|website|site|page|app|application)$/i,
      /^(business|company|startup|enterprise)$/i,
      /^(berlin|germany|german|europe|european)$/i,
      /^(user|users|customer|customers|client|clients)$/i,
    ];
  }

  /**
   * Enhance content by adding relevant links (smart linking - only first mention)
   */
  enhanceContent(content) {
    let enhancedContent = content;
    const linkedTerms = new Set(); // Track which terms we've already linked
    
    // Add internal website links first
    enhancedContent = this.addInternalLinks(enhancedContent);
    
    // Sort mappings by length (longest first) to avoid partial matches
    const sortedMappings = Object.entries(this.linkMappings)
      .sort(([a], [b]) => b.length - a.length);
    
    for (const [term, url] of sortedMappings) {
      // Skip if we've already linked this term or it matches exclude patterns
      if (linkedTerms.has(term.toLowerCase()) || this.shouldExclude(term)) continue;
      
      // Create regex for whole word matching (case insensitive)
      const regex = new RegExp(`\\b(${this.escapeRegex(term)})\\b`, 'gi');
      
      // Only replace FIRST occurrence and if not already linked
      const match = regex.exec(enhancedContent);
      if (match && !this.isInLinkContext(enhancedContent, match.index)) {
        const replacement = `[${match[1]}](${url})`;
        enhancedContent = enhancedContent.substring(0, match.index) + 
                         replacement + 
                         enhancedContent.substring(match.index + match[0].length);
        
        linkedTerms.add(term.toLowerCase());
      }
    }
    
    return enhancedContent;
  }
  
  /**
   * Add internal links to your website pages
   */
  addInternalLinks(content) {
    const internalLinkMappings = {
      // Services and expertise
      'web development consultant': '/#about',
      'web developer': '/#about',
      'web development services': '/#services',
      'website development': '/#services',
      'Berlin web developer': '/#about',
      'freelance web developer': '/#about',
      
      // Process and contact
      'contact': '/#contact',
      'get in touch': '/#contact',
      'consultation': '/#contact',
      'discuss your project': '/#contact',
      'project planning': '/#process',
      'web development process': '/#process',
      
      // Blog and resources
      'blog': '/blog',
      'more insights': '/blog',
      'web development blog': '/blog',
      'latest articles': '/blog',
    };
    
    let enhancedContent = content;
    const linkedInternalTerms = new Set();
    
    // Sort by length (longest first)
    const sortedInternalMappings = Object.entries(internalLinkMappings)
      .sort(([a], [b]) => b.length - a.length);
    
    for (const [term, url] of sortedInternalMappings) {
      if (linkedInternalTerms.has(term.toLowerCase())) continue;
      
      const regex = new RegExp(`\\b(${this.escapeRegex(term)})\\b`, 'gi');
      
      // Only replace first occurrence
      if (regex.test(enhancedContent) && !enhancedContent.includes(`[${term}]`)) {
        enhancedContent = enhancedContent.replace(regex, `[$1](${url})`);
        linkedInternalTerms.add(term.toLowerCase());
        break; // Only add one internal link per content
      }
    }
    
    return enhancedContent;
  }
  
  /**
   * Check if a match is already within a link context
   */
  isInLinkContext(content, matchIndex) {
    const beforeMatch = content.substring(Math.max(0, matchIndex - 100), matchIndex);
    const afterMatch = content.substring(matchIndex, Math.min(content.length, matchIndex + 100));
    
    // Check if already in markdown link syntax
    return (beforeMatch.includes('[') && afterMatch.includes('](')) ||
           beforeMatch.includes('](') || 
           (beforeMatch.includes('<a ') && afterMatch.includes('</a>'));
  }
  
  /**
   * Check if term should be excluded from linking
   */
  shouldExclude(term) {
    return this.excludePatterns.some(pattern => pattern.test(term));
  }
  
  /**
   * Escape special regex characters
   */
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  /**
   * Add a new link mapping
   */
  addMapping(term, url) {
    this.linkMappings[term] = url;
  }
  
  /**
   * Get all available mappings (for debugging)
   */
  getAllMappings() {
    return this.linkMappings;
  }
  
  /**
   * Get mappings count
   */
  getMappingsCount() {
    return Object.keys(this.linkMappings).length;
  }
}

// Export singleton instance
const contentLinkEnhancer = new ContentLinkEnhancer();
export { contentLinkEnhancer };
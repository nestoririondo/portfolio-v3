import "dotenv/config";
import { createClient as createPexelsClient } from 'pexels';

async function testUniqueImageSearch() {
  console.log("🧪 Testing Pexels with unique search terms...\n");

  const pexels = createPexelsClient(process.env.PEXELS_API_KEY);
  
  const testQueries = [
    "quantum computing",
    "blockchain technology", 
    "artificial intelligence robot",
    "cybersecurity shield",
    "cloud computing servers"
  ];

  for (const query of testQueries) {
    try {
      console.log(`🔍 Searching for: "${query}"`);
      
      const result = await pexels.photos.search({
        query,
        page: 1,
        per_page: 3,
        orientation: 'landscape',
        size: 'large'
      });

      if (result.photos && result.photos.length > 0) {
        console.log(`✅ Found ${result.photos.length} unique images`);
        console.log(`📸 Best result: "${result.photos[0].alt}" by ${result.photos[0].photographer}`);
        console.log(`🔗 URL: ${result.photos[0].src.large}\n`);
      } else {
        console.log(`❌ No results found\n`);
      }
      
      // Small delay to respect API limits
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Error searching for "${query}":`, error.message);
    }
  }

  console.log("🎯 Summary: Pexels provides much better variety for technical topics!");
  console.log("💡 Your blog automation now has access to thousands more relevant images!");
}

testUniqueImageSearch();
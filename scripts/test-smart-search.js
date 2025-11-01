import "dotenv/config";
import { createClient as createPexelsClient } from "pexels";

const pexels = createPexelsClient(process.env.PEXELS_API_KEY);

function generateSmartSearchTerms(topic) {
  const lowercaseTopic = topic.toLowerCase();

  // Map topic themes to relevant visual concepts
  const topicMappings = {
    // Web Development
    website: "web development coding laptop",
    web: "modern office computer programming",
    frontend: "developer coding screen interface",
    backend: "server technology data center",
    javascript: "programming code developer workspace",
    vue: "modern web development office",
    react: "coding workspace developer setup",
    node: "programming server technology",

    // Business & Startup
    startup: "modern office team collaboration",
    business: "professional office meeting",
    berlin: "modern office workspace city",
    growth: "business team success meeting",
    strategy: "business planning office workspace",

    // Technology
    ai: "artificial intelligence technology",
    algorithm: "data analysis technology workspace",
    cloud: "cloud computing data center",
    security: "cybersecurity technology office",
    mobile: "mobile app development workspace",

    // Learning & Development
    lessons: "learning education workspace",
    tutorial: "education training modern office",
    guide: "professional training workspace",
    tips: "business advice modern office",

    // Process & Optimization
    optimization: "business efficiency modern office",
    performance: "technology workspace analysis",
    automation: "technology workflow modern office",
  };

  // Find matching themes
  for (const [key, visualConcept] of Object.entries(topicMappings)) {
    if (lowercaseTopic.includes(key)) {
      return visualConcept;
    }
  }

  // Fallback: extract meaningful business/tech terms
  const businessTerms = topic
    .toLowerCase()
    .replace(
      /\b(for|berlin|german|germany|website|web|development|how|to|the|in|with|and|or|24|12|weeks)\b/g,
      ""
    )
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 2)
    .join(" ");

  return businessTerms || "modern business technology workspace";
}

async function testSmartImageSearch() {
  console.log("🧠 Testing Smart Image Search vs Basic Search\n");

  const testTopics = [
    "How to Build the Ideal Berlin Startup Website in 24 Lessons Over 12 Weeks",
    "From Static to Dynamic: Unlocking the Power of Vue.js for Berlin Businesses",
    "Unlock the Power of Node.js: How Berlin Businesses Can Innovate and Scale",
    "AI Integration: The Secret Weapon for Berlin Startups to Boost Growth",
  ];

  for (const topic of testTopics) {
    console.log(`📝 Topic: "${topic}"`);

    // Basic search (old way)
    const basicKeywords = topic
      .toLowerCase()
      .replace(/\b(for|berlin|german|germany|website|web|development)\b/g, "")
      .trim()
      .split(/\s+/)
      .slice(0, 3)
      .join(" ");

    // Smart search (new way)
    const smartKeywords = generateSmartSearchTerms(topic);

    console.log(`🤖 Basic Search: "${basicKeywords}"`);
    console.log(`🧠 Smart Search: "${smartKeywords}"`);

    // Test smart search
    try {
      const smartResult = await pexels.photos.search({
        query: smartKeywords,
        page: 1,
        per_page: 3,
        orientation: "landscape",
      });

      if (smartResult.photos && smartResult.photos.length > 0) {
        console.log(`✅ Smart Results:`);
        smartResult.photos.forEach((photo, i) => {
          console.log(
            `   ${i + 1}. ${
              photo.alt?.substring(0, 60) || "Professional image"
            }...`
          );
        });
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }

    console.log("---\n");
  }

  console.log("💡 The smart search maps topics to relevant visual concepts!");
  console.log("🎯 Much better than literal keyword matching!");
}

testSmartImageSearch();

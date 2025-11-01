import { trendingTopicSelector } from "./trending-topic-selector.js";
import { trendsFetcher } from "./fetch-current-trends.js";

console.log("🔍 Testing New Content Patterns & Local Keywords");
console.log("=" .repeat(60));

async function testNewSystem() {
  try {
    // Test 1: Show available trends
    console.log("\n📊 Available Trends by Category:");
    const allTrends = await trendsFetcher.getAllTrends();
    
    const techCount = allTrends.filter(t => t.type === "tech").length;
    const businessCount = allTrends.filter(t => t.type === "business").length;
    const localSeoCount = allTrends.filter(t => t.type === "local_seo").length;
    const contentCount = allTrends.filter(t => t.type === "content").length;
    
    console.log(`- Technology trends: ${techCount}`);
    console.log(`- Business trends: ${businessCount}`);
    console.log(`- Local SEO keywords: ${localSeoCount}`);
    console.log(`- Content trends: ${contentCount}`);
    console.log(`- Total trends: ${allTrends.length}`);

    // Test 2: Show sample local SEO keywords
    console.log("\n🎯 Sample Local SEO Keywords:");
    const localSeoTrends = allTrends.filter(t => t.type === "local_seo").slice(0, 5);
    localSeoTrends.forEach((trend, i) => {
      console.log(`${i + 1}. ${trend.trend}`);
    });

    // Test 3: Generate topics and show variety
    console.log("\n📝 Generated Topic Examples (showing variety):");
    
    for (let i = 0; i < 5; i++) {
      const topicResult = await trendingTopicSelector.selectTrendingTopic();
      console.log(`\n${i + 1}. Topic: "${topicResult.topic}"`);
      console.log(`   Source: ${topicResult.metadata.source}`);
      console.log(`   Category: ${topicResult.metadata.category}`);
      console.log(`   Priority: ${topicResult.metadata.priority}`);
      console.log(`   Trend-based: ${topicResult.metadata.trendBased}`);
    }

    // Test 4: Show formatted trends for prompt
    console.log("\n🎨 Formatted Trends for Blog Prompt:");
    console.log("-".repeat(40));
    const formattedTrends = await trendsFetcher.getFormattedTrends();
    console.log(formattedTrends);

    // Test 5: Topic selection statistics
    console.log("\n📈 Topic Selection Statistics:");
    const stats = trendingTopicSelector.getStats();
    console.log(`- Total topics used: ${stats.totalTopicsUsed}`);
    console.log(`- Recent trend-based: ${stats.recentTrendBased}`);
    console.log(`- Recent fallback: ${stats.recentFallback}`);
    
    if (stats.lastTopics && stats.lastTopics.length > 0) {
      console.log("\nRecent topics:");
      stats.lastTopics.slice(0, 3).forEach((topic, i) => {
        console.log(`${i + 1}. ${topic.topic} (${topic.category})`);
      });
    }

  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testNewSystem();
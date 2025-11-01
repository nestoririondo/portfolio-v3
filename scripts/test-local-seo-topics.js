import { trendingTopicSelector } from "./trending-topic-selector.js";

console.log("🎯 Testing Local SEO Topic Generation");
console.log("=" .repeat(50));

async function testLocalSeoTopics() {
  try {
    // Clear used topics to see fresh results
    trendingTopicSelector.usedTopics.clear();
    trendingTopicSelector.topicHistory = [];

    console.log("📝 Generating diverse topics (including local SEO):");
    
    for (let i = 0; i < 10; i++) {
      const topicResult = await trendingTopicSelector.selectTrendingTopic();
      
      console.log(`\n${i + 1}. "${topicResult.topic}"`);
      console.log(`   📂 Category: ${topicResult.metadata.category}`);
      console.log(`   🏆 Priority: ${topicResult.metadata.priority}`);
      console.log(`   📊 Source: ${topicResult.metadata.source}`);
      
      // Add some variety by marking as used
      if (i % 3 === 0) {
        // Every 3rd topic, force selection of different types
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log("\n📈 Final Statistics:");
    const stats = trendingTopicSelector.getStats();
    console.log(`- Total topics generated: ${stats.totalTopicsUsed}`);
    
    const categoryCounts = {};
    stats.lastTopics.forEach(topic => {
      categoryCounts[topic.category] = (categoryCounts[topic.category] || 0) + 1;
    });
    
    console.log("Category breakdown:");
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count} topics`);
    });

  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testLocalSeoTopics();
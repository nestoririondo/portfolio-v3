import { trendingTopicSelector } from "./trending-topic-selector.js";
import { execSync } from "child_process";
import fs from "fs";

/**
 * Auto-generate blog posts using trending topics
 */
class AutoBlogGenerator {
  constructor() {
    this.lockFile = "/tmp/auto-blog-generation.lock";
  }

  /**
   * Check if auto generation is already running
   */
  isGenerationRunning() {
    if (fs.existsSync(this.lockFile)) {
      const lockData = fs.readFileSync(this.lockFile, "utf8");
      const { timestamp } = JSON.parse(lockData);
      const lockAge = Date.now() - timestamp;

      // Consider lock stale after 30 minutes
      if (lockAge > 30 * 60 * 1000) {
        fs.unlinkSync(this.lockFile);
        return false;
      }
      return true;
    }
    return false;
  }

  /**
   * Create generation lock
   */
  createLock(topic) {
    const lockData = {
      timestamp: Date.now(),
      topic,
      pid: process.pid,
    };
    fs.writeFileSync(this.lockFile, JSON.stringify(lockData, null, 2));
  }

  /**
   * Remove generation lock
   */
  removeLock() {
    if (fs.existsSync(this.lockFile)) {
      fs.unlinkSync(this.lockFile);
    }
  }

  /**
   * Generate blog post using trending topic
   */
  async generateTrendingBlog() {
    if (this.isGenerationRunning()) {
      console.log("🚫 Auto blog generation already running");
      return { success: false, reason: "Already running" };
    }

    try {
      // Get options from environment variables (GitHub Actions)
      const forceTopic = process.env.FORCE_TOPIC;
      const useTrending = process.env.USE_TRENDING !== 'false';

      const options = {
        forceTopic,
        useTrending,
      };

      // Select trending topic with options
      const { topic, metadata } =
        await trendingTopicSelector.selectTrendingTopic(options);

      console.log("🤖 Auto-generating blog post...");
      console.log(`📝 Topic: "${topic}"`);
      console.log(`📊 Source: ${metadata.source} (${metadata.category})`);
      console.log(`🎯 Trend-based: ${metadata.trendBased ? "✅" : "❌"}`);

      this.createLock(topic);

      // Run the blog generation script with the selected topic
      let command = `cd "${process.cwd()}" && FORCE_TOPIC="${topic}" node scripts/generate-blog-post.js`;
      let output, generatedTitle;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        attempts++;
        console.log(`🔄 Generating content (attempt ${attempts})...`);
        
        try {
          output = execSync(command, {
            encoding: "utf8",
            timeout: 5 * 60 * 1000, // 5 minute timeout
            stdio: "pipe",
          });

          console.log("📄 Generation output:");
          console.log(output);

          // Check if the generation was skipped due to duplicates
          if (output.includes("🚫 Skipping to avoid duplicate content")) {
            console.log(`⏭️ Topic "${topic}" was skipped as duplicate, trying alternative...`);
            
            // Try without forcing a topic (let the system choose)
            if (attempts === 1) {
              command = `cd "${process.cwd()}" && node scripts/generate-blog-post.js`;
              console.log("🎲 Switching to automatic topic selection...");
              continue;
            }
            
            // If automatic also fails, try with trending disabled
            if (attempts === 2) {
              const { topic: altTopic, metadata: altMetadata } = 
                await trendingTopicSelector.selectTrendingTopic({ useTrending: false });
              command = `cd "${process.cwd()}" && FORCE_TOPIC="${altTopic}" node scripts/generate-blog-post.js`;
              console.log(`🔄 Trying fallback topic: "${altTopic}"`);
              topic = altTopic;
              metadata = altMetadata;
              continue;
            }
          }

          // Extract title from output if available
          const titleMatch = output.match(/Blog post generated successfully: (.+)/);
          generatedTitle = titleMatch ? titleMatch[1] : "Unknown title";
          break; // Success, exit retry loop
          
        } catch (error) {
          if (attempts === maxAttempts) {
            throw error; // Re-throw on final attempt
          }
          console.log(`⚠️ Attempt ${attempts} failed: ${error.message}`);
        }
      }

      this.removeLock();

      return {
        success: true,
        topic,
        title: generatedTitle,
        metadata,
        output,
      };
    } catch (error) {
      console.error("❌ Auto blog generation failed:", error.message);
      this.removeLock();

      return {
        success: false,
        reason: error.message,
        error,
      };
    }
  }

  /**
   * Generate multiple blog posts in sequence
   */
  async generateMultipleTrendingBlogs(count = 3) {
    console.log(`🚀 Generating ${count} trending blog posts...`);
    const results = [];

    for (let i = 0; i < count; i++) {
      console.log(`\n📝 Generating blog ${i + 1}/${count}...`);

      const result = await this.generateTrendingBlog();
      results.push(result);

      if (!result.success) {
        console.log(`❌ Blog ${i + 1} failed: ${result.reason}`);
        break;
      } else {
        console.log(`✅ Blog ${i + 1} completed: "${result.title}"`);
      }

      // Wait 30 seconds between generations to avoid rate limits
      if (i < count - 1) {
        console.log("⏳ Waiting 30 seconds before next generation...");
        await this.sleep(30000);
      }
    }

    // Summary
    const successful = results.filter((r) => r.success).length;
    const failed = results.length - successful;

    console.log(`\n📊 Generation Summary:`);
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);

    if (successful > 0) {
      console.log(`\n📝 Generated posts:`);
      results
        .filter((r) => r.success)
        .forEach((r, i) => {
          console.log(`${i + 1}. "${r.title}" (${r.metadata.category})`);
        });
    }

    return results;
  }

  /**
   * Test trending topic selection without generation
   */
  async testTopicSelection(count = 5) {
    console.log(`🧪 Testing trending topic selection (${count} topics)...`);

    const topics = [];
    for (let i = 0; i < count; i++) {
      const { topic, metadata } =
        await trendingTopicSelector.selectTrendingTopic();
      topics.push({ topic, metadata });

      console.log(`${i + 1}. "${topic}"`);
      console.log(`   Source: ${metadata.source}`);
      console.log(`   Category: ${metadata.category}`);
      console.log(`   Priority: ${metadata.priority}`);
      console.log(`   Trend-based: ${metadata.trendBased ? "✅" : "❌"}`);
      console.log("");
    }

    // Show stats
    const stats = trendingTopicSelector.getStats();
    console.log("📊 Topic Selection Stats:");
    console.log(`Total topics used: ${stats.totalTopicsUsed}`);
    console.log(`Recent trend-based: ${stats.recentTrendBased}`);
    console.log(`Recent fallback: ${stats.recentFallback}`);

    return topics;
  }

  /**
   * Sleep helper
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// CLI interface
const autoBlogGenerator = new AutoBlogGenerator();

// Handle CLI arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "test":
    // Test topic selection
    const testCount = parseInt(args[1]) || 5;
    autoBlogGenerator
      .testTopicSelection(testCount)
      .then(() => process.exit(0))
      .catch(console.error);
    break;

  case "generate":
    // Generate single trending blog
    autoBlogGenerator
      .generateTrendingBlog()
      .then((result) => {
        if (result.success) {
          console.log("🎉 Auto blog generation completed successfully!");
          process.exit(0);
        } else {
          console.log("❌ Auto blog generation failed");
          process.exit(1);
        }
      })
      .catch(console.error);
    break;

  case "batch":
    // Generate multiple blogs
    const batchCount = parseInt(args[1]) || 3;
    autoBlogGenerator
      .generateMultipleTrendingBlogs(batchCount)
      .then((results) => {
        const successful = results.filter((r) => r.success).length;
        console.log(
          `🎉 Batch generation completed: ${successful}/${results.length} successful`
        );
        process.exit(successful > 0 ? 0 : 1);
      })
      .catch(console.error);
    break;

  default:
    // Default behavior - just generate a blog (for GitHub Actions)
    autoBlogGenerator
      .generateTrendingBlog()
      .then((result) => {
        if (result.success) {
          console.log("🎉 Auto blog generation completed successfully!");
          process.exit(0);
        } else {
          console.log("❌ Auto blog generation failed");
          process.exit(1);
        }
      })
      .catch((error) => {
        console.error("❌ Auto blog generation error:", error);
        process.exit(1);
      });
    break;
}

export { autoBlogGenerator };

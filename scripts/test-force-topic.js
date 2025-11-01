import "dotenv/config";

// Test the force topic functionality
process.env.FORCE_TOPIC = "party planning for Berlin events";

console.log("🧪 Testing force topic functionality...\n");

// Import the blog generation function
import("./generate-blog-post.js")
  .then((module) => {
    console.log("✅ Module loaded successfully");
    console.log(
      `🎯 FORCE_TOPIC environment variable: "${process.env.FORCE_TOPIC}"`
    );
  })
  .catch((error) => {
    console.error("❌ Error loading module:", error.message);
  });

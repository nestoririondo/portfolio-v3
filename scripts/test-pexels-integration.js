import "dotenv/config";
import { createClient } from "pexels";

// Test Pexels API integration
async function testPexelsIntegration() {
  console.log("🧪 Testing Pexels API Integration...\n");

  if (!process.env.PEXELS_API_KEY) {
    console.error("❌ PEXELS_API_KEY not found in environment variables");
    console.log("📝 Please add your Pexels API key to .env.local:");
    console.log("PEXELS_API_KEY=your_api_key_here");
    console.log("\n🔗 Get your free API key at: https://www.pexels.com/api/");
    return;
  }

  try {
    const pexels = createClient(process.env.PEXELS_API_KEY);

    console.log("🔍 Searching for 'business technology'...");
    const result = await pexels.photos.search({
      query: "business technology",
      page: 1,
      per_page: 5,
      orientation: "landscape",
      size: "large",
    });

    if (result.photos && result.photos.length > 0) {
      console.log(`✅ Success! Found ${result.photos.length} photos`);
      console.log("\n📸 Sample results:");

      result.photos.slice(0, 3).forEach((photo, index) => {
        console.log(
          `${index + 1}. "${photo.alt || "Professional image"}" by ${
            photo.photographer
          }`
        );
        console.log(`   URL: ${photo.src.large}`);
        console.log(`   ID: ${photo.id}\n`);
      });

      console.log("🎉 Pexels integration is working perfectly!");
      console.log("📈 Quality comparison vs Unsplash:");
      console.log("   ✅ Higher resolution images");
      console.log("   ✅ Better business/tech photo selection");
      console.log("   ✅ More generous API limits (20K/month vs 5K)");
      console.log("   ✅ No attribution required");
    } else {
      console.log("⚠️ No photos found - this might indicate an API issue");
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);

    if (error.message.includes("401")) {
      console.log("🔑 This looks like an API key issue");
      console.log("   - Check that your PEXELS_API_KEY is correct");
      console.log("   - Verify the key is active in your Pexels account");
    }
  }
}

testPexelsIntegration();

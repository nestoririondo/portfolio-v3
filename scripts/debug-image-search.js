import "dotenv/config";
import { createClient as createPexelsClient } from 'pexels';
import * as contentfulPkg from "contentful";

const { createClient: createContentfulClient } = contentfulPkg;

const contentful = createContentfulClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

const pexels = createPexelsClient(process.env.PEXELS_API_KEY);

async function debugImageSearch() {
  console.log("🔍 DEBUG: Analyzing why images always fall back to creative searches...\n");

  // Get existing posts
  const entries = await contentful.getEntries({
    content_type: "blogPost",
    order: "-sys.createdAt",
    limit: 50,
  });

  const existingPosts = entries.items.map((item) => ({
    title: item.fields.title,
    featuredImageUrl: item.fields.featuredImage?.fields?.file?.url,
  }));

  const usedImageUrls = existingPosts
    .map((post) => post.featuredImageUrl)
    .filter(Boolean)
    .map((url) => url.replace("https:", ""));

  console.log(`📊 Analysis of ${usedImageUrls.length} existing images:`);
  console.log(`📋 First 5 used URLs:`, usedImageUrls.slice(0, 5));
  
  // Test a simple search
  const testTopic = "javascript programming";
  console.log(`\n🧪 Testing search for: "${testTopic}"`);
  
  const result = await pexels.photos.search({
    query: testTopic,
    page: 1,
    per_page: 10,
    orientation: 'landscape',
    size: 'large'
  });

  console.log(`📸 Found ${result.photos?.length || 0} photos`);
  
  if (result.photos && result.photos.length > 0) {
    console.log(`\n🔍 Checking first 5 results for duplicates:`);
    
    result.photos.slice(0, 5).forEach((photo, index) => {
      const photoId = photo.id.toString();
      const photoUrl = photo.src.large;
      
      const isUsedById = usedImageUrls.some(usedUrl => usedUrl.includes(photoId));
      const isUsedByUrl = usedImageUrls.some(usedUrl => photoUrl.includes(photoId));
      
      console.log(`${index + 1}. ID: ${photoId}`);
      console.log(`   URL: ${photoUrl}`);
      console.log(`   Alt: ${photo.alt?.substring(0, 60) || 'No alt'}...`);
      console.log(`   Used by ID? ${isUsedById}`);
      console.log(`   Used by URL? ${isUsedByUrl}`);
      console.log(`   Overall Used? ${isUsedById || isUsedByUrl}`);
      console.log('');
    });
  }

  // Test if ALL images from popular searches are actually used
  const popularTerms = ["business technology", "modern office", "digital innovation"];
  
  for (const term of popularTerms) {
    console.log(`\n📈 Testing popular term: "${term}"`);
    
    const popularResult = await pexels.photos.search({
      query: term,
      page: 1,
      per_page: 20,
      orientation: 'landscape',
      size: 'large'
    });

    let uniqueCount = 0;
    if (popularResult.photos) {
      popularResult.photos.forEach(photo => {
        const photoId = photo.id.toString();
        const isUsed = usedImageUrls.some(usedUrl => usedUrl.includes(photoId));
        if (!isUsed) uniqueCount++;
      });
    }
    
    console.log(`   Found ${popularResult.photos?.length || 0} total photos`);
    console.log(`   ${uniqueCount} are unique (not used)`);
    console.log(`   ${(popularResult.photos?.length || 0) - uniqueCount} are already used`);
  }

  console.log(`\n💡 INSIGHTS:`);
  console.log(`- You have ${usedImageUrls.length} existing images`);
  console.log(`- This creates a large "used" database to check against`);
  console.log(`- Popular terms may be exhausted from 35+ blog posts`);
  console.log(`- Creative terms work because they're more unique/random`);
}

debugImageSearch();
import { trendsFetcher } from "./fetch-current-trends.js";

console.log("🔍 Debug: Testing individual trend sources");

async function debugTrends() {
  console.log("\n1. Testing tech trends:");
  const techTrends = trendsFetcher.getCurrentTechTrends();
  console.log(`Found ${techTrends.length} tech trends`);
  techTrends.slice(0, 2).forEach(t => console.log(`- ${t.trend} (${t.type})`));

  console.log("\n2. Testing business trends:");
  const businessTrends = trendsFetcher.getBerlinBusinessTrends();
  console.log(`Found ${businessTrends.length} business trends`);
  businessTrends.slice(0, 2).forEach(t => console.log(`- ${t.trend} (${t.type})`));

  console.log("\n3. Testing local SEO keywords:");
  const localTrends = trendsFetcher.getBerlinSpecificKeywords();
  console.log(`Found ${localTrends.length} local SEO keywords`);
  localTrends.slice(0, 3).forEach(t => console.log(`- ${t.trend} (${t.type})`));

  console.log("\n4. Testing combined getAllTrends:");
  const allTrends = await trendsFetcher.getAllTrends();
  console.log(`Total combined trends: ${allTrends.length}`);
  
  const byType = {};
  allTrends.forEach(t => {
    byType[t.type] = (byType[t.type] || 0) + 1;
  });
  
  console.log("Breakdown by type:");
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`- ${type}: ${count}`);
  });

  console.log("\nSample local SEO in final result:");
  const localInFinal = allTrends.filter(t => t.type === "local_seo");
  localInFinal.slice(0, 3).forEach(t => console.log(`- ${t.trend}`));
}

debugTrends().catch(console.error);
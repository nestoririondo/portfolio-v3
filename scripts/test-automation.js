import 'dotenv/config';

console.log('🧪 Testing Blog Automation Setup');
console.log('================================');

// Test environment variables
const requiredEnvVars = [
  'CONTENTFUL_SPACE_ID',
  'CONTENTFUL_ACCESS_TOKEN', 
  'CONTENTFUL_MANAGEMENT_TOKEN',
  'CLAUDE_API_KEY',
  'UNSPLASH_ACCESS_KEY',
  'UNSPLASH_SECRET_KEY'
];

let allPresent = true;

console.log('\n📋 Environment Variables Check:');
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  const status = value ? '✅' : '❌';
  const displayValue = value ? `${value.substring(0, 8)}...` : 'MISSING';
  
  console.log(`${status} ${envVar}: ${displayValue}`);
  
  if (!value) allPresent = false;
});

if (!allPresent) {
  console.log('\n❌ Some environment variables are missing!');
  console.log('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

// Test current date detection
console.log('\n📅 Date Detection Test:');
const currentDate = new Date();
const month = currentDate.toLocaleDateString('en-US', { month: 'long' });
const day = currentDate.getDate();
const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

console.log(`📅 Current date: ${currentDate.toISOString().split('T')[0]} (${dayOfWeek})`);
console.log(`🗓️ Month: ${month}, Day: ${day}`);

// Test special events detection
let specialTopic = '';

if (month === 'January' && day <= 15) {
  specialTopic = 'New Year website resolutions for Berlin businesses';
} else if (month === 'February' && day >= 10 && day <= 20) {
  specialTopic = 'Valentine\'s Day marketing strategies for Berlin retailers';
} else if (month === 'March' || month === 'April') {
  specialTopic = 'Spring website refresh for Berlin businesses';
} else if (month === 'May' && day >= 20 && day <= 30) {
  specialTopic = 'GDPR compliance updates for German businesses';
} else if (month === 'June' || month === 'July') {
  specialTopic = 'Summer mobile optimization for Berlin tourism businesses';
} else if (month === 'August' || month === 'September') {
  specialTopic = 'Back-to-business website strategies for Berlin companies';
} else if (month === 'October' || month === 'November') {
  specialTopic = 'E-commerce optimization for Black Friday in Germany';
} else if (month === 'December') {
  specialTopic = 'Holiday season website performance for Berlin retailers';
}

if (specialTopic) {
  console.log(`🎯 Special event detected: ${specialTopic}`);
} else {
  console.log('📝 No special events detected for current date');
}

// Test trending topics
console.log('\n🔥 Trending Topics:');
const trendingTopics = [
  'AI integration for Berlin business websites',
  'Sustainable web development practices in Germany', 
  'Web3 and blockchain for German startups',
  'Progressive Web Apps for Berlin retailers',
  'Voice search optimization for German businesses'
];

const randomTrending = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
console.log(`🔥 Random trending suggestion: ${randomTrending}`);

// Test optimal timing
console.log('\n⏰ Optimal Posting Times:');
console.log('📅 Tuesday 9:00 AM CET (7:00 AM UTC) - Business planning content');
console.log('📅 Friday 2:00 PM CET (12:00 PM UTC) - Technical trends content');

const now = new Date();
const utcHour = now.getUTCHours();
const utcDay = now.getUTCDay(); // 0=Sunday, 1=Monday, etc.

if (utcDay === 2 && utcHour === 7) {
  console.log('🎯 OPTIMAL TIME: Tuesday business post timing!');
} else if (utcDay === 5 && utcHour === 12) {
  console.log('🎯 OPTIMAL TIME: Friday technical post timing!');
} else {
  console.log(`ℹ️ Current time: ${dayOfWeek} ${utcHour}:00 UTC`);
}

console.log('\n✅ Blog Automation Setup Test Complete!');
console.log('\n📚 Next Steps:');
console.log('1. Add the environment variables as GitHub Secrets');
console.log('2. Push the workflow files to your repository');
console.log('3. Test manual trigger from GitHub Actions');
console.log('4. Wait for scheduled posts or trigger manually');
console.log('\nFor detailed instructions, see: docs/BLOG_AUTOMATION.md');
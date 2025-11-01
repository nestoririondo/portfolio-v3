// Test the improved duplicate detection logic

const topic = 'Customer service automation during Black Friday rush';
const existingTitle = '4 Critical E-commerce Optimizations for Your Berlin Business This Black Friday 2025';

const topicKeywords = topic.toLowerCase().split(/[\s-_]+/)
  .filter(keyword => keyword.length > 3)
  .filter(keyword => !['business', 'website', 'berlin', 'german', 'companies'].includes(keyword));

const titleLower = existingTitle.toLowerCase();

console.log('Original topic:', topic);
console.log('Existing title:', existingTitle);
console.log('Filtered topic keywords:', topicKeywords);
console.log('Title (lowercase):', titleLower);

const matchingKeywords = topicKeywords.filter(keyword => titleLower.includes(keyword));
console.log('Matching keywords:', matchingKeywords);

const isDuplicate = matchingKeywords.length >= 2 || 
                   (matchingKeywords.length === 1 && matchingKeywords[0].length > 8);

console.log('Should detect duplicate:', isDuplicate);
console.log('Reason:', matchingKeywords.length >= 2 ? `${matchingKeywords.length} keywords match` : 
           matchingKeywords.length === 1 && matchingKeywords[0].length > 8 ? `1 long keyword: ${matchingKeywords[0]}` : 
           'No significant matches');

// Test other scenarios
console.log('\n--- Testing other topics ---');

const testCases = [
  'AI integration for Berlin business websites',
  'Website loading speed crucial for holiday shopping',
  'Payment gateway setup for Black Friday sales surge',
  'TypeScript development best practices'
];

testCases.forEach(testTopic => {
  const testKeywords = testTopic.toLowerCase().split(/[\s-_]+/)
    .filter(keyword => keyword.length > 3)
    .filter(keyword => !['business', 'website', 'berlin', 'german', 'companies'].includes(keyword));
  
  const testMatches = testKeywords.filter(keyword => titleLower.includes(keyword));
  const testDuplicate = testMatches.length >= 2 || 
                       (testMatches.length === 1 && testMatches[0].length > 8);
  
  console.log(`\n"${testTopic}"`);
  console.log(`  Keywords: ${testKeywords.join(', ')}`);
  console.log(`  Matches: ${testMatches.join(', ')}`);
  console.log(`  Duplicate: ${testDuplicate}`);
});
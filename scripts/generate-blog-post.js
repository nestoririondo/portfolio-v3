import Anthropic from '@anthropic-ai/sdk';
import { createClient } from 'contentful-management';
import { blogPromptTemplate } from './blog-prompt-template.js';
import { validateAndCleanContent } from './content-validator.js';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const contentfulManagement = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const topics = [
  'Website speed optimization for Berlin restaurants',
  'GDPR compliance for German small businesses',
  'Mobile-first design trends in 2025',
  'Local SEO strategies for Berlin companies',
  'E-commerce conversion optimization',
  'Website accessibility requirements in Germany',
  'Social media integration for business websites',
  'Content management system selection guide',
];

async function generateBlogPost(maxRetries = 3) {
  const topic = topics[Math.floor(Math.random() * topics.length)];
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Generating content for "${topic}"`);
      
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        messages: [{ 
          role: 'user', 
          content: blogPromptTemplate(topic)
        }]
      });
      
      const rawContent = response.content[0].text;
      const validation = validateAndCleanContent(rawContent);
      
      if (validation.isValid) {
        console.log('✅ Content validation passed');
        await publishToContentful(validation);
        return validation;
      } else {
        console.log(`❌ Attempt ${attempt} failed validation:`, validation.errors);
        
        if (attempt === maxRetries) {
          // Last attempt - publish anyway with fixes
          console.log('⚠️ Publishing with automatic fixes');
          const fixed = applyAutomaticFixes(validation);
          await publishToContentful(fixed);
          return fixed;
        }
      }
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw error;
      }
    }
  }
}

function applyAutomaticFixes(validation) {
  let { title, excerpt, content } = validation;
  
  // Fix title length
  if (title.length > 60) {
    title = title.substring(0, 57) + '...';
  }
  
  // Fix excerpt length
  if (excerpt.length > 160) {
    excerpt = excerpt.substring(0, 157) + '...';
  } else if (excerpt.length < 150) {
    excerpt += ' Learn more about improving your business website.';
    if (excerpt.length > 160) {
      excerpt = excerpt.substring(0, 157) + '...';
    }
  }
  
  // Ensure minimum H2 sections
  const h2Count = (content.match(/^## /gm) || []).length;
  if (h2Count < 3) {
    content += '\n\n## Next Steps\n\nReady to improve your website? Contact us for a free consultation.';
  }
  
  return {
    ...validation,
    title,
    excerpt,
    content,
    isValid: true,
    errors: []
  };
}

async function publishToContentful(blogData) {
  try {
    const space = await contentfulManagement.getSpace(process.env.CONTENTFUL_SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    const entry = await environment.createEntry('blogPost', {
      fields: {
        title: { 'en-US': blogData.title },
        slug: { 'en-US': blogData.slug },
        excerpt: { 'en-US': blogData.excerpt },
        content: { 'en-US': blogData.content },
        publishedDate: { 'en-US': new Date().toISOString() },
        author: { 'en-US': 'Néstor Iriondo' }
      }
    });
    
    await entry.publish();
    console.log(`✅ Published: "${blogData.title}"`);
    
  } catch (error) {
    console.error('❌ Failed to publish to Contentful:', error);
    throw error;
  }
}

// Run if called directly
if (process.env.NODE_ENV !== 'test') {
  generateBlogPost()
    .then(result => {
      console.log('🎉 Blog post generated successfully:', result.title);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Failed to generate blog post:', error);
      process.exit(1);
    });
}

export { generateBlogPost };
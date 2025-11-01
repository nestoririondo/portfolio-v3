# Blog Automation System

This system automatically generates and publishes blog posts for your Berlin web development business using AI and GitHub Actions.

## 🔄 Automated Scheduling

### Regular Posts
- **Tuesday 9:00 AM CET**: Weekly business-focused post
- **Friday 2:00 PM CET**: Weekly technical/trend post

*Perfect timing for maximum engagement - Tuesday for business planning and Friday for weekend reading.*

## 🎯 Smart Topic Selection

The system automatically detects and adapts to:

### Seasonal Events
- **January**: New Year website resolutions
- **February**: Valentine's Day marketing strategies  
- **March-April**: Spring website refresh
- **May**: GDPR compliance updates (around May 25th anniversary)
- **June-July**: Summer mobile optimization
- **August-September**: Back-to-business strategies
- **October-November**: Black Friday e-commerce prep
- **December**: Holiday season optimization

### Trending Topics
- AI integration for businesses
- Sustainable web development
- Web3 and blockchain
- Progressive Web Apps
- Voice search optimization

## 🚀 Manual Triggers

### Regular On-Demand Post
1. Go to GitHub Actions in your repository
2. Select "Automated Blog Generation"
3. Click "Run workflow"
4. Optional: Specify a custom topic
5. Optional: Disable event checking

### Breaking News Post
1. Go to GitHub Actions in your repository
2. Select "Breaking News Blog Post"
3. Click "Run workflow"
4. Enter the breaking news topic
5. Set urgency level (high/medium/low)
6. Add context if needed

## ⚙️ Setup Requirements

### GitHub Secrets
You need to add these secrets to your GitHub repository:

```
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token
CLAUDE_API_KEY=your_claude_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
UNSPLASH_SECRET_KEY=your_unsplash_secret_key
```

### How to Add Secrets
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret with the exact name and value

## 🧠 Smart Features

### Duplicate Prevention
- Checks existing blog posts before generating
- Avoids similar topics and titles
- Prevents overused keywords

### Image Duplication Prevention
- Checks against existing featured images
- Finds unique images from Unsplash
- Falls back to alternative searches if needed

### Content Quality
- 600-800 word posts
- SEO-optimized titles (under 65 characters)
- Complete meta descriptions (120-140 characters)
- Berlin-specific context
- Professional yet conversational tone

## 📊 Workflow Outputs

Each workflow run provides:
- **Summary**: Date, trigger type, topic selection
- **Special Events**: Any detected seasonal topics
- **Trending Topics**: Current tech trend suggestions
- **Status**: Success/failure with details

## 🎨 Content Structure

### Regular Posts
```
Title (with emoji in headlines)
Meta Description
Introduction (50-80 words)
3-4 Main Sections (100-150 words each)
- H2 headlines with relevant emojis
- Bullet points when natural
- Bold key terms
Conclusion with CTA (50-80 words)
```

### Breaking News Posts
```
Urgent Title (conveying immediacy)
Meta Description
Urgent Opening (60-80 words)
🚨 What Just Happened
⚠️ Immediate Impact on Berlin Businesses
💡 Action Steps for Business Owners
- Immediate actionable steps
Reassuring Conclusion
```

## 🕒 Best Posting Times

### Tuesday 9 AM CET
- **Why**: Start of business week planning
- **Audience**: Business owners planning their week
- **Content**: Strategic, planning-focused topics

### Friday 2 PM CET  
- **Why**: End of week, weekend reading
- **Audience**: People with time to read longer content
- **Content**: Technical trends, future planning

## 🔧 Customization

### Adding New Seasonal Events
Edit `.github/workflows/blog-automation.yml` in the "Check current date and events" step:

```bash
# Add your custom event
if [[ "$MONTH" == "YourMonth" && "$DAY_OF_MONTH" -ge XX && "$DAY_OF_MONTH" -le YY ]]; then
  SPECIAL_TOPIC="Your custom topic for Berlin businesses"
fi
```

### Adding New Regular Topics
Edit `scripts/generate-blog-post.js` in the `topics` array:

```javascript
const topics = [
  'Your new topic here',
  // ... existing topics
];
```

## 📈 Monitoring

### Check Workflow Status
1. Go to GitHub Actions tab
2. View recent workflow runs
3. Check logs for any errors
4. Review generated content summaries

### Contentful Verification
1. Log into Contentful dashboard
2. Check new blog posts in the "Blog Post" content model
3. Verify images and content quality
4. Publish manually if needed (posts auto-publish)

## 🐛 Troubleshooting

### Common Issues

**"No blog post generated"**
- Usually means all topics are duplicates
- Run with a custom topic or wait for trending topics to refresh

**"Image upload failed"**  
- Check Unsplash API limits
- Verify Unsplash credentials in secrets

**"Claude API error"**
- Check Claude API key and credits
- Verify API key in GitHub secrets

**"Contentful error"**
- Verify all Contentful tokens are correct
- Check space ID and environment settings

### Getting Help
- Check GitHub Actions logs for detailed error messages
- Verify all secrets are properly set
- Test individual scripts locally first

## 🎉 Success Metrics

Your automated blog system will:
- Generate 2 high-quality posts per week
- Maintain content freshness with seasonal relevance
- Avoid duplicate content and images
- Provide consistent Berlin business focus
- Support emergency/breaking news coverage
- Scale your content marketing effortlessly
# 🔧 Pexels API Setup Instructions

## Getting Your Free Pexels API Key

1. **Visit Pexels API**: Go to https://www.pexels.com/api/
2. **Sign Up**: Create a free account (or log in if you have one)
3. **Get API Key**: Click "Get Started" and generate your free API key
4. **Rate Limits**: Free tier includes:
   - 200 requests per hour
   - 20,000 requests per month
   - No attribution required (but appreciated)

## Add to Environment Variables

### Local Development (.env.local)

```bash
PEXELS_API_KEY=your_pexels_api_key_here
```

### GitHub Actions (Repository Secrets)

1. Go to your repository on GitHub
2. Settings → Secrets and variables → Actions
3. Add new repository secret:
   - Name: `PEXELS_API_KEY`
   - Value: Your API key from Pexels

## Benefits Over Unsplash

✅ **Better Quality**: Higher resolution images
✅ **More Variety**: 3.2M+ photos vs Unsplash's limited selection  
✅ **Better Search**: More accurate topic matching
✅ **Higher Limits**: 20K requests/month vs Unsplash's 5K
✅ **Business Friendly**: More professional/business oriented photos
✅ **No Attribution Required**: Cleaner blog posts
✅ **Better API**: More reliable and faster responses

## Migration Complete ✅

- ❌ Removed Unsplash dependency
- ✅ Added Pexels API integration
- ✅ Updated image fetching functions
- ✅ Maintained duplicate detection
- ✅ Preserved fallback system
- ✅ Better error handling

Your blog automation will now use Pexels for higher quality, more relevant images!

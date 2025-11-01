export const formattingPromptAddons = {
  // Add to the end of your main prompt
  strictFormatting: `

CRITICAL: Your response must follow this EXACT format. Any deviation will be rejected.

EXAMPLE OUTPUT:
# Why Berlin Startups Need Lightning-Fast Websites

Modern users expect websites to load in under 2 seconds. For Berlin startups competing in a fast-paced market, website speed directly impacts customer acquisition and revenue growth.

## Speed Impacts User Experience
Fast websites keep visitors engaged and reduce bounce rates...

## Technical Performance Factors  
Several key factors determine your website's loading speed...

## Business Impact in Berlin Market
In Berlin's competitive startup ecosystem...

- **Mobile optimization** is crucial for local customers
- **Core Web Vitals** affect Google search rankings  
- **User retention** increases by 70% with fast sites

## Ready to Accelerate Your Growth?
A fast website isn't just nice to have—it's essential for Berlin startups. Professional optimization can increase your conversion rates and help you compete effectively in the local market.

END EXAMPLE

Now write your blog post following this exact structure and formatting.`,

  // Quality checks prompt
  qualityChecks: `
Before submitting your response, verify:
✓ Title is under 60 characters
✓ Meta description is 150-160 characters  
✓ Content has 3+ H2 sections
✓ Content includes 3+ bullet points with **bold**
✓ Word count is 600-800 words
✓ Ends with call-to-action mentioning web services
✓ Uses proper markdown formatting throughout
`,

  // Backup instruction
  fallbackInstruction: `
If you cannot follow the format exactly, respond with:
"FORMAT_ERROR: [brief reason]"
This will trigger a retry with a simpler prompt.`
};

export function enhancePrompt(basePrompt) {
  return basePrompt + 
    formattingPromptAddons.strictFormatting + 
    formattingPromptAddons.qualityChecks;
}
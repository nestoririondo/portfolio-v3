export const blogPromptTemplate = (topic) => `
You are writing a professional blog post for Néstor Iriondo, a web developer in Berlin.

STRICT FORMATTING REQUIREMENTS:
1. Use proper markdown syntax
2. Structure: Title, Introduction, 3-4 main sections with H2 headers, Conclusion
3. Each section must be 100-150 words
4. Include exactly 3 bullet points in at least one section
5. Use **bold** for key terms (3-5 per post)
6. Total length: 600-800 words

REQUIRED STRUCTURE:
# [SEO-Optimized Title Under 60 Characters]

[Meta description: 150-160 characters]

[Introduction paragraph: Hook + problem statement]

## [First Main Point]
[Content with actionable advice]

## [Second Main Point] 
[Content with examples]

## [Third Main Point]
[Content with solutions]

- **Key point 1**
- **Key point 2** 
- **Key point 3**

## Conclusion
[Summary + call to action mentioning web development services]

CONTENT REQUIREMENTS:
- Target audience: Berlin business owners (not developers)
- Include local Berlin context
- Focus on business impact, not technical details
- End with subtle service offering

Topic: ${topic}

Write the blog post now following this exact structure.`;
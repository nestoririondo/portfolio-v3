function validateAndCleanContent(content) {
  // Extract title, meta description, and body
  const lines = content.split("\n");
  let title = "";
  let metaDescription = "";
  let body = "";

  let isParsingBody = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Extract title (first # heading)
    if (line.startsWith("# ") && !title) {
      title = line.replace("# ", "").trim();
      continue;
    }

    // Extract meta description
    if (line.startsWith("[Meta description:") && line.includes("]")) {
      metaDescription = line.match(/\[Meta description:\s*(.+?)\]/)?.[1] || "";
      continue;
    }

    // Start collecting body after meta description
    if (metaDescription && line && !line.startsWith("[")) {
      isParsingBody = true;
    }

    if (isParsingBody) {
      body += lines[i] + "\n";
    }
  }

  // Validation checks
  const errors = [];

  if (!title || title.length > 55) {
    errors.push(`Title too long: ${title.length}/55 chars`);
  }

  if (
    !metaDescription ||
    metaDescription.length < 140 ||
    metaDescription.length > 150
  ) {
    errors.push(`Meta description wrong length: ${metaDescription.length}/140-150 chars`);
  }

  const wordCount = body.split(/\s+/).length;
  if (wordCount < 400 || wordCount > 1000) {
    errors.push(`Word count ${wordCount} outside 400-1000 range`);
  }
  const h2Count = (body.match(/^## /gm) || []).length;
  if (h2Count < 3) {
    errors.push("Need at least 3 H2 sections");
  }

  const bulletPoints = (body.match(/^- \*\*/gm) || []).length;
  if (bulletPoints > 0 && bulletPoints < 3) {
    errors.push("If using bullet points, need at least 3 with bold formatting");
  }

  return {
    isValid: errors.length === 0,
    errors,
    title: title.trim(),
    excerpt: metaDescription.trim(),
    content: body.trim(),
    slug: generateSlug(title),
    wordCount,
  };
}

// Helper to generate URL-friendly slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60);
}

export { validateAndCleanContent };

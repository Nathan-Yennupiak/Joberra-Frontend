// Strips HTML tags and basic Markdown symbols from a string to render a clean snippet
export const stripFormatting = (text: string | undefined): string => {
  if (!text) return "";
  
  // Strip HTML tags
  let stripped = text.replace(/<[^>]*>?/gm, '');
  
  // Strip common Markdown formatting
  stripped = stripped.replace(/(\*\*|__)(.*?)\1/g, '$2'); // Bold
  stripped = stripped.replace(/(\*|_)(.*?)\1/g, '$2'); // Italics
  stripped = stripped.replace(/~~(.*?)~~/g, '$1'); // Strikethrough
  stripped = stripped.replace(/#{1,6}\s?/g, ''); // Headers
  stripped = stripped.replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Links
  stripped = stripped.replace(/`{1,3}(.*?)`{1,3}/g, '$1'); // Inline code
  
  // Replace multiple newlines or spaces with a single space
  stripped = stripped.replace(/\s+/g, ' ').trim();
  
  return stripped;
};

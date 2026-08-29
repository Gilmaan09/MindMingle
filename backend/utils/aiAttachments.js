const textLikeMimeTypes = new Set([
  'text/plain',
  'text/csv',
  'text/markdown',
  'text/xml',
  'application/json',
  'application/xml',
  'application/javascript',
  'application/pdf'
]);

const sanitizeText = (value = '') => String(value).replace(/\s+/g, ' ').trim();

function normalizeAssistantReply(content) {
  if (typeof content === 'string') return content.trim();

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item.text === 'string') return item.text;
        if (item && Array.isArray(item.content)) return normalizeAssistantReply(item.content);
        if (item && typeof item.content === 'string') return item.content;
        return '';
      })
      .filter(Boolean)
      .join('\n');
  }

  if (content && typeof content === 'object') {
    if (typeof content.text === 'string') return content.text.trim();
    if (Array.isArray(content.content)) return normalizeAssistantReply(content.content);
    if (typeof content.content === 'string') return content.content.trim();
  }

  return '';
}

async function extractTextAttachment(file) {
  if (!file || !file.buffer) return '';

  const mimetype = (file.mimetype || '').toLowerCase();
  if (!mimetype || !textLikeMimeTypes.has(mimetype)) return '';

  if (mimetype.startsWith('text/') || mimetype.includes('json') || mimetype.includes('xml') || mimetype.includes('csv')) {
    return sanitizeText(file.buffer.toString('utf8'));
  }

  if (mimetype === 'application/pdf') {
    return `Attached PDF document: ${file.originalname}. The assistant can review the file name and content context if the user adds a text-based summary.`;
  }

  return '';
}

async function buildUserContent({ message = '', files = [] } = {}) {
  const content = [];
  const trimmedMessage = sanitizeText(message);

  if (trimmedMessage) {
    content.push({ type: 'text', text: trimmedMessage });
  }

  for (const file of files || []) {
    if (!file || !file.buffer) continue;

    const mimetype = (file.mimetype || '').toLowerCase();

    if (mimetype.startsWith('image/')) {
      content.push({
        type: 'image_url',
        image_url: {
          url: `data:${mimetype};base64,${file.buffer.toString('base64')}`
        }
      });
      continue;
    }

    const extractedText = await extractTextAttachment(file);

    if (extractedText) {
      content.push({
        type: 'text',
        text: `Attached document: ${file.originalname} (${mimetype})\n${extractedText}`
      });
      continue;
    }

    content.push({
      type: 'text',
      text: `Attached file: ${file.originalname} (${mimetype || 'unknown type'}). The assistant can use the file name and user description to help respond.`
    });
  }

  if (!content.length) {
    return [{ type: 'text', text: 'Please help me with my current need.' }];
  }

  return content;
}

module.exports = {
  buildUserContent,
  normalizeAssistantReply
};

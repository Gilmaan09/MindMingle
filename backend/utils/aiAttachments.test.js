const test = require('node:test');
const assert = require('node:assert/strict');
const { buildUserContent, normalizeAssistantReply } = require('./aiAttachments');

test('buildUserContent includes image and text parts for multimodal prompts', async () => {
    const content = await buildUserContent({
        message: 'Please review this image.',
        files: [
            { originalname: 'mood.png', mimetype: 'image/png', buffer: Buffer.from('fake-image') },
            { originalname: 'notes.txt', mimetype: 'text/plain', buffer: Buffer.from('I feel anxious') }
        ]
    });

    assert.equal(content[0].type, 'text');
    assert.equal(content[0].text, 'Please review this image.');
    assert.equal(content[1].type, 'image_url');
    assert.equal(content[2].type, 'text');
    assert.match(content[2].text, /notes.txt/);
});

test('normalizeAssistantReply turns array content into plain text', () => {
    const reply = normalizeAssistantReply([
        { type: 'text', text: 'First line' },
        { type: 'text', text: 'Second line' }
    ]);

    assert.equal(reply, 'First line\nSecond line');
});

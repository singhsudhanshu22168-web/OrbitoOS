// LLM provider abstraction for the Council's specialists and Chair.
//
// OpenAI is the provider this project is configured to run on. An Anthropic
// path is included as a drop-in alternative if a Claude key is ever added
// instead — same call shape in, same plain string out, so agents/council.js
// never has to know which provider answered.
//
// Precedence: OPENAI_API_KEY, then ANTHROPIC_API_KEY, then no client (the
// rule-based simulation in council.js takes over).

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

let anthropicClient = null;
let openaiClient = null;

function activeProvider() {
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  return null;
}

function getAnthropicClient() {
  if (!anthropicClient) {
    const Anthropic = require('@anthropic-ai/sdk');
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropicClient;
}

function getOpenAIClient() {
  if (!openaiClient) {
    const OpenAI = require('openai');
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

async function callModel(systemPrompt, userContent) {
  const provider = activeProvider();
  if (!provider) return null;

  if (provider === 'anthropic') {
    const client = getAnthropicClient();
    const resp = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }]
    });
    return resp.content.map(b => (b.type === 'text' ? b.text : '')).join('');
  }

  // OpenAI path
  const client = getOpenAIClient();
  const resp = await client.chat.completions.create({
    model: OPENAI_MODEL,
    max_tokens: 400,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ]
  });
  return resp.choices?.[0]?.message?.content || '';
}

module.exports = { callModel, activeProvider };

// Lightweight local "embedding" for case-precedent memory.
//
// The RFC calls for pgvector over real LLM embeddings (OpenAI/Voyage). For a
// hackathon build that needs to run with zero extra API keys, this swaps in a
// deterministic hashed bag-of-words vector + cosine similarity — same interface
// (embed -> fixed-length float vector -> cosine similarity), same call sites.
// Swapping this module for a real embeddings client later touches nothing else.

const DIMENSIONS = 256;

function hashToken(token) {
  let h = 2166136261;
  for (let i = 0; i < token.length; i++) {
    h ^= token.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % DIMENSIONS;
}

function embed(text) {
  const vec = new Array(DIMENSIONS).fill(0);
  const tokens = String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  for (const t of tokens) {
    vec[hashToken(t)] += 1;
  }

  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map(v => v / norm);
}

function cosineSimilarity(a, b) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot; // both already unit-normalized
}

function nearestCases(situationText, candidates, topK = 3) {
  const queryVec = embed(situationText);
  return candidates
    .map(c => ({ ...c, similarity: cosineSimilarity(queryVec, JSON.parse(c.embedding)) }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

module.exports = { embed, cosineSimilarity, nearestCases };

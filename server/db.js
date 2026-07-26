// OrbitOS Sentinel Council — persistence layer.
// SQLite (file-backed, zero external services) instead of the Postgres/pgvector
// pitched in the RFC — same schema shape, chosen so a judge can `npm install && npm start`
// with nothing else to provision. Swap in Postgres+pgvector later without touching the graph.

const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, 'data', 'sentinel.db'));
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'member', -- 'member' | 'mentor'
  skills TEXT NOT NULL DEFAULT '[]',   -- JSON array
  engagement_baseline REAL NOT NULL DEFAULT 0.6,
  last_commit_days_ago INTEGER NOT NULL DEFAULT 0,
  event_attendance_30d INTEGER NOT NULL DEFAULT 0,
  mentor_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS mentor_load (
  mentor_id TEXT PRIMARY KEY,
  mentee_count INTEGER NOT NULL DEFAULT 0,
  capacity INTEGER NOT NULL DEFAULT 6,
  avg_response_latency_hours REAL NOT NULL DEFAULT 4
);

CREATE TABLE IF NOT EXISTS threads (
  id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  sentiment_trend REAL NOT NULL DEFAULT 0, -- -1 (heated/negative) .. 1 (positive)
  message_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS agent_runs (
  id TEXT PRIMARY KEY,
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  status TEXT NOT NULL DEFAULT 'debating', -- debating | queued | executed | dismissed
  transcript TEXT NOT NULL DEFAULT '[]',   -- JSON array of turns, appended live
  plan TEXT,                               -- JSON
  confidence REAL
);

CREATE TABLE IF NOT EXISTS interventions (
  id TEXT PRIMARY KEY,
  agent_run_id TEXT NOT NULL,
  member_id TEXT,
  action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | approved | executed | dismissed
  reasoning TEXT NOT NULL,
  confidence REAL NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS case_embeddings (
  id TEXT PRIMARY KEY,
  intervention_id TEXT NOT NULL,
  situation TEXT NOT NULL,
  embedding TEXT NOT NULL, -- JSON float array
  outcome TEXT NOT NULL DEFAULT 'unresolved' -- resolved | ignored | escalated | unresolved
);
`);

function seedIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM members').get().c;
  if (count > 0) return;

  const members = [
    { id: 'm-alex', name: 'Alex Novak', email: 'alex.novak@github.com', role: 'member', skills: ['Rust', 'TypeScript', 'Docker'], baseline: 0.78, lastCommit: 6, events30d: 0, mentorId: 'm-elena' },
    { id: 'm-david', name: 'David Lee', email: 'david.l@gmail.com', role: 'member', skills: ['Rust', 'WebAssembly'], baseline: 0.7, lastCommit: 14, events30d: 0, mentorId: 'm-elena' },
    { id: 'm-sid', name: 'Siddharth Nair', email: 'sidnair@outlook.com', role: 'member', skills: ['Solidity', 'React'], baseline: 0.55, lastCommit: 11, events30d: 1, mentorId: 'm-marcus' },
    { id: 'm-kai', name: 'Kai Takahashi', email: 'kai.t@proton.me', role: 'member', skills: ['Rust', 'Systems'], baseline: 0.6, lastCommit: 2, events30d: 2, mentorId: 'm-marcus' },
    { id: 'm-yuki', name: 'Yuki Sato', email: 'yuki.sato@icloud.com', role: 'member', skills: ['Python', 'AI/ML'], baseline: 0.5, lastCommit: 3, events30d: 3, mentorId: 'm-aria' },
    { id: 'm-elena', name: 'Elena Rostova', email: 'elena.r@systemsguild.dev', role: 'mentor', skills: ['Rust', 'Systems', 'Compilers'], baseline: 0.9, lastCommit: 1, events30d: 4, mentorId: null },
    { id: 'm-marcus', name: 'Marcus Chen', email: 'marcus.c@staffeng.dev', role: 'mentor', skills: ['Rust', 'Compilers', 'WebAssembly'], baseline: 0.85, lastCommit: 2, events30d: 3, mentorId: null },
    { id: 'm-aria', name: 'Aria Vance', email: 'aria.v@orbitos.dev', role: 'mentor', skills: ['AI/ML', 'Product'], baseline: 0.88, lastCommit: 1, events30d: 5, mentorId: null }
  ];

  const insertMember = db.prepare(`
    INSERT INTO members (id, name, email, role, skills, engagement_baseline, last_commit_days_ago, event_attendance_30d, mentor_id)
    VALUES (@id, @name, @email, @role, @skills, @baseline, @lastCommit, @events30d, @mentorId)
  `);
  const tx = db.transaction((rows) => {
    for (const r of rows) {
      insertMember.run({ ...r, skills: JSON.stringify(r.skills) });
    }
  });
  tx(members);

  const insertLoad = db.prepare(`
    INSERT INTO mentor_load (mentor_id, mentee_count, capacity, avg_response_latency_hours) VALUES (?, ?, ?, ?)
  `);
  insertLoad.run('m-elena', 5, 5, 26); // over capacity, slow to respond -> Mentor-Load Agent should flag
  insertLoad.run('m-marcus', 2, 6, 4);
  insertLoad.run('m-aria', 3, 6, 3);

  const insertThread = db.prepare(`INSERT INTO threads (id, topic, sentiment_trend, message_count) VALUES (?, ?, ?, ?)`);
  insertThread.run('t-1', 'Actix vs Axum benchmark thread', -0.4, 38);
  insertThread.run('t-2', 'Rust Hackathon team formation', 0.6, 22);
}

seedIfEmpty();

module.exports = db;

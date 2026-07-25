// Scoped READ tools available to the Council's specialist agents.
// Every specialist gets only the 2-3 tools relevant to its domain — none of them,
// including the Chair, can write except through executeIntervention() in council.js.

const db = require('../db');

function getCommitHistory(memberId) {
  const m = db.prepare('SELECT id, name, last_commit_days_ago, engagement_baseline FROM members WHERE id = ?').get(memberId);
  if (!m) return null;
  return {
    memberId: m.id,
    name: m.name,
    lastCommitDaysAgo: m.last_commit_days_ago,
    baseline: m.engagement_baseline
  };
}

function getEventAttendance(memberId) {
  const m = db.prepare('SELECT id, event_attendance_30d FROM members WHERE id = ?').get(memberId);
  if (!m) return null;
  return { memberId: m.id, eventsLast30Days: m.event_attendance_30d };
}

function getEngagementBaseline(memberId) {
  const m = db.prepare('SELECT id, engagement_baseline FROM members WHERE id = ?').get(memberId);
  if (!m) return null;
  return { memberId: m.id, baseline: m.engagement_baseline };
}

function getMentorLoad(mentorId) {
  const row = db.prepare('SELECT * FROM mentor_load WHERE mentor_id = ?').get(mentorId);
  if (!row) return null;
  return {
    mentorId,
    menteeCount: row.mentee_count,
    capacity: row.capacity,
    utilization: row.mentee_count / row.capacity
  };
}

function getResponseLatency(mentorId) {
  const row = db.prepare('SELECT avg_response_latency_hours FROM mentor_load WHERE mentor_id = ?').get(mentorId);
  if (!row) return null;
  return { mentorId, avgResponseLatencyHours: row.avg_response_latency_hours };
}

function getSkillGraph() {
  const rows = db.prepare('SELECT id, name, role, skills FROM members').all();
  return rows.map(r => ({ id: r.id, name: r.name, role: r.role, skills: JSON.parse(r.skills) }));
}

function getThreadSentimentTrend() {
  return db.prepare('SELECT id, topic, sentiment_trend, message_count FROM threads').all();
}

function getProjectMomentum() {
  // No project-tracking table yet in this slice; a stable, clearly-labeled stand-in
  // for the Event-Timing Agent's read tool rather than a fabricated live signal.
  return { activeProjects: 3, avgWeeklyCommits: 41, trend: 'steady' };
}

function getCalendar() {
  return { nextOpenSlot: 'in 4 days', lastWorkshop: '11 days ago' };
}

function listAtRiskCandidates() {
  return db.prepare(`
    SELECT id, name, last_commit_days_ago, engagement_baseline, mentor_id
    FROM members WHERE role = 'member'
    ORDER BY last_commit_days_ago DESC
  `).all();
}

function listMentors() {
  return db.prepare(`SELECT id, name FROM members WHERE role = 'mentor'`).all();
}

module.exports = {
  getCommitHistory,
  getEventAttendance,
  getEngagementBaseline,
  getMentorLoad,
  getResponseLatency,
  getSkillGraph,
  getThreadSentimentTrend,
  getProjectMomentum,
  getCalendar,
  listAtRiskCandidates,
  listMentors
};

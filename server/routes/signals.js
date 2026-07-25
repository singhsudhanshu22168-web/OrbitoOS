const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const members = db.prepare('SELECT id, name, role, skills, engagement_baseline, last_commit_days_ago, event_attendance_30d, mentor_id FROM members').all();
  const mentorLoad = db.prepare('SELECT * FROM mentor_load').all();
  const threads = db.prepare('SELECT * FROM threads').all();
  res.json({
    members: members.map(m => ({ ...m, skills: JSON.parse(m.skills) })),
    mentorLoad,
    threads
  });
});

module.exports = router;

const express = require('express');
const db = require('../db');
const { runCouncil, approveIntervention, dismissIntervention } = require('../agents/council');
const { broadcast } = require('../ws');

const router = express.Router();

let running = false;

router.post('/convene', (req, res) => {
  if (running) return res.status(409).json({ error: 'A Council session is already in progress.' });
  running = true;
  res.status(202).json({ status: 'convening' });
  runCouncil(broadcast)
    .catch(err => broadcast({ type: 'error', message: err.message }))
    .finally(() => { running = false; });
});

router.post('/intervention/:id/approve', (req, res) => {
  const iv = approveIntervention(req.params.id, broadcast);
  if (!iv) return res.status(404).json({ error: 'Intervention not found or not pending.' });
  res.json({ status: 'executed' });
});

router.post('/intervention/:id/dismiss', (req, res) => {
  const iv = dismissIntervention(req.params.id, broadcast);
  if (!iv) return res.status(404).json({ error: 'Intervention not found or not pending.' });
  res.json({ status: 'dismissed' });
});

router.get('/interventions', (req, res) => {
  res.json(db.prepare('SELECT * FROM interventions ORDER BY created_at DESC LIMIT 20').all());
});

router.get('/runs/:id', (req, res) => {
  const run = db.prepare('SELECT * FROM agent_runs WHERE id = ?').get(req.params.id);
  if (!run) return res.status(404).json({ error: 'Run not found.' });
  res.json({ ...run, transcript: JSON.parse(run.transcript), plan: run.plan ? JSON.parse(run.plan) : null });
});

module.exports = router;

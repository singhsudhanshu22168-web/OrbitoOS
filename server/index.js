const express = require('express');
const cors = require('cors');
const http = require('http');

const councilRoutes = require('./routes/council');
const signalsRoutes = require('./routes/signals');
const ws = require('./ws');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/council', councilRoutes);
app.use('/api/signals', signalsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', anthropicConfigured: Boolean(process.env.ANTHROPIC_API_KEY) });
});

const server = http.createServer(app);
ws.attach(server);

const PORT = process.env.PORT || 8787;
server.listen(PORT, () => {
  console.log(`Sentinel Council backend listening on http://localhost:${PORT}`);
  console.log(process.env.ANTHROPIC_API_KEY
    ? 'ANTHROPIC_API_KEY detected — agents will reason with live Claude calls.'
    : 'No ANTHROPIC_API_KEY set — agents will run on rule-based simulation (same output contract).');
});

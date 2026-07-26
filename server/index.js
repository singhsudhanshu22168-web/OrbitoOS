require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');

const councilRoutes = require('./routes/council');
const signalsRoutes = require('./routes/signals');
const ws = require('./ws');
const { activeProvider } = require('./agents/llmClient');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/council', councilRoutes);
app.use('/api/signals', signalsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', llmProvider: activeProvider() || 'simulation' });
});

const server = http.createServer(app);
ws.attach(server);

const PORT = process.env.PORT || 8787;
server.listen(PORT, () => {
  console.log(`Sentinel Council backend listening on http://localhost:${PORT}`);
  const provider = activeProvider();
  console.log(provider
    ? `${provider === 'anthropic' ? 'ANTHROPIC_API_KEY' : 'OPENAI_API_KEY'} detected — agents will reason with live ${provider === 'anthropic' ? 'Claude' : 'OpenAI'} calls.`
    : 'No LLM API key set — agents will run on rule-based simulation (same output contract).');
});

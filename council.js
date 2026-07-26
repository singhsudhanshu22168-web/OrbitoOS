// ==========================================
// MODULE 12: SENTINEL COUNCIL (ADMIN)
// ==========================================
// Multi-agent governance layer over the Community Digital Twin. Talks to the
// real backend in /server (Express + SQLite + OpenAI-or-simulated agent
// graph) over REST + a WebSocket stream, following the same
// render<X>Tab()-returns-a-template-string convention as every other tab file.
//
// Backend location comes from window.ORBITOS_API_BASE / ORBITOS_WS_BASE, set
// in index.html — edit those two lines when frontend and backend are
// deployed to separate hosts. Falls back to localhost for local dev.

const COUNCIL_API_BASE = window.ORBITOS_API_BASE || 'http://localhost:8787';
const COUNCIL_WS_URL = `${window.ORBITOS_WS_BASE || 'ws://localhost:8787'}/council/stream`;

const COUNCIL_AGENTS = [
  { id: 'retention',    label: 'Retention Agent',        color: '#d97b6c' },
  { id: 'mentorLoad',   label: 'Mentor-Load Agent',      color: '#e0a655' },
  { id: 'knowledgeGap', label: 'Knowledge-Gap Agent',    color: '#6fd8be' },
  { id: 'eventTiming',  label: 'Event-Timing Agent',     color: '#8f8373' },
  { id: 'sentiment',    label: 'Sentiment Agent',        color: '#9a8fce' },
  { id: 'chair',        label: 'Council Chair',          color: '#c5a880' }
];

let councilSocket = null;
let councilConvening = false;
let councilTurnCount = 0;
let councilResolvedCount = 0;

function renderCouncilTab() {
  setTimeout(() => {
    setupCouncilStage();
    connectCouncilSocket();
    refreshInterventionQueue();
  }, 50);

  return `
    <div class="flex flex-col gap-6">

      <!-- Header -->
      <div class="flex justify-between align-end border-bottom p-b-6" style="border-bottom: 1px solid var(--border-primary);">
        <div class="max-w-xl">
          <span class="badge badge-champagne m-b-2">OrbitOS Signature Innovation</span>
          <h2 class="text-3xl font-light">The Sentinel Council</h2>
          <p class="text-sm color-secondary m-t-2">
            Five specialist agents watch the Community Digital Twin continuously. When their reads conflict, they argue it out — in view — before acting.
          </p>
        </div>
        <button class="btn btn-primary text-sm" id="council-convene-btn" onclick="conveneCouncil()">Convene Council</button>
      </div>

      <!-- Status strip -->
      <div class="card flex justify-between align-center p-4" id="council-status-strip">
        <span class="text-xs color-secondary" id="council-status-text">5 agents idle · awaiting convening</span>
        <span class="badge text-xs" id="council-connection-badge" style="color: var(--text-tertiary);">Connecting to stream…</span>
      </div>

      <!-- Chamber + Transcript -->
      <div class="grid grid-3 gap-6">

        <!-- Chamber (canvas + orbiting agents) -->
        <div class="card p-0" style="grid-column: span 2; height: 460px; background: #030303; position: relative; overflow: hidden;">
          <div class="p-6" style="position: absolute; top: 0; left: 0; z-index: 5;">
            <h3 class="text-md font-medium text-primary">Council Chamber</h3>
            <span class="text-xs color-secondary">Live over the Digital Twin</span>
          </div>
          <div id="council-stage" style="position: relative; width: 100%; height: 100%;">
            <svg id="council-tethers" width="100%" height="100%" style="position: absolute; top: 0; left: 0; pointer-events: none;"></svg>
            <div class="council-orb council-orb-chair" id="orb-chair" style="background: radial-gradient(circle at 35% 35%, #fff 0%, #c5a880 45%, #000 100%);">
              <span class="council-orb-label">Chair</span>
            </div>
            ${COUNCIL_AGENTS.filter(a => a.id !== 'chair').map(a => `
              <div class="council-orb" id="orb-${a.id}" style="background: radial-gradient(circle at 35% 35%, #fff 0%, ${a.color} 55%, #000 100%);">
                <span class="council-orb-label">${a.label.replace(' Agent', '')}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Live transcript -->
        <div class="card flex flex-col" style="height: 460px; padding: var(--space-4);">
          <h3 class="text-xs color-tertiary uppercase tracking-wider m-b-3">Live Deliberation</h3>
          <div class="flex flex-col gap-3 flex-1 overflow-y-auto" id="council-transcript" style="font-size: 0.78rem;">
            <p class="color-tertiary text-xs">Transcript will stream here once the Council convenes.</p>
          </div>
        </div>

      </div>

      <!-- Action Queue -->
      <div class="card p-6">
        <h3 class="text-xs color-tertiary uppercase tracking-wider m-b-4">Action Queue</h3>
        <div class="flex flex-col gap-4" id="council-action-queue">
          <p class="color-tertiary text-xs">No interventions queued yet.</p>
        </div>
      </div>

    </div>
  `;
}

function setupCouncilStage() {
  const stage = $('council-stage');
  if (!stage) return;
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.32;

  const chair = $('orb-chair');
  chair.style.left = `${cx}px`;
  chair.style.top = `${cy}px`;

  const specialists = COUNCIL_AGENTS.filter(a => a.id !== 'chair');
  specialists.forEach((a, i) => {
    const angle = (i / specialists.length) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    const orb = $(`orb-${a.id}`);
    orb.style.left = `${x}px`;
    orb.style.top = `${y}px`;
    orb.dataset.cx = x;
    orb.dataset.cy = y;
  });

  chair.dataset.cx = cx;
  chair.dataset.cy = cy;
}

function connectCouncilSocket() {
  if (councilSocket && councilSocket.readyState === WebSocket.OPEN) return;
  try {
    councilSocket = new WebSocket(COUNCIL_WS_URL);
  } catch (e) {
    setCouncilConnectionBadge(false);
    return;
  }

  councilSocket.onopen = () => setCouncilConnectionBadge(true);
  councilSocket.onclose = () => setCouncilConnectionBadge(false);
  councilSocket.onerror = () => setCouncilConnectionBadge(false);
  councilSocket.onmessage = (evt) => {
    let data;
    try { data = JSON.parse(evt.data); } catch { return; }
    handleCouncilEvent(data);
  };
}

function setCouncilConnectionBadge(connected) {
  const badge = $('council-connection-badge');
  if (!badge) return;
  if (connected) {
    badge.innerText = 'Stream connected';
    badge.style.color = 'var(--accent-champagne)';
  } else {
    badge.innerText = 'Backend offline — run `npm start` in /server';
    badge.style.color = 'var(--text-tertiary)';
  }
}

function handleCouncilEvent(evt) {
  switch (evt.type) {
    case 'connected':
      break;
    case 'run_started':
      councilConvening = true;
      councilTurnCount = 0;
      clearCouncilTranscript();
      updateCouncilStatus('Council convening…');
      resetOrbStates();
      break;
    case 'agent_active':
      pulseOrb(evt.agentId);
      break;
    case 'agent_turn':
      councilTurnCount++;
      appendTranscriptLine(evt);
      if (evt.text && evt.text.includes('reconsider')) {
        drawConflictTether('retention', 'mentorLoad');
      }
      updateCouncilStatus(`${councilTurnCount} turns exchanged · deliberating`);
      break;
    case 'plan_ready':
      renderPlanSummary(evt);
      break;
    case 'intervention_queued':
      refreshInterventionQueue();
      updateCouncilStatus('Plan ready · awaiting approval');
      break;
    case 'reassignment':
      appendTranscriptLine({ agentId: 'chair', label: 'System', text: `Reassigned member to ${evt.newMentorName}. Twin updated.` });
      break;
    case 'twin_update':
      flashTwinNode(evt.nodeId, evt.state);
      refreshInterventionQueue();
      break;
    case 'run_complete':
      councilConvening = false;
      resetOrbStates();
      updateCouncilStatus(`Convened · ${councilResolvedCount} resolved this session`);
      const btn = $('council-convene-btn');
      if (btn) { btn.disabled = false; btn.innerText = 'Convene Council'; }
      break;
    case 'error':
      updateCouncilStatus(`Error: ${evt.message}`);
      break;
  }
}

function updateCouncilStatus(text) {
  const el = $('council-status-text');
  if (el) el.innerText = text;
}

function clearCouncilTranscript() {
  const el = $('council-transcript');
  if (el) el.innerHTML = '';
}

function appendTranscriptLine(evt) {
  const container = $('council-transcript');
  if (!container) return;
  if (container.querySelector('.color-tertiary')) container.innerHTML = '';

  const agentMeta = COUNCIL_AGENTS.find(a => a.id === evt.agentId) || { label: evt.label || 'System', color: '#86868b' };
  const line = document.createElement('div');
  line.className = 'flex flex-col gap-1';
  line.innerHTML = `
    <span class="text-xs font-semibold" style="color: ${agentMeta.color};">${evt.label || agentMeta.label}</span>
    <p class="color-secondary" style="font-size: 0.78rem; line-height: 1.5;">${evt.text}</p>
  `;
  container.appendChild(line);
  container.scrollTop = container.scrollHeight;
}

function pulseOrb(agentId) {
  document.querySelectorAll('.council-orb').forEach(o => o.classList.remove('council-orb-active'));
  const orb = $(`orb-${agentId}`);
  if (orb) orb.classList.add('council-orb-active');
}

function resetOrbStates() {
  document.querySelectorAll('.council-orb').forEach(o => o.classList.remove('council-orb-active'));
  const svg = $('council-tethers');
  if (svg) svg.innerHTML = '';
}

function drawConflictTether(agentIdA, agentIdB) {
  const svg = $('council-tethers');
  const a = $(`orb-${agentIdA}`);
  const b = $(`orb-${agentIdB}`);
  if (!svg || !a || !b) return;
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', a.dataset.cx);
  line.setAttribute('y1', a.dataset.cy);
  line.setAttribute('x2', b.dataset.cx);
  line.setAttribute('y2', b.dataset.cy);
  line.setAttribute('stroke', 'url(#council-conflict-gradient)');
  line.setAttribute('stroke-width', '2');
  svg.innerHTML = `
    <defs>
      <linearGradient id="council-conflict-gradient">
        <stop offset="0%" stop-color="#d97b6c"></stop>
        <stop offset="100%" stop-color="#e0a655"></stop>
      </linearGradient>
    </defs>
  `;
  svg.appendChild(line);
}

function renderPlanSummary(evt) {
  const { plan, precedent, autoExecuteThreshold } = evt;
  if (!plan.hasPlan) {
    appendTranscriptLine({ agentId: 'chair', label: 'Council Chair', text: 'No action warranted this cycle — all clear.' });
    return;
  }
  const precedentNote = precedent && precedent.length
    ? ` Nearest precedent: "${precedent[0].outcome}" case at ${(precedent[0].similarity * 100).toFixed(0)}% similarity.`
    : '';
  appendTranscriptLine({
    agentId: 'chair',
    label: 'Council Chair — Ruling',
    text: `${plan.reasoning} (confidence ${(plan.confidence * 100).toFixed(0)}%, auto-execute threshold ${(autoExecuteThreshold * 100).toFixed(0)}%).${precedentNote}`
  });
}

function flashTwinNode(nodeId, state) {
  // Best-effort visual tie-back if the Digital Twin tab happens to be mounted;
  // harmless no-op otherwise since digital_twin.js owns its own canvas state.
  const label = state === 'resolved' ? 'resolved' : 'dismissed';
  console.log(`Twin node ${nodeId} marked ${label}.`);
}

function conveneCouncil() {
  const btn = $('council-convene-btn');
  btn.disabled = true;
  btn.innerText = 'Convening…';
  councilResolvedCount = 0;

  fetch(`${COUNCIL_API_BASE}/api/council/convene`, { method: 'POST' })
    .then(res => {
      if (res.status === 409) {
        updateCouncilStatus('A session is already in progress.');
        btn.disabled = false;
        btn.innerText = 'Convene Council';
      }
    })
    .catch(() => {
      updateCouncilStatus('Could not reach backend — is `npm start` running in /server?');
      btn.disabled = false;
      btn.innerText = 'Convene Council';
    });
}

function refreshInterventionQueue() {
  fetch(`${COUNCIL_API_BASE}/api/council/interventions`)
    .then(res => res.json())
    .then(renderActionQueue)
    .catch(() => {});
}

function renderActionQueue(interventions) {
  const container = $('council-action-queue');
  if (!container) return;

  if (!interventions.length) {
    container.innerHTML = '<p class="color-tertiary text-xs">No interventions queued yet.</p>';
    return;
  }

  councilResolvedCount = interventions.filter(iv => iv.status === 'executed').length;

  container.innerHTML = interventions.map(iv => {
    const statusColor = iv.status === 'pending' ? 'var(--accent-champagne)'
      : iv.status === 'executed' ? '#27c93f'
      : iv.status === 'dismissed' ? 'var(--text-tertiary)'
      : 'var(--text-secondary)';
    return `
      <div class="card flex justify-between align-center" id="intervention-${iv.id}">
        <div style="max-width: 70%;">
          <div class="flex align-center gap-2 m-b-2">
            <span class="badge text-xs" style="color: ${statusColor}; border-color: ${statusColor};">${iv.status}</span>
            <span class="text-xs color-secondary">${iv.action.replace('_', ' ')} · confidence ${(iv.confidence * 100).toFixed(0)}%</span>
          </div>
          <p class="text-sm text-primary">${iv.reasoning}</p>
        </div>
        ${iv.status === 'pending' ? `
          <div class="flex gap-2">
            <button class="btn btn-primary text-xs" onclick="approveIntervention('${iv.id}')">Approve</button>
            <button class="btn btn-secondary text-xs" onclick="dismissIntervention('${iv.id}')">Dismiss</button>
          </div>
        ` : `<span class="text-xs color-tertiary">Logged</span>`}
      </div>
    `;
  }).join('');
}

function approveIntervention(id) {
  fetch(`${COUNCIL_API_BASE}/api/council/intervention/${id}/approve`, { method: 'POST' })
    .then(() => refreshInterventionQueue());
}

function dismissIntervention(id) {
  fetch(`${COUNCIL_API_BASE}/api/council/intervention/${id}/dismiss`, { method: 'POST' })
    .then(() => refreshInterventionQueue());
}

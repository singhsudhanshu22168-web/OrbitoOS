// ==========================================
// MODULE 7: HACKATHON TEAM BUILDER
// ==========================================

function renderTeamTab() {
  return `
    <div class="flex flex-col gap-6">
      
      <!-- Top Title and Explanation -->
      <div class="flex justify-between align-end border-bottom p-b-6" style="border-bottom: 1px solid var(--border-primary);">
        <div class="max-w-xl">
          <span class="badge badge-champagne m-b-2">Hackathon Team Agent</span>
          <h2 class="text-3xl font-light">Autonomous Squad Assembly</h2>
          <p class="text-sm color-secondary m-t-2">
            The team agent dynamically compiles balanced development teams. It analyzes technical skills, timezone overlap, weekly availability, and role compatibility.
          </p>
        </div>
        <div class="badge">Next Event: AI Agent Hackathon (Jul 30)</div>
      </div>

      <!-- Action Box -->
      <div class="card glass-panel p-8 text-center flex flex-col align-center justify-center" id="team-builder-actions" style="background: rgba(255, 255, 255, 0.01); min-height: 250px;">
        <h3 class="text-xl font-light m-b-2">Select Active Challenge</h3>
        <p class="text-xs color-secondary m-b-6">Choose an upcoming event to compile your team setup.</p>
        
        <div class="flex gap-4 m-b-6">
          <button class="btn btn-secondary text-sm border-primary" style="background: var(--bg-secondary);" onclick="selectHackathon('ai-agent')">
            <span class="font-medium">AI Agent Hackathon (2026)</span>
          </button>
          <button class="btn btn-secondary text-sm border-primary" style="opacity: 0.5;" disabled>
            <span class="font-medium">Solana Speedrun (Aug 2026)</span>
          </button>
        </div>
        
        <button class="btn btn-primary" onclick="assembleHackathonTeam()" id="assemble-btn">Assemble Balanced Squad</button>
      </div>

      <!-- Results Area (Hidden by default, shown during assembly) -->
      <div id="team-assembly-results" class="hidden flex flex-col gap-8">
        <!-- Main Lineup Header -->
        <div class="flex justify-between align-center">
          <div>
            <h3 class="text-xl font-medium">Recommended Squad Lineup</h3>
            <p class="text-xs color-secondary">Calculated Match Score: <span class="color-champagne font-semibold">94% Skill-Mesh Congruence</span></p>
          </div>
          <button class="btn btn-primary text-xs" onclick="confirmTeamFormation()">Lock Team & Deploy Repo</button>
        </div>

        <!-- Teammates Grid -->
        <div class="grid grid-3 gap-6">
          
          <!-- Member 1: User Profile -->
          <div class="card flex flex-col justify-between" style="border-color: rgba(255,255,255,0.06); background: rgba(255,255,255,0.01);">
            <div>
              <div class="flex align-center gap-3 m-b-4">
                <img src="${appState.user.avatar}" alt="You" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-secondary);">
                <div>
                  <h4 class="text-sm font-semibold">${appState.user.name} (You)</h4>
                  <span class="text-xs color-champagne">${appState.user.role}</span>
                </div>
              </div>
              <p class="text-xs color-secondary m-b-4">Backbone engineer. Handles systems infrastructure and API orchestrations.</p>
              <div class="flex flex-col gap-2">
                <div>
                  <span class="text-xs color-tertiary uppercase block">Skills Provided</span>
                  <div class="flex flex-wrap gap-1 m-t-1">
                    ${appState.user.skills.map(s => `<span class="badge text-xs" style="font-size: 10px;">${s}</span>`).join('')}
                  </div>
                </div>
              </div>
            </div>
            <div class="text-xs color-tertiary border-top p-t-3 m-t-4" style="border-top: 1px solid var(--border-primary);">
              Role: Backend Architect
            </div>
          </div>

          <!-- Member 2: Kai Takahashi -->
          <div class="card flex flex-col justify-between" id="teammate-kai">
            <div>
              <div class="flex justify-between align-start m-b-4">
                <div class="flex align-center gap-3">
                  <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80" alt="Kai" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-primary);">
                  <div>
                    <h4 class="text-sm font-semibold">Kai Takahashi</h4>
                    <span class="text-xs color-champagne">UI Designer & Frontend</span>
                  </div>
                </div>
                <span class="badge badge-champagne text-xs" style="font-size: 10px;">96% Match</span>
              </div>
              <p class="text-xs color-secondary m-b-4">Complements your backend pipeline with premium high-fidelity frontends.</p>
              <div class="flex flex-col gap-3">
                <div>
                  <span class="text-xs color-tertiary uppercase block">Skills Provided</span>
                  <div class="flex flex-wrap gap-1 m-t-1">
                    <span class="badge text-xs" style="font-size: 10px;">React</span>
                    <span class="badge text-xs" style="font-size: 10px;">Figma</span>
                    <span class="badge text-xs" style="font-size: 10px;">Tailwind</span>
                  </div>
                </div>
                <div>
                  <span class="text-xs color-champagne uppercase block">AI Match Rationale</span>
                  <p class="text-xs color-secondary m-t-1" style="line-height: 1.5; font-style: italic;">
                    "Kai bridges your systems logic to modern visual design. Alignment metrics indicate UTC-5 schedules overlap fully. Past collaborator index matches 92%."
                  </p>
                </div>
              </div>
            </div>
            <div class="text-xs color-tertiary border-top p-t-3 m-t-4" style="border-top: 1px solid var(--border-primary); display: flex; justify-content: space-between;">
              <span>Timezone: UTC-5 (EDT)</span>
              <span>Available: 15h</span>
            </div>
          </div>

          <!-- Member 3: Chloe Dupond -->
          <div class="card flex flex-col justify-between" id="teammate-chloe">
            <div>
              <div class="flex justify-between align-start m-b-4">
                <div class="flex align-center gap-3">
                  <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80" alt="Chloe" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-primary);">
                  <div>
                    <h4 class="text-sm font-semibold">Chloe Dupond</h4>
                    <span class="text-xs color-champagne">AI / ML Engineer</span>
                  </div>
                </div>
                <span class="badge badge-champagne text-xs" style="font-size: 10px;">91% Match</span>
              </div>
              <p class="text-xs color-secondary m-b-4">Deploys standard LLM pipelines, vector databases, and PyTorch setups.</p>
              <div class="flex flex-col gap-3">
                <div>
                  <span class="text-xs color-tertiary uppercase block">Skills Provided</span>
                  <div class="flex flex-wrap gap-1 m-t-1">
                    <span class="badge text-xs" style="font-size: 10px;">Python</span>
                    <span class="badge text-xs" style="font-size: 10px;">PyTorch</span>
                    <span class="badge text-xs" style="font-size: 10px;">LangChain</span>
                  </div>
                </div>
                <div>
                  <span class="text-xs color-champagne uppercase block">AI Match Rationale</span>
                  <p class="text-xs color-secondary m-t-1" style="line-height: 1.5; font-style: italic;">
                    "Chloe integrates neural pipeline runtimes into your Rust core API. Timezone diff (+5h) bridged by shared late-night milestones. Comms density: High."
                  </p>
                </div>
              </div>
            </div>
            <div class="text-xs color-tertiary border-top p-t-3 m-t-4" style="border-top: 1px solid var(--border-primary); display: flex; justify-content: space-between;">
              <span>Timezone: UTC+2 (CEST)</span>
              <span>Available: 12h</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  `;
}

function selectHackathon(id) {
  console.log(`Hackathon selected: ${id}`);
}

function assembleHackathonTeam() {
  const actions = $('team-builder-actions');
  const results = $('team-assembly-results');
  const btn = $('assemble-btn');
  
  if (!btn) return;
  
  btn.disabled = true;
  btn.innerText = 'Analyzing community nodes...';
  
  // Create virtual loading console outputs inside the action box
  const loadingConsole = document.createElement('div');
  loadingConsole.className = 'w-full text-left p-4 m-t-4';
  loadingConsole.style.backgroundColor = '#050505';
  loadingConsole.style.border = '1px solid var(--border-primary)';
  loadingConsole.style.borderRadius = 'var(--radius-md)';
  loadingConsole.style.fontFamily = 'monospace';
  loadingConsole.style.fontSize = '11px';
  loadingConsole.style.color = 'var(--text-secondary)';
  loadingConsole.style.maxHeight = '150px';
  loadingConsole.style.overflowY = 'auto';
  
  actions.appendChild(loadingConsole);
  
  const logs = [
    'Initializing skill mesh calculation...',
    'Found 12 available Frontend nodes, 8 AI/ML nodes, 4 Systems nodes.',
    'Filtering for timezone overlap (target: UTC-5 overlap > 4 hours)...',
    'Validating past team performance indexes and collaboration vectors...',
    'Simulating 48 permutation models for cohort balance...',
    'Optimal mesh detected. Selecting Kai Takahashi & Chloe Dupond.'
  ];
  
  let currentLog = 0;
  
  const timer = setInterval(() => {
    if (currentLog < logs.length) {
      const line = document.createElement('p');
      line.innerText = `> ${logs[currentLog]}`;
      line.style.marginBottom = '4px';
      loadingConsole.appendChild(line);
      loadingConsole.scrollTop = loadingConsole.scrollHeight;
      currentLog++;
    } else {
      clearInterval(timer);
      hide(actions);
      show(results);
    }
  }, 500);
}

function confirmTeamFormation() {
  alert('Team Locked! GitHub Repository repository initialized: orbitos-community/ai-agent-squad-7');
  navigateTo('dashboard', 'home');
}

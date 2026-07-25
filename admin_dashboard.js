// ==========================================
// MODULE 11: ORGANIZER (ADMIN) DASHBOARD
// ==========================================

function renderAdminDashboard(tabId) {
  const container = $('screen-admin');
  
  const navItems = [
    { id: 'pulse', label: 'Community Pulse', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>' },
    { id: 'mentors', label: 'Mentor Health', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' },
    { id: 'risks', label: 'Risk Detection', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>' },
    { id: 'council', label: 'Sentinel Council', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><circle cx="12" cy="3" r="1.5"></circle><circle cx="19.8" cy="7.5" r="1.5"></circle><circle cx="19.8" cy="16.5" r="1.5"></circle><circle cx="12" cy="21" r="1.5"></circle><circle cx="4.2" cy="16.5" r="1.5"></circle><circle cx="4.2" cy="7.5" r="1.5"></circle></svg>' }
  ];

  container.innerHTML = `
    <div class="flex" style="min-height: 100vh;">
      
      <!-- Admin Sidebar -->
      <aside class="flex flex-col justify-between p-6" style="width: 260px; background-color: var(--bg-secondary); border-right: 1px solid var(--border-primary); position: fixed; height: 100vh; z-index: 10;">
        <div class="flex flex-col gap-8 w-full">
          <!-- Logo -->
          <div class="logo cursor-pointer" onclick="navigateTo('landing')">
            <div class="logo-icon" style="background-color: var(--text-primary); box-shadow: 0 0 8px var(--text-primary);"></div>
            <span>OrbitOS Admin</span>
          </div>

          <!-- Active Node Indicator -->
          <div class="p-3 card" style="background: rgba(255,255,255,0.01); border-radius: var(--radius-md); padding: var(--space-2) var(--space-3);">
            <div class="flex align-center gap-2">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #27c93f; box-shadow: 0 0 8px #27c93f;"></span>
              <span class="text-xs font-semibold text-primary">System Pulse Optimal</span>
            </div>
          </div>

          <!-- Nav Items List -->
          <nav class="flex flex-col gap-1 w-full">
            ${navItems.map(item => `
              <div class="flex align-center gap-3 p-3 cursor-pointer sidebar-nav-item ${item.id === tabId ? 'active' : ''}" onclick="renderAdminDashboard('${item.id}')">
                ${item.icon}
                <span class="text-sm font-medium">${item.label}</span>
              </div>
            `).join('')}
          </nav>
        </div>

        <!-- Sidebar footer controls -->
        <div class="flex flex-col gap-2 w-full">
          <button class="btn btn-primary text-xs w-full flex align-center justify-between" onclick="navigateTo('dashboard')">
            <span>Member Cockpit</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </button>
          <button class="btn btn-tertiary text-xs text-left w-full" onclick="navigateTo('landing')">Logout</button>
        </div>
      </aside>

      <!-- Admin Main Page Content -->
      <div style="margin-left: 260px; flex: 1; min-height: 100vh; display: flex; flex-direction: column; background-color: var(--bg-pure);">
        
        <!-- Header -->
        <header class="flex align-center justify-between p-6 border-bottom" style="border-bottom: 1px solid var(--border-dim); height: 72px; background: var(--bg-primary);">
          <div>
            <h2 class="text-lg font-medium">${navItems.find(n => n.id === tabId).label}</h2>
          </div>
          
          <div class="flex align-center gap-4">
            <span class="badge text-xs" style="color: var(--accent-champagne); border-color: var(--accent-champagne-muted);">Autonomous Action Queue Active</span>
          </div>
        </header>

        <!-- Main Workspace Grid -->
        <main class="p-8 flex-1 animate-fade" style="background-color: var(--bg-primary);">
          ${renderAdminTabContent(tabId)}
        </main>
      </div>

    </div>
  `;
}

function renderAdminTabContent(tabId) {
  if (tabId === 'pulse') {
    return renderAdminPulse();
  } else if (tabId === 'mentors') {
    return renderAdminMentors();
  } else if (tabId === 'risks') {
    return renderAdminRisks();
  } else if (tabId === 'council') {
    return renderCouncilTab ? renderCouncilTab() : '<p>Council Module loading...</p>';
  }
}

// 1. Community Pulse Tab
function renderAdminPulse() {
  return `
    <!-- Key Metric row -->
    <div class="grid grid-4 gap-6 m-b-8">
      <div class="card p-5">
        <span class="text-xs color-secondary uppercase">Active Members</span>
        <h3 class="text-3xl font-light m-t-1">1,482</h3>
        <p class="text-xs color-champagne m-t-1">↑ 14% this week</p>
      </div>
      <div class="card p-5">
        <span class="text-xs color-secondary uppercase">Mesh Match Rate</span>
        <h3 class="text-3xl font-light m-t-1">91.4%</h3>
        <p class="text-xs color-secondary m-t-1">Average connection match</p>
      </div>
      <div class="card p-5">
        <span class="text-xs color-secondary uppercase">Active Projects</span>
        <h3 class="text-3xl font-light m-t-1">34</h3>
        <p class="text-xs color-secondary m-t-1">Repos with weekly activity</p>
      </div>
      <div class="card p-5">
        <span class="text-xs color-secondary uppercase">Mentor Bandwidth</span>
        <h3 class="text-3xl font-light m-t-1">64%</h3>
        <p class="text-xs color-champagne m-t-1">Capacity remaining optimal</p>
      </div>
    </div>

    <!-- AI Command Action Center -->
    <h3 class="text-xs color-tertiary uppercase tracking-wider m-b-4">AI Recommended Decisions</h3>
    <div class="flex flex-col gap-4">
      
      <!-- Alert 1 -->
      <div class="card flex justify-between align-center" id="alert-card-1">
        <div style="max-width: 70%;">
          <div class="flex align-center gap-2 m-b-2">
            <span class="badge" style="color: #ff5f56; border-color: rgba(255,95,86,0.2); background: rgba(255,95,86,0.02);">High Priority</span>
            <span class="text-xs color-secondary">Mentor Capacity Alert</span>
          </div>
          <h4 class="text-md font-semibold">Rust Hackathon queues are scaling. Elena Rostova reached 90% load.</h4>
          <p class="text-xs color-secondary m-t-1">We suggest recruiting 2 new Rust mentors from the high-score alumni node list. Candidates pre-screened based on active commits.</p>
        </div>
        <button class="btn btn-primary text-xs" onclick="resolveAdminAlert(1, 'Auto-invite candidates...')">Auto-Invite Candidates</button>
      </div>

      <!-- Alert 2 -->
      <div class="card flex justify-between align-center" id="alert-card-2">
        <div style="max-width: 70%;">
          <div class="flex align-center gap-2 m-b-2">
            <span class="badge" style="color: var(--accent-champagne); border-color: var(--accent-champagne-muted); background: var(--accent-champagne-muted);">Medium Priority</span>
            <span class="text-xs color-secondary">Chapter Latency Drop</span>
          </div>
          <h4 class="text-md font-semibold">Solidity Chapter activity dropped by 18% over the last 10 days.</h4>
          <p class="text-xs color-secondary m-t-1">We suggest allocating a minor $250 local hack-night budget. Community Graph indicates local offline workshops generate +40% retention loops.</p>
        </div>
        <button class="btn btn-secondary text-xs" onclick="resolveAdminAlert(2, 'Allocating budget...')">Authorize Budget Draft</button>
      </div>

      <!-- Alert 3 -->
      <div class="card flex justify-between align-center" id="alert-card-3">
        <div style="max-width: 70%;">
          <div class="flex align-center gap-2 m-b-2">
            <span class="badge text-xs" style="border-color: rgba(255,255,255,0.05);">Low Priority</span>
            <span class="text-xs color-secondary">Rebalancing recommendation</span>
          </div>
          <h4 class="text-md font-semibold">Elena R. overload rebalancing. Suggest routing new Rust mentees to Marcus C.</h4>
          <p class="text-xs color-secondary m-t-1">Marcus shares compiler interests and has 2 open slots this cycle. Automated re-routing ready.</p>
        </div>
        <button class="btn btn-secondary text-xs" onclick="resolveAdminAlert(3, 'Re-routing...')">Confirm Re-route</button>
      </div>

    </div>
  `;
}

// 2. Mentor Health Tab
function renderAdminMentors() {
  return `
    <div class="grid grid-3 gap-6 m-b-8">
      <div class="card p-5 text-center">
        <span class="text-xs color-secondary uppercase block">Total Mentors</span>
        <h4 class="text-4xl font-light m-t-2">12</h4>
      </div>
      <div class="card p-5 text-center">
        <span class="text-xs color-secondary uppercase block">Average Load</span>
        <h4 class="text-4xl font-light m-t-2">5.4 <span class="text-xs color-secondary">mentees/mentor</span></h4>
      </div>
      <div class="card p-5 text-center">
        <span class="text-xs color-secondary uppercase block">Satisfaction Index</span>
        <h4 class="text-4xl font-light m-t-2">97.8%</h4>
      </div>
    </div>

    <!-- Mentor bandwidth roster -->
    <h3 class="text-xs color-tertiary uppercase tracking-wider m-b-4">Mentor Bandwidth Roster</h3>
    <div class="flex flex-col gap-4">
      <div class="card p-4">
        <div class="flex justify-between align-center m-b-3">
          <span class="text-sm font-semibold">Elena Rostova (Systems Architect)</span>
          <span class="badge" style="color: #ff5f56; border-color: rgba(255,95,86,0.2);">90% Bandwidth Capacity</span>
        </div>
        <div style="width: 100%; height: 6px; border-radius: var(--radius-full); background: var(--bg-tertiary); overflow: hidden;">
          <div class="progress-bar-fill" style="width: 90%; background: #ff5f56;"></div>
        </div>
      </div>

      <div class="card p-4">
        <div class="flex justify-between align-center m-b-3">
          <span class="text-sm font-semibold">Marcus Chen (Staff Engineer)</span>
          <span class="badge badge-champagne">52% Bandwidth Capacity</span>
        </div>
        <div style="width: 100%; height: 6px; border-radius: var(--radius-full); background: var(--bg-tertiary); overflow: hidden;">
          <div class="progress-bar-fill" style="width: 52%;"></div>
        </div>
      </div>

      <div class="card p-4">
        <div class="flex justify-between align-center m-b-3">
          <span class="text-sm font-semibold">Aria Vance (Co-founder)</span>
          <span class="badge badge-champagne">35% Bandwidth Capacity</span>
        </div>
        <div style="width: 100%; height: 6px; border-radius: var(--radius-full); background: var(--bg-tertiary); overflow: hidden;">
          <div class="progress-bar-fill" style="width: 35%;"></div>
        </div>
      </div>
    </div>
  `;
}

// 3. Risk Detection & Churn Risks
function renderAdminRisks() {
  const mockRiskMembers = [
    { name: 'David Lee', email: 'david.l@gmail.com', lastCommit: '14 days ago', reason: 'Zero roadmap modules completed in 2 weeks', risk: 'High' },
    { name: 'Siddharth Nair', email: 'sidnair@outlook.com', lastCommit: '11 days ago', reason: 'Declined hackathon squad invites twice', risk: 'Medium' }
  ];

  return `
    <div class="flex justify-between align-end border-bottom p-b-6 m-b-8" style="border-bottom: 1px solid var(--border-primary);">
      <div class="max-w-xl">
        <span class="badge badge-champagne m-b-2">Community Health Agent</span>
        <h2 class="text-3xl font-light">Churn Risk Detection</h2>
        <p class="text-sm color-secondary m-t-2">
          The Health Agent flags members with dropouts in community activity or roadmap progression, recommending gentle, automated touchpoints.
        </p>
      </div>
      <div class="badge">2 Members Flagged</div>
    </div>

    <!-- Roster -->
    <div class="flex flex-col gap-4">
      ${mockRiskMembers.map((member, idx) => `
        <div class="card flex justify-between align-center" id="risk-card-${idx}">
          <div>
            <div class="flex align-center gap-3 m-b-2">
              <span class="text-sm font-semibold text-primary">${member.name}</span>
              <span class="text-xs color-secondary">${member.email}</span>
              <span class="badge" style="font-size: 9px; ${member.risk === 'High' ? 'color: #ff5f56; border-color: rgba(255,95,86,0.2);' : 'color: var(--accent-champagne); border-color: var(--accent-champagne-muted);'}">${member.risk} Risk</span>
            </div>
            <p class="text-xs color-secondary">Reason: ${member.reason}</p>
            <p class="text-xs color-tertiary m-t-1">Last activity recorded: ${member.lastCommit}</p>
          </div>
          <button class="btn btn-secondary text-xs" onclick="resolveRiskNudge(${idx})">Send Personalized Nudge</button>
        </div>
      `).join('')}
    </div>
  `;
}

function resolveAdminAlert(alertId, text) {
  const btn = $(`alert-card-${alertId}`).querySelector('button');
  btn.disabled = true;
  btn.innerText = text;
  
  setTimeout(() => {
    $(`alert-card-${alertId}`).style.opacity = '0.4';
    btn.innerText = 'Action Deployed';
  }, 1000);
}

function resolveRiskNudge(riskIdx) {
  const card = $(`risk-card-${riskIdx}`);
  const btn = card.querySelector('button');
  btn.disabled = true;
  btn.innerText = 'Personalizing Touchpoint...';

  setTimeout(() => {
    btn.innerText = 'Nudge Dispatched';
    btn.className = 'btn btn-secondary text-xs';
    btn.style.color = 'var(--accent-champagne)';
    btn.style.borderColor = 'rgba(197, 168, 128, 0.3)';
    
    const infoText = document.createElement('p');
    infoText.className = 'text-xs color-champagne m-t-2 font-display';
    infoText.innerText = '✓ "Orbit Manager" automatically reached out on Discord recommending Rust mentor sessions.';
    card.querySelector('div').appendChild(infoText);
  }, 1200);
}

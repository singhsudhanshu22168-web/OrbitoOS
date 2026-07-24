// ==========================================
// MODULE 5: MEMBER DASHBOARD FRAMEWORK & HOME VIEW
// ==========================================

function renderMemberDashboard(tabId) {
  appState.dashboardTab = tabId;
  const container = $('screen-dashboard');
  
  // Clean profile fallback if page refreshed or direct loaded
  if (!appState.user) {
    appState.user = {
      name: 'Alex Novak',
      email: 'alex.novak@github.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      github: 'alexnovak',
      skills: ['Rust', 'TypeScript', 'Docker'],
      goals: 'Master new technologies',
      timeCommitment: '5-10 hours/week',
      role: 'Fullstack'
    };
  }

  const navItems = [
    { id: 'home', label: 'Overview', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>' },
    { id: 'roadmap', label: 'Learning Roadmap', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>' },
    { id: 'mentor', label: 'Mentor Match', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' },
    { id: 'team', label: 'Team Builder', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>' },
    { id: 'projects', label: 'Project Discovery', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>' },
    { id: 'graph', label: 'Community Graph', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M20 4H4v16h16V4z" stroke-dasharray="2,2"></path><line x1="9" y1="6" x2="15" y2="18"></line></svg>' },
    { id: 'twin', label: 'Digital Twin', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>' },
    { id: 'events', label: 'Priority Events', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>' },
    { id: 'profile', label: 'My Identity', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' }
  ];

  // Render main layout structure
  container.innerHTML = `
    <div class="flex" style="min-height: 100vh;">
      
      <!-- Dashboard Sidebar -->
      <aside class="flex flex-col justify-between p-6" style="width: 260px; background-color: var(--bg-secondary); border-right: 1px solid var(--border-primary); position: fixed; height: 100vh; z-index: 10;">
        <div class="flex flex-col gap-8 w-full">
          <!-- Logo -->
          <div class="logo cursor-pointer" onclick="navigateTo('landing')">
            <div class="logo-icon"></div>
            <span>OrbitOS</span>
          </div>

          <!-- User Info card -->
          <div class="flex align-center gap-3 p-3 card" style="background: rgba(255,255,255,0.01); border-radius: var(--radius-md); padding: var(--space-2) var(--space-3);">
            <img src="${appState.user.avatar}" alt="Avatar" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-secondary);">
            <div class="flex flex-col overflow-hidden" style="max-width: 140px;">
              <span class="text-xs font-semibold text-primary truncate">${appState.user.name}</span>
              <span class="text-xs color-champagne font-display">${appState.user.role}</span>
            </div>
          </div>

          <!-- Nav Items List -->
          <nav class="flex flex-col gap-1 w-full">
            ${navItems.map(item => `
              <div class="flex align-center gap-3 p-3 cursor-pointer sidebar-nav-item ${item.id === tabId ? 'active' : ''}" onclick="renderMemberDashboard('${item.id}')">
                ${item.icon}
                <span class="text-sm font-medium">${item.label}</span>
              </div>
            `).join('')}
          </nav>
        </div>

        <!-- Sidebar footer controls -->
        <div class="flex flex-col gap-2 w-full">
          <button class="btn btn-secondary text-xs w-full flex align-center justify-between" onclick="navigateTo('admin')">
            <span>Organizer Center</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </button>
          <button class="btn btn-tertiary text-xs text-left w-full" onclick="navigateTo('landing')">Logout</button>
        </div>
      </aside>

      <!-- Dashboard Main Page Content -->
      <div style="margin-left: 260px; flex: 1; min-height: 100vh; display: flex; flex-direction: column; background-color: var(--bg-primary);">
        
        <!-- Header -->
        <header class="flex align-center justify-between p-6 border-bottom" style="border-bottom: 1px solid var(--border-dim); height: 72px;">
          <div>
            <h2 class="text-lg font-medium" id="dashboard-title-text">${navItems.find(n => n.id === tabId).label}</h2>
          </div>
          
          <div class="flex align-center gap-4">
            <!-- Notifications Bell -->
            <div style="position: relative;" class="cursor-pointer" onclick="toggleNotificationDrawer()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <!-- Unread dot -->
              <span style="position: absolute; top: 0; right: 0; width: 6px; height: 6px; border-radius: 50%; background-color: var(--accent-champagne);"></span>
            </div>

            <!-- AI Coach Assistant toggle -->
            <button class="btn btn-secondary text-xs flex align-center gap-2" style="border-color: rgba(197, 168, 128, 0.3); background-color: var(--accent-champagne-muted); color: var(--accent-champagne);" onclick="toggleAIChatAssistant()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span>Ask AI Coach</span>
            </button>
          </div>
        </header>

        <!-- Dynamic Main Workspace Grid -->
        <main class="p-8 flex-1 animate-fade" id="dashboard-tab-content">
          ${renderTabContent(tabId)}
        </main>
      </div>

    </div>

    <!-- Dynamic Drawers / Overlays inside app -->
    <div id="ai-chat-assistant-drawer" class="hidden glass-panel flex flex-col justify-between" style="position: fixed; right: 24px; bottom: 80px; width: 360px; height: 500px; z-index: 100; border-color: var(--border-secondary); box-shadow: var(--shadow-lg);">
      <!-- Header -->
      <div class="flex align-center justify-between p-4 border-bottom" style="border-bottom: 1px solid var(--border-primary); background: rgba(0,0,0,0.2);">
        <div class="flex align-center gap-2">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-champagne);"></div>
          <span class="text-sm font-semibold">Orbit AI Learning Coach</span>
        </div>
        <button class="btn btn-tertiary" style="padding: 0;" onclick="toggleAIChatAssistant()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      
      <!-- Message area -->
      <div class="flex-1 p-4 flex flex-col gap-4 overflow-y-auto" id="ai-chat-messages" style="font-size: 0.85rem;">
        <div class="flex flex-col gap-1 align-self-start" style="max-width: 85%;">
          <span class="text-xs color-tertiary">Learning Coach</span>
          <div class="p-3" style="background: var(--bg-tertiary); border-radius: var(--radius-md); border: 1px solid var(--border-primary); color: var(--text-primary);">
            Hi ${appState.user.name.split(' ')[0]}! Based on your GitHub, I've designed a Rust concurrency learning pathway for you. How can I help you progress today?
          </div>
        </div>
      </div>
      
      <!-- Input bar -->
      <div class="p-3 border-top flex gap-2" style="border-top: 1px solid var(--border-primary); background: rgba(0,0,0,0.1);">
        <input type="text" id="ai-chat-input" class="input text-xs" placeholder="Ask about Rust, events, or your roadmap..." onkeydown="handleAIChatKey(event)">
        <button class="btn btn-primary" style="padding: var(--space-2) var(--space-4); font-size: 0.75rem;" onclick="sendAIChatMessage()">Send</button>
      </div>
    </div>

    <!-- Notification Drawer -->
    <div id="notification-drawer" class="hidden glass-panel p-4" style="position: fixed; right: 24px; top: 80px; width: 320px; max-height: 400px; z-index: 100; overflow-y: auto;">
      <h3 class="text-sm font-semibold m-b-3 flex justify-between align-center">
        <span>Recent Notifications</span>
        <span class="badge text-xs" onclick="clearNotifications()" style="cursor: pointer;">Clear All</span>
      </h3>
      <div class="flex flex-col gap-3" id="notifications-list" style="font-size: 0.8rem;">
        <div class="p-2 border-bottom flex flex-col gap-1" style="border-bottom: 1px solid var(--border-primary);">
          <div class="flex justify-between">
            <span class="font-medium text-primary">Mentor Match Found</span>
            <span class="text-xs color-tertiary">2h ago</span>
          </div>
          <p class="color-secondary">Elena Rostova matched with you on Rust & systems engineering.</p>
        </div>
        <div class="p-2 border-bottom flex flex-col gap-1" style="border-bottom: 1px solid var(--border-primary);">
          <div class="flex justify-between">
            <span class="font-medium text-primary">Hackathon Team Recommendation</span>
            <span class="text-xs color-tertiary">4h ago</span>
          </div>
          <p class="color-secondary">AI Team builder suggested joining "Rustaceans Cohort". 87% match.</p>
        </div>
      </div>
    </div>
  `;

  // Custom Sidebar styling rules
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    .sidebar-nav-item {
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }
    .sidebar-nav-item:hover {
      color: var(--text-primary);
      background-color: rgba(255,255,255,0.03);
    }
    .sidebar-nav-item.active {
      color: var(--text-primary);
      background-color: var(--bg-tertiary);
      border: 1px solid var(--border-primary);
      box-shadow: var(--shadow-sm);
    }
    .progress-bar-fill {
      height: 100%;
      border-radius: var(--radius-full);
      background: linear-gradient(90deg, var(--accent-champagne) 0%, var(--accent-silver) 100%);
      transition: width var(--transition-slow);
    }
  `;
  document.head.appendChild(styleEl);
}

function renderTabContent(tabId) {
  switch (tabId) {
    case 'home':
      return renderHomeTab();
    case 'roadmap':
      return renderRoadmapTab ? renderRoadmapTab() : '<p>Roadmap Module loading...</p>';
    case 'mentor':
      return renderMentorTab ? renderMentorTab() : '<p>Mentor Module loading...</p>';
    case 'team':
      return renderTeamTab ? renderTeamTab() : '<p>Team Module loading...</p>';
    case 'projects':
      return renderProjectsTab ? renderProjectsTab() : '<p>Project Module loading...</p>';
    case 'graph':
      return renderGraphTab ? renderGraphTab() : '<p>Graph Module loading...</p>';
    case 'twin':
      return renderTwinTab ? renderTwinTab() : '<p>Twin Module loading...</p>';
    case 'events':
      return renderEventsTab ? renderEventsTab() : '<p>Events Module loading...</p>';
    case 'profile':
      return renderProfileTab ? renderProfileTab() : '<p>Profile Module loading...</p>';
    default:
      return renderHomeTab();
  }
}

// Render Overview/Home Tab
function renderHomeTab() {
  return `
    <!-- Top Welcome Card -->
    <div class="card m-b-8 flex justify-between align-center p-8" style="background: linear-gradient(135deg, rgba(23, 23, 25, 0.95) 0%, rgba(15, 15, 16, 0.95) 100%);">
      <div style="max-width: 60%;" class="flex flex-col gap-2">
        <span class="badge badge-champagne">AI Insight</span>
        <h3 class="text-2xl font-light">Your skills in <span class="color-champagne">Rust</span> and <span class="color-champagne">TypeScript</span> are currently highly sought after.</h3>
        <p class="text-sm color-secondary">The Hackathon Team Builder has identified 3 open squads looking for your role. We also suggest connecting with Elena Rostova for systems mentoring.</p>
      </div>
      <div class="flex flex-col text-right">
        <span class="text-xs color-tertiary uppercase">Community Score</span>
        <h4 class="text-5xl font-light color-champagne">84<span class="text-xs color-secondary">/100</span></h4>
        <span class="text-xs color-secondary m-t-1">Active Core Contributor</span>
      </div>
    </div>

    <!-- Grid of Key Metric / Goal Cards -->
    <div class="grid grid-3 gap-6 m-b-8">
      
      <!-- Card 1: Today's Goal -->
      <div class="card flex flex-col justify-between" style="min-height: 200px;">
        <div>
          <span class="text-xs color-secondary uppercase">Today's Focus</span>
          <h4 class="text-lg font-medium m-t-2">Review Rust Concurrency</h4>
          <p class="text-xs color-secondary m-t-1">Complete module 2 of your Weekly Roadmap to unlock matching projects.</p>
        </div>
        <button class="btn btn-secondary text-xs w-full justify-between" onclick="renderMemberDashboard('roadmap')">
          <span>Go to Roadmap</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      <!-- Card 2: Learning Progress -->
      <div class="card flex flex-col justify-between" style="min-height: 200px;">
        <div>
          <span class="text-xs color-secondary uppercase">Learning Progress</span>
          <div class="flex justify-between align-center m-t-3 m-b-1">
            <span class="text-xs font-semibold">Rust & Systems Engineering</span>
            <span class="text-xs color-secondary">62%</span>
          </div>
          <div style="width: 100%; height: 6px; border-radius: var(--radius-full); background: var(--bg-tertiary); overflow: hidden;">
            <div class="progress-bar-fill" style="width: 62%;"></div>
          </div>
        </div>
        <button class="btn btn-secondary text-xs w-full justify-between" onclick="renderMemberDashboard('roadmap')">
          <span>Resume Roadmap</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      <!-- Card 3: Suggested Mentor -->
      <div class="card flex flex-col justify-between" style="min-height: 200px;">
        <div class="flex align-center gap-3">
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" alt="Elena" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
          <div>
            <span class="text-xs color-secondary uppercase">Recommended Mentor</span>
            <h4 class="text-sm font-semibold">Elena Rostova</h4>
            <span class="text-xs color-champagne">98% Compatibility</span>
          </div>
        </div>
        <button class="btn btn-primary text-xs w-full" onclick="renderMemberDashboard('mentor')">Connect with Elena</button>
      </div>

    </div>

    <!-- Secondary grid: Team, Event, Project recommendations -->
    <div class="grid grid-3 gap-6">
      
      <!-- Suggested Hackathon Team -->
      <div class="card flex flex-col justify-between" style="min-height: 220px;">
        <div>
          <span class="badge badge-champagne m-b-2">Suggested Squad</span>
          <h4 class="text-md font-semibold">Rustaceans Cohort</h4>
          <p class="text-xs color-secondary m-t-2">Needs a Systems Architect. Teammates have Rust & WebAssembly expertise matching your profile.</p>
        </div>
        <button class="btn btn-secondary text-xs w-full" onclick="renderMemberDashboard('team')">Inspect Team Lineup</button>
      </div>

      <!-- Recommended Project -->
      <div class="card flex flex-col justify-between" style="min-height: 220px;">
        <div>
          <span class="badge badge-champagne m-b-2">Matched Open Source</span>
          <h4 class="text-md font-semibold">tokio-rs / mini-redis</h4>
          <p class="text-xs color-secondary m-t-2">Matches your: Rust, Docker experience. 12 community members contributing. 3 open issues matching your level.</p>
        </div>
        <button class="btn btn-secondary text-xs w-full" onclick="renderMemberDashboard('projects')">View Open Issues</button>
      </div>

      <!-- Upcoming Event Priority -->
      <div class="card flex flex-col justify-between" style="min-height: 220px;">
        <div>
          <span class="badge badge-champagne m-b-2">Priority Event</span>
          <h4 class="text-md font-semibold">Advanced Actix Web Workshop</h4>
          <p class="text-xs color-secondary m-t-2">Jul 28, 2026. Highly relevant to your goal of mastering systems development.</p>
        </div>
        <button class="btn btn-secondary text-xs w-full" onclick="renderMemberDashboard('events')" style="border-color: rgba(255,255,255,0.06);">Register for Event</button>
      </div>

    </div>
  `;
}

// Drawer Toggles
function toggleAIChatAssistant() {
  const drawer = $('ai-chat-assistant-drawer');
  if (drawer.classList.contains('hidden')) {
    show(drawer);
    $('ai-chat-input').focus();
  } else {
    hide(drawer);
  }
}

function toggleNotificationDrawer() {
  const drawer = $('notification-drawer');
  if (drawer.classList.contains('hidden')) {
    show(drawer);
  } else {
    hide(drawer);
  }
}

function clearNotifications() {
  $('notifications-list').innerHTML = '<p class="color-secondary text-center p-4">No new notifications.</p>';
  const bellDot = $('global-nav') ? $('global-nav').querySelector('span') : null;
  const sideBellDot = $('screen-dashboard') ? $('screen-dashboard').querySelector('span[style*="background-color: var(--accent-champagne)"]') : null;
  if (sideBellDot) sideBellDot.remove();
}

// Chat functions
function handleAIChatKey(event) {
  if (event.key === 'Enter') {
    sendAIChatMessage();
  }
}

function sendAIChatMessage() {
  const input = $('ai-chat-input');
  const text = input.value.trim();
  if (!text) return;

  const messagesContainer = $('ai-chat-messages');
  
  // User message
  const userMsg = document.createElement('div');
  userMsg.className = 'flex flex-col gap-1 align-self-end';
  userMsg.style.maxWidth = '85%';
  userMsg.style.alignSelf = 'flex-end';
  userMsg.innerHTML = `
    <span class="text-xs color-tertiary text-right">You</span>
    <div class="p-3" style="background: rgba(197, 168, 128, 0.15); border-radius: var(--radius-md); border: 1px solid rgba(197, 168, 128, 0.2); color: var(--text-primary);">
      ${text}
    </div>
  `;
  messagesContainer.appendChild(userMsg);
  input.value = '';
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // AI response simulation
  setTimeout(() => {
    const aiMsg = document.createElement('div');
    aiMsg.className = 'flex flex-col gap-1 align-self-start';
    aiMsg.style.maxWidth = '85%';
    aiMsg.innerHTML = `
      <span class="text-xs color-tertiary">Learning Coach</span>
      <div class="p-3" style="background: var(--bg-tertiary); border-radius: var(--radius-md); border: 1px solid var(--border-primary); color: var(--text-primary);">
        Analyzing request... I recommend checking out <span class="color-champagne cursor-pointer" onclick="renderMemberDashboard('projects')">tokio-rs / mini-redis</span>, which features great Rust concurrency issues to tackle.
      </div>
    `;
    messagesContainer.appendChild(aiMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 1000);
}

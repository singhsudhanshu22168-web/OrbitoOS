// ==========================================
// MODULE 12+: ROADMAP, EVENTS, AND PROFILE VIEWS
// ==========================================

// 1. Learning Roadmap View
function renderRoadmapTab() {
  const milestones = [
    {
      week: 'Week 1',
      title: 'Rust Concurrency Foundations',
      description: 'Understand thread safety, memory models, Arc, Mutex, and RwLock primitives.',
      status: 'completed',
      tasks: [
        { title: 'Read Rust Book Chapter 16 (Fearless Concurrency)', done: true },
        { title: 'Implement thread-safe shared state counter using Arc<Mutex>', done: true }
      ]
    },
    {
      week: 'Week 2',
      title: 'Async Runtimes & Tokio Channels',
      description: 'Master async/await state machines, Tokio task spawning, and message passing via mpsc/oneshot channels.',
      status: 'active',
      progress: 62,
      tasks: [
        { title: 'Study Tokio select! macro for execution branching', done: true },
        { title: 'Build a multi-client async TCP echo server', done: true },
        { title: 'Implement grace-period shutdown routing', done: false }
      ]
    },
    {
      week: 'Week 3',
      title: 'Thread Pools & CPU-Bound Schedulers',
      description: 'Avoid blocking the async event loop. Learn how to delegate heavy CPU computations using spawn_blocking.',
      status: 'locked',
      tasks: [
        { title: 'Profile task latency under heavy thread contention', done: false },
        { title: 'Build custom Raycast-like worker pool scheduler', done: false }
      ]
    },
    {
      week: 'Week 4',
      title: 'High-Performance Cache Design',
      description: 'Synthesize everything. Build a multi-threaded, lock-free or shard-locked key-value cache resembling Redis.',
      status: 'locked',
      tasks: [
        { title: 'Benchmark throughput comparing dashmap and Mutex<HashMap>', done: false }
      ]
    }
  ];

  return `
    <div class="flex flex-col gap-6">
      
      <!-- Title -->
      <div class="flex justify-between align-end border-bottom p-b-6" style="border-bottom: 1px solid var(--border-primary);">
        <div class="max-w-xl">
          <span class="badge badge-champagne m-b-2">Learning Coach Agent</span>
          <h2 class="text-3xl font-light">Personalized Learning Roadmap</h2>
          <p class="text-sm color-secondary m-t-2">
            Your weekly study pathway updates dynamically based on your GitHub commits, matching sandbox issues, and mentor feedback.
          </p>
        </div>
        <div class="badge">Active Milestone: Week 2</div>
      </div>

      <!-- Roadmap Timeline vertical stack -->
      <div class="flex flex-col gap-8 relative" style="padding-left: 24px;">
        <!-- Vertical Line background -->
        <div style="position: absolute; left: 6px; top: 12px; bottom: 12px; width: 1px; background: var(--border-primary);"></div>

        ${milestones.map(ms => {
          let dotStyle = 'background: var(--bg-primary); border: 2px solid var(--border-secondary);';
          let borderHighlight = 'border-color: var(--border-primary);';
          
          if (ms.status === 'completed') {
            dotStyle = 'background: var(--accent-champagne); border: 2px solid var(--accent-champagne); box-shadow: 0 0 8px var(--accent-champagne);';
            borderHighlight = 'border-color: rgba(197, 168, 128, 0.2); background: rgba(255, 255, 255, 0.005);';
          } else if (ms.status === 'active') {
            dotStyle = 'background: var(--text-primary); border: 2px solid var(--accent-champagne); box-shadow: 0 0 12px var(--accent-champagne);';
            borderHighlight = 'border-color: var(--accent-champagne);';
          }

          return `
            <div class="relative flex flex-col gap-4">
              <!-- Timeline Dot -->
              <div style="position: absolute; left: -24px; top: 6px; width: 11px; height: 11px; border-radius: 50%; ${dotStyle} z-index: 5;"></div>
              
              <!-- Milestone Card -->
              <div class="card" style="${borderHighlight} padding: var(--space-5);">
                <div class="flex justify-between align-start m-b-3">
                  <div>
                    <span class="text-xs color-champagne font-display uppercase tracking-wider font-semibold">${ms.week} — ${ms.status.toUpperCase()}</span>
                    <h3 class="text-lg font-semibold m-t-1">${ms.title}</h3>
                  </div>
                  ${ms.status === 'active' ? `<span class="badge badge-champagne">${ms.progress}% Done</span>` : ''}
                </div>
                <p class="text-xs color-secondary m-b-4" style="max-width: 650px;">${ms.description}</p>
                
                <!-- Tasks List -->
                <div class="flex flex-col gap-2 border-top p-t-3" style="border-top: 1px solid var(--border-dim); font-size: 0.8rem;">
                  ${ms.tasks.map(task => `
                    <div class="flex align-center gap-2">
                      <input type="checkbox" ${task.done ? 'checked' : ''} disabled style="accent-color: var(--accent-champagne); cursor: default;">
                      <span style="${task.done ? 'text-decoration: line-through; color: var(--text-tertiary);' : 'color: var(--text-secondary);'}">${task.title}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}

// 2. Prioritized Events View
function renderEventsTab() {
  const mockEvents = [
    {
      title: 'Advanced Actix Web Workshop',
      relevance: 98,
      date: 'Tuesday, Jul 28, 2026',
      time: '18:00 UTC',
      location: 'Virtual Workshop Node-4',
      desc: 'Deep dive into actix-web middlewares, state sharing architecture, and profiling memory leaks under load. Highly recommended for your Rust Systems learning pathway.',
      type: 'Workshop'
    },
    {
      title: 'Systems-Design Cohort Kickoff',
      relevance: 91,
      date: 'Sunday, Aug 2, 2026',
      time: '17:00 UTC',
      location: 'Zoom Sandbox Stage',
      desc: 'Meet fellow systems builders, c-chapter members, and pitch your hackathon ideas. The Hackathon Team Agent will run early compatibility simulations during the call.',
      type: 'Community Meet'
    },
    {
      title: 'Vercel Edge-Runtime AMA',
      relevance: 76,
      date: 'Wednesday, Aug 5, 2026',
      time: '16:00 UTC',
      location: 'Discord Voice Node',
      desc: 'Chat with engineering leads at Vercel about WASM compilation sizes, edge routing, and cloud runtime parameters.',
      type: 'AMA Sessions'
    }
  ];

  return `
    <div class="flex flex-col gap-6">
      
      <!-- Title -->
      <div class="flex justify-between align-end border-bottom p-b-6" style="border-bottom: 1px solid var(--border-primary);">
        <div class="max-w-xl">
          <span class="badge badge-champagne m-b-2">Event Intelligence Agent</span>
          <h2 class="text-3xl font-light">Priority Event Recommendations</h2>
          <p class="text-sm color-secondary m-t-2">
            OrbitOS organizes community events by matching metrics rather than calendar chronological order. Items are sorted by skill-mesh relevance.
          </p>
        </div>
        <div class="badge">3 Priority Recommendations</div>
      </div>

      <!-- Events list -->
      <div class="flex flex-col gap-4">
        ${mockEvents.map(evt => `
          <div class="card flex justify-between align-center" style="padding: var(--space-5);">
            <div style="max-width: 75%;">
              <div class="flex align-center gap-2 m-b-2">
                <span class="badge badge-champagne" style="font-size: 10px;">${evt.relevance}% Match</span>
                <span class="text-xs color-tertiary">${evt.type}</span>
              </div>
              <h3 class="text-lg font-semibold">${evt.title}</h3>
              <p class="text-xs color-secondary m-t-1 m-b-3" style="line-height: 1.5;">${evt.desc}</p>
              
              <div class="flex gap-4 text-xs color-tertiary">
                <span class="flex align-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  ${evt.date} (${evt.time})
                </span>
                <span class="flex align-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  ${evt.location}
                </span>
              </div>
            </div>
            
            <button class="btn btn-primary text-xs" onclick="registerForEventBtn(this)">Register Now</button>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}

function registerForEventBtn(btn) {
  btn.disabled = true;
  btn.innerText = 'Registering...';
  setTimeout(() => {
    btn.className = 'btn btn-secondary text-xs';
    btn.style.color = 'var(--accent-champagne)';
    btn.style.borderColor = 'rgba(197, 168, 128, 0.3)';
    btn.innerText = 'Seat Secured';
  }, 1000);
}

// 3. User Profile / Dev Identity View
function renderProfileTab() {
  // Generate a mock git contribution calendar styled premium charcoal/black!
  const weeks = 24;
  const days = 7;
  let calendarHtml = '';
  
  for (let w = 0; w < weeks; w++) {
    calendarHtml += `<div class="flex flex-col gap-1">`;
    for (let d = 0; d < days; d++) {
      // Create random activity densities
      const density = Math.random();
      let color = 'rgba(255,255,255,0.02)'; // Zero
      if (density > 0.85) color = 'var(--accent-champagne)'; // High
      else if (density > 0.6) color = 'var(--text-secondary)'; // Medium
      else if (density > 0.3) color = 'var(--text-dim)'; // Low
      
      calendarHtml += `
        <div style="width: 10px; height: 10px; border-radius: 2px; background-color: ${color}; border: 1px solid rgba(255,255,255,0.01);" title="Contributions: ${Math.floor(density * 10)}"></div>
      `;
    }
    calendarHtml += `</div>`;
  }

  return `
    <div class="flex flex-col gap-6">
      
      <!-- Title -->
      <div class="flex justify-between align-end border-bottom p-b-6" style="border-bottom: 1px solid var(--border-primary);">
        <div class="max-w-xl">
          <span class="badge badge-champagne m-b-2">Developer Identity</span>
          <h2 class="text-3xl font-light">Alex Novak</h2>
          <p class="text-sm color-secondary m-t-2">
            Systems & Fullstack Engineer. Developer metrics compiled dynamically from github.com/${appState.user.github || 'alexnovak'}.
          </p>
        </div>
        <div class="badge">Rank: Core Builder</div>
      </div>

      <!-- Main Profile Grid -->
      <div class="grid grid-3 gap-6">
        
        <!-- Left 2 Cols: Activity and Repos -->
        <div class="flex flex-col gap-6" style="grid-column: span 2;">
          
          <!-- Contribution Grid -->
          <div class="card p-6">
            <h3 class="text-xs color-tertiary uppercase tracking-wider m-b-4">Developer Activity Index (Last 6 Months)</h3>
            <div class="flex gap-1 overflow-x-auto p-b-2" style="background: rgba(0,0,0,0.1); border-radius: var(--radius-md); padding: var(--space-3);">
              ${calendarHtml}
            </div>
            <div class="flex justify-between text-xs color-tertiary m-t-3">
              <span>Commits Sync Time: 4 mins ago</span>
              <div class="flex align-center gap-1">
                <span>Less</span>
                <span style="width: 8px; height: 8px; background: rgba(255,255,255,0.02); border-radius: 1px;"></span>
                <span style="width: 8px; height: 8px; background: var(--text-dim); border-radius: 1px;"></span>
                <span style="width: 8px; height: 8px; background: var(--text-secondary); border-radius: 1px;"></span>
                <span style="width: 8px; height: 8px; background: var(--accent-champagne); border-radius: 1px;"></span>
                <span>More</span>
              </div>
            </div>
          </div>

          <!-- Synced Repos -->
          <div class="card p-6">
            <h3 class="text-xs color-tertiary uppercase tracking-wider m-b-4">Synced GitHub Repositories</h3>
            <div class="flex flex-col gap-3">
              <div class="flex justify-between align-center p-3" style="background: rgba(255,255,255,0.01); border: 1px solid var(--border-primary); border-radius: var(--radius-md);">
                <div>
                  <h4 class="text-xs font-mono font-semibold text-primary">alexnovak / async-http-router</h4>
                  <p class="text-xs color-secondary m-t-1">A lightweight HTTP router designed using clean raw sockets. Written in Rust.</p>
                </div>
                <span class="badge text-xs">Rust</span>
              </div>
              <div class="flex justify-between align-center p-3" style="background: rgba(255,255,255,0.01); border: 1px solid var(--border-primary); border-radius: var(--radius-md);">
                <div>
                  <h4 class="text-xs font-mono font-semibold text-primary">alexnovak / next-auth-custom</h4>
                  <p class="text-xs color-secondary m-t-1">Custom adapter handlers for offline JWT validation pools.</p>
                </div>
                <span class="badge text-xs">TypeScript</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Col: Profile Stats & badges -->
        <div class="flex flex-col gap-6">
          
          <div class="card p-6 flex flex-col gap-4">
            <h3 class="text-xs color-tertiary uppercase tracking-wider">Identity Details</h3>
            
            <div class="flex flex-col gap-3" style="font-size: 0.8rem;">
              <div class="flex justify-between border-bottom p-b-2" style="border-bottom: 1px solid var(--border-primary);">
                <span class="color-secondary">Weekly Commits</span>
                <span class="font-semibold text-primary">42</span>
              </div>
              <div class="flex justify-between border-bottom p-b-2" style="border-bottom: 1px solid var(--border-primary);">
                <span class="color-secondary">Target Time</span>
                <span class="font-semibold text-primary">${appState.user.timeCommitment}</span>
              </div>
              <div class="flex justify-between border-bottom p-b-2" style="border-bottom: 1px solid var(--border-primary);">
                <span class="color-secondary">Primary Role</span>
                <span class="font-semibold text-primary">${appState.user.role}</span>
              </div>
              <div class="flex justify-between border-bottom p-b-2" style="border-bottom: 1px solid var(--border-primary);">
                <span class="color-secondary">Objective</span>
                <span class="font-semibold text-primary" style="max-width: 140px; text-align: right;">${appState.user.goals}</span>
              </div>
            </div>
          </div>

          <div class="card p-6 flex flex-col gap-3">
            <h3 class="text-xs color-tertiary uppercase tracking-wider">Active Cohorts</h3>
            <div class="flex flex-col gap-2">
              <span class="badge badge-champagne text-xs w-full text-center">AI Agent Hackathon Squad 7</span>
              <span class="badge text-xs w-full text-center" style="border-color: rgba(255,255,255,0.04);">Global Systems Cohort</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  `;
}

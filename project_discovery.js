// ==========================================
// MODULE 8: PROJECT DISCOVERY VIEW
// ==========================================

const mockProjects = [
  {
    id: 'tokio-redis',
    name: 'tokio-rs / mini-redis',
    type: 'Open Source',
    match: 94,
    description: 'An incomplete idiomatic implementation of a Redis client and server built with Tokio. Perfect for learning Rust concurrency and networking concepts.',
    skillsMatched: ['Rust', 'Docker'],
    skillsMissing: ['Tokio Async'],
    issues: [
      { id: 101, title: 'Implement support for EXPIRE and TTL commands', difficulty: 'Medium', status: 'Open' },
      { id: 102, title: 'Refactor TCP connection stream framing loop', difficulty: 'Hard', status: 'Open' }
    ],
    contributors: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'orbit-router',
    name: 'orbitos-community / agent-router',
    type: 'Internal Squad',
    match: 89,
    description: 'The core message router coordinating communications between autonomous agents (Manager, Matcher, and Health agent). Written in TypeScript.',
    skillsMatched: ['TypeScript', 'Docker'],
    skillsMissing: ['WebSockets'],
    issues: [
      { id: 201, title: 'Add reconnection retry exponential backoff', difficulty: 'Easy', status: 'Open' }
    ],
    contributors: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'nextjs-docs',
    name: 'vercel / next.js',
    type: 'Open Source',
    match: 78,
    description: 'The React Framework for the Web. Help improve Server Components routing documentation and examples.',
    skillsMatched: ['TypeScript'],
    skillsMissing: ['React Server Components'],
    issues: [
      { id: 301, title: 'Document dynamic routing parameters with App Router', difficulty: 'Easy', status: 'Open' }
    ],
    contributors: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&auto=format&fit=crop&q=80'
    ]
  }
];

function renderProjectsTab() {
  return `
    <div class="flex flex-col gap-6">
      
      <!-- Top Title and Explanation -->
      <div class="flex justify-between align-end border-bottom p-b-6" style="border-bottom: 1px solid var(--border-primary);">
        <div class="max-w-xl">
          <span class="badge badge-champagne m-b-2">Project Discovery Agent</span>
          <h2 class="text-3xl font-light">Custom Contributions</h2>
          <p class="text-sm color-secondary m-t-2">
            The discovery agent filters open repos and community pipelines to extract issues matched exactly to your skill metrics. Click an issue to claim it and initialize a local sandbox.
          </p>
        </div>
        <div class="badge">3 Repositories Matching</div>
      </div>

      <!-- Project Cards List -->
      <div class="flex flex-col gap-6">
        ${mockProjects.map(project => `
          <div class="card flex flex-col justify-between" id="project-card-${project.id}" style="min-height: 280px; padding: var(--space-6);">
            
            <div>
              <!-- Header -->
              <div class="flex justify-between align-start m-b-4">
                <div>
                  <div class="flex align-center gap-3">
                    <h3 class="text-xl font-medium">${project.name}</h3>
                    <span class="badge text-xs" style="border-color: rgba(255,255,255,0.05);">${project.type}</span>
                  </div>
                  <p class="text-xs color-secondary m-t-1" style="max-width: 600px;">${project.description}</p>
                </div>
                <div class="badge badge-champagne">${project.match}% Fit</div>
              </div>

              <!-- Skill Grid -->
              <div class="flex gap-6 m-b-6">
                <div>
                  <span class="text-xs color-tertiary uppercase block m-b-1">Matched Skills</span>
                  <div class="flex gap-1">
                    ${project.skillsMatched.map(s => `<span class="badge badge-champagne text-xs" style="font-size: 10px;">${s}</span>`).join('')}
                  </div>
                </div>
                ${project.skillsMissing.length ? `
                  <div>
                    <span class="text-xs color-tertiary uppercase block m-b-1">Recommended to Learn</span>
                    <div class="flex gap-1">
                      ${project.skillsMissing.map(s => `<span class="badge text-xs" style="font-size: 10px; border-color: rgba(255,255,255,0.03); color: var(--text-secondary);">${s}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}
                <div>
                  <span class="text-xs color-tertiary uppercase block m-b-1">Community Contributors</span>
                  <div class="flex align-center gap-1">
                    ${project.contributors.map(c => `
                      <img src="${c}" alt="Contributor" style="width: 20px; height: 20px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-primary); margin-right: -6px;">
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>

            <!-- Issues Section -->
            <div class="border-top p-t-4" style="border-top: 1px solid var(--border-primary);">
              <span class="text-xs color-secondary uppercase block m-b-3">Open Issues Matched to Your Level</span>
              <div class="flex flex-col gap-3">
                ${project.issues.map(issue => `
                  <div class="flex justify-between align-center p-3" style="background: rgba(255,255,255,0.01); border: 1px solid var(--border-primary); border-radius: var(--radius-md);">
                    <div class="flex align-center gap-3">
                      <span class="badge" style="font-size: 9px; ${issue.difficulty === 'Easy' ? 'color: #27c93f; border-color: rgba(39,201,63,0.2);' : issue.difficulty === 'Medium' ? 'color: var(--accent-champagne); border-color: var(--accent-champagne-muted);' : 'color: #ff5f56; border-color: rgba(255,95,86,0.2);'}">${issue.difficulty}</span>
                      <span class="text-xs font-medium text-primary">${issue.title}</span>
                    </div>
                    <button class="btn btn-secondary text-xs" style="padding: var(--space-1) var(--space-3);" onclick="claimProjectIssue('${project.id}', ${issue.id})" id="issue-btn-${project.id}-${issue.id}">Claim Issue</button>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>
        `).join('')}
      </div>

    </div>
  `;
}

function claimProjectIssue(projectId, issueId) {
  const btn = $(`issue-btn-${projectId}-${issueId}`);
  if (!btn) return;

  btn.disabled = true;
  btn.innerText = 'Initializing Sandbox...';

  setTimeout(() => {
    btn.innerText = 'Sandbox Ready (CLI active)';
    btn.className = 'btn btn-secondary text-xs';
    btn.style.color = 'var(--accent-champagne)';
    btn.style.borderColor = 'rgba(197, 168, 128, 0.3)';

    // Add success toast alert message
    const notificationContainer = $('notifications-list');
    if (notificationContainer) {
      const newNotification = document.createElement('div');
      newNotification.className = 'p-2 border-bottom flex flex-col gap-1';
      newNotification.style.borderBottom = '1px solid var(--border-primary)';
      newNotification.innerHTML = `
        <div class="flex justify-between">
          <span class="font-medium text-primary">Sandbox Created</span>
          <span class="text-xs color-tertiary">Just now</span>
        </div>
        <p class="color-secondary">Development sandbox initialized for issue #${issueId}. Run "agy clone ${projectId}" to start.</p>
      `;
      notificationContainer.insertBefore(newNotification, notificationContainer.firstChild);
    }
  }, 1500);
}

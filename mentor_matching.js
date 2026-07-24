// ==========================================
// MODULE 6: MENTOR MATCHING VIEW
// ==========================================

const mockMentors = [
  {
    id: 'elena',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    title: 'Systems Architect',
    company: 'Vercel',
    compatibility: 98,
    skills: ['Rust', 'Go', 'WebAssembly'],
    interests: ['Compilers', 'Edge Computing', 'Distributed Databases'],
    availability: '2 hours/week (Mon, Wed evenings)',
    bio: 'Ex-Cloudflare compiler engineer. Currently focused on Next.js Edge Runtime optimizations. Passionate about helping developers understand raw systems performance.'
  },
  {
    id: 'marcus',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    title: 'Staff Engineer',
    company: 'Linear',
    compatibility: 92,
    skills: ['TypeScript', 'React', 'GraphQL'],
    interests: ['High-Performance UI', 'Offline Sync Systems', 'Design Systems'],
    availability: '3 hours/week (Tue, Thu mornings)',
    bio: 'Designing responsive and beautiful workflow interfaces. Built sync layers for offline-first web apps. Happy to guide on advanced React design patterns and Webpack optimizations.'
  },
  {
    id: 'aria',
    name: 'Aria Vance',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    title: 'Co-founder',
    company: 'DevFlow (YC S24)',
    compatibility: 89,
    skills: ['Rust', 'Docker', 'Python'],
    interests: ['Developer Tools', 'Bootstrapping', 'CI/CD Pipelines'],
    availability: '1 hour/week (Friday afternoon)',
    bio: 'Building developer infrastructure. Ex-GitHub actions team member. I can assist with CI/CD design, packaging tools, or YC founder preparation.'
  },
  {
    id: 'tariq',
    name: 'Tariq Jordan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    title: 'Senior Developer Advocate',
    company: 'Prisma',
    compatibility: 85,
    skills: ['TypeScript', 'Node.js', 'PostgreSQL'],
    interests: ['Developer Experience', 'Database Architecture', 'Serverless APIs'],
    availability: '4 hours/week (Flexible schedule)',
    bio: 'Helping builders interact with databases effortlessly. I teach serverless setups, Prisma workflows, and general backend performance testing.'
  }
];

function renderMentorTab() {
  return `
    <div class="flex flex-col gap-6">
      
      <!-- Top Title and Explanation -->
      <div class="flex justify-between align-end border-bottom p-b-6" style="border-bottom: 1px solid var(--border-primary);">
        <div class="max-w-xl">
          <span class="badge badge-champagne m-b-2">Mentor Match Agent</span>
          <h2 class="text-3xl font-light">Compatible Guidance</h2>
          <p class="text-sm color-secondary m-t-2">
            Matches are calculated based on your synced GitHub skills (Rust, TypeScript), availability, learning goals, and career objectives. One-click connects you to initialize a dedicated discussion room.
          </p>
        </div>
        <div class="badge">4 Matches Found</div>
      </div>

      <!-- Mentors Grid -->
      <div class="grid grid-2 gap-6">
        ${mockMentors.map(mentor => `
          <div class="card flex flex-col justify-between" id="mentor-card-${mentor.id}" style="min-height: 380px;">
            <div>
              <!-- Header info: Avatar, Name, Company -->
              <div class="flex justify-between align-start m-b-6">
                <div class="flex align-center gap-4">
                  <img src="${mentor.avatar}" alt="${mentor.name}" style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-primary);">
                  <div>
                    <h3 class="text-lg font-semibold">${mentor.name}</h3>
                    <p class="text-xs color-secondary">${mentor.title} at <span class="color-champagne font-medium">${mentor.company}</span></p>
                  </div>
                </div>
                <div class="badge badge-champagne font-display">${mentor.compatibility}% Match</div>
              </div>

              <!-- Bio -->
              <p class="text-xs color-secondary m-b-6" style="line-height: 1.6;">${mentor.bio}</p>

              <!-- Skill Tags & Shared interests -->
              <div class="flex flex-col gap-3 m-b-6">
                <div>
                  <span class="text-xs color-tertiary uppercase block m-b-2">Skill Overlap</span>
                  <div class="flex flex-wrap gap-1">
                    ${mentor.skills.map(s => `
                      <span class="badge text-xs" style="${appState.user.skills.includes(s) ? 'background-color: var(--accent-champagne-muted); border-color: rgba(197, 168, 128, 0.3); color: var(--accent-champagne);' : ''}">${s}</span>
                    `).join('')}
                  </div>
                </div>
                <div>
                  <span class="text-xs color-tertiary uppercase block m-b-2">Shared Interests</span>
                  <div class="flex flex-wrap gap-1">
                    ${mentor.interests.map(i => `
                      <span class="badge text-xs" style="font-size: 10px; border-color: rgba(255,255,255,0.03);">${i}</span>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>

            <!-- Availability & Action CTA -->
            <div class="border-top p-t-4 flex justify-between align-center" style="border-top: 1px solid var(--border-primary);">
              <div class="flex flex-col">
                <span class="text-xs color-tertiary uppercase">Availability</span>
                <span class="text-xs font-medium text-primary">${mentor.availability}</span>
              </div>
              <button class="btn btn-primary text-xs" onclick="requestMentorshipConnection('${mentor.id}')" id="mentor-btn-${mentor.id}">Connect with ${mentor.name.split(' ')[0]}</button>
            </div>

          </div>
        `).join('')}
      </div>

    </div>
  `;
}

function requestMentorshipConnection(mentorId) {
  const btn = $(`mentor-btn-${mentorId}`);
  const card = $(`mentor-card-${mentorId}`);
  
  if (!btn) return;
  
  btn.disabled = true;
  btn.innerText = 'Connecting...';
  card.style.borderColor = 'var(--accent-champagne)';
  
  setTimeout(() => {
    btn.innerText = 'Connection Active';
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
          <span class="font-medium text-primary">Mentorship Initiated</span>
          <span class="text-xs color-tertiary">Just now</span>
        </div>
        <p class="color-secondary">Menteeship channel created with ${mockMentors.find(m => m.id === mentorId).name}. Check your AI Coach space.</p>
      `;
      notificationContainer.insertBefore(newNotification, notificationContainer.firstChild);
    }
  }, 1200);
}

// OrbitOS Application State and Routing Engine

const appState = {
  currentScreen: 'landing',
  user: null, // Filled during onboarding
  dashboardTab: 'home',
  onboardingStep: 0,
  onboardingData: {
    github: '',
    experience: 'Intermediate',
    skills: [],
    goals: '',
    timeCommitment: '5-10 hrs/week',
    hackathonRole: 'Fullstack'
  }
};

// DOM Helper functions
function $(id) {
  return document.getElementById(id);
}

function show(el) {
  if (el) el.classList.remove('hidden');
}

function hide(el) {
  if (el) el.classList.add('hidden');
}

// Router
function navigateTo(screenId, tabId = null) {
  console.log(`Navigating to ${screenId}`);
  
  // Hide all screens
  hide($('screen-landing'));
  hide($('screen-auth'));
  hide($('screen-onboarding'));
  hide($('screen-dashboard'));

  // Toggle global navbar visibility based on screen
  const nav = $('global-nav');
  if (screenId === 'dashboard' || screenId === 'onboarding') {
    hide(nav);
  } else {
    show(nav);
  }

  // Show target screen
  const target = $(`screen-${screenId}`);
  show(target);
  appState.currentScreen = screenId;

  // Scroll to top
  window.scrollTo(0, 0);

  // Initialize specific screens
  if (screenId === 'auth') {
    renderAuthScreen();
  } else if (screenId === 'onboarding') {
    startOnboarding();
  } else if (screenId === 'dashboard') {
    renderMemberDashboard(tabId || appState.dashboardTab);
  }
}

function scrollToElement(id) {
  const el = $(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

// ==========================================
// MODULE 3: AUTHENTICATION
// ==========================================
function renderAuthScreen() {
  const authContainer = $('screen-auth');
  authContainer.innerHTML = `
    <div class="container flex align-center justify-center" style="min-height: calc(100vh - 120px); padding-top: var(--space-8);">
      <div class="card glass-panel grid grid-2" style="max-width: 900px; width: 100%; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.06);">
        
        <!-- Left Side: Editorial Branding -->
        <div class="flex flex-col justify-between p-8" style="background: rgba(255, 255, 255, 0.01); border-right: 1px solid var(--border-primary);">
          <div>
            <div class="logo cursor-pointer m-b-8" onclick="navigateTo('landing')">
              <div class="logo-icon"></div>
              <span>OrbitOS</span>
            </div>
            <h2 class="text-3xl font-light m-b-4" style="line-height: 1.2;">The Community is the Console.</h2>
            <p class="text-sm color-secondary">Connect your developer identity so OrbitOS can start recommending mentors, teammates, projects, and events matched to you.</p>
          </div>
          <div class="flex flex-col gap-3 border-top p-t-4" style="border-top: 1px solid var(--border-primary); margin-top: var(--space-8);">
            <div class="flex gap-2 align-center">
              <span class="text-xs badge badge-champagne">Active System Node</span>
            </div>
            <p class="text-xs color-tertiary">"The hackathon algorithm balanced 48 teams in 2 minutes. Average similarity match: 91.4%." — Orbit Team Agent</p>
          </div>
        </div>

        <!-- Right Side: Auth Inputs -->
        <div class="flex flex-col justify-center p-8">
          <h2 class="text-2xl font-medium m-b-2">Join OrbitOS</h2>
          <p class="text-xs color-secondary m-b-6">Sign in to sync your GitHub identity and preview your member cockpit.</p>

          <form onsubmit="handleAuthSubmit(event)">
            <div class="m-b-4">
              <label class="text-xs color-secondary block m-b-2">Developer Email</label>
              <input type="email" class="input" placeholder="developer@orbitos.dev" required value="alex.novak@github.com">
            </div>
            <div class="m-b-6">
              <label class="text-xs color-secondary block m-b-2">Security Key</label>
              <input type="password" class="input" placeholder="••••••••" required value="supersecretpassword">
            </div>
            <button type="submit" class="btn btn-primary w-full" id="auth-submit-btn">Launch Member Console</button>
          </form>
        </div>

      </div>
    </div>
  `;
}

function handleAuthSubmit(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value;
  appState.user = {
    email: email,
    name: email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  };

  navigateTo('onboarding');
}

// ==========================================
// MODULE 4: AI ONBOARDING
// ==========================================
const onboardingQuestions = [
  {
    key: 'github',
    title: 'Let\'s sync your developer identity.',
    subtitle: 'OrbitOS imports your repositories and contributions to map your actual skills, avoiding long forms.',
    placeholder: 'Enter GitHub username (e.g. alexnovak)',
    btnText: 'Analyze Profile',
    type: 'github'
  },
  {
    key: 'skills',
    title: 'Confirm your core competencies.',
    subtitle: 'Our parsing agent detected these from your repos. Select or add details.',
    type: 'skills'
  },
  {
    key: 'goals',
    title: 'What are you aiming for?',
    subtitle: 'OrbitOS coordinates mentors and roadmap agents based on your target outcomes.',
    type: 'goals'
  },
  {
    key: 'roles',
    title: 'Hackathon & Team Collaboration.',
    subtitle: 'When building balanced projects, the agent needs to know your primary contribution persona.',
    type: 'roles'
  }
];

function startOnboarding() {
  appState.onboardingStep = 0;
  renderOnboardingStep();
}

function renderOnboardingStep() {
  const step = onboardingQuestions[appState.onboardingStep];
  const container = $('screen-onboarding');
  
  let inputHtml = '';
  
  if (step.type === 'github') {
    inputHtml = `
      <div class="flex flex-col gap-4 w-full" style="max-width: 480px;">
        <div class="flex gap-2">
          <input type="text" id="ob-github-input" class="input" placeholder="${step.placeholder}" value="${appState.onboardingData.github || 'alexnovak'}" style="font-family: monospace;">
          <button class="btn btn-primary" onclick="processOnboardingGithub()">${step.btnText}</button>
        </div>
        <p class="text-xs color-tertiary text-center">Don't have a GitHub? Type any name to simulate mock data sync.</p>
      </div>
    `;
  } else if (step.type === 'skills') {
    inputHtml = `
      <div class="flex flex-col gap-6 w-full" style="max-width: 550px;">
        <div class="flex flex-wrap gap-2 justify-center" id="ob-skills-mesh">
          <span class="badge badge-champagne cursor-pointer" onclick="toggleOnboardingSkill('Rust')">Rust (Detected)</span>
          <span class="badge badge-champagne cursor-pointer" onclick="toggleOnboardingSkill('TypeScript')">TypeScript (Detected)</span>
          <span class="badge badge-champagne cursor-pointer" onclick="toggleOnboardingSkill('Docker')">Docker (Detected)</span>
          <span class="badge cursor-pointer" onclick="toggleOnboardingSkill('React')">React</span>
          <span class="badge cursor-pointer" onclick="toggleOnboardingSkill('Solidity')">Solidity</span>
          <span class="badge cursor-pointer" onclick="toggleOnboardingSkill('Python')">Python</span>
          <span class="badge cursor-pointer" onclick="toggleOnboardingSkill('WebGPU')">WebGPU</span>
        </div>
        <div class="flex gap-2">
          <input type="text" id="ob-skill-custom" class="input text-center" placeholder="Add custom skill/tool...">
          <button class="btn btn-secondary" onclick="addCustomOnboardingSkill()">Add</button>
        </div>
        <button class="btn btn-primary w-full" onclick="nextOnboardingStep()">Confirm Core Skills</button>
      </div>
    `;
  } else if (step.type === 'goals') {
    inputHtml = `
      <div class="flex flex-col gap-4 w-full" style="max-width: 500px;">
        <div class="grid grid-2 gap-4">
          <div class="card card-interactive text-center p-6 border-primary" id="goal-1" onclick="selectOnboardingGoal('build-startup', 'Build a startup project')">
            <h4 class="text-sm font-semibold m-b-2">Build a Startup</h4>
            <p class="text-xs color-tertiary">Match with cofounders and early developers.</p>
          </div>
          <div class="card card-interactive text-center p-6" id="goal-2" onclick="selectOnboardingGoal('learn-tech', 'Master new technologies')">
            <h4 class="text-sm font-semibold m-b-2">Master Tech Stack</h4>
            <p class="text-xs color-tertiary">Get roadmaps and structured mentorship.</p>
          </div>
          <div class="card card-interactive text-center p-6" id="goal-3" onclick="selectOnboardingGoal('hackathon', 'Win hackathons')">
            <h4 class="text-sm font-semibold m-b-2">Dominate Hackathons</h4>
            <p class="text-xs color-tertiary">AI compiles balanced teammates instantly.</p>
          </div>
          <div class="card card-interactive text-center p-6" id="goal-4" onclick="selectOnboardingGoal('open-source', 'Contribute to Open Source')">
            <h4 class="text-sm font-semibold m-b-2">Open Source</h4>
            <p class="text-xs color-tertiary">Find repositories matched to your skills.</p>
          </div>
        </div>
        <button class="btn btn-primary w-full m-t-4" onclick="nextOnboardingStep()" id="goal-next-btn" disabled>Select an Objective</button>
      </div>
    `;
  } else if (step.type === 'roles') {
    inputHtml = `
      <div class="flex flex-col gap-4 w-full" style="max-width: 500px;">
        <div class="grid grid-3 gap-3 text-center">
          <div class="card card-interactive p-4 border-primary" id="role-fs" onclick="selectOnboardingRole('Fullstack')">
            <span class="text-sm font-medium">Fullstack</span>
          </div>
          <div class="card card-interactive p-4" id="role-fe" onclick="selectOnboardingRole('Frontend')">
            <span class="text-sm font-medium">Frontend</span>
          </div>
          <div class="card card-interactive p-4" id="role-be" onclick="selectOnboardingRole('Backend')">
            <span class="text-sm font-medium">Backend</span>
          </div>
          <div class="card card-interactive p-4" id="role-ai" onclick="selectOnboardingRole('AI / ML')">
            <span class="text-sm font-medium">AI / ML</span>
          </div>
          <div class="card card-interactive p-4" id="role-sys" onclick="selectOnboardingRole('Systems')">
            <span class="text-sm font-medium">Systems</span>
          </div>
          <div class="card card-interactive p-4" id="role-design" onclick="selectOnboardingRole('UX / Product')">
            <span class="text-sm font-medium">UX / Product</span>
          </div>
        </div>
        
        <div class="m-t-4 m-b-4 text-left">
          <label class="text-xs color-secondary block m-b-2">Weekly Time Availability</label>
          <select id="ob-time-commitment" class="input" style="background-color: var(--bg-secondary); border-color: var(--border-primary);">
            <option>2-5 hours/week</option>
            <option selected>5-10 hours/week</option>
            <option>10-20 hours/week</option>
            <option>Full-time dedication</option>
          </select>
        </div>

        <button class="btn btn-primary w-full" onclick="completeOnboarding()">Initialize OrbitOS Cockpit</button>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="container flex flex-col align-center justify-between" style="min-height: 100vh; padding: var(--space-8) 0;">
      <!-- Onboarding Top Bar -->
      <div class="w-full flex justify-between align-center p-b-4" style="max-width: 800px; border-bottom: 1px solid var(--border-dim);">
        <div class="logo">
          <div class="logo-icon"></div>
          <span>OrbitOS Onboarding</span>
        </div>
        <span class="text-xs color-secondary">Step ${appState.onboardingStep + 1} of ${onboardingQuestions.length}</span>
      </div>

      <!-- Center content: Chat and form hybrid -->
      <div class="flex flex-col align-center text-center w-full animate-fade" style="max-width: 600px; margin: auto;">
        
        <!-- Mentor Chat bubble -->
        <div class="flex align-center gap-3 m-b-6">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--accent-champagne-muted); border: 1px solid var(--accent-champagne); display: flex; align-items: center; justify-content: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-champagne)" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <span class="text-xs color-champagne font-display uppercase tracking-wider">Orbit Onboarding Guide</span>
        </div>

        <h2 class="text-4xl font-light m-b-3">${step.title}</h2>
        <p class="text-sm color-secondary m-b-8" style="line-height: 1.6;">${step.subtitle}</p>

        <!-- Dynamic Inputs -->
        ${inputHtml}
      </div>

      <!-- Onboarding footer progress indicators -->
      <div class="flex gap-2 justify-center">
        ${onboardingQuestions.map((_, idx) => `
          <span style="width: ${idx === appState.onboardingStep ? '24px' : '6px'}; height: 6px; border-radius: 3px; background: ${idx === appState.onboardingStep ? 'var(--accent-champagne)' : 'var(--border-secondary)'}; transition: all var(--transition-normal);"></span>
        `).join('')}
      </div>
    </div>
  `;

  // Focus inputs if relevant
  if (step.type === 'github' && $('ob-github-input')) {
    $('ob-github-input').focus();
  }
}

function processOnboardingGithub() {
  const username = $('ob-github-input').value.trim() || 'alexnovak';
  appState.onboardingData.github = username;

  // Simulate AI Loading state
  const container = $('screen-onboarding');
  container.innerHTML = `
    <div class="container flex flex-col align-center justify-center" style="min-height: 100vh;">
      <div class="flex flex-col align-center text-center max-w-sm animate-fade">
        <div class="loading-orb m-b-8" style="width: 80px; height: 80px;"></div>
        <h3 class="text-2xl font-light m-b-3">Analyzing GitHub Identity</h3>
        <p class="text-xs color-secondary m-b-4">Parsing repositories for skills, API designs, and contribution patterns...</p>
        <span class="text-xs color-tertiary" id="loading-details">Checking github.com/${username} ...</span>
      </div>
    </div>
  `;

  // Dynamic status updates to make it feel extremely detailed
  setTimeout(() => {
    const loader = $('loading-details');
    if (loader) loader.innerText = 'Found 14 public repositories. Extracting language metrics...';
  }, 800);

  setTimeout(() => {
    const loader = $('loading-details');
    if (loader) loader.innerText = 'Analyzing package.json and Cargo.toml frameworks...';
  }, 1600);

  setTimeout(() => {
    // Save detected skills
    appState.onboardingData.skills = ['Rust', 'TypeScript', 'Docker'];
    appState.onboardingStep++;
    renderOnboardingStep();
  }, 2400);
}

function toggleOnboardingSkill(skill) {
  const mesh = $('ob-skills-mesh');
  const badges = Array.from(mesh.children);
  
  // Find matching badge
  const badge = badges.find(b => b.innerText.includes(skill));
  if (!badge) return;

  const idx = appState.onboardingData.skills.indexOf(skill);
  if (idx > -1) {
    appState.onboardingData.skills.splice(idx, 1);
    badge.className = 'badge cursor-pointer';
    badge.innerText = skill;
  } else {
    appState.onboardingData.skills.push(skill);
    badge.className = 'badge badge-champagne cursor-pointer';
    badge.innerText = `${skill} (Detected)`;
  }
}

function addCustomOnboardingSkill() {
  const input = $('ob-skill-custom');
  const val = input.value.trim();
  if (!val) return;

  appState.onboardingData.skills.push(val);
  const mesh = $('ob-skills-mesh');
  
  const span = document.createElement('span');
  span.className = 'badge badge-champagne cursor-pointer';
  span.innerText = `${val} (Added)`;
  span.onclick = () => {
    const idx = appState.onboardingData.skills.indexOf(val);
    if (idx > -1) appState.onboardingData.skills.splice(idx, 1);
    span.remove();
  };
  mesh.appendChild(span);
  input.value = '';
}

function selectOnboardingGoal(goalId, goalText) {
  appState.onboardingData.goals = goalText;
  
  // Update card selections
  ['goal-1', 'goal-2', 'goal-3', 'goal-4'].forEach(id => {
    const card = $(id);
    if (id === `goal-${goalId === 'build-startup' ? 1 : goalId === 'learn-tech' ? 2 : goalId === 'hackathon' ? 3 : 4}`) {
      card.style.borderColor = 'var(--accent-champagne)';
      card.style.backgroundColor = 'rgba(255,255,255,0.02)';
    } else {
      card.style.borderColor = 'var(--border-primary)';
      card.style.backgroundColor = 'var(--bg-secondary)';
    }
  });

  const nextBtn = $('goal-next-btn');
  nextBtn.removeAttribute('disabled');
  nextBtn.innerText = `Continue with: "${goalText}"`;
}

function selectOnboardingRole(role) {
  appState.onboardingData.hackathonRole = role;
  
  const mapping = {
    'Fullstack': 'fs',
    'Frontend': 'fe',
    'Backend': 'be',
    'AI / ML': 'ai',
    'Systems': 'sys',
    'UX / Product': 'design'
  };

  Object.keys(mapping).forEach(k => {
    const card = $(`role-${mapping[k]}`);
    if (k === role) {
      card.style.borderColor = 'var(--accent-champagne)';
      card.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
    } else {
      card.style.borderColor = 'var(--border-primary)';
      card.style.backgroundColor = 'var(--bg-secondary)';
    }
  });
}

function nextOnboardingStep() {
  appState.onboardingStep++;
  renderOnboardingStep();
}

function completeOnboarding() {
  // Capture time commitment
  if ($('ob-time-commitment')) {
    appState.onboardingData.timeCommitment = $('ob-time-commitment').value;
  }
  
  // Setup user object profile details
  appState.user.github = appState.onboardingData.github;
  appState.user.skills = appState.onboardingData.skills;
  appState.user.goals = appState.onboardingData.goals;
  appState.user.timeCommitment = appState.onboardingData.timeCommitment;
  appState.user.role = appState.onboardingData.hackathonRole;

  // Navigate to Member Dashboard
  navigateTo('dashboard');
}

// Window load trigger
window.addEventListener('DOMContentLoaded', () => {
  // Read hash route if preset
  const hash = window.location.hash;
  if (hash === '#auth') {
    navigateTo('auth');
  } else {
    navigateTo('landing');
  }
});

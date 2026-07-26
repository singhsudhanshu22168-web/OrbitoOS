// ==========================================
// MODULE 9: COMMUNITY GRAPH VIEW (CANVAS SIMULATION)
// ==========================================

let graphCanvas = null;
let graphCtx = null;
let graphNodes = [];
let graphLinks = [];
let graphZoom = 1.0;
let graphPanX = 0;
let graphPanY = 0;
let isDraggingGraph = false;
let dragStartX = 0;
let dragStartY = 0;
let hoveredNode = null;
let graphAnimationId = null;

// Mock node templates to generate nodes
const mockNames = [
  { name: 'Kai Takahashi', role: 'UI Designer', skills: ['React', 'Figma', 'CSS'] },
  { name: 'Chloe Dupond', role: 'AI Engineer', skills: ['Python', 'PyTorch', 'LangChain'] },
  { name: 'Elena Rostova', role: 'Systems Architect', skills: ['Rust', 'Go', 'WebAssembly'] },
  { name: 'Marcus Chen', role: 'Staff Engineer', skills: ['TypeScript', 'React', 'GraphQL'] },
  { name: 'Aria Vance', role: 'Co-founder', skills: ['Rust', 'Docker', 'Python'] },
  { name: 'Tariq Jordan', role: 'Senior Advocate', skills: ['TypeScript', 'Node.js', 'PostgreSQL'] },
  { name: 'Zahir Miller', role: 'Backend Engineer', skills: ['Go', 'Kubernetes', 'gRPC'] },
  { name: 'Sasha Petrova', role: 'Fullstack Dev', skills: ['TypeScript', 'React', 'Node.js'] },
  { name: 'Yuki Sato', role: 'Security Audits', skills: ['Solidity', 'Rust', 'EVM'] },
  { name: 'Olivia Smith', role: 'UX Researcher', skills: ['Figma', 'User Research', 'HTML'] }
];

function initGraphData(width, height) {
  graphNodes = [];
  graphLinks = [];
  
  // Add User Node (Center)
  graphNodes.push({
    id: 0,
    name: appState.user.name,
    role: appState.user.role,
    skills: appState.user.skills,
    x: width / 2,
    y: height / 2,
    vx: 0,
    vy: 0,
    radius: 9,
    color: '#ffffff',
    isUser: true
  });

  // Generate other nodes around
  for (let i = 0; i < 20; i++) {
    const template = mockNames[i % mockNames.length];
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 200;
    
    graphNodes.push({
      id: i + 1,
      name: i < mockNames.length ? template.name : `${template.name} II`,
      role: template.role,
      skills: template.skills,
      x: width / 2 + Math.cos(angle) * distance,
      y: height / 2 + Math.sin(angle) * distance,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: i < 5 ? 7 : 5, // Mentors are larger
      color: i < 5 ? '#c5a880' : '#86868b', // Mentors are champagne, members are grey
      isMentor: i < 5
    });
  }

  // Create links (connect members who share skills)
  for (let i = 0; i < graphNodes.length; i++) {
    for (let j = i + 1; j < graphNodes.length; j++) {
      const n1 = graphNodes[i];
      const n2 = graphNodes[j];
      
      // Calculate skill overlap
      const overlap = n1.skills.filter(s => n2.skills.includes(s));
      if (overlap.length > 0 && Math.random() < 0.3) {
        graphLinks.push({
          source: n1.id,
          target: n2.id,
          width: overlap.length * 0.8,
          color: n1.isUser || n2.isUser ? 'rgba(197, 168, 128, 0.25)' : 'rgba(255, 255, 255, 0.05)'
        });
      }
    }
  }
}

function renderGraphTab() {
  setTimeout(() => {
    setupGraphCanvas();
  }, 100);

  return `
    <div class="flex flex-col gap-6">
      
      <!-- Top Title and Explanation -->
      <div class="flex justify-between align-end border-bottom p-b-6" style="border-bottom: 1px solid var(--border-primary);">
        <div class="max-w-xl">
          <span class="badge badge-champagne m-b-2">Community Digital Twin API</span>
          <h2 class="text-3xl font-light">Interactive Connection Mesh</h2>
          <p class="text-sm color-secondary m-t-2">
            Visualizes skill overlaps, mentorship paths, and collaboration arcs. Hover nodes to view developer details. Drag to pan, scroll to zoom.
          </p>
        </div>
        <div class="flex align-center gap-3">
          <div class="badge" style="background: rgba(197, 168, 128, 0.1); border-color: var(--accent-champagne-muted); color: var(--accent-champagne);">User Node: Active</div>
          <button class="btn btn-secondary text-xs" onclick="resetGraphView()">Recenter View</button>
        </div>
      </div>

      <!-- Graph container -->
      <div class="grid grid-3 gap-6">
        <!-- Canvas Workspace -->
        <div class="card p-0" style="grid-column: span 2; position: relative; height: 520px; overflow: hidden; background: #030303;">
          <canvas id="community-graph-canvas" style="cursor: grab; width: 100%; height: 100%;"></canvas>
          
          <!-- Zoom UI Overlay -->
          <div class="flex gap-2" style="position: absolute; bottom: 16px; left: 16px; z-index: 5;">
            <button class="btn btn-secondary" style="padding: var(--space-2) var(--space-3); font-size: 11px;" onclick="zoomGraph(1.2)">+</button>
            <button class="btn btn-secondary" style="padding: var(--space-2) var(--space-3); font-size: 11px;" onclick="zoomGraph(0.8)">-</button>
          </div>
        </div>

        <!-- Node Inspector Sidebar Panel -->
        <div class="card flex flex-col justify-between" id="graph-inspector-panel" style="height: 520px; background: rgba(15,15,16,0.6);">
          <div id="inspector-content-area">
            <span class="badge badge-champagne m-b-4">Node Inspector</span>
            <h3 class="text-2xl font-light m-b-2" id="ins-name">Hover a Developer</h3>
            <p class="text-xs color-champagne m-b-6" id="ins-role">Explore relation meshes</p>
            
            <div id="ins-details" class="hidden flex flex-col gap-4">
              <div>
                <span class="text-xs color-tertiary uppercase block m-b-1">GitHub Account</span>
                <span class="text-xs font-mono text-primary" id="ins-github">github.com/handle</span>
              </div>
              <div>
                <span class="text-xs color-tertiary uppercase block m-b-1">Core Tech Stack</span>
                <div class="flex flex-wrap gap-1 m-t-1" id="ins-skills">
                  <!-- Skills badges -->
                </div>
              </div>
              <div id="ins-overlap-container">
                <span class="text-xs color-champagne uppercase block m-b-1">Skill Intersection</span>
                <p class="text-xs color-secondary" id="ins-overlap-desc">Rust, TypeScript</p>
              </div>
            </div>
          </div>

          <div class="border-top p-t-4" style="border-top: 1px solid var(--border-primary);">
            <div class="flex justify-between text-xs color-tertiary">
              <span>Nodes: 21</span>
              <span>Connections: ${graphLinks.length || 34}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}

function setupGraphCanvas() {
  const canvas = $('community-graph-canvas');
  if (!canvas) return;

  graphCanvas = canvas;
  graphCtx = canvas.getContext('2d');
  
  // Set dimensions correctly
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  // Initialize nodes if not already done
  if (graphNodes.length === 0) {
    initGraphData(canvas.width, canvas.height);
  }

  // Setup Event Listeners
  canvas.addEventListener('mousedown', startPanGraph);
  canvas.addEventListener('mousemove', moveMouseGraph);
  canvas.addEventListener('mouseup', endPanGraph);
  canvas.addEventListener('wheel', wheelZoomGraph);

  // Start Animation Loop
  if (graphAnimationId) cancelAnimationFrame(graphAnimationId);
  drawGraphLoop();
}

function drawGraphLoop() {
  if (!graphCtx || !graphCanvas) return;

  const w = graphCanvas.width;
  const h = graphCanvas.height;

  // Physics simulation update (soft attraction force to center, bounce on walls)
  graphNodes.forEach(node => {
    if (node.isUser) return; // Keep center node static
    
    // Tiny attraction to center
    const dx = w / 2 - node.x;
    const dy = h / 2 - node.y;
    node.vx += dx * 0.0001;
    node.vy += dy * 0.0001;

    // Boundary bounce
    if (node.x < 30 || node.x > w - 30) node.vx *= -1;
    if (node.y < 30 || node.y > h - 30) node.vy *= -1;

    // Apply speed limits
    node.vx = Math.max(-0.6, Math.min(0.6, node.vx));
    node.vy = Math.max(-0.6, Math.min(0.6, node.vy));

    node.x += node.vx;
    node.y += node.vy;
  });

  graphCtx.clearRect(0, 0, w, h);
  
  graphCtx.save();
  // Apply camera offset zoom/pan
  graphCtx.translate(graphPanX, graphPanY);
  graphCtx.scale(graphZoom, graphZoom);

  // Draw links
  graphLinks.forEach(link => {
    const sNode = graphNodes.find(n => n.id === link.source);
    const tNode = graphNodes.find(n => n.id === link.target);
    
    if (sNode && tNode) {
      graphCtx.beginPath();
      graphCtx.moveTo(sNode.x, sNode.y);
      graphCtx.lineTo(tNode.x, tNode.y);
      graphCtx.strokeStyle = link.color;
      graphCtx.lineWidth = link.width;
      graphCtx.stroke();
    }
  });

  // Draw nodes
  graphNodes.forEach(node => {
    graphCtx.beginPath();
    graphCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    graphCtx.fillStyle = node.color;
    graphCtx.fill();

    // Subtle glow rings
    graphCtx.beginPath();
    graphCtx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
    graphCtx.strokeStyle = node.isUser ? 'rgba(255, 255, 255, 0.15)' : node.isMentor ? 'rgba(197, 168, 128, 0.12)' : 'rgba(255,255,255,0.03)';
    graphCtx.lineWidth = 1;
    graphCtx.stroke();
    
    // User special glowing pulse ring
    if (node.isUser) {
      graphCtx.beginPath();
      graphCtx.arc(node.x, node.y, node.radius + (Math.sin(Date.now() / 200) * 4 + 8), 0, Math.PI * 2);
      graphCtx.strokeStyle = 'rgba(197, 168, 128, 0.2)';
      graphCtx.lineWidth = 1.5;
      graphCtx.stroke();
    }

    // Node labels if zoomed in
    if (graphZoom > 0.8) {
      graphCtx.fillStyle = '#86868b';
      graphCtx.font = '9px monospace';
      graphCtx.fillText(node.name.split(' ')[0], node.x - 12, node.y - 12);
    }
  });

  graphCtx.restore();

  graphAnimationId = requestAnimationFrame(drawGraphLoop);
}

// Mouse events on canvas
function startPanGraph(e) {
  isDraggingGraph = true;
  graphCanvas.style.cursor = 'grabbing';
  dragStartX = e.clientX - graphPanX;
  dragStartY = e.clientY - graphPanY;
}

function moveMouseGraph(e) {
  const rect = graphCanvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (isDraggingGraph) {
    graphPanX = e.clientX - dragStartX;
    graphPanY = e.clientY - dragStartY;
  } else {
    // Hover checking
    // Convert screen coordinates to world coordinates
    const worldX = (mouseX - graphPanX) / graphZoom;
    const worldY = (mouseY - graphPanY) / graphZoom;

    let found = null;
    for (let i = 0; i < graphNodes.length; i++) {
      const node = graphNodes[i];
      const dist = Math.hypot(node.x - worldX, node.y - worldY);
      if (dist < node.radius + 8) {
        found = node;
        break;
      }
    }

    if (found !== hoveredNode) {
      hoveredNode = found;
      updateGraphInspector(found);
    }
  }
}

function endPanGraph() {
  isDraggingGraph = false;
  if (graphCanvas) graphCanvas.style.cursor = 'grab';
}

function wheelZoomGraph(e) {
  e.preventDefault();
  const zoomFactor = e.deltaY < 0 ? 1.05 : 0.95;
  zoomGraph(zoomFactor);
}

function zoomGraph(factor) {
  const newZoom = graphZoom * factor;
  // Constraint zoom between 0.4 and 3.0
  if (newZoom > 0.4 && newZoom < 3.0) {
    graphZoom = newZoom;
  }
}

function resetGraphView() {
  graphZoom = 1.0;
  graphPanX = 0;
  graphPanY = 0;
}

function updateGraphInspector(node) {
  const nameEl = $('ins-name');
  const roleEl = $('ins-role');
  const details = $('ins-details');
  const githubEl = $('ins-github');
  const skillsEl = $('ins-skills');
  const overlapContainer = $('ins-overlap-container');
  const overlapDesc = $('ins-overlap-desc');

  if (!node) {
    nameEl.innerText = 'Hover a Developer';
    roleEl.innerText = 'Explore relation meshes';
    hide(details);
    return;
  }

  show(details);
  nameEl.innerText = node.name;
  roleEl.innerText = node.isUser ? 'Backend Architect (You)' : node.isMentor ? `Mentor / ${node.role}` : `Member / ${node.role}`;
  githubEl.innerText = `github.com/${node.name.toLowerCase().replace(/\\s/g, '')}`;
  
  // Render Skills badges
  skillsEl.innerHTML = node.skills.map(s => `<span class="badge text-xs" style="font-size: 10px;">${s}</span>`).join('');

  // Overlap analysis
  if (node.isUser) {
    hide(overlapContainer);
  } else {
    show(overlapContainer);
    const overlap = node.skills.filter(s => appState.user.skills.includes(s));
    if (overlap.length > 0) {
      overlapDesc.innerHTML = `<span class="color-champagne font-semibold">${overlap.join(', ')}</span> (Shared overlap)`;
    } else {
      overlapDesc.innerText = 'No direct tech overlap. Complementary skills fit.';
    }
  }
}

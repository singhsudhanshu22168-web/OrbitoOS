// ==========================================
// MODULE 10: COMMUNITY DIGITAL TWIN VIEW
// ==========================================

let twinCanvas = null;
let twinCtx = null;
let twinPoints = [];
let twinAnimationId = null;
let twinRotationAngle = 0;

function initTwinSphere() {
  twinPoints = [];
  const numPoints = 120;
  
  // Generate points distributed on a sphere
  for (let i = 0; i < numPoints; i++) {
    const theta = Math.acos(Math.random() * 2 - 1);
    const phi = Math.random() * Math.PI * 2;
    
    twinPoints.push({
      x3d: Math.sin(theta) * Math.cos(phi),
      y3d: Math.sin(theta) * Math.sin(phi),
      z3d: Math.cos(theta),
      pulseOffset: Math.random() * Math.PI * 2
    });
  }
}

function renderTwinTab() {
  setTimeout(() => {
    setupTwinCanvas();
  }, 100);

  return `
    <div class="flex flex-col gap-6">
      
      <!-- Top Title and Explanation -->
      <div class="flex justify-between align-end border-bottom p-b-6" style="border-bottom: 1px solid var(--border-primary);">
        <div class="max-w-xl">
          <span class="badge badge-champagne m-b-2">OrbitOS Signature Twin</span>
          <h2 class="text-3xl font-light">Community Digital Twin</h2>
          <p class="text-sm color-secondary m-t-2">
            OrbitOS builds a continuous mathematical replica of the entire community, simulating relation growth, project liquidity, and predicting community evolution.
          </p>
        </div>
        <div class="badge">Model Status: Synced & Simulating</div>
      </div>

      <!-- Main Twin Layout Grid -->
      <div class="grid grid-3 gap-6">
        
        <!-- Left Column: Beating Heart Sphere Canvas -->
        <div class="card p-0 flex flex-col justify-between" style="grid-column: span 2; height: 500px; background: #030303; position: relative; overflow: hidden;">
          <div class="p-6" style="position: absolute; top: 0; left: 0; z-index: 5;">
            <h3 class="text-md font-medium text-primary">Live Relational Topology</h3>
            <span class="text-xs color-secondary">Continuously solving 120 node coordinate points</span>
          </div>
          
          <canvas id="digital-twin-canvas" style="width: 100%; height: 100%;"></canvas>
          
          <div class="p-6 flex justify-between align-center" style="position: absolute; bottom: 0; left: 0; right: 0; z-index: 5; background: linear-gradient(0deg, #030303 30%, transparent 100%);">
            <span class="text-xs color-tertiary">Calculated Twin Pulse Rate: 72 bpm (Pulsing Softly)</span>
            <div class="flex gap-2">
              <span class="badge badge-champagne text-xs">Simulating Future States</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Predictive Engine & Health Indices -->
        <div class="flex flex-col gap-6" style="height: 500px;">
          <!-- Health Cards -->
          <div class="card flex flex-col gap-4" style="flex: 1; padding: var(--space-5);">
            <h3 class="text-xs color-tertiary uppercase tracking-wider">Predictive Indicators</h3>
            
            <div class="flex flex-col gap-3">
              <div class="flex justify-between align-center border-bottom p-b-2" style="border-bottom: 1px solid var(--border-primary);">
                <div>
                  <span class="text-xs font-semibold text-primary block">Talent Liquidity</span>
                  <span class="text-xs color-secondary" style="font-size: 10px;">Availability mapping speed</span>
                </div>
                <span class="text-sm font-semibold color-champagne">92/100</span>
              </div>
              <div class="flex justify-between align-center border-bottom p-b-2" style="border-bottom: 1px solid var(--border-primary);">
                <div>
                  <span class="text-xs font-semibold text-primary block">Cohort Velocity</span>
                  <span class="text-xs color-secondary" style="font-size: 10px;">Hackathon formation cycles</span>
                </div>
                <span class="text-sm font-semibold color-champagne">88/100</span>
              </div>
              <div class="flex justify-between align-center border-bottom p-b-2" style="border-bottom: 1px solid var(--border-primary);">
                <div>
                  <span class="text-xs font-semibold text-primary block">Sustain Index</span>
                  <span class="text-xs color-secondary" style="font-size: 10px;">Retention & member engagement</span>
                </div>
                <span class="text-sm font-semibold color-champagne">94/100</span>
              </div>
            </div>
          </div>

          <!-- AI Forecast Panel -->
          <div class="card flex flex-col gap-3" style="flex: 1.2; padding: var(--space-5);">
            <h3 class="text-xs color-tertiary uppercase tracking-wider">AI Forecast (7-Day Projection)</h3>
            <div class="flex flex-col gap-3" style="font-size: 0.8rem;">
              <div class="flex gap-2">
                <span style="color: var(--accent-champagne);">↳</span>
                <p class="color-secondary"><span class="font-medium text-primary">Cohort Growth:</span> Predict +14% member engagement surge next week due to the upcoming AI Hackathon.</p>
              </div>
              <div class="flex gap-2">
                <span style="color: var(--accent-champagne);">↳</span>
                <p class="color-secondary"><span class="font-medium text-primary">Saturate Alert:</span> Systems mentors heading towards 78% bandwidth capacity. Proposing 2 new mentor recruits.</p>
              </div>
              <div class="flex gap-2">
                <span style="color: var(--accent-champagne);">↳</span>
                <p class="color-secondary"><span class="font-medium text-primary">Churn Risk:</span> Detected 4 passive nodes (low commit counts). Auto-onboarding checklist recommendation deployed.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Live Activities Feed -->
      <div class="card p-6">
        <h3 class="text-xs color-tertiary uppercase tracking-wider m-b-4">Live Collaboration Pipeline</h3>
        <div class="flex flex-col gap-3" id="live-collaboration-feed" style="font-size: 0.85rem;">
          <div class="flex justify-between border-bottom p-b-2" style="border-bottom: 1px solid var(--border-primary);">
            <p class="color-secondary"><span class="font-medium text-primary">Elena Rostova</span> (Mentor) reviewed <span class="font-medium text-primary">Alex Novak's</span> (You) code in tokio-redis.</p>
            <span class="text-xs color-tertiary">14s ago</span>
          </div>
          <div class="flex justify-between border-bottom p-b-2" style="border-bottom: 1px solid var(--border-primary);">
            <p class="color-secondary"><span class="font-medium text-primary">Kai Takahashi</span> joined <span class="font-medium text-primary">Rustaceans Cohort</span> (Hackathon Squad 4).</p>
            <span class="text-xs color-tertiary">2m ago</span>
          </div>
          <div class="flex justify-between border-bottom p-b-2" style="border-bottom: 1px solid var(--border-primary);">
            <p class="color-secondary"><span class="font-medium text-primary">Aria Vance</span> initialized mentor-onboarding checklist for <span class="font-medium text-primary">Yuki Sato</span>.</p>
            <span class="text-xs color-tertiary">8m ago</span>
          </div>
        </div>
      </div>

    </div>
  `;
}

function setupTwinCanvas() {
  const canvas = $('digital-twin-canvas');
  if (!canvas) return;

  twinCanvas = canvas;
  twinCtx = canvas.getContext('2d');
  
  // Set dimensions correctly
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  // Initialize sphere points
  initTwinSphere();

  // Start Animation Loop
  if (twinAnimationId) cancelAnimationFrame(twinAnimationId);
  drawTwinLoop();
}

function drawTwinLoop() {
  if (!twinCtx || !twinCanvas) return;

  const w = twinCanvas.width;
  const h = twinCanvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const rSphere = Math.min(w, h) * 0.28;

  twinCtx.clearRect(0, 0, w, h);
  
  // Rotation speeds
  twinRotationAngle += 0.003;
  const cosAngle = Math.cos(twinRotationAngle);
  const sinAngle = Math.sin(twinRotationAngle);

  // Project and draw points
  const projectedPoints = twinPoints.map(p => {
    // Rotate around Y axis
    const xRotY = p.x3d * cosAngle - p.z3d * sinAngle;
    const zRotY = p.x3d * sinAngle + p.z3d * cosAngle;

    // Rotate around X axis slightly for 3D tilt
    const tilt = 0.5;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);
    const yRotX = p.y3d * cosT - zRotY * sinT;
    const zRotX = p.y3d * sinT + zRotY * cosT;

    // Scale perspective (simple orthographic or light perspective)
    const perspective = 2.0 / (2.0 + zRotX);
    
    // Add pulsing action
    const pulseFactor = 1.0 + Math.sin(Date.now() / 800 + p.pulseOffset) * 0.06;

    return {
      x2d: cx + xRotY * rSphere * perspective * pulseFactor,
      y2d: cy + yRotX * rSphere * perspective * pulseFactor,
      depth: zRotX, // Depth for transparency/sizing
      radius: (1.5 + zRotX * 0.8) * perspective * 2
    };
  });

  // Sort by depth (painters algorithm) to draw background lines/nodes first
  projectedPoints.sort((a, b) => b.depth - a.depth);

  // Draw simulated connection lines between nearby points
  twinCtx.strokeStyle = 'rgba(197, 168, 128, 0.03)';
  twinCtx.lineWidth = 0.5;
  for (let i = 0; i < projectedPoints.length; i++) {
    for (let j = i + 1; j < projectedPoints.length; j++) {
      const p1 = projectedPoints[i];
      const p2 = projectedPoints[j];
      const dist = Math.hypot(p1.x2d - p2.x2d, p1.y2d - p2.y2d);
      
      // Draw connection line if points are close in 2D space and depth is similar
      if (dist < 60 && Math.abs(p1.depth - p2.depth) < 0.6) {
        twinCtx.beginPath();
        twinCtx.moveTo(p1.x2d, p1.y2d);
        twinCtx.lineTo(p2.x2d, p2.y2d);
        
        // Darker lines for nodes at the back
        const alpha = Math.max(0.01, (1.0 - (p1.depth + p2.depth) / 2) * 0.08);
        twinCtx.strokeStyle = `rgba(197, 168, 128, ${alpha})`;
        twinCtx.stroke();
      }
    }
  }

  // Draw points
  projectedPoints.forEach(p => {
    twinCtx.beginPath();
    twinCtx.arc(p.x2d, p.y2d, p.radius, 0, Math.PI * 2);
    
    // Deeper nodes are darker and smaller
    const opacity = Math.max(0.1, (1.0 - p.depth) * 0.6);
    twinCtx.fillStyle = `rgba(245, 245, 247, ${opacity})`;
    if (p.depth < -0.4) {
      // Highlights nodes at the front with champagne glow
      twinCtx.fillStyle = `rgba(197, 168, 128, ${opacity * 1.5})`;
    }
    
    twinCtx.fill();
  });

  twinAnimationId = requestAnimationFrame(drawTwinLoop);
}

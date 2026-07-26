// ==========================================
// MODULE 12: PRIORITY EVENTS VIEW
// ==========================================
// Part of the Community Intelligence Engine — surfaces events ranked by
// skill-mesh relevance to the member, not calendar order.

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

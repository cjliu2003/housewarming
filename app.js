/* ═══════════════════════════════════════════════════════════
   app.js  ·  Reads PARTY_DATA from data.js and drives the UI
═══════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────
//  NAVIGATION
// ─────────────────────────────────────────────────────────
function navigate(id) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => { s.hidden = true; });
  // Deactivate all nav buttons
  document.querySelectorAll('[data-section]').forEach(el => el.classList.remove('active'));

  // Show target section
  const section = document.getElementById('section-' + id);
  if (section) section.hidden = false;

  // Mark matching nav buttons as active
  document.querySelectorAll(`[data-section="${id}"]`).forEach(el => el.classList.add('active'));
}

// Wire every element with data-section to the router
document.querySelectorAll('[data-section]').forEach(el => {
  el.addEventListener('click', () => navigate(el.dataset.section));
});


// ─────────────────────────────────────────────────────────
//  INIT  – entry point, called at the bottom
// ─────────────────────────────────────────────────────────
function init() {
  const { site, guests, facts, jeopardy } = PARTY_DATA;

  // Populate site metadata
  document.title = site.title;
  document.getElementById('nav-title').textContent    = site.title;
  document.getElementById('hero-title').textContent   = site.title;
  document.getElementById('hero-subtitle').textContent = site.subtitle;

  renderGuests(guests);
  initFacts(facts, guests);
  initJeopardy(jeopardy);

  navigate('home');
}


// ─────────────────────────────────────────────────────────
//  GUESTS
// ─────────────────────────────────────────────────────────
function renderGuests(guests) {
  const grid = document.getElementById('guests-grid');

  grid.innerHTML = guests.map(g => {
    const hasPhoto = !!g.photo;
    return `
      <div class="guest-card">
        <div class="guest-photo-wrap">
          ${hasPhoto ? `
            <img
              class="guest-photo"
              src="${g.photo}"
              alt="${g.name}"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            />
            <div class="guest-placeholder" style="display:none">👤</div>
          ` : `
            <div class="guest-placeholder">👤</div>
          `}
        </div>
        <div class="guest-name">${g.name}</div>
      </div>
    `;
  }).join('');
}


// ─────────────────────────────────────────────────────────
//  FACTS SLIDESHOW
// ─────────────────────────────────────────────────────────
let factsArr   = [];   // the raw facts from data.js
let guestMap   = {};   // id → guest object
let factOrder  = [];   // indices into factsArr (shuffleable)
let factIdx    = 0;    // current position in factOrder
let isRevealed = false;

function initFacts(facts, guests) {
  factsArr  = facts;
  guestMap  = Object.fromEntries(guests.map(g => [g.id, g]));
  factOrder = facts.map((_, i) => i);

  showFact();

  document.getElementById('btn-reveal').addEventListener('click', () => {
    if (!isRevealed) revealFact();
  });
  document.getElementById('btn-prev').addEventListener('click', () => {
    factIdx = (factIdx - 1 + factOrder.length) % factOrder.length;
    showFact();
  });
  document.getElementById('btn-next').addEventListener('click', () => {
    factIdx = (factIdx + 1) % factOrder.length;
    showFact();
  });
  document.getElementById('btn-shuffle').addEventListener('click', shuffleFacts);

  // Arrow-key navigation when on the facts section
  document.addEventListener('keydown', e => {
    const factsSection = document.getElementById('section-facts');
    if (factsSection.hidden) return;
    if (e.key === 'ArrowRight') { factIdx = (factIdx + 1) % factOrder.length; showFact(); }
    if (e.key === 'ArrowLeft')  { factIdx = (factIdx - 1 + factOrder.length) % factOrder.length; showFact(); }
    if (e.key === 'Enter' && !isRevealed) revealFact();
  });
}

function showFact() {
  isRevealed = false;
  const fact = factsArr[factOrder[factIdx]];

  document.getElementById('fact-meta').textContent = `${factIdx + 1} of ${factOrder.length}`;
  document.getElementById('fact-text').textContent  = fact.fact;

  // Reset reveal
  const revealEl = document.getElementById('fact-reveal');
  revealEl.classList.remove('visible');
  revealEl.hidden = true;

  // Reset button
  const btn = document.getElementById('btn-reveal');
  btn.textContent = '🎭 Reveal';
  btn.disabled    = false;
}

function revealFact() {
  isRevealed = true;

  const fact  = factsArr[factOrder[factIdx]];
  const guest = guestMap[fact.guestId];

  if (!guest) {
    console.warn(`No guest found for guestId: "${fact.guestId}"`);
    return;
  }

  // Build photo or placeholder
  const wrap = document.getElementById('reveal-photo-wrap');
  wrap.innerHTML = '';

  if (guest.photo) {
    const img   = document.createElement('img');
    img.src     = guest.photo;
    img.alt     = guest.name;
    img.className = 'reveal-photo';
    img.onerror = () => { wrap.innerHTML = '<span class="reveal-placeholder">👤</span>'; };
    wrap.appendChild(img);
  } else {
    wrap.innerHTML = '<span class="reveal-placeholder">👤</span>';
  }

  document.getElementById('reveal-name').textContent = guest.name;

  // Animate reveal
  const revealEl = document.getElementById('fact-reveal');
  revealEl.hidden = false;
  // requestAnimationFrame ensures hidden is removed before class is added
  requestAnimationFrame(() => requestAnimationFrame(() => revealEl.classList.add('visible')));

  // Update button
  const btn = document.getElementById('btn-reveal');
  btn.textContent = '✓ Revealed';
  btn.disabled    = true;
}

function shuffleFacts() {
  // Fisher-Yates shuffle
  const arr = factOrder.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j  = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  factOrder = arr;
  factIdx   = 0;
  showFact();
}


// ─────────────────────────────────────────────────────────
//  JEOPARDY
// ─────────────────────────────────────────────────────────
let scores       = {};      // team → number
let usedCells    = new Set();
let activeCell   = null;    // { key, val, category, row } for current modal
let answerShown  = false;

function initJeopardy(jeopardy) {
  // Initialize scores
  jeopardy.teams.forEach(t => { scores[t] = 0; });
  renderScoreboard(jeopardy.teams);
  renderBoard(jeopardy);

  // Reset button
  document.getElementById('btn-reset').addEventListener('click', () => {
    if (!confirm('Reset the board and all scores?')) return;
    usedCells.clear();
    jeopardy.teams.forEach(t => { scores[t] = 0; });
    renderScoreboard(jeopardy.teams);
    renderBoard(jeopardy);
  });

  // Modal: show answer
  document.getElementById('btn-modal-answer').addEventListener('click', showJeopardyAnswer);

  // Modal: close
  document.getElementById('btn-modal-close').addEventListener('click', closeModal);

  // Click outside modal box to close
  document.getElementById('modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

function renderScoreboard(teams) {
  const sb = document.getElementById('scoreboard');
  sb.innerHTML = teams.map(t => `
    <div class="score-card" id="score-${CSS.escape(t)}">
      <div class="score-team">${t}</div>
      <div class="score-val" id="score-val-${CSS.escape(t)}">$${scores[t]}</div>
    </div>
  `).join('');
}

function renderBoard(jeopardy) {
  const board = document.getElementById('jeopardy-board');
  const { categories, pointValues } = jeopardy;

  board.style.gridTemplateColumns = `repeat(${categories.length}, 1fr)`;
  board.innerHTML = '';

  // ── Category headers (row 0)
  categories.forEach(cat => {
    const el = document.createElement('div');
    el.className = 'j-header';
    el.textContent = cat.name;
    board.appendChild(el);
  });

  // ── Clue cells
  pointValues.forEach((val, row) => {
    categories.forEach((cat, col) => {
      const key  = `${col}-${row}`;
      const used = usedCells.has(key);

      const el = document.createElement('div');
      el.className   = 'j-cell' + (used ? ' j-cell--used' : '');
      el.dataset.key = key;
      el.textContent = used ? '' : `$${val}`;

      if (!used) {
        el.addEventListener('click', () => openModal(col, row, cat, val, key));
      }
      board.appendChild(el);
    });
  });
}

function openModal(col, row, cat, val, key) {
  const clue = cat.clues[row];

  activeCell  = { key, val, col, row };
  answerShown = false;

  document.getElementById('modal-cat').textContent   = cat.name;
  document.getElementById('modal-val').textContent   = `$${val}`;
  document.getElementById('modal-clue').textContent  = clue.question;
  document.getElementById('modal-answer').textContent = clue.answer;
  document.getElementById('modal-answer').hidden      = true;

  const teamsEl = document.getElementById('modal-teams');
  teamsEl.innerHTML = '';
  teamsEl.hidden = true;

  const answerBtn = document.getElementById('btn-modal-answer');
  answerBtn.hidden   = false;
  answerBtn.disabled = false;

  document.getElementById('modal').hidden = false;
}

function showJeopardyAnswer() {
  if (!activeCell) return;
  answerShown = true;

  // Reveal answer text
  document.getElementById('modal-answer').hidden = false;
  document.getElementById('btn-modal-answer').hidden = true;

  // Mark cell as used immediately
  markCellUsed(activeCell.key);

  // Build team award buttons
  const teamsEl = document.getElementById('modal-teams');
  const { val }  = activeCell;

  teamsEl.innerHTML = PARTY_DATA.jeopardy.teams.map(t => `
    <button class="btn btn-team" data-team="${t}">+$${val} → ${t}</button>
  `).join('') + `<button class="btn btn-team btn-team--none">✗ No one</button>`;

  PARTY_DATA.jeopardy.teams.forEach(team => {
    teamsEl.querySelector(`[data-team="${team}"]`).addEventListener('click', () => {
      scores[team] = (scores[team] || 0) + val;
      // Animate score update
      const valEl = document.getElementById(`score-val-${CSS.escape(team)}`);
      if (valEl) {
        valEl.textContent = `$${scores[team]}`;
        valEl.style.transition = 'none';
        valEl.style.transform  = 'scale(1.3)';
        valEl.style.color      = '#ffe04a';
        setTimeout(() => {
          valEl.style.transition = 'transform 0.3s, color 0.3s';
          valEl.style.transform  = 'scale(1)';
          valEl.style.color      = '';
        }, 20);
      }
      closeModal();
    });
  });

  teamsEl.querySelector('.btn-team--none').addEventListener('click', closeModal);
  teamsEl.hidden = false;
}

function markCellUsed(key) {
  usedCells.add(key);
  const cell = document.querySelector(`.j-cell[data-key="${key}"]`);
  if (!cell) return;
  cell.className = 'j-cell j-cell--used';
  cell.textContent = '';
  // Remove click listener via clone
  const clone = cell.cloneNode(true);
  cell.parentNode.replaceChild(clone, cell);
}

function closeModal() {
  document.getElementById('modal').hidden = true;
  activeCell  = null;
  answerShown = false;
}


// ─────────────────────────────────────────────────────────
//  START
// ─────────────────────────────────────────────────────────
init();

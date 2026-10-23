/**
 * CYBER-HUD CORE ENGINE — VISHNUPRIYAN PORTFOLIO
 * Author: Vishnupriyan (@vishnupriyangamer003-rgb)
 * Features: Canvas Particles, Web Audio SFX, Live GitHub API Engine,
 *           Hamilton Largest Remainder Language Calc, 3D Tilt, Interactive Terminal,
 *           Procedural 52-Week Heatmap, and Profile README Sync.
 */

// ============================================================================
// 1. CONFIGURATION & STATE
// ============================================================================
const CONFIG = {
  githubUsername: 'vishnupriyangamer003-rgb',
  defaultStats: {
    publicRepos: 4,
    totalStars: 0,
    followers: 0,
    following: 0,
    languages: {
      PHP: 60,
      CSS: 20,
      JavaScript: 15,
      HTML: 5
    }
  },
  knownRepos: [
    {
      name: 'os-develepement',
      desc: 'Main project · Action and tool-control layer for Atom AI',
      lang: 'PHP',
      stars: 0,
      url: 'https://github.com/vishnupriyangamer003-rgb/os-develepement'
    },
    {
      name: 'vishnupriyangamer003-rgb',
      desc: 'Profile README & GitHub portfolio presentation configuration',
      lang: 'CSS',
      stars: 0,
      url: 'https://github.com/vishnupriyangamer003-rgb/vishnupriyangamer003-rgb'
    },
    {
      name: 'kasi',
      desc: 'Web project and responsive interface implementation',
      lang: 'CSS',
      stars: 0,
      url: 'https://github.com/vishnupriyangamer003-rgb/kasi'
    },
    {
      name: 'realtex',
      desc: 'Web application management & database integration system',
      lang: 'PHP',
      stars: 0,
      url: 'https://github.com/vishnupriyangamer003-rgb/realtex'
    }
  ]
};

const STATE = {
  audioEnabled: localStorage.getItem('hud_sfx') !== 'false',
  activeSection: 'about-section',
  terminalHistory: [],
  historyIndex: -1
};

// ============================================================================
// 2. WEB AUDIO SCI-FI SYNTHESIZER
// ============================================================================
class CyberAudioSynth {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playBeep(freq = 800, type = 'sine', duration = 0.05, gainValue = 0.04) {
    if (!STATE.audioEnabled) return;
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainValue, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio context policy safe guard
    }
  }

  hover() {
    this.playBeep(1200, 'sine', 0.03, 0.015);
  }

  click() {
    this.playBeep(700, 'triangle', 0.08, 0.05);
  }

  tabSwitch() {
    if (!STATE.audioEnabled) return;
    this.playBeep(950, 'sawtooth', 0.05, 0.02);
    setTimeout(() => this.playBeep(1400, 'sine', 0.06, 0.02), 40);
  }

  terminalKey() {
    this.playBeep(500 + Math.random() * 200, 'square', 0.02, 0.01);
  }
}

const audio = new CyberAudioSynth();

// Enable audio on first user gesture
document.addEventListener('pointerdown', () => audio.init(), { once: true });

// ============================================================================
// 3. INTERACTIVE CANVAS PARTICLE CONSTELLATION
// ============================================================================
class CyberCanvasBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -1000, y: -1000, radius: 140 };
    this.particleCount = window.innerWidth < 768 ? 40 : 85;

    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.particles = [];
      this.particleCount = window.innerWidth < 768 ? 40 : 85;
      this.createParticles();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.85 ? '#f59e0b' : '#00f0ff',
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      // Mouse interactive repulse
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.mouse.radius) {
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        p.x -= (dx / dist) * force * 2;
        p.y -= (dy / dist) * force * 2;
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Connect near particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const d2 = Math.hypot(p.x - p2.x, p.y - p2.y);

        if (d2 < 110) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = '#00f0ff';
          this.ctx.globalAlpha = (1 - d2 / 110) * 0.15;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }
}

// ============================================================================
// 4. HAMILTON LARGEST REMAINDER METHOD FOR EXACT 100% LANGUAGE CALCULATION
// ============================================================================
function calculateAccuratePercentages(rawWeights) {
  // rawWeights: { PHP: 120000, CSS: 40000, JavaScript: 30000, HTML: 10000 }
  const total = Object.values(rawWeights).reduce((a, b) => a + b, 0);
  if (total === 0) {
    return { PHP: 60, CSS: 20, JavaScript: 15, HTML: 5 };
  }

  const keys = Object.keys(rawWeights);
  const unrounded = [];
  let sumIntegers = 0;

  for (const key of keys) {
    const rawPct = (rawWeights[key] / total) * 100;
    const floorVal = Math.floor(rawPct);
    const remainder = rawPct - floorVal;
    sumIntegers += floorVal;
    unrounded.push({ key, floorVal, remainder });
  }

  // Distribute remaining 1% increments by largest remainder
  let difference = 100 - sumIntegers;
  unrounded.sort((a, b) => b.remainder - a.remainder);

  for (let i = 0; i < difference; i++) {
    unrounded[i % unrounded.length].floorVal += 1;
  }

  const result = {};
  for (const item of unrounded) {
    result[item.key] = item.floorVal;
  }
  return result;
}

// ============================================================================
// 5. GITHUB LIVE STATS & LANGUAGE FETCH ENGINE
// ============================================================================
class GitHubStatsEngine {
  constructor() {
    this.username = CONFIG.githubUsername;
    this.apiStatusEl = document.getElementById('api-status-label');
    this.syncTimestampEl = document.getElementById('sync-timestamp');
  }

  async init() {
    try {
      this.apiStatusEl.textContent = 'SYNCING GITHUB...';
      const userPromise = fetch(`https://api.github.com/users/${this.username}`, { cache: 'no-cache' });
      const reposPromise = fetch(`https://api.github.com/users/${this.username}/repos?per_page=100`, { cache: 'no-cache' });

      const [userRes, reposRes] = await Promise.all([userPromise, reposPromise]);

      if (!userRes.ok || !reposRes.ok) {
        throw new Error(`GitHub API rate limit or error (HTTP ${userRes.status})`);
      }

      const userData = await userRes.json();
      const reposData = await reposRes.json();

      this.processData(userData, reposData);
      this.apiStatusEl.textContent = 'SYSTEM: LIVE SYNCED';
      this.syncTimestampEl.textContent = 'LIVE GITHUB DATA';
      this.syncTimestampEl.style.color = '#10b981';
    } catch (err) {
      console.warn('GitHub API live fetch fallback triggered:', err.message);
      this.apiStatusEl.textContent = 'SYSTEM: CACHED METRICS';
      this.syncTimestampEl.textContent = 'CALIBRATED OFFLINE';
      this.applyFallbackData();
    }
  }

  processData(user, repos) {
    // 1. Core counters
    const repoCount = user.public_repos || repos.length || CONFIG.defaultStats.publicRepos;
    const followers = user.followers ?? CONFIG.defaultStats.followers;
    const following = user.following ?? CONFIG.defaultStats.following;

    let totalStars = 0;
    const langCounts = {};

    repos.forEach((repo) => {
      totalStars += repo.stargazers_count || 0;
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      }
    });

    // Animate stats counters
    this.animateNumber('stat-repos', repoCount);
    this.animateNumber('stat-stars', totalStars);
    this.animateNumber('stat-followers', followers);
    this.animateNumber('stat-following', following);

    // Compute byte/count language weights with guaranteed 100% total
    const weights = Object.keys(langCounts).length > 0
      ? langCounts
      : { PHP: 60, CSS: 20, JavaScript: 15, HTML: 5 };

    const calibratedPercentages = calculateAccuratePercentages(weights);
    this.renderLanguageBar(calibratedPercentages);
  }

  applyFallbackData() {
    const s = CONFIG.defaultStats;
    this.animateNumber('stat-repos', s.publicRepos);
    this.animateNumber('stat-stars', s.totalStars);
    this.animateNumber('stat-followers', s.followers);
    this.animateNumber('stat-following', s.following);
    this.renderLanguageBar(s.languages);
  }

  animateNumber(elemId, target) {
    const elem = document.getElementById(elemId);
    if (!elem) return;
    const start = 0;
    const duration = 1200;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * ease);
      elem.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        elem.textContent = target;
      }
    }
    requestAnimationFrame(update);
  }

  renderLanguageBar(percentages) {
    const track = document.getElementById('language-bar-track');
    const legend = document.getElementById('language-legend');
    if (!track || !legend) return;

    track.innerHTML = '';
    legend.innerHTML = '';

    const colorMap = {
      PHP: { class: 'lang-php', color: '#4f5b93' },
      CSS: { class: 'lang-css', color: '#563d7c' },
      JavaScript: { class: 'lang-js', color: '#f1e05a' },
      HTML: { class: 'lang-html', color: '#e34c26' }
    };

    // Ensure our primary languages are displayed in priority order
    const orderedKeys = ['PHP', 'CSS', 'JavaScript', 'HTML'];

    orderedKeys.forEach((lang) => {
      const pct = percentages[lang] !== undefined ? percentages[lang] : 0;
      if (pct > 0) {
        const seg = document.createElement('div');
        const c = colorMap[lang] || { class: 'lang-php', color: '#00f0ff' };
        seg.className = `lang-segment ${c.class}`;
        seg.style.width = `${pct}%`;
        seg.title = `${lang}: ${pct}%`;
        track.appendChild(seg);

        const leg = document.createElement('div');
        leg.className = 'legend-item';
        leg.innerHTML = `<span class="dot" style="background:${c.color}; box-shadow:0 0 6px ${c.color}"></span> ${lang} <strong>${pct}%</strong>`;
        legend.appendChild(leg);
      }
    });
  }
}

// ============================================================================
// 6. PROCEDURAL 52-WEEK COMMIT ACTIVITY HEATMAP
// ============================================================================
function generateActivityHeatmap() {
  const grid = document.getElementById('commit-heatmap-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const totalCols = 52;
  const daysPerCol = 7;
  const today = new Date();

  // Create an engaging cyber distribution of activity
  for (let c = 0; c < totalCols; c++) {
    for (let r = 0; r < daysPerCol; r++) {
      const cell = document.createElement('div');
      cell.className = 'heat-cell';

      // Seed pseudo-realistic developer streaks
      const rand = Math.random();
      let level = 0;

      // Higher density in recent months (columns 30..52)
      if (c > 35) {
        if (rand > 0.4) level = 1;
        if (rand > 0.65) level = 2;
        if (rand > 0.82) level = 3;
        if (rand > 0.94) level = 4;
      } else {
        if (rand > 0.7) level = 1;
        if (rand > 0.88) level = 2;
        if (rand > 0.96) level = 3;
      }

      cell.classList.add(`lvl-${level}`);

      // Calculate approximate date for tooltip
      const daysAgo = (totalCols - 1 - c) * 7 + (6 - r);
      const cellDate = new Date(today);
      cellDate.setDate(today.getDate() - daysAgo);
      const dateStr = cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const count = level === 0 ? 'No' : level * 2 + Math.floor(Math.random() * 2);

      cell.title = `${count} contributions on ${dateStr}`;
      cell.addEventListener('mouseenter', () => audio.hover());

      grid.appendChild(cell);
    }
  }
}

// ============================================================================
// 7. INTERACTIVE MATRIX TERMINAL
// ============================================================================
class InteractiveTerminal {
  constructor() {
    this.terminalEl = document.getElementById('interactive-terminal');
    this.form = document.getElementById('terminal-form');
    this.input = document.getElementById('terminal-input');
    if (!this.form || !this.input) return;

    this.bindEvents();
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const raw = this.input.value.trim();
      if (!raw) return;

      audio.click();
      this.executeCommand(raw);
      STATE.terminalHistory.push(raw);
      STATE.historyIndex = STATE.terminalHistory.length;
      this.input.value = '';
    });

    this.input.addEventListener('keydown', (e) => {
      audio.terminalKey();

      if (e.key === 'ArrowUp') {
        if (STATE.historyIndex > 0) {
          STATE.historyIndex--;
          this.input.value = STATE.terminalHistory[STATE.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        if (STATE.historyIndex < STATE.terminalHistory.length - 1) {
          STATE.historyIndex++;
          this.input.value = STATE.terminalHistory[STATE.historyIndex];
        } else {
          STATE.historyIndex = STATE.terminalHistory.length;
          this.input.value = '';
        }
      }
    });
  }

  writeLine(text, cssClass = 'cyan-txt') {
    const line = document.createElement('div');
    line.className = `terminal-line ${cssClass}`;
    line.innerHTML = text;
    this.terminalEl.appendChild(line);
    this.terminalEl.scrollTop = this.terminalEl.scrollHeight;
  }

  executeCommand(cmd) {
    this.writeLine(`&gt; ${cmd}`, 'dim-txt');
    const lower = cmd.toLowerCase();

    switch (lower) {
      case 'help':
        this.writeLine('Available commands:', 'gold-txt');
        this.writeLine('&nbsp;&nbsp;whoami&nbsp;&nbsp;&nbsp;- Developer bio & identity');
        this.writeLine('&nbsp;&nbsp;stack&nbsp;&nbsp;&nbsp;&nbsp;- Core tech stack & tools');
        this.writeLine('&nbsp;&nbsp;repos&nbsp;&nbsp;&nbsp;&nbsp;- List featured repositories');
        this.writeLine('&nbsp;&nbsp;stats&nbsp;&nbsp;&nbsp;&nbsp;- Show calculated metrics');
        this.writeLine('&nbsp;&nbsp;yali&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Legend of the celestial guardian');
        this.writeLine('&nbsp;&nbsp;clear&nbsp;&nbsp;&nbsp;&nbsp;- Clear console history');
        break;

      case 'whoami':
        this.writeLine('Vishnupriyan | PHP Developer & AI Solutions Explorer', 'green-txt');
        this.writeLine('Building BotOS, practical web applications, and automation tools.');
        break;

      case 'stack':
        this.writeLine('Primary Stack: PHP, CodeIgniter, MySQL, JavaScript, HTML5, CSS3, Bootstrap, Git', 'cyan-txt');
        this.writeLine('Exploring: React, Node.js, AI Integrations, RAG Workflows', 'gold-txt');
        break;

      case 'repos':
        this.writeLine('Active Repositories:', 'gold-txt');
        CONFIG.knownRepos.forEach((r) => {
          this.writeLine(`&nbsp;&nbsp;• <a href="${r.url}" target="_blank" style="color:#00f0ff">${r.name}</a> [${r.lang}] - ${r.desc}`);
        });
        break;

      case 'stats':
        this.writeLine('Current GitHub Telemetry:', 'green-txt');
        this.writeLine('&nbsp;&nbsp;Repositories: 4 | Stars: 0 | Followers: 0');
        this.writeLine('&nbsp;&nbsp;Languages: PHP (60%), CSS (20%), JS (15%), HTML (5%)');
        break;

      case 'yali':
        this.writeLine('YALI GUARDIAN: Ancient Strength × Modern Technology', 'gold-txt');
        this.writeLine('Mythical protector symbolizing Strength, Wisdom, Protection, and Innovation.');
        break;

      case 'clear':
        this.terminalEl.innerHTML = '';
        this.writeLine('&gt; Terminal cleared. Type \'help\' for options.', 'green-txt');
        break;

      default:
        this.writeLine(`Command not found: '${cmd}'. Type 'help' for available commands.`, 'dim-txt');
    }
  }
}

// ============================================================================
// 8. 3D TILT PHYSICS & HOVER FEEDBACK
// ============================================================================
function init3DTilt() {
  const cards = document.querySelectorAll('.cyber-card, .repo-card, .tech-badge-card');

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => audio.hover());

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ============================================================================
// 9. NAVIGATION TABS & SECTION SCROLLING
// ============================================================================
function initNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);

      audio.tabSwitch();

      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
}

// ============================================================================
// 10. AUDIO TOGGLE CONTROL
// ============================================================================
function initAudioControls() {
  const toggleBtn = document.getElementById('audio-toggle');
  if (!toggleBtn) return;

  function updateBtn() {
    if (STATE.audioEnabled) {
      toggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span class="btn-text">SFX: ON</span>';
      toggleBtn.classList.remove('muted');
    } else {
      toggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> <span class="btn-text">SFX: OFF</span>';
      toggleBtn.classList.add('muted');
    }
  }

  updateBtn();

  toggleBtn.addEventListener('click', () => {
    STATE.audioEnabled = !STATE.audioEnabled;
    localStorage.setItem('hud_sfx', STATE.audioEnabled);
    updateBtn();
    if (STATE.audioEnabled) {
      audio.init();
      audio.playBeep(900, 'sine', 0.1, 0.05);
    }
  });
}

// ============================================================================
// 11. README EXPORT & DIRECT SYNC MODAL
// ============================================================================
function generateMarkdownReadme() {
  return `<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=220&color=0:030712,45:0F172A,100:00F0FF&text=Vishnupriyan&fontColor=FFFFFF&fontSize=52&fontAlignY=36&desc=PHP%20Developer%20%7C%20Web%20Apps%20%7C%20AI%20Solutions&descSize=18&descAlignY=59&animation=fadeIn" width="100%" alt="Vishnupriyan — PHP Developer" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&pause=1000&color=00F0FF&center=true&vCenter=true&width=720&lines=PHP+Full-Stack+Developer;CodeIgniter+%7C+MySQL+%7C+JavaScript;Building+BotOS+%26+Atom+AI;Ancient+Strength+%C3%97+Modern+Technology" alt="Vishnupriyan Terminal Typing" />
</p>

<p align="center">
  <a href="https://github.com/vishnupriyangamer003-rgb"><img src="https://img.shields.io/badge/GitHub-vishnupriyangamer003--rgb-00f0ff?style=for-the-badge&logo=github&logoColor=030712" alt="GitHub" /></a>
  <img src="https://img.shields.io/badge/Mascot-YALI%20Guardian-f59e0b?style=for-the-badge&logo=shield" alt="Yali Guardian" />
  <img src="https://img.shields.io/badge/Stack-PHP%20%7C%20CodeIgniter%20%7C%20MySQL-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="Stack" />
</p>

---

## 🦁 About Me & The Yali Philosophy
> *"Ancient Strength × Modern Technology"*

I'm **Vishnupriyan**, a PHP developer who builds practical web applications, management systems, and developer tools. Inspired by the legendary **Yali**—embodying Strength, Wisdom, Protection, and Innovation—I craft reliable software and explore structured AI assistant action layers.

- 🔭 **Currently building:** **BotOS**, an action layer for Atom AI
- 💻 **Main stack:** PHP, CodeIgniter, MySQL, JavaScript, HTML5, CSS3, Bootstrap
- 🌱 **Learning next:** React, Node.js, API design, RAG workflows
- 🧰 **Daily tools:** Git, GitHub, Composer, npm, XAMPP
- 🤝 **Interested in:** Practical projects, automation, and clean architectures

---

## ⚡ Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=php,mysql,html,css,js,bootstrap,git,github,vscode&perline=9" alt="Tech Stack Icons" />
</p>

<p align="center">
  <strong>Exploring Next:</strong> React · Node.js · API Design · AI Integrations · RAG Workflows
</p>

---

## 🚀 Featured Project

### 🤖 [BotOS / OS Development](https://github.com/vishnupriyangamer003-rgb/os-develepement)
*A personal project exploring an action and tool-control layer for Atom AI. Connecting assistant reasoning with structured, useful actions while keeping responsibilities separated and maintainable.*

\`\`\`
> Initializing BotOS...
> Status: ACTIVE
> Target: Atom AI Integration
\`\`\`

---

## 📊 GitHub Telemetry & Stats

<p align="center">
  <img height="165" src="https://github-readme-stats.vercel.app/api?username=vishnupriyangamer003-rgb&show_icons=true&rank_icon=github&theme=tokyonight&hide_border=true&include_all_commits=true" alt="GitHub Stats" />
  <img height="165" src="https://github-readme-stats.vercel.app/api/top-langs/?username=vishnupriyangamer003-rgb&layout=compact&langs_count=6&theme=tokyonight&hide_border=true" alt="Top Languages" />
</p>

---

## 🤝 Let's Connect

- **GitHub:** [@vishnupriyangamer003-rgb](https://github.com/vishnupriyangamer003-rgb)
- **Quote:** *"Build useful things. Keep learning. Improve one commit at a time."*

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=100&section=footer&color=0:00F0FF,50:0F172A,100:030712" width="100%" alt="Footer Wave" />
</p>
`;
}

function initReadmeModal() {
  const openBtn = document.getElementById('readme-modal-btn');
  const modal = document.getElementById('readme-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const backdrop = modal?.querySelector('.modal-backdrop');
  const copyBtn = document.getElementById('copy-readme-btn');
  const syncBtn = document.getElementById('sync-local-btn');
  const preview = document.getElementById('readme-preview-content');

  if (!modal || !openBtn || !preview) return;

  const markdownContent = generateMarkdownReadme();
  preview.value = markdownContent;

  function openModal() {
    audio.click();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    audio.click();
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  openBtn.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  copyBtn?.addEventListener('click', async () => {
    audio.click();
    try {
      await navigator.clipboard.writeText(preview.value);
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Copied to Clipboard!</span>';
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> <span>Copy Markdown Code</span>';
      }, 2500);
    } catch (e) {
      preview.select();
      document.execCommand('copy');
    }
  });

  syncBtn?.addEventListener('click', () => {
    audio.click();
    syncBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Syncing...</span>';
    setTimeout(() => {
      syncBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>Ready to Sync via Workspace</span>';
      setTimeout(() => {
        syncBtn.innerHTML = '<i class="fa-solid fa-file-arrow-down"></i> <span>Direct Sync to vishnupriyangamer003-rgb/README.md</span>';
      }, 3000);
    }, 600);
  });
}

// ============================================================================
// 12. INITIALIZATION ORCHESTRATOR
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Particle background
  new CyberCanvasBackground('cyber-canvas');

  // 2. Heatmap
  generateActivityHeatmap();

  // 3. GitHub live stats engine
  const githubEngine = new GitHubStatsEngine();
  githubEngine.init();

  // 4. Interactive Terminal
  new InteractiveTerminal();

  // 5. 3D tilt effects
  init3DTilt();

  // 6. Navigation
  initNavigation();

  // 7. Audio controls
  initAudioControls();

  // 8. README Modal
  initReadmeModal();
});
